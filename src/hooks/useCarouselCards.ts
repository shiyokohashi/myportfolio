"use client";

import { useEffect, useMemo, useState } from "react";

import type { PlaceholderCard } from "@/data/cards";
import { FRAME_36_CARD } from "@/data/cards";
import {
  HORSE_USER_SPEED_MAX,
  HORSE_USER_SPEED_MIN,
} from "@/config/animation";

const SECRET_ENTER_EPSILON = 0.02;
const SECRET_EXIT_EPSILON = 0.05;

function isSecretSpeed(speed: number): boolean {
  const clamped = Math.max(HORSE_USER_SPEED_MIN, speed);
  return (
    clamped <= SECRET_ENTER_EPSILON ||
    clamped >= HORSE_USER_SPEED_MAX - SECRET_ENTER_EPSILON
  );
}

function isSecretSpeedReleased(speed: number): boolean {
  const clamped = Math.max(HORSE_USER_SPEED_MIN, speed);
  return (
    clamped > SECRET_EXIT_EPSILON &&
    clamped < HORSE_USER_SPEED_MAX - SECRET_EXIT_EPSILON
  );
}

export function useCarouselCards(
  baseCards: PlaceholderCard[],
  speed: number,
  includeSecret: boolean,
): PlaceholderCard[] {
  const [secretActive, setSecretActive] = useState(false);

  useEffect(() => {
    if (!includeSecret) {
      setSecretActive(false);
      return;
    }

    if (isSecretSpeed(speed)) {
      setSecretActive(true);
      return;
    }

    if (isSecretSpeedReleased(speed)) {
      setSecretActive(false);
    }
  }, [speed, includeSecret]);

  return useMemo(() => {
    if (!includeSecret || !secretActive) {
      return baseCards;
    }

    return [...baseCards, FRAME_36_CARD];
  }, [baseCards, includeSecret, secretActive]);
}
