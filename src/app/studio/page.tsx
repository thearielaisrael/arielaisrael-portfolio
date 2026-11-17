import StudioEditor from "../../components/studio/StudioEditor";

export default function StudioPage() {
  return (
    <main className="min-h-screen px-4 py-8">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-8">
          <p className="mb-2 text-xs font-bold tracking-widest text-[#C42B70] uppercase">
            Creative Workspace
          </p>

          <h1 className="text-3xl font-extrabold">Social Design Studio</h1>

          <p className="mt-2 text-sm opacity-70">
            Your private workspace for creating branded graphics.
          </p>
        </div>

        <StudioEditor />
      </div>
    </main>
  );
}
