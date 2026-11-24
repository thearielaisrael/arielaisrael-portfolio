"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import BrandColorPicker from "./BrandColorPicker";
import { brandColor, type BrandColorToken } from "@/lib/studio/brandColors";
import type {
  StudioElement,
  StudioProject,
  StudioBackgroundEffect,
  StudioGradient,
  StudioShapeType,
} from "@/lib/studio/types";
import { canvasPresets, type CanvasPreset } from "@/lib/studio/canvasPresets";
import { studioFonts, type StudioFont } from "@/lib/studio/fonts";
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  AlertTriangle,
  Lock,
  LockOpen,
  Type,
  SquarePlus,
  BringToFront,
  ArrowUp,
  ArrowDown,
  SendToBack,
  Eye,
  EyeOff,
  Trash2,
  Italic,
  Undo2,
  Redo2,
  Copy,
  ClipboardPaste,
  ArrowLeft,
  ArrowRight,
  GripVertical,
  Save,
  FolderOpen,
  ImageDown,
  Cloud,
  CloudDownload,
  CalendarDays,
  CheckCircle2,
  X,
  RefreshCw,
  FilePlus,
  FileUp,
  FileDown,
  CloudUpload,
  CloudCheck,
} from "lucide-react";
import StudioTextContent from "./StudioTextContent";
import StudioBackgroundEffects from "./StudioBackgroundEffects";
import { studioGradientPresets, studioGradientToCSS } from "@/lib/studio/gradientPresets";
import StudioGradientPresets from "./StudioGradientPresets";
import StudioGradientEditor from "./StudioGradientEditor";
import { cloneAmbientGlowSources, studioAmbientGlowPresets } from "@/lib/studio/ambientGlowPresets";
import StudioAmbientGlowPresets from "./StudioAmbientGlowPresets";
import StudioShape from "./StudioShape";
import StudioRotationHandle from "./StudioRotationHandle";
import { flushSync } from "react-dom";
import type {
  CloudProjectRecord,
  CloudProjectSession,
  CloudProjectSummary,
} from "@/lib/studio/cloudTypes";

const STUDIO_STORAGE_KEY = "arielaisrael-studio-project-v1";

const STUDIO_RECOVERY_KEY = "arielaisrael-studio-recovery-v2";

type StudioRecoveryRecord = {
  version: 2;
  project: StudioProject;
  cloudSession: CloudProjectSession | null;
  cloudSavedSnapshot: string | null;
  cloudSyncPaused: boolean;
};

function serializeStudioProject(project: StudioProject): string {
  return JSON.stringify(project, (_key, value: unknown) => {
    if (value !== null && typeof value === "object" && !Array.isArray(value)) {
      const object = value as Record<string, unknown>;

      return Object.fromEntries(
        Object.keys(object)
          .sort()
          .map((key) => [key, object[key]]),
      );
    }

    return value;
  });
}

const initialElements: StudioElement[] = [
  {
    id: "card-1",
    type: "card",
    x: 86,
    y: 432,
    width: 907,
    height: 432,
    rotation: 0,
    opacity: 100,
    color: "blush-paper",
    radius: 24,
    visible: true,
    locked: false,
  },
  {
    id: "text-1",
    type: "text",
    x: 151,
    y: 540,
    width: 778,
    height: 58,
    rotation: 0,
    opacity: 100,
    content: "Research meets technology.",
    color: "deep-plum",
    fontSize: 48,
    fontWeight: 700,
    visible: true,
    locked: false,
    fontFamily: "plus-jakarta-sans",
    textAlign: "left",
    italic: false,
    lineHeight: 1.2,
    letterSpacing: 0,
  },
];

const initialProject: StudioProject = {
  id: "project-1",
  name: "Untitled Design",
  canvasPreset: "instagramPortrait",
  activeSlideId: "slide-1",
  slides: [
    {
      id: "slide-1",
      name: "Slide 1",
      backgroundColor: "blush-paper",
      backgroundEffects: [],
      elements: initialElements,
    },
  ],
};

type DragSession = {
  pointerId: number;
  elementId: string;
  startClientX: number;
  startClientY: number;
  startX: number;
  startY: number;
  scale: number;
};

type ResizeSession = {
  pointerId: number;
  elementId: string;
  startClientX: number;
  startClientY: number;
  startWidth: number;
  startHeight: number;
  scale: number;
};

type RotationSession = {
  pointerId: number;
  elementId: string;
  centerX: number;
  centerY: number;
  startPointerAngle: number;
  startRotation: number;
};

type PanSession = {
  pointerId: number;
  startClientX: number;
  startClientY: number;
  startScrollLeft: number;
  startScrollTop: number;
};

type AlignmentGuides = {
  vertical: number | null;
  horizontal: number | null;
};

type AlignmentMatch = {
  position: number;
  distance: number;
};

function findClosestAlignment(
  movingPositions: number[],
  targetPositions: number[],
  threshold: number,
): number | null {
  let closest: AlignmentMatch | null = null;

  for (const movingPosition of movingPositions) {
    for (const targetPosition of targetPositions) {
      const distance = Math.abs(movingPosition - targetPosition);

      if (distance <= threshold && (closest === null || distance < closest.distance)) {
        closest = {
          position: targetPosition,
          distance,
        };
      }
    }
  }

  return closest?.position ?? null;
}

