"use client";

import { brandColors, brandColor, type BrandColorToken } from "../../lib/studio/brandColors";

type BrandColorPickerProps = {
  label: string;
  value: BrandColorToken;
  onChange: (color: BrandColorToken) => void;
  disabled?: boolean;
};

export default function BrandColorPicker({
  label,
  value,
  onChange,
  disabled,
}: BrandColorPickerProps) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold">{label}</p>

      <div className="space-y-4 pr-2">
        {brandColors.map((group) => (
          <div key={group.group}>
            <p className="mb-2 text-xs font-medium opacity-65">{group.group}</p>

            <div className="grid grid-cols-6 gap-2 pl-2">
              {group.colors.map(([name, token]) => {
                const selected = value === token;

                return (
                  <button
                    key={token}
                    type="button"
                    title={name}
                    aria-label={`${name} color`}
                    aria-pressed={selected}
                    disabled={disabled}
                    onClick={() => onChange(token)}
                    className="aspect-square cursor-pointer rounded-full border-2 border-black/10 transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
                    style={{
                      backgroundColor: brandColor(token),
                      outline: selected ? "2px solid var(--color-accent)" : "none",
                      outlineOffset: "2px",
                    }}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
