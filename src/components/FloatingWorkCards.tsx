"use client";

import { useFrame } from "@react-three/fiber";
import { Text, useTexture } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

import { buildCarouselDeck } from "@/data/cards";
import { getCarouselDisplaySrc } from "@/lib/media";
import {
  CORRIDOR_WALL_X,
  gallopSyncedTravel,
} from "@/components/horseSceneConstants";

type Side = "left" | "right";

type BannerSource = {
  id: string;
  src: string;
  title: string;
  subtitle: string;
  href: string;
};

type Banner = {
  id: string;
  src: string;
  title: string;
  subtitle: string;
  href: string;
  side: Side;
  slot: number;
  hero: boolean;
  yOffset: number;
};

const CLICK_DRAG_PX = 6;

/** Half-width of the aisle — walls sit this far left/right of the horse. */
const WALL_X = CORRIDOR_WALL_X;
const CARD_W = 12.4;
const CARD_H = 9.3;
const CARD_Y = 3.6;
/** Spacing along the hall (center to center). */
const SPACING = 11.8;
const FRONT_Z = 20;
const BACK_Z = -18;

function createCardShadowTexture() {
  if (typeof document === "undefined") return null;
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const half = size / 2;
  const gradient = ctx.createRadialGradient(half, half, 0, half, half, half);
  gradient.addColorStop(0, "rgba(0,0,0,0.55)");
  gradient.addColorStop(0.55, "rgba(0,0,0,0.18)");
  gradient.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

const cardShadowTexture = createCardShadowTexture();

function bannerSources(): BannerSource[] {
  const sources: BannerSource[] = [];
  for (const card of buildCarouselDeck()) {
    if (!card.href || card.secret) continue;
    const src = getCarouselDisplaySrc(card.thumbnail, card.id);
    if (!src) continue;
    sources.push({
      id: card.id,
      src,
      title: card.title,
      subtitle: card.subtitle,
      href: card.href,
    });
  }
  return sources;
}

function buildBanners(srcs: BannerSource[]): Banner[] {
  const usable =
    srcs.length > 0
      ? srcs
      : [
          {
            id: "fallback",
            src: "/images/projects/portfolio-book.png",
            title: "Portfolio",
            subtitle: "Selected work",
            href: "/work",
          },
        ];
  const hallLength = FRONT_Z - BACK_Z;
  const pairCount = Math.max(10, Math.ceil(hallLength / SPACING));

  return Array.from({ length: pairCount * 2 }, (_, i) => {
    const slot = Math.floor(i / 2);
    const side: Side = i % 2 === 0 ? "left" : "right";
    const banner = usable[i % usable.length];
    const hero = slot % 4 === (side === "left" ? 1 : 2);
    return {
      id: `${banner.id}-${i}`,
      src: banner.src,
      title: banner.title,
      subtitle: banner.subtitle,
      href: banner.href,
      side,
      slot,
      hero,
      yOffset: hero ? 0.55 : ((slot + (side === "left" ? 0 : 1)) % 3) * 0.35 - 0.35,
    };
  });
}

function WallCard({
  texture,
  title,
  subtitle,
  side,
  slot,
  pairCount,
  hero,
  yOffset,
}: {
  texture: THREE.Texture;
  title: string;
  subtitle: string;
  side: Side;
  slot: number;
  pairCount: number;
  hero: boolean;
  yOffset: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const imageMat = useRef<THREE.MeshBasicMaterial>(null);
  const shadowMat = useRef<THREE.MeshBasicMaterial>(null);
  const underShadowMat = useRef<THREE.MeshBasicMaterial>(null);
  const titleRef = useRef<THREE.Mesh>(null);
  const subtitleRef = useRef<THREE.Mesh>(null);
  const viewScratch = useMemo(
    () => ({
      normal: new THREE.Vector3(),
      worldPos: new THREE.Vector3(),
      toCamera: new THREE.Vector3(),
    }),
    [],
  );
  const hallLength = pairCount * SPACING;
  const baseX = side === "left" ? -WALL_X : WALL_X;
  const yaw = side === "left" ? Math.PI / 2 : -Math.PI / 2;
  const width = hero ? CARD_W * 1.28 : CARD_W;
  const height = hero ? CARD_H * 1.28 : CARD_H;
  const titleSize = hero ? 0.38 : 0.32;
  const subtitleSize = hero ? 0.22 : 0.18;

  useFrame((state) => {
    const group = groupRef.current;
    if (!group) return;

    const traveled = gallopSyncedTravel(state.clock.elapsedTime);
    // Stagger sides so left/right don't mirror lockstep.
    const sideLag = side === "right" ? SPACING * 0.38 : 0;
    const z =
      FRONT_Z -
      ((((slot * SPACING + sideLag + traveled) % hallLength) + hallLength) %
        hallLength);

    // Pull nearer cards slightly into the aisle for density around the horse.
    const nearHorse = 1 - THREE.MathUtils.clamp(Math.abs(z) / 14, 0, 1);
    const inset = nearHorse * (hero ? 2.6 : 1.9);
    const x = side === "left" ? baseX + inset : baseX - inset;

    group.position.set(x, CARD_Y + yOffset, z);
    group.updateWorldMatrix(true, false);

    // Dense and bright near the horse; soft falloff down the hall.
    const proximity = THREE.MathUtils.clamp(1 - Math.abs(z) / 16, 0.22, 1);
    const edgeFade =
      z > FRONT_Z - 3.5
        ? (FRONT_Z - z) / 3.5
        : z < BACK_Z + 3.5
          ? (z - BACK_Z) / 3.5
          : 1;
    const opacity = THREE.MathUtils.clamp(proximity * edgeFade, 0, 1);

    // Match card planes: hide labels when viewing edge-on or from behind.
    viewScratch.normal.set(0, 0, 1).transformDirection(group.matrixWorld);
    group.getWorldPosition(viewScratch.worldPos);
    viewScratch.toCamera
      .copy(state.camera.position)
      .sub(viewScratch.worldPos)
      .normalize();
    const facing = THREE.MathUtils.clamp(
      viewScratch.normal.dot(viewScratch.toCamera),
      0,
      1,
    );
    const faceFade = THREE.MathUtils.smoothstep(facing, 0.18, 0.55);
    const labelOpacity = opacity * faceFade;

    group.visible = opacity > 0.05;
    if (imageMat.current) imageMat.current.opacity = opacity;
    if (shadowMat.current) shadowMat.current.opacity = opacity * 0.22;
    if (underShadowMat.current) underShadowMat.current.opacity = opacity * 0.12;

    const titleMesh = titleRef.current as
      | (THREE.Mesh & { fillOpacity?: number; material: THREE.Material })
      | null;
    if (titleMesh) {
      titleMesh.visible = labelOpacity > 0.04;
      titleMesh.fillOpacity = labelOpacity;
      titleMesh.material.transparent = true;
      titleMesh.material.opacity = labelOpacity;
      titleMesh.material.depthWrite = false;
    }
    const subtitleMesh = subtitleRef.current as
      | (THREE.Mesh & { fillOpacity?: number; material: THREE.Material })
      | null;
    if (subtitleMesh) {
      subtitleMesh.visible = labelOpacity > 0.04;
      subtitleMesh.fillOpacity = labelOpacity * 0.72;
      subtitleMesh.material.transparent = true;
      subtitleMesh.material.opacity = labelOpacity * 0.72;
      subtitleMesh.material.depthWrite = false;
    }
  });

  return (
    <group ref={groupRef} rotation={[0, yaw, 0]}>
      {cardShadowTexture ? (
        <>
          <mesh position={[0, 0, -0.07]} renderOrder={0}>
            <planeGeometry args={[width * 1.08, height * 1.06]} />
            <meshBasicMaterial
              ref={shadowMat}
              map={cardShadowTexture}
              alphaMap={cardShadowTexture}
              transparent
              depthWrite={false}
              color="#000000"
              toneMapped={false}
            />
          </mesh>
          <mesh position={[0, -height * 0.46, -0.04]} renderOrder={0}>
            <planeGeometry args={[width * 0.92, height * 0.16]} />
            <meshBasicMaterial
              ref={underShadowMat}
              map={cardShadowTexture}
              alphaMap={cardShadowTexture}
              transparent
              depthWrite={false}
              color="#000000"
              toneMapped={false}
            />
          </mesh>
        </>
      ) : null}
      <mesh renderOrder={1}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial
          ref={imageMat}
          map={texture}
          transparent
          depthWrite
          toneMapped={false}
        />
      </mesh>

      <Text
        ref={titleRef}
        position={[0, -height / 2 - 0.42, 0.04]}
        fontSize={titleSize}
        maxWidth={width * 0.92}
        lineHeight={1.1}
        letterSpacing={-0.02}
        color="#1c1917"
        anchorX="center"
        anchorY="top"
        textAlign="center"
        overflowWrap="break-word"
        depthOffset={-1}
        fillOpacity={0}
      >
        {title}
      </Text>
      <Text
        ref={subtitleRef}
        position={[0, -height / 2 - 0.42 - titleSize * 1.35, 0.04]}
        fontSize={subtitleSize}
        maxWidth={width * 0.92}
        lineHeight={1.15}
        color="#78716c"
        anchorX="center"
        anchorY="top"
        textAlign="center"
        overflowWrap="break-word"
        depthOffset={-1}
        fillOpacity={0}
      >
        {subtitle}
      </Text>
    </group>
  );
}

function CorridorWalls({ sources }: { sources: BannerSource[] }) {
  const banners = useMemo(() => buildBanners(sources), [sources]);
  const urls = useMemo(() => sources.map((s) => s.src), [sources]);
  const loaded = useTexture(urls);
  const textures = Array.isArray(loaded) ? loaded : [loaded];

  const bySrc = useMemo(() => {
    const map = new Map<string, THREE.Texture>();
    sources.forEach((source, i) => {
      const texture = textures[i];
      if (!texture) return;
      texture.colorSpace = THREE.SRGBColorSpace;
      map.set(source.src, texture);
    });
    return map;
  }, [sources, textures]);

  const pairCount = banners.length / 2;

  return (
    <>
      {banners.map((banner) => {
        const texture = bySrc.get(banner.src);
        if (!texture) return null;
        return (
          <WallCard
            key={banner.id}
            texture={texture}
            title={banner.title}
            subtitle={banner.subtitle}
            side={banner.side}
            slot={banner.slot}
            pairCount={pairCount}
            hero={banner.hero}
            yOffset={banner.yOffset}
          />
        );
      })}
    </>
  );
}

/** Cards on parallel walls — denser near the horse, with occasional heroes. */
export function FloatingWorkCards() {
  const sources = useMemo(() => bannerSources(), []);
  if (sources.length === 0) return null;
  return <CorridorWalls sources={sources} />;
}
