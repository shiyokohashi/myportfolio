"use client";

import { Text, useTexture } from "@react-three/drei";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { useRouter } from "next/navigation";
import { useMemo, useRef } from "react";
import * as THREE from "three";

import { useGalleryRun } from "@/app/lab/home/next/GalleryRunProvider";
import {
  REVEAL_ANGLE,
  REVEAL_DISTANCE,
  WALL_RADIUS,
  horseFacingAngle,
  wrapAngle,
  type GalleryCardLayout,
} from "@/app/lab/home/next/galleryRunState";
import { buildCarouselDeck } from "@/data/cards";
import { getCarouselDisplaySrc } from "@/lib/media";

const CARD_W = 10.8;
const CARD_H = 8.1;
const CLICK_DRAG_PX = 6;

function buildGalleryCards(): GalleryCardLayout[] {
  const sources: Omit<
    GalleryCardLayout,
    "wallAngle" | "y" | "radius" | "scale" | "roll" | "hero"
  >[] = [];

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

  const count = Math.max(14, Math.min(sources.length, 20));
  const usable =
    sources.length >= count
      ? sources.slice(0, count)
      : Array.from({ length: count }, (_, i) => sources[i % sources.length]);

  return usable.map((source, index) => {
    const lane = index % 3;
    const angleJitter = (index % 5) * 0.04 - 0.08;
    return {
      ...source,
      id: `${source.id}-${index}`,
      wallAngle: (index / count) * Math.PI * 2 + angleJitter,
      y: 3.15 + (lane - 1) * 1.35 + (index % 2) * 0.25,
      radius: WALL_RADIUS + (lane - 1) * 0.85,
      scale: index % 5 === 0 ? 1.16 : 0.92 + (index % 4) * 0.04,
      roll: (index % 3 - 1) * 0.035,
      hero: index % 5 === 0,
    };
  });
}

function cardWorldPosition(card: GalleryCardLayout, target: THREE.Vector3) {
  return target.set(
    Math.sin(card.wallAngle) * card.radius,
    card.y,
    Math.cos(card.wallAngle) * card.radius,
  );
}

