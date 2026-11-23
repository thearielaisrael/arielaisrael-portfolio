import Link from "next/link";

export const metadata = {
  title: "Studio Access Restricted",
  robots: { index: false, follow: false },
};

export default function StudioUnauthorizedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FFF5FA] px-5">
      <div className="max-w-md text-center">
        <h1 className="text-3xl font-semibold text-[#51283D]">Access Restricted</h1>
        <p className="mt-4 text-[#86687A]">
          This workspace is private. Your account does not have permission to access it.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-xl bg-[#ED3F98] px-6 py-3 font-medium text-white"
        >
          Return to Portfolio
        </Link>
      </div>
    </main>
  );
}
