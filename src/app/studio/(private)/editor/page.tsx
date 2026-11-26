import StudioEditor from "@/components/studio/StudioEditor";
import { canvasPresets, type CanvasPreset } from "@/lib/studio/canvasPresets";
import "@/components/studio/dashboard/StudioDashboard.css";

type StudioEditorPageProps = {
  searchParams: Promise<{
    project?: string;
    preset?: string;
  }>;
};

export default async function StudioEditorPage({ searchParams }: StudioEditorPageProps) {
  const params = await searchParams;

  const projectId = typeof params.project === "string" ? params.project : undefined;

  const preset =
    typeof params.preset === "string" && Object.hasOwn(canvasPresets, params.preset)
      ? (params.preset as CanvasPreset)
      : undefined;

  return (
    <main className="studio-page min-w-0">
      <div className="studio-page-content">
        <StudioEditor
          requestedProjectId={projectId}
          requestedPreset={projectId ? undefined : preset}
        />
      </div>
    </main>
  );
}
