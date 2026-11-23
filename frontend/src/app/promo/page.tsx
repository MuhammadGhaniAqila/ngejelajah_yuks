"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Calendar, Check, Tag, Ticket } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { PhotoSlot } from "@/components/PhotoSlot";
import {
  PortalDetailDialog,
  type PortalModalItem,
} from "@/components/PortalDetailDialog";
import { api } from "@/lib/api";
import type { PromoItem } from "@/lib/types";

const KATEGORI_TABS = [
  "Semua",
  "Bundling",
  "Tiket Hemat",
  "Member & Pelajar",
] as const;

export default function PromoPage() {
  const [promoList, setPromoList] = useState<PromoItem[]>([]);
  const [kategori, setKategori] =
    useState<(typeof KATEGORI_TABS)[number]>("Semua");
  const [selectedModal, setSelectedModal] = useState<PortalModalItem | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadPromo = useCallback(() => {
    setLoading(true);
    setErrorMsg(null);
    return api
      .getPromo()
      .then((data) => setPromoList(data))
      .catch(() =>
        setErrorMsg("Gagal memuat daftar promo. Silakan muat ulang halaman.")
      )
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let active = true;
    api
      .getPromo()
      .then((data) => {
        if (active) setPromoList(data);
      })
      .catch(() => {
        if (active)
          setErrorMsg("Gagal memuat daftar promo. Silakan muat ulang halaman.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    if (kategori === "Semua") return promoList;
    return promoList.filter((p) => p.kategori === kategori);
  }, [kategori, promoList]);

  return (
    <div className="flex min-h-full flex-col bg-white text-[#0F2347]">
      <Navbar />

      <main id="main-content" tabIndex={-1} className="flex-1">
        <section className="border-b border-[#DCE6F5] bg-[#F4F8FC] py-10">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#FFF6D6] px-3 py-1 text-xs font-bold text-[#8F6400]">
              <Ticket className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Promo Resmi Ancol &amp; Dufan</span>
            </div>
            <h1
              className="mt-3 text-3xl font-bold tracking-tight text-[#0F2347] sm:text-4xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Promo &amp; Penawaran Spesial
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-[#475569] sm:text-base">
              Pilih promo potongan tiket masuk, paket rombongan, hingga bundling
              antrean prioritas sebelum menentukan tanggal kunjungan Anda.
            </p>
          </div>
        </section>

        <section className="py-10">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div
              className="flex flex-nowrap items-center gap-2 overflow-x-auto pb-1"
              role="group"
              aria-label="Filter kategori promo"
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
                  onClick={loadPromo}
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
                {filtered.map((promo) => (
                  <article
                    key={promo.id}
                    className="flex flex-col overflow-hidden rounded-2xl border border-[#DCE6F5] bg-white shadow-[0_6px_22px_rgba(0,51,160,0.06)]"
                  >
                    <div className="aspect-[16/9] w-full border-b border-[#DCE6F5]">
                      <PhotoSlot
                        src={promo.gambar_url}
                        alt={promo.judul}
                        label="Foto Banner Promo"
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-between p-6">
                      <div>
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="rounded-full bg-[#FFB800] px-3 py-1 text-xs font-bold text-[#0F2347]">
                            {promo.diskon_badge}
                          </span>
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#475569]">
                            <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                            {promo.periode}
                          </span>
                        </div>

                        <h2
                          className="mt-4 text-xl font-bold text-[#0F2347]"
                          style={{ fontFamily: "var(--font-display)" }}
                        >
                          {promo.judul}
                        </h2>
                        <p className="mt-2 text-sm leading-relaxed text-[#475569]">
                          {promo.ringkasan}
                        </p>
                        <p className="mt-2.5 text-xs text-[#475569]">
                          <strong className="text-[#0F2347]">Ketentuan:</strong>{" "}
                          {promo.ketentuan}
                        </p>
                      </div>

                      <div className="ticket-divider mt-5 flex flex-wrap items-center justify-between gap-3 pt-4">
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#EBF5FF] px-3 py-1.5 text-xs font-bold tabular-nums text-[#0033A0]">
                          <Tag className="h-3.5 w-3.5" aria-hidden="true" />
                          Kode: {promo.kode_promo}
                        </span>
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedModal({
                                badge: promo.kategori,
                                title: promo.judul,
                                meta: `${promo.diskon_badge} · ${promo.periode}`,
                                description: promo.ringkasan,
                                highlights: [
                                  `Kode Promo: ${promo.kode_promo}`,
                                  `Ketentuan: ${promo.ketentuan}`,
                                ],
                                ctaLabel: "Gunakan & Pesan Tiket",
                                ctaHref: "/pesan",
                                imageUrl: promo.gambar_url,
                                photoLabel: "Foto Banner Promo",
                              })
                            }
                            className="inline-flex min-h-[40px] items-center rounded-full border border-[#0033A0] bg-white px-4 py-1.5 text-xs font-bold text-[#0033A0] hover:bg-[#0033A0] hover:text-white"
                          >
                            Detail Promo
                          </button>
                          <Link
                            href="/pesan"
                            className="inline-flex min-h-[40px] items-center rounded-full bg-[#0033A0] px-4 py-1.5 text-xs font-bold text-white hover:bg-[#002678]"
                          >
                            Pesan Tiket
                          </Link>
                        </div>
                      </div>
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
