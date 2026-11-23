"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { PhotoSlot } from "./PhotoSlot";

export interface PortalModalItem {
  badge: string;
  title: string;
  meta: string;
  description: string;
  highlights?: string[];
  paragraphs?: string[];
  ctaLabel?: string;
  ctaHref?: string;
  imageUrl?: string;
  photoLabel?: string;
}

export function PortalDetailDialog({
  item,
  onClose,
}: {
  item: PortalModalItem | null;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const pressedOutsideRef = useRef(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (item && !dialog.open) {
      dialog.showModal();
    } else if (!item && dialog.open) {
      dialog.close();
    }
  }, [item]);

  function isOutsideBounds(e: React.PointerEvent<HTMLDialogElement>) {
    const dialog = dialogRef.current;
    if (!dialog) return false;
    const r = dialog.getBoundingClientRect();
    return (
      e.clientX < r.left ||
      e.clientX > r.right ||
      e.clientY < r.top ||
      e.clientY > r.bottom
    );
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="portal-dialog-title"
      {...({ closedby: "any" } as Record<string, string>)}
      onClose={onClose}
      onPointerDown={(e) => {
        pressedOutsideRef.current = isOutsideBounds(e);
      }}
      onPointerUp={(e) => {
        if (pressedOutsideRef.current && isOutsideBounds(e)) {
          dialogRef.current?.close();
        }
        pressedOutsideRef.current = false;
      }}
      className="m-auto max-h-[90dvh] w-[min(94vw,640px)] overflow-y-auto rounded-2xl border border-[#DCE6F5] bg-white p-0 text-[#0F2347] shadow-2xl"
    >
      {item ? (
        <div>
          <div className="relative aspect-video w-full border-b border-[#DCE6F5]">
            <PhotoSlot
              src={item.imageUrl}
              alt={item.title}
              label={item.photoLabel || "Foto Area"}
            />
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              aria-label="Tutup jendela detail"
              className="absolute top-3 right-3 inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-[#DCE6F5] bg-white/95 text-[#0F2347] shadow-sm hover:bg-[#EBF5FF]"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          <div className="p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[#EBF5FF] px-3 py-1 text-xs font-bold text-[#0033A0]">
                {item.badge}
              </span>
              <span className="text-xs font-semibold text-[#475569]">
                {item.meta}
              </span>
            </div>

            <h2
              id="portal-dialog-title"
              className="mt-3 text-2xl font-bold text-[#0F2347]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {item.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#475569]">
              {item.description}
            </p>

            {item.paragraphs && item.paragraphs.length > 0 ? (
              <div className="mt-4 space-y-3 border-t border-[#E6EEF8] pt-4 text-sm leading-relaxed text-[#0F2347]">
                {item.paragraphs.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>
            ) : null}

            {item.highlights && item.highlights.length > 0 ? (
              <ul className="mt-4 space-y-1.5 rounded-xl border border-[#DCE6F5] bg-[#F4F8FC] p-4 text-xs font-medium text-[#0F2347]">
                {item.highlights.map((h, idx) => (
                  <li key={idx}>• {h}</li>
                ))}
              </ul>
            ) : null}

            <div className="mt-5 flex flex-wrap items-center gap-3">
              {item.ctaHref && item.ctaLabel ? (
                <Link
                  href={item.ctaHref}
                  onClick={() => dialogRef.current?.close()}
                  className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-[#0033A0] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#002678]"
                >
                  {item.ctaLabel}
                </Link>
              ) : null}
              <button
                type="button"
                onClick={() => dialogRef.current?.close()}
                className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-[#B9C8DC] px-5 py-2.5 text-sm font-semibold text-[#0F2347] hover:bg-[#F4F8FC]"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </dialog>
  );
}
