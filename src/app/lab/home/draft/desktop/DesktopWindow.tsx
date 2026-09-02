"use client";

import { type ReactNode, useCallback, useEffect, useRef, useState } from "react";

type ResizeEdge = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";

type DesktopWindowProps = {
  title: string;
  children: ReactNode;
  width: number;
  height: number;
  minWidth?: number;
  minHeight?: number;
  x: number;
  y: number;
  zIndex: number;
  minimized?: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onFocus: () => void;
  onSizeChange?: (width: number, height: number) => void;
  onPositionChange?: (x: number, y: number) => void;
  onTitleDoubleClick?: () => void;
  onExpand?: () => void;
  contentDraggable?: boolean;
  frameless?: boolean;
  className?: string;
};

const RESIZE_HANDLES: { edge: ResizeEdge; className: string }[] = [
  { edge: "n", className: "desktop-window__resize--edge-top" },
  { edge: "s", className: "desktop-window__resize--edge-bottom" },
  { edge: "e", className: "desktop-window__resize--edge-right" },
  { edge: "w", className: "desktop-window__resize--edge-left" },
  { edge: "nw", className: "desktop-window__resize--corner-nw" },
  { edge: "ne", className: "desktop-window__resize--corner-ne" },
  { edge: "sw", className: "desktop-window__resize--corner-sw" },
  { edge: "se", className: "desktop-window__resize--corner-se" },
];

function applyResize(
  edge: ResizeEdge,
  dx: number,
  dy: number,
  origin: { width: number; height: number; x: number; y: number },
  minWidth: number,
  minHeight: number,
) {
  let width = origin.width;
  let height = origin.height;
  let x = origin.x;
  let y = origin.y;

  if (edge.includes("e")) {
    width = Math.max(minWidth, origin.width + dx);
  }

  if (edge.includes("w")) {
    const nextWidth = origin.width - dx;
    if (nextWidth < minWidth) {
      x = origin.x + origin.width - minWidth;
      width = minWidth;
    } else {
      x = origin.x + dx;
      width = nextWidth;
    }
  }

  if (edge.includes("s")) {
    height = Math.max(minHeight, origin.height + dy);
  }

  if (edge.includes("n")) {
    const nextHeight = origin.height - dy;
    if (nextHeight < minHeight) {
      y = origin.y + origin.height - minHeight;
      height = minHeight;
    } else {
      y = origin.y + dy;
      height = nextHeight;
    }
  }

  return {
    width,
    height,
    x,
    y: Math.max(8, y),
  };
}

