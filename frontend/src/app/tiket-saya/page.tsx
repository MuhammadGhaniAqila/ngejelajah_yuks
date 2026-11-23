"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { RefreshCw, Ticket } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { api, ApiError, formatRupiah, useAuthToken } from "@/lib/api";
import type { AntreanVirtual, ReservasiTiket } from "@/lib/types";

export default function TiketSayaPage() {
  const token = useAuthToken();
  const hasToken = Boolean(token);
  const [tiketList, setTiketList] = useState<ReservasiTiket[]>([]);
  const [antreanList, setAntreanList] = useState<AntreanVirtual[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);

  const handleRefresh = useCallback(() => {
    if (!token) return;
    setLoading(true);
    setErrorMsg(null);
    Promise.all([api.getReservasiSaya(), api.getAntreanSaya()])
      .then(([tiketRes, antreanRes]) => {
        setTiketList(tiketRes);
        setAntreanList(antreanRes);
      })
      .catch((err) => {
        if (err instanceof ApiError && err.status === 401) {
          setErrorMsg("Sesi masuk berakhir. Silakan login kembali.");
        } else {
          setErrorMsg("Gagal memuat data tiket dan antrean.");
        }
      })
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    if (!token) return;
    let active = true;
    Promise.all([api.getReservasiSaya(), api.getAntreanSaya()])
      .then(([tiketRes, antreanRes]) => {
        if (!active) return;
        setTiketList(tiketRes);
        setAntreanList(antreanRes);
      })
      .catch((err) => {
        if (!active) return;
        if (err instanceof ApiError && err.status === 401) {
          setErrorMsg("Sesi masuk berakhir. Silakan login kembali.");
        } else {
          setErrorMsg("Gagal memuat data tiket dan antrean.");
        }
      });
    return () => {
      active = false;
    };
  }, [token]);

  async function handleBatalkanAntrean(id: number) {
    setBusyId(id);
    setErrorMsg(null);
    try {
      await api.batalkanAntrean(id);
      handleRefresh();
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("Gagal membatalkan antrean.");
      }
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="flex min-h-full flex-col bg-white text-[#0F2347]">
      <Navbar />

      <main id="main-content" tabIndex={-1} className="flex-1">
        <section className="border-b border-[#DCE6F5] bg-[#F4F8FC] py-9">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 sm:flex-row sm:items-end sm:justify-between sm:px-6">
            <div>
              <h1
                className="text-3xl font-bold tracking-tight text-[#0033A0] sm:text-4xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                E-Ticket QR &amp; Antrean Virtual Saya
              </h1>
              <p className="mt-2 text-sm text-[#475569]">
                Tunjukkan QR Code di pintu masuk untuk validasi petugas, lalu
                pantau panggilan kloter wahana di sini.
              </p>
            </div>
            {hasToken ? (
              <button
                type="button"
                onClick={handleRefresh}
                className="inline-flex min-h-[44px] shrink-0 items-center gap-2 rounded-full bg-[#0033A0] px-5 py-2 text-sm font-bold text-white hover:bg-[#002678]"
              >
                <RefreshCw className="h-4 w-4" aria-hidden="true" />
                <span>Segarkan Status</span>
              </button>
            ) : null}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          {!hasToken ? (
            <div className="mx-auto max-w-lg rounded-2xl border border-[#DCE6F5] bg-[#F4F8FC] p-8 text-center">
              <Ticket
                className="mx-auto h-8 w-8 text-[#0033A0]"
                aria-hidden="true"
              />
              <h2
                className="mt-3 text-2xl font-bold text-[#0F2347]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Masuk untuk melihat tiket dan antreanmu
              </h2>
              <p className="mt-2 text-sm text-[#475569]">
                E-Ticket yang dibeli maupun antrean virtual wahana akan tampil
                otomatis di halaman ini.
              </p>
              <div className="mt-5 flex justify-center gap-3">
                <Link
                  href="/masuk"
                  className="inline-flex min-h-[44px] items-center rounded-full bg-[#0033A0] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#002678]"
                >
                  Masuk Akun
                </Link>
                <Link
                  href="/pesan"
                  className="inline-flex min-h-[44px] items-center rounded-full border border-[#0033A0] bg-white px-5 py-2.5 text-sm font-bold text-[#0033A0]"
                >
                  Lihat Paket Tiket
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-10">
              {errorMsg ? (
                <div
                  role="alert"
                  className="rounded-xl border border-[#FCA5A5] bg-[#FEE2E2] p-4 text-sm font-semibold text-[#7F1D1D]"
                >
                  {errorMsg}
                </div>
              ) : null}

              <div>
                <h2
                  className="text-2xl font-bold text-[#0F2347]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Daftar E-Ticket Kawasan
                </h2>

                {loading ? (
                  <div className="mt-4 grid gap-5 md:grid-cols-2">
                    {[0, 1].map((i) => (
                      <div
                        key={i}
                        className="h-64 animate-pulse rounded-2xl bg-[#F4F8FC]"
                      />
                    ))}
                  </div>
                ) : tiketList.length === 0 ? (
                  <div className="mt-4 rounded-2xl border border-[#DCE6F5] bg-[#F4F8FC] p-6 text-sm text-[#475569]">
                    Kamu belum memiliki tiket kunjungan.{" "}
                    <Link
                      href="/pesan"
                      className="font-bold text-[#0033A0] underline"
                    >
                      Pesan tiket sekarang
                    </Link>
                    .
                  </div>
                ) : (
                  <div className="mt-4 grid gap-6 md:grid-cols-2">
                    {tiketList.map((tiket) => {
                      const active =
                        tiket.status_kunjungan === "Aktif di Kawasan";
                      return (
                        <article
                          key={tiket.id}
                          className="overflow-hidden rounded-2xl border border-[#DCE6F5] bg-white text-[#0F2347] shadow-[0_6px_22px_rgba(0,51,160,0.06)]"
                        >
                          <div className="p-5">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <span className="text-xs font-bold tracking-wider text-[#0033A0]">
                                {tiket.kode_booking}
                              </span>
                              <span
                                className={`rounded-full border px-3 py-1 text-xs font-bold ${
                                  active
                                    ? "border-[#86EFAC] bg-[#DCFCE7] text-[#14532D]"
                                    : "border-[#FCD34D] bg-[#FEF3C7] text-[#78350F]"
                                }`}
                              >
                                {tiket.status_kunjungan}
                              </span>
                            </div>
                            <h3
                              className="mt-2 text-2xl font-bold text-[#0F2347]"
                              style={{ fontFamily: "var(--font-display)" }}
                            >
                              {tiket.paket?.nama_paket || "Tiket Kawasan"}
                            </h3>
                            <p className="mt-1 text-xs text-[#475569]">
                              Kunjungan: {tiket.tanggal_kunjungan} ·{" "}
                              {tiket.jumlah_tiket} orang ·{" "}
                              {formatRupiah(tiket.total_harga)}
                            </p>
                          </div>

                          <div className="ticket-divider flex flex-col items-center gap-4 bg-[#F4F8FC] p-5 sm:flex-row">
                            <div className="shrink-0 rounded-xl border border-[#DCE6F5] bg-white p-2.5">
                              <QRCodeSVG
                                value={tiket.qr_token}
                                size={116}
                                level="M"
                                title={`QR Tiket ${tiket.kode_booking}`}
                              />
                            </div>
                            <div className="text-center sm:text-left">
                              <p className="text-xs font-semibold text-[#475569]">
                                Token Validasi Petugas Gerbang
                              </p>
                              <p className="mt-1 break-all text-sm font-bold tabular-nums text-[#0033A0]">
                                {tiket.qr_token}
                              </p>
                              <p className="mt-2 text-xs leading-relaxed text-[#475569]">
                                {active
                                  ? "Tiket sudah aktif! Kamu bisa langsung mengambil antrean virtual wahana."
                                  : "Tunjukkan QR ini ke petugas di pintu gerbang kawasan untuk aktivasi."}
                              </p>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                )}
              </div>

              <div>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2
                    className="text-2xl font-bold text-[#0F2347]"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Antrean Virtual &amp; Riwayat
                  </h2>
                  <Link
                    href="/wahana"
                    className="inline-flex min-h-[44px] items-center rounded-full border border-[#0033A0] bg-white px-5 py-2 text-sm font-bold text-[#0033A0] hover:bg-[#0033A0] hover:text-white"
                  >
                    Cari Wahana Lain
                  </Link>
                </div>

                {loading ? (
                  <div className="mt-4 h-40 animate-pulse rounded-2xl bg-[#F4F8FC]" />
                ) : antreanList.length === 0 ? (
                  <div className="mt-4 rounded-2xl border border-[#DCE6F5] bg-[#F4F8FC] p-6 text-sm text-[#475569]">
                    Belum ada antrean virtual yang diambil. Buka halaman{" "}
                    <Link
                      href="/wahana"
                      className="font-bold text-[#0033A0] underline"
                    >
                      Wahana
                    </Link>{" "}
                    untuk mengambil slot kloter.
                  </div>
                ) : (
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    {antreanList.map((antrean) => {
                      const isCalled = antrean.status_antrean === "Dipanggil";
                      const isWaiting = antrean.status_antrean === "Menunggu";
                      return (
                        <article
                          key={antrean.id}
                          className={`rounded-2xl border p-5 shadow-[0_4px_14px_rgba(0,51,160,0.04)] ${
                            isCalled
                              ? "border-[#0033A0] bg-[#EBF5FF]"
                              : "border-[#DCE6F5] bg-white"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <span className="text-2xl font-bold tabular-nums text-[#0033A0]">
                                {antrean.nomor_antrean}
                              </span>
                              <h3 className="mt-1 text-lg font-bold text-[#0F2347]">
                                {antrean.wahana?.nama_wahana || "Wahana Jelajahin"}
                              </h3>
                              <p className="mt-1 text-xs text-[#475569]">
                                Kloter {antrean.nomor_kloter} · Estimasi tunggu{" "}
                                {antrean.estimasi_tunggu_menit} menit
                              </p>
                            </div>
                            <span
                              className={`rounded-full border px-3 py-1 text-xs font-bold ${
                                isCalled
                                  ? "border-[#0033A0] bg-[#0033A0] text-white"
                                  : isWaiting
                                    ? "border-[#FCD34D] bg-[#FEF3C7] text-[#78350F]"
                                    : antrean.status_antrean === "Selesai"
                                      ? "border-[#86EFAC] bg-[#DCFCE7] text-[#14532D]"
                                      : "border-[#CBD5E1] bg-[#F1F5F9] text-[#334155]"
                              }`}
                            >
                              {isCalled
                                ? "Dipanggil! Menuju Pintu"
                                : antrean.status_antrean}
                            </span>
                          </div>

                          {isWaiting ? (
                            <div className="mt-4 border-t border-[#E6EEF8] pt-3">
                              <button
                                type="button"
                                disabled={busyId === antrean.id}
                                onClick={() =>
                                  handleBatalkanAntrean(antrean.id)
                                }
                                className="inline-flex min-h-[44px] items-center rounded-full border border-[#FCA5A5] bg-[#FEE2E2] px-4 py-2 text-xs font-bold text-[#7F1D1D] hover:bg-[#FECACA]"
                              >
                                {busyId === antrean.id
                                  ? "Membatalkan..."
                                  : "Batalkan Antrean"}
                              </button>
                            </div>
                          ) : null}
                        </article>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
