"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { Check, Minus, Plus, ShieldCheck } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import {
  api,
  ApiError,
  formatRupiah,
  useAuthToken,
  useAuthUser,
} from "@/lib/api";
import type {
  KawasanInfo,
  PaketTiket,
  ReservasiTiket,
} from "@/lib/types";

function formatTanggalIndo(isoDate: string): string {
  const dt = new Date(`${isoDate}T00:00:00`);
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(dt);
}

function PesanContent() {
  const searchParams = useSearchParams();
  const initialPaketId = Number(searchParams.get("paket") || "0");

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [kawasan, setKawasan] = useState<KawasanInfo | null>(null);
  const [paketList, setPaketList] = useState<PaketTiket[]>([]);
  const user = useAuthUser();
  const hasToken = Boolean(useAuthToken());

  const [selectedTanggal, setSelectedTanggal] = useState<string>("");
  const [selectedPaketId, setSelectedPaketId] = useState<number>(0);
  const [jumlahTiket, setJumlahTiket] = useState<number>(1);
  const [metodeBayar, setMetodeBayar] = useState<string>("QRIS Instan");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [issuedTicket, setIssuedTicket] = useState<ReservasiTiket | null>(null);

  useEffect(() => {
    let active = true;
    Promise.all([api.getKawasanInfo(), api.getPaketTiket()])
      .then(([kawasanRes, paketRes]) => {
        if (!active) return;
        setKawasan(kawasanRes);
        setPaketList(paketRes);

        const openDay =
          kawasanRes.kalender_kuota.find(
            (d) => d.status_kawasan === "Buka" && d.sisa_kuota > 0
          ) || kawasanRes.kalender_kuota[0];
        if (openDay) setSelectedTanggal(openDay.tanggal);

        if (initialPaketId && paketRes.some((p) => p.id === initialPaketId)) {
          setSelectedPaketId(initialPaketId);
        } else if (paketRes[0]) {
          setSelectedPaketId(paketRes[0].id);
        }
      })
      .catch(() => {
        if (active) {
          setErrorMsg("Gagal memuat jadwal kuota dan paket tiket.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [initialPaketId]);

  const selectedPaket = useMemo(
    () => paketList.find((p) => p.id === selectedPaketId) || null,
    [paketList, selectedPaketId]
  );

  const selectedQuota = useMemo(
    () =>
      kawasan?.kalender_kuota.find((d) => d.tanggal === selectedTanggal) ||
      null,
    [kawasan, selectedTanggal]
  );

  const totalHarga = selectedPaket ? selectedPaket.harga * jumlahTiket : 0;

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedPaket || !selectedTanggal) return;
    if (!hasToken) {
      setErrorMsg(
        "Silakan masuk akun terlebih dahulu sebelum menyelesaikan pemesanan."
      );
      return;
    }
    setSubmitting(true);
    setErrorMsg(null);
    try {
      const created = await api.createReservasi({
        paket_id: selectedPaket.id,
        tanggal_kunjungan: selectedTanggal,
        jumlah_tiket: jumlahTiket,
        metode_pembayaran: metodeBayar,
      });
      setIssuedTicket(created);
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("Transaksi gagal diproses. Coba ulangi beberapa saat lagi.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main id="main-content" tabIndex={-1} className="flex-1">
      <section className="border-b border-[#DCE6F5] bg-[#F4F8FC] py-9">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h1
            className="text-3xl font-bold tracking-tight text-[#0033A0] sm:text-4xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Pesan Tiket Masuk &amp; Paket Dufan
          </h1>
          <p className="mt-2 text-sm text-[#475569]">
            Pilih tanggal kunjungan dengan kuota tersedia, tentukan paket, dan
            terima E-Ticket QR secara instan.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {issuedTicket ? (
          <div className="mx-auto max-w-xl">
            <div
              role="status"
              className="overflow-hidden rounded-2xl border border-[#DCE6F5] bg-white text-[#0F2347] shadow-xl"
            >
              <div className="p-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#86EFAC] bg-[#DCFCE7] px-3 py-1 text-xs font-bold text-[#14532D]">
                  <Check className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Pembayaran Berhasil · E-Ticket Terbit</span>
                </div>
                <h2
                  className="mt-4 text-2xl font-bold text-[#0F2347]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {issuedTicket.paket?.nama_paket || selectedPaket?.nama_paket}
                </h2>
                <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <dt className="text-xs text-[#475569]">Kode Booking</dt>
                    <dd className="font-bold tabular-nums text-[#0033A0]">
                      {issuedTicket.kode_booking}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-[#475569]">
                      Tanggal Kunjungan
                    </dt>
                    <dd className="font-bold">
                      {formatTanggalIndo(issuedTicket.tanggal_kunjungan)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-[#475569]">Jumlah Tiket</dt>
                    <dd className="font-bold tabular-nums">
                      {issuedTicket.jumlah_tiket} pengunjung
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-[#475569]">Status Masuk</dt>
                    <dd className="font-bold text-[#14532D]">
                      {issuedTicket.status_kunjungan}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="ticket-divider bg-[#F4F8FC] p-6 text-center text-[#0F2347]">
                <div className="mx-auto inline-block rounded-xl border border-[#DCE6F5] bg-white p-4">
                  <QRCodeSVG
                    value={issuedTicket.qr_token}
                    size={180}
                    level="M"
                    title={`QR Code Tiket ${issuedTicket.kode_booking}`}
                  />
                </div>
                <p className="mt-3 text-xs font-semibold text-[#475569]">
                  Token Check-in Gerbang:
                </p>
                <p className="mt-0.5 text-sm font-bold tabular-nums text-[#0033A0]">
                  {issuedTicket.qr_token}
                </p>
                <div className="mt-5 flex flex-wrap justify-center gap-3">
                  <Link
                    href="/tiket-saya"
                    className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-[#0033A0] px-5 py-2.5 text-sm font-bold text-white"
                  >
                    Buka Halaman Tiket Saya
                  </Link>
                  <Link
                    href="/wahana"
                    className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-[#0033A0] bg-white px-5 py-2.5 text-sm font-bold text-[#0033A0]"
                  >
                    Lihat Daftar Wahana
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <nav aria-label="Tahapan pemesanan" className="mb-6">
              <ol className="grid gap-2 sm:grid-cols-3">
                {[
                  { id: 1, title: "1. Tanggal & Paket" },
                  { id: 2, title: "2. Jumlah & Pengunjung" },
                  { id: 3, title: "3. Konfirmasi & Bayar" },
                ].map((item) => {
                  const active = step === item.id;
                  const done = step > item.id;
                  return (
                    <li
                      key={item.id}
                      aria-current={active ? "step" : undefined}
                      className={`rounded-xl border px-4 py-3 text-sm font-bold ${
                        active
                          ? "border-[#0033A0] bg-[#0033A0] text-white"
                          : done
                            ? "border-[#86EFAC] bg-[#DCFCE7] text-[#14532D]"
                            : "border-[#DCE6F5] bg-[#F4F8FC] text-[#475569]"
                      }`}
                    >
                      {item.title}
                    </li>
                  );
                })}
              </ol>
            </nav>

            {errorMsg ? (
              <div
                role="alert"
                className="mb-6 rounded-xl border border-[#FCA5A5] bg-[#FEE2E2] p-4 text-sm font-semibold text-[#7F1D1D]"
              >
                {errorMsg}
              </div>
            ) : null}

            {loading ? (
              <div className="h-80 animate-pulse rounded-2xl border border-[#DCE6F5] bg-[#F4F8FC]" />
            ) : (
              <div className="grid gap-6 lg:grid-cols-12">
                <form
                  onSubmit={handleCheckout}
                  className="space-y-6 lg:col-span-8"
                >
                  {step === 1 ? (
                    <div className="space-y-6 rounded-2xl border border-[#DCE6F5] bg-white p-5 shadow-[0_4px_18px_rgba(0,51,160,0.04)] sm:p-6">
                      <fieldset>
                        <legend
                          className="text-xl font-bold text-[#0F2347]"
                          style={{ fontFamily: "var(--font-display)" }}
                        >
                          Pilih Tanggal Kunjungan
                        </legend>
                        <p className="mt-1 text-xs text-[#475569]">
                          Kuota harian diperbarui otomatis sesuai jadwal
                          kunjungan kawasan.
                        </p>
                        <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                          {kawasan?.kalender_kuota.slice(0, 8).map((hari) => {
                            const full =
                              hari.sisa_kuota <= 0 ||
                              hari.status_kawasan === "Tutup";
                            const chosen = selectedTanggal === hari.tanggal;
                            return (
                              <label
                                key={hari.tanggal}
                                className={`flex flex-col rounded-xl border-2 p-3 text-left transition-colors ${
                                  full
                                    ? "cursor-not-allowed border-[#DCE6F5] bg-[#F4F8FC] opacity-55"
                                    : chosen
                                      ? "border-[#0033A0] bg-[#EBF5FF]"
                                      : "border-[#DCE6F5] bg-white hover:border-[#0033A0]/50"
                                }`}
                              >
                                <input
                                  type="radio"
                                  name="tanggal_kunjungan"
                                  value={hari.tanggal}
                                  disabled={full}
                                  checked={chosen}
                                  onChange={() =>
                                    setSelectedTanggal(hari.tanggal)
                                  }
                                  className="visually-hidden"
                                />
                                <span className="text-xs font-bold text-[#0F2347]">
                                  {formatTanggalIndo(hari.tanggal)}
                                </span>
                                <span
                                  className={`mt-1 text-[11px] font-bold tabular-nums ${
                                    full ? "text-[#7F1D1D]" : "text-[#14532D]"
                                  }`}
                                >
                                  {full
                                    ? "Kuota Penuh"
                                    : `Sisa ${hari.sisa_kuota.toLocaleString("id-ID")}`}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      </fieldset>

                      <fieldset className="border-t border-[#DCE6F5] pt-6">
                        <legend
                          className="text-xl font-bold text-[#0F2347]"
                          style={{ fontFamily: "var(--font-display)" }}
                        >
                          Pilih Paket Tiket
                        </legend>
                        <div className="mt-4 grid gap-3">
                          {paketList.map((paket) => {
                            const chosen = selectedPaketId === paket.id;
                            return (
                              <label
                                key={paket.id}
                                className={`flex flex-col justify-between gap-3 rounded-xl border-2 p-4 sm:flex-row sm:items-center ${
                                  chosen
                                    ? "border-[#0033A0] bg-[#EBF5FF]"
                                    : "border-[#DCE6F5] bg-white hover:border-[#0033A0]/50"
                                }`}
                              >
                                <div className="flex items-start gap-3">
                                  <input
                                    type="radio"
                                    name="paket_id"
                                    value={paket.id}
                                    checked={chosen}
                                    onChange={() =>
                                      setSelectedPaketId(paket.id)
                                    }
                                    className="mt-1 h-4 w-4 accent-[#0033A0]"
                                  />
                                  <div>
                                    <span className="block text-sm font-bold text-[#0F2347]">
                                      {paket.nama_paket}
                                    </span>
                                    <span className="mt-0.5 block text-xs text-[#475569]">
                                      {paket.deskripsi}
                                    </span>
                                  </div>
                                </div>
                                <span className="shrink-0 text-base font-bold tabular-nums text-[#0033A0]">
                                  {formatRupiah(paket.harga)}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      </fieldset>

                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => setStep(2)}
                          disabled={!selectedTanggal || !selectedPaket}
                          className="inline-flex min-h-[48px] items-center rounded-full bg-[#0033A0] px-6 py-3 text-sm font-bold text-white hover:bg-[#002678] disabled:bg-[#E2EAF4] disabled:text-[#475569]"
                        >
                          Lanjut ke Jumlah &amp; Pengunjung
                        </button>
                      </div>
                    </div>
                  ) : null}

                  {step === 2 ? (
                    <div className="space-y-6 rounded-2xl border border-[#DCE6F5] bg-white p-5 shadow-[0_4px_18px_rgba(0,51,160,0.04)] sm:p-6">
                      <div>
                        <h2
                          className="text-xl font-bold text-[#0F2347]"
                          style={{ fontFamily: "var(--font-display)" }}
                        >
                          Jumlah Tiket &amp; Data Pemesan
                        </h2>
                        <div className="mt-4 flex items-center justify-between rounded-xl border border-[#DCE6F5] bg-[#F4F8FC] p-4">
                          <div>
                            <p className="text-sm font-bold text-[#0F2347]">
                              Jumlah Pengunjung
                            </p>
                            <p className="text-xs text-[#475569]">
                              Maksimal 10 tiket per transaksi
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              aria-label="Kurangi jumlah tiket"
                              onClick={() =>
                                setJumlahTiket((prev) => Math.max(1, prev - 1))
                              }
                              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-[#B9C8DC] bg-white text-[#0F2347]"
                            >
                              <Minus className="h-4 w-4" aria-hidden="true" />
                            </button>
                            <span className="min-w-[2ch] text-center text-lg font-bold tabular-nums text-[#0033A0]">
                              {jumlahTiket}
                            </span>
                            <button
                              type="button"
                              aria-label="Tambah jumlah tiket"
                              onClick={() =>
                                setJumlahTiket((prev) =>
                                  Math.min(
                                    selectedQuota?.sisa_kuota || 10,
                                    Math.min(10, prev + 1)
                                  )
                                )
                              }
                              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-[#B9C8DC] bg-white text-[#0F2347]"
                            >
                              <Plus className="h-4 w-4" aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-[#DCE6F5] pt-5">
                        {hasToken && user ? (
                          <div className="rounded-xl border border-[#86EFAC] bg-[#DCFCE7] p-4 text-sm text-[#14532D]">
                            <p className="font-bold">
                              Tiket akan diterbitkan ke akun berikut:
                            </p>
                            <p className="mt-1 font-semibold">
                              {user.nama_lengkap} ({user.email})
                            </p>
                          </div>
                        ) : (
                          <div className="rounded-xl border border-[#FCD34D] bg-[#FEF3C7] p-4 text-sm text-[#78350F]">
                            <p className="font-bold">
                              Kamu belum masuk akun Jelajahin.
                            </p>
                            <p className="mt-1">
                              Masuk atau daftar terlebih dahulu supaya E-Ticket
                              otomatis tersimpan ke akunmu.
                            </p>
                            <div className="mt-3 flex flex-wrap gap-2">
                              <Link
                                href="/masuk"
                                className="inline-flex min-h-[44px] items-center rounded-full bg-[#0033A0] px-5 py-2 text-xs font-bold text-white"
                              >
                                Masuk Akun
                              </Link>
                              <Link
                                href="/daftar"
                                className="inline-flex min-h-[44px] items-center rounded-full border border-[#0033A0] bg-white px-5 py-2 text-xs font-bold text-[#0033A0]"
                              >
                                Daftar Baru
                              </Link>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap justify-between gap-3">
                        <button
                          type="button"
                          onClick={() => setStep(1)}
                          className="inline-flex min-h-[48px] items-center rounded-full border border-[#B9C8DC] bg-white px-5 py-3 text-sm font-semibold text-[#0F2347]"
                        >
                          Kembali
                        </button>
                        <button
                          type="button"
                          onClick={() => setStep(3)}
                          className="inline-flex min-h-[48px] items-center rounded-full bg-[#0033A0] px-6 py-3 text-sm font-bold text-white hover:bg-[#002678]"
                        >
                          Lanjut ke Pembayaran
                        </button>
                      </div>
                    </div>
                  ) : null}

                  {step === 3 ? (
                    <div className="space-y-6 rounded-2xl border border-[#DCE6F5] bg-white p-5 shadow-[0_4px_18px_rgba(0,51,160,0.04)] sm:p-6">
                      <fieldset>
                        <legend
                          className="text-xl font-bold text-[#0F2347]"
                          style={{ fontFamily: "var(--font-display)" }}
                        >
                          Pilih Metode Pembayaran
                        </legend>
                        <p className="mt-1 text-xs text-[#475569]">
                          Setelah dikonfirmasi, E-Ticket QR langsung siap
                          digunakan.
                        </p>
                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                          {[
                            {
                              id: "QRIS Instan",
                              desc: "Terverifikasi otomatis via QRIS",
                            },
                            {
                              id: "Virtual Account",
                              desc: "Transfer bank instan tanpa biaya",
                            },
                          ].map((m) => (
                            <label
                              key={m.id}
                              className={`flex items-start gap-3 rounded-xl border-2 p-4 ${
                                metodeBayar === m.id
                                  ? "border-[#0033A0] bg-[#EBF5FF]"
                                  : "border-[#DCE6F5] bg-white"
                              }`}
                            >
                              <input
                                type="radio"
                                name="metode_pembayaran"
                                value={m.id}
                                checked={metodeBayar === m.id}
                                onChange={() => setMetodeBayar(m.id)}
                                className="mt-1 h-4 w-4 accent-[#0033A0]"
                              />
                              <div>
                                <span className="block text-sm font-bold text-[#0F2347]">
                                  {m.id}
                                </span>
                                <span className="mt-0.5 block text-xs text-[#475569]">
                                  {m.desc}
                                </span>
                              </div>
                            </label>
                          ))}
                        </div>
                      </fieldset>

                      <div className="flex flex-wrap justify-between gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setStep(2)}
                          className="inline-flex min-h-[48px] items-center rounded-full border border-[#B9C8DC] bg-white px-5 py-3 text-sm font-semibold text-[#0F2347]"
                        >
                          Kembali
                        </button>
                        <button
                          type="submit"
                          disabled={submitting || !hasToken}
                          className="inline-flex min-h-[48px] items-center rounded-full bg-[#FFB800] px-6 py-3 text-sm font-bold text-[#0F2347] hover:bg-[#F2AA00] disabled:bg-[#E2EAF4] disabled:text-[#475569]"
                        >
                          {submitting
                            ? "Memproses Tiket..."
                            : `Bayar ${formatRupiah(totalHarga)} & Terbitkan E-Ticket`}
                        </button>
                      </div>
                    </div>
                  ) : null}
                </form>

                <aside className="lg:col-span-4">
                  <div className="sticky top-24 rounded-2xl border border-[#DCE6F5] bg-[#F4F8FC] p-5 sm:p-6">
                    <h2
                      className="text-xl font-bold text-[#0F2347]"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      Ringkasan Pesanan
                    </h2>
                    <dl className="mt-4 space-y-3 text-sm">
                      <div className="flex justify-between gap-2">
                        <dt className="text-[#475569]">Tanggal Kunjungan</dt>
                        <dd className="font-bold text-[#0F2347]">
                          {selectedTanggal
                            ? formatTanggalIndo(selectedTanggal)
                            : "-"}
                        </dd>
                      </div>
                      <div className="flex justify-between gap-2">
                        <dt className="text-[#475569]">Paket</dt>
                        <dd className="text-right font-bold text-[#0F2347]">
                          {selectedPaket?.nama_paket || "-"}
                        </dd>
                      </div>
                      <div className="flex justify-between gap-2">
                        <dt className="text-[#475569]">Harga Satuan</dt>
                        <dd className="font-semibold tabular-nums text-[#0F2347]">
                          {selectedPaket
                            ? formatRupiah(selectedPaket.harga)
                            : "-"}
                        </dd>
                      </div>
                      <div className="flex justify-between gap-2">
                        <dt className="text-[#475569]">Jumlah Tiket</dt>
                        <dd className="font-semibold tabular-nums text-[#0F2347]">
                          {jumlahTiket} orang
                        </dd>
                      </div>
                    </dl>

                    <div className="ticket-divider mt-5 pt-4">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-sm font-bold text-[#0F2347]">
                          Total Bayar
                        </span>
                        <span className="text-2xl font-bold tabular-nums text-[#0033A0]">
                          {formatRupiah(totalHarga)}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 flex items-start gap-2 rounded-xl border border-[#CBE2FF] bg-[#EBF5FF] p-3 text-xs text-[#0F2347]">
                      <ShieldCheck
                        className="mt-0.5 h-4 w-4 shrink-0 text-[#0033A0]"
                        aria-hidden="true"
                      />
                      <span>
                        Setelah terbit, E-Ticket dapat langsung dibuka di
                        halaman Tiket Saya untuk scan masuk gerbang.
                      </span>
                    </div>
                  </div>
                </aside>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}

export default function PesanPage() {
  return (
    <div className="flex min-h-full flex-col bg-white text-[#0F2347]">
      <Navbar />
      <Suspense
        fallback={
          <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-12 sm:px-6">
            <div className="h-72 animate-pulse rounded-2xl bg-[#F4F8FC]" />
          </main>
        }
      >
        <PesanContent />
      </Suspense>
      <Footer />
    </div>
  );
}
