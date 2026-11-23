"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Building2, Check, MapPin, Sparkles } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { PhotoSlot } from "@/components/PhotoSlot";
import {
  PortalDetailDialog,
  type PortalModalItem,
} from "@/components/PortalDetailDialog";
import { api } from "@/lib/api";
import type { VenueItem } from "@/lib/types";

const KATEGORI_TABS = ["Semua", "Hotel", "Resort", "Venue Acara"] as const;

export default function VenuePage() {
  const [venueList, setVenueList] = useState<VenueItem[]>([]);
  const [kategori, setKategori] =
    useState<(typeof KATEGORI_TABS)[number]>("Semua");
  const [selectedModal, setSelectedModal] = useState<PortalModalItem | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadVenue = useCallback(() => {
    setLoading(true);
    setErrorMsg(null);
    return api
      .getVenue()
      .then((data) => setVenueList(data))
      .catch(() =>
        setErrorMsg("Gagal memuat daftar resort & venue. Silakan muat ulang.")
      )
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let active = true;
    api
      .getVenue()
      .then((data) => {
        if (active) setVenueList(data);
      })
      .catch(() => {
        if (active)
          setErrorMsg(
            "Gagal memuat daftar resort & venue. Silakan muat ulang."
          );
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    if (kategori === "Semua") return venueList;
    return venueList.filter((v) => v.kategori === kategori);
  }, [kategori, venueList]);

  return (
    <div className="flex min-h-full flex-col bg-white text-[#0F2347]">
      <Navbar />

      <main id="main-content" tabIndex={-1} className="flex-1">
        <section className="border-b border-[#DCE6F5] bg-[#F4F8FC] py-10">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#EBF5FF] px-3 py-1 text-xs font-bold text-[#0033A0]">
              <Building2 className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Akomodasi &amp; Lokasi Gathering</span>
            </div>
            <h1
              className="mt-3 text-3xl font-bold tracking-tight text-[#0F2347] sm:text-4xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Resort, Hotel &amp; Venue Kawasan
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-[#475569] sm:text-base">
              Pilihan penginapan tepi laut dekat gerbang taman wisata serta
              ruang terbuka hijau untuk acara keluarga dan rombongan.
            </p>
          </div>
        </section>

        <section className="py-10">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div
              className="flex flex-nowrap items-center gap-2 overflow-x-auto pb-1"
              role="group"
              aria-label="Filter kategori venue"
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
                  onClick={loadVenue}
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
                {filtered.map((venue) => (
                  <article
                    key={venue.id}
                    className="flex flex-col overflow-hidden rounded-2xl border border-[#DCE6F5] bg-white shadow-[0_6px_22px_rgba(0,51,160,0.06)]"
                  >
                    <div className="aspect-video w-full border-b border-[#DCE6F5]">
                      <PhotoSlot
                        src={venue.gambar_url}
                        alt={venue.nama}
                        label="Foto Resort & Hotel"
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-between p-6">
                      <div>
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="rounded-full bg-[#EBF5FF] px-3 py-1 text-xs font-bold text-[#0033A0]">
                            {venue.kategori}
                          </span>
                          <span className="text-xs font-bold tabular-nums text-[#0033A0]">
                            {venue.harga_mulai}
                          </span>
                        </div>
                        <h2
                          className="mt-3 text-xl font-bold text-[#0F2347]"
                          style={{ fontFamily: "var(--font-display)" }}
                        >
                          {venue.nama}
                        </h2>
                        <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-[#475569]">
                          <MapPin
                            className="h-3.5 w-3.5 text-[#0033A0]"
                            aria-hidden="true"
                          />
                          <span>{venue.area}</span>
                        </p>
                        <p className="mt-3 text-sm leading-relaxed text-[#475569]">
                          {venue.ringkasan}
                        </p>
                        <p className="mt-2.5 flex items-start gap-1.5 text-xs text-[#475569]">
                          <Sparkles
                            className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#0033A0]"
                            aria-hidden="true"
                          />
                          <span>{venue.fasilitas}</span>
                        </p>
                      </div>

                      <footer className="mt-5 border-t border-[#E6EEF8] pt-4">
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedModal({
                              badge: venue.kategori,
                              title: venue.nama,
                              meta: `${venue.area} · ${venue.harga_mulai}`,
                              description: venue.ringkasan,
                              highlights: [
                                `Tarif: ${venue.harga_mulai}`,
                                `Fasilitas Utama: ${venue.fasilitas}`,
                              ],
                              ctaLabel: "Pesan Tiket Taman Rekreasi",
                              ctaHref: "/pesan",
                              imageUrl: venue.gambar_url,
                              photoLabel: "Foto Resort & Venue",
                            })
                          }
                          className="inline-flex min-h-[44px] w-full items-center justify-center rounded-full border border-[#0033A0] bg-white px-4 py-2 text-sm font-bold text-[#0033A0] transition-colors hover:bg-[#0033A0] hover:text-white"
                        >
                          Detail Venue &amp; Fasilitas
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
