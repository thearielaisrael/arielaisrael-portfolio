import type { StudioProject } from "./types";

export type CloudProjectSummary = {
  id: string;
  name: string;
  revision: number;
  updated_at: string;
};

export type CloudProjectRecord = CloudProjectSummary & {
  document: StudioProject;
};

export type CloudProjectSession = {
  id: string;
  revision: number;
};
