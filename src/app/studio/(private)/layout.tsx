import type { ReactNode } from "react";
import { requireStudioUser } from "@/lib/studio/auth";
import StudioSignOut from "@/components/studio/StudioSignOut";

export const dynamic = "force-dynamic";

export default async function StudioLayout({ children }: { children: ReactNode }) {
  await requireStudioUser();

  return (
    <>
      <div className="flex justify-end border-b border-pink-100 bg-white px-5 py-2">
        <StudioSignOut />
      </div>
      {children}
    </>
  );
}
