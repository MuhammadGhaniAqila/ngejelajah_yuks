"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { BookOpen, Check, Clock, Newspaper } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { PhotoSlot } from "@/components/PhotoSlot";
import {
  PortalDetailDialog,
  type PortalModalItem,
} from "@/components/PortalDetailDialog";
import { api } from "@/lib/api";
import type { BlogPost } from "@/lib/types";

const KATEGORI_TABS = [
  "Semua",
  "Panduan Kunjungan",
  "Tips Wahana",
  "Kuliner & Menginap",
] as const;

export default function BlogPage() {
  const [blogList, setBlogList] = useState<BlogPost[]>([]);
  const [kategori, setKategori] =
    useState<(typeof KATEGORI_TABS)[number]>("Semua");
  const [selectedModal, setSelectedModal] = useState<PortalModalItem | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadBlog = useCallback(() => {
    setLoading(true);
    setErrorMsg(null);
    return api
      .getBlog()
      .then((data) => setBlogList(data))
      .catch(() =>
        setErrorMsg("Gagal memuat artikel & panduan. Silakan muat ulang.")
      )
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let active = true;
    api
      .getBlog()
      .then((data) => {
        if (active) setBlogList(data);
      })
      .catch(() => {
        if (active)
          setErrorMsg("Gagal memuat artikel & panduan. Silakan muat ulang.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    if (kategori === "Semua") return blogList;
    return blogList.filter((b) => b.kategori === kategori);
  }, [kategori, blogList]);

  return (
    <div className="flex min-h-full flex-col bg-white text-[#0F2347]">
      <Navbar />

      <main id="main-content" tabIndex={-1} className="flex-1">
        <section className="border-b border-[#DCE6F5] bg-[#F4F8FC] py-10">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#EBF5FF] px-3 py-1 text-xs font-bold text-[#0033A0]">
              <Newspaper className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Artikel &amp; Tips Wisata</span>
            </div>
            <h1
              className="mt-3 text-3xl font-bold tracking-tight text-[#0F2347] sm:text-4xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Panduan &amp; Cerita Wisata Ancol
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-[#475569] sm:text-base">
              Tips mengatur jadwal antrean virtual, informasi batas tinggi
              wahana anak, hingga rekomendasi penginapan dan kuliner keluarga.
            </p>
          </div>
        </section>

        <section className="py-10">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div
              className="flex flex-nowrap items-center gap-2 overflow-x-auto pb-1"
              role="group"
              aria-label="Filter kategori artikel"
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
                  onClick={loadBlog}
                  className="rounded-full bg-[#0033A0] px-4 py-1.5 text-xs font-bold text-white"
                >
                  Muat Ulang
                </button>
              </div>
            ) : null}

            {loading ? (
              <div className="mt-7 grid gap-5 md:grid-cols-3">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="h-80 animate-pulse rounded-2xl border border-[#DCE6F5] bg-[#F4F8FC]"
                  />
                ))}
              </div>
            ) : (
              <div className="mt-7 grid gap-5 md:grid-cols-3">
                {filtered.map((post) => (
                  <article
                    key={post.id}
                    className="flex flex-col overflow-hidden rounded-2xl border border-[#DCE6F5] bg-white shadow-[0_6px_22px_rgba(0,51,160,0.06)]"
                  >
                    <div className="aspect-video w-full border-b border-[#DCE6F5]">
                      <PhotoSlot
                        src={post.gambar_url}
                        alt={post.judul}
                        label="Foto Sampul Artikel"
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-between p-6">
                      <div>
                        <div className="flex items-center justify-between gap-2 text-xs font-semibold text-[#475569]">
                          <span className="rounded-full bg-[#EBF5FF] px-3 py-1 font-bold text-[#0033A0]">
                            {post.kategori}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                            {post.waktu_baca}
                          </span>
                        </div>
                        <h2
                          className="mt-3 text-lg font-bold leading-snug text-[#0F2347]"
                          style={{ fontFamily: "var(--font-display)" }}
                        >
                          {post.judul}
                        </h2>
                        <p className="mt-2 text-sm leading-relaxed text-[#475569]">
                          {post.ringkasan}
                        </p>
                      </div>

                      <footer className="mt-5 flex items-center justify-between border-t border-[#E6EEF8] pt-4">
                        <span className="text-xs font-medium text-[#475569]">
                          {post.tanggal}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedModal({
                              badge: post.kategori,
                              title: post.judul,
                              meta: `${post.tanggal} · ${post.waktu_baca}`,
                              description: post.ringkasan,
                              paragraphs: post.isi,
                              ctaLabel: "Mulai Rencanakan Kunjungan",
                              ctaHref: "/pesan",
                              imageUrl: post.gambar_url,
                              photoLabel: "Foto Artikel",
                            })
                          }
                          className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full border border-[#0033A0] bg-white px-4 py-1.5 text-xs font-bold text-[#0033A0] hover:bg-[#0033A0] hover:text-white"
                        >
                          <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>Baca Artikel</span>
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
