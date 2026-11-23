"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  Clock,
  Compass,
  QrCode,
  Ruler,
  ShieldCheck,
  Sparkles,
  Ticket,
  Users,
} from "lucide-react";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { PhotoSlot } from "@/components/PhotoSlot";
import { api, formatRupiah } from "@/lib/api";
import type {
  AcaraItem,
  KawasanInfo,
  PaketTiket,
  PromoItem,
  Wahana,
} from "@/lib/types";

const ZONA_SHOWCASE = [
  {
    title: "Wahana Ekstrem & Adrenalin",
    badge: "Zona Ekstrem",
    desc: "Roller coaster dan ayunan raksasa dengan pantauan kloter serta kepadatan langsung.",
    photo: "/photos/unit-dufan.jpg",
    href: "/wahana?zona=Ekstrem",
  },
  {
    title: "Wahana Keluarga & Indoor",
    badge: "Zona Keluarga",
    desc: "Wahana sejuk ber-AC, kincir ria panorama laut, hingga komidi putar ramah anak.",
    photo: "/photos/unit-seaworld.jpg",
    href: "/wahana?zona=Keluarga",
  },
  {
    title: "Petualangan Basah Zona Air",
    badge: "Zona Air",
    desc: "Arung jeram buatan berarus deras yang cocok dinikmati bersama rombongan.",
    photo: "/photos/unit-atlantis.jpg",
    href: "/wahana?zona=Air",
  },
  {
    title: "Kuliner & Resort Tepi Pantai",
    badge: "Tepian Ancol",
    desc: "Restoran laut, food court di dalam taman bermain, serta hotel & cottage pantai.",
    photo: "/photos/resort-kuliner.jpg",
    href: "/venue",
  },
];

