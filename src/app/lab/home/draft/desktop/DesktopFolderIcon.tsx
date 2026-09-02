"use client";

import { useCallback, useRef, useState } from "react";

import { GlassFolder } from "../GlassFolder";
import { bindDesktopHoverTip, useDesktopHoverTip } from "./DesktopHoverTip";

const DRAG_THRESHOLD = 5;
const ICON_WIDTH = 80;

type DesktopFolderIconProps = {
  label: string;
  hint?: string;
  x: number;
  y: number;
  zIndex: number;
  peekUrl?: string | null;
  selected?: boolean;
  onOpen: () => void;
  onPositionChange: (x: number, y: number) => void;
  onFocus: () => void;
  boundsWidth?: number;
  boundsHeight?: number;
};

function clampPosition(
  nextX: number,
  nextY: number,
  boundsWidth: number,
  boundsHeight: number,
) {
  const maxX = boundsWidth > 0 ? boundsWidth - ICON_WIDTH : nextX;
  const maxY = boundsHeight > 0 ? boundsHeight - 100 : nextY;

  return {
    x: Math.max(8, Math.min(nextX, maxX)),
    y: Math.max(8, Math.min(nextY, maxY)),
  };
}

export function DesktopFolderIcon({
  label,
  hint,
  x,
  y,
  zIndex,
  peekUrl = null,
  selected = false,
  onOpen,
  onPositionChange,
  onFocus,
  boundsWidth = 0,
  boundsHeight = 0,
}: DesktopFolderIconProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const hoverTip = useDesktopHoverTip();
  const tipHandlers = bindDesktopHoverTip(hint, hoverTip, isDragging);
  const dragRef = useRef({
    active: false,
    moved: false,
    startX: 0,
    startY: 0,
    originX: x,
    originY: y,
    pointerId: -1,
  });

  const onPointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      onFocus();
      dragRef.current = {
        active: true,
        moved: false,
        startX: event.clientX,
        startY: event.clientY,
        originX: x,
        originY: y,
        pointerId: event.pointerId,
      };
      rootRef.current?.setPointerCapture(event.pointerId);
    },
    [onFocus, x, y],
  );

  const onPointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!dragRef.current.active) return;

      const dx = event.clientX - dragRef.current.startX;
      const dy = event.clientY - dragRef.current.startY;

      if (!dragRef.current.moved && Math.hypot(dx, dy) < DRAG_THRESHOLD) return;

      dragRef.current.moved = true;
      setIsDragging(true);
      const next = clampPosition(
        dragRef.current.originX + dx,
        dragRef.current.originY + dy,
        boundsWidth,
        boundsHeight,
      );
      onPositionChange(next.x, next.y);
    },
    [onPositionChange],
  );

  const onPointerUp = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!dragRef.current.active) return;

      const opened = !dragRef.current.moved;
      dragRef.current.active = false;
      setIsDragging(false);

      if (dragRef.current.pointerId >= 0) {
        rootRef.current?.releasePointerCapture(dragRef.current.pointerId);
      }

      if (opened) {
        onOpen();
      } else {
        const dx = event.clientX - dragRef.current.startX;
        const dy = event.clientY - dragRef.current.startY;
        const next = clampPosition(
        dragRef.current.originX + dx,
        dragRef.current.originY + dy,
        boundsWidth,
        boundsHeight,
      );
        onPositionChange(next.x, next.y);
      }
    },
    [onOpen, onPositionChange],
  );

  return (
    <div
      ref={rootRef}
      role="button"
      tabIndex={0}
      className={`desktop-folder-icon is-glass-folder-hoverable${selected ? " is-selected" : ""}${
        isDragging ? " is-dragging" : ""
      }`}
      style={{ left: x, top: y, zIndex }}
      onPointerDown={(event) => {
        tipHandlers.onPointerDown();
        onPointerDown(event);
      }}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onMouseLeave={tipHandlers.onMouseLeave}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpen();
        }
      }}
    >
      <span
        className="desktop-folder-icon__preview"
        onMouseEnter={tipHandlers.onMouseEnter}
        onMouseLeave={tipHandlers.onMouseLeave}
        onPointerDown={tipHandlers.onPointerDown}
      >
        <GlassFolder peekUrl={peekUrl} size="grid" />
      </span>
      <span className="desktop-folder-icon__label">{label}</span>
    </div>
  );
}
