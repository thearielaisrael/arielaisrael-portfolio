"use client";

import type { StudioGradient } from "@/lib/studio/types";

type StudioGradientEditorProps = {
  gradient: StudioGradient;
  onChange: (gradient: StudioGradient) => void;
  disabled?: boolean;
};

export default function StudioGradientEditor({
  gradient,
  onChange,
  disabled = false,
}: StudioGradientEditorProps) {
  function updateGradient(changes: Partial<StudioGradient>) {
    onChange({ ...gradient, ...changes });
  }

  function updateStop(stopId: string, changes: Partial<StudioGradient["stops"][number]>) {
    updateGradient({
      stops: gradient.stops.map((stop) => (stop.id === stopId ? { ...stop, ...changes } : stop)),
    });
  }

  function addStop() {
    const sorted = [...gradient.stops].sort((a, b) => a.position - b.position);

    let position = 50;
    let color = "#FFFFFF";
    let largestGap = -1;

    for (let i = 0; i < sorted.length - 1; i++) {
      const left = sorted[i];
      const right = sorted[i + 1];
      const gap = right.position - left.position;

      if (gap > largestGap) {
        largestGap = gap;
        position = Math.round((left.position + right.position) / 2);
        color = left.color;
      }
    }

    updateGradient({
      stops: [...gradient.stops, { id: crypto.randomUUID(), color, position }],
    });
  }

  function removeStop(stopId: string) {
    if (gradient.stops.length <= 2) return;

    updateGradient({
      stops: gradient.stops.filter((stop) => stop.id !== stopId),
    });
  }

  return (
    <div className="space-y-4">
      <label className="block space-y-2 text-sm">
        <span>Gradient Type</span>
        <select
          value={gradient.type}
          disabled={disabled}
          onChange={(event) =>
            updateGradient({
              type: event.target.value as "linear" | "radial",
            })
          }
          className="studio-field w-full"
        >
          <option value="linear">Linear</option>
          <option value="radial">Radial</option>
        </select>
      </label>

      {gradient.type === "linear" && (
        <label className="block space-y-2 text-sm">
          <span>Angle: {gradient.angle}°</span>
          <input
            type="range"
            min={0}
            max={360}
            step={1}
            value={gradient.angle}
            disabled={disabled}
            onChange={(event) => updateGradient({ angle: Number(event.target.value) })}
            className="w-full accent-pink-500"
          />
        </label>
      )}

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h4 className="text-sm font-semibold">Color Stops</h4>
          <button
            type="button"
            disabled={disabled}
            onClick={addStop}
            className="studio-control text-xs"
          >
            + Add Stop
          </button>
        </div>

        {[...gradient.stops]
          .sort((a, b) => a.position - b.position)
          .map((stop, index) => (
            <div
              key={stop.id}
              className="space-y-2 rounded-lg border p-3"
              style={{ borderColor: "var(--color-border)" }}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold">Stop {index + 1}</span>
                <button
                  type="button"
                  disabled={disabled || gradient.stops.length <= 2}
                  onClick={() => removeStop(stop.id)}
                  className="studio-control text-xs disabled:opacity-40"
                >
                  Remove
                </button>
              </div>

              <label className="flex items-center justify-between gap-3 text-sm">
                <span>Color</span>
                <input
                  type="color"
                  value={stop.color}
                  disabled={disabled}
                  onChange={(event) => updateStop(stop.id, { color: event.target.value })}
                  aria-label={`Color for stop ${index + 1}`}
                  className="studio-color-swatch h-8 w-8 shrink-0 cursor-pointer rounded-full border-0 bg-transparent p-0 disabled:cursor-not-allowed disabled:opacity-40"
                />
              </label>

              <label className="block space-y-2 text-sm">
                <span>Position: {stop.position}%</span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={stop.position}
                  disabled={disabled}
                  onChange={(event) =>
                    updateStop(stop.id, {
                      position: Number(event.target.value),
                    })
                  }
                  className="w-full accent-pink-500"
                />
              </label>
            </div>
          ))}
      </div>

      <label className="block space-y-2 text-sm">
        <span>Opacity: {gradient.opacity}%</span>
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={gradient.opacity}
          disabled={disabled}
          onChange={(event) => updateGradient({ opacity: Number(event.target.value) })}
          className="w-full accent-pink-500"
        />
      </label>
    </div>
  );
}
