"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { HORSE_USER_SPEED_DEFAULT } from "@/config/animation";

type HorseSpeedContextValue = {
  speed: number;
  setSpeed: (speed: number) => void;
};

const HorseSpeedContext = createContext<HorseSpeedContextValue | null>(null);

export function HorseSpeedProvider({ children }: { children: ReactNode }) {
  const [speed, setSpeedState] = useState(HORSE_USER_SPEED_DEFAULT);

  const setSpeed = useCallback((next: number) => {
    setSpeedState(next);
  }, []);

  const value = useMemo(() => ({ speed, setSpeed }), [speed, setSpeed]);

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
