"use client";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  deleting: boolean;
}

export default function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  deleting,
}: DeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-[60] flex items-center justify-center p-4">
      <div className="bg-surface-container-lowest rounded-xl techno-shadow w-full max-w-sm animate-slide-in">
        <div className="p-6 text-center">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-error-container flex items-center justify-center">
            <span className="material-symbols-outlined text-error text-[28px]">
              delete_forever
            </span>
          </div>
          <h3 className="text-[20px] leading-[28px] font-bold mb-2">
            Delete Product?
          </h3>
          <p className="text-[14px] leading-[20px] text-on-surface-variant">
            This action cannot be undone. The product will be permanently removed
            from your inventory.
          </p>
        </div>
        <div className="flex gap-3 px-6 pb-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-lg border border-outline-variant text-on-surface-variant font-bold text-sm hover:bg-surface-container-high transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="flex-1 px-4 py-2.5 bg-error text-on-error font-bold text-sm rounded-lg hover:bg-error/90 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {deleting && (
              <span className="material-symbols-outlined animate-spin text-sm">
                progress_activity
              </span>
            )}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
