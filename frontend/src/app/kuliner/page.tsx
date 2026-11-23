"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Check, Clock, MapPin, UtensilsCrossed } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { PhotoSlot } from "@/components/PhotoSlot";
import {
  PortalDetailDialog,
  type PortalModalItem,
} from "@/components/PortalDetailDialog";
import { api } from "@/lib/api";
import type { FnbItem } from "@/lib/types";

const KATEGORI_TABS = [
  "Semua",
  "Restoran Keluarga",
  "Kafe & Minuman",
  "Tepi Pantai",
] as const;

export default function KulinerPage() {
  const [kulinerList, setKulinerList] = useState<FnbItem[]>([]);
  const [kategori, setKategori] =
    useState<(typeof KATEGORI_TABS)[number]>("Semua");
  const [selectedModal, setSelectedModal] = useState<PortalModalItem | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadKuliner = useCallback(() => {
    setLoading(true);
    setErrorMsg(null);
    return api
      .getKuliner()
      .then((data) => setKulinerList(data))
      .catch(() =>
        setErrorMsg("Gagal memuat daftar kuliner. Silakan muat ulang halaman.")
      )
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let active = true;
    api
      .getKuliner()
      .then((data) => {
        if (active) setKulinerList(data);
      })
      .catch(() => {
        if (active)
          setErrorMsg(
            "Gagal memuat daftar kuliner. Silakan muat ulang halaman."
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
    if (kategori === "Semua") return kulinerList;
    return kulinerList.filter((f) => f.kategori === kategori);
  }, [kategori, kulinerList]);

  return (
    <div className="flex min-h-full flex-col bg-white text-[#0F2347]">
      <Navbar />

      <main id="main-content" tabIndex={-1} className="flex-1">
        <section className="border-b border-[#DCE6F5] bg-[#F4F8FC] py-10">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#EBF5FF] px-3 py-1 text-xs font-bold text-[#0033A0]">
              <UtensilsCrossed className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Food &amp; Beverages Kawasan</span>
            </div>
            <h1
              className="mt-3 text-3xl font-bold tracking-tight text-[#0F2347] sm:text-4xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Kuliner &amp; Restoran Kawasan
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-[#475569] sm:text-base">
              Pilihan tempat makan cepat di dalam taman rekreasi hingga restoran
              keluarga tepi laut di sepanjang kawasan Jelajahin.
            </p>
          </div>
        </section>

        <section className="py-10">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div
              className="flex flex-nowrap items-center gap-2 overflow-x-auto pb-1"
              role="group"
              aria-label="Filter kategori kuliner"
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
                  onClick={loadKuliner}
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
                {filtered.map((fnb) => (
                  <article
                    key={fnb.id}
                    className="flex flex-col overflow-hidden rounded-2xl border border-[#DCE6F5] bg-white shadow-[0_6px_22px_rgba(0,51,160,0.06)]"
                  >
                    <div className="aspect-video w-full border-b border-[#DCE6F5]">
                      <PhotoSlot
                        src={fnb.gambar_url}
                        alt={fnb.nama}
                        label="Foto Restoran & Kuliner"
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-between p-6">
                      <div>
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="rounded-full bg-[#EBF5FF] px-3 py-1 text-xs font-bold text-[#0033A0]">
                            {fnb.kategori}
                          </span>
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold tabular-nums text-[#475569]">
                            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                            {fnb.jam_buka}
                          </span>
                        </div>
                        <h2
                          className="mt-3 text-xl font-bold text-[#0F2347]"
                          style={{ fontFamily: "var(--font-display)" }}
                        >
                          {fnb.nama}
                        </h2>
                        <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-[#475569]">
                          <MapPin
                            className="h-3.5 w-3.5 text-[#0033A0]"
                            aria-hidden="true"
                          />
                          <span>{fnb.area}</span>
                        </p>
                        <p className="mt-3 text-sm text-[#475569]">
                          <strong className="text-[#0F2347]">
                            Menu Andalan:
                          </strong>{" "}
                          {fnb.menu_andalan}
                        </p>
                        <p className="mt-1.5 text-xs font-semibold tabular-nums text-[#0033A0]">
                          Kisaran: {fnb.kisaran_harga}
                        </p>
                      </div>

                      <footer className="mt-5 border-t border-[#E6EEF8] pt-4">
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedModal({
                              badge: fnb.kategori,
                              title: fnb.nama,
                              meta: `${fnb.area} · ${fnb.jam_buka}`,
                              description: `Pilihan bersantap di area ${fnb.area} dengan menu favorit: ${fnb.menu_andalan}.`,
                              highlights: [
                                `Kisaran Harga: ${fnb.kisaran_harga}`,
                                `Jam Layanan: ${fnb.jam_buka}`,
                              ],
                              ctaLabel: "Cek Status Antrean Wahana",
                              ctaHref: "/wahana",
                              imageUrl: fnb.gambar_url,
                              photoLabel: "Foto Kuliner & F&B",
                            })
                          }
                          className="inline-flex min-h-[44px] w-full items-center justify-center rounded-full border border-[#0033A0] bg-white px-4 py-2 text-sm font-bold text-[#0033A0] transition-colors hover:bg-[#0033A0] hover:text-white"
                        >
                          Lihat Menu &amp; Lokasi
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