export default function LandingPage() {
  const [kawasan, setKawasan] = useState<KawasanInfo | null>(null);
  const [paketList, setPaketList] = useState<PaketTiket[]>([]);
  const [wahanaList, setWahanaList] = useState<Wahana[]>([]);
  const [promoList, setPromoList] = useState<PromoItem[]>([]);
  const [acaraList, setAcaraList] = useState<AcaraItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchLanding = useCallback(async () => {
    const bundle = await api.getPortalHome();
    return {
      kawasanData: bundle.kawasan,
      paketData: bundle.paket_tiket,
      wahanaData: bundle.wahana,
      promoData: bundle.promo,
      acaraData: bundle.acara,
    };
  }, []);

  const loadData = useCallback(() => {
    setLoading(true);
    setErrorMsg(null);
    return fetchLanding()
      .then(
        ({ kawasanData, paketData, wahanaData, promoData, acaraData }) => {
          setKawasan(kawasanData);
          setPaketList(paketData);
          setWahanaList(wahanaData);
          setPromoList(promoData);
          setAcaraList(acaraData);
        }
      )
      .catch(() => {
        setErrorMsg(
          "Sebagian data langsung kawasan belum tersambung. Muat ulang halaman untuk memperbarui."
        );
      })
      .finally(() => setLoading(false));
  }, [fetchLanding]);

  useEffect(() => {
    let active = true;
    fetchLanding()
      .then(
        ({ kawasanData, paketData, wahanaData, promoData, acaraData }) => {
          if (!active) return;
          setKawasan(kawasanData);
          setPaketList(paketData);
          setWahanaList(wahanaData);
          setPromoList(promoData);
          setAcaraList(acaraData);
        }
      )
      .catch(() => {
        if (!active) return;
        setErrorMsg(
          "Sebagian data langsung kawasan belum tersambung. Muat ulang halaman untuk memperbarui."
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [fetchLanding]);

  const minPrice = useMemo(() => {
    if (paketList.length === 0) return 275000;
    return Math.min(...paketList.map((p) => p.harga));
  }, [paketList]);

  const greenRidesCount = useMemo(
    () => wahanaList.filter((w) => w.status_lampu === "Hijau").length,
    [wahanaList]
  );

  return (
    <div className="flex min-h-full flex-col bg-white text-[#0F2347]">
      <Navbar />

      <main id="main-content" tabIndex={-1} className="flex-1">
        {/* Hero Full-Bleed Destinations Showcase */}
        <section className="relative overflow-hidden bg-[#002678] text-white">
          <Image
            src="/photos/hero-ancol.jpg"
            alt="Panorama kawasan wisata pantai dan Dunia Fantasi Ancol"
            priority
            width={1440}
            height={810}
            className="absolute inset-0 h-full w-full object-cover opacity-55"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-br from-[#001B57]/82 via-[#0033A0]/58 to-[#0046C7]/35"
          />

          <div className="relative z-10 mx-auto max-w-6xl px-4 py-14 sm:px-6 md:py-20">
            <div className="grid items-center gap-10 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#FFB800]/50 bg-[#0F2347]/65 px-4 py-1.5 text-xs font-semibold text-[#FFF4CC]">
                  <ShieldCheck
                    className="h-4 w-4 text-[#FFB800]"
                    aria-hidden="true"
                  />
                  <span>
                    {kawasan
                      ? `Status Hari Ini: ${kawasan.hari_ini.status_kawasan} · ${kawasan.jam_buka} - ${kawasan.jam_tutup} WIB`
                      : "Dunia Fantasi · Taman Impian Jaya Ancol, Jakarta"}
                  </span>
                </div>

                <h1
                  className="mt-5 text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Satu Portal Untuk Liburan{" "}
                  <span className="text-[#FFB800]">Tanpa Antre Panjang</span> di
                  Dufan Ancol
                </h1>

                <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#E2EEFF] sm:text-lg">
                  Rencanakan kunjungan lebih santai dengan reservasi tiket
                  berkuota resmi, pantauan kepadatan wahana langsung, saringan
                  tinggi badan anak, hingga pengambilan nomor kloter antrean
                  virtual langsung dari E-Ticket Anda.
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-3.5">
                  <Link
                    href="/home"
                    className="inline-flex min-h-[48px] items-center gap-2 rounded-full bg-[#FFB800] px-7 py-3 text-sm font-bold text-[#0F2347] shadow-[0_10px_28px_rgba(255,184,0,0.3)] transition-colors hover:bg-[#F2AA00]"
                  >
                    <span>Jelajahi Beranda</span>
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                  <Link
                    href="/pesan"
                    className="inline-flex min-h-[48px] items-center gap-2 rounded-full border-2 border-white/85 bg-white/10 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-white hover:text-[#0033A0]"
                  >
                    <Ticket className="h-4 w-4" aria-hidden="true" />
                    <span>Pesan Tiket Masuk</span>
                  </Link>
                  <Link
                    href="/wahana"
                    className="inline-flex min-h-[48px] items-center gap-2 rounded-full border border-white/30 bg-[#0F2347]/40 px-5 py-3 text-sm font-semibold text-[#E2EEFF] transition-colors hover:bg-[#0F2347]/70"
                  >
                    <Compass className="h-4 w-4" aria-hidden="true" />
                    <span>Status Wahana Live</span>
                  </Link>
                </div>
              </div>

              {/* Right Framed Feature Photo Card */}
              <div className="lg:col-span-5">
                <div className="overflow-hidden rounded-3xl border border-white/25 bg-white p-3 text-[#0F2347] shadow-[0_20px_50px_rgba(0,18,64,0.35)]">
                  <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl">
                    <PhotoSlot
                      src="/photos/unit-dufan.jpg"
                      alt="Wahana ikon Dunia Fantasi Ancol"
                      label="Dunia Fantasi Ancol"
                    />
                  </div>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 px-2 pb-1">
                    <div>
                      <p className="text-xs font-bold tracking-wide text-[#0033A0] uppercase">
                        Destinasi Unggulan
                      </p>
                      <p className="text-base font-bold text-[#0F2347]">
                        Dunia Fantasi &amp; Pesisir Ancol
                      </p>
                    </div>
                    <span className="rounded-full bg-[#FFB800] px-3.5 py-1 text-xs font-bold tabular-nums text-[#0F2347]">
                      Mulai {formatRupiah(minPrice)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {errorMsg ? (
          <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6">
            <div
              role="alert"
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#FCD34D] bg-[#FFFBEB] px-4 py-3 text-sm font-semibold text-[#78350F]"
            >
              <span>{errorMsg}</span>
              <button
                type="button"
                onClick={loadData}
                className="rounded-full bg-[#0033A0] px-4 py-1.5 text-xs font-bold text-white"
              >
                Muat Ulang
              </button>
            </div>
          </div>
        ) : null}

        {/* Live Park Telemetry Strip */}
        <section
          aria-label="Ringkasan operasional kawasan hari ini"
          className="border-b border-[#DCE6F5] bg-[#F4F8FC] py-8"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-[#DCE6F5] bg-white p-5 shadow-[0_4px_16px_rgba(0,51,160,0.04)]">
                <div className="flex items-center gap-2 text-xs font-bold text-[#0033A0]">
                  <Clock className="h-4 w-4" aria-hidden="true" />
                  <span>Jam Operasional</span>
                </div>
                <p className="mt-2 text-2xl font-extrabold tabular-nums text-[#0F2347]">
                  {kawasan
                    ? `${kawasan.jam_buka} - ${kawasan.jam_tutup}`
                    : "09:00 - 18:00"}{" "}
                  <span className="text-sm font-bold text-[#475569]">WIB</span>
                </p>
                <p className="mt-1 text-xs text-[#475569]">
                  Gerbang check-in buka sejak pukul 09:00 WIB
                </p>
              </div>

              <div className="rounded-2xl border border-[#DCE6F5] bg-white p-5 shadow-[0_4px_16px_rgba(0,51,160,0.04)]">
                <div className="flex items-center gap-2 text-xs font-bold text-[#0033A0]">
                  <Users className="h-4 w-4" aria-hidden="true" />
                  <span>Sisa Kuota Hari Ini</span>
                </div>
                <p className="mt-2 text-2xl font-extrabold tabular-nums text-[#0F2347]">
                  {loading || !kawasan
                    ? "—"
                    : kawasan.hari_ini.sisa_kuota.toLocaleString("id-ID")}
                  <span className="ml-1.5 text-sm font-semibold text-[#475569]">
                    tiket
                  </span>
                </p>
                <p className="mt-1 text-xs text-[#475569]">
                  Dari batas harian{" "}
                  {kawasan
                    ? kawasan.hari_ini.kuota_maksimal.toLocaleString("id-ID")
                    : "5.000"}{" "}
                  pengunjung
                </p>
              </div>

              <div className="rounded-2xl border border-[#DCE6F5] bg-white p-5 shadow-[0_4px_16px_rgba(0,51,160,0.04)]">
                <div className="flex items-center gap-2 text-xs font-bold text-[#14532D]">
                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                  <span>Wahana Siap Bermain</span>
                </div>
                <p className="mt-2 text-2xl font-extrabold tabular-nums text-[#0F2347]">
                  {loading ? "—" : greenRidesCount}{" "}
                  <span className="text-sm font-semibold text-[#475569]">
                    dari {wahanaList.length || 6} wahana
                  </span>
                </p>
                <p className="mt-1 text-xs text-[#475569]">
                  Berstatus Lampu Hijau dan siap menerima kloter
                </p>
              </div>

              <div className="rounded-2xl border border-[#DCE6F5] bg-white p-5 shadow-[0_4px_16px_rgba(0,51,160,0.04)]">
                <div className="flex items-center gap-2 text-xs font-bold text-[#0033A0]">
                  <Ticket className="h-4 w-4" aria-hidden="true" />
                  <span>Tiket Masuk Mulai</span>
                </div>
                <p className="mt-2 text-2xl font-extrabold tabular-nums text-[#0F2347]">
                  {formatRupiah(minPrice)}
                </p>
                <p className="mt-1 text-xs text-[#475569]">
                  Termasuk akses wahana &amp; antrean virtual
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4 Destination Zones Grid */}
        <section className="bg-white py-14">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2
                  className="text-2xl font-bold tracking-tight text-[#0F2347] sm:text-3xl"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Jelajahi Zona &amp; Kawasan Ancol
                </h2>
                <p className="mt-2 max-w-2xl text-sm text-[#475569]">
                  Pilih pengalaman sesuai selera perjalanan Anda—mulai dari
                  lintasan cepat penuh adrenalin hingga area keluarga, kuliner
                  tepi pantai, dan resor menginap.
                </p>
              </div>
              <Link
                href="/home"
                className="inline-flex min-h-[44px] shrink-0 items-center gap-1.5 rounded-full border border-[#0033A0] bg-white px-5 py-2 text-sm font-bold text-[#0033A0] transition-colors hover:bg-[#0033A0] hover:text-white"
              >
                <span>Buka Beranda Lengkap</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {ZONA_SHOWCASE.map((item) => (
                <article
                  key={item.title}
                  className="flex flex-col overflow-hidden rounded-2xl border border-[#DCE6F5] bg-white shadow-[0_6px_20px_rgba(0,51,160,0.06)] transition-transform hover:-translate-y-0.5"
                >
                  <div className="aspect-[4/3] w-full border-b border-[#DCE6F5]">
                    <PhotoSlot
                      src={item.photo}
                      alt={item.title}
                      label={item.badge}
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-between p-5">
                    <div>
                      <span className="inline-block rounded-full bg-[#EBF5FF] px-3 py-1 text-xs font-bold text-[#0033A0]">
                        {item.badge}
                      </span>
                      <h3
                        className="mt-3 text-lg font-bold text-[#0F2347]"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {item.title}
                      </h3>
                      <p className="mt-1.5 text-xs leading-relaxed text-[#475569]">
                        {item.desc}
                      </p>
                    </div>
                    <Link
                      href={item.href}
                      className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[#0033A0] hover:underline"
                    >
                      <span>Lihat Pilihan</span>
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 3 Visitor Experience Steps */}
        <section className="border-y border-[#DCE6F5] bg-[#F4F8FC] py-14">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="max-w-2xl">
              <h2
                className="text-2xl font-bold tracking-tight text-[#0F2347] sm:text-3xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Cara Praktis Menikmati Wahana Seharian
              </h2>
              <p className="mt-2 text-sm text-[#475569]">
                Tiga langkah ringkas agar waktu berlibur lebih banyak dihabiskan
                bermain daripada berdiri di jalur tunggu.
              </p>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-3">
              <article className="rounded-2xl border border-[#DCE6F5] bg-white p-6 shadow-[0_4px_16px_rgba(0,51,160,0.05)]">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EBF5FF] text-[#0033A0]">
                  <CalendarCheck className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3
                  className="mt-4 text-lg font-bold text-[#0F2347]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  1. Pilih Tanggal &amp; Amankan Kuota
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#475569]">
                  Cek sisa kapasitas harian kawasan dan dapatkan kode booking
                  serta QR E-Ticket instan setelah pembayaran dikonfirmasi.
                </p>
              </article>

              <article className="rounded-2xl border border-[#DCE6F5] bg-white p-6 shadow-[0_4px_16px_rgba(0,51,160,0.05)]">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFF6D6] text-[#8F6400]">
                  <Ruler className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3
                  className="mt-4 text-lg font-bold text-[#0F2347]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  2. Sesuaikan Tinggi &amp; Kepadatan
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#475569]">
                  Filter wahana berdasarkan tinggi badan anak dan warna lampu
                  status supaya tidak salah antre saat tiba di depan gerbang
                  permainan.
                </p>
              </article>

              <article className="rounded-2xl border border-[#DCE6F5] bg-white p-6 shadow-[0_4px_16px_rgba(0,51,160,0.05)]">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#DCFCE7] text-[#14532D]">
                  <QrCode className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3
                  className="mt-4 text-lg font-bold text-[#0F2347]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  3. Ambil Antrean Virtual Dari Ponsel
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#475569]">
                  Dapatkan nomor kloter giliran main sambil bersantap di food
                  court atau menyaksikan parade tanpa harus berdiri lama.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* Live Ticket Packages Comparison */}
        <section className="bg-white py-14">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2
                  className="text-2xl font-bold tracking-tight text-[#0F2347] sm:text-3xl"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Pilihan Paket Tiket Masuk Dufan
                </h2>
                <p className="mt-2 text-sm text-[#475569]">
                  Pilih tiket reguler atau paket bundling dengan slot antrean
                  virtual prioritas lebih banyak.
                </p>
              </div>
              <Link
                href="/pesan"
                className="inline-flex min-h-[44px] shrink-0 items-center justify-center rounded-full bg-[#0033A0] px-6 py-2 text-sm font-bold text-white transition-colors hover:bg-[#002678]"
              >
                Pesan Tiket Sekarang
              </Link>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {loading && paketList.length === 0
                ? [0, 1].map((i) => (
                  <div
                    key={i}
                    className="h-60 animate-pulse rounded-2xl border border-[#DCE6F5] bg-[#F4F8FC]"
                  />
                ))
                : paketList.map((paket) => (
                  <article
                    key={paket.id}
                    className={`flex flex-col justify-between rounded-2xl border p-6 shadow-[0_6px_24px_rgba(0,51,160,0.06)] ${paket.is_bundle
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
                            ? "Bundling Rekomendasi"
                            : "Tiket Reguler"}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-[#0033A0]">
                          <Sparkles
                            className="h-3.5 w-3.5 text-[#FFB800]"
                            aria-hidden="true"
                          />
                          Maks. {paket.jatah_antrean_aktif} antrean aktif
                        </span>
                      </div>
                      <h3
                        className="mt-4 text-xl font-bold text-[#0F2347]"
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
                        <p className="text-xs font-semibold text-[#475569]">
                          Harga per pengunjung
                        </p>
                        <p className="text-2xl font-extrabold tabular-nums text-[#0033A0]">
                          {formatRupiah(paket.harga)}
                        </p>
                      </div>
                      <Link
                        href={`/pesan?paket=${paket.id}`}
                        className={`inline-flex min-h-[44px] items-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold transition-colors ${paket.is_bundle
                          ? "bg-[#FFB800] text-[#0F2347] hover:bg-[#F2AA00]"
                          : "bg-[#0033A0] text-white hover:bg-[#002678]"
                          }`}
                      >
                        <span>Pilih Paket</span>
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    </div>
                  </article>
                ))}
            </div>
          </div>
        </section>

        {/* Live Promo & Events Teaser */}
        <section className="border-t border-[#DCE6F5] bg-[#F4F8FC] py-14">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="rounded-2xl border border-[#DCE6F5] bg-white p-6">
                <div className="flex items-center justify-between gap-3">
                  <h2
                    className="text-xl font-bold text-[#0F2347]"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Promo Aktif Minggu Ini
                  </h2>
                  <Link
                    href="/promo"
                    className="text-xs font-bold text-[#0033A0] hover:underline"
                  >
                    Semua Promo &rarr;
                  </Link>
                </div>
                <div className="mt-4 space-y-3">
                  {promoList.slice(0, 2).map((promo) => (
                    <div
                      key={promo.id}
                      className="rounded-xl border border-[#E6EEF8] bg-[#F8FBFF] p-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="rounded-full bg-[#FFB800] px-2.5 py-0.5 text-xs font-bold text-[#0F2347]">
                          {promo.diskon_badge}
                        </span>
                        <span className="text-xs font-semibold text-[#475569]">
                          Kode: {promo.kode_promo}
                        </span>
                      </div>
                      <h3 className="mt-2 text-sm font-bold text-[#0F2347]">
                        {promo.judul}
                      </h3>
                      <p className="mt-1 text-xs text-[#475569]">
                        {promo.periode}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-[#DCE6F5] bg-white p-6">
                <div className="flex items-center justify-between gap-3">
                  <h2
                    className="text-xl font-bold text-[#0F2347]"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Jadwal Parade &amp; Acara
                  </h2>
                  <Link
                    href="/acara"
                    className="text-xs font-bold text-[#0033A0] hover:underline"
                  >
                    Semua Acara &rarr;
                  </Link>
                </div>
                <div className="mt-4 space-y-3">
                  {acaraList.slice(0, 2).map((acara) => (
                    <div
                      key={acara.id}
                      className="rounded-xl border border-[#E6EEF8] bg-[#F8FBFF] p-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="rounded-full bg-[#EBF5FF] px-2.5 py-0.5 text-xs font-bold text-[#0033A0]">
                          {acara.kategori}
                        </span>
                        <span className="text-xs font-semibold text-[#475569]">
                          {acara.jam}
                        </span>
                      </div>
                      <h3 className="mt-2 text-sm font-bold text-[#0F2347]">
                        {acara.judul}
                      </h3>
                      <p className="mt-1 text-xs text-[#475569]">
                        {acara.lokasi} · {acara.jadwal}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Action Banner */}
            <div className="mt-10 flex flex-col items-start justify-between gap-6 rounded-3xl bg-[#0033A0] px-6 py-8 text-white shadow-[0_14px_38px_rgba(0,51,160,0.18)] sm:px-10 md:flex-row md:items-center">
              <div>
                <h2
                  className="text-2xl font-bold text-white"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Siap Menikmati Dunia Fantasi Hari Ini?
                </h2>
                <p className="mt-1.5 text-sm text-[#E2EEFF]">
                  Masuk ke Beranda Portal untuk melihat spotlight wahana, peta
                  kepadatan, promo, hingga panduan lengkap liburan Anda.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/home"
                  className="inline-flex min-h-[46px] items-center gap-2 rounded-full bg-[#FFB800] px-6 py-2.5 text-sm font-bold text-[#0F2347] hover:bg-[#F2AA00]"
                >
                  <span>Masuk Beranda</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/tiket-saya"
                  className="inline-flex min-h-[46px] items-center rounded-full border border-white/80 px-5 py-2.5 text-sm font-bold text-white hover:bg-white hover:text-[#0033A0]"
                >
                  Cek E-Ticket Saya
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
