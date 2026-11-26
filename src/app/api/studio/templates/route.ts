import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { canvasPresets } from "@/lib/studio/canvasPresets";

export const dynamic = "force-dynamic";

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

export async function GET() {
  const auth = await authorize();

  if (!auth) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { data, error } = await auth.supabase
    .from("studio_templates")
    .select(
      `
      id,
      name,
      description,
      category,
      is_favorite,
      created_at,
      updated_at,
      document
    `,
    )
    .eq("owner_id", auth.userId)
    .order("updated_at", {
      ascending: false,
    });

  if (error) {
    console.error("Studio template listing failed:", error);

    return NextResponse.json({ error: "Could not load templates." }, { status: 500 });
  }

  const templates = (data ?? []).map((record) => {
    const { document, ...summary } = record;

    return {
      ...summary,

      canvas_preset: document?.canvasPreset,

      slide_count: Array.isArray(document?.slides) ? document.slides.length : 0,
    };
  });

  return NextResponse.json(
    { templates },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}

export async function POST(request: Request) {
  const auth = await authorize();

  if (!auth) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let body: Record<string, unknown>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Invalid template request." }, { status: 400 });
  }

  const projectId = body.projectId;

  const expectedRevision = body.expectedRevision;

  const name = typeof body.name === "string" ? body.name.trim() : "";

  const description = typeof body.description === "string" ? body.description.trim() : "";

  const category = typeof body.category === "string" ? body.category.trim() : "";

  if (typeof projectId !== "string" || !UUID_PATTERN.test(projectId)) {
    return NextResponse.json({ error: "Invalid source project." }, { status: 400 });
  }

  if (
    typeof expectedRevision !== "number" ||
    !Number.isInteger(expectedRevision) ||
    expectedRevision < 0
  ) {
    return NextResponse.json({ error: "Invalid project revision." }, { status: 400 });
  }

  if (!name || name.length > 200 || description.length > 1000 || category.length > 100) {
    return NextResponse.json({ error: "Invalid template details." }, { status: 400 });
  }

  // Read the authoritative saved project.

  const { data: source, error: sourceError } = await auth.supabase
    .from("studio_projects")
    .select("id, revision, document")
    .eq("id", projectId)
    .eq("owner_id", auth.userId)
    .maybeSingle();

  if (sourceError) {
    return NextResponse.json({ error: "Could not load source project." }, { status: 500 });
  }

  if (!source) {
    return NextResponse.json({ error: "Source project not found." }, { status: 404 });
  }

  if (source.revision !== expectedRevision) {
    return NextResponse.json(
      {
        error: "This project changed. Refresh the " + "library before creating a template.",
      },
      { status: 409 },
    );
  }

  const document = source.document;

  if (
    !document ||
    document.id !== source.id ||
    typeof document.canvasPreset !== "string" ||
    !Object.hasOwn(canvasPresets, document.canvasPreset) ||
    !Array.isArray(document.slides) ||
    document.slides.length === 0 ||
    !document.slides.some((slide: { id: string }) => slide.id === document.activeSlideId)
  ) {
    return NextResponse.json({ error: "Invalid source design." }, { status: 400 });
  }

  // Preserve an independent design snapshot.

  const { data: template, error: createError } = await auth.supabase
    .from("studio_templates")
    .insert({
      owner_id: auth.userId,
      name,
      description,
      category,

      document: {
        ...document,
        name,
      },
    })
    .select(
      `
      id,
      name,
      description,
      category,
      is_favorite,
      created_at,
      updated_at
    `,
    )
    .single();

  if (createError || !template) {
    console.error("Studio template creation failed:", createError);

    return NextResponse.json({ error: "Could not create template." }, { status: 500 });
  }

  return NextResponse.json(
    {
      template: {
        ...template,
        canvas_preset: document.canvasPreset,
        slide_count: document.slides.length,
      },
    },
    { status: 201 },
  );
}