export default function StudioEditor() {
  const [project, setProject] = useState<StudioProject>(initialProject);
  const [projectNameDraft, setProjectNameDraft] = useState<string | null>(null);
  const cancelProjectRenameRef = useRef(false);

  const [storageReady, setStorageReady] = useState(false);
  const [saveStatus, setSaveStatus] = useState("Loading saved project…");
  const [cloudSaving, setCloudSaving] = useState(false);
  const [cloudProjects, setCloudProjects] = useState<CloudProjectSummary[]>([]);

  const [cloudSession, setCloudSession] = useState<CloudProjectSession | null>(null);

  const [cloudLibraryOpen, setCloudLibraryOpen] = useState(false);
  const [cloudLoading, setCloudLoading] = useState(false);
  const [cloudDeletingId, setCloudDeletingId] = useState<string | null>(null);

  const [cloudNotice, setCloudNotice] = useState<string | null>(null);

  const [cloudSyncState, setCloudSyncState] = useState<
    "idle" | "saving" | "saved" | "offline" | "error" | "conflict"
  >("idle");

  const [cloudSyncPaused, setCloudSyncPaused] = useState(false);
  const [cloudRetryCount, setCloudRetryCount] = useState(0);

  const projectRef = useRef(project);
  const cloudSessionRef = useRef(cloudSession);

  const cloudBusyRef = useRef(false);

  const [projectOperationBusy, setProjectOperationBusy] = useState(false);

  const exportBusyRef = useRef(false);

  const [cloudSavedSnapshot, setCloudSavedSnapshot] = useState<string | null>(null);

  const cloudDirty =
    cloudSession !== null && serializeStudioProject(project) !== cloudSavedSnapshot;

  useEffect(() => {
    projectRef.current = project;
  }, [project]);

  useEffect(() => {
    cloudSessionRef.current = cloudSession;
  }, [cloudSession]);

  const [exportingPng, setExportingPng] = useState(false);
  const [exportingAllSlides, setExportingAllSlides] = useState(false);
  const editorLocked = !storageReady || projectOperationBusy || exportingPng || exportingAllSlides;

  const projectActionsDisabled = editorLocked || cloudSaving || cloudDeletingId !== null;

  const cloudHasConflict = cloudSyncState === "conflict";

  const cloudNeedsRetry =
    cloudSyncState === "error" || cloudSyncState === "offline" || cloudSyncPaused;

  const cloudIsSynced =
    cloudSession !== null && !cloudDirty && !cloudSaving && !cloudNeedsRetry && !cloudHasConflict;

  const cloudSaveButtonLabel = cloudSaving
    ? "Saving…"
    : !cloudSession
      ? "Save to Cloud"
      : cloudHasConflict
        ? "Cloud Conflict"
        : cloudNeedsRetry
          ? "Retry Save"
          : cloudDirty
            ? "Save Now"
            : "Saved to Cloud";

  const cloudSaveButtonDisabled =
    projectActionsDisabled || cloudLoading || cloudHasConflict || cloudIsSynced;

  const CloudSaveIcon = cloudSaving
    ? RefreshCw
    : cloudHasConflict && cloudSession
      ? AlertTriangle
      : cloudIsSynced
        ? CloudCheck
        : cloudNeedsRetry && cloudSession
          ? RefreshCw
          : CloudUpload;

  const projectFileInputRef = useRef<HTMLInputElement | null>(null);
  const canvasExportRef = useRef<HTMLDivElement | null>(null);

  const [draggedSlideId, setDraggedSlideId] = useState<string | null>(null);

  const [slideDropTarget, setSlideDropTarget] = useState<{
    slideId: string;
    position: "before" | "after";
  } | null>(null);

  const [draggedLayerId, setDraggedLayerId] = useState<string | null>(null);

  const [layerDropTarget, setLayerDropTarget] = useState<{
    layerId: string;
    position: "before" | "after";
  } | null>(null);

  const [elements, setElements] = useState<StudioElement[]>(initialElements);

  const latestElementsRef = useRef(elements);

  const [past, setPast] = useState<StudioElement[][]>([]);
  const [future, setFuture] = useState<StudioElement[][]>([]);
  const sliderStartRef = useRef<StudioElement[] | null>(null);
  const canvasInteractionStartRef = useRef<StudioElement[] | null>(null);
  const copiedElementRef = useRef<StudioElement | null>(null);
  const pasteCountRef = useRef(0);
  const [hasCopiedElement, setHasCopiedElement] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>("text-1");
  const [numericDrafts, setNumericDrafts] = useState<Record<string, string>>({});
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const [editingDraft, setEditingDraft] = useState("");
  const [overflowingTextIds, setOverflowingTextIds] = useState<string[]>([]);
  const inlineEditorRef = useRef<HTMLTextAreaElement | null>(null);
  const [backgroundColor, setBackgroundColor] = useState<BrandColorToken>("blush-paper");
  const [canvasPreset, setCanvasPreset] = useState<CanvasPreset>("instagramPortrait");

  const [showGrid, setShowGrid] = useState(false);
  const [snapToGrid, setSnapToGrid] = useState(false);
  const [gridSize, setGridSize] = useState(20);

  const [zoom, setZoom] = useState<number | "fit">("fit");
  const workspaceRef = useRef<HTMLElement | null>(null);
  const [workspaceSize, setWorkspaceSize] = useState({
    width: 448,
    height: 548,
  });

  const [activeTool, setActiveTool] = useState<"select" | "hand">("select");

  const [showCenterlines, setShowCenterlines] = useState(false);

  const [alignmentGuides, setAlignmentGuides] = useState<AlignmentGuides>({
    vertical: null,
    horizontal: null,
  });

  const activeSlide = project.slides.find((slide) => slide.id === project.activeSlideId);

  const canvasSize = canvasPresets[canvasPreset];

  function restoreProject(nextProject: StudioProject) {
    const slide = nextProject.slides.find((item) => item.id === nextProject.activeSlideId);
    if (!slide) throw new Error("The project has no valid active slide.");
    if (!(nextProject.canvasPreset in canvasPresets)) {
      throw new Error("The project uses an unsupported canvas preset.");
    }
    setProject(nextProject);
    setElements(slide.elements);
    latestElementsRef.current = slide.elements;
    setBackgroundColor(slide.backgroundColor);
    setCanvasPreset(nextProject.canvasPreset);
    setSelectedId(null);
    setPast([]);
    setFuture([]);
    setNumericDrafts({});
    setEditingTextId(null);
  }

  useEffect(() => {
    let cancelled = false;

    async function loadSavedProject() {
      try {
        const recoveryJson = window.localStorage.getItem(STUDIO_RECOVERY_KEY);

        if (recoveryJson) {
          const recovery = JSON.parse(recoveryJson) as StudioRecoveryRecord;

          if (recovery.version !== 2 || !recovery.project) {
            throw new Error("Invalid Studio recovery record.");
          }

          if (cancelled) return;

          restoreProject(recovery.project);

          const session = recovery.cloudSession;

          const validSession =
            session &&
            session.id === recovery.project.id &&
            Number.isInteger(session.revision) &&
            session.revision >= 0 &&
            typeof recovery.cloudSavedSnapshot === "string";

          if (!validSession || !session) {
            setSaveStatus("Local project restored");
            return;
          }

          cloudSessionRef.current = session;
          setCloudSession(session);
          setCloudSavedSnapshot(recovery.cloudSavedSnapshot);

          setCloudSyncPaused(recovery.cloudSyncPaused);

          try {
            const response = await fetch(`/api/studio/projects/${encodeURIComponent(session.id)}`, {
              cache: "no-store",
              credentials: "same-origin",
            });

            if (cancelled) return;

            if (response.status === 404) {
              cloudSessionRef.current = null;
              setCloudSession(null);
              setCloudSavedSnapshot(null);
              setCloudSyncPaused(false);
              setCloudSyncState("idle");

              setCloudNotice(
                "The original cloud project no longer exists. " +
                  "Your local design has been recovered.",
              );

              setSaveStatus("Recovered local project");
              return;
            }

            if (!response.ok) {
              throw new Error("Could not verify cloud revision.");
            }

            const result = await response.json();

            if (cancelled) return;

            const record = result.project as CloudProjectRecord;

            if (!record.document || record.id !== session.id || record.document.id !== session.id) {
              throw new Error("Invalid cloud project.");
            }

            const localSnapshot = serializeStudioProject(recovery.project);

            const remoteSnapshot = serializeStudioProject(record.document);

            const localHasChanges = localSnapshot !== recovery.cloudSavedSnapshot;

            // Local and remote designs already match.
            if (localSnapshot === remoteSnapshot) {
              const nextSession = {
                id: record.id,
                revision: record.revision,
              };

              cloudSessionRef.current = nextSession;
              setCloudSession(nextSession);
              setCloudSavedSnapshot(remoteSnapshot);
              setCloudSyncPaused(false);
              setCloudSyncState("saved");
              setSaveStatus("Cloud project restored");
              return;
            }

            // A newer cloud version exists, but the local
            // recovery record contains no unsaved edits.
            if (!localHasChanges && record.revision > session.revision) {
              restoreProject(record.document);

              const nextSession = {
                id: record.id,
                revision: record.revision,
              };

              cloudSessionRef.current = nextSession;
              setCloudSession(nextSession);
              setCloudSavedSnapshot(remoteSnapshot);
              setCloudSyncPaused(false);
              setCloudSyncState("saved");
              setSaveStatus("Latest cloud version restored");
              return;
            }

            // Cloud has not changed since the local base.
            if (
              record.revision === session.revision &&
              remoteSnapshot === recovery.cloudSavedSnapshot
            ) {
              setCloudSyncPaused(false);
              setCloudSyncState("idle");
              setSaveStatus("Recovered local changes — awaiting sync");
              return;
            }

            // Both versions may contain different changes.
            setCloudSyncPaused(true);
            setCloudSyncState("conflict");

            setCloudNotice(
              "Your recovered design differs from the " +
                "cloud version. Your local changes have " +
                "been preserved. Use Download JSON " +
                "or Use Save as Copy before " +
                "opening the latest cloud project.",
            );

            setSaveStatus("Recovered project — cloud conflict");
          } catch (error) {
            if (cancelled) return;

            console.error("Cloud recovery verification failed:", error);

            setCloudSyncPaused(true);

            setCloudSyncState(
              recovery.cloudSyncPaused ? "conflict" : navigator.onLine ? "error" : "offline",
            );

            setSaveStatus("Local project recovered — cloud verification unavailable");
          }

          return;
        }

        // Compatibility with projects saved before v2.
        const saved = window.localStorage.getItem(STUDIO_STORAGE_KEY);

        if (cancelled) return;

        if (saved) {
          restoreProject(JSON.parse(saved) as StudioProject);
        }

        setSaveStatus(saved ? "Project restored" : "Autosave ready");
      } catch (error) {
        if (!cancelled) {
          setSaveStatus("Could not restore saved project");

          console.error("Studio restore failed:", error);
        }
      } finally {
        if (!cancelled) {
          setStorageReady(true);
        }
      }
    }

    void loadSavedProject();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!storageReady || exportingAllSlides) return;

    function persistRecovery() {
      if (exportBusyRef.current) return;

      try {
        const recovery: StudioRecoveryRecord = {
          version: 2,
          project,
          cloudSession,
          cloudSavedSnapshot,
          cloudSyncPaused,
        };

        window.localStorage.setItem(STUDIO_RECOVERY_KEY, JSON.stringify(recovery));

        if (!cloudSession) {
          setSaveStatus("Saved locally");
        }
      } catch (error) {
        setSaveStatus("Local recovery failed — download a backup");

        console.error("Studio recovery save failed:", error);
      }
    }

    const timeout = window.setTimeout(persistRecovery, 500);

    function handlePageHide() {
      if (!exportBusyRef.current) {
        persistRecovery();
      }
    }

    window.addEventListener("pagehide", handlePageHide);

    return () => {
      window.clearTimeout(timeout);

      window.removeEventListener("pagehide", handlePageHide);
    };
  }, [
    project,
    cloudSession,
    cloudSavedSnapshot,
    cloudSyncPaused,
    storageReady,
    exportingAllSlides,
  ]);

  async function createCloudProject(copyName?: string) {
    if (cloudBusyRef.current || exportBusyRef.current || cloudSaving || !storageReady) {
      return;
    }

    const currentProject = projectRef.current;

    const snapshot: StudioProject = {
      ...currentProject,
      name: copyName ?? currentProject.name,
    };

    const creatingCopy = copyName !== undefined;

    cloudBusyRef.current = true;
    setCloudSaving(true);
    setCloudNotice(null);

    setSaveStatus(creatingCopy ? "Creating project copy…" : "Saving project to cloud…");

    try {
      const response = await fetch("/api/studio/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "same-origin",
        body: JSON.stringify(snapshot),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "Could not create cloud project.");
      }

      const cloudId = result.id as string;

      const session: CloudProjectSession = {
        id: cloudId,
        revision: Number(result.revision),
      };

      const savedCloudDocument: StudioProject = {
        ...snapshot,
        id: cloudId,
      };

      // Preserve any design changes made during the request.
      setProject((current) => ({
        ...current,
        id: cloudId,
        name: current.name === currentProject.name ? snapshot.name : current.name,
      }));

      cloudSessionRef.current = session;

      setCloudSession(session);

      setCloudSavedSnapshot(serializeStudioProject(savedCloudDocument));

      setCloudSyncPaused(false);
      setCloudSyncState("saved");
      setCloudNotice(null);

      setSaveStatus(creatingCopy ? "Project copy created" : "Project saved to cloud");

      await refreshCloudLibrary();
    } catch (error) {
      console.error("Cloud project creation failed:", error);

      setCloudNotice(error instanceof Error ? error.message : "Could not create cloud project.");

      setSaveStatus("Cloud save failed — local project retained");
    } finally {
      cloudBusyRef.current = false;
      setCloudSaving(false);
    }
  }

  async function refreshCloudLibrary() {
    setCloudLoading(true);

    try {
      const response = await fetch("/api/studio/projects", {
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "Could not load cloud library.");
      }

      setCloudProjects(result.projects as CloudProjectSummary[]);
    } catch (error) {
      setCloudNotice(error instanceof Error ? error.message : "Cloud library failed.");
    } finally {
      setCloudLoading(false);
    }
  }

  async function deleteCloudProject(id: string, name: string) {
    if (cloudBusyRef.current || exportBusyRef.current || cloudDeletingId || !storageReady) {
      return;
    }

    const confirmed = window.confirm(
      `Permanently delete "${name}" from your cloud library?\n\n` +
        "This cannot be undone. Your downloaded JSON backups " +
        "and local browser data will not be deleted.",
    );

    if (!confirmed) return;

    cloudBusyRef.current = true;
    setProjectOperationBusy(true);
    setCloudDeletingId(id);
    setCloudNotice(null);

    try {
      const response = await fetch(`/api/studio/projects/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "Could not delete cloud project.");
      }

      setCloudProjects((current) => current.filter((item) => item.id !== id));

      if (cloudSessionRef.current?.id === id) {
        cloudSessionRef.current = null;
        setCloudSession(null);
        setCloudSavedSnapshot(null);

        setCloudSyncPaused(false);
        setCloudSyncState("idle");

        setSaveStatus("Cloud project deleted — current design retained locally");
      }

      setCloudNotice(`"${name}" was deleted from your cloud library.`);
    } catch (error) {
      setCloudNotice(error instanceof Error ? error.message : "Cloud project deletion failed.");
    } finally {
      cloudBusyRef.current = false;
      setProjectOperationBusy(false);
      setCloudDeletingId(null);
    }
  }

  async function openCloudProject(id: string) {
    if (cloudBusyRef.current || exportBusyRef.current || !storageReady) {
      return;
    }

    if (
      !window.confirm(
        "Open this cloud project? Your current editor will be replaced. " +
          "Use Download JSON first if you have unsaved work.",
      )
    ) {
      return;
    }

    cloudBusyRef.current = true;
    setProjectOperationBusy(true);
    setCloudLoading(true);
    setCloudNotice(null);

    try {
      const response = await fetch(`/api/studio/projects/${encodeURIComponent(id)}`, {
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "Could not open cloud project.");
      }

      const record = result.project as CloudProjectRecord;

      if (
        !record.document ||
        record.document.id !== record.id ||
        !Array.isArray(record.document.slides) ||
        !record.document.slides.some((slide) => slide.id === record.document.activeSlideId)
      ) {
        throw new Error("The cloud project contains invalid data.");
      }

      restoreProject(record.document);

      const session = {
        id: record.id,
        revision: record.revision,
      };

      cloudSessionRef.current = session;
      setCloudSession(session);

      setCloudSavedSnapshot(serializeStudioProject(record.document));

      setCloudSyncPaused(false);
      setCloudSyncState("saved");
      setCloudNotice(null);

      setCloudLibraryOpen(false);
      setSaveStatus("Cloud project opened");
    } catch (error) {
      setCloudNotice(error instanceof Error ? error.message : "Could not open project.");
    } finally {
      cloudBusyRef.current = false;
      setProjectOperationBusy(false);
      setCloudLoading(false);
    }
  }

  const syncCloudProject = useCallback(async () => {
    if (
      cloudBusyRef.current ||
      exportBusyRef.current ||
      !storageReady ||
      cloudSyncState === "conflict"
    ) {
      return;
    }

    const session = cloudSessionRef.current;
    const snapshot = projectRef.current;

    if (!session) {
      setCloudNotice("Open a cloud project or use Save to Cloud first.");
      return;
    }

    if (snapshot.id !== session.id) {
      setCloudNotice("Project identity mismatch. Save cancelled.");
      return;
    }

    if (!navigator.onLine) {
      setCloudSyncPaused(true);
      setCloudSyncState("offline");
      setSaveStatus("Offline — local recovery active");
      return;
    }

    cloudBusyRef.current = true;

    setCloudSaving(true);
    setCloudSyncState("saving");
    setCloudNotice(null);
    setSaveStatus("Saving to cloud…");

    try {
      const response = await fetch(`/api/studio/projects/${encodeURIComponent(session.id)}`, {
        method: "PATCH",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          project: snapshot,
          expectedRevision: session.revision,
        }),
      });

      const result = await response.json();

      if (response.status === 409) {
        setCloudSyncPaused(true);
        setCloudSyncState("conflict");

        setCloudNotice(
          "Another device has a newer cloud revision. " +
            "Automatic saving has been paused. Your local " +
            "changes remain available. Use Download JSON " +
            "or Use Save as Copy before opening " +
            "the newer version.",
        );

        setSaveStatus("Cloud conflict — autosave paused");
        return;
      }

      if (!response.ok) {
        throw new Error(result.error ?? "Cloud save failed.");
      }

      if (cloudSessionRef.current?.id !== session.id) {
        return;
      }

      const nextSession: CloudProjectSession = {
        id: session.id,
        revision: Number(result.revision),
      };

      const savedSnapshot = serializeStudioProject(snapshot);

      cloudSessionRef.current = nextSession;

      setCloudSession(nextSession);
      setCloudSavedSnapshot(savedSnapshot);
      setCloudSyncPaused(false);
      setCloudSyncState("saved");

      const changedDuringSave = serializeStudioProject(projectRef.current) !== savedSnapshot;

      setSaveStatus(
        changedDuringSave ? "Cloud saved — newer edits awaiting sync" : "Saved to cloud",
      );

      setCloudProjects((current) =>
        current.map((item) =>
          item.id === session.id
            ? {
                ...item,
                name: snapshot.name,
                revision: nextSession.revision,
              }
            : item,
        ),
      );
    } catch (error) {
      console.error("Studio cloud save failed:", error);

      setCloudSyncPaused(true);

      setCloudSyncState(navigator.onLine ? "error" : "offline");

      setCloudNotice(error instanceof Error ? error.message : "Cloud synchronization failed.");

      setSaveStatus("Cloud unavailable — local recovery active");
    } finally {
      cloudBusyRef.current = false;
      setCloudSaving(false);
    }
  }, [storageReady, cloudSyncState]);

  useEffect(() => {
    if (
      !storageReady ||
      !cloudSession ||
      !cloudDirty ||
      cloudSyncPaused ||
      cloudSaving ||
      projectOperationBusy ||
      exportingPng ||
      exportingAllSlides ||
      cloudDeletingId !== null
    ) {
      return;
    }

    const timeout = window.setTimeout(() => {
      void syncCloudProject();
    }, 2000);

    return () => window.clearTimeout(timeout);
  }, [
    project,
    cloudSession,
    cloudDirty,
    cloudSyncPaused,
    storageReady,
    cloudSaving,
    projectOperationBusy,
    exportingPng,
    exportingAllSlides,
    cloudDeletingId,
    cloudRetryCount,
    syncCloudProject,
  ]);

  function retryCloudSync() {
    if (!cloudSession || cloudBusyRef.current || exportBusyRef.current) {
      return;
    }

    if (cloudSyncState === "conflict") {
      setCloudNotice(
        "This project has a revision conflict. Preserve " +
          "Your current design using Download JSON or " +
          "Save as Copy, then open the latest cloud version.",
      );
      return;
    }

    setCloudSyncPaused(false);
    setCloudSyncState("idle");
    setCloudRetryCount((count) => count + 1);

    void syncCloudProject();
  }

  useEffect(() => {
    function handleOnline() {
      if (!cloudSession || cloudSyncState !== "offline") {
        return;
      }

      setCloudSyncPaused(false);
      setCloudSyncState("idle");
      setCloudRetryCount((count) => count + 1);

      void syncCloudProject();
    }

    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("online", handleOnline);
    };
  }, [cloudSession, cloudSyncState, syncCloudProject]);

  function saveProjectToCloud() {
    if (projectActionsDisabled || cloudBusyRef.current || exportBusyRef.current) {
      return;
    }

    if (!cloudSessionRef.current) {
      void createCloudProject();
      return;
    }

    if (cloudSyncState === "conflict") {
      return;
    }

    if (cloudSyncState === "error" || cloudSyncState === "offline" || cloudSyncPaused) {
      retryCloudSync();
      return;
    }

    if (cloudDirty) {
      void syncCloudProject();
    }
  }

  function saveProjectAsCopy() {
    if (
      !cloudSessionRef.current ||
      projectActionsDisabled ||
      cloudBusyRef.current ||
      exportBusyRef.current
    ) {
      return;
    }

    const name = window.prompt(
      "Save a separate copy of this project:",
      `${projectRef.current.name} Copy`,
    );

    if (name === null) return;

    const trimmedName = name.trim();

    if (!trimmedName) {
      setCloudNotice("Please enter a project name.");
      return;
    }

    void createCloudProject(trimmedName);
  }

  function createNewProject() {
    if (projectActionsDisabled || cloudBusyRef.current || exportBusyRef.current) {
      return;
    }

    const message =
      !cloudSession || cloudDirty
        ? "Create a new project? Your current editor will be " +
          "replaced. Use Download JSON first if you want " +
          "to preserve your current unsynchronized design."
        : "Create a new project? Your existing cloud project " +
          "will remain available in the Cloud Library.";

    if (!window.confirm(message)) return;

    const slideId = crypto.randomUUID();

    const nextProject: StudioProject = {
      id: crypto.randomUUID(),
      name: "Untitled Design",
      canvasPreset: "instagramPortrait",
      activeSlideId: slideId,
      slides: [
        {
          id: slideId,
          name: "Slide 1",
          backgroundColor: "blush-paper",
          backgroundEffects: [],
          elements: [],
        },
      ],
    };

    restoreProject(nextProject);

    cloudSessionRef.current = null;

    setCloudSession(null);
    setCloudSavedSnapshot(null);
    setCloudSyncPaused(false);
    setCloudSyncState("idle");
    setCloudRetryCount(0);
    setCloudNotice(null);

    setProjectNameDraft(null);
    setCloudLibraryOpen(false);

    copiedElementRef.current = null;
    pasteCountRef.current = 0;
    setHasCopiedElement(false);

    setSaveStatus("New project created");
  }

  function exportProjectJson() {
    const blob = new Blob([JSON.stringify(project, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${project.name.trim().replace(/[^a-z0-9_-]+/gi, "-") || "studio-project"}.studio.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  async function importProjectJson(file: File) {
    if (cloudBusyRef.current || exportBusyRef.current || !storageReady) {
      if (projectFileInputRef.current) {
        projectFileInputRef.current.value = "";
      }

      return;
    }

    cloudBusyRef.current = true;
    setProjectOperationBusy(true);

    try {
      const parsed: unknown = JSON.parse(await file.text());

      if (
        !parsed ||
        typeof parsed !== "object" ||
        !("slides" in parsed) ||
        !Array.isArray(parsed.slides) ||
        parsed.slides.length === 0 ||
        !parsed.slides.every(
          (slide: unknown) =>
            !!slide &&
            typeof slide === "object" &&
            "id" in slide &&
            "elements" in slide &&
            Array.isArray(slide.elements) &&
            "backgroundEffects" in slide &&
            Array.isArray(slide.backgroundEffects),
        ) ||
        !("activeSlideId" in parsed) ||
        !("canvasPreset" in parsed) ||
        !("name" in parsed)
      ) {
        throw new Error("This is not a supported Studio project file.");
      }

      if (
        !window.confirm(
          "Replace your current Studio project with the " +
            "imported project? Make sure you have saved " +
            "any changes you wish to keep.",
        )
      ) {
        return;
      }

      restoreProject(parsed as StudioProject);

      cloudSessionRef.current = null;

      setCloudSession(null);
      setCloudSavedSnapshot(null);
      setCloudSyncPaused(false);
      setCloudSyncState("idle");
      setCloudNotice(null);

      setSaveStatus("Project imported");
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Could not open project.");
    } finally {
      cloudBusyRef.current = false;
      setProjectOperationBusy(false);

      if (projectFileInputRef.current) {
        projectFileInputRef.current.value = "";
      }
    }
  }

  async function exportSlidePng() {
    if (
      !canvasExportRef.current ||
      exportingPng ||
      exportingAllSlides ||
      cloudBusyRef.current ||
      exportBusyRef.current ||
      !storageReady
    ) {
      return;
    }

    exportBusyRef.current = true;
    setExportingPng(true);
    const previouslySelected = selectedId;
    const previousGrid = showGrid;
    const previousCenterlines = showCenterlines;
    setSelectedId(null);
    setShowGrid(false);
    setShowCenterlines(false);
    try {
      await new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      );
      const { toPng } = await import("html-to-image");
      const node = canvasExportRef.current;
      if (!node) throw new Error("Canvas is unavailable.");
      const image = await toPng(node, {
        cacheBust: true,
        pixelRatio: 1 / scale,
        backgroundColor: brandColor(backgroundColor),
        filter: (element) =>
          !(element instanceof HTMLElement && element.dataset.studioExportIgnore === "true"),
      });
      const link = document.createElement("a");
      link.href = image;
      link.download = `${project.name.trim().replace(/[^a-z0-9_-]+/gi, "-") || "studio"}-${activeSlide?.name.replace(/[^a-z0-9_-]+/gi, "-") || "slide"}.png`;
      link.click();
    } catch (error) {
      console.error("PNG export failed:", error);
      window.alert("PNG export failed. Check the browser console for details.");
    } finally {
      setSelectedId(previouslySelected);
      setShowGrid(previousGrid);
      setShowCenterlines(previousCenterlines);
      exportBusyRef.current = false;
      setExportingPng(false);
    }
  }

  async function exportAllSlidesZip() {
    if (
      exportingPng ||
      exportingAllSlides ||
      !canvasExportRef.current ||
      cloudBusyRef.current ||
      exportBusyRef.current ||
      !storageReady
    ) {
      return;
    }

    exportBusyRef.current = true;

    const originalProject = project;
    const originalElements = elements;
    const originalSelectedId = selectedId;
    const originalBackgroundColor = backgroundColor;
    const originalGrid = showGrid;
    const originalCenterlines = showCenterlines;

    const safeFilename = (value: string) =>
      value
        .trim()
        .replace(/[^a-z0-9_-]+/gi, "-")
        .replace(/^-+|-+$/g, "") || "slide";

    const waitForPaint = () =>
      new Promise<void>((resolve) => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => resolve());
        });
      });

    flushSync(() => {
      setExportingAllSlides(true);
    });

    try {
      const [{ default: JSZip }, { toPng }] = await Promise.all([
        import("jszip"),
        import("html-to-image"),
      ]);

      const zip = new JSZip();
      const slides = originalProject.slides;
      const digits = Math.max(2, String(slides.length).length);

      for (let index = 0; index < slides.length; index++) {
        const slide = slides[index];

        // Render the slide using the existing Studio canvas.
        flushSync(() => {
          setProject({
            ...originalProject,
            activeSlideId: slide.id,
          });

          setElements(slide.elements);
          latestElementsRef.current = slide.elements;

          setBackgroundColor(slide.backgroundColor);
          setSelectedId(null);
          setShowGrid(false);
          setShowCenterlines(false);
        });

        await document.fonts.ready;
        await waitForPaint();

        const canvas = canvasExportRef.current;

        if (!canvas) {
          throw new Error(`Canvas unavailable for ${slide.name}.`);
        }

        const dataUrl = await toPng(canvas, {
          cacheBust: true,
          pixelRatio: 1 / scale,
          backgroundColor: brandColor(slide.backgroundColor),
          filter: (node) =>
            !(node instanceof HTMLElement && node.dataset.studioExportIgnore === "true"),
        });

        const base64 = dataUrl.split(",")[1];

        if (!base64) {
          throw new Error(`Could not render ${slide.name}.`);
        }

        const number = String(index + 1).padStart(digits, "0");
        const filename = `${number}-${safeFilename(slide.name)}.png`;

        zip.file(filename, base64, { base64: true });
      }

      const blob = await zip.generateAsync({
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: { level: 6 },
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `${safeFilename(originalProject.name)}.zip`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      console.error("Multi-slide export failed:", error);

      window.alert(
        error instanceof Error
          ? `Multi-slide export failed: ${error.message}`
          : "Multi-slide export failed.",
      );
    } finally {
      // Restore the editor to the exact slide and selection
      // that were active before exporting.
      flushSync(() => {
        setProject(originalProject);
        setElements(originalElements);
        latestElementsRef.current = originalElements;
        setBackgroundColor(originalBackgroundColor);
        setSelectedId(originalSelectedId);
        setShowGrid(originalGrid);
        setShowCenterlines(originalCenterlines);
      });

      exportBusyRef.current = false;
      setExportingAllSlides(false);
    }
  }

  const dragSession = useRef<DragSession | null>(null);

  const syncActiveSlide = useCallback((nextElements: StudioElement[]) => {
    setProject((currentProject) => ({
      ...currentProject,
      slides: currentProject.slides.map((slide) =>
        slide.id === currentProject.activeSlideId
          ? {
              ...slide,
              elements: nextElements,
            }
          : slide,
      ),
    }));
  }, []);

  function updateBackgroundColor(color: BrandColorToken) {
    setBackgroundColor(color);

    setProject((currentProject) => ({
      ...currentProject,
      slides: currentProject.slides.map((slide) =>
        slide.id === currentProject.activeSlideId ? { ...slide, backgroundColor: color } : slide,
      ),
    }));
  }

  function updateBackgroundEffect(effectId: string, changes: Partial<StudioBackgroundEffect>) {
    setProject((currentProject) => ({
      ...currentProject,
      slides: currentProject.slides.map((slide) =>
        slide.id === currentProject.activeSlideId
          ? {
              ...slide,
              backgroundEffects: slide.backgroundEffects.map((effect) =>
                effect.id === effectId ? { ...effect, ...changes } : effect,
              ),
            }
          : slide,
      ),
    }));
  }

  function moveBackgroundEffect(effectId: string, direction: -1 | 1) {
    setProject((currentProject) => ({
      ...currentProject,
      slides: currentProject.slides.map((slide) => {
        if (slide.id !== currentProject.activeSlideId) return slide;
        const effects = [...slide.backgroundEffects];
        const index = effects.findIndex((effect) => effect.id === effectId);
        const destination = index + direction;
        if (index < 0 || destination < 0 || destination >= effects.length) return slide;
        [effects[index], effects[destination]] = [effects[destination], effects[index]];
        return { ...slide, backgroundEffects: effects };
      }),
    }));
  }

  function addCardEffect(cardId: string, type: "grid" | "pattern") {
    const base: StudioBackgroundEffect = {
      id: crypto.randomUUID(),
      type,
      enabled: true,
      seed: 1,
      opacity: 50,
      color: "signature-aura-pink",
      intensity: 100,
      scale: 100,
      ...(type === "grid"
        ? { grid: { style: "lines" as const, spacing: 32, lineWidth: 1 } }
        : { pattern: { style: "waves" as const, spacing: 40, lineWidth: 1, rotation: 0 } }),
    };
    const card = elements.find((item) => item.id === cardId);
    if (!card || card.type !== "card") return;
    commitElementUpdate(cardId, { effects: [...(card.effects ?? []), base] });
  }

  function updateCardEffect(
    cardId: string,
    effectId: string,
    changes: Partial<StudioBackgroundEffect>,
  ) {
    const card = elements.find((item) => item.id === cardId);
    if (!card || card.type !== "card") return;
    commitElementUpdate(cardId, {
      effects: (card.effects ?? []).map((effect) =>
        effect.id === effectId ? { ...effect, ...changes } : effect,
      ),
    });
  }

  function removeCardEffect(cardId: string, effectId: string) {
    const card = elements.find((item) => item.id === cardId);
    if (!card || card.type !== "card") return;
    commitElementUpdate(cardId, {
      effects: (card.effects ?? []).filter((effect) => effect.id !== effectId),
    });
  }

  function moveCardEffect(cardId: string, effectId: string, direction: -1 | 1) {
    const card = elements.find((item) => item.id === cardId);
    if (!card || card.type !== "card") return;
    const effects = [...(card.effects ?? [])];
    const index = effects.findIndex((effect) => effect.id === effectId);
    const destination = index + direction;
    if (index < 0 || destination < 0 || destination >= effects.length) return;
    [effects[index], effects[destination]] = [effects[destination], effects[index]];
    commitElementUpdate(cardId, { effects });
  }

  function getBackgroundGradient(effect: StudioBackgroundEffect): StudioGradient {
    return (
      effect.gradient ?? {
        type: "linear",
        angle: 135,
        opacity: effect.opacity,
        stops: [
          {
            id: `${effect.id}-start`,
            color: effect.color,
            position: 0,
          },
          {
            id: `${effect.id}-end`,
            color: effect.secondaryColor ?? "#FFFFFF",
            position: 100,
          },
        ],
      }
    );
  }

  function updateBackgroundGradient(effect: StudioBackgroundEffect, gradient: StudioGradient) {
    const sortedStops = [...gradient.stops].sort((a, b) => a.position - b.position);

    updateBackgroundEffect(effect.id, {
      gradient,
      opacity: gradient.opacity,
      color: sortedStops[0]?.color ?? effect.color,
      secondaryColor: sortedStops[sortedStops.length - 1]?.color ?? effect.secondaryColor,
    });
  }

  function addGradientPreset(gradient: StudioGradient) {
    const sortedStops = [...gradient.stops].sort((a, b) => a.position - b.position);

    const firstStop = sortedStops[0];
    const lastStop = sortedStops[sortedStops.length - 1];

    if (!firstStop || !lastStop) return;

    const newEffect: StudioBackgroundEffect = {
      id: crypto.randomUUID(),
      type: "gradient",
      enabled: true,
      seed: 1,
      opacity: gradient.opacity,
      color: firstStop.color,
      secondaryColor: lastStop.color,
      intensity: 50,
      scale: 100,
      gradient: structuredClone(gradient),
    };

    setProject((currentProject) => ({
      ...currentProject,
      slides: currentProject.slides.map((slide) =>
        slide.id === currentProject.activeSlideId
          ? {
              ...slide,
              backgroundEffects: [...slide.backgroundEffects, newEffect],
            }
          : slide,
      ),
    }));
  }

  function addAmbientGlowPreset(presetId: string) {
    const preset = studioAmbientGlowPresets.find((item) => item.id === presetId);

    if (!preset) return;

    const newEffect: StudioBackgroundEffect = {
      id: crypto.randomUUID(),
      type: "ambient-glow",
      enabled: true,
      seed: 1,
      opacity: 100,
      color: preset.sources[0]?.color ?? "#FF91B8",
      intensity: 50,
      scale: 100,
      glowSources: cloneAmbientGlowSources(preset),
      originalGlowSources: cloneAmbientGlowSources(preset),
      ambientGlowPresetId: preset.id,
    };

    setProject((currentProject) => ({
      ...currentProject,
      slides: currentProject.slides.map((slide) =>
        slide.id === currentProject.activeSlideId
          ? {
              ...slide,
              backgroundEffects: [...slide.backgroundEffects, newEffect],
            }
          : slide,
      ),
    }));
  }

  function randomizeAmbientGlowPositions(effectId: string) {
    setProject((currentProject) => ({
      ...currentProject,
      slides: currentProject.slides.map((slide) => {
        if (slide.id !== currentProject.activeSlideId) {
          return slide;
        }

        return {
          ...slide,
          backgroundEffects: slide.backgroundEffects.map((effect) => {
            if (effect.id !== effectId || effect.type !== "ambient-glow") {
              return effect;
            }

            return {
              ...effect,
              glowSources: (effect.glowSources ?? []).map((source) => {
                const newX = 10 + Math.random() * 80;
                const newY = 10 + Math.random() * 80;

                return {
                  ...source,
                  x: Math.round(newX),
                  y: Math.round(newY),
                };
              }),
            };
          }),
        };
      }),
    }));
  }

  function resetAmbientGlowPositions(effectId: string) {
    setProject((currentProject) => ({
      ...currentProject,
      slides: currentProject.slides.map((slide) => {
        if (slide.id !== currentProject.activeSlideId) {
          return slide;
        }

        return {
          ...slide,
          backgroundEffects: slide.backgroundEffects.map((effect) => {
            if (
              effect.id !== effectId ||
              effect.type !== "ambient-glow" ||
              !effect.originalGlowSources
            ) {
              return effect;
            }

            return {
              ...effect,
              glowSources: effect.originalGlowSources.map((source) => ({ ...source })),
            };
          }),
        };
      }),
    }));
  }

  function randomizeParticlePositions(effectId: string) {
    updateBackgroundEffect(effectId, {
      seed: Math.floor(Math.random() * 4294967295),
    });
  }

  function resetParticlePositions(effectId: string) {
    updateBackgroundEffect(effectId, {
      seed: 1,
    });
  }

  function addParticleEffect() {
    const newEffect: StudioBackgroundEffect = {
      id: crypto.randomUUID(),
      type: "particles",
      enabled: true,
      seed: 1,
      opacity: 100,
      color: "#ED3F98",
      intensity: 80,
      scale: 100,
      particles: {
        count: 60,
        size: 2,
        connectionOpacity: 12,
        connectionDistance: 12,
      },
    };

    setProject((currentProject) => ({
      ...currentProject,
      slides: currentProject.slides.map((slide) =>
        slide.id === currentProject.activeSlideId
          ? {
              ...slide,
              backgroundEffects: [...slide.backgroundEffects, newEffect],
            }
          : slide,
      ),
    }));
  }

  function addGridEffect() {
    const newEffect: StudioBackgroundEffect = {
      id: crypto.randomUUID(),
      type: "grid",
      enabled: true,
      seed: 1,
      opacity: 35,
      color: "#ED3F98",
      intensity: 100,
      scale: 100,
      grid: {
        style: "lines",
        spacing: 32,
        lineWidth: 1,
      },
    };

    setProject((currentProject) => ({
      ...currentProject,
      slides: currentProject.slides.map((slide) =>
        slide.id === currentProject.activeSlideId
          ? {
              ...slide,
              backgroundEffects: [...slide.backgroundEffects, newEffect],
            }
          : slide,
      ),
    }));
  }

  function addPatternEffect() {
    const newEffect: StudioBackgroundEffect = {
      id: crypto.randomUUID(),
      type: "pattern",
      enabled: true,
      seed: 1,
      opacity: 35,
      color: "signature-aura-pink",
      intensity: 100,
      scale: 100,
      pattern: {
        style: "waves",
        spacing: 40,
        lineWidth: 1,
        rotation: 0,
      },
    };

    setProject((currentProject) => ({
      ...currentProject,
      slides: currentProject.slides.map((slide) =>
        slide.id === currentProject.activeSlideId
          ? {
              ...slide,
              backgroundEffects: [...slide.backgroundEffects, newEffect],
            }
          : slide,
      ),
    }));
  }

  function addGradientEffect() {
    const newEffect: StudioBackgroundEffect = {
      id: crypto.randomUUID(),
      type: "gradient",
      enabled: true,
      seed: 1,
      opacity: 100,
      color: "#F8BBD9",
      secondaryColor: "#FFF0F7",
      intensity: 50,
      scale: 100,
    };

    setProject((currentProject) => ({
      ...currentProject,
      slides: currentProject.slides.map((slide) =>
        slide.id === currentProject.activeSlideId
          ? {
              ...slide,
              backgroundEffects: [...slide.backgroundEffects, newEffect],
            }
          : slide,
      ),
    }));
  }

  function removeBackgroundEffect(effectId: string) {
    setProject((currentProject) => ({
      ...currentProject,
      slides: currentProject.slides.map((slide) =>
        slide.id === currentProject.activeSlideId
          ? {
              ...slide,
              backgroundEffects: slide.backgroundEffects.filter((effect) => effect.id !== effectId),
            }
          : slide,
      ),
    }));
  }

  function renameProject(name: string) {
    const trimmedName = name.trim();

    setProject((currentProject) => ({
      ...currentProject,
      name: trimmedName || "Untitled Design",
    }));
  }

  function updateCanvasPreset(preset: CanvasPreset) {
    setCanvasPreset(preset);

    setProject((currentProject) => ({
      ...currentProject,
      canvasPreset: preset,
    }));
  }

  function addSlide() {
    const newSlideId = crypto.randomUUID();

    setNumericDrafts({});

    setProject((currentProject) => ({
      ...currentProject,
      activeSlideId: newSlideId,
      slides: [
        ...currentProject.slides,
        {
          id: newSlideId,
          name: `Slide ${currentProject.slides.length + 1}`,
          backgroundColor: "blush-paper",
          backgroundEffects: [],
          elements: [],
        },
      ],
    }));

    setElements([]);
    latestElementsRef.current = [];
    setBackgroundColor("blush-paper");
    setSelectedId(null);
    setEditingTextId(null);
    setPast([]);
    setFuture([]);
  }

  function selectSlide(slideId: string) {
    if (slideId === project.activeSlideId) return;

    const nextSlide = project.slides.find((slide) => slide.id === slideId);

    if (!nextSlide) return;

    setNumericDrafts({});

    setProject((currentProject) => ({
      ...currentProject,
      activeSlideId: slideId,
    }));

    setElements(nextSlide.elements);
    latestElementsRef.current = nextSlide.elements;
    setBackgroundColor(nextSlide.backgroundColor);
    setSelectedId(null);
    setEditingTextId(null);
    setPast([]);
    setFuture([]);
  }

  function duplicateSlide(slideId: string) {
    const sourceSlide = project.slides.find((slide) => slide.id === slideId);

    if (!sourceSlide) return;

    setNumericDrafts({});

    const newSlideId = crypto.randomUUID();

    const duplicatedSlide = {
      ...sourceSlide,
      id: newSlideId,
      name: `${sourceSlide.name} Copy`,
      elements: sourceSlide.elements.map((element) => ({
        ...element,
        id: crypto.randomUUID(),
      })),
    };

    const sourceIndex = project.slides.findIndex((slide) => slide.id === slideId);

    setProject((currentProject) => {
      const updatedSlides = [...currentProject.slides];

      updatedSlides.splice(sourceIndex + 1, 0, duplicatedSlide);

      return {
        ...currentProject,
        slides: updatedSlides,
        activeSlideId: newSlideId,
      };
    });

    setElements(duplicatedSlide.elements);
    latestElementsRef.current = duplicatedSlide.elements;
    setBackgroundColor(duplicatedSlide.backgroundColor);

    setSelectedId(null);
    setEditingTextId(null);
    setPast([]);
    setFuture([]);
  }

  function deleteSlide(slideId: string) {
    if (project.slides.length <= 1) return;

    const slideIndex = project.slides.findIndex((slide) => slide.id === slideId);

    if (slideIndex === -1) return;

    setNumericDrafts({});

    const deletingActiveSlide = project.activeSlideId === slideId;

    const remainingSlides = project.slides.filter((slide) => slide.id !== slideId);

    const nextSlide = deletingActiveSlide
      ? remainingSlides[Math.min(slideIndex, remainingSlides.length - 1)]
      : null;

    setProject((currentProject) => ({
      ...currentProject,
      slides: remainingSlides,
      activeSlideId: nextSlide?.id ?? currentProject.activeSlideId,
    }));

    if (nextSlide) {
      setElements(nextSlide.elements);
      latestElementsRef.current = nextSlide.elements;
      setBackgroundColor(nextSlide.backgroundColor);

      setSelectedId(null);
      setEditingTextId(null);
      setPast([]);
      setFuture([]);
    }
  }

  function moveSlide(slideId: string, direction: "left" | "right") {
    setProject((currentProject) => {
      const currentIndex = currentProject.slides.findIndex((slide) => slide.id === slideId);

      if (currentIndex === -1) return currentProject;

      const targetIndex = direction === "left" ? currentIndex - 1 : currentIndex + 1;

      if (targetIndex < 0 || targetIndex >= currentProject.slides.length) {
        return currentProject;
      }

      const updatedSlides = [...currentProject.slides];

      [updatedSlides[currentIndex], updatedSlides[targetIndex]] = [
        updatedSlides[targetIndex],
        updatedSlides[currentIndex],
      ];

      return {
        ...currentProject,
        slides: updatedSlides,
      };
    });
  }

  function reorderSlide(draggedId: string, targetId: string, position: "before" | "after") {
    if (draggedId === targetId) return;

    setProject((currentProject) => {
      const draggedSlide = currentProject.slides.find((slide) => slide.id === draggedId);

      if (!draggedSlide) return currentProject;

      const updatedSlides = currentProject.slides.filter((slide) => slide.id !== draggedId);

      const targetIndex = updatedSlides.findIndex((slide) => slide.id === targetId);

      if (targetIndex === -1) return currentProject;

      updatedSlides.splice(position === "before" ? targetIndex : targetIndex + 1, 0, draggedSlide);

      return {
        ...currentProject,
        slides: updatedSlides,
      };
    });
  }

  function reorderLayer(draggedId: string, targetId: string, position: "before" | "after") {
    if (draggedId === targetId) return;

    const displayOrder = [...elements].reverse();

    const draggedLayer = displayOrder.find((element) => element.id === draggedId);

    if (!draggedLayer) return;

    const reorderedLayers = displayOrder.filter((element) => element.id !== draggedId);

    const targetIndex = reorderedLayers.findIndex((element) => element.id === targetId);

    if (targetIndex === -1) return;

    reorderedLayers.splice(position === "before" ? targetIndex : targetIndex + 1, 0, draggedLayer);

    const updatedElements = reorderedLayers.reverse();

    if (updatedElements.every((element, index) => element.id === elements[index].id)) {
      return;
    }

    commitElements(updatedElements);
  }

  function commitElements(nextElements: StudioElement[]) {
    setPast((previous) => [...previous.slice(-49), elements]);
    setFuture([]);

    latestElementsRef.current = nextElements;
    setElements(nextElements);
    syncActiveSlide(nextElements);
  }

  function undo() {
    if (past.length === 0) return;

    const previousElements = past[past.length - 1];

    setFuture((previous) => [elements, ...previous]);
    setPast((previous) => previous.slice(0, -1));

    latestElementsRef.current = previousElements;
    setElements(previousElements);
    syncActiveSlide(previousElements);
    setSelectedId(null);
  }

  function redo() {
    if (future.length === 0) return;

    const nextElements = future[0];

    setPast((previous) => [...previous, elements]);
    setFuture((previous) => previous.slice(1));

    latestElementsRef.current = nextElements;
    setElements(nextElements);
    syncActiveSlide(nextElements);
    setSelectedId(null);
  }

  function handleDragStart(event: React.PointerEvent<HTMLDivElement>, element: StudioElement) {
    if (activeTool === "hand") return;

    if (editingTextId === element.id) return;

    if (element.locked) {
      return;
    }

    if (event.button !== 0 && event.pointerType === "mouse") {
      return;
    }

    event.stopPropagation();

    if (element.type === "text" && event.detail >= 2) {
      startTextEditing(element);
      return;
    }

    event.preventDefault();

    if (selectedId !== element.id) {
      setNumericDrafts({});
    }

    setSelectedId(element.id);

    const canvas = event.currentTarget.parentElement;

    if (!canvas) return;

    const actualScale = canvas.getBoundingClientRect().width / canvasSize.width;

    startCanvasInteractionHistory();

    dragSession.current = {
      pointerId: event.pointerId,
      elementId: element.id,
      startClientX: event.clientX,
      startClientY: event.clientY,
      startX: element.x,
      startY: element.y,
      scale: actualScale,
    };

    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handleDragMove(event: React.PointerEvent<HTMLDivElement>) {
    const session = dragSession.current;

    if (!session || session.pointerId !== event.pointerId) {
      return;
    }

    const deltaX = (event.clientX - session.startClientX) / session.scale;
    const deltaY = (event.clientY - session.startClientY) / session.scale;

    const alignmentThreshold = 8;

    const activeElement = elements.find((element) => element.id === session.elementId);

    if (!activeElement) return;

    const elementHeight = activeElement.height;

    const proposedX = session.startX + deltaX;
    const proposedY = session.startY + deltaY;

    const movingXPositions = [
      proposedX,
      proposedX + activeElement.width / 2,
      proposedX + activeElement.width,
    ];

    const movingYPositions = [proposedY, proposedY + elementHeight / 2, proposedY + elementHeight];

    const targetXPositions = [canvasSize.width / 2];

    const targetYPositions = [canvasSize.height / 2];

    for (const element of elements) {
      if (element.id === session.elementId) continue;
      if (!element.visible) continue;

      const targetHeight = element.height;

      targetXPositions.push(element.x, element.x + element.width / 2, element.x + element.width);

      targetYPositions.push(element.y, element.y + targetHeight / 2, element.y + targetHeight);
    }

    const verticalGuide = findClosestAlignment(
      movingXPositions,
      targetXPositions,
      alignmentThreshold,
    );

    const horizontalGuide = findClosestAlignment(
      movingYPositions,
      targetYPositions,
      alignmentThreshold,
    );

    setAlignmentGuides({
      vertical: verticalGuide,
      horizontal: horizontalGuide,
    });

    const updated = latestElementsRef.current.map((element) => {
      if (element.id !== session.elementId) return element;

      const maxX = Math.max(0, canvasSize.width - element.width);
      const maxY = Math.max(0, canvasSize.height - element.height);

      const nextX = snapValue(session.startX + deltaX);
      const nextY = snapValue(session.startY + deltaY);

      return {
        ...element,
        x: Math.max(0, Math.min(maxX, nextX)),
        y: Math.max(0, Math.min(maxY, nextY)),
      };
    });

    latestElementsRef.current = updated;
    setElements(updated);
    syncActiveSlide(updated);
  }

  function handleDragEnd(event: React.PointerEvent<HTMLDivElement>) {
    if (dragSession.current?.pointerId !== event.pointerId) {
      return;
    }

    setAlignmentGuides({
      vertical: null,
      horizontal: null,
    });

    finishCanvasInteractionHistory();

    dragSession.current = null;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  const resizeSession = useRef<ResizeSession | null>(null);

  function handleResizeStart(event: React.PointerEvent<HTMLButtonElement>, element: StudioElement) {
    if (activeTool === "hand") return;

    if (element.locked) {
      return;
    }

    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    const canvas = event.currentTarget.closest('[data-studio-canvas="true"]');

    if (!canvas) return;

    const actualScale = canvas.getBoundingClientRect().width / canvasSize.width;

    startCanvasInteractionHistory();

    resizeSession.current = {
      pointerId: event.pointerId,
      elementId: element.id,
      startClientX: event.clientX,
      startClientY: event.clientY,
      startWidth: element.width,
      startHeight: element.height,
      scale: actualScale,
    };

    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handleResizeMove(event: React.PointerEvent<HTMLButtonElement>) {
    const session = resizeSession.current;

    if (!session || session.pointerId !== event.pointerId) {
      return;
    }

    // Only resize during an active pointer drag.
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) {
      return;
    }

    const deltaX = (event.clientX - session.startClientX) / session.scale;

    const deltaY = (event.clientY - session.startClientY) / session.scale;

    const updated = latestElementsRef.current.map((element) => {
      if (element.id !== session.elementId || element.locked) {
        return element;
      }

      const maxWidth = Math.max(80, canvasSize.width - element.x);
      const maxHeight = Math.max(40, canvasSize.height - element.y);

      const newWidth = Math.max(
        80,
        Math.min(maxWidth, snapValue(element.x + session.startWidth + deltaX) - element.x),
      );

      const minimumHeight = element.type === "card" ? 60 : element.type === "shape" ? 12 : 40;

      const newHeight = Math.max(
        minimumHeight,
        Math.min(maxHeight, snapValue(element.y + session.startHeight + deltaY) - element.y),
      );

      return {
        ...element,
        width: newWidth,
        height: newHeight,
      };
    });

    latestElementsRef.current = updated;
    setElements(updated);
    syncActiveSlide(updated);
  }

  function handleResizeEnd(event: React.PointerEvent<HTMLButtonElement>) {
    if (resizeSession.current?.pointerId !== event.pointerId) {
      return;
    }

    finishCanvasInteractionHistory();

    resizeSession.current = null;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  const rotationSession = useRef<RotationSession | null>(null);

  function normalizeRotation(angle: number) {
    return ((angle % 360) + 360) % 360;
  }

  function handleRotationStart(
    event: React.PointerEvent<HTMLButtonElement>,
    element: StudioElement,
  ) {
    if (activeTool !== "select" || element.locked) return;
    if (event.pointerType === "mouse" && event.button !== 0) return;

    event.preventDefault();
    event.stopPropagation();

    const canvas = event.currentTarget.closest('[data-studio-canvas="true"]');

    if (!canvas) return;

    const canvasRect = canvas.getBoundingClientRect();
    const actualScale = canvasRect.width / canvasSize.width;

    const centerX = canvasRect.left + (element.x + element.width / 2) * actualScale;

    const centerY = canvasRect.top + (element.y + element.height / 2) * actualScale;

    const startPointerAngle =
      Math.atan2(event.clientY - centerY, event.clientX - centerX) * (180 / Math.PI);

    startCanvasInteractionHistory();

    rotationSession.current = {
      pointerId: event.pointerId,
      elementId: element.id,
      centerX,
      centerY,
      startPointerAngle,
      startRotation: element.rotation,
    };

    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handleRotationMove(event: React.PointerEvent<HTMLButtonElement>) {
    const session = rotationSession.current;

    if (!session || session.pointerId !== event.pointerId) return;

    if (!event.currentTarget.hasPointerCapture(event.pointerId)) {
      return;
    }

    const pointerAngle =
      Math.atan2(event.clientY - session.centerY, event.clientX - session.centerX) *
      (180 / Math.PI);

    const deltaAngle = pointerAngle - session.startPointerAngle;

    let nextRotation = session.startRotation + deltaAngle;

    if (event.shiftKey) {
      nextRotation = Math.round(nextRotation / 15) * 15;
    }

    nextRotation = Math.round(normalizeRotation(nextRotation) * 10) / 10;

    const updated = latestElementsRef.current.map((element) =>
      element.id === session.elementId && !element.locked
        ? { ...element, rotation: nextRotation }
        : element,
    );

    latestElementsRef.current = updated;
    setElements(updated);
    syncActiveSlide(updated);
  }

  function handleRotationEnd(event: React.PointerEvent<HTMLButtonElement>) {
    const session = rotationSession.current;

    if (!session || session.pointerId !== event.pointerId) return;

    finishCanvasInteractionHistory();
    rotationSession.current = null;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  const panSession = useRef<PanSession | null>(null);

  function handlePanStart(event: React.PointerEvent<HTMLElement>) {
    if (activeTool !== "hand") return;

    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }

    const workspace = workspaceRef.current;
    if (!workspace) return;

    event.preventDefault();
    event.stopPropagation();

    panSession.current = {
      pointerId: event.pointerId,
      startClientX: event.clientX,
      startClientY: event.clientY,
      startScrollLeft: workspace.scrollLeft,
      startScrollTop: workspace.scrollTop,
    };

    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePanMove(event: React.PointerEvent<HTMLElement>) {
    const session = panSession.current;
    const workspace = workspaceRef.current;

    if (!session || !workspace) return;
    if (session.pointerId !== event.pointerId) return;

    workspace.scrollLeft = session.startScrollLeft - (event.clientX - session.startClientX);

    workspace.scrollTop = session.startScrollTop - (event.clientY - session.startClientY);
  }

  function handlePanEnd(event: React.PointerEvent<HTMLElement>) {
    if (panSession.current?.pointerId !== event.pointerId) {
      return;
    }

    panSession.current = null;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  const workspacePadding = 48;

  const availableWidth = Math.max(1, workspaceSize.width - workspacePadding);

  const availableHeight = Math.max(1, workspaceSize.height - workspacePadding);

  const fitScale = Math.min(availableWidth / canvasSize.width, availableHeight / canvasSize.height);

  const scale = zoom === "fit" ? fitScale : zoom / 100;

  const previewWidth = canvasSize.width * scale;
  const previewHeight = canvasSize.height * scale;

  const displayedZoom = Math.round(scale * 100);

  function changeZoom(nextZoom: number) {
    setZoom(Math.max(25, Math.min(400, nextZoom)));
  }

  const selected = elements.find((el) => el.id === selectedId);

  function updateElement(id: string, changes: Partial<StudioElement>) {
    const updated = latestElementsRef.current.map((element) =>
      element.id === id && !element.locked
        ? ({ ...element, ...changes } as StudioElement)
        : element,
    );

    latestElementsRef.current = updated;
    setElements(updated);
    syncActiveSlide(updated);
  }

  function commitElementUpdate(id: string, changes: Partial<StudioElement>) {
    const target = elements.find((element) => element.id === id);

    if (!target || target.locked) return;

    const hasChanges = Object.entries(changes).some(
      ([key, value]) => target[key as keyof StudioElement] !== value,
    );

    if (!hasChanges) return;

    commitElements(
      elements.map((element) =>
        element.id === id ? ({ ...element, ...changes } as StudioElement) : element,
      ),
    );
  }

  function commitNumericDraft(
    key: string,
    elementId: string,
    property: "fontSize" | "lineHeight" | "letterSpacing" | "width" | "height",
    currentValue: number,
    min: number,
    max: number,
  ) {
    const draft = numericDrafts[key];

    if (draft === undefined) return;

    const trimmed = draft.trim();
    const parsed = trimmed === "" ? NaN : Number(trimmed);

    if (Number.isFinite(parsed)) {
      const clamped = Math.max(min, Math.min(max, parsed));

      if (clamped !== currentValue) {
        commitElementUpdate(elementId, { [property]: clamped });
      }
    }

    setNumericDrafts((previous) => {
      const next = { ...previous };
      delete next[key];
      return next;
    });
  }

  function startTextEditing(element: StudioElement) {
    if (element.type !== "text" || element.locked) return;
    if (activeTool !== "select") return;

    setEditingDraft(element.content);
    setEditingTextId(element.id);
    setSelectedId(element.id);
  }

  function finishTextEditing(save: boolean) {
    if (!editingTextId) return;

    if (save) {
      commitElementUpdate(editingTextId, {
        content: editingDraft,
      });
    }

    setEditingTextId(null);
    setEditingDraft("");
  }

  useEffect(() => {
    if (editingTextId) {
      inlineEditorRef.current?.focus();
      inlineEditorRef.current?.select();
    }
  }, [editingTextId]);

  function addText() {
    const id = crypto.randomUUID();

    commitElements([
      ...elements,
      {
        id,
        type: "text",
        x: 130,
        y: 200,
        width: 820,
        height: 48,
        rotation: 0,
        opacity: 100,
        content: "New text",
        color: "deep-plum",
        fontSize: 40,
        fontWeight: 700,
        visible: true,
        locked: false,
        fontFamily: "plus-jakarta-sans",
        textAlign: "left",
        italic: false,
        lineHeight: 1.2,
        letterSpacing: 0,
      },
    ]);

    setSelectedId(id);
  }

  function addCard() {
    const id = crypto.randomUUID();

    commitElements([
      ...elements,
      {
        id,
        type: "card",
        x: 130,
        y: 340,
        width: 820,
        height: 340,
        rotation: 0,
        opacity: 100,
        color: "blush-paper",
        radius: 24,
        visible: true,
        locked: false,
      },
    ]);

    setSelectedId(id);
  }

  function addShape(shape: StudioShapeType) {
    const id = crypto.randomUUID();
    const isLine = shape === "line";

    const width = isLine ? 360 : 280;
    const height = isLine ? 24 : 220;

    const newShape: StudioElement = {
      id,
      type: "shape",
      shape,
      x: Math.max(0, Math.round((canvasSize.width - width) / 2)),
      y: Math.max(0, Math.round((canvasSize.height - height) / 2)),
      width,
      height,
      rotation: 0,
      opacity: 100,
      visible: true,
      locked: false,
      fill: "signature-aura-pink",
      stroke: "deep-plum",
      strokeWidth: 3,
      fillEnabled: !isLine,
      strokeEnabled: isLine,
      cornerRadius: 24,
    };

    commitElements([...elements, newShape]);
    setSelectedId(id);
    setNumericDrafts({});
  }

  function duplicateSelected() {
    if (!selectedId) return;

    const source = elements.find((element) => element.id === selectedId);

    if (!source || source.locked) return;

    const offset = 24;

    const duplicate: StudioElement = {
      ...source,
      id: crypto.randomUUID(),
      x: Math.max(0, Math.min(canvasSize.width - source.width, source.x + offset)),
      y: Math.max(0, Math.min(canvasSize.height - source.height, source.y + offset)),
    };

    const sourceIndex = elements.findIndex((element) => element.id === selectedId);

    const updated = [...elements];

    updated.splice(sourceIndex + 1, 0, duplicate);

    commitElements(updated);
    setSelectedId(duplicate.id);
  }

  function copySelected() {
    if (!selectedId) return;

    const source = elements.find((element) => element.id === selectedId);

    if (!source) return;

    copiedElementRef.current = { ...source };
    pasteCountRef.current = 0;
    setHasCopiedElement(true);
  }

  function pasteCopied() {
    const source = copiedElementRef.current;
    if (!source) return;

    pasteCountRef.current += 1;

    const offset = pasteCountRef.current * 24;

    const duplicate: StudioElement = {
      ...source,
      id: crypto.randomUUID(),
      locked: false,
      visible: true,
      x: Math.max(0, Math.min(canvasSize.width - source.width, source.x + offset)),
      y: Math.max(0, Math.min(canvasSize.height - source.height, source.y + offset)),
    };

    commitElements([...elements, duplicate]);
    setSelectedId(duplicate.id);
  }

  function deleteSelected() {
    if (!selectedId) return;

    const selectedElement = elements.find((element) => element.id === selectedId);

    if (!selectedElement || selectedElement.locked) {
      return;
    }

    commitElements(elements.filter((element) => element.id !== selectedId));

    setSelectedId(null);
  }

  function toggleVisibility(id: string) {
    const target = elements.find((element) => element.id === id);
    if (!target) return;

    commitElements(
      elements.map((element) =>
        element.id === id ? { ...element, visible: !element.visible } : element,
      ),
    );
  }

  function toggleLock(id: string) {
    const target = elements.find((element) => element.id === id);
    if (!target) return;

    commitElements(
      elements.map((element) =>
        element.id === id ? { ...element, locked: !element.locked } : element,
      ),
    );
  }

  type LayerMove = "front" | "forward" | "backward" | "back";

  function moveLayer(id: string, direction: LayerMove) {
    const currentIndex = elements.findIndex((element) => element.id === id);

    if (currentIndex === -1) return;

    const element = elements[currentIndex];

    // Locked layers cannot be reordered.
    if (element.locked) return;

    const lastIndex = elements.length - 1;

    const targetIndex =
      direction === "front"
        ? lastIndex
        : direction === "forward"
          ? Math.min(currentIndex + 1, lastIndex)
          : direction === "backward"
            ? Math.max(currentIndex - 1, 0)
            : 0;

    // Avoid creating history when the layer cannot move.
    if (targetIndex === currentIndex) return;

    const updated = [...elements];

    updated.splice(currentIndex, 1);
    updated.splice(targetIndex, 0, element);

    commitElements(updated);
  }

  function startSliderHistory() {
    if (sliderStartRef.current !== null) return;

    sliderStartRef.current = elements;
  }

  function finishSliderHistory() {
    const startingElements = sliderStartRef.current;
    if (!startingElements) return;

    sliderStartRef.current = null;

    if (JSON.stringify(startingElements) === JSON.stringify(latestElementsRef.current)) {
      return;
    }

    setPast((previous) => [...previous.slice(-49), startingElements]);
    setFuture([]);
  }

  function cancelSliderHistory() {
    sliderStartRef.current = null;
  }

  function startCanvasInteractionHistory() {
    canvasInteractionStartRef.current = latestElementsRef.current;
  }

  function finishCanvasInteractionHistory() {
    const startingElements = canvasInteractionStartRef.current;
    if (!startingElements) return;

    canvasInteractionStartRef.current = null;

    if (JSON.stringify(startingElements) === JSON.stringify(latestElementsRef.current)) {
      return;
    }

    setPast((previous) => [...previous.slice(-49), startingElements]);

    setFuture([]);
  }

  function snapValue(value: number) {
    if (!snapToGrid) {
      return Math.round(value);
    }

    return Math.round(value / gridSize) * gridSize;
  }

  function renderRotationHandle(element: StudioElement) {
    if (
      selectedId !== element.id ||
      element.locked ||
      activeTool !== "select" ||
      editingTextId === element.id
    ) {
      return null;
    }

    return (
      <StudioRotationHandle
        scale={scale}
        onPointerDown={(event) => handleRotationStart(event, element)}
        onPointerMove={handleRotationMove}
        onPointerUp={handleRotationEnd}
        onPointerCancel={handleRotationEnd}
        onLostPointerCapture={(event) => {
          if (rotationSession.current?.pointerId === event.pointerId) {
            finishCanvasInteractionHistory();
            rotationSession.current = null;
          }
        }}
        onReset={() => commitElementUpdate(element.id, { rotation: 0 })}
      />
    );
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (editorLocked) return;

      const target = event.target;

      if (
        target instanceof HTMLElement &&
        (target.closest("input, textarea, select") || target.isContentEditable)
      ) {
        return;
      }

      if (editingTextId !== null) return;

      // Delete or Backspace removes the selected canvas element.
      if (
        (event.key === "Delete" || event.key === "Backspace") &&
        !event.metaKey &&
        !event.ctrlKey &&
        !event.altKey &&
        !event.shiftKey
      ) {
        if (!selectedId) return;

        const selectedElement = elements.find((element) => element.id === selectedId);

        if (!selectedElement || selectedElement.locked) return;

        event.preventDefault();

        const updated = elements.filter((element) => element.id !== selectedId);

        setPast((previous) => [...previous.slice(-49), elements]);
        setFuture([]);

        latestElementsRef.current = updated;
        setElements(updated);
        syncActiveSlide(updated);
        setSelectedId(null);

        return;
      }

      if (!(event.metaKey || event.ctrlKey)) return;
      if (event.altKey) return;

      const key = event.key.toLowerCase();

      if (key === "c" && !event.shiftKey) {
        if (!selectedId) return;

        const source = elements.find((element) => element.id === selectedId);

        if (!source) return;

        event.preventDefault();

        copiedElementRef.current = { ...source };
        pasteCountRef.current = 0;
        setHasCopiedElement(true);

        return;
      }

      if (key === "v" && !event.shiftKey) {
        const source = copiedElementRef.current;
        if (!source) return;

        event.preventDefault();

        pasteCountRef.current += 1;

        const offset = pasteCountRef.current * 24;

        const duplicate: StudioElement = {
          ...source,
          id: crypto.randomUUID(),
          locked: false,
          visible: true,
          x: Math.max(0, Math.min(canvasSize.width - source.width, source.x + offset)),
          y: Math.max(0, Math.min(canvasSize.height - source.height, source.y + offset)),
        };

        const updated = [...elements, duplicate];

        setPast((previous) => [...previous.slice(-49), elements]);
        setFuture([]);
        latestElementsRef.current = updated;
        setElements(updated);
        syncActiveSlide(updated);
        setSelectedId(duplicate.id);

        return;
      }

      if (key === "d" && !event.shiftKey) {
        if (!selectedId) return;

        const source = elements.find((element) => element.id === selectedId);

        if (!source || source.locked) return;

        event.preventDefault();

        const duplicate: StudioElement = {
          ...source,
          id: crypto.randomUUID(),
          x: Math.max(0, Math.min(canvasSize.width - source.width, source.x + 24)),
          y: Math.max(0, Math.min(canvasSize.height - source.height, source.y + 24)),
        };

        const sourceIndex = elements.findIndex((element) => element.id === selectedId);

        const updated = [...elements];
        updated.splice(sourceIndex + 1, 0, duplicate);

        setPast((previous) => [...previous.slice(-49), elements]);
        setFuture([]);
        latestElementsRef.current = updated;
        setElements(updated);
        syncActiveSlide(updated);
        setSelectedId(duplicate.id);

        return;
      }

      if (key !== "z") return;

      if (event.shiftKey) {
        if (future.length === 0) return;

        event.preventDefault();

        const nextElements = future[0];

        setPast((previous) => [...previous, elements]);
        setFuture((previous) => previous.slice(1));
        latestElementsRef.current = nextElements;
        setElements(nextElements);
        syncActiveSlide(nextElements);
        setSelectedId(null);
      } else {
        if (past.length === 0) return;

        event.preventDefault();

        const previousElements = past[past.length - 1];

        setFuture((previous) => [elements, ...previous]);
        setPast((previous) => previous.slice(0, -1));
        latestElementsRef.current = previousElements;
        setElements(previousElements);
        syncActiveSlide(previousElements);
        setSelectedId(null);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    elements,
    past,
    future,
    editingTextId,
    selectedId,
    canvasSize.width,
    canvasSize.height,
    syncActiveSlide,
    editorLocked,
  ]);

  useEffect(() => {
    const workspace = workspaceRef.current;
    if (!workspace) return;

    const measureWorkspace = () => {
      setWorkspaceSize({
        width: workspace.clientWidth,
        height: workspace.clientHeight,
      });
    };

    measureWorkspace();

    const observer = new ResizeObserver(measureWorkspace);
    observer.observe(workspace);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      inert={editorLocked}
      aria-busy={editorLocked}
      className={editorLocked ? "cursor-wait" : undefined}
    >
      <div
        className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-4"
        style={{
          background: brandColor("surface"),
          color: brandColor("foreground"),
          borderColor: brandColor("border"),
        }}
      >
        <div className="flex flex-col">
          <span className="font-semibold">Design Editor</span>
          <span className="text-xs opacity-60">
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="text"
                aria-label="Project name"
                title="Click to rename project"
                value={projectNameDraft ?? project.name}
                maxLength={100}
                onChange={(event) => setProjectNameDraft(event.target.value)}
                onFocus={() => {
                  cancelProjectRenameRef.current = false;
                  setProjectNameDraft(project.name);
                }}
                onBlur={() => {
                  if (!cancelProjectRenameRef.current && projectNameDraft !== null) {
                    renameProject(projectNameDraft);
                  }

                  cancelProjectRenameRef.current = false;
                  setProjectNameDraft(null);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.currentTarget.blur();
                  }

                  if (event.key === "Escape") {
                    cancelProjectRenameRef.current = true;
                    event.currentTarget.blur();
                  }
                }}
                className="w-52 min-w-0 rounded-md border border-transparent bg-transparent px-1 py-0.5 text-sm font-semibold text-[#51283D] transition outline-none hover:border-pink-200 focus:border-[#ED3F98] focus:bg-white"
              />

              <span className="text-foreground/50 text-xs">· {project.slides.length} slides</span>
            </div>
          </span>
          <span role="status" className="text-xs opacity-60">
            {saveStatus}
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          <input
            ref={projectFileInputRef}
            type="file"
            accept=".json,.studio.json,application/json"
            className="hidden"
            aria-label="Open Studio project"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void importProjectJson(file);
            }}
          />

          {/* New Project */}
          <button
            type="button"
            onClick={createNewProject}
            disabled={projectActionsDisabled || cloudLoading}
            className="studio-control studio-button"
            title="Create a new blank Studio project"
          >
            <FilePlus size={17} />
            New Project
          </button>

          {/* Cloud Library */}
          <button
            type="button"
            onClick={() => {
              setCloudLibraryOpen(true);
              setCloudNotice(null);
              void refreshCloudLibrary();
            }}
            disabled={projectActionsDisabled || cloudLoading}
            className="studio-control studio-button"
            title="Browse your saved cloud projects"
          >
            <FolderOpen size={17} />
            Cloud Library
          </button>

          {/* Import JSON */}
          <button
            type="button"
            onClick={() => projectFileInputRef.current?.click()}
            disabled={projectActionsDisabled}
            className="studio-control studio-button"
            title="Import a saved Studio JSON project"
          >
            <FileUp size={17} />
            Import JSON
          </button>

          {/* Download JSON */}
          <button
            type="button"
            onClick={exportProjectJson}
            disabled={editorLocked}
            className="studio-control studio-button"
            title="Download an editable Studio JSON backup"
          >
            <FileDown size={17} />
            Download JSON
          </button>

          {/* Context-aware cloud save */}
          <button
            type="button"
            onClick={saveProjectToCloud}
            disabled={cloudSaveButtonDisabled}
            className="studio-control studio-button"
            aria-live="polite"
            title={
              cloudHasConflict
                ? "Resolve the cloud revision conflict before saving"
                : cloudIsSynced
                  ? "All project changes are saved to the cloud"
                  : cloudSession
                    ? "Synchronize current changes to the cloud"
                    : "Create a cloud-saved project"
            }
          >
            <CloudSaveIcon size={17} className={cloudSaving ? "animate-spin" : ""} />

            {cloudSaveButtonLabel}
          </button>

          {/* Save as Copy */}
          {cloudSession && (
            <button
              type="button"
              onClick={saveProjectAsCopy}
              disabled={projectActionsDisabled || cloudLoading}
              className="studio-control studio-button"
              title="Save this design as a separate cloud project"
            >
              <Copy size={17} />
              Save as Copy
            </button>
          )}

          <button
            type="button"
            onClick={() => void exportSlidePng()}
            disabled={projectActionsDisabled}
            className="studio-control studio-button disabled:opacity-40"
            title="Export active slide as PNG"
          >
            <ImageDown size={17} /> {exportingPng ? "Exporting…" : "Export PNG"}
          </button>

          <button
            type="button"
            onClick={() => void exportAllSlidesZip()}
            disabled={projectActionsDisabled || project.slides.length === 0}
            className="studio-control studio-button disabled:opacity-40"
            title="Export every slide as a PNG inside one ZIP file"
          >
            <ImageDown size={17} />
            {exportingAllSlides ? "Exporting Slides…" : `Export All (${project.slides.length})`}
          </button>

          <button type="button" onClick={addText} className="studio-control studio-button">
            <Type size={17} strokeWidth={1.8} />
            <span>Add Text</span>
          </button>

          <button type="button" onClick={addCard} className="studio-control studio-button">
            <SquarePlus size={17} strokeWidth={1.8} />
            <span>Add Card</span>
          </button>

          <div className="flex flex-wrap items-center gap-2">
            <select
              aria-label="Add a shape"
              defaultValue=""
              className="studio-field text-sm"
              onChange={(event) => {
                if (!event.target.value) return;

                addShape(event.target.value as StudioShapeType);
                event.target.value = "";
              }}
            >
              <option value="" disabled>
                + Add Shape
              </option>
              <option value="rectangle">Rectangle</option>
              <option value="rounded-rectangle">Rounded Rectangle</option>
              <option value="ellipse">Ellipse / Circle</option>
              <option value="triangle">Triangle</option>
              <option value="diamond">Diamond</option>
              <option value="line">Line</option>
            </select>
          </div>

          <button
            type="button"
            onClick={duplicateSelected}
            disabled={!selected || selected.locked}
            className="studio-control studio-button disabled:cursor-not-allowed disabled:opacity-40"
            title="Duplicate selected element"
          >
            <Copy size={17} strokeWidth={1.8} />
            <span>Duplicate</span>
          </button>

          <button
            type="button"
            onClick={copySelected}
            disabled={!selected}
            className="studio-control studio-button disabled:cursor-not-allowed disabled:opacity-40"
            title="Copy selected element"
          >
            <Copy size={17} strokeWidth={1.8} />
            <span>Copy</span>
          </button>

          <button
            type="button"
            onClick={pasteCopied}
            disabled={!hasCopiedElement}
            className="studio-control studio-button disabled:cursor-not-allowed disabled:opacity-40"
            title="Paste copied element"
          >
            <ClipboardPaste size={17} strokeWidth={1.8} />
            <span>Paste</span>
          </button>

          <select
            aria-label="Canvas format"
            value={canvasPreset}
            onChange={(event) => updateCanvasPreset(event.target.value as CanvasPreset)}
            className="studio-field w-auto px-3 py-2 text-sm"
          >
            {Object.entries(canvasPresets).map(([key, preset]) => (
              <option key={key} value={key}>
                {preset.label} ({preset.width} × {preset.height})
              </option>
            ))}
          </select>

          <div className="studio-control-group flex-wrap gap-3 px-3 py-2">
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={showGrid}
                onChange={(event) => setShowGrid(event.target.checked)}
                className="cursor-pointer accent-[#ED3F98]"
              />
              Show Grid
            </label>

            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={snapToGrid}
                onChange={(event) => setSnapToGrid(event.target.checked)}
                className="cursor-pointer accent-[#ED3F98]"
              />
              Snap
            </label>

            <label className="flex cursor-pointer items-center gap-2 text-sm accent-[#ED3F98]">
              <input
                type="checkbox"
                checked={showCenterlines}
                onChange={(event) => setShowCenterlines(event.target.checked)}
                className="cursor-pointer accent-[#ED3F98]"
              />
              Centerlines
            </label>

            <label className="flex items-center gap-2 text-sm">
              Spacing
              <select
                aria-label="Grid spacing"
                value={gridSize}
                onChange={(event) => setGridSize(Number(event.target.value))}
                className="studio-field w-auto px-2 py-1 text-sm"
              >
                {[10, 20, 25, 40, 50, 100].map((size) => (
                  <option key={size} value={size}>
                    {size}px
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="studio-control-group p-1">
            <button
              type="button"
              onClick={() => setActiveTool("select")}
              aria-pressed={activeTool === "select"}
              className={`hover:text-foreground cursor-pointer rounded-lg px-3 py-2 text-sm transition-colors hover:bg-pink-50 ${
                activeTool === "select" && "studio-control studio-button"
              }`}
            >
              Select
            </button>

            <button
              type="button"
              onClick={() => setActiveTool("hand")}
              aria-pressed={activeTool === "hand"}
              className={`hover:text-foreground cursor-pointer rounded-lg px-3 py-2 text-sm transition-colors hover:bg-pink-50 ${
                activeTool === "hand" && "studio-control studio-button"
              }`}
            >
              Hand
            </button>
          </div>

          <div className="studio-control-group px-3 py-2">
            <button
              type="button"
              onClick={() => changeZoom(displayedZoom - 25)}
              disabled={displayedZoom <= 25}
              aria-label="Zoom out"
              className="studio-control px-2 py-1"
            >
              −
            </button>

            <span className="min-w-12 text-center text-sm tabular-nums">{displayedZoom}%</span>

            <button
              type="button"
              onClick={() => changeZoom(displayedZoom + 25)}
              disabled={displayedZoom >= 400}
              aria-label="Zoom in"
              className="studio-control px-2 py-1"
            >
              +
            </button>

            <button
              type="button"
              onClick={() => setZoom("fit")}
              className="studio-control px-2 py-1"
            >
              Fit
            </button>

            <button type="button" onClick={() => setZoom(100)} className="studio-control px-2 py-1">
              100%
            </button>
          </div>

          <div className="studio-control-group gap-1 p-1">
            <button
              type="button"
              onClick={undo}
              disabled={past.length === 0}
              aria-label="Undo"
              title="Undo"
              className="studio-control studio-icon-button disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Undo2 size={17} strokeWidth={1.8} />
            </button>

            <button
              type="button"
              onClick={redo}
              disabled={future.length === 0}
              aria-label="Redo"
              title="Redo"
              className="studio-control studio-icon-button disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Redo2 size={17} strokeWidth={1.8} />
            </button>
          </div>
        </div>
      </div>

      <div
        className="text-muted flex flex-wrap items-center justify-between gap-3 px-4 py-2 text-xs"
        aria-live="polite"
      >
        <div className="flex flex-wrap items-center gap-2">
          {!cloudSession ? (
            <>
              <Save size={14} className="text-accent" />

              <span>Local project · Browser recovery</span>
            </>
          ) : (
            <>
              {cloudHasConflict ? (
                <AlertTriangle size={14} className="text-accent" />
              ) : (
                <CloudSaveIcon
                  size={14}
                  className={cloudSaving ? "text-accent animate-spin" : "text-accent"}
                />
              )}

              <span>Cloud project · Revision {cloudSession.revision}</span>

              <span>
                {cloudSaving
                  ? "· Synchronizing…"
                  : cloudHasConflict
                    ? "· Conflict — synchronization paused"
                    : cloudSyncState === "offline"
                      ? "· Offline — local recovery active"
                      : cloudNeedsRetry
                        ? "· Cloud synchronization paused"
                        : cloudDirty
                          ? "· Unsaved cloud changes"
                          : "· All changes synchronized"}
              </span>
            </>
          )}
        </div>

        {cloudSession && cloudHasConflict && (
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={exportProjectJson}
              disabled={editorLocked}
              className="studio-control studio-button cursor-pointer text-xs disabled:cursor-not-allowed"
            >
              <FileDown size={13} />
              Download Backup
            </button>

            <button
              type="button"
              onClick={saveProjectAsCopy}
              disabled={projectActionsDisabled || cloudLoading}
              className="studio-control studio-button cursor-pointer text-xs disabled:cursor-not-allowed"
            >
              <Copy size={13} />
              Preserve as Copy
            </button>

            <button
              type="button"
              disabled={projectActionsDisabled || cloudLoading}
              onClick={() => {
                setCloudLibraryOpen(true);
                void refreshCloudLibrary();
              }}
              className="studio-control studio-button cursor-pointer text-xs disabled:cursor-not-allowed"
            >
              <FolderOpen size={13} />
              Open Cloud Library
            </button>
          </div>
        )}
      </div>

      {cloudNotice && (
        <div
          role="alert"
          className="mx-4 my-2 rounded-xl border border-rose-300 bg-rose-50 p-3 text-sm text-rose-900"
        >
          {cloudNotice}
        </div>
      )}

      {cloudLibraryOpen && (
        <section
          className="studio-panel my-4 min-w-0 p-4 sm:p-5"
          aria-label="Cloud Project Library"
        >
          {/* Header */}
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-foreground flex items-center gap-2 text-sm font-semibold">
                <Cloud size={17} className="text-accent" />
                Cloud Project Library
              </h2>

              <p className="text-muted mt-1 text-xs">Private projects stored in Supabase</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => void refreshCloudLibrary()}
                disabled={projectActionsDisabled}
                className="studio-control studio-button text-xs"
                title="Refresh cloud projects"
              >
                <RefreshCw size={14} className={cloudLoading ? "animate-spin" : ""} />
                Refresh
              </button>

              <button
                type="button"
                onClick={() => setCloudLibraryOpen(false)}
                className="studio-control studio-button text-xs"
              >
                <X size={14} />
                Close
              </button>
            </div>
          </div>

          {/* Project count */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
            <p className="text-muted text-xs">
              {cloudProjects.length}{" "}
              {cloudProjects.length === 1 ? "saved project" : "saved projects"}
            </p>

            <span className="text-muted flex items-center gap-1.5 text-xs">
              <CheckCircle2 size={13} className="text-accent" />
              Private library
            </span>
          </div>

          {/* Loading state */}
          {cloudLoading && cloudProjects.length === 0 && (
            <div className="border-default bg-surface-elevated text-muted mt-3 flex items-center gap-2 rounded-lg border p-4 text-sm">
              <RefreshCw size={16} className="text-accent animate-spin" />
              Loading cloud projects…
            </div>
          )}

          {/* Empty state */}
          {!cloudLoading && cloudProjects.length === 0 && (
            <div className="border-default bg-surface-elevated mt-3 flex flex-col items-center rounded-lg border border-dashed p-8 text-center">
              <CloudDownload size={26} className="text-accent mb-3" strokeWidth={1.5} />

              <h3 className="text-foreground text-sm font-semibold">No cloud projects yet</h3>

              <p className="text-muted mt-2 max-w-sm text-xs leading-relaxed">
                Use Save to Cloud in the editor toolbar to save your first project.
              </p>
            </div>
          )}

          {/* Saved projects */}
          {cloudProjects.length > 0 && (
            <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {cloudProjects.map((item) => {
                const isCurrentProject = cloudSession?.id === item.id;

                return (
                  <article
                    key={item.id}
                    className="border-default bg-surface-elevated flex min-w-0 flex-col rounded-lg border p-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-start gap-3">
                        <div
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                          style={{
                            backgroundColor: "var(--color-chip-bg)",
                            color: "var(--color-accent)",
                            border: "1px solid var(--color-chip-border)",
                          }}
                        >
                          <FolderOpen size={19} strokeWidth={1.7} />
                        </div>

                        <div className="min-w-0">
                          <h3
                            className="text-foreground truncate text-sm font-semibold"
                            title={item.name}
                          >
                            {item.name}
                          </h3>

                          <p className="text-muted mt-1 text-xs">Revision {item.revision}</p>
                        </div>
                      </div>

                      {isCurrentProject && (
                        <span
                          className="shrink-0 rounded-md px-2 py-1 text-[11px] font-medium"
                          style={{
                            backgroundColor: "var(--color-chip-bg)",
                            color: "var(--color-chip-text)",
                            border: "1px solid var(--color-chip-border)",
                          }}
                        >
                          Current
                        </span>
                      )}
                    </div>

                    <div className="text-muted mt-4 flex items-center gap-1.5 text-xs">
                      <CalendarDays size={13} />
                      <time dateTime={item.updated_at}>
                        {new Date(item.updated_at).toLocaleString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </time>
                    </div>

                    <div className="border-default mt-4 flex flex-wrap items-center justify-between gap-3 border-t pt-3">
                      <span className="text-muted text-xs">
                        {isCurrentProject
                          ? cloudDirty
                            ? "Unsaved changes"
                            : "Up to date"
                          : "Cloud saved"}
                      </span>

                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          disabled={projectActionsDisabled || cloudLoading}
                          onClick={() => void openCloudProject(item.id)}
                          className="studio-control studio-button text-xs"
                        >
                          <FolderOpen size={14} />
                          Open Project
                        </button>

                        <button
                          type="button"
                          disabled={projectActionsDisabled || cloudLoading}
                          onClick={() => void deleteCloudProject(item.id, item.name)}
                          className="studio-control studio-button text-xs"
                          aria-label={`Delete ${item.name} from cloud`}
                          title={`Delete ${item.name}`}
                        >
                          <Trash2 size={14} />
                          {cloudDeletingId === item.id ? "Deleting…" : "Delete"}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      )}

      <div
        className="grid min-h-150 items-start gap-4 lg:grid-cols-[220px_minmax(0,1fr)_280px]"
        style={{ color: brandColor("foreground") }}
      >
        {/* Layers */}
        <aside className="studio-panel flex h-150 min-h-0 flex-col p-4">
          <h2 className="mb-4 shrink-0 font-bold">Layers</h2>

          <div className="min-h-0 flex-1 space-y-2 overflow-y-auto overscroll-contain pr-1">
            {[...elements].reverse().map((element) => (
              <div
                key={element.id}
                className={`studio-layer relative ${
                  draggedLayerId === element.id ? "opacity-40" : ""
                }`}
                data-selected={selectedId === element.id}
                onDragOver={(event) => {
                  if (!draggedLayerId || draggedLayerId === element.id) return;

                  event.preventDefault();
                  event.dataTransfer.dropEffect = "move";

                  const bounds = event.currentTarget.getBoundingClientRect();
                  const midpoint = bounds.top + bounds.height / 2;

                  setLayerDropTarget({
                    layerId: element.id,
                    position: event.clientY < midpoint ? "before" : "after",
                  });
                }}
                onDrop={(event) => {
                  event.preventDefault();

                  if (draggedLayerId && draggedLayerId !== element.id) {
                    const bounds = event.currentTarget.getBoundingClientRect();
                    const midpoint = bounds.top + bounds.height / 2;

                    reorderLayer(
                      draggedLayerId,
                      element.id,
                      event.clientY < midpoint ? "before" : "after",
                    );
                  }

                  setDraggedLayerId(null);
                  setLayerDropTarget(null);
                }}
              >
                {layerDropTarget?.layerId === element.id && (
                  <div
                    className={`pointer-events-none absolute right-0 left-0 z-10 h-1 rounded-full bg-pink-500 ${
                      layerDropTarget.position === "before" ? "-top-1" : "-bottom-1"
                    }`}
                  />
                )}
                <span
                  draggable={!element.locked}
                  title={
                    element.locked ? "Unlock this layer to reorder it" : "Drag to reorder layer"
                  }
                  aria-label={`Drag ${element.type} layer to reorder`}
                  className={`studio-layer-icon shrink-0 ${
                    element.locked
                      ? "cursor-not-allowed opacity-30"
                      : "cursor-grab active:cursor-grabbing"
                  }`}
                  onDragStart={(event) => {
                    if (element.locked) {
                      event.preventDefault();
                      return;
                    }

                    event.dataTransfer.effectAllowed = "move";
                    event.dataTransfer.setData("text/plain", element.id);

                    setDraggedLayerId(element.id);
                    setLayerDropTarget(null);
                  }}
                  onDragEnd={() => {
                    setDraggedLayerId(null);
                    setLayerDropTarget(null);
                  }}
                >
                  <GripVertical size={15} strokeWidth={1.8} />
                </span>
                <button
                  type="button"
                  onClick={() => {
                    if (selectedId !== element.id) {
                      setNumericDrafts({});
                    }

                    setSelectedId(element.id);
                  }}

                  aria-pressed={selectedId === element.id}
                  className={`min-w-0 flex-1 cursor-pointer truncate text-left text-sm ${
                    element.visible ? "" : "opacity-40"
                  }`}
                >
                  {element.type === "text"
                    ? element.content || "Text"
                    : element.type === "shape"
                      ? element.shape
                          .split("-")
                          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(" ")
                      : "Glass Card"}
                </button>

                <button
                  type="button"
                  onClick={() => toggleVisibility(element.id)}
                  title={element.visible ? "Hide layer" : "Show layer"}
                  aria-label={element.visible ? "Hide layer" : "Show layer"}
                  aria-pressed={!element.visible}
                  className="studio-layer-icon"
                >
                  {element.visible ? (
                    <Eye size={16} strokeWidth={1.8} />
                  ) : (
                    <EyeOff size={16} strokeWidth={1.8} />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => toggleLock(element.id)}
                  title={element.locked ? "Unlock layer" : "Lock layer"}
                  aria-label={element.locked ? "Unlock layer" : "Lock layer"}
                  aria-pressed={element.locked}
                  className="studio-layer-icon"
                >
                  {element.locked ? (
                    <Lock size={16} strokeWidth={1.8} />
                  ) : (
                    <LockOpen size={16} strokeWidth={1.8} />
                  )}
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={() => setSelectedId(null)}
              className="studio-control w-full justify-start p-3 text-left"
              aria-pressed={selectedId === null}
            >
              Background
            </button>
          </div>
        </aside>

        {/* Canvas */}
        <section
          ref={workspaceRef}
          className="studio-workspace h-150 min-w-0 overflow-auto p-6"
          onClick={(event) => {
            if (activeTool !== "select") return;

            const target = event.target as HTMLElement;

            if (!target.closest('[data-studio-canvas="true"]')) {
              setSelectedId(null);
            }
          }}
          onPointerDownCapture={(event) => {
            if (activeTool === "hand") {
              handlePanStart(event);
            }
          }}
          onPointerMove={handlePanMove}
          onPointerUp={handlePanEnd}
          onPointerCancel={handlePanEnd}
          style={{
            cursor: activeTool === "hand" ? "grab" : "default",
            touchAction: activeTool === "hand" ? "none" : "auto",
          }}
        >
          <div className="flex min-h-full w-max min-w-full items-center justify-center">
            <div
              className="relative shrink-0 overflow-hidden shadow-xl"
              style={{
                width: previewWidth,
                height: previewHeight,

                background: brandColor(backgroundColor),
              }}
              ref={canvasExportRef}
              data-studio-canvas="true"
              onClick={() => {
                if (activeTool === "select") {
                  setSelectedId(null);
                }
              }}
            >
              <StudioBackgroundEffects
                effects={activeSlide?.backgroundEffects ?? []}
                canvasWidth={canvasSize.width}
                canvasHeight={canvasSize.height}
              />
              {showGrid && (
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 z-20"
                  style={{
                    backgroundImage: `
                  linear-gradient(
                  to right,
                rgba(180, 75, 125, 0.25) 1px,
                  transparent 1px
                  ),
                  linear-gradient(
                  to bottom,
                  rgba(180, 75, 125, 0.25) 1px,
                  transparent 1px
                  )
                  `,
                    backgroundSize: `${gridSize * scale}px ${gridSize * scale}px`,
                  }}
                />
              )}

              {showCenterlines && (
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-30">
                  {/* Vertical centerline */}
                  <div
                    className="absolute inset-y-0"
                    style={{
                      left: "50%",
                      width: 1,
                      backgroundColor: "#00B8D9",
                    }}
                  />

                  {/* Horizontal centerline */}
                  <div
                    className="absolute inset-x-0"
                    style={{
                      top: "50%",
                      height: 1,
                      backgroundColor: "#00B8D9",
                    }}
                  />

                  {/* Center intersection */}
                  <div
                    className="absolute size-2 rounded-full"
                    style={{
                      left: "50%",
                      top: "50%",
                      backgroundColor: "#00B8D9",
                      transform: "translate(-50%, -50%)",
                    }}
                  />
                </div>
              )}

              {(alignmentGuides.vertical !== null || alignmentGuides.horizontal !== null) && (
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-40">
                  {alignmentGuides.vertical !== null && (
                    <div
                      className="absolute inset-y-0"
                      style={{
                        left: alignmentGuides.vertical * scale,
                        width: 1,
                        backgroundColor: "#E11D8A",
                      }}
                    />
                  )}

                  {alignmentGuides.horizontal !== null && (
                    <div
                      className="absolute inset-x-0"
                      style={{
                        top: alignmentGuides.horizontal * scale,
                        height: 1,
                        backgroundColor: "#E11D8A",
                      }}
                    />
                  )}
                </div>
              )}

              {elements
                .filter((element) => element.visible)
                .map((element) => {
                  const commonStyle = {
                    position: "absolute" as const,
                    left: element.x * scale,
                    top: element.y * scale,
                    width: element.width * scale,
                    opacity: element.opacity / 100,
                    transform: `rotate(${element.rotation}deg)`,
                    cursor: "pointer",
                    outline:
                      selectedId === element.id ? `2px solid ${brandColor("accent")}` : "none",
                    touchAction: "none" as const,
                    userSelect: "none" as const,
                  };

                  if (element.type === "shape") {
                    return (
                      <div
                        key={element.id}
                        style={{
                          ...commonStyle,
                          height: element.height * scale,
                        }}
                        onClick={(event) => {
                          event.stopPropagation();

                          if (activeTool === "select") {
                            if (selectedId !== element.id) {
                              setNumericDrafts({});
                            }

                            setSelectedId(element.id);
                          }
                        }}
                        onPointerDown={(event) => handleDragStart(event, element)}
                        onPointerMove={handleDragMove}
                        onPointerUp={handleDragEnd}
                        onPointerCancel={handleDragEnd}
                        onLostPointerCapture={(event) => {
                          if (dragSession.current?.pointerId === event.pointerId) {
                            finishCanvasInteractionHistory();
                            dragSession.current = null;
                          }
                        }}
                      >
                        <StudioShape element={element} />

                        {renderRotationHandle(element)}

                        {selectedId === element.id && !element.locked && (
                          <button
                            type="button"
                            aria-label="Resize shape"
                            title="Drag to resize"
                            onClick={(event) => event.stopPropagation()}
                            onPointerDown={(event) => handleResizeStart(event, element)}
                            onPointerMove={handleResizeMove}
                            onPointerUp={handleResizeEnd}
                            onPointerCancel={handleResizeEnd}
                            onLostPointerCapture={(event) => {
                              if (resizeSession.current?.pointerId === event.pointerId) {
                                finishCanvasInteractionHistory();
                                resizeSession.current = null;
                              }
                            }}
                            className="absolute -right-1.5 -bottom-1.5 z-10 size-3 cursor-nwse-resize rounded-sm border-2 border-white bg-[#C42B70] shadow-sm"
                            style={{ touchAction: "none" }}
                          />
                        )}
                      </div>
                    );
                  }

                  if (element.type === "card") {
                    return (
                      <div
                        key={element.id}

                        onClick={(event) => {
                          event.stopPropagation();

                          if (activeTool === "select") {
                            if (selectedId !== element.id) {
                              setNumericDrafts({});
                            }

                            setSelectedId(element.id);
                          }
                        }}

                        style={{
                          ...commonStyle,
                          height: element.height * scale,
                          background:
                            element.fillType === "gradient" && element.gradient
                              ? studioGradientToCSS(element.gradient)
                              : brandColor(element.color),
                          borderRadius: element.radius * scale,
                          border: `1px solid ${brandColor("glass-border")}`,
                          backdropFilter: "blur(16px)",
                        }}
                        onPointerDown={(event) => handleDragStart(event, element)}
                        onPointerMove={handleDragMove}
                        onPointerUp={handleDragEnd}
                        onPointerCancel={handleDragEnd}
                        onLostPointerCapture={(event) => {
                          if (dragSession.current?.pointerId === event.pointerId) {
                            finishCanvasInteractionHistory();
                            dragSession.current = null;
                          }
                        }}
                      >
                        {(element.effects?.length ?? 0) > 0 && (
                          <div
                            className="pointer-events-none absolute inset-0 overflow-hidden"
                            style={{ borderRadius: "inherit" }}
                          >
                            <div
                              className="absolute top-0 left-0 origin-top-left"
                              style={{
                                width: element.width,
                                height: element.height,
                                transform: `scale(${scale})`,
                              }}
                            >
                              <StudioBackgroundEffects
                                effects={element.effects ?? []}
                                canvasWidth={element.width}
                                canvasHeight={element.height}
                              />
                            </div>
                          </div>
                        )}

                        {renderRotationHandle(element)}

                        {selectedId === element.id && !element.locked && (
                          <button
                            type="button"
                            aria-label={`Resize ${element.type}`}
                            title="Drag to resize"
                            onClick={(event) => event.stopPropagation()}
                            onPointerDown={(event) => handleResizeStart(event, element)}
                            onPointerMove={(event) => {
                              if (event.buttons === 0 && event.pointerType === "mouse") {
                                return;
                              }

                              handleResizeMove(event);
                            }}
                            onPointerUp={handleResizeEnd}
                            onPointerCancel={handleResizeEnd}
                            onLostPointerCapture={(event) => {
                              if (resizeSession.current?.pointerId === event.pointerId) {
                                finishCanvasInteractionHistory();
                                resizeSession.current = null;
                              }
                            }}
                            className="absolute -right-1.5 -bottom-1.5 z-10 size-3 cursor-nwse-resize rounded-sm border-2 border-white bg-[#C42B70] shadow-sm"
                            style={{ touchAction: "none" }}
                          />
                        )}
                      </div>
                    );
                  }

                  return (
                    <div
                      key={element.id}
                      data-studio-text-id={element.id}
                      onDoubleClick={(event) => {
                        event.stopPropagation();
                        startTextEditing(element);
                      }}

                      onClick={(event) => {
                        event.stopPropagation();

                        if (activeTool === "select") {
                          if (selectedId !== element.id) {
                            setNumericDrafts({});
                          }

                          setSelectedId(element.id);
                        }
                      }}

                      style={{
                        ...commonStyle,
                        height: element.height * scale,
                        overflow: "visible",
                        color: brandColor(element.color),
                        fontFamily: studioFonts[element.fontFamily].family,
                        fontSize: element.fontSize * scale,
                        fontWeight: element.fontWeight,
                        fontStyle: element.italic ? "italic" : "normal",
                        lineHeight: element.lineHeight,
                        letterSpacing: `${element.letterSpacing * scale}px`,
                        textAlign: element.textAlign,
                        whiteSpace: "pre-wrap",
                        overflowWrap: "break-word",
                      }}
                      onPointerDown={(event) => handleDragStart(event, element)}
                      onPointerMove={handleDragMove}
                      onPointerUp={handleDragEnd}
                      onPointerCancel={handleDragEnd}
                    >
                      {editingTextId === element.id ? (
                        <textarea
                          ref={inlineEditorRef}
                          value={editingDraft}
                          onChange={(event) => setEditingDraft(event.target.value)}
                          onPointerDown={(event) => event.stopPropagation()}
                          onClick={(event) => event.stopPropagation()}
                          onDoubleClick={(event) => event.stopPropagation()}
                          onBlur={() => finishTextEditing(true)}
                          onKeyDown={(event) => {
                            if (event.key === "Escape") {
                              event.preventDefault();
                              finishTextEditing(false);
                            }
                          }}
                          spellCheck={false}
                          className="block h-full w-full resize-none border-0 bg-transparent p-0 outline-none"
                          style={{
                            color: "inherit",
                            font: "inherit",
                            fontStyle: "inherit",
                            fontWeight: "inherit",
                            lineHeight: "inherit",
                            letterSpacing: "inherit",
                            textAlign: "inherit",
                            overflowWrap: "break-word",
                            whiteSpace: "pre-wrap",
                            touchAction: "auto",
                            userSelect: "text",
                          }}
                        />
                      ) : (
                        <div className="pointer-events-none h-full w-full overflow-hidden">
                          <StudioTextContent
                            content={element.content}
                            onOverflowChange={(overflowing) => {
                              setOverflowingTextIds((previous) => {
                                const exists = previous.includes(element.id);

                                if (exists === overflowing) return previous;

                                return overflowing
                                  ? [...previous, element.id]
                                  : previous.filter((id) => id !== element.id);
                              });
                            }}
                          />
                        </div>
                      )}

                      {selectedId === element.id &&
                        editingTextId !== element.id &&
                        overflowingTextIds.includes(element.id) && (
                          <div
                            title="Text is overflowing. Resize the box or reduce the font size."
                            aria-label="Text overflow warning"
                            className="pointer-events-none absolute top-2 right-2 z-20 flex size-5 items-center justify-center rounded-full bg-amber-500 text-white shadow-sm"
                          >
                            <AlertTriangle size={12} strokeWidth={2.2} />
                          </div>
                        )}

                      {renderRotationHandle(element)}

                      {selectedId === element.id && !element.locked && (
                        <button
                          type="button"
                          aria-label={`Resize ${element.type}`}
                          title="Drag to resize"
                          onClick={(event) => event.stopPropagation()}
                          onPointerDown={(event) => handleResizeStart(event, element)}
                          onPointerMove={(event) => {
                            if (event.buttons === 0 && event.pointerType === "mouse") {
                              return;
                            }

                            handleResizeMove(event);
                          }}
                          onPointerUp={handleResizeEnd}
                          onPointerCancel={handleResizeEnd}
                          onLostPointerCapture={(event) => {
                            if (resizeSession.current?.pointerId === event.pointerId) {
                              finishCanvasInteractionHistory();
                              resizeSession.current = null;
                            }
                          }}
                          className="absolute -right-1.5 -bottom-1.5 z-10 size-3 cursor-nwse-resize rounded-sm border-2 border-white bg-[#C42B70] shadow-sm"
                          style={{ touchAction: "none" }}
                        />
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        </section>

        {/* Properties */}
        <aside className="studio-panel min-h-0 p-4 lg:h-150 lg:overflow-y-auto">
          <h2 className="mb-4 font-bold">Properties</h2>

          {selected ? (
            <div className="space-y-5">
              <p className="text-sm capitalize">Selected: {selected.type}</p>

              <div className="space-y-2">
                <span className="block text-sm font-medium">Layer Order</span>

                <div className="grid grid-cols-4 gap-2">
                  {[
                    {
                      direction: "front",
                      label: "Bring to Front",
                      Icon: BringToFront,
                    },
                    {
                      direction: "forward",
                      label: "Move Forward",
                      Icon: ArrowUp,
                    },
                    {
                      direction: "backward",
                      label: "Move Backward",
                      Icon: ArrowDown,
                    },
                    {
                      direction: "back",
                      label: "Send to Back",
                      Icon: SendToBack,
                    },
                  ].map(({ direction, label, Icon }) => (
                    <button
                      key={direction}
                      type="button"
                      onClick={() => moveLayer(selected.id, direction as LayerMove)}
                      disabled={selected.locked}
                      title={label}
                      aria-label={label}
                      className="studio-control studio-icon-button"
                    >
                      <Icon size={18} strokeWidth={1.8} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3 border-t border-pink-200/60 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Rotation</span>
                  <button
                    type="button"
                    disabled={selected.locked}
                    onClick={() => commitElementUpdate(selected.id, { rotation: 0 })}
                    className="text-xs text-[#C42B70] hover:underline disabled:opacity-40"
                  >
                    Reset
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={0}
                    max={360}
                    step={1}
                    value={selected.rotation}
                    disabled={selected.locked}
                    onChange={(event) =>
                      updateElement(selected.id, {
                        rotation: Number(event.target.value),
                      })
                    }
                    onPointerDown={startSliderHistory}
                    onPointerUp={finishSliderHistory}
                    onPointerCancel={cancelSliderHistory}
                    onBlur={finishSliderHistory}
                    className="min-w-0 flex-1 accent-pink-500"
                    aria-label="Element rotation"
                  />

                  <input
                    type="number"
                    min={-360}
                    max={360}
                    step={1}
                    value={numericDrafts[`${selected.id}-rotation`] ?? selected.rotation}
                    disabled={selected.locked}
                    onChange={(event) =>
                      setNumericDrafts((previous) => ({
                        ...previous,
                        [`${selected.id}-rotation`]: event.target.value,
                      }))
                    }
                    onBlur={() => {
                      const key = `${selected.id}-rotation`;
                      const draft = numericDrafts[key];

                      if (draft !== undefined && draft.trim() !== "") {
                        const parsed = Number(draft);

                        if (Number.isFinite(parsed)) {
                          commitElementUpdate(selected.id, {
                            rotation: normalizeRotation(parsed),
                          });
                        }
                      }

                      setNumericDrafts((previous) => {
                        const next = { ...previous };
                        delete next[key];
                        return next;
                      });
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") event.currentTarget.blur();
                    }}
                    className="studio-field w-20 text-sm"
                    aria-label="Rotation degrees"
                  />
                  <span className="text-sm">°</span>
                </div>

                <p className="text-foreground/60 text-xs">
                  Drag the rotation handle or enter an exact angle. Hold Shift while dragging to
                  snap to 15°.
                </p>
              </div>

              {selected.type === "text" && (
                <>
                  {overflowingTextIds.includes(selected.id) && (
                    <p
                      role="status"
                      className="rounded-lg border border-amber-300/60 bg-amber-50 px-3 py-2 text-xs text-amber-900"
                    >
                      Some text is hidden because it exceeds the text box. Increase the box size or
                      reduce the font size.
                    </p>
                  )}

                  <label className="block space-y-1 text-sm">
                    <span className="font-medium">Font Family</span>

                    <select
                      value={selected.fontFamily}

                      onChange={(event) => {
                        const fontFamily = event.target.value as StudioFont;
                        const availableWeights = studioFonts[fontFamily].weights;

                        const fontWeight = availableWeights.includes(selected.fontWeight as never)
                          ? selected.fontWeight
                          : availableWeights.reduce((closest, weight) =>
                              Math.abs(weight - selected.fontWeight) <
                              Math.abs(closest - selected.fontWeight)
                                ? weight
                                : closest,
                            );

                        commitElementUpdate(selected.id, {
                          fontFamily,
                          fontWeight,
                        });
                      }}

                      disabled={selected.locked}
                      className="studio-field"
                    >
                      {Object.entries(studioFonts).map(([key, font]) => (
                        <option key={key} value={key}>
                          {font.category} · {font.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <div className="space-y-2">
                    <label htmlFor="studio-font-size" className="block text-sm font-medium">
                      Font Size
                    </label>

                    <div className="flex items-center gap-3">
                      <input
                        id="studio-font-size"
                        type="number"
                        min={8}
                        max={500}
                        step={1}
                        value={numericDrafts[`${selected.id}-fontSize`] ?? selected.fontSize}
                        disabled={selected.locked}
                        onChange={(event) => {
                          setNumericDrafts((previous) => ({
                            ...previous,
                            [`${selected.id}-fontSize`]: event.target.value,
                          }));
                        }}
                        onBlur={() =>
                          commitNumericDraft(
                            `${selected.id}-fontSize`,
                            selected.id,
                            "fontSize",
                            selected.fontSize,
                            8,
                            500,
                          )
                        }
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            event.currentTarget.blur();
                          }
                        }}
                        className="studio-field w-24 text-sm"
                      />

                      <input
                        type="range"
                        min={8}
                        max={500}
                        step={1}
                        value={selected.fontSize}
                        disabled={selected.locked}
                        onChange={(event) =>
                          updateElement(selected.id, {
                            fontSize: Number(event.target.value),
                          })
                        }
                        aria-label="Adjust font size"
                        className="min-w-0 flex-1 accent-pink-500"
                        onPointerDown={startSliderHistory}
                        onPointerUp={finishSliderHistory}
                        onPointerCancel={cancelSliderHistory}
                        onBlur={finishSliderHistory}
                        onKeyDown={(event) => {
                          if (
                            event.key.startsWith("Arrow") ||
                            event.key === "Home" ||
                            event.key === "End" ||
                            event.key === "PageUp" ||
                            event.key === "PageDown"
                          ) {
                            startSliderHistory();
                          }
                        }}
                        onKeyUp={(event) => {
                          if (
                            event.key.startsWith("Arrow") ||
                            event.key === "Home" ||
                            event.key === "End" ||
                            event.key === "PageUp" ||
                            event.key === "PageDown"
                          ) {
                            finishSliderHistory();
                          }
                        }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="block text-sm font-medium">Text Alignment</span>

                    <div className="grid grid-cols-4 gap-2">
                      {(
                        [
                          { value: "left", label: "Left", Icon: AlignLeft },
                          { value: "center", label: "Center", Icon: AlignCenter },
                          { value: "right", label: "Right", Icon: AlignRight },
                          {
                            value: "justify",
                            label: "Justify",
                            Icon: AlignJustify,
                          },
                        ] as const
                      ).map(({ value, label, Icon }) => (
                        <button
                          key={value}
                          type="button"
                          title={`Align ${label.toLowerCase()}`}
                          aria-label={`Align ${label.toLowerCase()}`}
                          aria-pressed={selected.textAlign === value}
                          disabled={selected.locked}
                          onClick={() =>
                            commitElementUpdate(selected.id, {
                              textAlign: value,
                            })
                          }
                          className={`flex cursor-pointer items-center justify-center transition-colors disabled:opacity-50 ${
                            selected.textAlign === value && "studio-control studio-icon-button"
                          }`}
                        >
                          <Icon size={18} strokeWidth={1.8} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <label className="block text-sm">
                    Font weight
                    <select
                      value={selected.fontWeight}
                      onChange={(e) =>
                        commitElementUpdate(selected.id, {
                          fontWeight: Number(e.target.value),
                        })
                      }
                      className="studio-field mt-2"
                      disabled={selected.locked}
                    >
                      {studioFonts[selected.fontFamily].weights.map((weight) => (
                        <option key={weight} value={weight}>
                          {
                            (
                              {
                                100: "Thin",
                                200: "Extra Light",
                                300: "Light",
                                400: "Regular",
                                500: "Medium",
                                600: "Semi Bold",
                                700: "Bold",
                                800: "Extra Bold",
                                900: "Black",
                              } as Record<number, string>
                            )[weight]
                          }{" "}
                          ({weight})
                        </option>
                      ))}
                    </select>
                  </label>

                  <div className="space-y-2">
                    <span className="block text-sm font-medium">Font Style</span>

                    <button
                      type="button"
                      onClick={() =>
                        commitElementUpdate(selected.id, {
                          italic: !selected.italic,
                        })
                      }
                      aria-label="Toggle italic"
                      aria-pressed={selected.italic}
                      title="Italic"
                      disabled={selected.locked}
                      className="studio-control studio-icon-button"
                    >
                      <Italic size={17} strokeWidth={1.8} />
                    </button>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="studio-line-height" className="block text-sm font-medium">
                      Line Height
                    </label>

                    <div className="flex items-center gap-3">
                      <input
                        id="studio-line-height"
                        type="range"
                        min="0.8"
                        max="2.5"
                        step="0.05"
                        value={selected.lineHeight}
                        onChange={(event) =>
                          updateElement(selected.id, {
                            lineHeight: Number(event.target.value),
                          })
                        }
                        disabled={selected.locked}
                        className="min-w-0 flex-1 accent-pink-500"
                        onPointerDown={startSliderHistory}
                        onPointerUp={finishSliderHistory}
                        onPointerCancel={cancelSliderHistory}
                        onBlur={finishSliderHistory}
                        onKeyDown={(event) => {
                          if (
                            event.key.startsWith("Arrow") ||
                            event.key === "Home" ||
                            event.key === "End" ||
                            event.key === "PageUp" ||
                            event.key === "PageDown"
                          ) {
                            startSliderHistory();
                          }
                        }}
                        onKeyUp={(event) => {
                          if (
                            event.key.startsWith("Arrow") ||
                            event.key === "Home" ||
                            event.key === "End" ||
                            event.key === "PageUp" ||
                            event.key === "PageDown"
                          ) {
                            finishSliderHistory();
                          }
                        }}
                      />

                      <input
                        type="number"
                        min="0.8"
                        max="2.5"
                        step="0.05"
                        value={numericDrafts[`${selected.id}-lineHeight`] ?? selected.lineHeight}
                        onChange={(event) => {
                          const value = event.target.value;

                          setNumericDrafts((previous) => ({
                            ...previous,
                            [`${selected.id}-lineHeight`]: value,
                          }));
                        }}
                        onBlur={() =>
                          commitNumericDraft(
                            `${selected.id}-lineHeight`,
                            selected.id,
                            "lineHeight",
                            selected.lineHeight,
                            0.8,
                            2.5,
                          )
                        }
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            event.currentTarget.blur();
                          }
                        }}
                        disabled={selected.locked}
                        aria-label="Line height value"
                        className="studio-field w-20 text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="studio-letter-spacing" className="block text-sm font-medium">
                      Letter Spacing
                    </label>

                    <div className="flex items-center gap-3">
                      <input
                        id="studio-letter-spacing"
                        type="range"
                        min="-5"
                        max="20"
                        step="0.5"
                        value={selected.letterSpacing}
                        onChange={(event) =>
                          updateElement(selected.id, {
                            letterSpacing: Number(event.target.value),
                          })
                        }
                        disabled={selected.locked}
                        className="min-w-0 flex-1 accent-pink-500"
                        onPointerDown={startSliderHistory}
                        onPointerUp={finishSliderHistory}
                        onPointerCancel={cancelSliderHistory}
                        onBlur={finishSliderHistory}
                        onKeyDown={(event) => {
                          if (
                            event.key.startsWith("Arrow") ||
                            event.key === "Home" ||
                            event.key === "End" ||
                            event.key === "PageUp" ||
                            event.key === "PageDown"
                          ) {
                            startSliderHistory();
                          }
                        }}
                        onKeyUp={(event) => {
                          if (
                            event.key.startsWith("Arrow") ||
                            event.key === "Home" ||
                            event.key === "End" ||
                            event.key === "PageUp" ||
                            event.key === "PageDown"
                          ) {
                            finishSliderHistory();
                          }
                        }}
                      />

                      <input
                        type="number"
                        min="-5"
                        max="20"
                        step="0.5"
                        value={
                          numericDrafts[`${selected.id}-letterSpacing`] ?? selected.letterSpacing
                        }
                        onChange={(event) => {
                          setNumericDrafts((previous) => ({
                            ...previous,
                            [`${selected.id}-letterSpacing`]: event.target.value,
                          }));
                        }}
                        onBlur={() =>
                          commitNumericDraft(
                            `${selected.id}-letterSpacing`,
                            selected.id,
                            "letterSpacing",
                            selected.letterSpacing,
                            -5,
                            20,
                          )
                        }
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            event.currentTarget.blur();
                          }
                        }}
                        disabled={selected.locked}
                        aria-label="Letter spacing value"
                        className="studio-field w-20 text-sm"
                      />
                    </div>

                    <p className="text-foreground/60 text-xs">Spacing in canvas pixels.</p>
                  </div>
                </>
              )}

              {selected.type === "shape" && (
                <div className="space-y-4 border-t border-pink-200/60 pt-4">
                  <h3 className="text-sm font-semibold">Shape Appearance</h3>

                  <label className="block space-y-2 text-sm">
                    <span className="font-medium">Shape Type</span>
                    <select
                      value={selected.shape}
                      disabled={selected.locked}
                      onChange={(event) =>
                        commitElementUpdate(selected.id, {
                          shape: event.target.value as StudioShapeType,
                        })
                      }
                      className="studio-field w-full"
                    >
                      <option value="rectangle">Rectangle</option>
                      <option value="rounded-rectangle">Rounded Rectangle</option>
                      <option value="ellipse">Ellipse / Circle</option>
                      <option value="triangle">Triangle</option>
                      <option value="diamond">Diamond</option>
                      <option value="line">Line</option>
                    </select>
                  </label>

                  {selected.shape !== "line" && (
                    <>
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={selected.fillEnabled}
                          disabled={selected.locked}
                          onChange={(event) =>
                            commitElementUpdate(selected.id, {
                              fillEnabled: event.target.checked,
                            })
                          }
                        />
                        Enable Fill
                      </label>

                      {selected.fillEnabled && (
                        <BrandColorPicker
                          label="Shape Fill"
                          value={selected.fill}
                          onChange={(color) => commitElementUpdate(selected.id, { fill: color })}
                        />
                      )}
                    </>
                  )}

                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={selected.shape === "line" || selected.strokeEnabled}
                      disabled={selected.locked || selected.shape === "line"}
                      onChange={(event) =>
                        commitElementUpdate(selected.id, {
                          strokeEnabled: event.target.checked,
                        })
                      }
                    />
                    Enable Stroke
                  </label>

                  {(selected.strokeEnabled || selected.shape === "line") && (
                    <>
                      <BrandColorPicker
                        label="Shape Stroke"
                        value={selected.stroke}
                        onChange={(color) => commitElementUpdate(selected.id, { stroke: color })}
                      />

                      <label className="block space-y-2 text-sm">
                        <span>Stroke Width: {selected.strokeWidth}px</span>
                        <input
                          type="range"
                          min={1}
                          max={40}
                          value={selected.strokeWidth}
                          disabled={selected.locked}
                          onChange={(event) =>
                            updateElement(selected.id, {
                              strokeWidth: Number(event.target.value),
                            })
                          }
                          onPointerDown={startSliderHistory}
                          onPointerUp={finishSliderHistory}
                          onPointerCancel={cancelSliderHistory}
                          onBlur={finishSliderHistory}
                          className="w-full accent-pink-500"
                        />
                      </label>
                    </>
                  )}

                  {selected.shape === "rounded-rectangle" && (
                    <label className="block space-y-2 text-sm">
                      <span>Corner Radius: {selected.cornerRadius}px</span>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={selected.cornerRadius}
                        disabled={selected.locked}
                        onChange={(event) =>
                          updateElement(selected.id, {
                            cornerRadius: Number(event.target.value),
                          })
                        }
                        onPointerDown={startSliderHistory}
                        onPointerUp={finishSliderHistory}
                        onPointerCancel={cancelSliderHistory}
                        onBlur={finishSliderHistory}
                        className="w-full accent-pink-500"
                      />
                    </label>
                  )}
                </div>
              )}

              {selected.type === "card" && (
                <label className="block text-sm">
                  Corner radius: {selected.radius}px
                  <input
                    type="range"
                    min="0"
                    max="60"
                    value={selected.radius}
                    onChange={(e) =>
                      updateElement(selected.id, {
                        radius: Number(e.target.value),
                      })
                    }
                    className="mt-2 w-full accent-pink-500"
                    disabled={selected.locked}
                    onPointerDown={startSliderHistory}
                    onPointerUp={finishSliderHistory}
                    onPointerCancel={cancelSliderHistory}
                    onBlur={finishSliderHistory}
                    onKeyDown={(event) => {
                      if (
                        event.key.startsWith("Arrow") ||
                        event.key === "Home" ||
                        event.key === "End" ||
                        event.key === "PageUp" ||
                        event.key === "PageDown"
                      ) {
                        startSliderHistory();
                      }
                    }}
                    onKeyUp={(event) => {
                      if (
                        event.key.startsWith("Arrow") ||
                        event.key === "Home" ||
                        event.key === "End" ||
                        event.key === "PageUp" ||
                        event.key === "PageDown"
                      ) {
                        finishSliderHistory();
                      }
                    }}
                  />
                </label>
              )}

              <label className="block text-sm">
                Width: {selected.width}px
                <input
                  type="number"
                  min={80}
                  max={canvasSize.width - selected.x}
                  value={numericDrafts[`${selected.id}-width`] ?? selected.width}
                  disabled={selected.locked}
                  onChange={(event) => {
                    setNumericDrafts((previous) => ({
                      ...previous,
                      [`${selected.id}-width`]: event.target.value,
                    }));
                  }}
                  onBlur={() =>
                    commitNumericDraft(
                      `${selected.id}-width`,
                      selected.id,
                      "width",
                      selected.width,
                      80,
                      Math.max(80, canvasSize.width - selected.x),
                    )
                  }
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.currentTarget.blur();
                    }
                  }}
                  className="studio-field"
                />
              </label>

              <label className="block text-sm">
                Height: {selected.height}px
                <input
                  type="number"
                  min={selected.type === "card" ? 60 : 40}
                  max={canvasSize.height - selected.y}
                  value={numericDrafts[`${selected.id}-height`] ?? selected.height}
                  disabled={selected.locked}
                  onChange={(event) => {
                    setNumericDrafts((previous) => ({
                      ...previous,
                      [`${selected.id}-height`]: event.target.value,
                    }));
                  }}
                  onBlur={() =>
                    commitNumericDraft(
                      `${selected.id}-height`,
                      selected.id,
                      "height",
                      selected.height,
                      selected.type === "card" ? 60 : 40,
                      Math.max(selected.type === "card" ? 60 : 40, canvasSize.height - selected.y),
                    )
                  }
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.currentTarget.blur();
                    }
                  }}
                  className="studio-field"
                />
              </label>

              {(["x", "y", "rotation", "opacity"] as const).map((property) => {
                const ranges = {
                  x: [0, canvasSize.width],
                  y: [0, canvasSize.height],
                  rotation: [-180, 180],
                  opacity: [0, 100],
                };

                return (
                  <label key={property} className="block text-sm">
                    <span className="capitalize">
                      {property}: {selected[property]}
                    </span>
                    <input
                      type="range"
                      min={ranges[property][0]}
                      max={ranges[property][1]}
                      value={selected[property]}
                      disabled={selected.locked}
                      onChange={(e) =>
                        updateElement(selected.id, {
                          [property]: Number(e.target.value),
                        })
                      }
                      className="mt-2 w-full accent-pink-500"
                      onPointerDown={startSliderHistory}
                      onPointerUp={finishSliderHistory}
                      onPointerCancel={cancelSliderHistory}
                      onBlur={finishSliderHistory}
                      onKeyDown={(event) => {
                        if (
                          event.key.startsWith("Arrow") ||
                          event.key === "Home" ||
                          event.key === "End" ||
                          event.key === "PageUp" ||
                          event.key === "PageDown"
                        ) {
                          startSliderHistory();
                        }
                      }}
                      onKeyUp={(event) => {
                        if (
                          event.key.startsWith("Arrow") ||
                          event.key === "Home" ||
                          event.key === "End" ||
                          event.key === "PageUp" ||
                          event.key === "PageDown"
                        ) {
                          finishSliderHistory();
                        }
                      }}
                    />
                  </label>
                );
              })}

              {selected.type === "card" && (
                <div className="space-y-3">
                  <label className="block text-sm font-semibold">Card Fill</label>

                  <select
                    value={selected.fillType ?? "solid"}
                    disabled={selected.locked}
                    onChange={(event) => {
                      const fillType = event.target.value as "solid" | "gradient";

                      commitElementUpdate(selected.id, {
                        fillType,
                        ...(fillType === "gradient" && !selected.gradient
                          ? {
                              gradient: structuredClone(studioGradientPresets[0].gradient),
                            }
                          : {}),
                      });
                    }}
                    className="studio-field w-full"
                  >
                    <option value="solid">Solid Color</option>
                    <option value="gradient">Gradient</option>
                  </select>

                  {(selected.fillType ?? "solid") === "solid" ? (
                    <BrandColorPicker
                      label="Card Color"
                      value={selected.color}
                      disabled={selected.locked}
                      onChange={(color) => {
                        if (selected.locked) return;
                        commitElementUpdate(selected.id, { color });
                      }}
                    />
                  ) : (
                    <div className="space-y-4">
                      <StudioGradientPresets
                        disabled={selected.locked}
                        selectedGradient={selected.gradient}
                        onSelect={(gradient) =>
                          commitElementUpdate(selected.id, {
                            gradient,
                            fillType: "gradient",
                          })
                        }
                      />

                      {selected.gradient && (
                        <StudioGradientEditor
                          gradient={selected.gradient}
                          disabled={selected.locked}
                          onChange={(gradient) => commitElementUpdate(selected.id, { gradient })}
                        />
                      )}
                    </div>
                  )}
                </div>
              )}

              {selected.type === "card" && (
                <div className="space-y-3 border-t border-pink-200/60 pt-4">
                  <h3 className="text-sm font-semibold">Card Effects</h3>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={selected.locked}
                      onClick={() => addCardEffect(selected.id, "grid")}
                      className="studio-control studio-button text-xs"
                    >
                      + Grid
                    </button>
                    <button
                      type="button"
                      disabled={selected.locked}
                      onClick={() => addCardEffect(selected.id, "pattern")}
                      className="studio-control studio-button text-xs"
                    >
                      + Pattern
                    </button>
                  </div>
                  {(selected.effects ?? []).map((effect, index, effects) => (
                    <div
                      key={effect.id}
                      className="space-y-3 rounded-xl border border-pink-200/60 bg-white/60 p-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold">
                          {effect.type === "grid" ? "Grid" : "Pattern"} {index + 1}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            aria-label="Move effect down"
                            title="Move effect down"
                            disabled={selected.locked || index === 0}
                            onClick={() => moveCardEffect(selected.id, effect.id, -1)}
                            className="studio-control rounded p-1 disabled:opacity-30"
                          >
                            <ArrowDown size={14} />
                          </button>
                          <button
                            type="button"
                            aria-label="Move effect up"
                            title="Move effect up"
                            disabled={selected.locked || index === effects.length - 1}
                            onClick={() => moveCardEffect(selected.id, effect.id, 1)}
                            className="studio-control rounded p-1 disabled:opacity-30"
                          >
                            <ArrowUp size={14} />
                          </button>
                          <label className="flex items-center gap-1 text-xs">
                            <input
                              type="checkbox"
                              checked={effect.enabled}
                              disabled={selected.locked}
                              onChange={(event) =>
                                updateCardEffect(selected.id, effect.id, {
                                  enabled: event.target.checked,
                                })
                              }
                              className="accent-[#ED3F98]"
                            />
                            On
                          </label>
                        </div>
                      </div>
                      {effect.grid && (
                        <label className="block space-y-1 text-xs">
                          Style
                          <select
                            disabled={selected.locked}
                            value={effect.grid.style}
                            onChange={(event) =>
                              updateCardEffect(selected.id, effect.id, {
                                grid: {
                                  ...effect.grid!,
                                  style: event.target.value as "lines" | "dots",
                                },
                              })
                            }
                            className="studio-field w-full"
                          >
                            <option value="lines">Lines</option>
                            <option value="dots">Dots</option>
                          </select>
                        </label>
                      )}
                      {effect.pattern && (
                        <label className="block space-y-1 text-xs">
                          Style
                          <select
                            disabled={selected.locked}
                            value={effect.pattern.style}
                            onChange={(event) =>
                              updateCardEffect(selected.id, effect.id, {
                                pattern: {
                                  ...effect.pattern!,
                                  style: event.target.value as
                                    "waves" | "diagonal-lines" | "crosses" | "diamonds",
                                },
                              })
                            }
                            className="studio-field w-full"
                          >
                            <option value="waves">Waves</option>
                            <option value="diagonal-lines">Diagonal Lines</option>
                            <option value="crosses">Crosses</option>
                            <option value="diamonds">Diamonds</option>
                          </select>
                        </label>
                      )}
                      <BrandColorPicker
                        label="Effect Color"
                        value={effect.color as BrandColorToken}
                        disabled={selected.locked}
                        onChange={(color) => updateCardEffect(selected.id, effect.id, { color })}
                      />
                      {(["spacing", "lineWidth"] as const).map((field) => {
                        const settings = effect.grid ?? effect.pattern;
                        if (!settings) return null;
                        return (
                          <label key={field} className="block space-y-1 text-xs">
                            <span className="flex justify-between">
                              <span>
                                {field === "spacing"
                                  ? "Spacing"
                                  : effect.grid?.style === "dots"
                                    ? "Dot Size"
                                    : "Line Weight"}
                              </span>
                              <span>{settings[field]}px</span>
                            </span>
                            <input
                              type="range"
                              min={field === "spacing" ? 8 : 0.5}
                              max={field === "spacing" ? 120 : 8}
                              step={field === "spacing" ? 2 : 0.5}
                              value={settings[field]}
                              disabled={selected.locked}
                              onChange={(event) => {
                                const value = Number(event.target.value);
                                updateCardEffect(
                                  selected.id,
                                  effect.id,
                                  effect.grid
                                    ? { grid: { ...effect.grid, [field]: value } }
                                    : { pattern: { ...effect.pattern!, [field]: value } },
                                );
                              }}
                              className="w-full accent-[#ED3F98]"
                            />
                          </label>
                        );
                      })}
                      {effect.pattern && (
                        <label className="block space-y-1 text-xs">
                          <span className="flex justify-between">
                            <span>Rotation</span>
                            <span>{effect.pattern.rotation}°</span>
                          </span>
                          <input
                            type="range"
                            min={0}
                            max={360}
                            value={effect.pattern.rotation}
                            disabled={selected.locked}
                            onChange={(event) =>
                              updateCardEffect(selected.id, effect.id, {
                                pattern: {
                                  ...effect.pattern!,
                                  rotation: Number(event.target.value),
                                },
                              })
                            }
                            className="w-full accent-[#ED3F98]"
                          />
                        </label>
                      )}
                      <label className="block space-y-1 text-xs">
                        <span className="flex justify-between">
                          <span>Opacity</span>
                          <span>{effect.opacity}%</span>
                        </span>
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={effect.opacity}
                          disabled={selected.locked}
                          onChange={(event) =>
                            updateCardEffect(selected.id, effect.id, {
                              opacity: Number(event.target.value),
                            })
                          }
                          className="w-full accent-[#ED3F98]"
                        />
                      </label>
                      <button
                        type="button"
                        disabled={selected.locked}
                        onClick={() => removeCardEffect(selected.id, effect.id)}
                        className="flex w-full items-center justify-center gap-2 rounded-lg border border-rose-200 px-3 py-2 text-xs text-rose-600 disabled:opacity-40"
                      >
                        <Trash2 size={13} />
                        Remove Effect
                      </button>
                    </div>
                  ))}
                  <p className="text-xs text-slate-500">
                    Effects at the bottom of this list render on top. Data Nodes remain
                    background-only.
                  </p>
                </div>
              )}

              {selected.type === "text" && (
                <BrandColorPicker
                  label="Text Color"
                  value={selected.color}
                  disabled={selected.locked}
                  onChange={(color) => {
                    if (selected.locked) return;
                    commitElementUpdate(selected.id, { color });
                  }}
                />
              )}

              <button
                type="button"
                onClick={deleteSelected}
                disabled={selected.locked}
                title={
                  selected.locked
                    ? "Unlock this layer before deleting it"
                    : "Delete selected element"
                }
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-400 p-3 text-sm disabled:cursor-not-allowed disabled:opacity-40"
              >
                {selected.locked ? "Layer Locked" : "Delete Element"}
                <Trash2 size={16} strokeWidth={1.8} />
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              <BrandColorPicker
                label="Background color"
                value={backgroundColor}
                onChange={updateBackgroundColor}
              />

              {(activeSlide?.backgroundEffects.length ?? 0) > 0 && (
                <div className="space-y-2 rounded-xl border border-pink-200/60 bg-white/60 p-3">
                  <h3 className="text-sm font-semibold">Background Effect Order</h3>
                  <p className="text-xs text-slate-500">Bottom of list renders on top.</p>
                  {(activeSlide?.backgroundEffects ?? []).map((effect, index, effects) => (
                    <div
                      key={effect.id}
                      className="flex items-center justify-between gap-2 rounded-lg border border-pink-100 px-2 py-1.5"
                    >
                      <span className="truncate text-xs capitalize">
                        {effect.type.replaceAll("-", " ")} {index + 1}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          aria-label="Move background effect down"
                          title="Move down"
                          disabled={index === 0}
                          onClick={() => moveBackgroundEffect(effect.id, -1)}
                          className="studio-control rounded p-1 disabled:opacity-30"
                        >
                          <ArrowDown size={14} />
                        </button>
                        <button
                          type="button"
                          aria-label="Move background effect up"
                          title="Move up"
                          disabled={index === effects.length - 1}
                          onClick={() => moveBackgroundEffect(effect.id, 1)}
                          className="studio-control rounded p-1 disabled:opacity-30"
                        >
                          <ArrowUp size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <StudioGradientPresets onSelect={addGradientPreset} />

              <div className="mt-5 space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm font-semibold">Gradient Effects</h3>

                  <button
                    type="button"
                    onClick={addGradientEffect}
                    className="studio-control studio-button text-xs"
                  >
                    + Add Gradient
                  </button>
                </div>

                <div className="mt-5 space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-sm font-semibold">Data Nodes</h3>

                    <button
                      type="button"
                      onClick={addParticleEffect}
                      className="studio-control studio-button text-xs"
                    >
                      + Add Data Nodes
                    </button>
                  </div>

                  {(activeSlide?.backgroundEffects ?? [])
                    .filter((effect) => effect.type === "particles")
                    .map((effect, index) => (
                      <div
                        key={effect.id}
                        className="space-y-3 rounded-xl border border-pink-200/60 bg-white/60 p-3"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-semibold">Data Nodes {index + 1}</span>

                          <label className="flex cursor-pointer items-center gap-2 text-xs">
                            <input
                              type="checkbox"
                              checked={effect.enabled}
                              onChange={(event) =>
                                updateBackgroundEffect(effect.id, {
                                  enabled: event.target.checked,
                                })
                              }
                              className="cursor-pointer accent-[#ED3F98]"
                            />
                            Enabled
                          </label>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <label htmlFor={`particle-count-${effect.id}`}>Node Count</label>
                            <span className="tabular-nums">{effect.particles?.count ?? 60}</span>
                          </div>

                          <input
                            id={`particle-count-${effect.id}`}
                            type="range"
                            min={10}
                            max={300}
                            step={5}
                            value={effect.particles?.count ?? 60}
                            disabled={!effect.particles}
                            onChange={(event) => {
                              if (!effect.particles) return;

                              updateBackgroundEffect(effect.id, {
                                particles: {
                                  ...effect.particles,
                                  count: Number(event.target.value),
                                },
                              });
                            }}
                            className="w-full cursor-pointer accent-[#ED3F98] disabled:cursor-not-allowed disabled:opacity-40"
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <label htmlFor={`particle-size-${effect.id}`}>Node Size</label>
                            <span className="tabular-nums">{effect.particles?.size ?? 2}px</span>
                          </div>

                          <input
                            id={`particle-size-${effect.id}`}
                            type="range"
                            min={1}
                            max={12}
                            step={0.5}
                            value={effect.particles?.size ?? 2}
                            disabled={!effect.particles}
                            onChange={(event) => {
                              if (!effect.particles) return;

                              updateBackgroundEffect(effect.id, {
                                particles: {
                                  ...effect.particles,
                                  size: Number(event.target.value),
                                },
                              });
                            }}
                            className="w-full cursor-pointer accent-[#ED3F98] disabled:cursor-not-allowed disabled:opacity-40"
                          />
                        </div>

                        <BrandColorPicker
                          label="Node Color"
                          value={effect.color}
                          onChange={(color) =>
                            updateBackgroundEffect(effect.id, {
                              color,
                            })
                          }
                        />

                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <label htmlFor={`particle-opacity-${effect.id}`}>Node Opacity</label>

                            <span className="tabular-nums">{effect.opacity}%</span>
                          </div>

                          <input
                            id={`particle-opacity-${effect.id}`}
                            type="range"
                            min={0}
                            max={100}
                            step={5}
                            value={effect.opacity}
                            onChange={(event) =>
                              updateBackgroundEffect(effect.id, {
                                opacity: Number(event.target.value),
                              })
                            }
                            className="w-full cursor-pointer accent-[#ED3F98]"
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <label htmlFor={`particle-connection-opacity-${effect.id}`}>
                              Connection Opacity
                            </label>

                            <span className="tabular-nums">
                              {effect.particles?.connectionOpacity ?? 12}%
                            </span>
                          </div>

                          <input
                            id={`particle-connection-opacity-${effect.id}`}
                            type="range"
                            min={0}
                            max={100}
                            step={1}
                            value={effect.particles?.connectionOpacity ?? 12}
                            disabled={!effect.particles}
                            onChange={(event) => {
                              if (!effect.particles) return;

                              updateBackgroundEffect(effect.id, {
                                particles: {
                                  ...effect.particles,
                                  connectionOpacity: Number(event.target.value),
                                },
                              });
                            }}
                            className="w-full cursor-pointer accent-[#ED3F98] disabled:cursor-not-allowed disabled:opacity-40"
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <label htmlFor={`particle-connection-distance-${effect.id}`}>
                              Connection Distance
                            </label>

                            <span className="tabular-nums">
                              {effect.particles?.connectionDistance ?? 12}
                            </span>
                          </div>

                          <input
                            id={`particle-connection-distance-${effect.id}`}
                            type="range"
                            min={0}
                            max={30}
                            step={1}
                            value={effect.particles?.connectionDistance ?? 12}
                            disabled={!effect.particles}
                            onChange={(event) => {
                              if (!effect.particles) return;

                              updateBackgroundEffect(effect.id, {
                                particles: {
                                  ...effect.particles,
                                  connectionDistance: Number(event.target.value),
                                },
                              });
                            }}
                            className="w-full cursor-pointer accent-[#ED3F98] disabled:cursor-not-allowed disabled:opacity-40"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => randomizeParticlePositions(effect.id)}
                            className="studio-control studio-button text-xs"
                          >
                            Randomize Positions
                          </button>

                          <button
                            type="button"
                            onClick={() => resetParticlePositions(effect.id)}
                            disabled={effect.seed === 1}
                            className="studio-control text-xs disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            Reset Positions
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeBackgroundEffect(effect.id)}
                          className="flex w-full items-center justify-center gap-2 rounded-lg border border-rose-200 px-3 py-2 text-xs text-rose-600 transition-colors hover:bg-rose-50"
                        >
                          <Trash2 size={13} />
                          Remove Data Nodes
                        </button>
                      </div>
                    ))}
                </div>

                <div className="mt-5 space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-sm font-semibold">Grid Effects</h3>

                    <button
                      type="button"
                      onClick={addGridEffect}
                      className="studio-control studio-button text-xs"
                    >
                      + Add Grid
                    </button>
                  </div>

                  {(activeSlide?.backgroundEffects ?? [])
                    .filter((effect) => effect.type === "grid")
                    .map((effect, index) => (
                      <div
                        key={effect.id}
                        className="space-y-3 rounded-xl border border-pink-200/60 bg-white/60 p-3"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-semibold">Grid {index + 1}</span>

                          <label className="flex cursor-pointer items-center gap-2 text-xs">
                            <input
                              type="checkbox"
                              checked={effect.enabled}
                              onChange={(event) =>
                                updateBackgroundEffect(effect.id, {
                                  enabled: event.target.checked,
                                })
                              }
                              className="cursor-pointer accent-[#ED3F98]"
                            />
                            Enabled
                          </label>
                        </div>

                        <div className="space-y-2">
                          <label
                            htmlFor={`grid-style-${effect.id}`}
                            className="text-xs font-medium"
                          >
                            Grid Style
                          </label>

                          <select
                            id={`grid-style-${effect.id}`}
                            value={effect.grid?.style ?? "lines"}
                            disabled={!effect.grid}
                            onChange={(event) => {
                              if (!effect.grid) return;

                              updateBackgroundEffect(effect.id, {
                                grid: {
                                  ...effect.grid,
                                  style: event.target.value as "lines" | "dots",
                                },
                              });
                            }}
                            className="studio-control w-full cursor-pointer rounded-lg border border-pink-200/60 bg-white px-3 py-2 text-xs disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <option value="lines">Line Grid</option>
                            <option value="dots">Dot Grid</option>
                          </select>
                        </div>

                        {effect.grid && (
                          <div className="space-y-4">
                            {/* Grid Spacing */}
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-xs">
                                <label htmlFor={`grid-spacing-${effect.id}`}>Spacing</label>
                                <span className="tabular-nums">{effect.grid.spacing}px</span>
                              </div>

                              <input
                                id={`grid-spacing-${effect.id}`}
                                type="range"
                                min={8}
                                max={120}
                                step={2}
                                value={effect.grid.spacing}
                                onChange={(event) =>
                                  updateBackgroundEffect(effect.id, {
                                    grid: {
                                      ...effect.grid!,
                                      spacing: Number(event.target.value),
                                    },
                                  })
                                }
                                className="w-full cursor-pointer accent-[#ED3F98]"
                              />
                            </div>

                            {/* Grid Opacity */}
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-xs">
                                <label htmlFor={`grid-opacity-${effect.id}`}>Opacity</label>
                                <span className="tabular-nums">{effect.opacity}%</span>
                              </div>

                              <input
                                id={`grid-opacity-${effect.id}`}
                                type="range"
                                min={0}
                                max={100}
                                step={1}
                                value={effect.opacity}
                                onChange={(event) =>
                                  updateBackgroundEffect(effect.id, {
                                    opacity: Number(event.target.value),
                                  })
                                }
                                className="w-full cursor-pointer accent-[#ED3F98]"
                              />
                            </div>

                            {/* Grid Color */}
                            <div className="space-y-2">
                              <label className="block text-xs font-medium">Grid Color</label>

                              <BrandColorPicker
                                label="Grid Color"
                                value={effect.color as BrandColorToken}
                                onChange={(color) =>
                                  updateBackgroundEffect(effect.id, {
                                    color,
                                  })
                                }
                              />
                            </div>

                            {/* Line Weight / Dot Size */}
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-xs">
                                <label htmlFor={`grid-weight-${effect.id}`}>
                                  {effect.grid.style === "dots" ? "Dot Size" : "Line Weight"}
                                </label>

                                <span className="tabular-nums">{effect.grid.lineWidth}px</span>
                              </div>

                              <input
                                id={`grid-weight-${effect.id}`}
                                type="range"
                                min={0.5}
                                max={8}
                                step={0.5}
                                value={effect.grid.lineWidth}
                                onChange={(event) =>
                                  updateBackgroundEffect(effect.id, {
                                    grid: {
                                      ...effect.grid!,
                                      lineWidth: Number(event.target.value),
                                    },
                                  })
                                }
                                className="w-full cursor-pointer accent-[#ED3F98]"
                              />
                            </div>
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={() => removeBackgroundEffect(effect.id)}
                          className="flex w-full items-center justify-center gap-2 rounded-lg border border-rose-200 px-3 py-2 text-xs text-rose-600 transition-colors hover:bg-rose-50"
                        >
                          <Trash2 size={13} />
                          Remove Grid
                        </button>
                      </div>
                    ))}
                </div>

                {/* Pattern Effects */}
                <div className="mt-5 space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-sm font-semibold">Pattern Effects</h3>

                    <button
                      type="button"
                      onClick={addPatternEffect}
                      className="studio-control studio-button text-xs"
                    >
                      + Add Pattern
                    </button>
                  </div>

                  {(activeSlide?.backgroundEffects ?? [])
                    .filter((effect) => effect.type === "pattern")
                    .map((effect, index) => (
                      <div
                        key={effect.id}
                        className="space-y-3 rounded-xl border border-pink-200/60 bg-white/60 p-3"
                      >
                        {/* Pattern Header */}
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-semibold">Pattern {index + 1}</span>

                          <label className="flex cursor-pointer items-center gap-2 text-xs">
                            <input
                              type="checkbox"
                              checked={effect.enabled}
                              onChange={(event) =>
                                updateBackgroundEffect(effect.id, {
                                  enabled: event.target.checked,
                                })
                              }
                              className="cursor-pointer accent-[#ED3F98]"
                            />
                            Enabled
                          </label>
                        </div>

                        {effect.pattern && (
                          <div className="space-y-4">
                            {/* Pattern Style */}
                            <div className="space-y-2">
                              <label
                                htmlFor={`pattern-style-${effect.id}`}
                                className="block text-xs font-medium"
                              >
                                Pattern Style
                              </label>

                              <select
                                id={`pattern-style-${effect.id}`}
                                value={effect.pattern.style}
                                onChange={(event) =>
                                  updateBackgroundEffect(effect.id, {
                                    pattern: {
                                      ...effect.pattern!,
                                      style: event.target.value as
                                        "waves" | "diagonal-lines" | "crosses" | "diamonds",
                                    },
                                  })
                                }
                                className="studio-control w-full cursor-pointer rounded-lg border border-pink-200/60 bg-white px-3 py-2 text-xs"
                              >
                                <option value="waves">Waves</option>
                                <option value="diagonal-lines">Diagonal Lines</option>
                                <option value="crosses">Crosses</option>
                                <option value="diamonds">Diamonds</option>
                              </select>
                            </div>

                            {/* Pattern Spacing */}
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-xs">
                                <label htmlFor={`pattern-spacing-${effect.id}`}>Spacing</label>
                                <span className="tabular-nums">{effect.pattern.spacing}px</span>
                              </div>

                              <input
                                id={`pattern-spacing-${effect.id}`}
                                type="range"
                                min={8}
                                max={120}
                                step={2}
                                value={effect.pattern.spacing}
                                onChange={(event) =>
                                  updateBackgroundEffect(effect.id, {
                                    pattern: {
                                      ...effect.pattern!,
                                      spacing: Number(event.target.value),
                                    },
                                  })
                                }
                                className="w-full cursor-pointer accent-[#ED3F98]"
                              />
                            </div>

                            {/* Pattern Line Weight */}
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-xs">
                                <label htmlFor={`pattern-weight-${effect.id}`}>Line Weight</label>
                                <span className="tabular-nums">{effect.pattern.lineWidth}px</span>
                              </div>

                              <input
                                id={`pattern-weight-${effect.id}`}
                                type="range"
                                min={0.5}
                                max={8}
                                step={0.5}
                                value={effect.pattern.lineWidth}
                                onChange={(event) =>
                                  updateBackgroundEffect(effect.id, {
                                    pattern: {
                                      ...effect.pattern!,
                                      lineWidth: Number(event.target.value),
                                    },
                                  })
                                }
                                className="w-full cursor-pointer accent-[#ED3F98]"
                              />
                            </div>

                            {/* Pattern Rotation */}
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-xs">
                                <label htmlFor={`pattern-rotation-${effect.id}`}>Rotation</label>
                                <span className="tabular-nums">{effect.pattern.rotation}°</span>
                              </div>

                              <input
                                id={`pattern-rotation-${effect.id}`}
                                type="range"
                                min={0}
                                max={360}
                                step={1}
                                value={effect.pattern.rotation}
                                onChange={(event) =>
                                  updateBackgroundEffect(effect.id, {
                                    pattern: {
                                      ...effect.pattern!,
                                      rotation: Number(event.target.value),
                                    },
                                  })
                                }
                                className="w-full cursor-pointer accent-[#ED3F98]"
                              />
                            </div>

                            {/* Pattern Opacity */}
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-xs">
                                <label htmlFor={`pattern-opacity-${effect.id}`}>Opacity</label>
                                <span className="tabular-nums">{effect.opacity}%</span>
                              </div>

                              <input
                                id={`pattern-opacity-${effect.id}`}
                                type="range"
                                min={0}
                                max={100}
                                step={1}
                                value={effect.opacity}
                                onChange={(event) =>
                                  updateBackgroundEffect(effect.id, {
                                    opacity: Number(event.target.value),
                                  })
                                }
                                className="w-full cursor-pointer accent-[#ED3F98]"
                              />
                            </div>

                            {/* Pattern Color */}
                            <BrandColorPicker
                              label="Pattern Color"
                              value={effect.color as BrandColorToken}
                              onChange={(color) =>
                                updateBackgroundEffect(effect.id, {
                                  color,
                                })
                              }
                            />
                          </div>
                        )}

                        {/* Remove Pattern */}
                        <button
                          type="button"
                          onClick={() => removeBackgroundEffect(effect.id)}
                          className="flex w-full items-center justify-center gap-2 rounded-lg border border-rose-200 px-3 py-2 text-xs text-rose-600 transition-colors hover:bg-rose-50"
                        >
                          <Trash2 size={13} />
                          Remove Pattern
                        </button>
                      </div>
                    ))}
                </div>

                {activeSlide?.backgroundEffects
                  .filter((effect) => effect.type === "gradient")
                  .map((effect) => (
                    <div
                      key={effect.id}
                      className="space-y-3 rounded-xl border p-3"
                      style={{ borderColor: brandColor("border") }}
                    >
                      <label className="flex items-center justify-between text-sm">
                        <span>Enabled</span>
                        <input
                          type="checkbox"
                          checked={effect.enabled}
                          onChange={(event) =>
                            updateBackgroundEffect(effect.id, {
                              enabled: event.target.checked,
                            })
                          }
                          className="accent-pink-500"
                        />
                      </label>

                      <StudioGradientEditor
                        gradient={getBackgroundGradient(effect)}
                        onChange={(gradient) => updateBackgroundGradient(effect, gradient)}
                      />

                      <button
                        type="button"
                        onClick={() => removeBackgroundEffect(effect.id)}
                        className="flex w-full items-center justify-center gap-2 rounded-lg border border-rose-200 px-3 py-2 text-xs text-rose-600 transition-colors hover:bg-rose-50"
                      >
                        <Trash2 size={13} />
                        Remove Gradient
                      </button>
                    </div>
                  ))}
              </div>

              {(activeSlide?.backgroundEffects ?? [])
                .filter((effect) => effect.type === "ambient-glow")
                .map((effect, index) => (
                  <div
                    key={effect.id}
                    className="mb-3 space-y-3 rounded-xl border border-pink-200/60 bg-white/60 p-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold">Ambient Glow {index + 1}</span>

                      <label className="flex items-center gap-2 text-xs">
                        <input
                          type="checkbox"
                          checked={effect.enabled}
                          onChange={(event) =>
                            updateBackgroundEffect(effect.id, {
                              enabled: event.target.checked,
                            })
                          }
                        />
                        Enabled
                      </label>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Opacity</span>
                        <span>{effect.opacity}%</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        step={1}
                        value={effect.opacity}
                        onChange={(event) =>
                          updateBackgroundEffect(effect.id, {
                            opacity: Number(event.target.value),
                          })
                        }
                        className="w-full accent-pink-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Intensity</span>
                        <span>{effect.intensity}%</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        step={1}
                        value={effect.intensity}
                        onChange={(event) =>
                          updateBackgroundEffect(effect.id, {
                            intensity: Number(event.target.value),
                          })
                        }
                        className="w-full accent-pink-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Scale</span>
                        <span>{effect.scale}%</span>
                      </div>
                      <input
                        type="range"
                        min={25}
                        max={200}
                        step={5}
                        value={effect.scale}
                        onChange={(event) =>
                          updateBackgroundEffect(effect.id, {
                            scale: Number(event.target.value),
                          })
                        }
                        className="w-full accent-pink-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => randomizeAmbientGlowPositions(effect.id)}
                        className="rounded-lg border border-pink-200 bg-pink-50 px-3 py-2 text-xs font-medium text-pink-700 transition-colors hover:bg-pink-100"
                      >
                        Randomize Positions
                      </button>

                      <button
                        type="button"
                        onClick={() => resetAmbientGlowPositions(effect.id)}
                        disabled={!effect.originalGlowSources}
                        className="rounded-lg border border-pink-200 px-3 py-2 text-xs font-medium transition-colors hover:bg-pink-50 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Reset Positions
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeBackgroundEffect(effect.id)}
                      className="flex w-full items-center justify-center gap-2 rounded-lg border border-rose-200 px-3 py-2 text-xs text-rose-600 transition-colors hover:bg-rose-50"
                    >
                      <Trash2 size={13} />
                      Remove Ambient Glow
                    </button>
                  </div>
                ))}

              <div className="mt-5">
                <StudioAmbientGlowPresets onSelect={addAmbientGlowPreset} />
              </div>
            </div>
          )}
        </aside>
      </div>
      {/* Slides Filmstrip */}
      <aside className="studio-panel mt-4 min-w-0 p-4">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h2 className="font-bold">Slides</h2>

            <span className="text-muted text-xs">
              {project.slides.length} {project.slides.length === 1 ? "slide" : "slides"}
            </span>
          </div>

          <button
            type="button"
            onClick={addSlide}
            className="studio-control studio-button"
            title="Add slide"
            aria-label="Add slide"
          >
            <span className="text-lg leading-none">+</span>
            <span>Add Slide</span>
          </button>
        </div>

        <div className="flex min-w-0 gap-3 overflow-x-auto overscroll-x-contain pb-3">
          {project.slides.map((slide, index) => {
            const isActive = project.activeSlideId === slide.id;

            return (
              <div
                key={slide.id}
                className="studio-layer relative w-40 shrink-0 flex-col items-stretch gap-2"
                data-selected={isActive}
                onDragOver={(event) => {
                  if (!draggedSlideId || draggedSlideId === slide.id) return;

                  event.preventDefault();
                  event.dataTransfer.dropEffect = "move";

                  const bounds = event.currentTarget.getBoundingClientRect();
                  const midpoint = bounds.left + bounds.width / 2;

                  setSlideDropTarget({
                    slideId: slide.id,
                    position: event.clientX < midpoint ? "before" : "after",
                  });
                }}
                onDrop={(event) => {
                  event.preventDefault();

                  if (draggedSlideId && slideDropTarget?.slideId === slide.id) {
                    reorderSlide(draggedSlideId, slide.id, slideDropTarget.position);
                  }

                  setDraggedSlideId(null);
                  setSlideDropTarget(null);
                }}
              >
                {slideDropTarget?.slideId === slide.id && (
                  <div
                    className={`pointer-events-none absolute top-0 bottom-0 z-10 w-1 rounded-full bg-pink-500 ${
                      slideDropTarget.position === "before" ? "-left-2" : "-right-2"
                    }`}
                  />
                )}

                <button
                  type="button"
                  draggable
                  onDragStart={(event) => {
                    event.dataTransfer.effectAllowed = "move";
                    event.dataTransfer.setData("text/plain", slide.id);

                    setDraggedSlideId(slide.id);
                    setSlideDropTarget(null);
                  }}
                  onDragEnd={() => {
                    setDraggedSlideId(null);
                    setSlideDropTarget(null);
                  }}
                  onClick={() => selectSlide(slide.id)}
                  className={`w-full cursor-grab text-left active:cursor-grabbing ${
                    draggedSlideId === slide.id ? "opacity-40" : ""
                  }`}
                  aria-current={isActive ? "true" : undefined}
                  title={`Open ${slide.name}`}
                >
                  <div
                    className="border-default flex aspect-4/5 w-full items-center justify-center rounded-lg border"
                    style={{
                      backgroundColor: brandColor(slide.backgroundColor),
                    }}
                  >
                    <span className="text-muted text-xs">
                      {slide.elements.length} {slide.elements.length === 1 ? "element" : "elements"}
                    </span>
                  </div>
                </button>

                <div className="flex w-full items-center justify-between gap-1">
                  <span className="min-w-0 flex-1 truncate text-xs font-medium">
                    {index + 1}. {slide.name}
                  </span>

                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      type="button"
                      onClick={() => moveSlide(slide.id, "left")}
                      disabled={index === 0}
                      className="studio-layer-icon disabled:cursor-not-allowed disabled:opacity-30"
                      aria-label={`Move ${slide.name} left`}
                      title="Move slide left"
                    >
                      <ArrowLeft size={14} strokeWidth={1.8} />
                    </button>

                    <button
                      type="button"
                      onClick={() => moveSlide(slide.id, "right")}
                      disabled={index === project.slides.length - 1}
                      className="studio-layer-icon disabled:cursor-not-allowed disabled:opacity-30"
                      aria-label={`Move ${slide.name} right`}
                      title="Move slide right"
                    >
                      <ArrowRight size={14} strokeWidth={1.8} />
                    </button>

                    <button
                      type="button"
                      onClick={() => duplicateSlide(slide.id)}
                      className="studio-layer-icon"
                      aria-label={`Duplicate ${slide.name}`}
                      title={`Duplicate ${slide.name}`}
                    >
                      <Copy size={14} strokeWidth={1.8} />
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteSlide(slide.id)}
                      disabled={project.slides.length === 1}
                      className="studio-layer-icon disabled:cursor-not-allowed disabled:opacity-30"
                      aria-label={`Delete ${slide.name}`}
                      title={
                        project.slides.length === 1
                          ? "At least one slide is required"
                          : `Delete ${slide.name}`
                      }
                    >
                      <Trash2 size={14} strokeWidth={1.8} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </aside>
    </div>
  );
}
