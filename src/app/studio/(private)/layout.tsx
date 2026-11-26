import type { ReactNode } from "react";
import { requireStudioUser } from "@/lib/studio/auth";
import StudioSignOut from "@/components/studio/StudioSignOut";

export const dynamic = "force-dynamic";

export default async function StudioLayout({ children }: { children: ReactNode }) {
  await requireStudioUser();

  return (
    <div data-studio-private className="studio-app-shell">
      <header className="studio-app-header">
        <div className="min-w-0">
          <p className="text-accent text-[10px] font-bold tracking-widest uppercase">
            Creative Workspace
          </p>

          <h1 className="font-heading text-sm font-extrabold sm:text-base">Social Design Studio</h1>
        </div>

        <div className="shrink-0">
          <StudioSignOut />
        </div>
      </header>

      {children}
    </div>
  );
}
