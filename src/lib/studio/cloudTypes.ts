import type { StudioProject } from "./types";
import type { CanvasPreset } from "./canvasPresets";

export type CloudProjectSummary = {
  id: string;
  name: string;
  revision: number;
  updated_at: string;

  // Organizational metadata
  created_at?: string;
  folder_id?: string | null;
  is_favorite?: boolean;

  // Design metadata
  canvas_preset?: CanvasPreset;
  slide_count?: number;
};

export type CloudProjectRecord = CloudProjectSummary & {
  document: StudioProject;
};

export type CloudProjectSession = {
  id: string;
  revision: number;
};

export type StudioFolder = {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
};

export type StudioProjectSort =
  "recently-edited" | "recently-created" | "name-ascending" | "name-descending";

export type StudioProjectView = "grid" | "list";

export type StudioProjectMetadataUpdate = {
  folder_id?: string | null;
  is_favorite?: boolean;
};
