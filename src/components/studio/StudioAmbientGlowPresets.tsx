"use client";

import { studioAmbientGlowPresets } from "@/lib/studio/ambientGlowPresets";
import type { StudioAmbientGlowPreset } from "@/lib/studio/types";
import StudioGlowSources from "./StudioGlowSources";

type StudioAmbientGlowPresetsProps = {
  onSelect: (presetId: string) => void;
};

function PresetCard({
  preset,
  onSelect,
}: {
  preset: StudioAmbientGlowPreset;
  onSelect: (presetId: string) => void;
}) {
  const isDark = preset.id === "pink-informatics-night";

  return (
    <button
      type="button"
      onClick={() => onSelect(preset.id)}
      title={preset.description}
      className="group space-y-1.5 text-left"
    >
      <div
        className="relative h-20 w-full overflow-hidden rounded-lg border transition-transform group-hover:scale-[1.02]"
        style={{
          backgroundColor: isDark ? "#160D1A" : "#FFF7FA",
          borderColor: "var(--color-border)",
          isolation: "isolate",
        }}
      >
        <StudioGlowSources
          sources={preset.sources}
          originalSources={preset.sources}
          presetId={preset.id}
          opacity={100}
          intensity={50}
          scale={100}
        />
      </div>

      <span className="block min-h-7 text-[11px] leading-tight">{preset.name}</span>
    </button>
  );
}

export default function StudioAmbientGlowPresets({ onSelect }: StudioAmbientGlowPresetsProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold">Ambient Glow Presets</h3>

      <div className="grid grid-cols-2 gap-2">
        {studioAmbientGlowPresets.map((preset) => (
          <PresetCard key={preset.id} preset={preset} onSelect={onSelect} />
        ))}
      </div>
    </div>
  );
}
