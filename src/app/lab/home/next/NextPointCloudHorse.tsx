"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

import { GALLOP_DURATION } from "@/components/horseSceneConstants";

const HORSE_GLB = "/models/Horse.glb";
const FIT_HEIGHT = 52;
const POINT_SIZE = 0.19;
const POINT_STRIDE = 1;

function computeAisleCenterOffset(mesh: THREE.Mesh): [number, number, number] {
  const influences = mesh.morphTargetInfluences;
  const saved = influences ? Array.from(influences) : null;
  if (influences) influences.fill(0);

  mesh.geometry.computeBoundingBox();
  const box = mesh.geometry.boundingBox;
  if (!box) {
    if (saved && influences) {
      saved.forEach((value, index) => {
        influences[index] = value;
      });
    }
    return [0, 0, 0];
  }

  const position = mesh.geometry.attributes.position;
  let sumX = 0;
  for (let i = 0; i < position.count; i += 1) {
    sumX += position.getX(i);
  }
  const centroidX = sumX / position.count;
  const center = box.getCenter(new THREE.Vector3());

  if (saved && influences) {
    saved.forEach((value, index) => {
      influences[index] = value;
    });
  }

  return [-centroidX, -center.y, -center.z];
}

function buildPointGeometry(source: THREE.BufferGeometry) {
  const positions = source.attributes.position;
  const reducedCount = Math.ceil(positions.count / POINT_STRIDE);
  const next = new THREE.BufferGeometry();
  const points = new Float32Array(reducedCount * 3);

  for (let i = 0, j = 0; i < positions.count; i += POINT_STRIDE, j += 3) {
    points[j] = positions.getX(i);
    points[j + 1] = positions.getY(i);
    points[j + 2] = positions.getZ(i);
  }

  next.setAttribute("position", new THREE.BufferAttribute(points, 3));
  if (source.morphAttributes.position) {
    next.morphAttributes.position = source.morphAttributes.position.map(
      (attribute) => {
        const morphed = new Float32Array(reducedCount * 3);
        for (let i = 0, j = 0; i < attribute.count; i += POINT_STRIDE, j += 3) {
          morphed[j] = attribute.getX(i);
          morphed[j + 1] = attribute.getY(i);
          morphed[j + 2] = attribute.getZ(i);
        }
        return new THREE.BufferAttribute(morphed, 3);
      },
    );
  }

  if (source.morphTargetsRelative) {
    next.morphTargetsRelative = source.morphTargetsRelative;
  }

  return next;
}

type HorseAsset = {
  mesh: THREE.Mesh;
  animations: THREE.AnimationClip[];
};

function findHorseMesh(root: THREE.Object3D): THREE.Mesh {
  let mesh: THREE.Mesh | null = null;
  root.traverse((child) => {
    if (!mesh && (child as THREE.Mesh).isMesh) {
      mesh = child as THREE.Mesh;
    }
  });
  if (!mesh) throw new Error("Horse.glb: no mesh found");
  return mesh;
}

export type NextPointCloudHorseProps = {
  scale?: number;
};

/** Galloping horse as bright white points — for dark corridor sandbox. */
export function NextPointCloudHorse({ scale = 1 }: NextPointCloudHorseProps) {
  const [asset, setAsset] = useState<HorseAsset | null>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const pointsRef = useRef<THREE.Points>(null);

  useEffect(() => {
    let cancelled = false;
    const loader = new GLTFLoader();
    loader.load(
      HORSE_GLB,
      (gltf) => {
        if (cancelled) return;
        const root = gltf.scene.clone(true);
        const horse = findHorseMesh(root);
        setAsset({ mesh: horse, animations: gltf.animations });
      },
      undefined,
      (error) => console.error("Horse.glb failed to load", error),
    );
    return () => {
      cancelled = true;
    };
  }, []);

  const mesh = asset?.mesh;
  const animations = asset?.animations ?? [];

  const centerOffset = useMemo(() => {
    if (!mesh) return [0, 0, 0] as const;
    return computeAisleCenterOffset(mesh);
  }, [mesh]);

  const fitScale = useMemo(() => {
    if (!mesh) return 1;
    mesh.geometry.computeBoundingBox();
    const box = mesh.geometry.boundingBox;
    if (!box) return 1;
    const size = box.getSize(new THREE.Vector3());
    return FIT_HEIGHT / Math.max(size.y, 1);
  }, [mesh]);

  const pointGeometry = useMemo(() => {
    if (!mesh) return null;
    return buildPointGeometry(mesh.geometry);
  }, [mesh]);

  useEffect(() => {
    if (!mesh) return;

    mesh.visible = false;
    mesh.frustumCulled = false;

    const mixer = new THREE.AnimationMixer(mesh);
    const clip = animations[0];
    if (!clip) {
      console.warn("Horse.glb: no animations found");
      return;
    }

    const action = mixer.clipAction(clip);
    action.setLoop(THREE.LoopRepeat, Infinity);
    action.setDuration(GALLOP_DURATION);
    action.play();
    mixerRef.current = mixer;

    return () => {
      action.stop();
      mixer.stopAllAction();
      mixerRef.current = null;
    };
  }, [animations, mesh]);

  useFrame((_, delta) => {
    mixerRef.current?.update(delta);
    if (!mesh) return;
    const points = pointsRef.current;
    if (!points || !mesh.morphTargetInfluences) return;
    points.morphTargetInfluences = mesh.morphTargetInfluences;
  }, -1);

  if (!mesh || !pointGeometry) return null;

  return (
    <group scale={fitScale * scale}>
      <group position={centerOffset}>
        <primitive object={mesh} />
        <points
          ref={pointsRef}
          geometry={pointGeometry}
          morphTargetDictionary={mesh.morphTargetDictionary}
          morphTargetInfluences={mesh.morphTargetInfluences}
          frustumCulled={false}
          renderOrder={8}
        >
          <pointsMaterial
            size={POINT_SIZE}
            color="#ffffff"
            sizeAttenuation
            transparent
            opacity={0.96}
            depthWrite={false}
            toneMapped={false}
          />
        </points>
      </group>
    </group>
  );
}
