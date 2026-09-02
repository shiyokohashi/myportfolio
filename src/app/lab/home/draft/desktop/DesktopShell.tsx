"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

import { ABOUT } from "@/data/about";
import { HOME_INTRO } from "@/data/home";
import { PROJECTS } from "@/data/projects";
import { AboutWindowContents } from "./AboutWindowContents";
import { DeskkeeperApp } from "../deskkeeper/DeskkeeperApp";
import { DesktopDock, type DockApp, type DockLink } from "./DesktopDock";
import { DesktopFileIcon } from "./DesktopFileIcon";
import { DesktopFolderIcon } from "./DesktopFolderIcon";
import { DESKTOP_FOLDERS, FOLDER_IDS, type FolderId } from "./desktopFolders";
import { DESKTOP_PROJECTS, DESKTOP_PROJECT_IDS, type DesktopProjectId } from "./desktopProjects";
import { DesktopWindow } from "./DesktopWindow";
import { FolderWindowContents } from "./FolderWindowContents";
import { HorseEscapeOverlay, type HorseEscapePayload } from "./HorseEscapeOverlay";
import { DesktopMenuBar } from "./DesktopMenuBar";
import { ResumeWindowContents } from "./ResumeWindowContents";

import { DesktopBottomChrome } from "./DesktopBottomChrome";
import { DesktopHoverTipProvider } from "./DesktopHoverTip";

import "./desktop.css";

type AppId = "secretaryat" | "deskkeeper";

type WindowState = {
  open: boolean;
  minimized: boolean;
  zIndex: number;
};

const APP_CONFIG: Record<
  AppId,
  {
    label: string;
    icon: string;
    title: string;
    hint: string;
    width: number;
    height: number;
    minWidth: number;
    minHeight: number;
    x: number;
    y: number;
  }
> = {
  secretaryat: {
    label: "Secretaryat",
    icon: "/images/projects/secretaryat/icon.png",
    title: "Secretaryat",
    hint: PROJECTS.find((project) => project.slug === "secretaryat")?.summary ?? "",
    width: 880,
    height: 648,
    minWidth: 600,
    minHeight: 440,
    x: 48,
    y: 20,
  },
  deskkeeper: {
    label: "Deskkeeper",
    icon: "/images/projects/deskkeeper/icon.png",
    title: "Deskkeeper",
    hint: PROJECTS.find((project) => project.slug === "deskkeeper")?.summary ?? "",
    width: 720,
    height: 560,
    minWidth: 480,
    minHeight: 400,
    x: 420,
    y: 48,
  },
};

const APP_IDS = Object.keys(APP_CONFIG) as AppId[];

const SECRETARYAT_AUTO_OPEN_KEY = "secretaryat-desktop-auto-opened";
const SECRETARYAT_AUTO_OPEN_DELAY_MS = 1000;
const SECRETARYAT_ASPECT = 880 / 648;
const SECRETARYAT_TOP_INSET = 24;
/** Dock offset (28px) + dock height (~88px) + breathing room (12px). */
const SECRETARYAT_BOTTOM_INSET = 140;
const SECRETARYAT_SIDE_INSET = 32;
const SECRETARYAT_FIT_SCALE = 0.9;

function fitSecretaryatWindow(canvasWidth: number, canvasHeight: number) {
  const { minWidth, minHeight } = APP_CONFIG.secretaryat;
  const availableHeight = canvasHeight - SECRETARYAT_TOP_INSET - SECRETARYAT_BOTTOM_INSET;
  const availableWidth = canvasWidth - SECRETARYAT_SIDE_INSET * 2;

  let height = Math.max(minHeight, availableHeight);
  let width = Math.round(height * SECRETARYAT_ASPECT);

  if (width > availableWidth) {
    width = availableWidth;
    height = Math.round(width / SECRETARYAT_ASPECT);
  }

  width = Math.round(Math.max(minWidth, Math.min(width, availableWidth)) * SECRETARYAT_FIT_SCALE);
  height = Math.round(Math.max(minHeight, Math.min(height, availableHeight)) * SECRETARYAT_FIT_SCALE);

  return {
    x: Math.max(SECRETARYAT_SIDE_INSET, Math.round((canvasWidth - width) / 2)),
    y: SECRETARYAT_TOP_INSET + Math.round((availableHeight - height) / 2),
    width,
    height,
  };
}

