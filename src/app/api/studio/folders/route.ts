import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

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
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await auth.supabase
    .from("studio_folders")
    .select("id, name, created_at, updated_at")
    .eq("owner_id", auth.userId)
    .order("name", { ascending: true });

  if (error) {
    return NextResponse.json({ error: "Could not load folders." }, { status: 500 });
  }

  return NextResponse.json(
    { folders: data ?? [] },
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
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
    .insert({
      owner_id: auth.userId,
      name,
    })
    .select("id, name, created_at, updated_at")
    .single();

  if (error?.code === "23505") {
    return NextResponse.json({ error: "A folder with that name already exists." }, { status: 409 });
  }

  if (error || !data) {
    return NextResponse.json({ error: "Could not create folder." }, { status: 500 });
  }

  return NextResponse.json({ folder: data }, { status: 201 });
}
