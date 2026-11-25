"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { Copy, LayoutTemplate, PencilLine, RefreshCw, Search, Star, Trash2 } from "lucide-react";

import { canvasPresets } from "@/lib/studio/canvasPresets";

import type { StudioTemplateSummary, StudioTemplateSort } from "@/lib/studio/templateTypes";

import {
  listStudioTemplates,
  updateStudioTemplate,
  duplicateStudioTemplate,
  deleteStudioTemplate,
  createProjectFromTemplate,
} from "@/lib/studio/templateLibrary";

import StudioSidebar from "../workspace/StudioSidebar";
import StudioLibraryDialog from "./StudioLibraryDialog";
import StudioTemplateCard from "./StudioTemplateCard";
import StudioTemplatePreview from "./StudioTemplatePreview";

type TemplateDialog = {
  type: "actions" | "edit" | "duplicate" | "use" | "delete";

  template: StudioTemplateSummary;
};

type StudioTemplatesProps = {
  initialTemplateId?: string;
};

export default function StudioTemplates({ initialTemplateId }: StudioTemplatesProps) {
  const router = useRouter();

  const [templates, setTemplates] = useState<StudioTemplateSummary[]>([]);

  const [loading, setLoading] = useState(true);

  const [loadError, setLoadError] = useState<string | null>(null);

  const [refreshVersion, setRefreshVersion] = useState(0);

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [format, setFormat] = useState("all");

  const [templateFilter, setTemplateFilter] = useState(initialTemplateId ?? "");

  const [favoritesOnly, setFavoritesOnly] = useState(false);

  const [sort, setSort] = useState<StudioTemplateSort>("recently-updated");

  const [pageSize, setPageSize] = useState(24);

  const [dialog, setDialog] = useState<TemplateDialog | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryDraft, setCategoryDraft] = useState("");

  const [busy, setBusy] = useState(false);
  const busyRef = useRef(false);

  const [notice, setNotice] = useState<string | null>(null);

  const [actionError, setActionError] = useState<string | null>(null);

  const [dialogError, setDialogError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadTemplates() {
      try {
        const result = await listStudioTemplates(controller.signal);

        if (controller.signal.aborted) return;

        setTemplates(result);
        setLoadError(null);
      } catch (error) {
        if (controller.signal.aborted) return;

        setLoadError(error instanceof Error ? error.message : "Could not load templates.");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadTemplates();

    return () => controller.abort();
  }, [refreshVersion]);

  function refreshLibrary() {
    setLoading(true);
    setLoadError(null);

    setRefreshVersion((current) => current + 1);
  }

  const categories = useMemo(() => {
    return Array.from(
      new Set(templates.map((template) => template.category.trim()).filter(Boolean)),
    ).sort((a, b) => a.localeCompare(b));
  }, [templates]);

  const favoriteCount = templates.filter((template) => template.is_favorite).length;

  const visibleTemplates = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();

    const result = templates.filter((template) => {
      if (templateFilter && template.id !== templateFilter) {
        return false;
      }

      if (favoritesOnly && !template.is_favorite) {
        return false;
      }

      if (category !== "all" && template.category !== category) {
        return false;
      }

      if (format !== "all" && template.canvas_preset !== format) {
        return false;
      }

      if (normalizedQuery) {
        const searchableText = [template.name, template.description, template.category]
          .join(" ")
          .toLocaleLowerCase();

        if (!searchableText.includes(normalizedQuery)) {
          return false;
        }
      }

      return true;
    });

    return result.sort((a, b) => {
      switch (sort) {
        case "recently-created":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();

        case "name-ascending":
          return a.name.localeCompare(b.name);

        case "name-descending":
          return b.name.localeCompare(a.name);

        default:
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      }
    });
  }, [templates, query, category, format, favoritesOnly, templateFilter, sort]);

  const controlsDisabled = busy || loading || Boolean(loadError);

  function resetFilters() {
    setQuery("");
    setCategory("all");
    setFormat("all");
    setFavoritesOnly(false);
    setTemplateFilter("");
    setPageSize(24);

    window.history.replaceState(window.history.state, "", "/studio/templates");
  }

  function openDialog(type: TemplateDialog["type"], template: StudioTemplateSummary) {
    if (busyRef.current || loading || loadError) {
      return;
    }

    setDialog({ type, template });

    setName(type === "duplicate" ? `${template.name.slice(0, 195)} copy` : template.name);

    setDescription(template.description);
    setCategoryDraft(template.category);
    setDialogError(null);
    setActionError(null);
    setNotice(null);
  }

  function closeDialog() {
    if (busyRef.current) return;

    setDialog(null);
    setDialogError(null);
  }

  async function runAction(
    operation: () => Promise<string | void>,
    successMessage: string,
    fromDialog = false,
  ) {
    if (busyRef.current || loading || loadError) {
      return;
    }

    busyRef.current = true;

    setBusy(true);
    setNotice(null);
    setActionError(null);
    setDialogError(null);

    try {
      const nextRoute = await operation();

      if (fromDialog) {
        setDialog(null);
      }

      setNotice(successMessage);

      if (nextRoute) {
        router.push(nextRoute);
      } else {
        refreshLibrary();
      }
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

  function toggleFavorite(template: StudioTemplateSummary) {
    void runAction(
      async () => {
        await updateStudioTemplate(template.id, {
          is_favorite: !template.is_favorite,
        });
      },
      template.is_favorite ? "Removed from favorites." : "Added to favorites.",
    );
  }

  function submitDialog() {
    if (!dialog || busyRef.current) return;

    const trimmedName = name.trim();

    if (
      dialog.type !== "delete" &&
      dialog.type !== "actions" &&
      (!trimmedName || trimmedName.length > 200)
    ) {
      setDialogError("Enter a valid name.");

      return;
    }

    switch (dialog.type) {
      case "edit":
        void runAction(
          async () => {
            await updateStudioTemplate(dialog.template.id, {
              name: trimmedName,
              description: description.trim(),
              category: categoryDraft.trim(),
            });

            // Avoid hiding a renamed category
            // behind a stale category filter.
            setCategory("all");
          },
          "Template details updated.",
          true,
        );
        break;

      case "duplicate":
        void runAction(
          async () => {
            await duplicateStudioTemplate(dialog.template.id, trimmedName);

            resetFilters();
          },
          "Template duplicated.",
          true,
        );
        break;

      case "use":
        void runAction(
          async () => {
            const project = await createProjectFromTemplate(dialog.template.id, trimmedName);

            return "/studio/editor?project=" + encodeURIComponent(project.id);
          },
          "New project created from template.",
          true,
        );
        break;

      case "delete":
        void runAction(
          async () => {
            await deleteStudioTemplate(dialog.template.id);

            if (templateFilter === dialog.template.id) {
              resetFilters();
            }

            setCategory("all");
          },
          "Template deleted. Existing projects were preserved.",
          true,
        );
        break;
    }
  }

  const dialogTitles: Record<TemplateDialog["type"], string> = {
    actions: "Template actions",
    edit: "Edit template details",
    duplicate: "Duplicate template",
    use: "Create from template",
    delete: "Delete template",
  };

  return (
    <main className="studio-dashboard">
      <StudioSidebar />

      <div className="studio-dashboard-content studio-library-content">
        <header className="studio-library-heading">
          <div>
            <p className="studio-dashboard-eyebrow">Your creative collection</p>

            <h1>Templates</h1>

            <p>Create once. Reuse beautifully.</p>
          </div>

          <Link href="/studio/projects" className="studio-dashboard-secondary">
            <LayoutTemplate size={17} />
            Create from a project
          </Link>
        </header>

        <section className="studio-library-collections" aria-label="Template collections">
          <button
            type="button"
            className="studio-library-collection"
            aria-pressed={!favoritesOnly}
            onClick={() => {
              setFavoritesOnly(false);
              setTemplateFilter("");
              setPageSize(24);
            }}
          >
            <LayoutTemplate size={17} />

            <span>All templates</span>

            <span className="studio-library-count">{templates.length}</span>
          </button>

          <button
            type="button"
            className="studio-library-collection"
            aria-pressed={favoritesOnly}
            onClick={() => {
              setFavoritesOnly(true);
              setTemplateFilter("");
              setPageSize(24);
            }}
          >
            <Star size={17} />

            <span>Favorites</span>

            <span className="studio-library-count">{favoriteCount}</span>
          </button>
        </section>

        {notice && (
          <div className="studio-library-notice" role="status">
            {notice}
          </div>
        )}

        {actionError && (
          <div className="studio-library-error" role="alert">
            {actionError}
          </div>
        )}

        {templateFilter && (
          <div className="studio-library-notice">
            Showing selected template.
            <button type="button" className="studio-dashboard-text-button" onClick={resetFilters}>
              View all templates
            </button>
          </div>
        )}

        <section aria-label="Search and filter templates">
          <div className="studio-library-search">
            <Search size={19} aria-hidden="true" />

            <input
              type="search"
              aria-label="Search templates"
              placeholder="Search your templates..."
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPageSize(24);
              }}
            />
          </div>

          <div className="studio-library-toolbar">
            <label className="studio-library-filter">
              <span>Category</span>

              <select
                value={category}
                onChange={(event) => {
                  setCategory(event.target.value);
                  setPageSize(24);
                }}
              >
                <option value="all">All categories</option>

                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

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
                onChange={(event) => setSort(event.target.value as StudioTemplateSort)}
              >
                <option value="recently-updated">Recently updated</option>

                <option value="recently-created">Recently created</option>

                <option value="name-ascending">Name: A–Z</option>

                <option value="name-descending">Name: Z–A</option>
              </select>
            </label>
          </div>
        </section>

        <section aria-label="Template results" aria-busy={loading || busy}>
          <div className="studio-library-results-heading">
            <p>
              {visibleTemplates.length} {visibleTemplates.length === 1 ? "template" : "templates"}
            </p>

            <div className="studio-library-results-actions">
              <button type="button" className="studio-dashboard-text-button" onClick={resetFilters}>
                Clear filters
              </button>

              <button
                type="button"
                className="studio-dashboard-icon-button"
                aria-label="Refresh templates"
                disabled={loading || busy}
                onClick={refreshLibrary}
              >
                <RefreshCw size={17} className={loading ? "animate-spin" : undefined} />
              </button>
            </div>
          </div>

          {loadError && (
            <div className="studio-dashboard-empty" role="alert">
              <LayoutTemplate size={36} />

              <h3>Unable to load templates</h3>

              <p>{loadError}</p>

              <button type="button" className="studio-dashboard-primary" onClick={refreshLibrary}>
                Try again
              </button>
            </div>
          )}

          {loading && !loadError && (
            <div className="studio-template-grid">
              {Array.from({ length: 4 }, (_, index) => (
                <div key={index} className="studio-dashboard-skeleton" aria-hidden="true" />
              ))}
            </div>
          )}

          {!loading && !loadError && visibleTemplates.length === 0 && (
            <div className="studio-dashboard-empty">
              <LayoutTemplate size={38} strokeWidth={1.4} />

              <h3>
                {templates.length === 0
                  ? "Your template collection begins here"
                  : "No matching templates"}
              </h3>

              <p>
                {templates.length === 0
                  ? "Save one of your cloud projects as a reusable template to get started."
                  : "Try a different search or clear your filters."}
              </p>

              {templates.length === 0 ? (
                <Link href="/studio/projects" className="studio-dashboard-primary">
                  Browse your projects
                </Link>
              ) : (
                <button type="button" className="studio-dashboard-secondary" onClick={resetFilters}>
                  View all templates
                </button>
              )}
            </div>
          )}

          {!loading && !loadError && (
            <div className="studio-template-grid">
              {visibleTemplates.slice(0, pageSize).map((template) => (
                <StudioTemplateCard
                  key={template.id}
                  template={template}
                  busy={controlsDisabled}
                  onUse={() => openDialog("use", template)}
                  onToggleFavorite={() => toggleFavorite(template)}
                  onActions={() => openDialog("actions", template)}
                />
              ))}
            </div>
          )}

          {!loading && !loadError && visibleTemplates.length > pageSize && (
            <div className="studio-library-load-more">
              <button
                type="button"
                className="studio-dashboard-secondary"
                onClick={() => setPageSize((current) => current + 24)}
              >
                Show more templates
              </button>
            </div>
          )}
        </section>
      </div>

      {dialog && (
        <StudioLibraryDialog title={dialogTitles[dialog.type]} busy={busy} onClose={closeDialog}>
          {dialog.type === "actions" ? (
            <div className="studio-library-action-menu">
              <p className="studio-library-dialog-project-name">{dialog.template.name}</p>

              <button type="button" onClick={() => openDialog("edit", dialog.template)}>
                <PencilLine size={18} />
                Edit template details
              </button>

              <button type="button" onClick={() => openDialog("duplicate", dialog.template)}>
                <Copy size={18} />
                Duplicate template
              </button>

              <button
                type="button"
                className="studio-library-danger-text"
                onClick={() => openDialog("delete", dialog.template)}
              >
                <Trash2 size={18} />
                Delete template
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
              {dialog.type === "delete" ? (
                <p className="studio-library-confirmation">
                  Permanently delete <strong>{dialog.template.name}</strong>? This will not delete
                  any projects created from this template.
                </p>
              ) : (
                <>
                  {dialog.type === "use" && (
                    <>
                      <StudioTemplatePreview
                        templateId={dialog.template.id}
                        updatedAt={dialog.template.updated_at}
                      />

                      <p className="studio-library-confirmation">
                        A new independent cloud project will be created. Your template and current
                        local editing session will remain unchanged until you choose to open the new
                        project.
                      </p>
                    </>
                  )}

                  <label className="studio-library-field">
                    <span>{dialog.type === "use" ? "New project name" : "Template name"}</span>

                    <input
                      key={dialog.type}
                      type="text"
                      value={name}
                      maxLength={200}
                      required
                      disabled={busy}
                      onChange={(event) => setName(event.target.value)}
                    />
                  </label>

                  {dialog.type === "edit" && (
                    <>
                      <label className="studio-library-field">
                        <span>Category</span>

                        <input
                          type="text"
                          value={categoryDraft}
                          maxLength={100}
                          list="studio-template-categories"
                          disabled={busy}
                          onChange={(event) => setCategoryDraft(event.target.value)}
                        />

                        <datalist id="studio-template-categories">
                          {categories.map((item) => (
                            <option key={item} value={item} />
                          ))}
                        </datalist>
                      </label>

                      <label className="studio-library-field">
                        <span>Description</span>

                        <textarea
                          value={description}
                          maxLength={1000}
                          rows={3}
                          disabled={busy}
                          onChange={(event) => setDescription(event.target.value)}
                        />
                      </label>
                    </>
                  )}
                </>
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
                    dialog.type === "delete"
                      ? "studio-library-danger-button"
                      : "studio-dashboard-primary"
                  }
                  disabled={controlsDisabled}
                >
                  {busy
                    ? "Working…"
                    : dialog.type === "delete"
                      ? "Delete template"
                      : dialog.type === "use"
                        ? "Create project"
                        : dialog.type === "duplicate"
                          ? "Duplicate"
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
