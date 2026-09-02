"use client";

import { Text, useTexture } from "@react-three/drei";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import { useDomeGallery } from "@/app/lab/home/next/DomeGalleryProvider";
import {
  computeDefaultDomeScreenPatch,
  createCurvedDomeScreenGeometry,
  DOME_WALL_RADIUS,
  labelPointOnDome,
  type DomeProject,
  type DomeScreenPatch,
} from "@/app/lab/home/next/domeGalleryState";

const CLICK_DRAG_PX = 6;
const CLICK_MIN_OPACITY = 0.45;

/** Curved inner-dome screen — fixed to the wall, viewer orbits inside the volume. */
export function DomeProjectPanels() {
  const router = useRouter();
  const { projects, activeIndexRef, panelOpacityRef } = useDomeGallery();
  const { viewport } = useThree();

  const urls = useMemo(
    () => [...new Set(projects.map((project) => project.src))],
    [projects],
  );

  const patch = useMemo(
    () => computeDefaultDomeScreenPatch(viewport.aspect),
    [viewport.aspect],
  );

  const geometry = useMemo(
    () => createCurvedDomeScreenGeometry(DOME_WALL_RADIUS, patch),
    [patch],
  );

  useEffect(() => () => geometry.dispose(), [geometry]);

  if (projects.length === 0 || urls.length === 0) return null;

  return (
    <DomeActivePanel
      urls={urls}
      projects={projects}
      activeIndexRef={activeIndexRef}
      panelOpacityRef={panelOpacityRef}
      patch={patch}
      geometry={geometry}
      onOpen={(href) => router.push(href)}
    />
  );
}

