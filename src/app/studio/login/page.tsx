import Link from "next/link";
import StudioLoginForm from "./StudioLoginForm";

export const metadata = {
  title: "Studio Sign In",
  robots: { index: false, follow: false },
};

export default function StudioLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FFF5FA] px-5 py-12">
      <section className="w-full max-w-md rounded-3xl border border-pink-100 bg-white p-8 shadow-xl shadow-pink-100/50 sm:p-10">
        <div className="mb-8 text-center">
          <p className="mb-3 text-xs font-semibold tracking-[0.25em] text-[#C42B70] uppercase">
            Private Workspace
          </p>
          <h1 className="text-3xl font-semibold text-[#51283D]">Social Design Studio</h1>
          <p className="mt-3 text-sm text-[#86687A]">Sign in to access your creative workspace.</p>
        </div>

        <StudioLoginForm />

        <div className="mt-8 text-center">
          <Link href="/" className="text-sm text-[#C42B70] hover:underline">
            Return to portfolio
          </Link>
        </div>
      </section>
    </main>
  );
}
