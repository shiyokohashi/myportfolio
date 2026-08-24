"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

import { GALLOP_DURATION } from "@/components/horseSceneConstants";

const HOOF_COUNT = 4;
const MAX_DROPLETS = 40;
const DROPLET_LIFE = 1.25;
const DROPLETS_PER_STRIKE = 7;

type HoofProbe = {
  indices: number[];
  prevY: number;
  velY: number;
  grounded: boolean;
  coolDown: number;
};

type Droplet = {
  active: boolean;
  age: number;
  life: number;
  mesh: THREE.Mesh;
  shadow: THREE.Mesh;
  velocity: THREE.Vector3;
  baseScale: THREE.Vector3;
};

function pickHoofIndices(geometry: THREE.BufferGeometry): number[][] {
  const position = geometry.attributes.position;
  if (!position) return [[], [], [], []];

  const verts: { i: number; x: number; y: number; z: number }[] = [];
  for (let i = 0; i < position.count; i += 1) {
    verts.push({
      i,
      x: position.getX(i),
      y: position.getY(i),
      z: position.getZ(i),
    });
  }
  verts.sort((a, b) => a.y - b.y);

  const candidateCount = Math.max(48, Math.floor(position.count * 0.14));
  const low = verts.slice(0, candidateCount);
  if (!low.length) return [[], [], [], []];

  const midZ = low.reduce((sum, v) => sum + v.z, 0) / low.length;
  const front = low.filter((v) => v.z >= midZ);
  const rear = low.filter((v) => v.z < midZ);

  const splitLR = (list: typeof low) => {
    if (!list.length) return [[], []] as const;
    const midX = list.reduce((sum, v) => sum + v.x, 0) / list.length;
    const left = list
      .filter((v) => v.x < midX)
      .sort((a, b) => a.y - b.y);
    const right = list
      .filter((v) => v.x >= midX)
      .sort((a, b) => a.y - b.y);
    return [left, right] as const;
  };

  const [frontLeft, frontRight] = splitLR(front);
  const [rearLeft, rearRight] = splitLR(rear);

  return [frontLeft, frontRight, rearLeft, rearRight].map((list) =>
    list.slice(0, 10).map((entry) => entry.i),
  );
}

function sampleHoofY(
  geometry: THREE.BufferGeometry,
  indices: number[],
  influences: number[] | null | undefined,
): number {
  const position = geometry.attributes.position as THREE.BufferAttribute;
  const morphs = geometry.morphAttributes.position as
    | THREE.BufferAttribute[]
    | undefined;
  if (!indices.length) return 0;

  let sum = 0;
  for (const index of indices) {
    let y = position.getY(index);
    if (morphs && influences) {
      for (let m = 0; m < morphs.length; m += 1) {
        const w = influences[m] ?? 0;
        if (Math.abs(w) < 1e-6) continue;
        y += morphs[m].getY(index) * w;
      }
    }
    sum += y;
  }
  return sum / indices.length;
}

function sampleHoofXZ(
  geometry: THREE.BufferGeometry,
  indices: number[],
  influences: number[] | null | undefined,
): { x: number; z: number } {
  const position = geometry.attributes.position as THREE.BufferAttribute;
  const morphs = geometry.morphAttributes.position as
    | THREE.BufferAttribute[]
    | undefined;
  let sx = 0;
  let sz = 0;
  for (const index of indices) {
    let x = position.getX(index);
    let z = position.getZ(index);
    if (morphs && influences) {
      for (let m = 0; m < morphs.length; m += 1) {
        const w = influences[m] ?? 0;
        if (Math.abs(w) < 1e-6) continue;
        x += morphs[m].getX(index) * w;
        z += morphs[m].getZ(index) * w;
      }
    }
    sx += x;
    sz += z;
  }
  const n = indices.length || 1;
  return { x: sx / n, z: sz / n };
}

function createGlassMaterial() {
  return new THREE.MeshPhysicalMaterial({
    color: "#ffffff",
    transmission: 1,
    thickness: 2.2,
    ior: 1.5,
    roughness: 0.02,
    metalness: 0,
    clearcoat: 1,
    clearcoatRoughness: 0.04,
    attenuationColor: new THREE.Color("#d8dee8"),
    attenuationDistance: 2.8,
    specularIntensity: 1,
    envMapIntensity: 1.35,
    transparent: true,
    opacity: 1,
    depthWrite: false,
    toneMapped: true,
  });
}

