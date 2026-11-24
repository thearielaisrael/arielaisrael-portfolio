"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

import {
  Copy,
  FolderOpen,
  FolderPlus,
  LayoutGrid,
  List,
  PencilLine,
  Plus,
  RefreshCw,
  Search,
  Star,
  Trash2,
} from "lucide-react";

import { canvasPresets } from "@/lib/studio/canvasPresets";

import type {
  CloudProjectSummary,
  StudioFolder,
  StudioProjectSort,
  StudioProjectView,
} from "@/lib/studio/cloudTypes";

import {
  listStudioProjects,
  listStudioFolders,
  updateStudioProjectMetadata,
  renameStudioProject,
  duplicateStudioProject,
  deleteStudioProject,
  createStudioFolder,
  renameStudioFolder,
  deleteStudioFolder,
} from "@/lib/studio/projectLibrary";

import StudioSidebar from "../workspace/StudioSidebar";
import StudioLibraryDialog from "./StudioLibraryDialog";
import StudioLibraryProjectCard from "./StudioLibraryProjectCard";

type LibraryData = {
  projects: CloudProjectSummary[];
  folders: StudioFolder[];
};

type LibraryDialog =
  | { type: "project-actions"; project: CloudProjectSummary }
  | { type: "rename-project"; project: CloudProjectSummary }
  | { type: "duplicate-project"; project: CloudProjectSummary }
  | { type: "move-project"; project: CloudProjectSummary }
  | { type: "delete-project"; project: CloudProjectSummary }
  | { type: "create-folder" }
  | { type: "rename-folder"; folder: StudioFolder }
  | { type: "delete-folder"; folder: StudioFolder };

