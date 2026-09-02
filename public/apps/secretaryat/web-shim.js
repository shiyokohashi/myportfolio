(() => {
  const TASKS_KEY = "secretaryat.web.tasks";
  const STABLE_KEY = "secretaryat.web.stable";
  const DEMO_SEEDED_KEY = "secretaryat.web.demo-seeded-v6";

  const EXAMPLE_TASKS = [
    { id: "demo-try", text: "try me", kind: "brown", x: 24, y: 84, facing: 1 },
    { id: "demo-cross", text: "cross me off", kind: "white", x: 48, y: 78, facing: -1 },
    { id: "demo-feed", text: "feed me", kind: "black", x: 68, y: 86, facing: 1 },
    { id: "demo-label", text: "project: task tracker", kind: "tan", x: 82, y: 80, facing: -1 },
  ];

  const DEMO_STABLE_HINT = {
    id: "demo-stable-hint",
    text: "finished tasks show here",
    kind: "grey",
    completedAt: Date.now(),
  };

  function readJson(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  }

  function writeJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  const params = new URLSearchParams(location.search);
  const isEmbedded = params.get("embedded") === "1";
  const isDemo = params.get("demo") === "1";
  const isStablePage = /\/stable\.html$/i.test(location.pathname);
  const embeddedWindowType = isStablePage ? "stable-window" : "secretaryat-window";
  if (isEmbedded) {
    document.documentElement.classList.add("is-embedded");
  }

  window.addEventListener("storage", (event) => {
    if (event.key === STABLE_KEY || event.key === TASKS_KEY) {
      window.dispatchEvent(new CustomEvent("stable-changed"));
    }
  });

  function postEmbeddedWindowMessage(action, extra = {}) {
    if (!isEmbedded) return;
    window.parent.postMessage({ type: embeddedWindowType, action, ...extra }, "*");
  }

  const stableStore = {
    loadStable: async () => ensureDemoStableHint(readJson(STABLE_KEY, [])),
    saveStable: async (horses) => {
      writeJson(STABLE_KEY, horses);
      window.dispatchEvent(new CustomEvent("stable-changed"));
    },
    onStableChanged: (callback) => {
      const listener = () => callback();
      window.addEventListener("stable-changed", listener);
      return () => window.removeEventListener("stable-changed", listener);
    },
  };

  function seedDemoTasksIfNeeded() {
    if (!isDemo || localStorage.getItem(DEMO_SEEDED_KEY) === "1") return null;
    writeJson(TASKS_KEY, EXAMPLE_TASKS);
    writeJson(STABLE_KEY, [DEMO_STABLE_HINT]);
    localStorage.setItem(DEMO_SEEDED_KEY, "1");
    localStorage.removeItem("secretaryat.web.demo-seeded-v3");
    localStorage.removeItem("secretaryat.web.demo-seeded-v4");
    localStorage.removeItem("secretaryat.web.demo-seeded-v5");
    return EXAMPLE_TASKS;
  }

  function ensureDemoStableHint(stable) {
    if (!isDemo) return stable;
    if (stable.some((horse) => horse.id === DEMO_STABLE_HINT.id)) return stable;
    const next = [{ ...DEMO_STABLE_HINT, completedAt: Date.now() }, ...stable];
    writeJson(STABLE_KEY, next);
    return next;
  }

  async function escapeHorseInBrowser(payload) {
    const horse = document.querySelector(".horse[data-state='leaving']");
    if (!horse || !payload?.strip) return;

    const sprite = horse.querySelector(".horse-sprite");
    const caption = horse.querySelector(".horse-caption");
    if (!sprite) return;

    const frameCount = payload.frameCount || 12;
    const fps = payload.fps || 12;
    const direction = payload.direction >= 0 ? 1 : -1;

    if (caption) caption.hidden = true;
    horse.style.transition = "none";
    horse.style.zIndex = "20";
    horse.style.setProperty("--facing", String(direction));

    sprite.style.backgroundImage = `url("${payload.strip}")`;
    sprite.style.backgroundRepeat = "no-repeat";
    sprite.style.backgroundPosition = "0 bottom";
    sprite.style.backgroundSize = `${frameCount * 100}% 100%`;

    const startX = parseFloat(horse.style.getPropertyValue("--x")) || 50;
    const startY = parseFloat(horse.style.getPropertyValue("--y")) || 80;
    const endX = direction > 0 ? 118 : -18;
    const durationMs = 2400;
    const frameMs = 1000 / fps;
    let frame = 0;
    let lastFrameAt = 0;

    await new Promise((resolve) => {
      const started = performance.now();

      const tick = (now) => {
        const elapsed = now - started;
        const t = Math.min(1, elapsed / durationMs);
        const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        const x = startX + (endX - startX) * eased;
        let y = startY;
        if (t < 0.14) {
          y = startY - Math.sin((t / 0.14) * Math.PI) * 3;
        }

        horse.style.setProperty("--x", `${x}%`);
        horse.style.setProperty("--y", `${y}%`);

        if (now - lastFrameAt >= frameMs) {
          lastFrameAt = now;
          frame = (frame + 1) % frameCount;
          const offset = frameCount <= 1 ? 0 : (frame / (frameCount - 1)) * 100;
          sprite.style.backgroundPosition = `${offset}% bottom`;
        }

        if (t < 1) {
          requestAnimationFrame(tick);
        } else {
          horse.style.opacity = "0";
          resolve();
        }
      };

      requestAnimationFrame(tick);
    });
  }

  window.pasture = {
    minimize: () => postEmbeddedWindowMessage("minimize"),
    close: () => postEmbeddedWindowMessage("close"),
    escapeHorse: async (payload) => {
      if (isEmbedded) {
        const horse = document.querySelector(".horse[data-state='leaving']");
        if (!horse || !payload?.strip) return;

        const rect = horse.getBoundingClientRect();
        horse.style.visibility = "hidden";

        return new Promise((resolve) => {
          const onDone = (event) => {
            if (event.data?.type === "secretaryat-window" && event.data.action === "escape-done") {
              window.removeEventListener("message", onDone);
              resolve();
            }
          };
          window.addEventListener("message", onDone);
          window.parent.postMessage(
            {
              type: "secretaryat-window",
              action: "escape-horse",
              payload: {
                ...payload,
                strip: new URL(payload.strip, window.location.href).href,
                viewportX: rect.left + rect.width / 2,
                viewportY: rect.top + rect.height * 0.85,
              },
            },
            "*",
          );
        });
      }

      await escapeHorseInBrowser(payload);
    },
    loadTasks: async () => seedDemoTasksIfNeeded() ?? readJson(TASKS_KEY, []),
    saveTasks: async (tasks) => {
      writeJson(TASKS_KEY, tasks);
    },
    ...stableStore,
    openStable: () => {
      if (isEmbedded) {
        postEmbeddedWindowMessage("toggle-stable");
        return;
      }
      if (document.getElementById("stable-overlay")) {
        window.dispatchEvent(new CustomEvent("secretaryat-open-stable"));
        return;
      }
      window.location.href = "stable.html";
    },
  };

  window.stable = {
    minimize: () => {
      if (isEmbedded) {
        postEmbeddedWindowMessage("minimize");
        return;
      }
      window.close();
    },
    close: () => {
      if (isEmbedded) {
        postEmbeddedWindowMessage("close");
        return;
      }
      window.close();
    },
    ...stableStore,
  };

  function initEmbeddedDrag() {
    if (!isEmbedded) return;
    const dragRegion = document.querySelector(".chrome .drag-region");
    if (!dragRegion) return;

    let dragging = false;

    const stop = (event) => {
      if (!dragging) return;
      dragging = false;
      if (dragRegion.hasPointerCapture(event.pointerId)) {
        dragRegion.releasePointerCapture(event.pointerId);
      }
      window.parent.postMessage(
        { type: embeddedWindowType, action: "drag-end", clientX: event.clientX, clientY: event.clientY },
        "*",
      );
    };

    dragRegion.addEventListener("pointerdown", (event) => {
      if (event.button !== 0) return;
      dragging = true;
      dragRegion.setPointerCapture(event.pointerId);
      window.parent.postMessage(
        { type: embeddedWindowType, action: "drag-start", clientX: event.clientX, clientY: event.clientY },
        "*",
      );
      event.preventDefault();
    });

    dragRegion.addEventListener("pointermove", (event) => {
      if (!dragging) return;
      window.parent.postMessage(
        { type: embeddedWindowType, action: "drag", clientX: event.clientX, clientY: event.clientY },
        "*",
      );
    });

    dragRegion.addEventListener("pointerup", stop);
    dragRegion.addEventListener("pointercancel", stop);
  }

  function initEmbeddedResize() {
    if (!isEmbedded) return;
    const app = document.querySelector(isStablePage ? ".stable-app" : ".app");
    if (!app || app.querySelector(".embed-resize")) return;

    const handle = document.createElement("div");
    handle.className = "embed-resize";
    handle.setAttribute("aria-hidden", "true");
    app.append(handle);

    let origin = null;

    const stop = (event) => {
      origin = null;
      if (handle.hasPointerCapture(event.pointerId)) {
        handle.releasePointerCapture(event.pointerId);
      }
    };

    handle.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      event.stopPropagation();
      origin = { x: event.clientX, y: event.clientY };
      handle.setPointerCapture(event.pointerId);
      window.parent.postMessage(
        {
          type: embeddedWindowType,
          action: "resize-start",
          clientX: event.clientX,
          clientY: event.clientY,
        },
        "*",
      );
    });

    handle.addEventListener("pointermove", (event) => {
      if (!origin) return;
      window.parent.postMessage(
        {
          type: embeddedWindowType,
          action: "resize",
          deltaX: event.clientX - origin.x,
          deltaY: event.clientY - origin.y,
        },
        "*",
      );
    });

    handle.addEventListener("pointerup", stop);
    handle.addEventListener("pointercancel", stop);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      initEmbeddedResize();
      initEmbeddedDrag();
    });
  } else {
    initEmbeddedResize();
    initEmbeddedDrag();
  }
})();