export function DesktopWindow({
  title,
  children,
  width,
  height,
  minWidth = 280,
  minHeight = 200,
  x,
  y,
  zIndex,
  minimized = false,
  onClose,
  onMinimize,
  onFocus,
  onSizeChange,
  onPositionChange,
  onTitleDoubleClick,
  onExpand,
  contentDraggable = false,
  frameless = false,
  className,
}: DesktopWindowProps) {
  const dragRef = useRef({ active: false, startX: 0, startY: 0, originX: x, originY: y });
  const resizeRef = useRef({
    active: false,
    edge: "se" as ResizeEdge,
    startX: 0,
    startY: 0,
    origin: { width, height, x, y },
  });
  const [position, setPosition] = useState({ x, y });
  const [size, setSize] = useState({ width, height });
  const positionRef = useRef(position);
  positionRef.current = position;

  useEffect(() => {
    setSize({ width, height });
  }, [width, height]);

  useEffect(() => {
    setPosition({ x, y });
  }, [x, y]);

  const startDrag = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      onFocus();
      dragRef.current = {
        active: true,
        startX: event.clientX,
        startY: event.clientY,
        originX: position.x,
        originY: position.y,
      };
      event.currentTarget.setPointerCapture(event.pointerId);
    },
    [onFocus, position.x, position.y],
  );

  const onTitlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if ((event.target as HTMLElement).closest(".desktop-window__controls")) return;
      startDrag(event);
    },
    [startDrag],
  );

  const onTitlePointerMove = useCallback((event: React.PointerEvent<HTMLElement>) => {
    if (!dragRef.current.active) return;
    setPosition({
      x: dragRef.current.originX + (event.clientX - dragRef.current.startX),
      y: Math.max(8, dragRef.current.originY + (event.clientY - dragRef.current.startY)),
    });
  }, []);

  const onTitlePointerUp = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      const wasActive = dragRef.current.active;
      dragRef.current.active = false;
      event.currentTarget.releasePointerCapture(event.pointerId);
      if (wasActive && onPositionChange) {
        const nextX = dragRef.current.originX + (event.clientX - dragRef.current.startX);
        const nextY = Math.max(8, dragRef.current.originY + (event.clientY - dragRef.current.startY));
        onPositionChange(nextX, nextY);
      }
    },
    [onPositionChange],
  );

  const onContentPointerDown = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (!contentDraggable) return;
      const target = event.target as HTMLElement;
      if (target.closest("a, button, input, textarea, select, iframe, [data-no-drag]")) return;
      startDrag(event);
    },
    [contentDraggable, startDrag],
  );

  const onResizePointerDown = useCallback(
    (event: React.PointerEvent<HTMLElement>, edge: ResizeEdge) => {
      event.stopPropagation();
      onFocus();
      resizeRef.current = {
        active: true,
        edge,
        startX: event.clientX,
        startY: event.clientY,
        origin: {
          width: size.width,
          height: size.height,
          x: position.x,
          y: position.y,
        },
      };
      event.currentTarget.setPointerCapture(event.pointerId);
    },
    [onFocus, position.x, position.y, size.height, size.width],
  );

  const onResizePointerMove = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (!resizeRef.current.active) return;
      const dx = event.clientX - resizeRef.current.startX;
      const dy = event.clientY - resizeRef.current.startY;
      const next = applyResize(
        resizeRef.current.edge,
        dx,
        dy,
        resizeRef.current.origin,
        minWidth,
        minHeight,
      );
      setSize({ width: next.width, height: next.height });
      setPosition({ x: next.x, y: next.y });
      onSizeChange?.(next.width, next.height);
    },
    [minHeight, minWidth, onSizeChange],
  );

  const onResizePointerUp = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      const wasActive = resizeRef.current.active;
      resizeRef.current.active = false;
      event.currentTarget.releasePointerCapture(event.pointerId);
      if (wasActive && onPositionChange) {
        onPositionChange(positionRef.current.x, positionRef.current.y);
      }
    },
    [onPositionChange],
  );

  if (minimized) return null;

  return (
    <section
      className={`desktop-window${frameless ? " desktop-window--frameless" : ""}${className ? ` ${className}` : ""}`}
      style={{
        width: size.width,
        height: size.height,
        transform: `translate(${position.x}px, ${position.y}px)`,
        zIndex,
      }}
      onPointerDown={onFocus}
    >
      {frameless ? null : (
        <header
          className="desktop-window__titlebar"
          onPointerDown={onTitlePointerDown}
          onPointerMove={onTitlePointerMove}
          onPointerUp={onTitlePointerUp}
          onDoubleClick={(event) => {
            event.preventDefault();
            onTitleDoubleClick?.();
          }}
        >
          <div className="desktop-window__controls">
            <button
              type="button"
              className="desktop-window__dot desktop-window__dot--close"
              aria-label={`Close ${title}`}
              onClick={onClose}
            />
            <button
              type="button"
              className="desktop-window__dot desktop-window__dot--minimize"
              aria-label={`Minimize ${title}`}
              onClick={onMinimize}
            />
            {onExpand ? (
              <button
                type="button"
                className="desktop-window__dot desktop-window__dot--expand"
                aria-label={`Open ${title} in new tab`}
                onClick={onExpand}
              />
            ) : null}
          </div>
          <p className="desktop-window__title">{title}</p>
        </header>
      )}
      <div
        className="desktop-window__content"
        onPointerDown={onContentPointerDown}
        onPointerMove={onTitlePointerMove}
        onPointerUp={onTitlePointerUp}
      >
        {children}
      </div>
      {RESIZE_HANDLES.map(({ edge, className }) => (
        <div
          key={edge}
          className={`desktop-window__resize ${className}`}
          aria-hidden
          onPointerDown={(event) => onResizePointerDown(event, edge)}
          onPointerMove={onResizePointerMove}
          onPointerUp={onResizePointerUp}
        />
      ))}
    </section>
  );
}
