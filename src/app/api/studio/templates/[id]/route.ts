import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await context.params;

  if (!UUID_PATTERN.test(id)) {
    return NextResponse.json({ error: "Invalid template ID." }, { status: 400 });
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
    .eq("id", id)
    .eq("owner_id", auth.userId)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: "Could not load template." }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: "Template not found." }, { status: 404 });
  }

  return NextResponse.json(
    {
      template: {
        ...data,
        canvas_preset: data.document?.canvasPreset,
        slide_count: Array.isArray(data.document?.slides) ? data.document.slides.length : 0,
      },
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}

export async function PATCH(request: Request, context: Context) {
  const auth = await authorize();

  if (!auth) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await context.params;

  if (!UUID_PATTERN.test(id)) {
    return NextResponse.json({ error: "Invalid template ID." }, { status: 400 });
  }

  let body: Record<string, unknown>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Invalid template update." }, { status: 400 });
  }

  const updates: {
    name?: string;
    description?: string;
    category?: string;
    is_favorite?: boolean;
    updated_at?: string;
  } = {};

  if ("name" in body) {
    if (typeof body.name !== "string" || !body.name.trim() || body.name.trim().length > 200) {
      return NextResponse.json({ error: "Invalid template name." }, { status: 400 });
    }

    updates.name = body.name.trim();
  }

  if ("description" in body) {
    if (typeof body.description !== "string" || body.description.trim().length > 1000) {
      return NextResponse.json({ error: "Invalid description." }, { status: 400 });
    }

    updates.description = body.description.trim();
  }

  if ("category" in body) {
    if (typeof body.category !== "string" || body.category.trim().length > 100) {
      return NextResponse.json({ error: "Invalid category." }, { status: 400 });
    }

    updates.category = body.category.trim();
  }

  if ("is_favorite" in body) {
    if (typeof body.is_favorite !== "boolean") {
      return NextResponse.json({ error: "Invalid favorite value." }, { status: 400 });
    }

    updates.is_favorite = body.is_favorite;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No supported changes provided." }, { status: 400 });
  }

  // Favoriting alone does not change modification time.

  if ("name" in updates || "description" in updates || "category" in updates) {
    updates.updated_at = new Date().toISOString();
  }

  const { data, error } = await auth.supabase
    .from("studio_templates")
    .update(updates)
    .eq("id", id)
    .eq("owner_id", auth.userId)
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
    .maybeSingle();

  if (error) {
    console.error("Studio template update failed:", error);

    return NextResponse.json({ error: "Could not update template." }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: "Template not found." }, { status: 404 });
  }

  return NextResponse.json({
    template: data,
  });
}

export async function DELETE(_request: Request, context: Context) {
  const auth = await authorize();

  if (!auth) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await context.params;

  if (!UUID_PATTERN.test(id)) {
    return NextResponse.json({ error: "Invalid template ID." }, { status: 400 });
  }

  const { data, error } = await auth.supabase
    .from("studio_templates")
    .delete()
    .eq("id", id)
    .eq("owner_id", auth.userId)
    .select("id")
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: "Could not delete template." }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: "Template not found." }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    id,
  });
}


export async function POST(request: Request, context: Context) {
  const auth = await authorize();

  if (!auth) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await context.params;

  if (!UUID_PATTERN.test(id)) {
    return NextResponse.json({ error: "Invalid template ID." }, { status: 400 });
  }

  let body: { name?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const name = typeof body?.name === "string" ? body.name.trim() : "";

  if (!name || name.length > 200) {
    return NextResponse.json({ error: "Enter a valid template name." }, { status: 400 });
  }

  const { data: source, error: sourceError } = await auth.supabase
    .from("studio_templates")
    .select("document, description, category")
    .eq("id", id)
    .eq("owner_id", auth.userId)
    .maybeSingle();

  if (sourceError) {
    return NextResponse.json({ error: "Could not load source template." }, { status: 500 });
  }

  if (!source) {
    return NextResponse.json({ error: "Template not found." }, { status: 404 });
  }

  const { data, error } = await auth.supabase
    .from("studio_templates")
    .insert({
      owner_id: auth.userId,
      name,
      description: source.description,
      category: source.category,
      is_favorite: false,
      document: {
        ...source.document,
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

  if (error || !data) {
    console.error("Studio template duplication failed:", error);

    return NextResponse.json({ error: "Could not duplicate template." }, { status: 500 });
  }

  return NextResponse.json(
    {
      template: {
        ...data,
        canvas_preset: source.document.canvasPreset,
        slide_count: source.document.slides.length,
      },
    },
    { status: 201 },
  );
}
