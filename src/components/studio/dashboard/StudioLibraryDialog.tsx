"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { X } from "lucide-react";

type StudioLibraryDialogProps = {
  title: string;
  description?: string;
  busy?: boolean;
  onClose: () => void;
  children: ReactNode;
};

export default function StudioLibraryDialog({
  title,
  description,
  busy = false,
  onClose,
  children,
}: StudioLibraryDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (dialog && !dialog.open) {
      dialog.showModal();
    }

    return () => {
      if (dialog?.open) {
        dialog.close();
      }
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className="studio-library-dialog"
      aria-labelledby="studio-library-dialog-title"
      onCancel={(event) => {
        event.preventDefault();

        if (!busy) {
          onClose();
        }
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget && !busy) {
          onClose();
        }
      }}
    >
      <div className="studio-library-dialog-inner">
        <header className="studio-library-dialog-header">
          <div>
            <h2 id="studio-library-dialog-title">{title}</h2>

            {description && <p>{description}</p>}
          </div>

          <button
            type="button"
            className="studio-dashboard-icon-button"
            aria-label="Close dialog"
            disabled={busy}
            onClick={onClose}
          >
            <X size={19} />
          </button>
        </header>

        {children}
      </div>
    </dialog>
  );
}
