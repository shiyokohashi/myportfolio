(() => {
  const stableList = document.getElementById("stable-list");
  const stableEmptyHint = document.getElementById("stable-empty-hint");
  const minimizeBtn = document.getElementById("minimize-btn");
  const closeBtn = document.getElementById("close-btn");

  if (!stableList || !stableEmptyHint) return;

  /** @type {Array<{id: string, text: string, kind: string, completedAt: number}>} */
  let stable = [];

  minimizeBtn?.addEventListener("click", () => window.stable?.minimize());
  closeBtn?.addEventListener("click", () => window.stable?.close());

  window.stable?.onStableChanged(() => {
    loadStable();
  });

  async function loadStable() {
    try {
      const saved = await window.stable.loadStable();
      stable = Array.isArray(saved) ? saved : [];
      renderStable();
    } catch (error) {
      console.error(error);
    }
  }

  async function removeFromStable(id) {
    stable = stable.filter((horse) => horse.id !== id);
    try {
      await window.stable.saveStable(stable);
    } catch (error) {
      console.error(error);
    }
    renderStable();
  }

  function renderStable() {
    window.SecretaryatStableView.renderStableList(
      stable,
      stableList,
      stableEmptyHint,
      removeFromStable,
    );
  }

  loadStable();
})();
