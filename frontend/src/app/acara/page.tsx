"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Calendar, Check, Clock, MapPin, Sparkles } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { PhotoSlot } from "@/components/PhotoSlot";
import {
  PortalDetailDialog,
  type PortalModalItem,
} from "@/components/PortalDetailDialog";
import { api } from "@/lib/api";
import type { AcaraItem } from "@/lib/types";

const KATEGORI_TABS = ["Semua", "Parade", "Musik", "Pertunjukan"] as const;

export default function AcaraPage() {
  const [acaraList, setAcaraList] = useState<AcaraItem[]>([]);
  const [kategori, setKategori] =
    useState<(typeof KATEGORI_TABS)[number]>("Semua");
  const [selectedModal, setSelectedModal] = useState<PortalModalItem | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadAcara = useCallback(() => {
    setLoading(true);
    setErrorMsg(null);
    return api
      .getAcara()
      .then((data) => setAcaraList(data))
      .catch(() =>
        setErrorMsg("Gagal memuat jadwal acara. Silakan muat ulang halaman.")
      )
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let active = true;
    api
      .getAcara()
      .then((data) => {
        if (active) setAcaraList(data);
      })
      .catch(() => {
        if (active)
          setErrorMsg("Gagal memuat jadwal acara. Silakan muat ulang halaman.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    if (kategori === "Semua") return acaraList;
    return acaraList.filter((a) => a.kategori === kategori);
  }, [kategori, acaraList]);

  return (
    <div className="flex min-h-full flex-col bg-white text-[#0F2347]">
      <Navbar />

      <main id="main-content" tabIndex={-1} className="flex-1">
        <section className="border-b border-[#DCE6F5] bg-[#F4F8FC] py-10">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#EBF5FF] px-3 py-1 text-xs font-bold text-[#0033A0]">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Agenda Hiburan Kawasan</span>
            </div>
            <h1
              className="mt-3 text-3xl font-bold tracking-tight text-[#0F2347] sm:text-4xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Acara &amp; Pertunjukan Ancol
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-[#475569] sm:text-base">
              Saksikan parade keliling dunia, musik tepi pantai, hingga panggung
              ilusi sembari menunggu giliran kloter antrean virtual Anda.
            </p>
          </div>
        </section>

        <section className="py-10">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div
              className="flex flex-nowrap items-center gap-2 overflow-x-auto pb-1"
              role="group"
              aria-label="Filter kategori acara"
            >
              {KATEGORI_TABS.map((opt) => {
                const active = kategori === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setKategori(opt)}
                    aria-pressed={active}
                    className={`inline-flex min-h-[42px] shrink-0 items-center gap-1.5 rounded-full border-2 px-4 py-2 text-xs font-bold transition-colors ${
                      active
                        ? "border-[#0033A0] bg-[#0033A0] text-white"
                        : "border-[#DCE6F5] bg-white text-[#475569] hover:border-[#0033A0] hover:text-[#0033A0]"
                    }`}
                  >
                    {active ? (
                      <Check className="h-3.5 w-3.5" aria-hidden="true" />
                    ) : null}
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>

            {errorMsg ? (
              <div
                role="alert"
                className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#FCA5A5] bg-[#FEE2E2] p-4 text-sm font-semibold text-[#7F1D1D]"
              >
                <span>{errorMsg}</span>
                <button
                  type="button"
                  onClick={loadAcara}
                  className="rounded-full bg-[#0033A0] px-4 py-1.5 text-xs font-bold text-white"
                >
                  Muat Ulang
                </button>
              </div>
            ) : null}

            {loading ? (
              <div className="mt-7 grid gap-5 md:grid-cols-2">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-80 animate-pulse rounded-2xl border border-[#DCE6F5] bg-[#F4F8FC]"
                  />
                ))}
              </div>
            ) : (
              <div className="mt-7 grid gap-5 md:grid-cols-2">
                {filtered.map((acara) => (
                  <article
                    key={acara.id}
                    className="flex flex-col overflow-hidden rounded-2xl border border-[#DCE6F5] bg-white shadow-[0_6px_22px_rgba(0,51,160,0.06)]"
                  >
                    <div className="aspect-video w-full border-b border-[#DCE6F5]">
                      <PhotoSlot
                        src={acara.gambar_url}
                        alt={acara.judul}
                        label="Foto Panggung & Parade"
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-between p-6">
                      <div>
                        <span className="rounded-full bg-[#EBF5FF] px-3 py-1 text-xs font-bold text-[#0033A0]">
                          {acara.kategori}
                        </span>
                        <h2
                          className="mt-3 text-xl font-bold text-[#0F2347]"
                          style={{ fontFamily: "var(--font-display)" }}
                        >
                          {acara.judul}
                        </h2>
                        <p className="mt-2 text-sm leading-relaxed text-[#475569]">
                          {acara.ringkasan}
                        </p>

                        <dl className="mt-4 space-y-1.5 text-xs font-semibold text-[#475569]">
                          <div className="flex items-center gap-2">
                            <Calendar
                              className="h-3.5 w-3.5 text-[#0033A0]"
                              aria-hidden="true"
                            />
                            <span>{acara.jadwal}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock
                              className="h-3.5 w-3.5 text-[#0033A0]"
                              aria-hidden="true"
                            />
                            <span>{acara.jam}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin
                              className="h-3.5 w-3.5 text-[#0033A0]"
                              aria-hidden="true"
                            />
                            <span>{acara.lokasi}</span>
                          </div>
                        </dl>
                      </div>

                      <footer className="mt-5 border-t border-[#E6EEF8] pt-4">
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedModal({
                              badge: acara.kategori,
                              title: acara.judul,
                              meta: `${acara.jadwal} · ${acara.jam}`,
                              description: acara.ringkasan,
                              highlights: [
                                `Lokasi: ${acara.lokasi}`,
                                `Jam Tampil: ${acara.jam}`,
                                "Dapat dinikmati sembari menunggu giliran antrean virtual wahana.",
                              ],
                              ctaLabel: "Pesan Tiket Masuk Dufan",
                              ctaHref: "/pesan",
                              imageUrl: acara.gambar_url,
                              photoLabel: "Foto Acara",
                            })
                          }
                          className="inline-flex min-h-[44px] w-full items-center justify-center rounded-full border border-[#0033A0] bg-white px-4 py-2 text-sm font-bold text-[#0033A0] transition-colors hover:bg-[#0033A0] hover:text-white"
                        >
                          Lihat Detail Acara
                        </button>
                      </footer>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />

      <PortalDetailDialog
        item={selectedModal}
        onClose={() => setSelectedModal(null)}
      />
    </div>
  );
}
