import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { StudioProject } from "@/lib/studio/types";
import { createId } from "@/lib/studio/createId";

export const dynamic = "force-dynamic";

async function authorizedClient() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  const userId = data?.claims?.sub;

  if (
    error ||
    !userId ||
    !process.env.STUDIO_ALLOWED_USER_ID ||
    userId !== process.env.STUDIO_ALLOWED_USER_ID
  ) {
    return null;
  }

  return { supabase, userId };
}

export async function GET() {
  const auth = await authorizedClient();

  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await auth.supabase
    .from("studio_projects")
    .select(
      `
  id,
  name,
  revision,
  updated_at,
  created_at,
  folder_id,
  is_favorite,
  document
`,
    )
    .eq("owner_id", auth.userId)
    .order("updated_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "Could not load projects." }, { status: 500 });
  }

  const projects = (data ?? []).map((record) => {
    const { document, ...summary } = record;

    return {
      ...summary,
      canvas_preset: document?.canvasPreset,
      slide_count: Array.isArray(document?.slides) ? document.slides.length : 0,
    };
  });

  return NextResponse.json(
    { projects },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}

export async function POST(request: Request) {
  const auth = await authorizedClient();

  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let project: StudioProject;

  try {
    project = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  if (
    !project ||
    typeof project !== "object" ||
    typeof project.name !== "string" ||
    !project.name.trim() ||
    project.name.length > 200 ||
    !Array.isArray(project.slides) ||
    project.slides.length === 0 ||
    typeof project.activeSlideId !== "string" ||
    !project.slides.some((slide) => slide.id === project.activeSlideId)
  ) {
    return NextResponse.json({ error: "Invalid Studio project." }, { status: 400 });
  }

  const id = createId();

  const cloudProject = {
    ...project,
    id,
  };

  const { data, error } = await auth.supabase
    .from("studio_projects")
    .insert({
      id,
      owner_id: auth.userId,
      name: cloudProject.name.trim(),
      document: cloudProject,
    })
    .select("id, revision")
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Could not create cloud project." }, { status: 500 });
  }

  return NextResponse.json({ id: data.id, revision: data.revision }, { status: 201 });
}
