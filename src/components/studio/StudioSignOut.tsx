import { LogOut } from "lucide-react";
import { signOutOfStudio } from "@/app/studio/(private)/actions";

export default function StudioSignOut() {
  return (
    <form action={signOutOfStudio}>
      <button
        type="submit"
        className="inline-flex items-center gap-2 rounded-xl border border-pink-200 bg-white px-4 py-2 text-sm font-medium text-[#C42B70] hover:bg-pink-50"
      >
        <LogOut size={16} />
        Sign Out
      </button>
    </form>
  );
}
