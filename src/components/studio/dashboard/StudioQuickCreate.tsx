import Link from "next/link";
import { canvasPresets, type CanvasPreset } from "@/lib/studio/canvasPresets";

export default function StudioQuickCreate() {
  const presets = Object.entries(canvasPresets) as [
    CanvasPreset,
    (typeof canvasPresets)[CanvasPreset],
  ][];

  return (
    <section aria-labelledby="studio-quick-create-heading">
      <div className="studio-dashboard-section-heading">
        <div>
          <h2 id="studio-quick-create-heading">Start creating</h2>

          <p>Choose a format for your next design.</p>
        </div>
      </div>

      <div className="studio-quick-create-grid">
        {presets.map(([key, preset]) => {
          const scale = 36 / Math.max(preset.width, preset.height);

          return (
            <Link
              key={key}
              href={`/studio/editor?preset=${key}`}
              className="studio-quick-create-card"
            >
              <div className="studio-preset-icon" aria-hidden="true">
                <div
                  className="studio-preset-outline"
                  style={{
                    width: preset.width * scale,
                    height: preset.height * scale,
                  }}
                />
              </div>

              <div className="studio-preset-info">
                <strong>{preset.label}</strong>

                <span>
                  {preset.width} × {preset.height}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
