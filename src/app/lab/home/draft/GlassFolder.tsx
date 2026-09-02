"use client";

import type { CSSProperties } from "react";

import "./glass-folder.css";

type GlassFolderProps = {
  peekUrl?: string | null;
  size?: "grid" | "card";
  stackTabs?: number;
};

const MAX_STACK_LAYERS = 4;
const TAB_OFFSETS = ["54%", "38%", "22%", "8%"] as const;

function GlassTab({ offset }: { offset?: string }) {
  return (
    <div
      className={`glass-folder-tab${offset ? "" : " glass-folder-tab--main"}`}
      style={offset ? ({ marginLeft: offset } as CSSProperties) : undefined}
    >
      <div className="glass-folder-tab-glow" />
      <div className="glass-folder-tab-sheen" />
    </div>
  );
}

function GlassFolderBody({
  peekUrl,
  back = false,
}: {
  peekUrl?: string | null;
  back?: boolean;
}) {
  return (
    <div
      className={`glass-folder-body${back ? " glass-folder-body--back" : ""}${!back && peekUrl ? " glass-folder-body--has-peek" : ""}`}
    >
      {!back && (
        <div className="glass-folder-cavity">
          {peekUrl ? <img src={peekUrl} alt="" className="glass-folder-peek" /> : null}
        </div>
      )}
      <div className="glass-folder-sheen" />
      <div className="glass-folder-frost" />
      <div className="glass-folder-light" />
      <div className="glass-folder-rim" />
      <div className="glass-folder-depth" />
    </div>
  );
}

export function GlassFolder({ peekUrl, size = "grid", stackTabs = 0 }: GlassFolderProps) {
  const stackLayerCount = Math.min(stackTabs, MAX_STACK_LAYERS);
  const stackLayers = Array.from({ length: stackLayerCount }, (_, index) => ({
    offset: TAB_OFFSETS[index % TAB_OFFSETS.length],
    index,
  }));

  const shellStyle =
    stackLayerCount > 0
      ? ({ ["--stack-count" as string]: stackLayerCount } as CSSProperties)
      : undefined;

  return (
    <div className={`glass-folder glass-folder--${size}`} aria-hidden="true">
      <div className="glass-folder-clip">
        <div className="glass-folder-shell" style={shellStyle}>
          {stackLayers.map((layer) => (
            <div
              key={layer.index}
              className="glass-folder-layer glass-folder-layer--back"
              style={
                {
                  zIndex: layer.index + 1,
                  ["--layer-step" as string]: stackLayerCount - layer.index,
                } as CSSProperties
              }
            >
              <GlassTab offset={layer.offset} />
              <GlassFolderBody back />
            </div>
          ))}
          <div
            className="glass-folder-layer glass-folder-layer--front"
            style={{ zIndex: stackLayerCount + 2 } as CSSProperties}
          >
            <GlassTab />
            <GlassFolderBody peekUrl={peekUrl} />
          </div>
          <div className="glass-folder-ground" />
        </div>
      </div>
    </div>
  );
}
