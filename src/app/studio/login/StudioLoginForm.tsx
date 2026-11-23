"use client";

import { useActionState } from "react";
import { LockKeyhole, LoaderCircle } from "lucide-react";
import { signInToStudio, type StudioLoginState } from "./actions";

const initialState: StudioLoginState = { error: null };

export default function StudioLoginForm() {
  const [state, formAction, pending] = useActionState(signInToStudio, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-2">
        <label htmlFor="studio-email" className="block text-sm font-medium text-[#63334D]">
          Email address
        </label>
        <input
          id="studio-email"
          name="email"
          type="email"
          autoComplete="username"
          required
          className="w-full rounded-xl border border-pink-200 bg-white px-4 py-3 text-[#51283D] outline-none focus:border-[#ED3F98]"
          placeholder="you@example.com"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="studio-password" className="block text-sm font-medium text-[#63334D]">
          Password
        </label>
        <input
          id="studio-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="w-full rounded-xl border border-pink-200 bg-white px-4 py-3 text-[#51283D] outline-none focus:border-[#ED3F98]"
          placeholder="Enter your password"
        />
      </div>

      {state.error && (
        <p role="alert" className="text-sm text-red-600">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#ED3F98] px-5 py-3 font-semibold text-white transition hover:bg-[#C42B70] disabled:opacity-60"
      >
        {pending ? <LoaderCircle className="animate-spin" size={18} /> : <LockKeyhole size={18} />}
        {pending ? "Signing in..." : "Enter Studio"}
      </button>
    </form>
  );
}
