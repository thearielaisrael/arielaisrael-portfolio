import StudioTemplates from "@/components/studio/dashboard/StudioTemplates";

import "@/components/studio/dashboard/StudioDashboard.css";
import "@/components/studio/dashboard/StudioProjects.css";
import "@/components/studio/dashboard/StudioTemplates.css";

type StudioTemplatesPageProps = {
  searchParams: Promise<{
    template?: string;
  }>;
};

export default async function StudioTemplatesPage({ searchParams }: StudioTemplatesPageProps) {
  const params = await searchParams;

  const templateId = typeof params.template === "string" ? params.template : undefined;

  return <StudioTemplates key={templateId ?? "all"} initialTemplateId={templateId} />;
}
