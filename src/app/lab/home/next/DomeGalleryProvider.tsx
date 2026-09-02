"use client";

import {
  createContext,
  useContext,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import * as THREE from "three";

import {
  pickRandomProjectIndex,
  type DomeProject,
} from "@/app/lab/home/next/domeGalleryState";
import { buildCarouselDeck } from "@/data/cards";
import { getCarouselDisplaySrc } from "@/lib/media";

function buildDomeProjects(): DomeProject[] {
  const projects: DomeProject[] = [];

  for (const card of buildCarouselDeck()) {
    if (!card.href || card.secret) continue;
    const src = getCarouselDisplaySrc(card.thumbnail, card.id);
    if (!src) continue;
    projects.push({
      id: card.id,
      src,
      title: card.title,
      subtitle: card.subtitle,
      href: card.href,
    });
  }

  return projects;
}

type DomeGalleryContextValue = {
  projects: DomeProject[];
  activeIndexRef: React.RefObject<number>;
  panelOpacityRef: React.RefObject<number>;
  accumulatedTurnRef: React.RefObject<number>;
  isDraggingRef: React.RefObject<boolean>;
  horseForwardRef: React.RefObject<THREE.Vector3>;
  pickNextProject: () => void;
};

const DomeGalleryContext = createContext<DomeGalleryContextValue | null>(null);

export function useDomeGallery() {
  const context = useContext(DomeGalleryContext);
  if (!context) {
    throw new Error("useDomeGallery must be used within DomeGalleryProvider");
  }
  return context;
}

export function DomeGalleryProvider({ children }: { children: ReactNode }) {
  const projects = useMemo(() => buildDomeProjects(), []);

  const activeIndexRef = useRef(
    projects.length > 0 ? Math.floor(Math.random() * projects.length) : 0,
  );
  const panelOpacityRef = useRef(1);
  const accumulatedTurnRef = useRef(0);
  const isDraggingRef = useRef(false);
  const horseForwardRef = useRef(new THREE.Vector3(0, 0, 1));

  const pickNextProject = useMemo(
    () => () => {
      if (projects.length === 0) return;
      activeIndexRef.current = pickRandomProjectIndex(
        projects.length,
        activeIndexRef.current,
      );
    },
    [projects.length],
  );

  const value = useMemo<DomeGalleryContextValue>(
    () => ({
      projects,
      activeIndexRef,
      panelOpacityRef,
      accumulatedTurnRef,
      isDraggingRef,
      horseForwardRef,
      pickNextProject,
    }),
    [projects, pickNextProject],
  );

  return (
    <DomeGalleryContext.Provider value={value}>
      {children}
    </DomeGalleryContext.Provider>
  );
}
