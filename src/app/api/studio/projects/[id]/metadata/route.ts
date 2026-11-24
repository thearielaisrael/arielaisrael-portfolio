import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type Context = {
  params: Promise<{ id: string }>;
};

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function PATCH(request: Request, context: Context) {
  const supabase = await createClient();

  const { data: authData, error: authError } = await supabase.auth.getClaims();

  const userId = authData?.claims?.sub;

  if (
    authError ||
    !userId ||
    !process.env.STUDIO_ALLOWED_USER_ID ||
    userId !== process.env.STUDIO_ALLOWED_USER_ID
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  if (!UUID_PATTERN.test(id)) {
    return NextResponse.json({ error: "Invalid project ID." }, { status: 400 });
  }

  let body: Record<string, unknown>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Invalid metadata." }, { status: 400 });
  }

  const updates: {
    folder_id?: string | null;
    is_favorite?: boolean;
  } = {};

  if ("is_favorite" in body) {
    if (typeof body.is_favorite !== "boolean") {
      return NextResponse.json({ error: "Invalid favorite value." }, { status: 400 });
    }

    updates.is_favorite = body.is_favorite;
  }

  if ("folder_id" in body) {
    if (
      body.folder_id !== null &&
      (typeof body.folder_id !== "string" || !UUID_PATTERN.test(body.folder_id))
    ) {
      return NextResponse.json({ error: "Invalid folder ID." }, { status: 400 });
    }

    if (typeof body.folder_id === "string") {
      const { data: folder, error: folderError } = await supabase
        .from("studio_folders")
        .select("id")
        .eq("id", body.folder_id)
        .eq("owner_id", userId)
        .maybeSingle();

      if (folderError) {
        return NextResponse.json({ error: "Could not verify folder." }, { status: 500 });
      }

      if (!folder) {
        return NextResponse.json({ error: "Folder not found." }, { status: 404 });
      }
    }

    updates.folder_id = body.folder_id;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No supported metadata was provided." }, { status: 400 });
  }

  const { data, error } = await supabase.rpc("update_studio_project_metadata", {
    p_id: id,
    p_updates: updates,
  });

  if (error) {
    console.error("Studio project metadata update failed:", error);

    if (error.message.includes("STUDIO_PROJECT_NOT_FOUND")) {
      return NextResponse.json({ error: "Project not found." }, { status: 404 });
    }

    if (error.message.includes("STUDIO_FOLDER_NOT_FOUND")) {
      return NextResponse.json({ error: "Folder not found." }, { status: 404 });
    }

    if (error.message.includes("STUDIO_UNAUTHORIZED")) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    if (error.message.includes("STUDIO_INVALID")) {
      return NextResponse.json({ error: "Invalid project metadata." }, { status: 400 });
    }

    return NextResponse.json(
      {
        error: "Could not update project metadata.",
      },
      { status: 500 },
    );
  }

  if (!data) {
    return NextResponse.json({ error: "Project not found." }, { status: 404 });
  }

  return NextResponse.json(
    { project: data },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
