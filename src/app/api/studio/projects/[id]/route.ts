import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { StudioProject } from "@/lib/studio/types";

export const dynamic = "force-dynamic";

type Context = {
  params: Promise<{ id: string }>;
};

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function authorize() {
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

export async function GET(_request: Request, context: Context) {
  const auth = await authorize();

  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  if (!UUID_PATTERN.test(id)) {
    return NextResponse.json({ error: "Invalid project ID" }, { status: 400 });
  }

  const { data, error } = await auth.supabase
    .from("studio_projects")
    .select("id, name, document, revision, updated_at")
    .eq("id", id)
    .eq("owner_id", auth.userId)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: "Could not load project" }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  return NextResponse.json({ project: data }, { headers: { "Cache-Control": "no-store" } });
}

export async function PATCH(request: Request, context: Context) {
  const auth = await authorize();

  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  if (!UUID_PATTERN.test(id)) {
    return NextResponse.json({ error: "Invalid project ID" }, { status: 400 });
  }

  let body: {
    project?: StudioProject;
    expectedRevision?: number;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const project = body?.project;
  const revision = body?.expectedRevision;

  if (
    !project ||
    typeof project !== "object" ||
    project.id !== id ||
    typeof project.name !== "string" ||
    !project.name.trim() ||
    project.name.length > 200 ||
    !Array.isArray(project.slides) ||
    project.slides.length === 0 ||
    typeof project.activeSlideId !== "string" ||
    !project.slides.some((slide) => slide.id === project.activeSlideId) ||
    !Number.isSafeInteger(revision) ||
    revision === undefined ||
    revision < 1
  ) {
    return NextResponse.json({ error: "Invalid project or revision" }, { status: 400 });
  }

  const { data, error } = await auth.supabase.rpc("save_studio_project", {
    p_id: id,
    p_name: project.name.trim(),
    p_document: project,
    p_expected_revision: revision,
  });

  if (error) {
    if (error.message.includes("STUDIO_REVISION_CONFLICT")) {
      return NextResponse.json(
        {
          error: "A newer cloud revision exists. Your local edits were not overwritten.",
          code: "REVISION_CONFLICT",
        },
        { status: 409 },
      );
    }

    console.error("Studio cloud update failed:", error);

    return NextResponse.json({ error: "Could not save project" }, { status: 500 });
  }

  return NextResponse.json({ id, revision: Number(data) });
}


export async function DELETE(_request: Request, context: Context) {
  const auth = await authorize();

  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  if (!UUID_PATTERN.test(id)) {
    return NextResponse.json({ error: "Invalid project ID" }, { status: 400 });
  }

  const { data, error } = await auth.supabase
    .from("studio_projects")
    .delete()
    .eq("id", id)
    .eq("owner_id", auth.userId)
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("Studio cloud delete failed:", error);

    return NextResponse.json({ error: "Could not delete cloud project." }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: "Cloud project not found." }, { status: 404 });
  }

  return NextResponse.json({ success: true, id });
}
