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
      className="studio-rotation-control absolute left-1/2 z-50 overflow-visible"
      style={{
        top: 0,
        transform: "translate(-50%, -100%)",
        paddingBottom: 12,
      }}
    >
      <div
        className="studio-rotation-stem"
        style={{
          height: Math.max(4, 48 * scale - 28),
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
        className="studio-rotation-handle"
      >
        <span className="studio-rotation-symbol">
          <RotateCw size={14} strokeWidth={2.2} />
        </span>
      </button>
    </div>
  );
}
