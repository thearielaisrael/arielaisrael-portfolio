import type {
  StudioTemplateSummary,
  StudioTemplateRecord,
  StudioTemplateCreate,
  StudioTemplateUpdate,
} from "./templateTypes";

import { createId } from "./createId";

async function requestJson<T>(url: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);

  if (options.body) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url, {
    ...options,
    headers,
    cache: "no-store",
    credentials: "same-origin",
  });

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(result?.error ?? `Request failed (${response.status}).`);
  }

  if (result === null) {
    throw new Error("Invalid server response.");
  }

  return result as T;
}

function templateUrl(id: string) {
  return "/api/studio/templates/" + encodeURIComponent(id);
}

export async function listStudioTemplates(signal?: AbortSignal) {
  const result = await requestJson<{
    templates: StudioTemplateSummary[];
  }>("/api/studio/templates", { signal });

  if (!Array.isArray(result.templates)) {
    throw new Error("Invalid template library response.");
  }

  return result.templates;
}

export async function getStudioTemplate(id: string, signal?: AbortSignal) {
  const result = await requestJson<{
    template: StudioTemplateRecord;
  }>(templateUrl(id), { signal });

  if (!result.template?.document || result.template.id !== id) {
    throw new Error("Invalid template document.");
  }

  return result.template;
}

export async function createStudioTemplate(input: StudioTemplateCreate) {
  const result = await requestJson<{
    template: StudioTemplateSummary;
  }>("/api/studio/templates", {
    method: "POST",
    body: JSON.stringify(input),
  });

  return result.template;
}

export async function updateStudioTemplate(id: string, updates: StudioTemplateUpdate) {
  const result = await requestJson<{
    template: StudioTemplateSummary;
  }>(templateUrl(id), {
    method: "PATCH",
    body: JSON.stringify(updates),
  });

  return result.template;
}

export async function deleteStudioTemplate(id: string) {
  return requestJson<{
    success: boolean;
  }>(templateUrl(id), {
    method: "DELETE",
  });
}

export async function createProjectFromTemplate(templateId: string, name: string) {
  const trimmedName = name.trim();

  if (!trimmedName || trimmedName.length > 200) {
    throw new Error("Enter a valid project name.");
  }

  const template = await getStudioTemplate(templateId);

  return requestJson<{
    id: string;
    revision: number;
  }>("/api/studio/projects", {
    method: "POST",

    body: JSON.stringify({
      ...template.document,
      id: createId(),
      name: trimmedName,
    }),
  });
}


export async function duplicateStudioTemplate(id: string, name: string) {
  const result = await requestJson<{
    template: StudioTemplateSummary;
  }>(templateUrl(id), {
    method: "POST",
    body: JSON.stringify({ name }),
  });

  return result.template;
}
