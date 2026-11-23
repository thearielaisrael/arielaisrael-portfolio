import type { PointerEventHandler } from "react";
import { RotateCw } from "lucide-react";

type StudioRotationHandleProps = {
  scale: number;
  onPointerDown: PointerEventHandler<HTMLButtonElement>;
  onPointerMove: PointerEventHandler<HTMLButtonElement>;
  onPointerUp: PointerEventHandler<HTMLButtonElement>;
  onPointerCancel: PointerEventHandler<HTMLButtonElement>;
  onLostPointerCapture: PointerEventHandler<HTMLButtonElement>;
  onReset: () => void;
};

export default function StudioRotationHandle({
  scale,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
  onLostPointerCapture,
  onReset,
}: StudioRotationHandleProps) {
  return (
    <div
      data-studio-export-ignore="true"
      className="absolute left-1/2 z-50 overflow-visible"
      style={{
        top: 0,
        transform: "translate(-50%, -100%)",
        paddingBottom: 12,
      }}
    >
      <div
        className="absolute left-1/2 w-px bg-[#C42B70]"
        style={{
          top: 28,
          height: Math.max(4, 48 * scale - 28),
          transform: "translateX(-50%)",
        }}
      />

      <button
        type="button"
        aria-label="Rotate element"
        title="Drag to rotate. Hold Shift for 15° snapping. Double-click to reset."
        onClick={(event) => event.stopPropagation()}
        onDoubleClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          onReset();
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
        onLostPointerCapture={onLostPointerCapture}
        className="relative flex size-7 items-center justify-center rounded-full border-2 border-white bg-[#C42B70] text-white shadow-md hover:bg-[#A91F60]"
        style={{ touchAction: "none", cursor: "grab" }}
      >
        <RotateCw size={14} strokeWidth={2.2} />
      </button>
    </div>
  );
}
