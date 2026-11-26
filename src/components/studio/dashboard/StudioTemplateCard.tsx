"use client";

import { LayoutTemplate, MoreHorizontal, Star, ArrowUpRight } from "lucide-react";

import { canvasPresets } from "@/lib/studio/canvasPresets";

import type { StudioTemplateSummary } from "@/lib/studio/templateTypes";

import StudioTemplatePreview from "./StudioTemplatePreview";

type StudioTemplateCardProps = {
  template: StudioTemplateSummary;
  busy: boolean;
  onUse: () => void;
  onToggleFavorite: () => void;
  onActions: () => void;
};

export default function StudioTemplateCard({
  template,
  busy,
  onUse,
  onToggleFavorite,
  onActions,
}: StudioTemplateCardProps) {
  const preset = template.canvas_preset ? canvasPresets[template.canvas_preset] : undefined;

  return (
    <article className="studio-template-card">
      <div className="studio-template-card-preview">
        <button
          type="button"
          className="studio-template-preview-button"
          aria-label={`Use ${template.name}`}
          disabled={busy}
          onClick={onUse}
        >
          <StudioTemplatePreview templateId={template.id} updatedAt={template.updated_at} />
        </button>

        <button
          type="button"
          className="studio-library-favorite-button"
          aria-label={
            template.is_favorite
              ? `Remove ${template.name} from favorites`
              : `Add ${template.name} to favorites`
          }
          aria-pressed={template.is_favorite}
          disabled={busy}
          onClick={onToggleFavorite}
        >
          <Star size={18} fill={template.is_favorite ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="studio-template-card-details">
        <h3 title={template.name}>{template.name}</h3>

        <div className="studio-library-project-metadata">
          {preset && <span>{preset.label}</span>}

          <span>
            {template.slide_count} {template.slide_count === 1 ? "slide" : "slides"}
          </span>

          {preset && (
            <span>
              {preset.width} × {preset.height}
            </span>
          )}
        </div>

        {template.category && (
          <div className="studio-template-category">
            <LayoutTemplate size={12} aria-hidden="true" />

            {template.category}
          </div>
        )}

        {template.description && (
          <p className="studio-template-description">{template.description}</p>
        )}
      </div>

      <div className="studio-template-card-actions">
        <button type="button" className="studio-dashboard-primary" disabled={busy} onClick={onUse}>
          Use template
          <ArrowUpRight size={15} aria-hidden="true" />
        </button>

        <button
          type="button"
          className="studio-dashboard-icon-button"
          aria-label={`Manage ${template.name}`}
          title="Template actions"
          disabled={busy}
          onClick={onActions}
        >
          <MoreHorizontal size={21} />
        </button>
      </div>
    </article>
  );
}
