"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import { ArrowRight, LayoutTemplate, Star } from "lucide-react";

import type { StudioTemplateSummary } from "@/lib/studio/templateTypes";

import { listStudioTemplates } from "@/lib/studio/templateLibrary";

import StudioTemplatePreview from "./StudioTemplatePreview";

type RecentTemplateState =
  | { status: "loading" }
  | { status: "error" }
  | {
      status: "ready";
      templates: StudioTemplateSummary[];
    };

export default function StudioRecentTemplates() {
  const [state, setState] = useState<RecentTemplateState>({
    status: "loading",
  });

  useEffect(() => {
    const controller = new AbortController();

    async function loadTemplates() {
      try {
        const templates = await listStudioTemplates(controller.signal);

        if (controller.signal.aborted) return;

        setState({
          status: "ready",
          templates: [...templates]
            .sort((a, b) => {
              const favoriteDifference = Number(b.is_favorite) - Number(a.is_favorite);

              if (favoriteDifference !== 0) {
                return favoriteDifference;
              }

              return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
            })
            .slice(0, 4),
        });
      } catch {
        if (!controller.signal.aborted) {
          setState({ status: "error" });
        }
      }
    }

    void loadTemplates();

    return () => controller.abort();
  }, []);

  return (
    <section
      aria-labelledby="studio-recent-templates-heading"
      aria-busy={state.status === "loading"}
    >
      <div className="studio-dashboard-section-heading">
        <div>
          <h2 id="studio-recent-templates-heading">Your templates</h2>

          <p>Favorite and recent designs, ready to reuse.</p>
        </div>

        <Link href="/studio/templates" className="studio-dashboard-text-button">
          View all
          <ArrowRight size={15} />
        </Link>
      </div>

      {state.status === "loading" && (
        <div className="studio-template-recent-grid">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="studio-dashboard-skeleton" aria-hidden="true" />
          ))}
        </div>
      )}

      {state.status === "error" && (
        <div className="studio-dashboard-empty">
          <p>Unable to load your templates.</p>

          <Link href="/studio/templates" className="studio-dashboard-secondary">
            Open template library
          </Link>
        </div>
      )}

      {state.status === "ready" && state.templates.length === 0 && (
        <div className="studio-template-home-empty">
          <LayoutTemplate size={28} strokeWidth={1.5} />

          <div>
            <strong>Create once. Reuse beautifully.</strong>

            <p>Save your favorite designs as reusable templates.</p>
          </div>

          <Link href="/studio/projects" className="studio-dashboard-secondary">
            Browse projects
          </Link>
        </div>
      )}

      {state.status === "ready" && state.templates.length > 0 && (
        <div className="studio-template-recent-grid">
          {state.templates.map((template) => (
            <Link
              key={template.id}
              href={"/studio/templates?template=" + encodeURIComponent(template.id)}
              className="studio-dashboard-project-card"
            >
              <StudioTemplatePreview templateId={template.id} updatedAt={template.updated_at} />

              <div className="studio-dashboard-project-info">
                <div className="studio-dashboard-project-title">
                  <h3 title={template.name}>{template.name}</h3>

                  {template.is_favorite && (
                    <Star size={14} fill="currentColor" aria-label="Favorite" />
                  )}
                </div>

                <div className="studio-library-project-metadata">
                  <span>
                    {template.slide_count} {template.slide_count === 1 ? "slide" : "slides"}
                  </span>

                  {template.category && <span>{template.category}</span>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
