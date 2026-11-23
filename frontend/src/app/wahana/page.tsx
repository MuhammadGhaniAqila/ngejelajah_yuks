"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Ruler, Search, SlidersHorizontal } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { PhotoSlot } from "@/components/PhotoSlot";
import { RideDetailDialog } from "@/components/RideDetailDialog";
import { CrowdBadge, LampuBadge } from "@/components/StatusBadges";
import { api } from "@/lib/api";
import type { Wahana } from "@/lib/types";

const ZONA_OPTIONS = ["Semua", "Ekstrem", "Keluarga", "Air"] as const;
const CROWD_OPTIONS = ["Semua", "Sepi", "Sedang", "Padat"] as const;
const HEIGHT_PRESETS = [
  { label: "Semua Tinggi", value: "" },
  { label: "Anak 100 cm", value: "100" },
  { label: "Anak 115 cm", value: "115" },
  { label: "Remaja 125 cm", value: "125" },
  { label: "Dewasa 140 cm+", value: "140" },
];

type ZonaOption = (typeof ZONA_OPTIONS)[number];

function WahanaInner({
  initialQuery,
  initialZona,
}: {
  initialQuery: string;
  initialZona: ZonaOption;
}) {
  const [wahanaList, setWahanaList] = useState<Wahana[]>([]);
  const [query, setQuery] = useState(initialQuery);
  const [zona, setZona] = useState<ZonaOption>(initialZona);
  const [crowd, setCrowd] = useState<(typeof CROWD_OPTIONS)[number]>("Semua");
  const [tinggiInput, setTinggiInput] = useState("");
  const [selectedWahana, setSelectedWahana] = useState<Wahana | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  function handleRefresh() {
    setLoading(true);
    setErrorMsg(null);
    api
      .getWahana()
      .then((data) => setWahanaList(data))
      .catch(() =>
        setErrorMsg("Gagal memuat daftar wahana. Silakan muat ulang halaman.")
      )
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    let active = true;
    api
      .getWahana()
      .then((data) => {
        if (active) setWahanaList(data);
      })
      .catch(() => {
        if (active) {
          setErrorMsg("Gagal memuat daftar wahana. Silakan muat ulang halaman.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const parsedHeight = useMemo(() => {
    const num = Number.parseInt(tinggiInput, 10);
    return Number.isFinite(num) && num > 0 ? num : null;
  }, [tinggiInput]);

  const filteredList = useMemo(() => {
    const q = query.trim().toLowerCase();
    return wahanaList.filter((item) => {
      if (zona !== "Semua" && item.zona !== zona) return false;
      if (crowd !== "Semua" && item.crowd_meter !== crowd) return false;
      if (q && !item.nama_wahana.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [wahanaList, zona, crowd, query]);

  return (
    <div className="flex min-h-full flex-col bg-white text-[#0F2347]">
      <Navbar />

      <main id="main-content" tabIndex={-1} className="flex-1">
        <section className="border-b border-[#DCE6F5] bg-[#F4F8FC] py-9">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h1
              className="text-3xl font-bold tracking-tight text-[#0033A0] sm:text-4xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Katalog Wahana &amp; Filter Tinggi Badan
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#475569] sm:text-base">
              Saring wahana Dufan berdasarkan zona, kepadatan antrean saat ini,
              atau masukkan tinggi badan pengunjung untuk memastikan wahana
              aman dinaiki.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <search>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="rounded-2xl border border-[#DCE6F5] bg-[#F4F8FC] p-4 sm:p-5"
            >
              <div className="grid gap-4 md:grid-cols-12">
                <div className="md:col-span-5">
                  <label
                    htmlFor="cari-wahana"
                    className="block text-xs font-bold text-[#0F2347]"
                  >
                    Cari Nama Wahana
                  </label>
                  <div className="relative mt-1.5">
                    <Search
                      className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#475569]"
                      aria-hidden="true"
                    />
                    <input
                      id="cari-wahana"
                      type="search"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Contoh: Halilintar, Bianglala..."
                      className="min-h-[44px] w-full rounded-xl border border-[#B9C8DC] bg-white py-2 pr-3 pl-9 text-sm text-[#0F2347] placeholder:text-[#5B6B82]"
                    />
                  </div>
                </div>

                <div className="md:col-span-4">
                  <label
                    htmlFor="tinggi-pengunjung"
                    className="block text-xs font-bold text-[#0F2347]"
                  >
                    Tinggi Badan Pengunjung (cm)
                  </label>
                  <div className="mt-1.5 flex gap-2">
                    <input
                      id="tinggi-pengunjung"
                      type="text"
                      inputMode="numeric"
                      value={tinggiInput}
                      onChange={(e) =>
                        setTinggiInput(e.target.value.replace(/\D/g, ""))
                      }
                      placeholder="Misal: 115"
                      className="min-h-[44px] w-full rounded-xl border border-[#B9C8DC] bg-white px-3 py-2 text-sm tabular-nums text-[#0F2347] placeholder:text-[#5B6B82]"
                    />
                    <select
                      aria-label="Pilih patokan tinggi badan"
                      value={tinggiInput}
                      onChange={(e) => setTinggiInput(e.target.value)}
                      className="min-h-[44px] rounded-xl border border-[#B9C8DC] bg-white px-2.5 text-xs font-semibold text-[#0F2347]"
                    >
                      {HEIGHT_PRESETS.map((preset) => (
                        <option key={preset.label} value={preset.value}>
                          {preset.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="md:col-span-3">
                  <label
                    htmlFor="filter-crowd"
                    className="block text-xs font-bold text-[#0F2347]"
                  >
                    Tingkat Keramaian
                  </label>
                  <select
                    id="filter-crowd"
                    value={crowd}
                    onChange={(e) =>
                      setCrowd(e.target.value as (typeof CROWD_OPTIONS)[number])
                    }
                    className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#B9C8DC] bg-white px-3 py-2 text-sm font-medium text-[#0F2347]"
                  >
                    {CROWD_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt === "Semua" ? "Semua Keramaian" : opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#DCE6F5] pt-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#475569]">
                    <SlidersHorizontal
                      className="h-3.5 w-3.5"
                      aria-hidden="true"
                    />
                    Zona:
                  </span>
                  {ZONA_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setZona(opt)}
                      aria-pressed={zona === opt}
                      className={`inline-flex min-h-[40px] items-center rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors ${
                        zona === opt
                          ? "bg-[#0033A0] text-white"
                          : "border border-[#DCE6F5] bg-white text-[#475569] hover:border-[#0033A0] hover:text-[#0033A0]"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleRefresh}
                  className="inline-flex min-h-[40px] items-center rounded-full border border-[#0033A0] bg-white px-4 py-1.5 text-xs font-bold text-[#0033A0] hover:bg-[#0033A0] hover:text-white"
                >
                  Segarkan Status Live
                </button>
              </div>
            </form>
          </search>

          {errorMsg ? (
            <div
              role="alert"
              className="mt-6 rounded-xl border border-[#FCA5A5] bg-[#FEE2E2] p-4 text-sm font-semibold text-[#7F1D1D]"
            >
              {errorMsg}
            </div>
          ) : null}

          {loading ? (
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-72 animate-pulse rounded-2xl border border-[#DCE6F5] bg-[#F4F8FC]"
                />
              ))}
            </div>
          ) : filteredList.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-[#DCE6F5] bg-[#F4F8FC] p-8 text-center">
              <p className="text-base font-bold text-[#0F2347]">
                Tidak ada wahana yang sesuai dengan filter.
              </p>
              <p className="mt-1 text-sm text-[#475569]">
                Coba ubah kata kunci pencarian atau pilih zona lain.
              </p>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setZona("Semua");
                  setCrowd("Semua");
                  setTinggiInput("");
                }}
                className="mt-4 inline-flex min-h-[44px] items-center rounded-full bg-[#0033A0] px-5 py-2 text-sm font-bold text-white"
              >
                Reset Filter
              </button>
            </div>
          ) : (
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredList.map((item) => {
                const heightBlocked =
                  parsedHeight !== null &&
                  parsedHeight < item.tinggi_minimal_cm;

                return (
                  <article
                    key={item.id}
                    className={`flex flex-col overflow-hidden rounded-2xl border bg-white shadow-[0_4px_16px_rgba(0,51,160,0.05)] ${
                      heightBlocked
                        ? "border-[#FCA5A5]"
                        : "border-[#DCE6F5]"
                    }`}
                  >
                    <div className="aspect-video w-full border-b border-[#DCE6F5]">
                      <PhotoSlot
                        src={item.gambar_url}
                        alt={`Foto wahana ${item.nama_wahana}`}
                        label={`Foto ${item.nama_wahana}`}
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-between p-5">
                      <div>
                        <div className="flex items-center justify-between gap-2 text-xs font-bold text-[#0033A0]">
                          <span>Zona {item.zona}</span>
                          <span className="inline-flex items-center gap-1 tabular-nums text-[#475569]">
                            <Ruler className="h-3.5 w-3.5" aria-hidden="true" />
                            Min. {item.tinggi_minimal_cm} cm
                          </span>
                        </div>
                        <h2 className="mt-1.5 text-lg font-bold text-[#0F2347]">
                          {item.nama_wahana}
                        </h2>
                        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[#475569]">
                          {item.deskripsi}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-1.5">
                          <LampuBadge status={item.status_lampu} />
                          <CrowdBadge crowd={item.crowd_meter} />
                        </div>

                        {parsedHeight !== null ? (
                          <div
                            className={`mt-3 rounded-lg border px-3 py-2 text-xs font-semibold ${
                              heightBlocked
                                ? "border-[#FCA5A5] bg-[#FEE2E2] text-[#7F1D1D]"
                                : "border-[#86EFAC] bg-[#DCFCE7] text-[#14532D]"
                            }`}
                          >
                            {heightBlocked
                              ? `Tinggi ${parsedHeight} cm belum memenuhi syarat min. ${item.tinggi_minimal_cm} cm`
                              : `Sesuai untuk tinggi ${parsedHeight} cm`}
                          </div>
                        ) : null}
                      </div>

                      <footer className="mt-4 border-t border-[#E6EEF8] pt-3">
                        <button
                          type="button"
                          onClick={() => setSelectedWahana(item)}
                          className="inline-flex min-h-[44px] w-full items-center justify-center rounded-full bg-[#0033A0] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-[#002678]"
                        >
                          Detail &amp; Antrean Virtual
                        </button>
                      </footer>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>

      <Footer />

      <RideDetailDialog
        wahana={selectedWahana}
        onClose={() => setSelectedWahana(null)}
        onQueueCreated={handleRefresh}
      />
    </div>
  );
}

function WahanaParamsBridge() {
  const searchParams = useSearchParams();
  const rawQuery = searchParams.get("q") || "";
  const rawZona = searchParams.get("zona") || "Semua";
  const initialZona: ZonaOption = ZONA_OPTIONS.includes(rawZona as ZonaOption)
    ? (rawZona as ZonaOption)
    : "Semua";

  return (
    <WahanaInner
      key={`${initialZona}-${rawQuery}`}
      initialQuery={rawQuery}
      initialZona={initialZona}
    />
  );
}

export default function WahanaPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-full flex-col bg-white text-[#0F2347]">
          <Navbar />
          <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
            <div className="h-44 animate-pulse rounded-2xl bg-[#F4F8FC]" />
          </main>
          <Footer />
        </div>
      }
    >
      <WahanaParamsBridge />
    </Suspense>
  );
}