function createShadowMaterial() {
  return new THREE.MeshBasicMaterial({
    color: "#6a6e76",
    transparent: true,
    opacity: 0,
    depthWrite: false,
    toneMapped: false,
  });
}

type HorseHoofSplashesProps = {
  mesh: THREE.Mesh;
};

/**
 * Clear crystal droplets on hoof strike — small, scattered, drifting behind
 * the gallop (+Z forward → velocity biased toward −Z). Soft blob shadows
 * keep them readable on the white void.
 */
export function HorseHoofSplashes({ mesh }: HorseHoofSplashesProps) {
  const sphereGeo = useMemo(() => new THREE.SphereGeometry(1, 24, 18), []);
  const shadowGeo = useMemo(() => new THREE.CircleGeometry(1, 24), []);
  const glassMat = useMemo(() => createGlassMaterial(), []);
  const shadowMat = useMemo(() => createShadowMaterial(), []);

  const probes = useMemo(() => {
    const indices = pickHoofIndices(mesh.geometry);
    return indices.map(
      (list): HoofProbe => ({
        indices: list,
        prevY: Number.POSITIVE_INFINITY,
        velY: 0,
        grounded: false,
        coolDown: 0,
      }),
    );
  }, [mesh]);

  const droplets = useMemo(() => {
    const list: Droplet[] = [];
    for (let i = 0; i < MAX_DROPLETS; i += 1) {
      const dropletMesh = new THREE.Mesh(sphereGeo, glassMat.clone());
      dropletMesh.visible = false;
      dropletMesh.frustumCulled = false;
      dropletMesh.renderOrder = 5;

      const shadow = new THREE.Mesh(shadowGeo, shadowMat.clone());
      shadow.rotation.x = -Math.PI / 2;
      shadow.visible = false;
      shadow.frustumCulled = false;
      shadow.renderOrder = 4;

      list.push({
        active: false,
        age: 0,
        life: DROPLET_LIFE,
        mesh: dropletMesh,
        shadow,
        velocity: new THREE.Vector3(),
        baseScale: new THREE.Vector3(1, 1, 1),
      });
    }
    return list;
  }, [sphereGeo, shadowGeo, glassMat, shadowMat]);

  const groundYRef = useRef<number | null>(null);
  const cursor = useRef(0);

  const spawnStrike = (x: number, y: number, z: number) => {
    for (let s = 0; s < DROPLETS_PER_STRIKE; s += 1) {
      const droplet = droplets[cursor.current % MAX_DROPLETS];
      cursor.current += 1;

      droplet.active = true;
      droplet.age = 0;
      droplet.life = DROPLET_LIFE * (0.8 + Math.random() * 0.35);

      // One elongated splash trail + smaller scattered beads
      const isTrail = s === 0;
      const radius = isTrail
        ? 1.35 + Math.random() * 0.55
        : 0.55 + Math.random() * 1.05;
      const stretchY = isTrail ? 2.85 + Math.random() * 1.15 : 1;

      droplet.baseScale.set(radius, radius * stretchY, radius);
      droplet.mesh.scale.copy(droplet.baseScale);
      droplet.mesh.visible = true;
      droplet.mesh.position.set(
        x + (Math.random() - 0.5) * 5.5,
        y + radius * stretchY * 0.45 + Math.random() * 2.2,
        z - Math.random() * 4 - (isTrail ? 1.5 : 0),
      );
      droplet.mesh.rotation.set(
        (Math.random() - 0.5) * 0.45,
        Math.random() * Math.PI,
        (Math.random() - 0.5) * 0.55,
      );

      const mat = droplet.mesh.material as THREE.MeshPhysicalMaterial;
      mat.opacity = 1;

      droplet.shadow.visible = true;
      droplet.shadow.position.set(
        droplet.mesh.position.x,
        y + 0.12,
        droplet.mesh.position.z,
      );
      droplet.shadow.scale.setScalar(radius * 1.15);
      (droplet.shadow.material as THREE.MeshBasicMaterial).opacity = 0.28;

      const side = (Math.random() - 0.5) * (isTrail ? 6 : 16);
      const up = isTrail ? 24 + Math.random() * 14 : 4 + Math.random() * 16;
      // Fall behind the horse (run direction is +Z).
      const back = -(28 + Math.random() * 42);
      droplet.velocity.set(side, up, back);
    }
  };

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const influences = mesh.morphTargetInfluences;
    const geometry = mesh.geometry;

    let minHoof = Number.POSITIVE_INFINITY;
    for (let h = 0; h < HOOF_COUNT; h += 1) {
      const probe = probes[h];
      if (!probe.indices.length) continue;
      minHoof = Math.min(
        minHoof,
        sampleHoofY(geometry, probe.indices, influences),
      );
    }
    if (groundYRef.current === null && Number.isFinite(minHoof)) {
      groundYRef.current = minHoof;
    } else if (groundYRef.current !== null && Number.isFinite(minHoof)) {
      groundYRef.current = THREE.MathUtils.lerp(
        groundYRef.current,
        Math.min(groundYRef.current, minHoof),
        0.08,
      );
    }
    const groundY = groundYRef.current ?? minHoof;

    for (let h = 0; h < HOOF_COUNT; h += 1) {
      const probe = probes[h];
      if (!probe.indices.length) continue;

      probe.coolDown = Math.max(0, probe.coolDown - dt);
      const y = sampleHoofY(geometry, probe.indices, influences);
      if (!Number.isFinite(probe.prevY) || probe.prevY > 1e8) {
        probe.prevY = y;
        probe.velY = 0;
        continue;
      }
      const vel = (y - probe.prevY) / Math.max(dt, 1e-4);

      const nearGround = y <= groundY + 6;
      const striking =
        nearGround &&
        probe.velY < -8 &&
        vel > probe.velY &&
        vel > -4 &&
        !probe.grounded &&
        probe.coolDown <= 0;

      if (striking) {
        const { x, z } = sampleHoofXZ(geometry, probe.indices, influences);
        spawnStrike(x, groundY, z);
        probe.coolDown = GALLOP_DURATION * 0.45;
        probe.grounded = true;
      }

      if (!nearGround || (vel > 12 && y > groundY + 10)) {
        probe.grounded = false;
      }

      probe.prevY = y;
      probe.velY = vel;
    }

    for (const droplet of droplets) {
      if (!droplet.active) continue;
      droplet.age += dt;
      const t = droplet.age / droplet.life;

      if (t >= 1) {
        droplet.active = false;
        droplet.mesh.visible = false;
        droplet.shadow.visible = false;
        continue;
      }

      const { mesh: m, velocity: v, shadow } = droplet;
      v.y -= 100 * dt;
      v.x *= 1 - 1.2 * dt;
      v.z *= 1 - 0.28 * dt;
      m.position.x += v.x * dt;
      m.position.y += v.y * dt;
      m.position.z += v.z * dt;

      if (m.position.y < groundY + droplet.baseScale.y * 0.35) {
        m.position.y = groundY + droplet.baseScale.y * 0.35;
        v.y *= -0.16;
        v.x *= 0.7;
        v.z *= 0.7;
      }

      const fade = t < 0.5 ? 1 : 1 - (t - 0.5) / 0.5;
      const settle = 1 - t * 0.1;
      m.scale.set(
        droplet.baseScale.x * settle,
        droplet.baseScale.y * settle,
        droplet.baseScale.z * settle,
      );
      (m.material as THREE.MeshPhysicalMaterial).opacity = Math.max(fade, 0.08);

      const height = Math.max(m.position.y - groundY, 0.2);
      const shadowScale = droplet.baseScale.x * (1.05 + height * 0.04);
      shadow.position.set(m.position.x, groundY + 0.1, m.position.z);
      shadow.scale.setScalar(shadowScale);
      (shadow.material as THREE.MeshBasicMaterial).opacity =
        0.26 * fade * THREE.MathUtils.clamp(1.4 - height * 0.045, 0.3, 1);

      m.rotation.x += dt * 0.6;
      m.rotation.z -= dt * 0.35;
    }
  }, 1);

  return (
    <group>
      {droplets.map((droplet, i) => (
        <group key={`drop-${i}`}>
          <primitive object={droplet.shadow} />
          <primitive object={droplet.mesh} />
        </group>
      ))}
    </group>
  );
}
