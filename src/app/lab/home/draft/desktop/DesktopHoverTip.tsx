"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

type TipPlacement = "top" | "bottom" | "left" | "right";

type TipState = {
  text: string;
  x: number;
  y: number;
  placement: TipPlacement;
  variant?: "default" | "dock";
};

const TIP_GAP = 12;
const TIP_ESTIMATED_HEIGHT = 36;
const TIP_ESTIMATED_WIDTH = 180;

function pickTipPlacement(rect: DOMRect, variant: "default" | "dock"): TipPlacement {
  const gap = variant === "dock" ? 16 : TIP_GAP;
  const spaceAbove = rect.top;
  const spaceBelow = window.innerHeight - rect.bottom;
  const spaceLeft = rect.left;
  const spaceRight = window.innerWidth - rect.right;

  const fitsAbove = spaceAbove >= TIP_ESTIMATED_HEIGHT + gap + 8;
  const fitsBelow = spaceBelow >= TIP_ESTIMATED_HEIGHT + gap + 8;
  const fitsLeft = spaceLeft >= TIP_ESTIMATED_WIDTH + gap + 8;
  const fitsRight = spaceRight >= TIP_ESTIMATED_WIDTH + gap + 8;

  if (variant === "dock") {
    if (fitsAbove) return "top";
    if (fitsBelow) return "bottom";
    if (fitsRight) return "right";
    if (fitsLeft) return "left";
    return "top";
  }

  const nearTop = rect.top < window.innerHeight * 0.22;
  const nearBottom = rect.bottom > window.innerHeight * 0.78;
  const nearLeft = rect.left < window.innerWidth * 0.2;
  const nearRight = rect.right > window.innerWidth * 0.8;

  if (nearTop && fitsBelow) return "bottom";
  if (nearBottom && fitsAbove) return "top";
  if (nearRight && fitsLeft) return "left";
  if (nearLeft && fitsRight) return "right";

  if (fitsAbove) return "top";
  if (fitsBelow) return "bottom";
  if (fitsRight) return "right";
  if (fitsLeft) return "left";

  return "top";
}

function getTipAnchor(rect: DOMRect, placement: TipPlacement) {
  switch (placement) {
    case "bottom":
      return { x: rect.left + rect.width / 2, y: rect.bottom };
    case "left":
      return { x: rect.left, y: rect.top + rect.height / 2 };
    case "right":
      return { x: rect.right, y: rect.top + rect.height / 2 };
    case "top":
    default:
      return { x: rect.left + rect.width / 2, y: rect.top };
  }
}

type DesktopHoverTipContextValue = {
  showTip: (text: string, anchor: HTMLElement, variant?: "default" | "dock") => void;
  hideTip: () => void;
};

const DesktopHoverTipContext = createContext<DesktopHoverTipContextValue | null>(null);

const SHOW_DELAY_MS = 280;

export function DesktopHoverTipProvider({ children }: { children: ReactNode }) {
  const [tip, setTip] = useState<TipState | null>(null);
  const [mounted, setMounted] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    setMounted(true);
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  const hideTip = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setTip(null);
  }, []);

  const showTip = useCallback(
    (text: string, anchor: HTMLElement, variant: "default" | "dock" = "default") => {
      if (!text.trim()) return;
      hideTip();
      timerRef.current = window.setTimeout(() => {
        const rect = anchor.getBoundingClientRect();
        const placement = pickTipPlacement(rect, variant);
        const anchorPoint = getTipAnchor(rect, placement);
        setTip({
          text,
          x: anchorPoint.x,
          y: anchorPoint.y,
          placement,
          variant,
        });
      }, SHOW_DELAY_MS);
    },
    [hideTip],
  );

  return (
    <DesktopHoverTipContext.Provider value={{ showTip, hideTip }}>
      {children}
      {mounted && tip
        ? createPortal(
            <div
              className={`desktop-hover-tip desktop-hover-tip--${tip.placement}${tip.variant === "dock" ? " desktop-hover-tip--dock" : ""}`}
              role="tooltip"
              style={{ left: tip.x, top: tip.y }}
            >
              {tip.text}
            </div>,
            document.body,
          )
        : null}
    </DesktopHoverTipContext.Provider>
  );
}

export function useDesktopHoverTip() {
  return useContext(DesktopHoverTipContext);
}

export function bindDesktopHoverTip(
  hint: string | undefined,
  handlers: {
    showTip: (text: string, anchor: HTMLElement, variant?: "default" | "dock") => void;
    hideTip: () => void;
  } | null,
  disabled = false,
  variant: "default" | "dock" = "default",
) {
  return {
    onMouseEnter: (event: React.MouseEvent<HTMLElement>) => {
      if (disabled || !handlers || !hint) return;
      handlers.showTip(hint, event.currentTarget, variant);
    },
    onMouseLeave: () => {
      handlers?.hideTip();
    },
    onPointerDown: () => {
      handlers?.hideTip();
    },
  };
}
