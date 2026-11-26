import { studioGradientPresets, studioGradientToCSS } from "@/lib/studio/gradientPresets";

import type { StudioGradient } from "@/lib/studio/types";

type StudioGradientPresetsProps = {
  onSelect: (gradient: StudioGradient) => void;
  disabled?: boolean;
  selectedGradient?: StudioGradient;
};

export default function StudioGradientPresets({
  onSelect,
  disabled = false,
  selectedGradient,
}: StudioGradientPresetsProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold">Gradient Presets</h3>

      <div className="grid grid-cols-2 gap-2">
        {studioGradientPresets.map((preset) => (
          <button
            key={preset.id}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(structuredClone(preset.gradient))}
            className="group space-y-1.5 text-left disabled:cursor-not-allowed disabled:opacity-40"
            title={preset.name}
          >
            <div
              className="h-12 w-full rounded-lg border transition-transform group-hover:scale-[1.02]"
              style={{
                background: studioGradientToCSS(preset.gradient),
                borderColor:
                  selectedGradient &&
                  JSON.stringify(selectedGradient) === JSON.stringify(preset.gradient)
                    ? "var(--color-signature-aura-pink)"
                    : "var(--color-border)",
              }}
            />

            <span className="block min-h-7 text-[11px] leading-tight">{preset.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
