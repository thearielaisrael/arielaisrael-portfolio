import type { StudioProject } from "./types";
import type { CanvasPreset } from "./canvasPresets";

export type StudioTemplateSummary = {
  id: string;
  name: string;
  description: string;
  category: string;
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
  canvas_preset?: CanvasPreset;
  slide_count: number;
};

export type StudioTemplateRecord = StudioTemplateSummary & {
  document: StudioProject;
};

export type StudioTemplateCreate = {
  projectId: string;
  expectedRevision: number;
  name: string;
  description?: string;
  category?: string;
};

export type StudioTemplateUpdate = {
  name?: string;
  description?: string;
  category?: string;
  is_favorite?: boolean;
};

export type StudioTemplateSort =
  "recently-updated" | "recently-created" | "name-ascending" | "name-descending";
