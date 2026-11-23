import "server-only";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function requireStudioUser() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/studio/login");
  }

  const allowedUserId = process.env.STUDIO_ALLOWED_USER_ID;

  if (!allowedUserId || data.claims.sub !== allowedUserId) {
    redirect("/studio/unauthorized");
  }

  return data.claims;
}