const GMAIL_COMPOSE_URL = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(ABOUT.connect.email)}`;

const INITIAL_APP_WINDOWS: Record<AppId, WindowState> = {
  secretaryat: { open: false, minimized: false, zIndex: 10 },
  deskkeeper: { open: false, minimized: false, zIndex: 11 },
};

const INITIAL_FOLDER_WINDOWS: Record<FolderId, WindowState> = {
  paintings: { open: false, minimized: false, zIndex: 5 },
  illustrations: { open: false, minimized: false, zIndex: 6 },
  journalism: { open: false, minimized: false, zIndex: 7 },
};

const INITIAL_APP_SIZES = {
  secretaryat: {
    width: APP_CONFIG.secretaryat.width,
    height: APP_CONFIG.secretaryat.height,
  },
  deskkeeper: {
    width: APP_CONFIG.deskkeeper.width,
    height: APP_CONFIG.deskkeeper.height,
  },
} as const;

const INITIAL_FOLDER_SIZES = Object.fromEntries(
  FOLDER_IDS.map((id) => [id, { width: DESKTOP_FOLDERS[id].width, height: DESKTOP_FOLDERS[id].height }]),
) as Record<FolderId, { width: number; height: number }>;

const INITIAL_APP_POSITIONS = {
  secretaryat: { x: APP_CONFIG.secretaryat.x, y: APP_CONFIG.secretaryat.y },
  deskkeeper: { x: APP_CONFIG.deskkeeper.x, y: APP_CONFIG.deskkeeper.y },
} as const;

const INITIAL_FOLDER_WINDOW_POSITIONS = Object.fromEntries(
  FOLDER_IDS.map((id) => [id, { x: DESKTOP_FOLDERS[id].windowX, y: DESKTOP_FOLDERS[id].windowY }]),
) as Record<FolderId, { x: number; y: number }>;

function computeFolderIconPositions(canvasWidth: number): Record<FolderId, { x: number; y: number }> {
  return FOLDER_IDS.reduce(
    (acc, id) => {
      const folder = DESKTOP_FOLDERS[id];
      acc[id] = {
        x: canvasWidth - folder.iconRight - 80,
        y: folder.iconY,
      };
      return acc;
    },
    {} as Record<FolderId, { x: number; y: number }>,
  );
}

const INITIAL_FOLDER_ICON_Z: Record<FolderId, number> = {
  paintings: 8,
  illustrations: 9,
  journalism: 10,
};

const INITIAL_PROJECT_WINDOWS = Object.fromEntries(
  DESKTOP_PROJECT_IDS.map((id) => [id, { open: false, minimized: false, zIndex: 3 }]),
) as Record<DesktopProjectId, WindowState>;

const INITIAL_PROJECT_SIZES = Object.fromEntries(
  DESKTOP_PROJECT_IDS.map((id) => [
    id,
    { width: DESKTOP_PROJECTS[id].width, height: DESKTOP_PROJECTS[id].height },
  ]),
) as Record<DesktopProjectId, { width: number; height: number }>;

const INITIAL_PROJECT_WINDOW_POSITIONS = Object.fromEntries(
  DESKTOP_PROJECT_IDS.map((id) => [
    id,
    { x: DESKTOP_PROJECTS[id].windowX, y: DESKTOP_PROJECTS[id].windowY },
  ]),
) as Record<DesktopProjectId, { x: number; y: number }>;

const INITIAL_PROJECT_ICON_POSITIONS = Object.fromEntries(
  DESKTOP_PROJECT_IDS.map((id) => [
    id,
    { x: DESKTOP_PROJECTS[id].iconX, y: DESKTOP_PROJECTS[id].iconY },
  ]),
) as Record<DesktopProjectId, { x: number; y: number }>;

const INITIAL_PROJECT_ICON_Z = Object.fromEntries(
  DESKTOP_PROJECT_IDS.map((id, index) => [id, index + 1]),
) as Record<DesktopProjectId, number>;

const RESUME_WINDOW_DEFAULT = {
  width: 680,
  height: 820,
  minWidth: 420,
  minHeight: 360,
  x: 240,
  y: 56,
};

const ABOUT_FILE_DEFAULT = {
  iconX: 48,
  iconY: 52,
  windowX: 200,
  windowY: 88,
  width: 420,
  height: 360,
  minWidth: 320,
  minHeight: 260,
};

const STABLE_WINDOW_DEFAULT = {
  width: 300,
  height: 480,
  minWidth: 240,
  minHeight: 280,
  x: 160,
  y: 88,
};

/** Stable sits on Secretaryat's right edge, overlapping slightly below the header. */
const STABLE_TOP_INSET = 40;
const STABLE_OVERLAP = 48;
const STABLE_WIDTH_RATIO = 0.34;
const STABLE_MIN_WIDTH = 240;
const STABLE_MAX_WIDTH = 320;

function fitStableBesideSecretaryat(
  secretaryatPosition: { x: number; y: number },
  secretaryatSize: { width: number; height: number },
  canvasWidth: number,
  canvasHeight: number,
) {
  const width = Math.round(
    Math.max(STABLE_MIN_WIDTH, Math.min(STABLE_MAX_WIDTH, secretaryatSize.width * STABLE_WIDTH_RATIO)),
  );
  const height = Math.max(STABLE_WINDOW_DEFAULT.minHeight, secretaryatSize.height - STABLE_TOP_INSET);
  const x = secretaryatPosition.x + secretaryatSize.width - STABLE_OVERLAP;
  const y = secretaryatPosition.y + STABLE_TOP_INSET;

  return {
    width,
    height,
    x: Math.max(8, Math.min(x, canvasWidth - width - 8)),
    y: Math.max(8, Math.min(y, canvasHeight - height - SECRETARYAT_BOTTOM_INSET)),
  };
}

type DesktopShellProps = {
  openSecretaryatOnLoad?: boolean;
  showMenuBar?: boolean;
  showAboutFile?: boolean;
  showIterations?: boolean;
};

export function DesktopShell({
  openSecretaryatOnLoad = false,
  showMenuBar = false,
  showAboutFile = false,
  showIterations = false,
}: DesktopShellProps) {
  const [appWindows, setAppWindows] = useState(INITIAL_APP_WINDOWS);
  const [folderWindows, setFolderWindows] = useState(INITIAL_FOLDER_WINDOWS);
  const [appSizes, setAppSizes] = useState(INITIAL_APP_SIZES);
  const [folderSizes, setFolderSizes] = useState(INITIAL_FOLDER_SIZES);
  const [appPositions, setAppPositions] = useState(INITIAL_APP_POSITIONS);
  const [folderWindowPositions, setFolderWindowPositions] = useState(INITIAL_FOLDER_WINDOW_POSITIONS);
  const [folderIconPositions, setFolderIconPositions] = useState<Record<FolderId, { x: number; y: number }> | null>(
    null,
  );
  const [folderIconZ, setFolderIconZ] = useState(INITIAL_FOLDER_ICON_Z);
  const [projectWindows, setProjectWindows] = useState(INITIAL_PROJECT_WINDOWS);
  const [projectSizes, setProjectSizes] = useState(INITIAL_PROJECT_SIZES);
  const [projectWindowPositions, setProjectWindowPositions] = useState(INITIAL_PROJECT_WINDOW_POSITIONS);
  const [projectIconPositions, setProjectIconPositions] = useState(INITIAL_PROJECT_ICON_POSITIONS);
  const [projectIconZ, setProjectIconZ] = useState(INITIAL_PROJECT_ICON_Z);
  const [resumeWindow, setResumeWindow] = useState<WindowState>({
    open: false,
    minimized: false,
    zIndex: 14,
  });
  const [resumeSize, setResumeSize] = useState({
    width: RESUME_WINDOW_DEFAULT.width,
    height: RESUME_WINDOW_DEFAULT.height,
  });
  const [resumePosition, setResumePosition] = useState({
    x: RESUME_WINDOW_DEFAULT.x,
    y: RESUME_WINDOW_DEFAULT.y,
  });
  const [aboutWindow, setAboutWindow] = useState<WindowState>({
    open: false,
    minimized: false,
    zIndex: 13,
  });
  const [aboutSize, setAboutSize] = useState({
    width: ABOUT_FILE_DEFAULT.width,
    height: ABOUT_FILE_DEFAULT.height,
  });
  const [aboutPosition, setAboutPosition] = useState({
    x: ABOUT_FILE_DEFAULT.windowX,
    y: ABOUT_FILE_DEFAULT.windowY,
  });
  const [aboutIconPosition, setAboutIconPosition] = useState({
    x: ABOUT_FILE_DEFAULT.iconX,
    y: ABOUT_FILE_DEFAULT.iconY,
  });
  const [aboutIconZ, setAboutIconZ] = useState(0);
  const [stableWindow, setStableWindow] = useState<WindowState>({
    open: false,
    minimized: false,
    zIndex: 15,
  });
  const [stableSize, setStableSize] = useState({
    width: STABLE_WINDOW_DEFAULT.width,
    height: STABLE_WINDOW_DEFAULT.height,
  });
  const [stablePosition, setStablePosition] = useState({
    x: STABLE_WINDOW_DEFAULT.x,
    y: STABLE_WINDOW_DEFAULT.y,
  });
  const [escapePayload, setEscapePayload] = useState<HorseEscapePayload | null>(null);
  const zCounter = useRef(12);
  const folderIconZCounter = useRef(10);
  const projectIconZCounter = useRef(DESKTOP_PROJECT_IDS.length);
  const aboutIconZCounter = useRef(0);
  const appSizesRef = useRef(appSizes);
  const appPositionsRef = useRef(appPositions);
  const stableSizeRef = useRef(stableSize);
  const stablePositionRef = useRef(stablePosition);
  const resizeSession = useRef<{
    width: number;
    height: number;
    clientX: number;
    clientY: number;
  } | null>(null);
  const dragSession = useRef<{
    originX: number;
    originY: number;
    clientX: number;
    clientY: number;
  } | null>(null);
  const stableResizeSession = useRef<{
    width: number;
    height: number;
    clientX: number;
    clientY: number;
  } | null>(null);
  const stableDragSession = useRef<{
    originX: number;
    originY: number;
    clientX: number;
    clientY: number;
  } | null>(null);
  const secretaryatIframeRef = useRef<HTMLIFrameElement>(null);
  const secretaryatAutoOpenedRef = useRef(false);
  const stableIframeRef = useRef<HTMLIFrameElement>(null);
  const stableWindowRef = useRef(stableWindow);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  appSizesRef.current = appSizes;
  appPositionsRef.current = appPositions;
  stableSizeRef.current = stableSize;
  stablePositionRef.current = stablePosition;
  stableWindowRef.current = stableWindow;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const syncCanvas = () => {
      setCanvasSize({
        width: canvas.clientWidth,
        height: canvas.clientHeight,
      });
      setFolderIconPositions((prev) => prev ?? computeFolderIconPositions(canvas.clientWidth));
    };

    syncCanvas();
    const observer = new ResizeObserver(syncCanvas);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!openSecretaryatOnLoad || canvasSize.width === 0 || canvasSize.height === 0) return;
    if (secretaryatAutoOpenedRef.current) return;
    if (sessionStorage.getItem(SECRETARYAT_AUTO_OPEN_KEY) === "1") return;

    const timer = window.setTimeout(() => {
      if (secretaryatAutoOpenedRef.current) return;
      if (sessionStorage.getItem(SECRETARYAT_AUTO_OPEN_KEY) === "1") return;

      secretaryatAutoOpenedRef.current = true;
      sessionStorage.setItem(SECRETARYAT_AUTO_OPEN_KEY, "1");

      const frame = fitSecretaryatWindow(canvasSize.width, canvasSize.height);
      setAppSizes((prev) => ({
        ...prev,
        secretaryat: { width: frame.width, height: frame.height },
      }));
      setAppPositions((prev) => ({
        ...prev,
        secretaryat: { x: frame.x, y: frame.y },
      }));
      setAppWindows((prev) => ({
        ...prev,
        secretaryat: { open: true, minimized: false, zIndex: nextZIndex() },
      }));
    }, SECRETARYAT_AUTO_OPEN_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [openSecretaryatOnLoad, canvasSize.width, canvasSize.height]);

  useEffect(() => {
    if (!appWindows.secretaryat.open || canvasSize.width === 0 || canvasSize.height === 0) return;

    const frame = fitSecretaryatWindow(canvasSize.width, canvasSize.height);
    setAppSizes((prev) => ({
      ...prev,
      secretaryat: { width: frame.width, height: frame.height },
    }));
    setAppPositions((prev) => ({
      ...prev,
      secretaryat: { x: frame.x, y: frame.y },
    }));
  }, [appWindows.secretaryat.open, canvasSize.width, canvasSize.height]);

  useLayoutEffect(() => {
    if (!stableWindow.open || stableWindow.minimized) return;
    if (canvasSize.width === 0 || canvasSize.height === 0) return;

    const layout = fitStableBesideSecretaryat(
      appPositions.secretaryat,
      appSizes.secretaryat,
      canvasSize.width,
      canvasSize.height,
    );

    setStableSize((prev) =>
      prev.width === layout.width && prev.height === layout.height
        ? prev
        : { width: layout.width, height: layout.height },
    );
    setStablePosition((prev) =>
      prev.x === layout.x && prev.y === layout.y ? prev : { x: layout.x, y: layout.y },
    );
  }, [
    stableWindow.open,
    stableWindow.minimized,
    appPositions.secretaryat.x,
    appPositions.secretaryat.y,
    appSizes.secretaryat.width,
    appSizes.secretaryat.height,
    canvasSize.width,
    canvasSize.height,
  ]);

  const nextZIndex = () => {
    zCounter.current += 1;
    return zCounter.current;
  };

  const bringAppToFront = useCallback((id: AppId) => {
    const zIndex = nextZIndex();
    setAppWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], zIndex },
    }));
  }, []);

  const bringFolderToFront = useCallback((id: FolderId) => {
    const zIndex = nextZIndex();
    setFolderWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], zIndex },
    }));
  }, []);

  const bringFolderIconToFront = useCallback((id: FolderId) => {
    folderIconZCounter.current += 1;
    const zIndex = folderIconZCounter.current;
    setFolderIconZ((prev) => ({
      ...prev,
      [id]: zIndex,
    }));
  }, []);

  const updateFolderIconPosition = useCallback((id: FolderId, x: number, y: number) => {
    setFolderIconPositions((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [id]: { x, y },
      };
    });
  }, []);

  const bringProjectIconToFront = useCallback((id: DesktopProjectId) => {
    projectIconZCounter.current += 1;
    const zIndex = projectIconZCounter.current;
    setProjectIconZ((prev) => ({
      ...prev,
      [id]: zIndex,
    }));
  }, []);

  const updateProjectIconPosition = useCallback((id: DesktopProjectId, x: number, y: number) => {
    setProjectIconPositions((prev) => ({
      ...prev,
      [id]: { x, y },
    }));
  }, []);

  const openProjectInTab = useCallback((slug: string) => {
    window.open(`/projects/${slug}`, "_blank", "noopener,noreferrer");
  }, []);

  const bringProjectToFront = useCallback((id: DesktopProjectId) => {
    const zIndex = nextZIndex();
    setProjectWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], zIndex },
    }));
  }, []);

  const openProject = useCallback((id: DesktopProjectId) => {
    const zIndex = nextZIndex();
    setProjectWindows((prev) => {
      const current = prev[id];
      if (!current.open) {
        return {
          ...prev,
          [id]: { open: true, minimized: false, zIndex },
        };
      }
      return {
        ...prev,
        [id]: { ...current, minimized: false, zIndex },
      };
    });
  }, []);

  const closeProject = useCallback((id: DesktopProjectId) => {
    setProjectWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], open: false, minimized: false },
    }));
  }, []);

  const minimizeProject = useCallback((id: DesktopProjectId) => {
    setProjectWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], minimized: true },
    }));
  }, []);

  const openResume = useCallback(() => {
    const zIndex = nextZIndex();
    setResumeWindow((prev) => ({
      ...prev,
      open: true,
      minimized: false,
      zIndex,
    }));
  }, []);

  const closeResume = useCallback(() => {
    setResumeWindow((prev) => ({
      ...prev,
      open: false,
      minimized: false,
    }));
  }, []);

  const minimizeResume = useCallback(() => {
    setResumeWindow((prev) => ({
      ...prev,
      minimized: true,
    }));
  }, []);

  const bringResumeToFront = useCallback(() => {
    const zIndex = nextZIndex();
    setResumeWindow((prev) => ({
      ...prev,
      zIndex,
    }));
  }, []);

  const openResumeInTab = useCallback(() => {
    window.open(ABOUT.connect.resume.href, "_blank", "noopener,noreferrer");
  }, []);

  const scrollToIntro = useCallback(() => {
    document.getElementById("intro")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const openAbout = useCallback(() => {
    const zIndex = nextZIndex();
    setAboutWindow((prev) => ({
      ...prev,
      open: true,
      minimized: false,
      zIndex,
    }));
  }, []);

  const closeAbout = useCallback(() => {
    setAboutWindow((prev) => ({
      ...prev,
      open: false,
      minimized: false,
    }));
  }, []);

  const minimizeAbout = useCallback(() => {
    setAboutWindow((prev) => ({
      ...prev,
      minimized: true,
    }));
  }, []);

  const bringAboutToFront = useCallback(() => {
    const zIndex = nextZIndex();
    setAboutWindow((prev) => ({
      ...prev,
      zIndex,
    }));
  }, []);

  const bringAboutIconToFront = useCallback(() => {
    aboutIconZCounter.current += 1;
    setAboutIconZ(aboutIconZCounter.current);
  }, []);

  const launchApp = useCallback((id: string) => {
    if (id === "linkedin") {
      window.open(ABOUT.connect.linkedin.href, "_blank", "noopener,noreferrer");
      return;
    }
    if (id === "gmail") {
      window.open(GMAIL_COMPOSE_URL, "_blank", "noopener,noreferrer");
      return;
    }
    if (id === "resume") {
      openResume();
      return;
    }

    const appId = id as AppId;
    const zIndex = nextZIndex();
    setAppWindows((prev) => {
      const current = prev[appId];
      if (!current.open) {
        return {
          ...prev,
          [appId]: { open: true, minimized: false, zIndex },
        };
      }
      return {
        ...prev,
        [appId]: { ...current, minimized: false, zIndex },
      };
    });
  }, [openResume]);

  const openFolder = useCallback((id: FolderId) => {
    const zIndex = nextZIndex();
    setFolderWindows((prev) => {
      const current = prev[id];
      if (!current.open) {
        return {
          ...prev,
          [id]: { open: true, minimized: false, zIndex },
        };
      }
      return {
        ...prev,
        [id]: { ...current, minimized: false, zIndex },
      };
    });
  }, []);

  const closeApp = useCallback((id: AppId) => {
    setAppWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], open: false, minimized: false },
    }));
  }, []);

  const closeFolder = useCallback((id: FolderId) => {
    setFolderWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], open: false, minimized: false },
    }));
  }, []);

  const minimizeApp = useCallback((id: AppId) => {
    setAppWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], minimized: true },
    }));
  }, []);

  const minimizeFolder = useCallback((id: FolderId) => {
    setFolderWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], minimized: true },
    }));
  }, []);

  const toggleStableWindow = useCallback(() => {
    const prev = stableWindowRef.current;
    if (prev.open && !prev.minimized) {
      setStableWindow({ ...prev, open: false, minimized: false });
      return;
    }

    const canvas = canvasRef.current;
    if (canvas) {
      const layout = fitStableBesideSecretaryat(
        appPositionsRef.current.secretaryat,
        appSizesRef.current.secretaryat,
        canvas.clientWidth,
        canvas.clientHeight,
      );
      setStableSize({ width: layout.width, height: layout.height });
      setStablePosition({ x: layout.x, y: layout.y });
    }

    setStableWindow({ open: true, minimized: false, zIndex: nextZIndex() });
  }, []);

  const closeStableWindow = useCallback(() => {
    setStableWindow((prev) => ({
      ...prev,
      open: false,
      minimized: false,
    }));
  }, []);

  const minimizeStableWindow = useCallback(() => {
    setStableWindow((prev) => ({
      ...prev,
      minimized: true,
    }));
  }, []);

  const bringStableToFront = useCallback(() => {
    setStableWindow((prev) => ({
      ...prev,
      zIndex: nextZIndex(),
    }));
  }, []);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.data?.type === "secretaryat-window") {
        if (event.data.action === "minimize") minimizeApp("secretaryat");
        if (event.data.action === "close") closeApp("secretaryat");
        if (event.data.action === "toggle-stable") toggleStableWindow();
        if (event.data.action === "escape-horse" && event.data.payload) {
          setEscapePayload(event.data.payload as HorseEscapePayload);
        }
        if (event.data.action === "resize-start") {
          resizeSession.current = {
            width: appSizesRef.current.secretaryat.width,
            height: appSizesRef.current.secretaryat.height,
            clientX: event.data.clientX ?? 0,
            clientY: event.data.clientY ?? 0,
          };
        }
        if (event.data.action === "resize" && resizeSession.current) {
          const { minWidth, minHeight } = APP_CONFIG.secretaryat;
          setAppSizes((prev) => ({
            ...prev,
            secretaryat: {
              width: Math.max(minWidth, resizeSession.current!.width + (event.data.deltaX ?? 0)),
              height: Math.max(minHeight, resizeSession.current!.height + (event.data.deltaY ?? 0)),
            },
          }));
        }
        if (event.data.action === "drag-start") {
          dragSession.current = {
            originX: appPositionsRef.current.secretaryat.x,
            originY: appPositionsRef.current.secretaryat.y,
            clientX: event.data.clientX ?? 0,
            clientY: event.data.clientY ?? 0,
          };
        }
        if (event.data.action === "drag" && dragSession.current) {
          const session = dragSession.current;
          const nextX = session.originX + ((event.data.clientX ?? session.clientX) - session.clientX);
          const nextY = Math.max(
            8,
            session.originY + ((event.data.clientY ?? session.clientY) - session.clientY),
          );
          setAppPositions((prev) => ({
            ...prev,
            secretaryat: { x: nextX, y: nextY },
          }));
        }
        if (event.data.action === "drag-end") {
          dragSession.current = null;
        }
        return;
      }

      if (event.data?.type !== "stable-window") return;
      if (event.data.action === "minimize") minimizeStableWindow();
      if (event.data.action === "close") closeStableWindow();
      if (event.data.action === "resize-start") {
        stableResizeSession.current = {
          width: stableSizeRef.current.width,
          height: stableSizeRef.current.height,
          clientX: event.data.clientX ?? 0,
          clientY: event.data.clientY ?? 0,
        };
      }
      if (event.data.action === "resize" && stableResizeSession.current) {
        setStableSize({
          width: Math.max(STABLE_WINDOW_DEFAULT.minWidth, stableResizeSession.current.width + (event.data.deltaX ?? 0)),
          height: Math.max(STABLE_WINDOW_DEFAULT.minHeight, stableResizeSession.current.height + (event.data.deltaY ?? 0)),
        });
      }
      if (event.data.action === "drag-start") {
        stableDragSession.current = {
          originX: stablePositionRef.current.x,
          originY: stablePositionRef.current.y,
          clientX: event.data.clientX ?? 0,
          clientY: event.data.clientY ?? 0,
        };
      }
      if (event.data.action === "drag" && stableDragSession.current) {
        const session = stableDragSession.current;
        const nextX = session.originX + ((event.data.clientX ?? session.clientX) - session.clientX);
        const nextY = Math.max(
          8,
          session.originY + ((event.data.clientY ?? session.clientY) - session.clientY),
        );
        setStablePosition({ x: nextX, y: nextY });
      }
      if (event.data.action === "drag-end") {
        stableDragSession.current = null;
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [closeApp, closeStableWindow, minimizeApp, minimizeStableWindow, toggleStableWindow]);

  useEffect(() => {
    const onPointerMove = (event: PointerEvent) => {
      if (resizeSession.current) {
        const { minWidth, minHeight } = APP_CONFIG.secretaryat;
        const session = resizeSession.current;
        setAppSizes((prev) => ({
          ...prev,
          secretaryat: {
            width: Math.max(minWidth, session.width + (event.clientX - session.clientX)),
            height: Math.max(minHeight, session.height + (event.clientY - session.clientY)),
          },
        }));
        return;
      }

      if (stableResizeSession.current) {
        const session = stableResizeSession.current;
        setStableSize({
          width: Math.max(STABLE_WINDOW_DEFAULT.minWidth, session.width + (event.clientX - session.clientX)),
          height: Math.max(STABLE_WINDOW_DEFAULT.minHeight, session.height + (event.clientY - session.clientY)),
        });
      }
    };

    const onPointerUp = () => {
      resizeSession.current = null;
      stableResizeSession.current = null;
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
    };
  }, []);

  const handleEscapeDone = useCallback(() => {
    setEscapePayload(null);
    secretaryatIframeRef.current?.contentWindow?.postMessage(
      { type: "secretaryat-window", action: "escape-done" },
      "*",
    );
  }, []);

  const dockApps: DockApp[] = useMemo(
    () =>
      APP_IDS.map((id) => ({
        id,
        label: APP_CONFIG[id].label,
        icon: APP_CONFIG[id].icon,
        hint: APP_CONFIG[id].hint,
        open: appWindows[id].open,
        minimized: appWindows[id].minimized,
      })),
    [appWindows],
  );

  const dockLinks: DockLink[] = useMemo(
    () => [
      { id: "linkedin", label: "LinkedIn" },
      { id: "gmail", label: "Gmail" },
      {
        id: "resume",
        label: ABOUT.connect.resume.label,
        open: resumeWindow.open && !resumeWindow.minimized,
      },
    ],
    [resumeWindow.minimized, resumeWindow.open],
  );

  return (
    <DesktopHoverTipProvider>
    <div
      className={`desktop-shell${showMenuBar ? " desktop-shell--menubar" : ""}`}
      id="top"
      aria-label="Desktop portfolio homepage"
    >
      {showMenuBar ? <DesktopMenuBar /> : null}
      <div ref={canvasRef} className="desktop-shell__canvas">
        {folderIconPositions
          ? FOLDER_IDS.map((id) => {
              const folder = DESKTOP_FOLDERS[id];
              const iconPosition = folderIconPositions[id];
              return (
                <DesktopFolderIcon
                  key={id}
                  label={folder.label}
                  x={iconPosition.x}
                  y={iconPosition.y}
                  zIndex={folderIconZ[id]}
                  peekUrl={folder.items[0]?.thumb}
                  onOpen={() => openFolder(id)}
                  onFocus={() => bringFolderIconToFront(id)}
                  onPositionChange={(x, y) => updateFolderIconPosition(id, x, y)}
                  boundsWidth={canvasSize.width}
                  boundsHeight={canvasSize.height}
                />
              );
            })
          : null}

        {showAboutFile ? (
          <DesktopFileIcon
            label="About me.txt"
            thumb=""
            hint={HOME_INTRO.positioning}
            variant="text"
            x={aboutIconPosition.x}
            y={aboutIconPosition.y}
            zIndex={aboutIconZ}
            onOpen={openAbout}
            onOpenInTab={scrollToIntro}
            onFocus={bringAboutIconToFront}
            onPositionChange={(x, y) => setAboutIconPosition({ x, y })}
            boundsWidth={canvasSize.width}
            boundsHeight={canvasSize.height}
          />
        ) : null}

        {DESKTOP_PROJECT_IDS.map((id) => {
          const project = DESKTOP_PROJECTS[id];
          const iconPosition = projectIconPositions[id];
          return (
            <DesktopFileIcon
              key={id}
              label={project.label}
              thumb={project.thumb}
              thumbVideo={project.thumbVideo}
              hint={project.hint}
              x={iconPosition.x}
              y={iconPosition.y}
              zIndex={projectIconZ[id]}
              onOpen={() => openProjectInTab(project.slug)}
              onOpenInTab={() => openProjectInTab(project.slug)}
              onFocus={() => bringProjectIconToFront(id)}
              onPositionChange={(x, y) => updateProjectIconPosition(id, x, y)}
              boundsWidth={canvasSize.width}
              boundsHeight={canvasSize.height}
            />
          );
        })}

        {APP_IDS.map((id) => {
          const config = APP_CONFIG[id];
          const state = appWindows[id];
          if (id === "secretaryat") {
            if (!openSecretaryatOnLoad && !state.open) return null;

            const secretaryatHidden = !state.open;

            return (
              <DesktopWindow
                key={id}
                title={config.title}
                width={appSizes[id].width}
                height={appSizes[id].height}
                minWidth={config.minWidth}
                minHeight={config.minHeight}
                x={appPositions[id].x}
                y={appPositions[id].y}
                zIndex={state.zIndex}
                minimized={state.minimized}
                frameless
                className={secretaryatHidden ? "desktop-window--secretaryat-host" : undefined}
                onClose={() => closeApp(id)}
                onMinimize={() => minimizeApp(id)}
                onFocus={() => bringAppToFront(id)}
                onPositionChange={(x, y) =>
                  setAppPositions((prev) => ({
                    ...prev,
                    [id]: { x, y },
                  }))
                }
                onSizeChange={(width, height) =>
                  setAppSizes((prev) => ({
                    ...prev,
                    [id]: { width, height },
                  }))
                }
              >
                <iframe
                  ref={secretaryatIframeRef}
                  title="Secretaryat"
                  className="desktop-window__iframe"
                  src="/apps/secretaryat/index.html?embedded=1&demo=1"
                />
              </DesktopWindow>
            );
          }

          if (!state.open) return null;

          return (
            <DesktopWindow
              key={id}
              title={config.title}
              width={appSizes[id].width}
              height={appSizes[id].height}
              minWidth={config.minWidth}
              minHeight={config.minHeight}
              x={appPositions[id].x}
              y={appPositions[id].y}
              zIndex={state.zIndex}
              minimized={state.minimized}
              contentDraggable
              onClose={() => closeApp(id)}
              onMinimize={() => minimizeApp(id)}
              onFocus={() => bringAppToFront(id)}
              onPositionChange={(x, y) =>
                setAppPositions((prev) => ({
                  ...prev,
                  [id]: { x, y },
                }))
              }
              onSizeChange={(width, height) =>
                setAppSizes((prev) => ({
                  ...prev,
                  [id]: { width, height },
                }))
              }
            >
              <DeskkeeperApp />
            </DesktopWindow>
          );
        })}

        {stableWindow.open ? (
          <DesktopWindow
            key="stable"
            title="Stable"
            width={stableSize.width}
            height={stableSize.height}
            minWidth={STABLE_WINDOW_DEFAULT.minWidth}
            minHeight={STABLE_WINDOW_DEFAULT.minHeight}
            x={stablePosition.x}
            y={stablePosition.y}
            zIndex={stableWindow.zIndex}
            minimized={stableWindow.minimized}
            frameless
            onClose={closeStableWindow}
            onMinimize={minimizeStableWindow}
            onFocus={bringStableToFront}
            onPositionChange={(x, y) => setStablePosition({ x, y })}
            onSizeChange={(width, height) => setStableSize({ width, height })}
          >
            <iframe
              ref={stableIframeRef}
              title="Stable"
              className="desktop-window__iframe"
              src="/apps/secretaryat/stable.html?embedded=1&demo=1"
            />
          </DesktopWindow>
        ) : null}

        {FOLDER_IDS.map((id) => {
          const folder = DESKTOP_FOLDERS[id];
          const state = folderWindows[id];
          if (!state.open) return null;

          return (
            <DesktopWindow
              key={`folder-${id}`}
              title={folder.label}
              width={folderSizes[id].width}
              height={folderSizes[id].height}
              minWidth={folder.minWidth}
              minHeight={folder.minHeight}
              x={folderWindowPositions[id].x}
              y={folderWindowPositions[id].y}
              zIndex={state.zIndex}
              minimized={state.minimized}
              contentDraggable
              onClose={() => closeFolder(id)}
              onMinimize={() => minimizeFolder(id)}
              onFocus={() => bringFolderToFront(id)}
              onPositionChange={(x, y) =>
                setFolderWindowPositions((prev) => ({
                  ...prev,
                  [id]: { x, y },
                }))
              }
              onSizeChange={(width, height) =>
                setFolderSizes((prev) => ({
                  ...prev,
                  [id]: { width, height },
                }))
              }
            >
              <FolderWindowContents
                label={folder.label}
                description={folder.description}
                items={folder.items}
              />
            </DesktopWindow>
          );
        })}

        {resumeWindow.open ? (
          <DesktopWindow
            key="resume"
            title={ABOUT.connect.resume.label}
            width={resumeSize.width}
            height={resumeSize.height}
            minWidth={RESUME_WINDOW_DEFAULT.minWidth}
            minHeight={RESUME_WINDOW_DEFAULT.minHeight}
            x={resumePosition.x}
            y={resumePosition.y}
            zIndex={resumeWindow.zIndex}
            minimized={resumeWindow.minimized}
            onClose={closeResume}
            onMinimize={minimizeResume}
            onFocus={bringResumeToFront}
            onTitleDoubleClick={openResumeInTab}
            onPositionChange={(x, y) => setResumePosition({ x, y })}
            onSizeChange={(width, height) => setResumeSize({ width, height })}
          >
            <ResumeWindowContents />
          </DesktopWindow>
        ) : null}

        {aboutWindow.open ? (
          <DesktopWindow
            key="about"
            title="About me"
            width={aboutSize.width}
            height={aboutSize.height}
            minWidth={ABOUT_FILE_DEFAULT.minWidth}
            minHeight={ABOUT_FILE_DEFAULT.minHeight}
            x={aboutPosition.x}
            y={aboutPosition.y}
            zIndex={aboutWindow.zIndex}
            minimized={aboutWindow.minimized}
            contentDraggable
            onClose={closeAbout}
            onMinimize={minimizeAbout}
            onFocus={bringAboutToFront}
            onTitleDoubleClick={scrollToIntro}
            onPositionChange={(x, y) => setAboutPosition({ x, y })}
            onSizeChange={(width, height) => setAboutSize({ width, height })}
          >
            <AboutWindowContents />
          </DesktopWindow>
        ) : null}
      </div>

      <DesktopDock apps={dockApps} links={dockLinks} onLaunch={launchApp} />

      {showIterations ? <DesktopBottomChrome /> : null}

      {escapePayload ? <HorseEscapeOverlay payload={escapePayload} onDone={handleEscapeDone} /> : null}
    </div>
    </DesktopHoverTipProvider>
  );
}
