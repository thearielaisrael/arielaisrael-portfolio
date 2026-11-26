"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireStudioUser } from "@/lib/studio/auth";

export async function signOutOfStudio() {
  await requireStudioUser();

  const supabase = await createClient();
  await supabase.auth.signOut();

  redirect("/studio/login");
}
