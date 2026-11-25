"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { ArrowRight, FolderOpen, Plus, RefreshCw, Sparkles } from "lucide-react";

import type { CloudProjectSummary } from "@/lib/studio/cloudTypes";

import StudioQuickCreate from "./StudioQuickCreate";
import StudioProjectCard from "./StudioProjectCard";
import StudioSidebar from "../workspace/StudioSidebar";
import StudioRecentTemplates from "./StudioRecentTemplates";

type LibraryState =
  | { status: "loading" }
  | {
      status: "ready";
      projects: CloudProjectSummary[];
    }
  | {
      status: "error";
      message: string;
    };

const RECENT_PROJECT_LIMIT = 8;

export default function StudioDashboard() {
  const [library, setLibrary] = useState<LibraryState>({
    status: "loading",
  });

  const [refreshVersion, setRefreshVersion] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadProjects() {
      try {
        const response = await fetch("/api/studio/projects", {
          cache: "no-store",
          credentials: "same-origin",
          signal: controller.signal,
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error ?? "Could not load projects.");
        }

        if (!Array.isArray(result.projects)) {
          throw new Error("The project library returned invalid data.");
        }

        if (!controller.signal.aborted) {
          setLibrary({
            status: "ready",
            projects: result.projects,
          });
        }
      } catch (error) {
        if (controller.signal.aborted) return;

        setLibrary({
          status: "error",
          message: error instanceof Error ? error.message : "Could not load your projects.",
        });
      }
    }

    void loadProjects();

    return () => controller.abort();
  }, [refreshVersion]);

  function refreshProjects() {
    setLibrary({ status: "loading" });
    setRefreshVersion((current) => current + 1);
  }

  const projects = library.status === "ready" ? library.projects : [];

  const recentProjects = [...projects]
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, RECENT_PROJECT_LIMIT);

  return (
    <main className="studio-dashboard">
      <StudioSidebar />

      <div className="studio-dashboard-content">
        <section className="studio-dashboard-hero">
          <div className="studio-dashboard-hero-copy">
            <p className="studio-dashboard-eyebrow">Your creative workspace</p>

            <h1>Bring your ideas to life.</h1>

            <p className="studio-dashboard-hero-description">Create something meaningful today.</p>

            <div className="studio-dashboard-hero-actions">
              <Link
                href="/studio/editor?preset=instagramPortrait"
                className="studio-dashboard-primary"
              >
                <Plus size={18} />
                Create a design
              </Link>

              <Link href="/studio/editor" className="studio-dashboard-secondary">
                Continue editing
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          <div className="studio-dashboard-hero-decoration" aria-hidden="true">
            <Sparkles size={100} strokeWidth={0.65} />
          </div>
        </section>

        <StudioQuickCreate />

        <section aria-labelledby="studio-projects-heading" aria-busy={library.status === "loading"}>
          <div className="studio-dashboard-section-heading">
            <div>
              <h2 id="studio-projects-heading">Recent projects</h2>

              <p>Pick up where you left off.</p>
            </div>

            <div className="studio-dashboard-section-actions">
              <button
                type="button"
                onClick={refreshProjects}
                disabled={library.status === "loading"}
                className="studio-dashboard-icon-button"
                aria-label="Refresh projects"
                title="Refresh projects"
              >
                <RefreshCw
                  size={17}
                  className={library.status === "loading" ? "animate-spin" : undefined}
                />
              </button>

              <Link href="/studio/projects" className="studio-dashboard-text-button">
                View all
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>

          {library.status === "loading" && (
            <div className="studio-dashboard-project-grid">
              {Array.from({ length: 4 }, (_, index) => (
                <div key={index} className="studio-dashboard-skeleton" aria-hidden="true" />
              ))}

              <span className="sr-only">Loading your projects</span>
            </div>
          )}

          {library.status === "error" && (
            <div className="studio-dashboard-empty" role="alert">
              <FolderOpen size={36} strokeWidth={1.4} />

              <h3>Unable to load projects</h3>

              <p>{library.message}</p>

              <button type="button" className="studio-dashboard-primary" onClick={refreshProjects}>
                Try again
              </button>
            </div>
          )}

          {library.status === "ready" && projects.length === 0 && (
            <div className="studio-dashboard-empty">
              <FolderOpen size={36} strokeWidth={1.4} />

              <h3>Your creative collection begins here</h3>

              <p>Create your first design and save it to the cloud to see it in your library.</p>

              <Link href="/studio/editor" className="studio-dashboard-primary">
                Open design editor
              </Link>
            </div>
          )}

          {library.status === "ready" && projects.length > 0 && (
            <div className="studio-dashboard-project-grid">
              {recentProjects.map((project) => (
                <StudioProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </section>
        
        <StudioRecentTemplates />
      </div>
    </main>
  );
}
