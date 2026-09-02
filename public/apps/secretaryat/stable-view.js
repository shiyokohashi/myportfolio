(() => {
  const HORSE_TYPES = {
    white: { graze: "assets/horse/frames/graze.png" },
    brown: { graze: "assets/horse/brown/frames/graze.png" },
    black: { graze: "assets/horse/black/frames/graze.png" },
    tan: { graze: "assets/horse/tan/frames/graze.png" },
    grey: { graze: "assets/horse/grey/frames/graze.png" },
  };

  function formatStableDate(timestamp) {
    return new Date(timestamp).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  }

  function renderStableList(stable, stableList, stableEmptyHint, onRemove) {
    if (!stableList || !stableEmptyHint) return;

    stableList.replaceChildren();
    for (const horse of stable) {
      const item = document.createElement("li");
      item.className = "stable-item";
      item.dataset.kind = horse.kind;

      const sprite = document.createElement("div");
      sprite.className = "stable-horse-sprite";
      sprite.setAttribute("aria-hidden", "true");
      const frames = HORSE_TYPES[horse.kind] || HORSE_TYPES.white;
      sprite.style.backgroundImage = `url("${frames.graze}")`;

      const body = document.createElement("div");
      body.className = "stable-item-body";

      const text = document.createElement("p");
      text.className = "stable-item-text";
      text.textContent = horse.text;

      const date = document.createElement("p");
      date.className = "stable-item-date";
      date.textContent = formatStableDate(horse.completedAt);

      body.append(text, date);

      const removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.className = "stable-remove";
      removeBtn.setAttribute("aria-label", `Remove ${horse.text} from stable`);
      removeBtn.textContent = "×";
      removeBtn.addEventListener("click", () => onRemove(horse.id));

      item.append(sprite, body, removeBtn);
      stableList.append(item);
    }

    stableEmptyHint.hidden = stable.length > 0;
  }

  window.SecretaryatStableView = {
    renderStableList,
    formatStableDate,
  };
})();
