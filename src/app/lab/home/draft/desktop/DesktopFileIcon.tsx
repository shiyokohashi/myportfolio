"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { bindDesktopHoverTip, useDesktopHoverTip } from "./DesktopHoverTip";

const DRAG_THRESHOLD = 5;
const ICON_WIDTH = 92;
const DOUBLE_CLICK_MS = 360;

type DesktopFileIconProps = {
  label: string;
  thumb: string;
  thumbVideo?: string;
  hint?: string;
  variant?: "image" | "text";
  x: number;
  y: number;
  zIndex: number;
  selected?: boolean;
  onOpen: () => void;
  onOpenInTab: () => void;
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

export function DesktopFileIcon({
  label,
  thumb,
  thumbVideo,
  hint,
  variant = "image",
  x,
  y,
  zIndex,
  selected = false,
  onOpen,
  onOpenInTab,
  onPositionChange,
  onFocus,
  boundsWidth = 0,
  boundsHeight = 0,
}: DesktopFileIconProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const hoverTip = useDesktopHoverTip();
  const tipHandlers = bindDesktopHoverTip(hint, hoverTip, isDragging);
  const lastClickAt = useRef(0);
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
    [boundsHeight, boundsWidth, onPositionChange],
  );

  const onPointerUp = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!dragRef.current.active) return;

      const clicked = !dragRef.current.moved;
      dragRef.current.active = false;
      setIsDragging(false);

      if (dragRef.current.pointerId >= 0) {
        rootRef.current?.releasePointerCapture(dragRef.current.pointerId);
      }

      if (!clicked) {
        const dx = event.clientX - dragRef.current.startX;
        const dy = event.clientY - dragRef.current.startY;
        const next = clampPosition(
          dragRef.current.originX + dx,
          dragRef.current.originY + dy,
          boundsWidth,
          boundsHeight,
        );
        onPositionChange(next.x, next.y);
        return;
      }

      const now = Date.now();
      if (now - lastClickAt.current <= DOUBLE_CLICK_MS) {
        lastClickAt.current = 0;
        onOpenInTab();
        return;
      }

      lastClickAt.current = now;
      onOpen();
    },
    [boundsHeight, boundsWidth, onOpen, onOpenInTab, onPositionChange],
  );

  const onPointerCancel = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.active) return;
    dragRef.current.active = false;
    setIsDragging(false);
    if (dragRef.current.pointerId >= 0) {
      rootRef.current?.releasePointerCapture(event.pointerId);
    }
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !thumbVideo) return;
    void video.play().catch(() => undefined);
  }, [thumbVideo]);

  return (
    <div
      ref={rootRef}
      role="button"
      tabIndex={0}
      className={`desktop-file-icon${variant === "text" ? " desktop-file-icon--text" : ""}${selected ? " is-selected" : ""}${isDragging ? " is-dragging" : ""}`}
      style={{ left: x, top: y, zIndex }}
      onPointerDown={(event) => {
        tipHandlers.onPointerDown();
        onPointerDown(event);
      }}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      onMouseLeave={tipHandlers.onMouseLeave}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpen();
        }
      }}
    >
      <span className="desktop-file-icon__preview" {...tipHandlers}>
        {thumbVideo ? (
          <video
            ref={videoRef}
            className="desktop-file-icon__thumb desktop-file-icon__thumb--video"
            src={thumbVideo}
            poster={thumb || undefined}
            muted
            loop
            playsInline
            autoPlay
            draggable={false}
            onDragStart={(event) => event.preventDefault()}
          />
        ) : thumb ? (
          <img
            src={thumb}
            alt=""
            className="desktop-file-icon__thumb"
            draggable={false}
            onDragStart={(event) => event.preventDefault()}
          />
        ) : variant === "text" ? (
          <span className="desktop-file-icon__text-doc" aria-hidden>
            <span />
            <span />
            <span />
            <span />
          </span>
        ) : (
          <span className="desktop-file-icon__thumb-placeholder" aria-hidden />
        )}
      </span>
      <span className="desktop-file-icon__label">{label}</span>
    </div>
  );
}
