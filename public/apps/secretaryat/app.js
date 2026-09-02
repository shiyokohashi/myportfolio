(() => {
  const APPLE_SRC = "assets/apple.png";

  const FRAMES = {
    graze: "assets/horse/frames/graze.png",
    stand: "assets/horse/frames/stand.png",
    runStrip: "assets/horse/frames/run-strip.png",
    runCount: 12,
    frameW: 366,
    frameH: 275,
  };

  const HORSE_TYPES = {
    white: FRAMES,
    brown: {
      graze: "assets/horse/brown/frames/graze.png",
      stand: "assets/horse/brown/frames/stand.png",
      runStrip: "assets/horse/brown/frames/run-strip.png",
      runCount: 12,
      frameW: 236,
      frameH: 212,
    },
    black: {
      graze: "assets/horse/black/frames/graze.png",
      stand: "assets/horse/black/frames/stand.png",
      runStrip: "assets/horse/black/frames/run-strip.png",
      runCount: 12,
      frameW: 236,
      frameH: 214,
    },
    tan: {
      graze: "assets/horse/tan/frames/graze.png",
      stand: "assets/horse/tan/frames/stand.png",
      runStrip: "assets/horse/tan/frames/run-strip.png",
      runCount: 12,
      frameW: 236,
      frameH: 221,
    },
    grey: {
      graze: "assets/horse/grey/frames/graze.png",
      stand: "assets/horse/grey/frames/stand.png",
      runStrip: "assets/horse/grey/frames/run-strip.png",
      runCount: 12,
      frameW: 236,
      frameH: 212,
    },
  };

  const HORSE_KINDS = ["white", "brown", "black", "tan", "grey"];

  function pickHorse() {
    // Slightly favor white over the other coats
    const roll = Math.random();
    const kind =
      roll < 0.32
        ? "white"
        : HORSE_KINDS[1 + Math.floor(Math.random() * (HORSE_KINDS.length - 1))];
    return { kind, frames: HORSE_TYPES[kind] };
  }

  const form = document.getElementById("task-form");
  const input = document.getElementById("task-input");
  const list = document.getElementById("task-list");
  const emptyHint = document.getElementById("empty-hint");
  const feedHorsesBtn = document.getElementById("feed-horses-btn");
  const seeStableBtn = document.getElementById("see-stable-btn");
  const horsesLayer = document.getElementById("horses");
  const applesLayer = document.getElementById("apples");
  const horseTemplate = document.getElementById("horse-template");
  const minimizeBtn = document.getElementById("minimize-btn");
  const closeBtn = document.getElementById("close-btn");
  const stableOverlay = document.getElementById("stable-overlay");
  const stableList = document.getElementById("stable-list");
  const stableEmptyHint = document.getElementById("stable-empty-hint");
  const stableCloseBtn = document.getElementById("stable-close-btn");
  const isEmbedded = document.documentElement.classList.contains("is-embedded");

  /** @type {Map<string, any>} */
  const tasks = new Map();
  /** @type {Array<{id: string, text: string, kind: string, completedAt: number}>} */
  let stable = [];
  let feeding = false;
  let restoring = false;

  const appleImage = new Image();
  appleImage.src = APPLE_SRC;

  Object.values(HORSE_TYPES).forEach((frames) => {
    [frames.graze, frames.stand, frames.runStrip].forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  });

  minimizeBtn.addEventListener("click", () => window.pasture?.minimize());
  closeBtn.addEventListener("click", () => window.pasture?.close());

  seeStableBtn.addEventListener("click", () => {
    if (isEmbedded) {
      window.pasture?.openStable();
      return;
    }
    if (stableOverlay && !stableOverlay.hidden) {
      closeStableOverlay();
      return;
    }
    window.pasture?.openStable();
  });

  stableCloseBtn?.addEventListener("click", closeStableOverlay);

  window.addEventListener("secretaryat-open-stable", openStableOverlay);

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && stableOverlay && !stableOverlay.hidden) {
      closeStableOverlay();
    }
  });

  feedHorsesBtn.addEventListener("click", () => {
    rainApples();
  });

  function wait(ms) {
    return new Promise((resolve) => window.setTimeout(resolve, ms));
  }

  function pauseGrazing(record) {
    if (record.wanderTimer) {
      window.clearTimeout(record.wanderTimer);
      record.wanderTimer = null;
    }
  }

  function rainApples() {
    if (feeding) return;
    const count = Math.ceil(tasks.size * 1.5);
    if (count === 0) return;

    feeding = true;
    feedHorsesBtn.disabled = true;
    for (let i = 0; i < count; i += 1) {
      window.setTimeout(() => spawnApple(), i * 90 + Math.random() * 120);
    }

    window.setTimeout(() => {
      feeding = false;
      feedHorsesBtn.disabled = false;
    }, count * 90 + 4500);
  }

  function spawnApple() {
    const x = 6 + Math.random() * 88;
    const landY = 72 + Math.random() * 22;
    const duration = 1400 + Math.random() * 900;
    const delay = Math.random() * 200;
    const spinStart = Math.random() * 360;
    const spinDelta = (Math.random() > 0.5 ? 1 : -1) * (180 + Math.random() * 540);

    const apple = document.createElement("div");
    apple.className = "apple";
    apple.style.setProperty("--x", `${x}%`);
    apple.style.setProperty("--fall-to", `${landY}%`);
    apple.style.setProperty("--duration", `${duration}ms`);
    apple.style.setProperty("--delay", `${delay}ms`);
    apple.style.setProperty("--spin-start", `${spinStart}deg`);
    apple.style.setProperty("--spin-end", `${spinStart + spinDelta}deg`);

    apple.addEventListener(
      "animationend",
      (event) => {
        if (event.animationName !== "apple-fall") return;
        offerAppleToHorse(apple, x, landY);
      },
      { once: true }
    );

    applesLayer.append(apple);
  }

  function offerAppleToHorse(apple, appleX, appleY) {
    let nearest = null;
    let nearestDist = Infinity;

    for (const record of tasks.values()) {
      if (!record.active || record.completing) continue;
      const horseX = parseFloat(record.horse.style.getPropertyValue("--x"));
      const horseY = parseFloat(record.horse.style.getPropertyValue("--y"));
      const dist = Math.hypot(horseX - appleX, horseY - appleY);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearest = record;
      }
    }

    if (!nearest) {
      apple.remove();
      return;
    }

    queueFeed(nearest, apple, appleX, appleY);
  }

  function queueFeed(record, apple, appleX, appleY) {
    if (!record.feedQueue) record.feedQueue = [];
    record.feedQueue.push({ apple, appleX, appleY });
    if (!record.feeding) processFeedQueue(record);
  }

  async function processFeedQueue(record) {
    record.feeding = true;
    pauseGrazing(record);

    while (record.feedQueue?.length) {
      if (!record.active || record.completing) {
        record.feedQueue.forEach(({ apple }) => apple.remove());
        record.feedQueue = [];
        break;
      }
      const feed = record.feedQueue.shift();
      await munchApple(record, feed.apple, feed.appleX, feed.appleY);
    }

    record.feeding = false;
    if (record.active && !record.completing) {
      record.horse.dataset.state = "grazing";
      startGrazing(record);
    }
  }

  async function munchApple(record, apple, appleX, appleY) {
    const horse = record.horse;
    horse.dataset.state = "feeding";
    horse.style.setProperty(
      "--facing",
      appleX >= parseFloat(horse.style.getPropertyValue("--x")) ? "1" : "-1"
    );
    horse.style.setProperty("--x", `${appleX}%`);
    horse.style.setProperty("--y", `${Math.min(appleY + 2, 96)}%`);
    setPose(horse, "graze", record.frames);

    await wait(2200);

    if (!record.active || record.completing || !apple.isConnected) {
      apple.remove();
      return;
    }

    apple.classList.add("munching");
    horse.append(apple);
    apple.style.position = "absolute";
    apple.style.left = "58%";
    apple.style.top = "78%";
    apple.style.setProperty("--x", "");
    apple.style.setProperty("--fall-to", "");
    apple.style.animation = "none";

    await wait(2200);
    apple.remove();
  }

  function formatStableButtonLabel() {
    return stable.length > 0 ? `See Stable (${stable.length})` : "See Stable";
  }

  function updateStableButtonLabel() {
    seeStableBtn.textContent = formatStableButtonLabel();
  }

  function renderStableOverlay() {
    if (!stableList || !stableEmptyHint || !window.SecretaryatStableView) return;
    window.SecretaryatStableView.renderStableList(
      stable,
      stableList,
      stableEmptyHint,
      async (id) => {
        stable = stable.filter((horse) => horse.id !== id);
        await persistStable();
        renderStableOverlay();
      },
    );
  }

  async function openStableOverlay() {
    if (!stableOverlay) {
      window.location.href = "stable.html";
      return;
    }
    await loadStable();
    renderStableOverlay();
    stableOverlay.hidden = false;
    stableOverlay.setAttribute("aria-hidden", "false");
    seeStableBtn.setAttribute("aria-pressed", "true");
  }

  function closeStableOverlay() {
    if (!stableOverlay) return;
    stableOverlay.hidden = true;
    stableOverlay.setAttribute("aria-hidden", "true");
    seeStableBtn.setAttribute("aria-pressed", "false");
  }

  window.pasture?.onStableChanged(() => {
    loadStable();
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    addTask(text);
    input.value = "";
    input.focus();
  });

  function addTask(text, saved = null) {
    const id = saved?.id || crypto.randomUUID();

    const item = document.createElement("li");
    item.className = "task-item";
    item.dataset.id = id;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.setAttribute("aria-label", `Complete: ${text}`);

    const label = document.createElement("p");
    label.className = "task-text";
    label.textContent = text;

    item.append(checkbox, label);
    list.prepend(item);

    const { node: horse, kind, frames } = spawnHorse(id, text, saved);
    const record = {
      el: item,
      horse,
      kind,
      frames,
      wanderTimer: null,
      active: true,
      completing: false,
      feeding: false,
      feedQueue: [],
    };
    tasks.set(id, record);
    startGrazing(record);
    updateEmptyState();
    persistTasks();

    checkbox.addEventListener("change", () => {
      if (checkbox.checked) completeTask(id);
    });
  }

  function spawnHorse(id, text, saved = null) {
    const kind = saved?.kind || pickHorse().kind;
    const frames = HORSE_TYPES[kind];
    const node = horseTemplate.content.firstElementChild.cloneNode(true);
    node.dataset.id = id;
    node.dataset.horse = kind;
    node.dataset.state = "grazing";
    node.style.setProperty("--scale", "1");
    node.style.setProperty(
      "--facing",
      saved?.facing != null ? String(saved.facing) : Math.random() > 0.5 ? "1" : "-1"
    );

    const sprite = node.querySelector(".horse-sprite");
    sprite.style.backgroundImage = `url("${frames.graze}")`;

    const caption = node.querySelector(".horse-caption");
    caption.textContent = text;
    caption.title = text;

    const pos =
      saved?.x != null && saved?.y != null
        ? { x: saved.x, y: saved.y }
        : randomPasturePosition();
    node.style.setProperty("--x", `${pos.x}%`);
    node.style.setProperty("--y", `${pos.y}%`);

    horsesLayer.append(node);
    return { node, kind, frames };
  }

  function randomPasturePosition() {
    // Roam the full green field; stop around 70% from the top (sky stays clear)
    return {
      x: 8 + Math.random() * 84,
      y: 70 + Math.random() * 25,
    };
  }

  function setPose(horse, pose, frames) {
    const sprite = horse.querySelector(".horse-sprite");
    sprite.style.backgroundImage = `url("${frames[pose]}")`;
  }

  /** Slow wander while mostly in graze pose — “graze around” the box */
  function startGrazing(record) {
    const step = () => {
      if (!record.active || record.feeding || record.horse.dataset.state !== "grazing")
        return;

      const next = randomPasturePosition();
      const currentX = parseFloat(record.horse.style.getPropertyValue("--x"));
      record.horse.style.setProperty(
        "--facing",
        next.x >= currentX ? "1" : "-1"
      );

      // Brief stand while shifting, then back to grazing
      setPose(record.horse, "stand", record.frames);
      record.horse.style.setProperty("--x", `${next.x}%`);
      record.horse.style.setProperty("--y", `${next.y}%`);

      window.setTimeout(() => {
        if (!record.active) return;
        setPose(record.horse, "graze", record.frames);
      }, 2800 + Math.random() * 1600);

      record.wanderTimer = window.setTimeout(
        step,
        12000 + Math.random() * 8000
      );
    };

    record.wanderTimer = window.setTimeout(step, 6000 + Math.random() * 5000);
  }

  async function completeTask(id) {
    const record = tasks.get(id);
    if (!record || record.completing) return;
    record.completing = true;
    record.active = false;
    if (record.wanderTimer) window.clearTimeout(record.wanderTimer);
    if (record.feedQueue?.length) {
      record.feedQueue.forEach(({ apple }) => apple.remove());
      record.feedQueue = [];
    }
    record.feeding = false;

    const horse = record.horse;
    const rect = horse.getBoundingClientRect();
    const scale = 1;
    const screenX = window.screenX + rect.left + rect.width / 2;
    const screenY = window.screenY + rect.top + rect.height / 2;

    const runRight = Math.random() >= 0.5;
    const direction = runRight ? 1 : -1;

    record.el.classList.add("leaving");
    record.el.querySelector("input")?.setAttribute("disabled", "true");
    horse.dataset.state = "leaving";

    try {
      await window.pasture.escapeHorse({
        strip: record.frames.runStrip,
        frameCount: record.frames.runCount,
        frameW: record.frames.frameW,
        frameH: record.frames.frameH,
        fps: 12,
        direction,
        screenX,
        screenY,
        sanitizeStrip: record.kind !== "white",
      });
    } catch (error) {
      console.error(error);
    }

    const text = record.el.querySelector(".task-text")?.textContent || "";
    await archiveToStable({ id, text, kind: record.kind });

    horse.remove();
    record.el.remove();
    tasks.delete(id);
    updateEmptyState();
    persistTasks();
  }

  function updateEmptyState() {
    emptyHint.hidden = tasks.size > 0;
  }

  async function archiveToStable(horse) {
    stable.unshift({
      id: horse.id,
      text: horse.text,
      kind: horse.kind,
      completedAt: Date.now(),
    });
    await persistStable();
    updateStableButtonLabel();
  }

  async function persistStable() {
    try {
      await window.pasture?.saveStable(stable);
    } catch (error) {
      console.error(error);
    }
  }

  async function loadStable() {
    try {
      const saved = await window.pasture.loadStable();
      if (!Array.isArray(saved)) return;
      stable = saved;
      updateStableButtonLabel();
      if (stableOverlay && !stableOverlay.hidden) {
        renderStableOverlay();
      }
    } catch (error) {
      console.error(error);
    }
  }

  function serializeTasks() {
    return Array.from(tasks.values()).map((record) => ({
      id: record.el.dataset.id,
      text: record.el.querySelector(".task-text")?.textContent || "",
      kind: record.kind,
      x: parseFloat(record.horse.style.getPropertyValue("--x")),
      y: parseFloat(record.horse.style.getPropertyValue("--y")),
      facing: parseFloat(record.horse.style.getPropertyValue("--facing")),
    }));
  }

  function persistTasks() {
    if (restoring) return;
    window.pasture?.saveTasks(serializeTasks()).catch((error) => {
      console.error(error);
    });
  }

  async function restoreTasks() {
    try {
      restoring = true;
      const saved = await window.pasture.loadTasks();
      if (!Array.isArray(saved)) return;
      for (const task of saved.slice().reverse()) {
        if (!task?.text) continue;
        addTask(task.text, task);
      }
    } catch (error) {
      console.error(error);
    } finally {
      restoring = false;
    }
  }

  restoreTasks().finally(() => input.focus());
  loadStable();

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") persistTasks();
  });
})();