function DomeActivePanel({
  urls,
  projects,
  activeIndexRef,
  panelOpacityRef,
  patch,
  geometry,
  onOpen,
}: {
  urls: string[];
  projects: DomeProject[];
  activeIndexRef: React.RefObject<number>;
  panelOpacityRef: React.RefObject<number>;
  patch: DomeScreenPatch;
  geometry: THREE.SphereGeometry;
  onOpen: (href: string) => void;
}) {
  const { camera } = useThree();

  const loaded = useTexture(urls);
  const textures = Array.isArray(loaded) ? loaded : [loaded];

  const texturesBySrc = useMemo(() => {
    const map = new Map<string, THREE.Texture>();
    urls.forEach((url, index) => {
      const texture = textures[index];
      if (!texture) return;
      texture.colorSpace = THREE.SRGBColorSpace;
      map.set(url, texture);
    });
    return map;
  }, [textures, urls]);

  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial | null>(null);
  const titleRef = useRef<THREE.Object3D>(null);
  const subtitleRef = useRef<THREE.Object3D>(null);
  const pointerDown = useRef<{ x: number; y: number } | null>(null);
  const activeProjectRef = useRef(projects[activeIndexRef.current ?? 0] ?? null);
  const cameraWorld = useMemo(() => new THREE.Vector3(), []);
  const titlePos = useMemo(() => new THREE.Vector3(), []);
  const subtitlePos = useMemo(() => new THREE.Vector3(), []);

  const initialProject = projects[activeIndexRef.current ?? 0] ?? projects[0];
  const initialTexture = initialProject
    ? texturesBySrc.get(initialProject.src)
    : null;

  const material = useMemo(() => {
    if (!initialTexture) return null;
    return new THREE.MeshBasicMaterial({
      map: initialTexture,
      transparent: true,
      opacity: 1,
      depthWrite: false,
      depthTest: true,
      fog: false,
      side: THREE.BackSide,
      toneMapped: false,
    });
  }, [initialTexture]);

  useEffect(() => {
    materialRef.current = material;
    return () => material?.dispose();
  }, [material]);

  const openProject = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    const start = pointerDown.current;
    pointerDown.current = null;
    const project = activeProjectRef.current;
    if (!project?.href || !start) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.hypot(dx, dy) > CLICK_DRAG_PX) return;
    if ((materialRef.current?.opacity ?? 0) < CLICK_MIN_OPACITY) return;
    onOpen(project.href);
  };

  useFrame(() => {
    const mesh = meshRef.current;
    const mat = materialRef.current;
    if (!mesh || !mat) return;

    const index = activeIndexRef.current ?? 0;
    const project = projects[index];
    if (!project) return;

    if (activeProjectRef.current?.id !== project.id) {
      activeProjectRef.current = project;
      const texture = texturesBySrc.get(project.src);
      if (texture) {
        mat.map = texture;
        mat.needsUpdate = true;
      }
      const titleMesh = titleRef.current as (THREE.Object3D & { text?: string }) | null;
      const subtitleMesh = subtitleRef.current as
        | (THREE.Object3D & { text?: string })
        | null;
      if (titleMesh) titleMesh.text = project.title;
      if (subtitleMesh) subtitleMesh.text = project.subtitle;
    }

    const opacity = panelOpacityRef.current ?? 1;
    mesh.visible = opacity > 0.008;
    mat.opacity = opacity;

    camera.getWorldPosition(cameraWorld);

    const labelOpacity = opacity * 0.9;
    const title = titleRef.current;
    const subtitle = subtitleRef.current;

    if (title) {
      labelPointOnDome(patch, DOME_WALL_RADIUS - 0.4, 0.34, titlePos);
      title.position.copy(titlePos);
      title.lookAt(cameraWorld);
      title.visible = labelOpacity > 0.04;
      const titleMat = (title as THREE.Mesh).material as THREE.Material | undefined;
      if (titleMat) {
        titleMat.transparent = true;
        titleMat.opacity = labelOpacity;
        titleMat.depthWrite = false;
      }
      (title as THREE.Mesh & { fillOpacity?: number }).fillOpacity = labelOpacity;
    }

    if (subtitle) {
      labelPointOnDome(patch, DOME_WALL_RADIUS - 0.4, 0.44, subtitlePos);
      subtitle.position.copy(subtitlePos);
      subtitle.lookAt(cameraWorld);
      const subOpacity = labelOpacity * 0.72;
      subtitle.visible = subOpacity > 0.04;
      const subtitleMat = (subtitle as THREE.Mesh).material as THREE.Material | undefined;
      if (subtitleMat) {
        subtitleMat.transparent = true;
        subtitleMat.opacity = subOpacity;
        subtitleMat.depthWrite = false;
      }
      (subtitle as THREE.Mesh & { fillOpacity?: number }).fillOpacity = subOpacity;
    }
  });

  const project = activeProjectRef.current ?? projects[0];
  if (!material || !project) return null;

  return (
    <group>
      <mesh
        ref={meshRef}
        geometry={geometry}
        frustumCulled={false}
        renderOrder={0}
        onPointerOver={(event) => {
          event.stopPropagation();
          if ((materialRef.current?.opacity ?? 0) >= CLICK_MIN_OPACITY) {
            document.body.style.cursor = "pointer";
          }
        }}
        onPointerOut={() => {
          document.body.style.cursor = "auto";
        }}
        onPointerDown={(event) => {
          event.stopPropagation();
          pointerDown.current = { x: event.clientX, y: event.clientY };
        }}
        onPointerUp={openProject}
        onPointerMissed={() => {
          pointerDown.current = null;
        }}
      >
        <primitive object={material} attach="material" />
      </mesh>

      <Text
        ref={titleRef}
        fontSize={0.034}
        maxWidth={0.86}
        lineHeight={1.1}
        color="#f5f5f4"
        anchorX="center"
        anchorY="top"
        textAlign="center"
        overflowWrap="break-word"
        fillOpacity={0}
        renderOrder={2}
      >
        {project.title}
      </Text>
      <Text
        ref={subtitleRef}
        fontSize={0.02}
        maxWidth={0.86}
        lineHeight={1.15}
        color="#a1a1aa"
        anchorX="center"
        anchorY="top"
        textAlign="center"
        overflowWrap="break-word"
        fillOpacity={0}
        renderOrder={2}
      >
        {project.subtitle}
      </Text>
    </group>
  );
}
