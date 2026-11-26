"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type StudioLoginState = {
  error: string | null;
};

export async function signInToStudio(
  _previousState: StudioLoginState,
  formData: FormData,
): Promise<StudioLoginState> {
  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof email !== "string" || typeof password !== "string" || !email.trim() || !password) {
    return { error: "Enter your email address and password." };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error || !data.user) {
    return { error: "Unable to sign in. Check your credentials." };
  }

  if (!process.env.STUDIO_ALLOWED_USER_ID || data.user.id !== process.env.STUDIO_ALLOWED_USER_ID) {
    await supabase.auth.signOut();
    return { error: "This account is not authorized for the Studio." };
  }

  redirect("/studio");
}
