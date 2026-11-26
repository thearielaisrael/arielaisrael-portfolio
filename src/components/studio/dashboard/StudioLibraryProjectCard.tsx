"use client";

import Link from "next/link";

import { ArrowUpRight, FolderOpen, MoreHorizontal, Star } from "lucide-react";

import { canvasPresets } from "@/lib/studio/canvasPresets";

import type { CloudProjectSummary, StudioFolder, StudioProjectView } from "@/lib/studio/cloudTypes";

import StudioCloudProjectPreview from "../StudioCloudProjectPreview";

type StudioLibraryProjectCardProps = {
  project: CloudProjectSummary;
  folders: StudioFolder[];
  view: StudioProjectView;
  busy: boolean;
  onToggleFavorite: () => void;
  onActions: () => void;
};

export default function StudioLibraryProjectCard({
  project,
  folders,
  view,
  busy,
  onToggleFavorite,
  onActions,
}: StudioLibraryProjectCardProps) {
  const folder = folders.find((item) => item.id === project.folder_id);

  const preset = project.canvas_preset ? canvasPresets[project.canvas_preset] : undefined;

  const updatedDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(project.updated_at));

  const editorHref = `/studio/editor?project=${encodeURIComponent(project.id)}`;

  return (
    <article className="studio-library-project-card" data-view={view}>
      <div className="studio-library-project-preview">
        <Link
          href={editorHref}
          aria-label={`Open ${project.name}`}
          className="studio-library-preview-link"
        >
          <StudioCloudProjectPreview
            projectId={project.id}
            revision={project.revision}
            showMetadata={false}
          />
        </Link>

        <button
          type="button"
          className="studio-library-favorite-button"
          aria-label={
            project.is_favorite
              ? `Remove ${project.name} from favorites`
              : `Add ${project.name} to favorites`
          }
          aria-pressed={Boolean(project.is_favorite)}
          disabled={busy}
          onClick={onToggleFavorite}
        >
          <Star size={18} fill={project.is_favorite ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="studio-library-project-details">
        <Link href={editorHref} className="studio-library-project-name">
          <h3 title={project.name}>{project.name}</h3>
        </Link>

        <div className="studio-library-project-metadata">
          {preset && <span>{preset.label}</span>}

          {preset && (
            <span>
              {preset.width} × {preset.height}
            </span>
          )}

          {typeof project.slide_count === "number" && (
            <span>
              {project.slide_count} {project.slide_count === 1 ? "slide" : "slides"}
            </span>
          )}
        </div>

        <div className="studio-library-project-folder">
          <FolderOpen size={13} aria-hidden="true" />

          {folder?.name ?? "Unfiled"}
        </div>

        <time className="studio-library-project-edited" dateTime={project.updated_at}>
          Edited {updatedDate}
        </time>
      </div>

      <div className="studio-library-project-actions">
        <Link href={editorHref} className="studio-dashboard-secondary">
          Open
          <ArrowUpRight size={15} aria-hidden="true" />
        </Link>

        <button
          type="button"
          className="studio-dashboard-icon-button"
          aria-label={`Manage ${project.name}`}
          title="Project actions"
          disabled={busy}
          onClick={onActions}
        >
          <MoreHorizontal size={21} />
        </button>
      </div>
    </article>
  );
}
