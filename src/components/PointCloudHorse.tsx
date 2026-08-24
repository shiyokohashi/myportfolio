"use client";

import { useFrame } from "@react-three/fiber";
import { MeshTransmissionMaterial } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

import { GALLOP_DURATION } from "@/components/horseSceneConstants";
import { HorseHoofSplashes } from "@/components/HorseHoofSplashes";

const HORSE_GLB = "/models/Horse.glb";
const FIT_HEIGHT = 52;

function computeAisleCenterOffset(mesh: THREE.Mesh): [number, number, number] {
  const influences = mesh.morphTargetInfluences;
  const saved = influences ? Array.from(influences) : null;
  if (influences) influences.fill(0);

  mesh.geometry.computeBoundingBox();
  const box = mesh.geometry.boundingBox;
  if (!box) {
    if (saved && influences) saved.forEach((value, index) => {
      influences[index] = value;
    });
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

export type PointCloudHorseProps = {
  /** Multiplier applied after auto-fit-to-FIT_HEIGHT scaling. */
  scale?: number;
};

/**
 * Animated galloping horse as refractive glass — same morph-target run,
 * translucent with scene warping through the body.
 */
export function PointCloudHorse({ scale = 1 }: PointCloudHorseProps) {
  const [asset, setAsset] = useState<HorseAsset | null>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);

  useEffect(() => {
    let cancelled = false;
    const loader = new GLTFLoader();
    loader.load(
      HORSE_GLB,
      (gltf) => {
        if (cancelled) return;
        const root = gltf.scene.clone(true);
        const horse = findHorseMesh(root);
        horse.castShadow = false;
        horse.receiveShadow = false;
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

  useEffect(() => {
    if (!mesh) return;

    // Bind the mixer to the same mesh instance that is rendered + splash-sampled.
    mesh.frustumCulled = false;
    mesh.renderOrder = 2;
    mesh.castShadow = false;
    mesh.receiveShadow = false;

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
  }, -1);

  if (!mesh) return null;

  return (
    <group scale={fitScale * scale}>
      <group position={centerOffset}>
        <primitive object={mesh}>
          <MeshTransmissionMaterial
            backside
            backsideThickness={0.28}
            thickness={0.62}
            roughness={0.045}
            transmission={1}
            ior={1.45}
            chromaticAberration={0.01}
            anisotropicBlur={0.035}
            distortion={0.05}
            distortionScale={0.18}
            temporalDistortion={0.008}
            color="#ffffff"
            attenuationColor="#efefef"
            attenuationDistance={5.2}
            clearcoat={0.48}
            clearcoatRoughness={0.16}
            specularIntensity={0.88}
            specularColor="#ffffff"
            envMapIntensity={0.12}
            samples={8}
            resolution={768}
            toneMapped={false}
          />
        </primitive>
        <HorseHoofSplashes mesh={mesh} />
      </group>
    </group>
  );
}
