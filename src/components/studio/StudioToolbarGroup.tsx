"use client";

import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";

type StudioToolbarGroupProps = {
  label: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
};

export default function StudioToolbarGroup({
  label,
  open,
  onToggle,
  children,
}: StudioToolbarGroupProps) {
  return (
    <div className="studio-toolbar-group">
      <button
        type="button"
        aria-expanded={open}
        onClick={onToggle}
        className="studio-control studio-button studio-toolbar-trigger"
      >
        <span>{label}</span>

        <ChevronDown size={14} strokeWidth={1.8} className={open ? "rotate-180" : ""} />
      </button>

      <div className="studio-toolbar-popover" hidden={!open}>
        {children}
      </div>
    </div>
  );
}
