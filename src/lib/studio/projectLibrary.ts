import type {
  CloudProjectRecord,
  CloudProjectSummary,
  StudioFolder,
  StudioProjectMetadataUpdate,
} from "./cloudTypes";

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

function projectUrl(id: string) {
  return `/api/studio/projects/${encodeURIComponent(id)}`;
}

function folderUrl(id: string) {
  return `/api/studio/folders/${encodeURIComponent(id)}`;
}

export async function listStudioProjects(signal?: AbortSignal) {
  const result = await requestJson<{
    projects: CloudProjectSummary[];
  }>("/api/studio/projects", { signal });

  if (!Array.isArray(result.projects)) {
    throw new Error("Invalid project library response.");
  }

  return result.projects;
}

export async function listStudioFolders(signal?: AbortSignal) {
  const result = await requestJson<{
    folders: StudioFolder[];
  }>("/api/studio/folders", { signal });

  if (!Array.isArray(result.folders)) {
    throw new Error("Invalid folder library response.");
  }

  return result.folders;
}

export async function getStudioProject(id: string) {
  const result = await requestJson<{
    project: CloudProjectRecord;
  }>(projectUrl(id));

  if (!result.project?.document || result.project.id !== id || result.project.document.id !== id) {
    throw new Error("Invalid project document.");
  }

  return result.project;
}

export async function updateStudioProjectMetadata(
  id: string,
  updates: StudioProjectMetadataUpdate,
) {
  const result = await requestJson<{
    project: CloudProjectSummary;
  }>(`${projectUrl(id)}/metadata`, {
    method: "PATCH",
    body: JSON.stringify(updates),
  });

  return result.project;
}

export async function renameStudioProject(summary: CloudProjectSummary, name: string) {
  const trimmedName = name.trim();

  if (!trimmedName || trimmedName.length > 200) {
    throw new Error("Project names must contain 1–200 characters.");
  }

  const record = await getStudioProject(summary.id);

  if (record.revision !== summary.revision) {
    throw new Error(
      "This project changed on another device. " + "Refresh the library before renaming it.",
    );
  }

  return requestJson<{
    id: string;
    revision: number;
  }>(projectUrl(summary.id), {
    method: "PATCH",
    body: JSON.stringify({
      project: {
        ...record.document,
        name: trimmedName,
      },
      expectedRevision: record.revision,
    }),
  });
}

export async function duplicateStudioProject(summary: CloudProjectSummary, name: string) {
  const trimmedName = name.trim();

  if (!trimmedName || trimmedName.length > 200) {
    throw new Error("Project names must contain 1–200 characters.");
  }

  const record = await getStudioProject(summary.id);

  if (record.revision !== summary.revision) {
    throw new Error(
      "This project changed on another device. " + "Refresh the library before duplicating it.",
    );
  }

  return requestJson<{
    id: string;
    revision: number;
  }>("/api/studio/projects", {
    method: "POST",
    body: JSON.stringify({
      ...record.document,
      name: trimmedName,
    }),
  });
}

export async function deleteStudioProject(id: string) {
  return requestJson<{ success: boolean }>(projectUrl(id), { method: "DELETE" });
}

export async function createStudioFolder(name: string) {
  const result = await requestJson<{
    folder: StudioFolder;
  }>("/api/studio/folders", {
    method: "POST",
    body: JSON.stringify({ name }),
  });

  return result.folder;
}

export async function renameStudioFolder(id: string, name: string) {
  const result = await requestJson<{
    folder: StudioFolder;
  }>(folderUrl(id), {
    method: "PATCH",
    body: JSON.stringify({ name }),
  });

  return result.folder;
}

export async function deleteStudioFolder(id: string) {
  return requestJson<{ success: boolean }>(folderUrl(id), { method: "DELETE" });
}
