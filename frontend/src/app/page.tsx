"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Building2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Compass,
  MapPin,
  Ruler,
  ShieldCheck,
  Tag,
  Ticket,
  UtensilsCrossed,
} from "lucide-react";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { PhotoSlot } from "@/components/PhotoSlot";
import {
  PortalDetailDialog,
  type PortalModalItem,
} from "@/components/PortalDetailDialog";
import { RideDetailDialog } from "@/components/RideDetailDialog";
import { CrowdBadge, LampuBadge } from "@/components/StatusBadges";
import { api, formatRupiah } from "@/lib/api";
import type {
  AcaraItem,
  BlogPost,
  FnbItem,
  KawasanInfo,
  PaketTiket,
  PromoItem,
  VenueItem,
  Wahana,
} from "@/lib/types";

const ZONA_TABS = ["Semua", "Ekstrem", "Keluarga", "Air"] as const;

export default function HomePage() {
  const [kawasan, setKawasan] = useState<KawasanInfo | null>(null);
  const [paketList, setPaketList] = useState<PaketTiket[]>([]);
  const [wahanaList, setWahanaList] = useState<Wahana[]>([]);
  const [promoList, setPromoList] = useState<PromoItem[]>([]);
  const [acaraList, setAcaraList] = useState<AcaraItem[]>([]);
  const [venueList, setVenueList] = useState<VenueItem[]>([]);
  const [fnbList, setFnbList] = useState<FnbItem[]>([]);
  const [blogList, setBlogList] = useState<BlogPost[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeZona, setActiveZona] =
    useState<(typeof ZONA_TABS)[number]>("Semua");
  const [resortTab, setResortTab] = useState<"venue" | "fnb">("venue");
  const [selectedWahana, setSelectedWahana] = useState<Wahana | null>(null);
  const [selectedPortalItem, setSelectedPortalItem] =
    useState<PortalModalItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    const bundle = await api.getPortalHome();
    return {
      kawasanData: bundle.kawasan,
      paketData: bundle.paket_tiket,
      wahanaData: bundle.wahana,
      promoData: bundle.promo,
      acaraData: bundle.acara,
      venueData: bundle.venue,
      fnbData: bundle.kuliner,
      blogData: bundle.blog,
    };
  }, []);

  function handleRetry() {
    setLoading(true);
    setErrorMsg(null);
    fetchDashboard()
      .then(
        ({
          kawasanData,
          paketData,
          wahanaData,
          promoData,
          acaraData,
          venueData,
          fnbData,
          blogData,
        }) => {
          setKawasan(kawasanData);
          setPaketList(paketData);
          setWahanaList(wahanaData);
          setPromoList(promoData);
          setAcaraList(acaraData);
          setVenueList(venueData);
          setFnbList(fnbData);
          setBlogList(blogData);
        }
      )
      .catch(() => {
        setErrorMsg("Gagal memuat data kawasan. Silakan muat ulang halaman.");
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    let active = true;
    fetchDashboard()
      .then(
        ({
          kawasanData,
          paketData,
          wahanaData,
          promoData,
          acaraData,
          venueData,
          fnbData,
          blogData,
        }) => {
          if (!active) return;
          setKawasan(kawasanData);
          setPaketList(paketData);
          setWahanaList(wahanaData);
          setPromoList(promoData);
          setAcaraList(acaraData);
          setVenueList(venueData);
          setFnbList(fnbData);
          setBlogList(blogData);
        }
      )
      .catch(() => {
        if (!active) return;
        setErrorMsg("Gagal memuat data kawasan. Silakan muat ulang halaman.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [fetchDashboard]);

  const safeIndex =
    wahanaList.length > 0 ? activeIndex % wahanaList.length : 0;
  const spotlightRide = wahanaList[safeIndex] ?? null;

  const rotatedSlides = useMemo(() => {
    if (wahanaList.length === 0) return [];
    return wahanaList.map((_, offset) => ({
      ride: wahanaList[(safeIndex + offset) % wahanaList.length],
      originalIndex: (safeIndex + offset) % wahanaList.length,
    }));
  }, [wahanaList, safeIndex]);

  const minTicketPrice = useMemo(() => {
    if (paketList.length === 0) return 275000;
    return Math.min(...paketList.map((p) => p.harga));
  }, [paketList]);

  const activeRidesCount = useMemo(
    () => wahanaList.filter((w) => w.status_lampu !== "Maintenance").length,
    [wahanaList]
  );

  const filteredWahana = useMemo(() => {
    if (activeZona === "Semua") return wahanaList;
    return wahanaList.filter((w) => w.zona === activeZona);
  }, [wahanaList, activeZona]);

  function handlePrevSlide() {
    if (wahanaList.length === 0) return;
    setActiveIndex(
      (prev) => (prev - 1 + wahanaList.length) % wahanaList.length
    );
  }

  function handleNextSlide() {
    if (wahanaList.length === 0) return;
    setActiveIndex((prev) => (prev + 1) % wahanaList.length);
  }

  return (
    <div className="flex min-h-full flex-col bg-white text-[#0F2347]">
      <Navbar />

      <main id="main-content" tabIndex={-1} className="flex-1">
        {/* Section 1: Bright Jelajahin Royal Blue Hero Showcase Banner */}
        <section className="border-b border-[#DCE6F5] bg-[#F4F8FC] py-6 md:py-8">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="relative overflow-hidden rounded-3xl bg-[#0033A0] px-5 pt-6 pb-7 text-white shadow-[0_14px_38px_rgba(0,51,160,0.18)] sm:px-8 md:px-10 md:pt-8">
              <Image
                src="/photos/hero-jelajahin.jpg"
                alt=""
                priority
                width={1200}
                height={600}
                className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-55"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#001F66]/85 via-[#0033A0]/60 to-[#0033A0]/35"
              />
              {/* Top subtle indicator with live operational status */}
              <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-xl font-bold tabular-nums text-white sm:text-2xl">
                    {String(safeIndex + 1).padStart(2, "0")}
                  </span>
                  <span
                    aria-hidden="true"
                    className="h-4 w-px bg-white/35"
                  />
                  <span className="text-xs font-semibold tracking-wide text-[#E2EEFF] sm:text-sm">
                    {spotlightRide
                      ? `Jelajahin Park · Zona ${spotlightRide.zona}`
                      : "Jelajahin Theme Park · Wisata Terpadu"}
                  </span>
                </div>

                <Link
                  href="/pesan"
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#FFB800]/50 bg-[#0F2347]/55 px-3.5 py-1 text-xs font-semibold text-[#FFF4CC] backdrop-blur-xs transition-colors hover:bg-[#0F2347]/80"
                >
                  <ShieldCheck className="h-3.5 w-3.5 text-[#FFB800]" aria-hidden="true" />
                  <span>
                    {kawasan
                      ? `Kawasan ${kawasan.hari_ini.status_kawasan} · Sisa ${kawasan.hari_ini.sisa_kuota.toLocaleString("id-ID")} Kuota`
                      : "Jelajahin Theme Park · Jakarta"}
                  </span>
                </Link>
              </div>

              <div className="relative z-10 mt-6 grid items-end gap-8 md:grid-cols-12">
                {/* Left Spotlight Content */}
                <div className="min-w-0 md:col-span-5">
                  <h1
                    className="text-4xl leading-none font-extrabold tracking-tight text-[#FFB800] uppercase sm:text-5xl"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {spotlightRide
                      ? spotlightRide.nama_wahana
                      : "JELAJAHIN THEME PARK"}
                  </h1>

                  <p className="mt-3 text-xs font-medium text-[#E2EEFF] sm:text-sm">
                    {spotlightRide
                      ? `${spotlightRide.zona}  •  Min. ${spotlightRide.tinggi_minimal_cm} cm  •  Durasi ${spotlightRide.durasi_menit} menit`
                      : "Tiket Terusan  •  Crowd Meter Live  •  Virtual Queue"}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/15 px-3.5 py-1.5 text-xs font-semibold text-white">
                      <Clock
                        className="h-3.5 w-3.5 text-[#FFB800]"
                        aria-hidden="true"
                      />
                      <span>
                        {spotlightRide
                          ? `Lampu ${spotlightRide.status_lampu} | ${spotlightRide.crowd_meter}`
                          : kawasan
                            ? `${kawasan.jam_buka} - ${kawasan.jam_tutup} WIB`
                            : "09:00 - 18:00 WIB"}
                      </span>
                    </span>
                    <span className="inline-flex items-center rounded-full bg-[#FFB800] px-4 py-1.5 text-xs font-bold tabular-nums text-[#0F2347]">
                      Mulai {formatRupiah(minTicketPrice)} /tiket
                    </span>
                  </div>

                  <p className="mt-4 text-xs leading-relaxed text-[#E2EEFF] sm:text-sm">
                    {spotlightRide
                      ? `${spotlightRide.deskripsi} Kapasitas ${spotlightRide.kapasitas_kloter} kursi per putaran (Kloter berjalan: ${spotlightRide.kloter_berjalan}).`
                      : "Pesan tiket berkuota sebelum berangkat, cek kepadatan wahana, lalu ambil antrean virtual lewat ponsel."}
                  </p>

                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      disabled={!spotlightRide}
                      onClick={() =>
                        spotlightRide && setSelectedWahana(spotlightRide)
                      }
                      className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-white/80 bg-transparent px-5 py-2 text-xs font-bold text-white transition-colors hover:bg-white hover:text-[#0033A0] disabled:opacity-50 sm:text-sm"
                    >
                      Detail Wahana
                    </button>
                    <Link
                      href="/pesan"
                      className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-[#FFB800] px-6 py-2 text-xs font-bold text-[#0F2347] transition-colors hover:bg-[#F2AA00] sm:text-sm"
                    >
                      Pesan Tiket
                    </Link>
                  </div>
                </div>

                {/* Right White Editorial Ride Cards Carousel */}
                <div className="min-w-0 md:col-span-7">
                  {loading ? (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className="h-52 animate-pulse rounded-2xl bg-white/15"
                        />
                      ))}
                    </div>
                  ) : wahanaList.length === 0 ? (
                    <div className="rounded-2xl border border-white/25 bg-white/10 p-6 text-sm text-[#E2EEFF]">
                      Daftar wahana belum tersedia saat ini.
                    </div>
                  ) : (
                    <div>
                      <div className="no-scrollbar flex gap-3.5 overflow-x-auto p-1">
                        {rotatedSlides.map(({ ride, originalIndex }, idx) => {
                          const isSelected = idx === 0;
                          return (
                            <button
                              key={ride.id}
                              type="button"
                              onClick={() => setActiveIndex(originalIndex)}
                              aria-pressed={isSelected}
                              className={`group flex w-44 shrink-0 flex-col overflow-hidden rounded-2xl bg-white text-left text-[#0F2347] shadow-lg transition-all sm:w-48 ${isSelected
                                ? "ring-2 ring-[#FFB800]"
                                : "opacity-90 hover:opacity-100"
                                }`}
                            >
                              <div className="h-28 w-full border-b border-[#DCE6F5] sm:h-32">
                                <PhotoSlot
                                  src={ride.gambar_url}
                                  alt={`Foto wahana ${ride.nama_wahana}`}
                                  label="Foto Wahana"
                                />
                              </div>
                              <div className="flex flex-1 flex-col justify-between p-3.5">
                                <div>
                                  <span className="block text-[11px] font-bold text-[#0033A0]">
                                    Zona {ride.zona}
                                  </span>
                                  <span
                                    className="mt-0.5 block text-base leading-snug font-bold text-[#0F2347]"
                                    style={{
                                      fontFamily: "var(--font-display)",
                                    }}
                                  >
                                    {ride.nama_wahana}
                                  </span>
                                </div>
                                <span className="mt-2 block text-[11px] font-semibold text-[#475569]">
                                  {ride.tinggi_minimal_cm > 0
                                    ? `Min. ${ride.tinggi_minimal_cm} cm`
                                    : "Semua tinggi"}{" "}
                                  · {ride.crowd_meter}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      <div className="mt-4 flex items-center gap-3">
                        <button
                          type="button"
                          onClick={handlePrevSlide}
                          aria-label="Wahana sebelumnya"
                          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/60 bg-white/10 text-white transition-colors hover:bg-white hover:text-[#0033A0]"
                        >
                          <ChevronLeft
                            className="h-5 w-5"
                            aria-hidden="true"
                          />
                        </button>
                        <button
                          type="button"
                          onClick={handleNextSlide}
                          aria-label="Wahana berikutnya"
                          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/60 bg-white/10 text-white transition-colors hover:bg-white hover:text-[#0033A0]"
                        >
                          <ChevronRight
                            className="h-5 w-5"
                            aria-hidden="true"
                          />
                        </button>
                        <span className="ml-2 text-xs font-semibold tabular-nums text-[#E2EEFF]">
                          {String(safeIndex + 1).padStart(2, "0")} /{" "}
                          {String(wahanaList.length).padStart(2, "0")}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-7 h-1 w-full overflow-hidden rounded-full bg-white/20">
                <div
                  className="h-full rounded-full bg-[#FFB800] transition-all"
                  style={{
                    width:
                      wahanaList.length > 0
                        ? `${((safeIndex + 1) / wahanaList.length) * 100}%`
                        : "25%",
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Quick Utility Pills + Trip Planner Bar */}
        <section className="border-b border-[#DCE6F5] bg-white py-6">
          <div className="mx-auto max-w-6xl space-y-5 px-4 sm:px-6">
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              <div className="flex items-center gap-3 rounded-2xl border border-[#DCE6F5] bg-white px-4 py-3 shadow-[0_2px_10px_rgba(0,51,160,0.04)]">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EBF5FF] text-[#0033A0]">
                  <Clock className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-[11px] font-semibold text-[#475569]">
                    Jam Operasional
                  </p>
                  <p className="text-sm font-bold tabular-nums text-[#0F2347]">
                    {kawasan
                      ? `${kawasan.jam_buka} - ${kawasan.jam_tutup} WIB`
                      : "09:00 - 18:00 WIB"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-[#DCE6F5] bg-white px-4 py-3 shadow-[0_2px_10px_rgba(0,51,160,0.04)]">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EBF5FF] text-[#0033A0]">
                  <Ticket className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-[11px] font-semibold text-[#475569]">
                    Kuota Hari Ini
                  </p>
                  <p className="text-sm font-bold tabular-nums text-[#0F2347]">
                    {loading
                      ? "Memuat..."
                      : kawasan
                        ? `${kawasan.hari_ini.sisa_kuota.toLocaleString("id-ID")} / ${kawasan.hari_ini.kuota_maksimal.toLocaleString("id-ID")}`
                        : "3.750 / 5.000"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-[#DCE6F5] bg-white px-4 py-3 shadow-[0_2px_10px_rgba(0,51,160,0.04)]">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EBF5FF] text-[#0033A0]">
                  <ShieldCheck className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-[11px] font-semibold text-[#475569]">
                    Wahana Siap Naik
                  </p>
                  <p className="text-sm font-bold tabular-nums text-[#0F2347]">
                    {activeRidesCount} dari {wahanaList.length} Wahana
                  </p>
                </div>
              </div>

              <Link
                href="/wahana"
                className="flex items-center gap-3 rounded-2xl border border-[#DCE6F5] bg-white px-4 py-3 shadow-[0_2px_10px_rgba(0,51,160,0.04)] transition-colors hover:border-[#0033A0] hover:bg-[#F4F8FC]"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EBF5FF] text-[#0033A0]">
                  <Compass className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-[11px] font-semibold text-[#475569]">
                    Panduan Kelayakan
                  </p>
                  <p className="text-sm font-bold text-[#0033A0]">
                    Filter Tinggi Badan
                  </p>
                </div>
              </Link>
            </div>

            {/* Trip Planner style capsule bar */}
            <div className="flex flex-col justify-between gap-4 rounded-2xl border border-[#CBE2FF] bg-[#EBF5FF] px-5 py-4 sm:flex-row sm:items-center sm:px-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#0033A0]">
                  Perencana Kunjungan Jelajahin
                </p>
                <p className="mt-0.5 text-base font-bold text-[#0F2347] sm:text-lg">
                  Rencanakan kunjungan bebas antre panjang dengan E-Ticket &amp;
                  Antrean Virtual
                </p>
              </div>
              <Link
                href="/pesan"
                className="inline-flex min-h-[44px] shrink-0 items-center justify-center rounded-full bg-[#FFB800] px-6 py-2.5 text-sm font-bold text-[#0F2347] transition-colors hover:bg-[#F2AA00]"
              >
                Mulai Pesan Tiket
              </Link>
            </div>
          </div>
        </section>

        {errorMsg ? (
          <div className="mx-auto mt-6 max-w-6xl px-4 sm:px-6">
            <div
              role="alert"
              className="flex flex-col gap-3 rounded-xl border border-[#FCA5A5] bg-[#FEE2E2] p-4 text-sm text-[#7F1D1D] sm:flex-row sm:items-center sm:justify-between"
            >
              <p className="font-semibold">{errorMsg}</p>
              <button
                type="button"
                onClick={handleRetry}
                className="inline-flex min-h-[44px] shrink-0 items-center justify-center rounded-full bg-[#0033A0] px-4 py-2 text-xs font-bold text-white"
              >
                Coba Muat Ulang
              </button>
            </div>
          </div>
        ) : null}

        {/* Section 3: Beli Tiket Sekarang (2-Card Package Grid) */}
        <section
          id="paket"
          className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-14"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2
                className="text-2xl font-bold tracking-tight text-[#0F2347] sm:text-3xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Beli Tiket &amp; Paket Kunjungan
              </h2>
              <p className="mt-1.5 max-w-2xl text-sm text-[#475569] sm:text-base">
                Pilih tanggal kunjungan sesuai kuota harian yang masih tersedia
                untuk langsung menerbitkan E-Ticket QR.
              </p>
            </div>
            <Link
              href="/pesan"
              className="text-sm font-bold text-[#0033A0] hover:underline"
            >
              Lihat Kalender Kuota Lengkap &rarr;
            </Link>
          </div>

          {loading ? (
            <div className="mt-7 grid gap-6 md:grid-cols-2">
              {[0, 1].map((idx) => (
                <div
                  key={idx}
                  className="h-56 animate-pulse rounded-2xl border border-[#DCE6F5] bg-[#F4F8FC]"
                />
              ))}
            </div>
          ) : paketList.length === 0 ? (
            <div className="mt-7 rounded-2xl border border-[#DCE6F5] bg-[#F4F8FC] p-6 text-sm text-[#475569]">
              Daftar paket tiket belum tersedia.
            </div>
          ) : (
            <div className="mt-7 grid gap-6 md:grid-cols-2">
              {paketList.map((paket) => (
                <article
                  key={paket.id}
                  className={`flex flex-col justify-between rounded-2xl border p-6 shadow-[0_4px_18px_rgba(0,51,160,0.05)] ${paket.is_bundle
                    ? "border-[#0033A0] bg-[#F4F8FC]"
                    : "border-[#DCE6F5] bg-white"
                    }`}
                >
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${paket.is_bundle
                          ? "bg-[#FFB800] text-[#0F2347]"
                          : "bg-[#EBF5FF] text-[#0033A0]"
                          }`}
                      >
                        {paket.is_bundle
                          ? "Bundling Antrean Prioritas"
                          : "Tiket Masuk Kawasan"}
                      </span>
                      <span className="text-xs font-semibold tabular-nums text-[#475569]">
                        Maks. {paket.jatah_antrean_aktif} antrean virtual aktif
                      </span>
                    </div>

                    <h3
                      className="mt-4 text-xl font-bold text-[#0F2347] sm:text-2xl"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {paket.nama_paket}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#475569]">
                      {paket.deskripsi}
                    </p>
                  </div>

                  <div className="ticket-divider mt-6 flex flex-wrap items-center justify-between gap-4 pt-5">
                    <div>
                      <p className="text-xs font-medium text-[#475569]">
                        Harga per pengunjung
                      </p>
                      <p className="text-2xl font-bold tabular-nums text-[#0033A0]">
                        {formatRupiah(paket.harga)}
                      </p>
                    </div>
                    <Link
                      href={`/pesan?paket=${paket.id}`}
                      className={`inline-flex min-h-[44px] items-center justify-center rounded-full px-5 py-2.5 text-sm font-bold transition-colors ${paket.is_bundle
                        ? "bg-[#0033A0] text-white hover:bg-[#002678]"
                        : "border border-[#0033A0] bg-white text-[#0033A0] hover:bg-[#0033A0] hover:text-white"
                        }`}
                    >
                      Beli Tiket
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Section 3B: Promo Spesial + Lihat Semua Promo */}
        <section
          id="promo"
          className="border-t border-[#DCE6F5] bg-white py-12 md:py-14"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2
                  className="text-2xl font-bold tracking-tight text-[#0F2347] sm:text-3xl"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Promo Spesial Kunjungan
                </h2>
                <p className="mt-1.5 text-sm text-[#475569]">
                  Potongan tiket rombongan, early bird, hingga paket bundling
                  antrean prioritas.
                </p>
              </div>
              <Link
                href="/promo"
                className="inline-flex min-h-[44px] shrink-0 items-center justify-center rounded-full border border-[#0033A0] bg-white px-5 py-2 text-sm font-bold text-[#0033A0] transition-colors hover:bg-[#0033A0] hover:text-white"
              >
                Lihat Semua Promo
              </Link>
            </div>

            <div className="mt-7 grid gap-5 md:grid-cols-3">
              {loading && promoList.length === 0
                ? [0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="h-72 animate-pulse rounded-2xl border border-[#DCE6F5] bg-[#F4F8FC]"
                  />
                ))
                : promoList.slice(0, 3).map((promo) => (
                  <article
                    key={promo.id}
                    className="flex flex-col overflow-hidden rounded-2xl border border-[#DCE6F5] bg-white shadow-[0_4px_16px_rgba(0,51,160,0.05)]"
                  >
                    <div className="aspect-[16/9] w-full border-b border-[#DCE6F5]">
                      <PhotoSlot
                        src={promo.gambar_url}
                        alt={promo.judul}
                        label="Foto Promo"
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-between p-5">
                      <div>
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="rounded-full bg-[#FFB800] px-3 py-1 text-xs font-bold text-[#0F2347]">
                            {promo.diskon_badge}
                          </span>
                          <span className="text-xs font-semibold text-[#475569]">
                            {promo.periode}
                          </span>
                        </div>
                        <h3
                          className="mt-3 text-lg font-bold text-[#0F2347]"
                          style={{ fontFamily: "var(--font-display)" }}
                        >
                          {promo.judul}
                        </h3>
                        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-[#475569]">
                          {promo.ringkasan}
                        </p>
                      </div>
                      <div className="mt-4 flex items-center justify-between gap-2 border-t border-[#E6EEF8] pt-3">
                        <span className="inline-flex items-center gap-1 rounded-md bg-[#EBF5FF] px-2.5 py-1 text-[11px] font-bold text-[#0033A0]">
                          <Tag className="h-3 w-3" aria-hidden="true" />
                          {promo.kode_promo}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedPortalItem({
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
                              photoLabel: "Foto Promo",
                            })
                          }
                          className="inline-flex min-h-[40px] items-center rounded-full px-3 py-1 text-xs font-bold text-[#0033A0] hover:bg-[#EBF5FF]"
                        >
                          Detail &rarr;
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
            </div>
          </div>
        </section>

        {/* Section 4: Jelajah Wahana & Kepadatan Live (Bright Ice Band) */}
        <section className="border-y border-[#DCE6F5] bg-[#F4F8FC] py-12 md:py-14">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2
                  className="text-2xl font-bold tracking-tight text-[#0F2347] sm:text-3xl"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Jelajah Wahana &amp; Kepadatan Live
                </h2>
                <p className="mt-1.5 text-sm text-[#475569]">
                  Pantau kesiapan lampu wahana dan estimasi tunggu antrean
                  sebelum berjalan ke zona berikutnya.
                </p>
              </div>
              <Link
                href="/wahana"
                className="inline-flex min-h-[44px] shrink-0 items-center justify-center rounded-full border border-[#0033A0] bg-white px-5 py-2 text-sm font-bold text-[#0033A0] transition-colors hover:bg-[#0033A0] hover:text-white"
              >
                Buka Filter Tinggi Badan
              </Link>
            </div>

            <div
              role="tablist"
              aria-label="Filter zona wahana"
              className="mt-6 flex gap-2 overflow-x-auto pb-1"
            >
              {ZONA_TABS.map((zona) => {
                const selected = activeZona === zona;
                return (
                  <button
                    key={zona}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    onClick={() => setActiveZona(zona)}
                    className={`inline-flex min-h-[44px] shrink-0 items-center rounded-full px-4 py-2 text-sm font-bold transition-colors ${selected
                      ? "bg-[#0033A0] text-white"
                      : "border border-[#DCE6F5] bg-white text-[#475569] hover:border-[#0033A0] hover:text-[#0033A0]"
                      }`}
                  >
                    {zona}
                  </button>
                );
              })}
            </div>

            {loading ? (
              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {[0, 1, 2].map((idx) => (
                  <div
                    key={idx}
                    className="h-72 animate-pulse rounded-2xl border border-[#DCE6F5] bg-white"
                  />
                ))}
              </div>
            ) : filteredWahana.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-[#DCE6F5] bg-white p-8 text-center text-sm text-[#475569]">
                Belum ada wahana pada zona ini.
              </div>
            ) : (
              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {filteredWahana.map((wahana) => (
                  <article
                    key={wahana.id}
                    className="flex flex-col overflow-hidden rounded-2xl border border-[#DCE6F5] bg-white shadow-[0_4px_16px_rgba(0,51,160,0.05)]"
                  >
                    <div className="aspect-video w-full border-b border-[#DCE6F5]">
                      <PhotoSlot
                        src={wahana.gambar_url}
                        alt={`Foto wahana ${wahana.nama_wahana}`}
                        label={`Foto ${wahana.nama_wahana}`}
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-between p-5">
                      <div>
                        <div className="flex items-center justify-between gap-2 text-xs font-bold text-[#0033A0]">
                          <span>Zona {wahana.zona}</span>
                          <span className="inline-flex items-center gap-1 tabular-nums text-[#475569]">
                            <Ruler className="h-3.5 w-3.5" aria-hidden="true" />
                            Min. {wahana.tinggi_minimal_cm} cm
                          </span>
                        </div>
                        <h3 className="mt-1.5 text-lg font-bold text-[#0F2347]">
                          {wahana.nama_wahana}
                        </h3>
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          <LampuBadge status={wahana.status_lampu} />
                          <CrowdBadge crowd={wahana.crowd_meter} />
                        </div>
                      </div>

                      <footer className="mt-4 border-t border-[#E6EEF8] pt-3">
                        <button
                          type="button"
                          onClick={() => setSelectedWahana(wahana)}
                          className="inline-flex min-h-[44px] w-full items-center justify-center rounded-full border border-[#0033A0] bg-white px-4 py-2 text-sm font-bold text-[#0033A0] transition-colors hover:bg-[#0033A0] hover:text-white"
                        >
                          Cek Detail &amp; Antre
                        </button>
                      </footer>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Section 4B: Acara & Pertunjukan Kawasan */}
        <section id="acara" className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-14">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2
                className="text-2xl font-bold tracking-tight text-[#0F2347] sm:text-3xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Acara, Parade &amp; Pertunjukan
              </h2>
              <p className="mt-1.5 text-sm text-[#475569]">
                Jadwal parade tematik, pertunjukan panggung keluarga, dan musik
                senja di kawasan Jelajahin.
              </p>
            </div>
            <Link
              href="/acara"
              className="inline-flex min-h-[44px] shrink-0 items-center justify-center rounded-full border border-[#0033A0] bg-white px-5 py-2 text-sm font-bold text-[#0033A0] transition-colors hover:bg-[#0033A0] hover:text-white"
            >
              Lihat Semua Acara
            </Link>
          </div>

          <div className="mt-7 grid gap-5 md:grid-cols-3">
            {loading && acaraList.length === 0
              ? [0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="h-72 animate-pulse rounded-2xl border border-[#DCE6F5] bg-[#F4F8FC]"
                />
              ))
              : acaraList.slice(0, 3).map((acara) => (
                <article
                  key={acara.id}
                  className="flex flex-col overflow-hidden rounded-2xl border border-[#DCE6F5] bg-white shadow-[0_4px_16px_rgba(0,51,160,0.05)]"
                >
                  <div className="aspect-video w-full border-b border-[#DCE6F5]">
                    <PhotoSlot
                      src={acara.gambar_url}
                      alt={acara.judul}
                      label="Foto Acara"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-between p-5">
                    <div>
                      <span className="rounded-full bg-[#EBF5FF] px-3 py-1 text-xs font-bold text-[#0033A0]">
                        {acara.kategori}
                      </span>
                      <h3
                        className="mt-3 text-lg font-bold text-[#0F2347]"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {acara.judul}
                      </h3>
                      <div className="mt-2 space-y-1 text-xs font-semibold text-[#475569]">
                        <p className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-[#0033A0]" aria-hidden="true" />
                          <span>
                            {acara.jadwal} · {acara.jam}
                          </span>
                        </p>
                        <p className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-[#0033A0]" aria-hidden="true" />
                          <span>{acara.lokasi}</span>
                        </p>
                      </div>
                    </div>

                    <footer className="mt-4 border-t border-[#E6EEF8] pt-3">
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedPortalItem({
                            badge: acara.kategori,
                            title: acara.judul,
                            meta: `${acara.jadwal} · ${acara.jam}`,
                            description: acara.ringkasan,
                            highlights: [
                              `Lokasi: ${acara.lokasi}`,
                              `Jam Tampil: ${acara.jam}`,
                            ],
                            ctaLabel: "Lihat Semua Acara",
                            ctaHref: "/acara",
                            imageUrl: acara.gambar_url,
                            photoLabel: "Foto Acara",
                          })
                        }
                        className="inline-flex min-h-[44px] w-full items-center justify-center rounded-full border border-[#0033A0] bg-white px-4 py-2 text-sm font-bold text-[#0033A0] hover:bg-[#0033A0] hover:text-white"
                      >
                        Detail Acara
                      </button>
                    </footer>
                  </div>
                </article>
              ))}
          </div>
        </section>

        {/* Section 4C: Resort & Hotel [Lihat Semua Venue] [Food & Beverages] */}
        <section
          id="resort"
          className="border-y border-[#DCE6F5] bg-[#F4F8FC] py-12 md:py-14"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h2
                  className="text-2xl font-bold tracking-tight text-[#0F2347] sm:text-3xl"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Resort, Hotel &amp; Food &amp; Beverages
                </h2>
                <p className="mt-1.5 text-sm text-[#475569]">
                  Pilihan penginapan tepi pantai serta restoran untuk beristirahat
                  di sela jadwal antrean wahana.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href="/venue"
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-[#0033A0] px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-[#002678]"
                >
                  <Building2 className="h-4 w-4" aria-hidden="true" />
                  <span>Lihat Semua Venue</span>
                </Link>
                <Link
                  href="/kuliner"
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-[#0033A0] bg-white px-5 py-2 text-sm font-bold text-[#0033A0] transition-colors hover:bg-[#0033A0] hover:text-white"
                >
                  <UtensilsCrossed className="h-4 w-4" aria-hidden="true" />
                  <span>Food &amp; Beverages</span>
                </Link>
              </div>
            </div>

            <div
              role="tablist"
              aria-label="Pratinjau Resort & Hotel atau Food & Beverages"
              className="mt-6 flex gap-2"
            >
              <button
                type="button"
                role="tab"
                aria-selected={resortTab === "venue"}
                onClick={() => setResortTab("venue")}
                className={`inline-flex min-h-[44px] items-center rounded-full px-4 py-2 text-sm font-bold transition-colors ${resortTab === "venue"
                  ? "bg-[#0033A0] text-white"
                  : "border border-[#DCE6F5] bg-white text-[#475569] hover:border-[#0033A0] hover:text-[#0033A0]"
                  }`}
              >
                Resort &amp; Hotel (Venue)
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={resortTab === "fnb"}
                onClick={() => setResortTab("fnb")}
                className={`inline-flex min-h-[44px] items-center rounded-full px-4 py-2 text-sm font-bold transition-colors ${resortTab === "fnb"
                  ? "bg-[#0033A0] text-white"
                  : "border border-[#DCE6F5] bg-white text-[#475569] hover:border-[#0033A0] hover:text-[#0033A0]"
                  }`}
              >
                Food &amp; Beverages
              </button>
            </div>

            {resortTab === "venue" ? (
              <div className="mt-6 grid gap-5 md:grid-cols-3">
                {loading && venueList.length === 0
                  ? [0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="h-72 animate-pulse rounded-2xl border border-[#DCE6F5] bg-[#F4F8FC]"
                    />
                  ))
                  : venueList.slice(0, 3).map((venue) => (
                    <article
                      key={venue.id}
                      className="flex flex-col overflow-hidden rounded-2xl border border-[#DCE6F5] bg-white shadow-[0_4px_16px_rgba(0,51,160,0.05)]"
                    >
                      <div className="aspect-video w-full border-b border-[#DCE6F5]">
                        <PhotoSlot
                          src={venue.gambar_url}
                          alt={venue.nama}
                          label="Foto Resort & Venue"
                        />
                      </div>
                      <div className="flex flex-1 flex-col justify-between p-5">
                        <div>
                          <div className="flex items-center justify-between gap-2">
                            <span className="rounded-full bg-[#EBF5FF] px-2.5 py-1 text-xs font-bold text-[#0033A0]">
                              {venue.kategori}
                            </span>
                            <span className="text-xs font-bold tabular-nums text-[#0033A0]">
                              {venue.harga_mulai}
                            </span>
                          </div>
                          <h3
                            className="mt-2.5 text-lg font-bold text-[#0F2347]"
                            style={{ fontFamily: "var(--font-display)" }}
                          >
                            {venue.nama}
                          </h3>
                          <p className="mt-1 text-xs font-semibold text-[#475569]">
                            {venue.area}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedPortalItem({
                              badge: venue.kategori,
                              title: venue.nama,
                              meta: venue.area,
                              description: venue.ringkasan,
                              highlights: [
                                `Tarif: ${venue.harga_mulai}`,
                                `Fasilitas: ${venue.fasilitas}`,
                              ],
                              ctaLabel: "Buka Halaman Venue",
                              ctaHref: "/venue",
                              imageUrl: venue.gambar_url,
                              photoLabel: "Foto Resort & Venue",
                            })
                          }
                          className="mt-4 inline-flex min-h-[44px] w-full items-center justify-center rounded-full border border-[#0033A0] bg-white px-4 py-2 text-sm font-bold text-[#0033A0] hover:bg-[#0033A0] hover:text-white"
                        >
                          Detail Venue
                        </button>
                      </div>
                    </article>
                  ))}
              </div>
            ) : (
              <div className="mt-6 grid gap-5 md:grid-cols-3">
                {loading && fnbList.length === 0
                  ? [0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="h-72 animate-pulse rounded-2xl border border-[#DCE6F5] bg-[#F4F8FC]"
                    />
                  ))
                  : fnbList.slice(0, 3).map((fnb) => (
                    <article
                      key={fnb.id}
                      className="flex flex-col overflow-hidden rounded-2xl border border-[#DCE6F5] bg-white shadow-[0_4px_16px_rgba(0,51,160,0.05)]"
                    >
                      <div className="aspect-video w-full border-b border-[#DCE6F5]">
                        <PhotoSlot
                          src={fnb.gambar_url}
                          alt={fnb.nama}
                          label="Foto Kuliner & F&B"
                        />
                      </div>
                      <div className="flex flex-1 flex-col justify-between p-5">
                        <div>
                          <div className="flex items-center justify-between gap-2">
                            <span className="rounded-full bg-[#EBF5FF] px-2.5 py-1 text-xs font-bold text-[#0033A0]">
                              {fnb.kategori}
                            </span>
                            <span className="text-xs font-bold tabular-nums text-[#475569]">
                              {fnb.jam_buka}
                            </span>
                          </div>
                          <h3
                            className="mt-2.5 text-lg font-bold text-[#0F2347]"
                            style={{ fontFamily: "var(--font-display)" }}
                          >
                            {fnb.nama}
                          </h3>
                          <p className="mt-1 text-xs font-semibold text-[#475569]">
                            {fnb.area} · {fnb.kisaran_harga}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedPortalItem({
                              badge: fnb.kategori,
                              title: fnb.nama,
                              meta: `${fnb.area} · ${fnb.jam_buka}`,
                              description: `Menu andalan: ${fnb.menu_andalan}`,
                              highlights: [
                                `Kisaran Harga: ${fnb.kisaran_harga}`,
                                `Jam Buka: ${fnb.jam_buka}`,
                              ],
                              ctaLabel: "Lihat Semua Food & Beverages",
                              ctaHref: "/kuliner",
                              imageUrl: fnb.gambar_url,
                              photoLabel: "Foto Kuliner & F&B",
                            })
                          }
                          className="mt-4 inline-flex min-h-[44px] w-full items-center justify-center rounded-full border border-[#0033A0] bg-white px-4 py-2 text-sm font-bold text-[#0033A0] hover:bg-[#0033A0] hover:text-white"
                        >
                          Lihat Menu &amp; Info
                        </button>
                      </div>
                    </article>
                  ))}
              </div>
            )}
          </div>
        </section>

        {/* Section 4D: Blog & Panduan Wisata */}
        <section id="blog" className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-14">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2
                className="text-2xl font-bold tracking-tight text-[#0F2347] sm:text-3xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Blog &amp; Panduan Kunjungan
              </h2>
              <p className="mt-1.5 text-sm text-[#475569]">
                Tips keliling wahana, panduan tinggi badan anak, hingga info
                kuliner dan menginap di kawasan Jelajahin.
              </p>
            </div>
            <Link
              href="/blog"
              className="inline-flex min-h-[44px] shrink-0 items-center justify-center rounded-full border border-[#0033A0] bg-white px-5 py-2 text-sm font-bold text-[#0033A0] transition-colors hover:bg-[#0033A0] hover:text-white"
            >
              Lihat Semua Artikel
            </Link>
          </div>

          <div className="mt-7 grid gap-5 md:grid-cols-3">
            {loading && blogList.length === 0
              ? [0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="h-72 animate-pulse rounded-2xl border border-[#DCE6F5] bg-[#F4F8FC]"
                />
              ))
              : blogList.slice(0, 3).map((post) => (
                <article
                  key={post.id}
                  className="flex flex-col overflow-hidden rounded-2xl border border-[#DCE6F5] bg-white shadow-[0_4px_16px_rgba(0,51,160,0.05)]"
                >
                  <div className="aspect-video w-full border-b border-[#DCE6F5]">
                    <PhotoSlot
                      src={post.gambar_url}
                      alt={post.judul}
                      label="Foto Artikel"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-between p-5">
                    <div>
                      <div className="flex items-center justify-between gap-2 text-xs font-semibold text-[#475569]">
                        <span className="rounded-full bg-[#EBF5FF] px-2.5 py-1 font-bold text-[#0033A0]">
                          {post.kategori}
                        </span>
                        <span>{post.waktu_baca}</span>
                      </div>
                      <h3
                        className="mt-3 text-lg font-bold leading-snug text-[#0F2347]"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {post.judul}
                      </h3>
                      <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-[#475569]">
                        {post.ringkasan}
                      </p>
                    </div>

                    <footer className="mt-4 flex items-center justify-between border-t border-[#E6EEF8] pt-3">
                      <span className="text-xs font-medium text-[#475569]">
                        {post.tanggal}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedPortalItem({
                            badge: post.kategori,
                            title: post.judul,
                            meta: `${post.tanggal} · ${post.waktu_baca}`,
                            description: post.ringkasan,
                            paragraphs: post.isi,
                            ctaLabel: "Baca di Halaman Blog",
                            ctaHref: "/blog",
                            imageUrl: post.gambar_url,
                            photoLabel: "Foto Artikel",
                          })
                        }
                        className="inline-flex min-h-[40px] items-center rounded-full px-3 py-1 text-xs font-bold text-[#0033A0] hover:bg-[#EBF5FF]"
                      >
                        Baca Artikel &rarr;
                      </button>
                    </footer>
                  </div>
                </article>
              ))}
          </div>
        </section>

        {/* Section 5: Editorial Numbered Guide (Clean Anti-Slop 3-Step Flow) */}
        <section className="border-t border-[#DCE6F5] bg-[#F4F8FC] py-12 md:py-14">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="max-w-2xl">
              <h2
                className="text-2xl font-bold tracking-tight text-[#0F2347] sm:text-3xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Satu akun dari rumah sampai pintu wahana
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-[#475569]">
                Semua tiket masuk, status check-in, dan slot antrean virtual
                tercatat rapi untuk memudahkan kunjunganmu seharian di taman
                wisata.
              </p>
            </div>

            <ol className="mt-8 grid gap-8 md:grid-cols-3">
              <li className="border-l-4 border-[#0033A0] pl-5">
                <span className="text-2xl font-extrabold tabular-nums text-[#0033A0]">
                  01
                </span>
                <p className="mt-1 text-xs font-bold uppercase tracking-wider text-[#475569]">
                  Pra-Kunjungan
                </p>
                <h3 className="mt-1 text-lg font-bold text-[#0F2347]">
                  Pilih tanggal &amp; paket tiket
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#475569]">
                  Cek sisa kuota tanggal pilihanmu, pilih paket reguler atau
                  bundling prioritas, lalu terima E-Ticket QR instan.
                </p>
              </li>

              <li className="border-l-4 border-[#0033A0] pl-5">
                <span className="text-2xl font-extrabold tabular-nums text-[#0033A0]">
                  02
                </span>
                <p className="mt-1 text-xs font-bold uppercase tracking-wider text-[#475569]">
                  Pintu Gerbang Utama
                </p>
                <h3 className="mt-1 text-lg font-bold text-[#0F2347]">
                  Scan QR untuk aktivasi masuk
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#475569]">
                  Tunjukkan E-Ticket QR di halaman Tiket Saya kepada petugas
                  gerbang agar tiketmu aktif di dalam kawasan.
                </p>
              </li>

              <li className="border-l-4 border-[#FFB800] pl-5">
                <span className="text-2xl font-extrabold tabular-nums text-[#0033A0]">
                  03
                </span>
                <p className="mt-1 text-xs font-bold uppercase tracking-wider text-[#475569]">
                  Di Dalam Taman
                </p>
                <h3 className="mt-1 text-lg font-bold text-[#0F2347]">
                  Ambil antrean virtual wahana
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#475569]">
                  Pantau lampu kesiapan dan kepadatan wahana, lalu pesan nomor
                  kloter virtual sambil beristirahat di area kuliner.
                </p>
              </li>
            </ol>
          </div>
        </section>
      </main>

      <Footer />

      <RideDetailDialog
        wahana={selectedWahana}
        onClose={() => setSelectedWahana(null)}
        onQueueCreated={() => {
          handleRetry();
        }}
      />

      <PortalDetailDialog
        item={selectedPortalItem}
        onClose={() => setSelectedPortalItem(null)}
      />
    </div>
  );
}
