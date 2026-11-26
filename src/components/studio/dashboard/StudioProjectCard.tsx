import Link from "next/link";
import { ArrowUpRight, Clock3 } from "lucide-react";

import type { CloudProjectSummary } from "@/lib/studio/cloudTypes";

import StudioCloudProjectPreview from "../StudioCloudProjectPreview";

type StudioProjectCardProps = {
  project: CloudProjectSummary;
};

export default function StudioProjectCard({ project }: StudioProjectCardProps) {
  const updatedDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(project.updated_at));

  return (
    <Link
      href={`/studio/editor?project=${encodeURIComponent(project.id)}`}
      className="studio-dashboard-project-card"
      aria-label={`Open ${project.name}`}
    >
      <StudioCloudProjectPreview projectId={project.id} revision={project.revision} />

      <div className="studio-dashboard-project-info">
        <div className="studio-dashboard-project-title">
          <h3 title={project.name}>{project.name}</h3>

          <ArrowUpRight size={16} aria-hidden="true" />
        </div>

        <div className="studio-dashboard-project-date">
          <Clock3 size={12} aria-hidden="true" />

          <time dateTime={project.updated_at}>Edited {updatedDate}</time>
        </div>
      </div>
    </Link>
  );
}
