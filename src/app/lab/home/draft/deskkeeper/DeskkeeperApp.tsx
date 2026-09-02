"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";

import { GlassFolder } from "../GlassFolder";
import "./deskkeeper-web.css";

type MockFile = {
  id: string;
  name: string;
  thumb: string;
  size: number;
  modifiedAt: number;
};

type MockFolder = {
  path: string;
  name: string;
};

type UndoAction =
  | { type: "trash"; file: MockFile; from: "desktop" | "review" }
  | { type: "move"; file: MockFile; folderPath: string; from: "desktop" | "review" }
  | { type: "review"; file: MockFile };

const INITIAL_FILES: MockFile[] = [
  {
    id: "aeon",
    name: "aeon-poster.png",
    thumb: "/images/projects/aeon/interaction-design.png",
    size: 1_240_000,
    modifiedAt: Date.now() - 86_400_000,
  },
  {
    id: "ttg",
    name: "ttg-recruitment.png",
    thumb: "/images/projects/triton-trading/recruitment-collage.png",
    size: 890_000,
    modifiedAt: Date.now() - 172_800_000,
  },
  {
    id: "graduaid",
    name: "graduaid-overview.png",
    thumb: "/images/projects/graduaid/overview.png",
    size: 2_100_000,
    modifiedAt: Date.now() - 3_600_000,
  },
  {
    id: "desk",
    name: "deskkeeper-icon.png",
    thumb: "/images/projects/deskkeeper/icon.png",
    size: 48_000,
    modifiedAt: Date.now() - 600_000,
  },
];

const INITIAL_FOLDERS: MockFolder[] = [
  { path: "/Desktop/Projects", name: "Projects" },
  { path: "/Desktop/Paintings", name: "Paintings" },
  { path: "/Desktop/Archive", name: "Archive" },
];

type Mode = "files" | "review";

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(ms: number) {
  return new Date(ms).toLocaleString();
}