function GalleryCard({
  card,
  texture,
}: {
  card: GalleryCardLayout;
  texture: THREE.Texture;
}) {
  const router = useRouter();
  const {
    horsePosRef,
    horseForwardRef,
    horseHeadingRef,
    horseTurnRef,
    revealStatesRef,
    getRevealOpacity,
    markRevealStart,
  } = useGalleryRun();

  const groupRef = useRef<THREE.Group>(null);
  const imageMat = useRef<THREE.MeshBasicMaterial>(null);
  const titleRef = useRef<THREE.Mesh>(null);
  const subtitleRef = useRef<THREE.Mesh>(null);
  const pointerDown = useRef<{ x: number; y: number } | null>(null);
  const worldPos = useMemo(() => new THREE.Vector3(), []);
  const toCard = useMemo(() => new THREE.Vector3(), []);

  const width = CARD_W * card.scale * (card.hero ? 1.08 : 1);
  const height = CARD_H * card.scale * (card.hero ? 1.08 : 1);
  const titleSize = card.hero ? 0.34 : 0.28;
  const subtitleSize = card.hero ? 0.19 : 0.16;

  const openProject = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    const start = pointerDown.current;
    pointerDown.current = null;
    if (!card.href || !start) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.hypot(dx, dy) > CLICK_DRAG_PX) return;
    router.push(card.href);
  };

  useFrame((state) => {
    const group = groupRef.current;
    const material = imageMat.current;
    if (!group || !material) return;

    cardWorldPosition(card, worldPos);
    group.position.copy(worldPos);
    group.rotation.set(card.roll, card.wallAngle + Math.PI, 0);

    const horsePos = horsePosRef.current!;
    const distance = horsePos.distanceTo(worldPos);

    const facingAngle = horseFacingAngle(
      horseHeadingRef.current!.current,
      horseTurnRef.current!.current,
    );
    const angleDiff = Math.abs(wrapAngle(card.wallAngle - facingAngle));
    const inSector = angleDiff <= REVEAL_ANGLE;

    if (distance <= REVEAL_DISTANCE || inSector) {
      markRevealStart(card.id, state.clock.elapsedTime);
    }

    const revealState = revealStatesRef.current.get(card.id);
    const revealOpacity = getRevealOpacity(card.id, state.clock.elapsedTime);

    toCard.copy(worldPos).sub(horsePos);
    if (toCard.lengthSq() > 0.0001) {
      toCard.normalize();
    }

    const forward = horseForwardRef.current!;
    const facing = THREE.MathUtils.clamp(forward.dot(toCard), -1, 1);
    const viewOpacity = revealState?.revealed
      ? THREE.MathUtils.smoothstep(facing, -0.15, 0.42)
      : THREE.MathUtils.smoothstep(facing, 0.02, 0.38);

    const opacity = THREE.MathUtils.clamp(revealOpacity * viewOpacity, 0, 1);
    const scaleBoost = 0.94 + revealOpacity * 0.06;

    group.visible = opacity > 0.025;
    group.scale.setScalar(scaleBoost);
    material.opacity = opacity;

    const titleMesh = titleRef.current as
      | (THREE.Mesh & { fillOpacity?: number; material: THREE.Material })
      | null;
    if (titleMesh) {
      const labelOpacity = opacity * THREE.MathUtils.smoothstep(facing, 0.32, 0.75);
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
      const labelOpacity =
        opacity * THREE.MathUtils.smoothstep(facing, 0.36, 0.78) * 0.72;
      subtitleMesh.visible = labelOpacity > 0.04;
      subtitleMesh.fillOpacity = labelOpacity;
      subtitleMesh.material.transparent = true;
      subtitleMesh.material.opacity = labelOpacity;
      subtitleMesh.material.depthWrite = false;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh
        renderOrder={1}
        onPointerOver={(event) => {
          event.stopPropagation();
          document.body.style.cursor = "pointer";
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
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial
          ref={imageMat}
          map={texture}
          transparent
          depthWrite={false}
          toneMapped={false}
          opacity={0}
        />
      </mesh>

      <Text
        ref={titleRef}
        position={[0, -height / 2 - 0.38, 0.04]}
        fontSize={titleSize}
        maxWidth={width * 0.92}
        lineHeight={1.1}
        letterSpacing={-0.02}
        color="#f5f5f4"
        anchorX="center"
        anchorY="top"
        textAlign="center"
        overflowWrap="break-word"
        depthOffset={-1}
        fillOpacity={0}
      >
        {card.title}
      </Text>
      <Text
        ref={subtitleRef}
        position={[0, -height / 2 - 0.38 - titleSize * 1.35, 0.04]}
        fontSize={subtitleSize}
        maxWidth={width * 0.92}
        lineHeight={1.15}
        color="#a1a1aa"
        anchorX="center"
        anchorY="top"
        textAlign="center"
        overflowWrap="break-word"
        depthOffset={-1}
        fillOpacity={0}
      >
        {card.subtitle}
      </Text>
    </group>
  );
}

function GalleryCardField({
  cards,
  texturesBySrc,
}: {
  cards: GalleryCardLayout[];
  texturesBySrc: Map<string, THREE.Texture>;
}) {
  return (
    <>
      {cards.map((card) => {
        const texture = texturesBySrc.get(card.src);
        if (!texture) return null;
        return <GalleryCard key={card.id} card={card} texture={texture} />;
      })}
    </>
  );
}

/** Fixed 3D artwork on the cylindrical gallery wall — distance reveal, horse-facing visibility. */
export function CurvedGalleryCards() {
  const cards = useMemo(() => buildGalleryCards(), []);
  const urls = useMemo(() => [...new Set(cards.map((card) => card.src))], [cards]);
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

  if (cards.length === 0) return null;

  return <GalleryCardField cards={cards} texturesBySrc={texturesBySrc} />;
}
