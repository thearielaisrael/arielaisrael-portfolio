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

export async function PATCH(request: Request, context: Context) {
  const auth = await authorize();

  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  if (!UUID_PATTERN.test(id)) {
    return NextResponse.json({ error: "Invalid folder ID." }, { status: 400 });
  }

  let body: { name?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const name = typeof body?.name === "string" ? body.name.trim() : "";

  if (!name || name.length > 100) {
    return NextResponse.json({ error: "Enter a valid folder name." }, { status: 400 });
  }

  const { data, error } = await auth.supabase
    .from("studio_folders")
    .update({
      name,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("owner_id", auth.userId)
    .select("id, name, created_at, updated_at")
    .maybeSingle();

  if (error?.code === "23505") {
    return NextResponse.json({ error: "A folder with that name already exists." }, { status: 409 });
  }

  if (error) {
    return NextResponse.json({ error: "Could not rename folder." }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: "Folder not found." }, { status: 404 });
  }

  return NextResponse.json({ folder: data });
}

export async function DELETE(_request: Request, context: Context) {
  const auth = await authorize();

  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  if (!UUID_PATTERN.test(id)) {
    return NextResponse.json({ error: "Invalid folder ID." }, { status: 400 });
  }

  const { data, error } = await auth.supabase
    .from("studio_folders")
    .delete()
    .eq("id", id)
    .eq("owner_id", auth.userId)
    .select("id")
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: "Could not delete folder." }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: "Folder not found." }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    id,
  });
}