export default function StudioProjects() {
  const [library, setLibrary] = useState<LibraryData>({
    projects: [],
    folders: [],
  });

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [refreshVersion, setRefreshVersion] = useState(0);

  const [query, setQuery] = useState("");
  const [format, setFormat] = useState("all");
  const [folderFilter, setFolderFilter] = useState("all");
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  const [sort, setSort] = useState<StudioProjectSort>("recently-edited");

  const [view, setView] = useState<StudioProjectView>("grid");

  const [dialog, setDialog] = useState<LibraryDialog | null>(null);

  const [draft, setDraft] = useState("");
  const [dialogError, setDialogError] = useState<string | null>(null);

  const [busy, setBusy] = useState(false);
  const busyRef = useRef(false);

  const [notice, setNotice] = useState<string | null>(null);

  const [actionError, setActionError] = useState<string | null>(null);

  const [pageSize, setPageSize] = useState(24);

  useEffect(() => {
    const controller = new AbortController();

    async function loadLibrary() {
      try {
        const [projects, folders] = await Promise.all([
          listStudioProjects(controller.signal),
          listStudioFolders(controller.signal),
        ]);

        if (controller.signal.aborted) return;

        setLibrary({ projects, folders });
        setLoadError(null);
      } catch (error) {
        if (controller.signal.aborted) return;

        setLoadError(
          error instanceof Error ? error.message : "Could not load your project library.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadLibrary();

    return () => controller.abort();
  }, [refreshVersion]);

  function refreshLibrary() {
    setLoading(true);
    setLoadError(null);
    setRefreshVersion((current) => current + 1);
  }

  const visibleProjects = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();

    const result = library.projects.filter((project) => {
      if (normalizedQuery && !project.name.toLocaleLowerCase().includes(normalizedQuery)) {
        return false;
      }

      if (format !== "all" && project.canvas_preset !== format) {
        return false;
      }

      if (favoritesOnly && !project.is_favorite) {
        return false;
      }

      if (folderFilter === "unfiled" && project.folder_id) {
        return false;
      }

      if (
        folderFilter !== "all" &&
        folderFilter !== "unfiled" &&
        project.folder_id !== folderFilter
      ) {
        return false;
      }

      return true;
    });

    return result.sort((a, b) => {
      switch (sort) {
        case "recently-created":
          return (
            new Date(b.created_at ?? b.updated_at).getTime() -
            new Date(a.created_at ?? a.updated_at).getTime()
          );

        case "name-ascending":
          return a.name.localeCompare(b.name);

        case "name-descending":
          return b.name.localeCompare(a.name);

        default:
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      }
    });
  }, [library.projects, query, format, folderFilter, favoritesOnly, sort]);

  const selectedFolder = library.folders.find((folder) => folder.id === folderFilter);

  const favoriteCount = library.projects.filter((project) => project.is_favorite).length;

  const unfiledCount = library.projects.filter((project) => !project.folder_id).length;

  function selectFolder(id: string) {
    setFolderFilter(id);
    setFavoritesOnly(false);
    setPageSize(24);
  }

  function resetFilters() {
    setQuery("");
    setFormat("all");
    setFolderFilter("all");
    setFavoritesOnly(false);
    setPageSize(24);
  }

  function openDialog(nextDialog: LibraryDialog, initialDraft = "") {
    if (busyRef.current || loading || loadError) return;

    setDialog(nextDialog);
    setDraft(initialDraft);
    setDialogError(null);
    setActionError(null);
    setNotice(null);
  }

  function closeDialog() {
    if (busyRef.current) return;

    setDialog(null);
    setDraft("");
    setDialogError(null);
  }

  async function runMutation(
    operation: () => Promise<void>,
    successMessage: string,
    fromDialog = false,
  ) {
    if (busyRef.current || loading || loadError) return;

    busyRef.current = true;
    setBusy(true);
    setDialogError(null);
    setActionError(null);
    setNotice(null);

    try {
      await operation();

      // Close only after the server confirms the mutation.
      if (fromDialog) {
        setDialog(null);
        setDraft("");
      }

      setNotice(successMessage);

      // Always reconcile with the authoritative server state.
      refreshLibrary();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "The operation could not be completed.";

      if (fromDialog) {
        setDialogError(message);
      } else {
        setActionError(message);
      }
    } finally {
      busyRef.current = false;
      setBusy(false);
    }
  }

  function toggleFavorite(project: CloudProjectSummary) {
    void runMutation(
      async () => {
        await updateStudioProjectMetadata(project.id, {
          is_favorite: !project.is_favorite,
        });
      },
      project.is_favorite ? "Removed from favorites." : "Added to favorites.",
    );
  }

  function submitDialog() {
    if (!dialog || busyRef.current) return;

    const value = draft.trim();

    const needsName =
      dialog.type === "rename-project" ||
      dialog.type === "duplicate-project" ||
      dialog.type === "create-folder" ||
      dialog.type === "rename-folder";

    if (needsName && !value) {
      setDialogError("Please enter a name.");
      return;
    }

    switch (dialog.type) {
      case "rename-project":
        void runMutation(
          async () => {
            await renameStudioProject(dialog.project, value);
          },
          "Project renamed.",
          true,
        );
        break;

      case "duplicate-project":
        void runMutation(
          async () => {
            await duplicateStudioProject(dialog.project, value);
          },
          "Project duplicated. Find it in All projects.",
          true,
        );
        break;

      case "move-project":
        void runMutation(
          async () => {
            await updateStudioProjectMetadata(dialog.project.id, {
              folder_id: value || null,
            });
          },
          "Project moved.",
          true,
        );
        break;

      case "delete-project":
        void runMutation(
          async () => {
            await deleteStudioProject(dialog.project.id);
          },
          "Project deleted from the cloud library.",
          true,
        );
        break;

      case "create-folder":
        void runMutation(
          async () => {
            const folder = await createStudioFolder(value);

            selectFolder(folder.id);
          },
          "Folder created.",
          true,
        );
        break;

      case "rename-folder":
        void runMutation(
          async () => {
            await renameStudioFolder(dialog.folder.id, value);
          },
          "Folder renamed.",
          true,
        );
        break;

      case "delete-folder":
        void runMutation(
          async () => {
            await deleteStudioFolder(dialog.folder.id);

            if (folderFilter === dialog.folder.id) {
              selectFolder("all");
            }
          },
          "Folder deleted. Its projects were preserved.",
          true,
        );
        break;
    }
  }

  const dialogTitles: Record<LibraryDialog["type"], string> = {
    "project-actions": "Project actions",
    "rename-project": "Rename project",
    "duplicate-project": "Duplicate project",
    "move-project": "Move project",
    "delete-project": "Delete project",
    "create-folder": "Create folder",
    "rename-folder": "Rename folder",
    "delete-folder": "Delete folder",
  };

  const destructive = dialog?.type === "delete-project" || dialog?.type === "delete-folder";

  const folderNameDialog = dialog?.type === "create-folder" || dialog?.type === "rename-folder";

  const controlsDisabled = busy || loading || Boolean(loadError);

  const heading = favoritesOnly
    ? "Favorites"
    : (selectedFolder?.name ?? (folderFilter === "unfiled" ? "Unfiled projects" : "All projects"));

  return (
    <main className="studio-dashboard">
      <StudioSidebar />

      <div className="studio-dashboard-content studio-library-content">
        <header className="studio-library-heading">
          <div>
            <p className="studio-dashboard-eyebrow">Your creative collection</p>

            <h1>{heading}</h1>

            <p>Organize your designs and find inspiration in your previous work.</p>
          </div>

          <Link href="/studio/editor?preset=instagramPortrait" className="studio-dashboard-primary">
            <Plus size={17} />
            Create a design
          </Link>
        </header>

        {/* Collection navigation */}

        <section className="studio-library-collections" aria-label="Project collections">
          <button
            type="button"
            className="studio-library-collection"
            aria-pressed={folderFilter === "all" && !favoritesOnly}
            onClick={() => selectFolder("all")}
          >
            <FolderOpen size={17} />

            <span>All projects</span>

            <span className="studio-library-count">{library.projects.length}</span>
          </button>

          <button
            type="button"
            className="studio-library-collection"
            aria-pressed={favoritesOnly}
            onClick={() => {
              setFolderFilter("all");
              setFavoritesOnly(true);
              setPageSize(24);
            }}
          >
            <Star size={17} />

            <span>Favorites</span>

            <span className="studio-library-count">{favoriteCount}</span>
          </button>

          <button
            type="button"
            className="studio-library-collection"
            aria-pressed={folderFilter === "unfiled" && !favoritesOnly}
            onClick={() => selectFolder("unfiled")}
          >
            <FolderOpen size={17} />

            <span>Unfiled</span>

            <span className="studio-library-count">{unfiledCount}</span>
          </button>
        </section>

        {/* Folders */}

        <section aria-labelledby="studio-folders-heading" className="studio-library-folder-section">
          <div className="studio-dashboard-section-heading">
            <div>
              <h2 id="studio-folders-heading">Your folders</h2>

              <p>Keep related designs together.</p>
            </div>

            <button
              type="button"
              className="studio-dashboard-secondary"
              disabled={controlsDisabled}
              onClick={() => openDialog({ type: "create-folder" })}
            >
              <FolderPlus size={17} />
              New folder
            </button>
          </div>

          {library.folders.length === 0 && !loading ? (
            <p className="studio-library-folder-empty">
              No folders yet. Create one to organize your collection.
            </p>
          ) : (
            <div className="studio-library-folders">
              {library.folders.map((folder) => {
                const count = library.projects.filter(
                  (project) => project.folder_id === folder.id,
                ).length;

                return (
                  <button
                    key={folder.id}
                    type="button"
                    className="studio-library-folder"
                    aria-pressed={folderFilter === folder.id}
                    onClick={() => selectFolder(folder.id)}
                  >
                    <FolderOpen size={20} />

                    <span>
                      <strong>{folder.name}</strong>

                      <small>
                        {count} {count === 1 ? "project" : "projects"}
                      </small>
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {selectedFolder && (
            <div className="studio-library-folder-actions">
              <strong>{selectedFolder.name}</strong>

              <button
                type="button"
                className="studio-dashboard-text-button"
                disabled={controlsDisabled}
                onClick={() =>
                  openDialog(
                    {
                      type: "rename-folder",
                      folder: selectedFolder,
                    },
                    selectedFolder.name,
                  )
                }
              >
                <PencilLine size={15} />
                Rename
              </button>

              <button
                type="button"
                className="studio-dashboard-text-button studio-library-danger-text"
                disabled={controlsDisabled}
                onClick={() =>
                  openDialog({
                    type: "delete-folder",
                    folder: selectedFolder,
                  })
                }
              >
                <Trash2 size={15} />
                Delete folder
              </button>
            </div>
          )}
        </section>

        {/* Feedback */}

        {notice && (
          <div className="studio-library-notice" role="status">
            {notice}
          </div>
        )}

        {actionError && (
          <div className="studio-library-error" role="alert">
            {actionError}

            <button type="button" className="studio-dashboard-text-button" onClick={refreshLibrary}>
              Refresh
            </button>
          </div>
        )}

        {/* Search, filters and view controls */}

        <section aria-label="Search and filter projects">
          <div className="studio-library-search">
            <Search size={19} aria-hidden="true" />

            <input
              type="search"
              aria-label="Search projects"
              placeholder="Search your projects..."
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPageSize(24);
              }}
            />
          </div>

          <div className="studio-library-toolbar">
            <label className="studio-library-filter">
              <span>Format</span>

              <select
                value={format}
                onChange={(event) => {
                  setFormat(event.target.value);
                  setPageSize(24);
                }}
              >
                <option value="all">All formats</option>

                {Object.entries(canvasPresets).map(([key, preset]) => (
                  <option key={key} value={key}>
                    {preset.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="studio-library-filter">
              <span>Sort by</span>

              <select
                value={sort}
                onChange={(event) => setSort(event.target.value as StudioProjectSort)}
              >
                <option value="recently-edited">Recently edited</option>

                <option value="recently-created">Recently created</option>

                <option value="name-ascending">Name: A–Z</option>

                <option value="name-descending">Name: Z–A</option>
              </select>
            </label>

            <label className="studio-library-filter">
              <span>Folder</span>

              <select value={folderFilter} onChange={(event) => selectFolder(event.target.value)}>
                <option value="all">All folders</option>

                <option value="unfiled">Unfiled</option>

                {library.folders.map((folder) => (
                  <option key={folder.id} value={folder.id}>
                    {folder.name}
                  </option>
                ))}
              </select>
            </label>

            <div className="studio-library-view-controls">
              <button
                type="button"
                aria-label="Grid view"
                aria-pressed={view === "grid"}
                onClick={() => setView("grid")}
              >
                <LayoutGrid size={18} />
              </button>

              <button
                type="button"
                aria-label="List view"
                aria-pressed={view === "list"}
                onClick={() => setView("list")}
              >
                <List size={20} />
              </button>
            </div>
          </div>
        </section>

        {/* Project results */}

        <section aria-label="Project results" aria-busy={loading || busy}>
          <div className="studio-library-results-heading">
            <p>
              {visibleProjects.length} {visibleProjects.length === 1 ? "project" : "projects"}
            </p>

            <div className="studio-library-results-actions">
              <button type="button" className="studio-dashboard-text-button" onClick={resetFilters}>
                Clear filters
              </button>

              <button
                type="button"
                className="studio-dashboard-icon-button"
                aria-label="Refresh library"
                disabled={busy || loading}
                onClick={refreshLibrary}
              >
                <RefreshCw size={17} className={loading ? "animate-spin" : undefined} />
              </button>
            </div>
          </div>

          {loadError && (
            <div className="studio-dashboard-empty" role="alert">
              <FolderOpen size={32} />

              <h3>Unable to load your library</h3>

              <p>{loadError}</p>

              <button type="button" className="studio-dashboard-primary" onClick={refreshLibrary}>
                Try again
              </button>
            </div>
          )}

          {loading && !loadError && (
            <div className="studio-dashboard-project-grid">
              {Array.from({ length: 4 }, (_, index) => (
                <div key={index} className="studio-dashboard-skeleton" aria-hidden="true" />
              ))}
            </div>
          )}

          {!loading && !loadError && visibleProjects.length === 0 && (
            <div className="studio-dashboard-empty">
              {favoritesOnly ? (
                <Star size={36} strokeWidth={1.4} />
              ) : (
                <FolderOpen size={36} strokeWidth={1.4} />
              )}

              <h3>{favoritesOnly ? "No favorite projects" : "No projects to display"}</h3>

              <p>
                {query || format !== "all"
                  ? "Try a different search or clear your filters."
                  : favoritesOnly
                    ? "Star your favorite designs to find them here."
                    : "Create a design or move existing projects into this collection."}
              </p>

              <button type="button" className="studio-dashboard-secondary" onClick={resetFilters}>
                View all projects
              </button>
            </div>
          )}

          {!loading && !loadError && (
            <div className="studio-library-project-results" data-view={view}>
              {visibleProjects.slice(0, pageSize).map((project) => (
                <StudioLibraryProjectCard
                  key={project.id}
                  project={project}
                  folders={library.folders}
                  view={view}
                  busy={controlsDisabled}
                  onToggleFavorite={() => toggleFavorite(project)}
                  onActions={() =>
                    openDialog({
                      type: "project-actions",
                      project,
                    })
                  }
                />
              ))}
            </div>
          )}

          {!loading && !loadError && visibleProjects.length > pageSize && (
            <div className="studio-library-load-more">
              <button
                type="button"
                className="studio-dashboard-secondary"
                onClick={() => setPageSize((current) => current + 24)}
              >
                Show more projects
              </button>
            </div>
          )}
        </section>
      </div>

      {/* Project and folder management dialogs */}

      {dialog && (
        <StudioLibraryDialog title={dialogTitles[dialog.type]} busy={busy} onClose={closeDialog}>
          {dialog.type === "project-actions" ? (
            <div className="studio-library-action-menu">
              <p className="studio-library-dialog-project-name">{dialog.project.name}</p>

              <button
                type="button"
                onClick={() =>
                  openDialog(
                    {
                      type: "rename-project",
                      project: dialog.project,
                    },
                    dialog.project.name,
                  )
                }
              >
                <PencilLine size={18} />
                Rename project
              </button>

              <button
                type="button"
                onClick={() =>
                  openDialog(
                    {
                      type: "duplicate-project",
                      project: dialog.project,
                    },
                    `${dialog.project.name.slice(0, 195)} copy`,
                  )
                }
              >
                <Copy size={18} />
                Duplicate project
              </button>

              <button
                type="button"
                onClick={() =>
                  openDialog(
                    {
                      type: "move-project",
                      project: dialog.project,
                    },
                    dialog.project.folder_id ?? "",
                  )
                }
              >
                <FolderOpen size={18} />
                Move to folder
              </button>

              <button
                type="button"
                className="studio-library-danger-text"
                onClick={() =>
                  openDialog({
                    type: "delete-project",
                    project: dialog.project,
                  })
                }
              >
                <Trash2 size={18} />
                Delete project
              </button>
            </div>
          ) : (
            <form
              className="studio-library-dialog-form"
              onSubmit={(event) => {
                event.preventDefault();
                submitDialog();
              }}
            >
              {dialog.type === "move-project" ? (
                <label className="studio-library-field">
                  <span>Destination folder</span>

                  <select
                    value={draft}
                    disabled={busy}
                    onChange={(event) => setDraft(event.target.value)}
                  >
                    <option value="">Unfiled</option>

                    {library.folders.map((folder) => (
                      <option key={folder.id} value={folder.id}>
                        {folder.name}
                      </option>
                    ))}
                  </select>
                </label>
              ) : dialog.type === "delete-project" ? (
                <p className="studio-library-confirmation">
                  Permanently delete <strong>{dialog.project.name}</strong> from your cloud library?
                  This cannot be undone. Local drafts and downloaded backups are not removed.
                </p>
              ) : dialog.type === "delete-folder" ? (
                <p className="studio-library-confirmation">
                  Delete the folder <strong>{dialog.folder.name}</strong>? Its projects will be
                  moved to Unfiled. No designs will be deleted.
                </p>
              ) : (
                <label className="studio-library-field">
                  <span>{folderNameDialog ? "Folder name" : "Project name"}</span>

                  <input
                    key={dialog.type}
                    type="text"
                    value={draft}
                    maxLength={folderNameDialog ? 100 : 200}
                    required
                    disabled={busy}
                    onChange={(event) => setDraft(event.target.value)}
                  />
                </label>
              )}

              {dialogError && (
                <div className="studio-library-error" role="alert">
                  {dialogError}
                </div>
              )}

              <div className="studio-library-dialog-footer">
                <button
                  type="button"
                  className="studio-dashboard-secondary"
                  disabled={busy}
                  onClick={closeDialog}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className={
                    destructive ? "studio-library-danger-button" : "studio-dashboard-primary"
                  }
                  disabled={controlsDisabled}
                >
                  {busy
                    ? "Working…"
                    : destructive
                      ? "Delete"
                      : dialog.type === "create-folder"
                        ? "Create folder"
                        : dialog.type === "duplicate-project"
                          ? "Duplicate"
                          : dialog.type === "move-project"
                            ? "Move project"
                            : "Save changes"}
                </button>
              </div>
            </form>
          )}
        </StudioLibraryDialog>
      )}
    </main>
  );
}
