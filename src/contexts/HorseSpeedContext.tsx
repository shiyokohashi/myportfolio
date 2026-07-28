"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
  type ReactNode,
} from "react";

import { HORSE_USER_SPEED_DEFAULT } from "@/config/animation";

type HorseSpeedContextValue = {
  /** Committed speed — updates on slider release, not every drag tick. */
  speed: number;
  /** Live speed for animation hooks — always current, no re-render. */
  speedRef: MutableRefObject<number>;
  setSpeed: (speed: number) => void;
};

const HorseSpeedContext = createContext<HorseSpeedContextValue | null>(null);

export function HorseSpeedProvider({ children }: { children: ReactNode }) {
  const speedRef = useRef(HORSE_USER_SPEED_DEFAULT);
  const [speed, setSpeedState] = useState(HORSE_USER_SPEED_DEFAULT);

  const setSpeed = useCallback((next: number) => {
    speedRef.current = next;
    setSpeedState(next);
  }, []);

  const value = useMemo(
    () => ({ speed, speedRef, setSpeed }),
    [speed, setSpeed],
  );

  return (
    <HorseSpeedContext.Provider value={value}>
      {children}
    </HorseSpeedContext.Provider>
  );
}

export function useHorseSpeed() {
  const context = useContext(HorseSpeedContext);

  if (!context) {
    throw new Error("useHorseSpeed must be used within HorseSpeedProvider");
  }

  return context;
}
