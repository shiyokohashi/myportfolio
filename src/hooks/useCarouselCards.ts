"use client";

import { useMemo } from "react";

import type { PlaceholderCard } from "@/data/cards";
import { FRAME_36_CARD } from "@/data/cards";
import { isSpeedAtEndpoint } from "@/lib/secretFrame";

export function useCarouselCards(
  baseCards: PlaceholderCard[],
  speed: number,
  includeSecret: boolean,
): PlaceholderCard[] {
  return useMemo(() => {
    if (!includeSecret || !isSpeedAtEndpoint(speed)) {
      return baseCards;
    }

    return [...baseCards, FRAME_36_CARD];
  }, [baseCards, speed, includeSecret]);
}