export function DeskkeeperApp() {
  const [mode, setMode] = useState<Mode>("files");
  const [files, setFiles] = useState<MockFile[]>(INITIAL_FILES);
  const [reviewItems, setReviewItems] = useState<MockFile[]>([]);
  const [fileIndex, setFileIndex] = useState(0);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [undoStack, setUndoStack] = useState<UndoAction[]>([]);
  const [busy, setBusy] = useState(false);

  const currentFile = files[fileIndex] ?? null;
  const currentReview = reviewItems[reviewIndex] ?? null;
  const isFileMode = mode === "files";
  const activeItem = isFileMode ? currentFile : currentReview;

  const countLabel = isFileMode
    ? files.length === 0
      ? "Desktop is clear"
      : `${fileIndex + 1} of ${files.length}`
    : reviewItems.length === 0
      ? "Nothing to review"
      : `${reviewIndex + 1} of ${reviewItems.length}`;

  const canUndo = undoStack.length > 0;

  const runAction = useCallback(async (action: () => void) => {
    if (!activeItem || busy) return;
    setBusy(true);
    try {
      action();
    } finally {
      window.setTimeout(() => setBusy(false), 120);
    }
  }, [activeItem, busy]);

  const handleSkip = () => {
    if (isFileMode && currentFile) {
      setFileIndex((idx) => (idx + 1) % Math.max(files.length, 1));
      return;
    }
    if (currentReview) {
      setReviewIndex((idx) => (idx + 1) % Math.max(reviewItems.length, 1));
    }
  };

  const handleTrash = () => {
    void runAction(() => {
      if (isFileMode && currentFile) {
        setUndoStack((stack) => [...stack, { type: "trash", file: currentFile, from: "desktop" }]);
        setFiles((prev) => prev.filter((f) => f.id !== currentFile.id));
        setFileIndex((idx) => Math.min(idx, Math.max(files.length - 2, 0)));
        return;
      }
      if (currentReview) {
        setUndoStack((stack) => [...stack, { type: "trash", file: currentReview, from: "review" }]);
        setReviewItems((prev) => prev.filter((f) => f.id !== currentReview.id));
        setReviewIndex((idx) => Math.min(idx, Math.max(reviewItems.length - 2, 0)));
      }
    });
  };

  const handleReview = () => {
    void runAction(() => {
      if (!currentFile) return;
      setUndoStack((stack) => [...stack, { type: "review", file: currentFile }]);
      setReviewItems((prev) => [...prev, currentFile]);
      setFiles((prev) => prev.filter((f) => f.id !== currentFile.id));
      setFileIndex((idx) => Math.min(idx, Math.max(files.length - 2, 0)));
    });
  };

  const handleMoveBack = () => {
    void runAction(() => {
      if (!currentReview) return;
      setFiles((prev) => [...prev, currentReview]);
      setReviewItems((prev) => prev.filter((f) => f.id !== currentReview.id));
      setReviewIndex((idx) => Math.min(idx, Math.max(reviewItems.length - 2, 0)));
      setMode("files");
    });
  };

  const handleMoveToFolder = (folderPath: string) => {
    void runAction(() => {
      const item = isFileMode ? currentFile : currentReview;
      if (!item) return;
      setUndoStack((stack) => [
        ...stack,
        { type: "move", file: item, folderPath, from: isFileMode ? "desktop" : "review" },
      ]);
      if (isFileMode) {
        setFiles((prev) => prev.filter((f) => f.id !== item.id));
        setFileIndex((idx) => Math.min(idx, Math.max(files.length - 2, 0)));
      } else {
        setReviewItems((prev) => prev.filter((f) => f.id !== item.id));
        setReviewIndex((idx) => Math.min(idx, Math.max(reviewItems.length - 2, 0)));
      }
    });
  };

  const handleUndo = useCallback(() => {
    if (!canUndo || busy) return;
    setUndoStack((stack) => {
      const last = stack[stack.length - 1];
      if (!last) return stack;

      if (last.type === "trash" || last.type === "move") {
        if (last.from === "desktop") {
          setFiles((prev) => [...prev, last.file]);
          setMode("files");
        } else {
          setReviewItems((prev) => [...prev, last.file]);
          setMode("review");
        }
      } else if (last.type === "review") {
        setFiles((prev) => [...prev, last.file]);
        setReviewItems((prev) => prev.filter((f) => f.id !== last.file.id));
        setMode("files");
      }

      return stack.slice(0, -1);
    });
  }, [busy, canUndo]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "z") {
        event.preventDefault();
        handleUndo();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleUndo]);

  const triageDisabled = !activeItem || busy;

  const folderGrid = useMemo(
    () => (
      <div className="dk-folder-grid">
        {INITIAL_FOLDERS.map((folder) => (
          <button
            key={folder.path}
            type="button"
            className="dk-folder is-glass-folder-hoverable"
            disabled={triageDisabled}
            onClick={() => handleMoveToFolder(folder.path)}
          >
            <GlassFolder size="grid" />
            <span className="dk-folder-name">{folder.name}</span>
          </button>
        ))}
      </div>
    ),
    [triageDisabled, handleMoveToFolder],
  );

  return (
    <div className="dk-app">
      <header className="dk-header">
        <div className="dk-header-start">
          <h1>deskkeeper</h1>
          <div className="dk-mode-tabs">
            <button
              type="button"
              className={isFileMode ? "is-active" : undefined}
              onClick={() => setMode("files")}
            >
              Files
            </button>
            <button
              type="button"
              className={!isFileMode ? "is-active" : undefined}
              onClick={() => setMode("review")}
            >
              Review
            </button>
          </div>
        </div>
        <span className="dk-count">{countLabel}</span>
      </header>

      <main className="dk-main">
        {activeItem ? (
          <div className="dk-file-card">
            <div className="dk-file-preview">
              <Image
                src={activeItem.thumb}
                alt=""
                width={480}
                height={320}
                className="dk-file-thumb"
                unoptimized
              />
            </div>
            <p className="dk-file-name">{activeItem.name}</p>
            <dl className="dk-file-meta">
              <div>
                <dt>Size</dt>
                <dd>{formatSize(activeItem.size)}</dd>
              </div>
              <div>
                <dt>Modified</dt>
                <dd>{formatDate(activeItem.modifiedAt)}</dd>
              </div>
            </dl>
          </div>
        ) : (
          <p className="dk-status">
            {isFileMode ? "No loose files on your Desktop." : "Nothing in Review Later."}
          </p>
        )}
      </main>

      <footer className="dk-footer">
        <div className="dk-actions">
          <button type="button" onClick={handleSkip} disabled={triageDisabled}>
            Skip
          </button>
          <button type="button" onClick={handleTrash} disabled={triageDisabled}>
            Trash
          </button>
          {isFileMode ? (
            <button type="button" onClick={handleReview} disabled={triageDisabled}>
              Review
            </button>
          ) : (
            <button type="button" onClick={handleMoveBack} disabled={triageDisabled}>
              Move back
            </button>
          )}
          <button
            type="button"
            onClick={handleUndo}
            disabled={!canUndo || busy}
            className="dk-undo"
          >
            Undo
          </button>
        </div>
        {folderGrid}
      </footer>
    </div>
  );
}
