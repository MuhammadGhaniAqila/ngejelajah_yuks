"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Clock, Ruler, Ticket, Users, X } from "lucide-react";
import { api, ApiError, useAuthToken } from "@/lib/api";
import type { AntreanVirtual, Wahana } from "@/lib/types";
import { PhotoSlot } from "./PhotoSlot";
import { CrowdBadge, LampuBadge } from "./StatusBadges";

interface RideDetailDialogProps {
  wahana: Wahana | null;
  onClose: () => void;
  onQueueCreated?: (antrean: AntreanVirtual) => void;
}

function RideDetailInner({
  wahana,
  onRequestClose,
  onQueueCreated,
}: {
  wahana: Wahana;
  onRequestClose: () => void;
  onQueueCreated?: (antrean: AntreanVirtual) => void;
}) {
  const token = useAuthToken();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [createdQueue, setCreatedQueue] = useState<AntreanVirtual | null>(null);

  async function handleTakeQueue() {
    setLoading(true);
    setErrorMsg(null);
    try {
      const antrean = await api.ambilAntrean(wahana.id);
      setCreatedQueue(antrean);
      onQueueCreated?.(antrean);
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("Gagal mengambil antrean virtual. Coba lagi sebentar.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="relative aspect-video w-full border-b border-[#DCE6F5]">
        <PhotoSlot
          src={wahana.gambar_url}
          alt={`Foto wahana ${wahana.nama_wahana}`}
          label={`Foto Wahana ${wahana.nama_wahana}`}
        />
        <button
          type="button"
          onClick={onRequestClose}
          aria-label="Tutup detail wahana"
          className="absolute top-3 right-3 inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-[#DCE6F5] bg-white/95 text-[#0F2347] shadow-sm hover:bg-[#EBF5FF]"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <div className="p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-[#EBF5FF] px-3 py-1 text-xs font-bold text-[#0033A0]">
            Zona {wahana.zona}
          </span>
          <LampuBadge status={wahana.status_lampu} />
          <CrowdBadge crowd={wahana.crowd_meter} />
        </div>

        <h2
          id="ride-dialog-title"
          className="mt-3 text-2xl font-bold tracking-tight text-[#0F2347] sm:text-3xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {wahana.nama_wahana}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[#475569]">
          {wahana.deskripsi}
        </p>

        <dl className="mt-5 grid grid-cols-2 gap-3 rounded-2xl border border-[#DCE6F5] bg-[#F4F8FC] p-4 text-sm">
          <div className="flex items-start gap-2.5">
            <Ruler
              className="mt-0.5 h-4 w-4 shrink-0 text-[#0033A0]"
              aria-hidden="true"
            />
            <div>
              <dt className="text-xs font-medium text-[#475569]">
                Tinggi Minimal
              </dt>
              <dd className="font-bold tabular-nums text-[#0F2347]">
                {wahana.tinggi_minimal_cm > 0
                  ? `${wahana.tinggi_minimal_cm} cm`
                  : "Semua tinggi"}
              </dd>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <Users
              className="mt-0.5 h-4 w-4 shrink-0 text-[#0033A0]"
              aria-hidden="true"
            />
            <div>
              <dt className="text-xs font-medium text-[#475569]">
                Kapasitas Kloter
              </dt>
              <dd className="font-bold tabular-nums text-[#0F2347]">
                {wahana.kapasitas_kloter} kursi
              </dd>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <Clock
              className="mt-0.5 h-4 w-4 shrink-0 text-[#0033A0]"
              aria-hidden="true"
            />
            <div>
              <dt className="text-xs font-medium text-[#475569]">
                Durasi Main
              </dt>
              <dd className="font-bold tabular-nums text-[#0F2347]">
                {wahana.durasi_menit} menit
              </dd>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <Ticket
              className="mt-0.5 h-4 w-4 shrink-0 text-[#0033A0]"
              aria-hidden="true"
            />
            <div>
              <dt className="text-xs font-medium text-[#475569]">
                Kloter Berjalan
              </dt>
              <dd className="font-bold tabular-nums text-[#0F2347]">
                Kloter {wahana.kloter_berjalan}
                {typeof wahana.jumlah_antrean_aktif === "number"
                  ? ` (${wahana.jumlah_antrean_aktif} mengantre)`
                  : ""}
              </dd>
            </div>
          </div>
        </dl>

        <div className="mt-5">
          {createdQueue ? (
            <div
              role="status"
              className="rounded-2xl border border-[#86EFAC] bg-[#DCFCE7] p-4 text-[#14532D]"
            >
              <p className="text-xs font-bold uppercase tracking-wider">
                Antrean Virtual Berhasil Diambil
              </p>
              <div className="mt-2 flex items-baseline justify-between gap-4">
                <span className="text-2xl font-bold tabular-nums">
                  {createdQueue.nomor_antrean}
                </span>
                <span className="text-sm font-semibold">
                  Kloter {createdQueue.nomor_kloter} · Estimasi{" "}
                  {createdQueue.estimasi_tunggu_menit} menit
                </span>
              </div>
              <div className="mt-3">
                <Link
                  href="/tiket-saya"
                  onClick={onRequestClose}
                  className="inline-flex min-h-[44px] items-center rounded-full bg-[#0033A0] px-5 py-2 text-sm font-bold text-white"
                >
                  Lihat di Tiket &amp; Antrean Saya
                </Link>
              </div>
            </div>
          ) : (
            <>
              {errorMsg ? (
                <div
                  role="alert"
                  className="mb-3 rounded-xl border border-[#FCA5A5] bg-[#FEE2E2] px-4 py-3 text-sm font-semibold text-[#7F1D1D]"
                >
                  {errorMsg}
                </div>
              ) : null}

              {!token ? (
                <div className="flex flex-col gap-3 rounded-2xl border border-[#CBE2FF] bg-[#EBF5FF] p-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-[#0F2347]">
                    Masuk akun terlebih dahulu untuk mengambil slot antrean
                    virtual wahana ini.
                  </p>
                  <Link
                    href="/masuk"
                    onClick={onRequestClose}
                    className="inline-flex min-h-[44px] shrink-0 items-center justify-center rounded-full bg-[#0033A0] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#002678]"
                  >
                    Masuk Akun
                  </Link>
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    disabled={loading || wahana.status_lampu === "Maintenance"}
                    onClick={handleTakeQueue}
                    className="inline-flex min-h-[48px] flex-1 items-center justify-center rounded-full bg-[#0033A0] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#002678] disabled:bg-[#E2EAF4] disabled:text-[#475569]"
                  >
                    {wahana.status_lampu === "Maintenance"
                      ? "Wahana Sedang Maintenance"
                      : loading
                        ? "Memproses Antrean..."
                        : "Ambil Antrean Virtual"}
                  </button>
                  <button
                    type="button"
                    onClick={onRequestClose}
                    className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-[#B9C8DC] px-5 py-3 text-sm font-semibold text-[#0F2347] hover:bg-[#F4F8FC]"
                  >
                    Tutup
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export function RideDetailDialog({
  wahana,
  onClose,
  onQueueCreated,
}: RideDetailDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const pressedOutsideRef = useRef(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (wahana && !dialog.open) {
      dialog.showModal();
    } else if (!wahana && dialog.open) {
      dialog.close();
    }
  }, [wahana]);

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
      aria-labelledby="ride-dialog-title"
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
      className="m-auto max-h-[90dvh] w-[min(94vw,620px)] overflow-y-auto rounded-2xl border border-[#DCE6F5] bg-white p-0 text-[#0F2347] shadow-2xl"
    >
      {wahana ? (
        <RideDetailInner
          key={wahana.id}
          wahana={wahana}
          onRequestClose={() => dialogRef.current?.close()}
          onQueueCreated={onQueueCreated}
        />
      ) : null}
    </dialog>
  );
}
