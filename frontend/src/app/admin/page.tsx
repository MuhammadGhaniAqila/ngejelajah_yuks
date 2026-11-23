"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { useCallback, useEffect, useState } from "react";
import {
  Check,
  ExternalLink,
  Eye,
  EyeOff,
  LockKeyhole,
  Plus,
  QrCode,
  RefreshCw,
  ShieldCheck,
  Ticket,
  Trash2,
  Users,
  Zap,
} from "lucide-react";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { CrowdBadge, LampuBadge } from "@/components/StatusBadges";
import {
  ApiError,
  FILAMENT_ADMIN_URL,
  api,
  clearAuthSession,
  formatRupiah,
  saveAuthSession,
  useAuthToken,
  useAuthUser,
} from "@/lib/api";
import type { AdminOverviewResponse, Wahana } from "@/lib/types";
import "./admin-table.css";

type AdminTab = "wahana" | "reservasi" | "kuota";

const LAMP_OPTIONS: Wahana["status_lampu"][] = [
  "Hijau",
  "Merah",
  "Maintenance",
];
const CROWD_OPTIONS: Wahana["crowd_meter"][] = ["Sepi", "Sedang", "Padat"];

export default function AdminDashboardPage() {
  const user = useAuthUser();
  const token = useAuthToken();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authSubmitting, setAuthSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [overview, setOverview] = useState<AdminOverviewResponse | null>(null);
  const [loadingData, setLoadingData] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>("wahana");
  const [notice, setNotice] = useState<{
    type: "ok" | "err";
    text: string;
  } | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const [kodeCheckIn, setKodeCheckIn] = useState("");

  // Form tambah wahana
  const [namaWahana, setNamaWahana] = useState("");
  const [zonaWahana, setZonaWahana] = useState<Wahana["zona"]>("Ekstrem");
  const [deskripsiWahana, setDeskripsiWahana] = useState("");
  const [tinggiMin, setTinggiMin] = useState("120");
  const [kategoriUsia, setKategoriUsia] = useState("Remaja & Dewasa");
  const [kapasitasKloter, setKapasitasKloter] = useState("24");
  const [durasiMenit, setDurasiMenit] = useState("5");

  const isStaff = user?.role === "admin" || user?.role === "operator";

  const loadOverview = useCallback(async () => {
    if (!token || !isStaff) return;
    setLoadingData(true);
    try {
      const data = await api.getAdminOverview();
      setOverview(data);
    } catch (err) {
      setNotice({
        type: "err",
        text:
          err instanceof ApiError
            ? err.message
            : "Gagal memuat data operasional admin.",
      });
    } finally {
      setLoadingData(false);
    }
  }, [token, isStaff]);

  useEffect(() => {
    if (!token || !isStaff) return;
    let active = true;
    api
      .getAdminOverview()
      .then((data) => {
        if (active) setOverview(data);
      })
      .catch((err) => {
        if (!active) return;
        setNotice({
          type: "err",
          text:
            err instanceof ApiError
              ? err.message
              : "Gagal memuat data operasional admin.",
        });
      });
    return () => {
      active = false;
    };
  }, [token, isStaff]);

  async function handleAdminLogin(e: React.FormEvent) {
    e.preventDefault();
    setAuthSubmitting(true);
    setAuthError(null);
    try {
      const res = await api.login({ email, password });
      if (res.user.role !== "admin" && res.user.role !== "operator") {
        setAuthError(
          "Akun ini berstatus pengunjung (wisatawan). Silakan masuk dengan akun Admin atau Operator."
        );
        return;
      }
      saveAuthSession(res.token, res.user);
      setNotice(null);
    } catch (err) {
      setAuthError(
        err instanceof ApiError
          ? err.message
          : "Gagal masuk. Periksa email dan kata sandi petugas."
      );
    } finally {
      setAuthSubmitting(false);
    }
  }

  async function handleUpdateLampu(
    wahanaId: number,
    status_lampu: Wahana["status_lampu"]
  ) {
    setBusyId(`lampu-${wahanaId}`);
    setNotice(null);
    try {
      await api.updateWahanaOperasional(wahanaId, { status_lampu });
      await loadOverview();
      setNotice({
        type: "ok",
        text: `Status lampu wahana diperbarui menjadi ${status_lampu}.`,
      });
    } catch (err) {
      setNotice({
        type: "err",
        text:
          err instanceof ApiError ? err.message : "Gagal memperbarui lampu.",
      });
    } finally {
      setBusyId(null);
    }
  }

  async function handleUpdateCrowd(
    wahanaId: number,
    crowd_meter: Wahana["crowd_meter"]
  ) {
    setBusyId(`crowd-${wahanaId}`);
    setNotice(null);
    try {
      await api.updateWahanaOperasional(wahanaId, { crowd_meter });
      await loadOverview();
      setNotice({
        type: "ok",
        text: `Kepadatan wahana diperbarui menjadi ${crowd_meter}.`,
      });
    } catch (err) {
      setNotice({
        type: "err",
        text:
          err instanceof ApiError
            ? err.message
            : "Gagal memperbarui kepadatan.",
      });
    } finally {
      setBusyId(null);
    }
  }

  async function handlePanggilKloter(wahanaId: number) {
    setBusyId(`kloter-${wahanaId}`);
    setNotice(null);
    try {
      const updated = await api.panggilKloterWahana(wahanaId);
      await loadOverview();
      setNotice({
        type: "ok",
        text: `Kloter #${updated.kloter_berjalan} untuk ${updated.nama_wahana} berhasil dipanggil.`,
      });
    } catch (err) {
      setNotice({
        type: "err",
        text:
          err instanceof ApiError ? err.message : "Gagal memanggil kloter.",
      });
    } finally {
      setBusyId(null);
    }
  }

  async function handleDeleteWahana(wahanaId: number, nama: string) {
    setBusyId(`del-${wahanaId}`);
    setNotice(null);
    try {
      await api.deleteWahana(wahanaId);
      await loadOverview();
      setNotice({ type: "ok", text: `Wahana "${nama}" berhasil dihapus.` });
    } catch (err) {
      setNotice({
        type: "err",
        text: err instanceof ApiError ? err.message : "Gagal menghapus wahana.",
      });
    } finally {
      setBusyId(null);
    }
  }

  async function handleCreateWahana(e: React.FormEvent) {
    e.preventDefault();
    setBusyId("create-wahana");
    setNotice(null);
    try {
      await api.createWahana({
        nama_wahana: namaWahana,
        zona: zonaWahana,
        deskripsi: deskripsiWahana,
        gambar_url: "/photos/unit-dufan.jpg",
        tinggi_minimal_cm: Number(tinggiMin) || 0,
        kategori_usia: kategoriUsia,
        kapasitas_kloter: Number(kapasitasKloter) || 20,
        durasi_menit: Number(durasiMenit) || 5,
      });
      setNamaWahana("");
      setDeskripsiWahana("");
      await loadOverview();
      setNotice({ type: "ok", text: "Wahana baru berhasil ditambahkan." });
    } catch (err) {
      setNotice({
        type: "err",
        text:
          err instanceof ApiError ? err.message : "Gagal menambah wahana baru.",
      });
    } finally {
      setBusyId(null);
    }
  }

  async function handleCheckIn(kodeTarget: string) {
    if (!kodeTarget.trim()) return;
    setBusyId(`checkin-${kodeTarget}`);
    setNotice(null);
    try {
      await api.checkInTiket(kodeTarget.trim());
      setKodeCheckIn("");
      await loadOverview();
      setNotice({
        type: "ok",
        text: `Check-in gerbang berhasil untuk kode ${kodeTarget.trim()}.`,
      });
    } catch (err) {
      setNotice({
        type: "err",
        text: err instanceof ApiError ? err.message : "Validasi kode gagal.",
      });
    } finally {
      setBusyId(null);
    }
  }

  async function handleToggleKuotaStatus(
    tanggal: string,
    kuotaMaks: number,
    currentStatus: "Buka" | "Tutup"
  ) {
    const nextStatus = currentStatus === "Buka" ? "Tutup" : "Buka";
    setBusyId(`kuota-${tanggal}`);
    setNotice(null);
    try {
      await api.updateKuotaHarian(tanggal, {
        kuota_maksimal: kuotaMaks,
        status_kawasan: nextStatus,
      });
      await loadOverview();
      setNotice({
        type: "ok",
        text: `Status kawasan tanggal ${tanggal} diubah menjadi ${nextStatus}.`,
      });
    } catch (err) {
      setNotice({
        type: "err",
        text:
          err instanceof ApiError
            ? err.message
            : "Gagal memperbarui kuota harian.",
      });
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="flex min-h-full flex-col bg-[#F4F8FC] text-[#0F2347]">
      <Navbar />

      <main
        id="main-content"
        tabIndex={-1}
        className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6"
      >
        {!user || !token ? (
          <div className="mx-auto max-w-md rounded-3xl border border-[#DCE6F5] bg-white p-6 shadow-[0_8px_28px_rgba(0,51,160,0.08)] sm:p-8">
            <div className="flex items-center gap-2 text-xs font-bold text-[#0033A0] uppercase">
              <LockKeyhole className="h-4 w-4" aria-hidden="true" />
              <span>Dashboard Petugas &amp; Admin</span>
            </div>
            <h1
              className="mt-2 text-2xl font-bold text-[#0F2347]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Masuk Panel Admin Jelajahin
            </h1>
            <p className="mt-1.5 text-sm text-[#475569]">
              Masuk dengan akun Admin atau Operator untuk mengatur status lampu
              wahana, memanggil kloter antrean, memvalidasi QR check-in, dan
              mengelola kuota kawasan.
            </p>

            {authError ? (
              <div
                role="alert"
                className="mt-4 rounded-xl border border-[#FCA5A5] bg-[#FEE2E2] p-3 text-sm font-semibold text-[#7F1D1D]"
              >
                {authError}
              </div>
            ) : null}

            <form onSubmit={handleAdminLogin} className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="admin-email"
                  className="block text-sm font-semibold text-[#0F2347]"
                >
                  Email Petugas
                </label>
                <input
                  id="admin-email"
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="username"
                  spellCheck={false}
                  enterKeyHint="next"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@jelajahin.id"
                  className="mt-1.5 min-h-[48px] w-full rounded-xl border border-[#B9C8DC] bg-white px-3.5 py-2 text-base text-[#0F2347]"
                />
              </div>

              <div>
                <label
                  htmlFor="admin-password"
                  className="block text-sm font-semibold text-[#0F2347]"
                >
                  Kata Sandi
                </label>
                <div className="relative mt-1.5">
                  <input
                    id="admin-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    enterKeyHint="done"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan kata sandi"
                    className="min-h-[48px] w-full rounded-xl border border-[#B9C8DC] bg-white py-2 pr-12 pl-3.5 text-base text-[#0F2347]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-pressed={showPassword}
                    aria-label={
                      showPassword
                        ? "Sembunyikan kata sandi"
                        : "Tampilkan kata sandi"
                    }
                    className="absolute inset-y-0 right-1 my-auto flex h-10 w-10 items-center justify-center rounded-lg text-[#475569] hover:text-[#0033A0]"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <Eye className="h-4 w-4" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={authSubmitting}
                className="inline-flex min-h-[48px] w-full items-center justify-center rounded-full bg-[#0033A0] px-5 py-3 text-sm font-bold text-white hover:bg-[#002678] disabled:bg-[#E2EAF4] disabled:text-[#475569]"
              >
                {authSubmitting ? "Memeriksa Akses..." : "Masuk Dashboard Admin"}
              </button>
            </form>

            <div className="mt-5 border-t border-[#E6EEF8] pt-4 text-center">
              <a
                href={FILAMENT_ADMIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0033A0] hover:underline"
              >
                <span>Buka Panel Filament CMS</span>
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </div>
          </div>
        ) : !isStaff ? (
          <div className="mx-auto max-w-lg rounded-3xl border border-[#FCA5A5] bg-white p-8 text-center shadow-sm">
            <h1
              className="text-2xl font-bold text-[#0F2347]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Akses Terbatas Khusus Petugas
            </h1>
            <p className="mt-2 text-sm text-[#475569]">
              Saat ini Anda masuk sebagai <strong>{user.nama_lengkap}</strong> (
              {user.role}). Halaman <code>/admin</code> hanya dapat dibuka oleh
              akun ber-role <strong>admin</strong> atau{" "}
              <strong>operator</strong>.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => clearAuthSession()}
                className="inline-flex min-h-[44px] items-center rounded-full bg-[#0033A0] px-5 py-2 text-sm font-bold text-white"
              >
                Keluar &amp; Masuk Akun Admin
              </button>
              <Link
                href="/"
                className="inline-flex min-h-[44px] items-center rounded-full border border-[#0033A0] px-5 py-2 text-sm font-bold text-[#0033A0]"
              >
                Kembali ke Beranda
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header Bar */}
            <section className="flex flex-col justify-between gap-4 rounded-3xl bg-[#0033A0] px-6 py-6 text-white shadow-[0_12px_32px_rgba(0,51,160,0.18)] md:flex-row md:items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-bold text-[#FFF4CC]">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#FFB800]" aria-hidden="true" />
                  <span>
                    {user.nama_lengkap} · Role: {user.role.toUpperCase()}
                  </span>
                </div>
                <h1
                  className="mt-2.5 text-2xl font-bold tracking-tight sm:text-3xl"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Dashboard Admin &amp; Operasional Kawasan
                </h1>
              </div>

              <div className="flex flex-wrap gap-2.5">
                <button
                  type="button"
                  onClick={() => void loadOverview()}
                  disabled={loadingData}
                  className="inline-flex min-h-[42px] items-center gap-2 rounded-full border border-white/60 bg-white/10 px-4 py-2 text-xs font-bold text-white hover:bg-white hover:text-[#0033A0]"
                >
                  <RefreshCw
                    className={`h-3.5 w-3.5 ${loadingData ? "animate-spin" : ""}`}
                    aria-hidden="true"
                  />
                  <span>Segarkan</span>
                </button>
                <a
                  href={FILAMENT_ADMIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[42px] items-center gap-2 rounded-full bg-[#FFB800] px-5 py-2 text-xs font-bold text-[#0F2347] hover:bg-[#F2AA00]"
                >
                  <span>Panel Filament Lengkap</span>
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </div>
            </section>

            {notice ? (
              <div
                role="status"
                className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${
                  notice.type === "ok"
                    ? "border-[#86EFAC] bg-[#DCFCE7] text-[#14532D]"
                    : "border-[#FCA5A5] bg-[#FEE2E2] text-[#7F1D1D]"
                }`}
              >
                {notice.text}
              </div>
            ) : null}

            {/* 4 KPI Summary Cards */}
            <section
              aria-label="Ringkasan statistik operasional"
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
            >
              <div className="rounded-2xl border border-[#DCE6F5] bg-white p-5">
                <p className="flex items-center gap-1.5 text-xs font-bold text-[#0033A0]">
                  <Users className="h-4 w-4" aria-hidden="true" />
                  <span>Kuota Hari Ini</span>
                </p>
                <p className="mt-2 text-2xl font-extrabold tabular-nums text-[#0F2347]">
                  {overview
                    ? `${overview.stats.kuota_hari_ini.sisa_kuota.toLocaleString("id-ID")} / ${overview.stats.kuota_hari_ini.kuota_maksimal.toLocaleString("id-ID")}`
                    : "—"}
                </p>
                <p className="mt-1 text-xs text-[#475569]">
                  Status kawasan:{" "}
                  <strong>
                    {overview?.stats.kuota_hari_ini.status_kawasan ?? "-"}
                  </strong>
                </p>
              </div>

              <div className="rounded-2xl border border-[#DCE6F5] bg-white p-5">
                <p className="flex items-center gap-1.5 text-xs font-bold text-[#0033A0]">
                  <Ticket className="h-4 w-4" aria-hidden="true" />
                  <span>Tiket Terjual (Lunas)</span>
                </p>
                <p className="mt-2 text-2xl font-extrabold tabular-nums text-[#0F2347]">
                  {overview ? `${overview.stats.total_tiket_terjual} tiket` : "—"}
                </p>
                <p className="mt-1 text-xs tabular-nums text-[#475569]">
                  Omzet:{" "}
                  <strong>
                    {overview
                      ? formatRupiah(overview.stats.total_pendapatan)
                      : "-"}
                  </strong>
                </p>
              </div>

              <div className="rounded-2xl border border-[#DCE6F5] bg-white p-5">
                <p className="flex items-center gap-1.5 text-xs font-bold text-[#14532D]">
                  <QrCode className="h-4 w-4" aria-hidden="true" />
                  <span>Aktif di Kawasan</span>
                </p>
                <p className="mt-2 text-2xl font-extrabold tabular-nums text-[#0F2347]">
                  {overview
                    ? `${overview.stats.tiket_aktif_kawasan} reservasi`
                    : "—"}
                </p>
                <p className="mt-1 text-xs text-[#475569]">
                  Sudah lolos check-in gerbang
                </p>
              </div>

              <div className="rounded-2xl border border-[#DCE6F5] bg-white p-5">
                <p className="flex items-center gap-1.5 text-xs font-bold text-[#8F6400]">
                  <Zap className="h-4 w-4" aria-hidden="true" />
                  <span>Antrean Virtual Aktif</span>
                </p>
                <p className="mt-2 text-2xl font-extrabold tabular-nums text-[#0F2347]">
                  {overview ? overview.stats.antrean_aktif : "—"}
                </p>
                <p className="mt-1 text-xs text-[#475569]">
                  Wahana Lampu Hijau: {overview?.stats.wahana_hijau ?? 0} ·
                  Maintenance: {overview?.stats.wahana_maintenance ?? 0}
                </p>
              </div>
            </section>

            {/* Navigation Switcher Tabs */}
            <div
              className="flex flex-nowrap items-center gap-2 overflow-x-auto pb-1"
              role="group"
              aria-label="Menu bagian dashboard admin"
            >
              {(
                [
                  ["wahana", "Operasional Wahana"],
                  ["reservasi", "Check-In Gerbang & Reservasi"],
                  ["kuota", "Kuota Harian & Antrean Aktif"],
                ] as const
              ).map(([key, label]) => {
                const active = activeTab === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setActiveTab(key)}
                    aria-pressed={active}
                    className={`inline-flex min-h-[44px] shrink-0 items-center gap-1.5 rounded-full border-2 px-5 py-2 text-xs font-bold transition-colors ${
                      active
                        ? "border-[#0033A0] bg-[#0033A0] text-white"
                        : "border-[#DCE6F5] bg-white text-[#475569] hover:border-[#0033A0] hover:text-[#0033A0]"
                    }`}
                  >
                    {active ? (
                      <Check className="h-3.5 w-3.5" aria-hidden="true" />
                    ) : null}
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>

            {!overview && notice?.type !== "err" ? (
              <div className="grid gap-4 md:grid-cols-2">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-44 animate-pulse rounded-2xl border border-[#DCE6F5] bg-white"
                  />
                ))}
              </div>
            ) : null}

            {/* TAB 1: Operasional Wahana */}
            {overview && activeTab === "wahana" ? (
              <section className="space-y-6">
                <details className="rounded-2xl border border-[#DCE6F5] bg-white p-5">
                  <summary className="inline-flex cursor-pointer list-none items-center gap-2 text-sm font-bold text-[#0033A0]">
                    <Plus className="h-4 w-4" aria-hidden="true" />
                    <span>Tambah Wahana Baru</span>
                  </summary>
                  <form
                    onSubmit={handleCreateWahana}
                    className="mt-4 grid gap-4 border-t border-[#E6EEF8] pt-4 sm:grid-cols-2"
                  >
                    <div>
                      <label
                        htmlFor="new-nama"
                        className="block text-xs font-bold text-[#0F2347]"
                      >
                        Nama Wahana
                      </label>
                      <input
                        id="new-nama"
                        type="text"
                        required
                        value={namaWahana}
                        onChange={(e) => setNamaWahana(e.target.value)}
                        placeholder="Contoh: Tornado Dufan"
                        className="mt-1 min-h-[42px] w-full rounded-xl border border-[#B9C8DC] px-3 text-sm"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="new-zona"
                        className="block text-xs font-bold text-[#0F2347]"
                      >
                        Zona Wahana
                      </label>
                      <select
                        id="new-zona"
                        value={zonaWahana}
                        onChange={(e) =>
                          setZonaWahana(e.target.value as Wahana["zona"])
                        }
                        className="mt-1 min-h-[42px] w-full rounded-xl border border-[#B9C8DC] px-3 text-sm"
                      >
                        <option value="Ekstrem">Ekstrem</option>
                        <option value="Keluarga">Keluarga</option>
                        <option value="Air">Air</option>
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label
                        htmlFor="new-desk"
                        className="block text-xs font-bold text-[#0F2347]"
                      >
                        Deskripsi Singkat
                      </label>
                      <input
                        id="new-desk"
                        type="text"
                        required
                        value={deskripsiWahana}
                        onChange={(e) => setDeskripsiWahana(e.target.value)}
                        placeholder="Deskripsi singkat wahana..."
                        className="mt-1 min-h-[42px] w-full rounded-xl border border-[#B9C8DC] px-3 text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label
                          htmlFor="new-tinggi"
                          className="block text-xs font-bold text-[#0F2347]"
                        >
                          Min. cm
                        </label>
                        <input
                          id="new-tinggi"
                          type="number"
                          min={0}
                          max={220}
                          value={tinggiMin}
                          onChange={(e) => setTinggiMin(e.target.value)}
                          className="mt-1 min-h-[42px] w-full rounded-xl border border-[#B9C8DC] px-3 text-sm"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="new-kap"
                          className="block text-xs font-bold text-[#0F2347]"
                        >
                          Kursi
                        </label>
                        <input
                          id="new-kap"
                          type="number"
                          min={1}
                          value={kapasitasKloter}
                          onChange={(e) => setKapasitasKloter(e.target.value)}
                          className="mt-1 min-h-[42px] w-full rounded-xl border border-[#B9C8DC] px-3 text-sm"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="new-dur"
                          className="block text-xs font-bold text-[#0F2347]"
                        >
                          Menit
                        </label>
                        <input
                          id="new-dur"
                          type="number"
                          min={1}
                          value={durasiMenit}
                          onChange={(e) => setDurasiMenit(e.target.value)}
                          className="mt-1 min-h-[42px] w-full rounded-xl border border-[#B9C8DC] px-3 text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="new-usia"
                        className="block text-xs font-bold text-[#0F2347]"
                      >
                        Kategori Usia
                      </label>
                      <input
                        id="new-usia"
                        type="text"
                        required
                        value={kategoriUsia}
                        onChange={(e) => setKategoriUsia(e.target.value)}
                        className="mt-1 min-h-[42px] w-full rounded-xl border border-[#B9C8DC] px-3 text-sm"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <button
                        type="submit"
                        disabled={busyId === "create-wahana"}
                        className="inline-flex min-h-[42px] items-center rounded-full bg-[#0033A0] px-5 py-2 text-xs font-bold text-white hover:bg-[#002678]"
                      >
                        {busyId === "create-wahana"
                          ? "Menyimpan..."
                          : "Simpan Wahana"}
                      </button>
                    </div>
                  </form>
                </details>

                <div className="grid gap-5 md:grid-cols-2">
                  {overview.wahana.map((w) => (
                    <article
                      key={w.id}
                      className="rounded-2xl border border-[#DCE6F5] bg-white p-5 shadow-[0_4px_16px_rgba(0,51,160,0.05)]"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <span className="text-xs font-bold text-[#0033A0]">
                            Zona {w.zona} · Min. {w.tinggi_minimal_cm} cm
                          </span>
                          <h2
                            className="mt-0.5 text-lg font-bold text-[#0F2347]"
                            style={{ fontFamily: "var(--font-display)" }}
                          >
                            {w.nama_wahana}
                          </h2>
                        </div>
                        <button
                          type="button"
                          onClick={() => void handleDeleteWahana(w.id, w.nama_wahana)}
                          disabled={busyId === `del-${w.id}`}
                          aria-label={`Hapus ${w.nama_wahana}`}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#FCA5A5] text-[#B91C1C] hover:bg-[#FEE2E2]"
                        >
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <LampuBadge status={w.status_lampu} />
                        <CrowdBadge crowd={w.crowd_meter} />
                        <span className="rounded-full bg-[#F4F8FC] px-2.5 py-1 text-xs font-semibold tabular-nums text-[#0F2347]">
                          Kloter #{w.kloter_berjalan} · {w.jumlah_antrean_aktif}{" "}
                          antrean
                        </span>
                      </div>

                      <div className="mt-4 space-y-3 border-t border-[#E6EEF8] pt-4">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="mr-1 text-xs font-bold text-[#475569]">
                            Lampu:
                          </span>
                          {LAMP_OPTIONS.map((opt) => (
                            <button
                              key={opt}
                              type="button"
                              disabled={busyId === `lampu-${w.id}`}
                              onClick={() => void handleUpdateLampu(w.id, opt)}
                              aria-pressed={w.status_lampu === opt}
                              className={`min-h-[34px] rounded-full border px-3 text-xs font-bold ${
                                w.status_lampu === opt
                                  ? "border-[#0033A0] bg-[#0033A0] text-white"
                                  : "border-[#DCE6F5] bg-white text-[#475569] hover:border-[#0033A0]"
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="mr-1 text-xs font-bold text-[#475569]">
                              Kepadatan:
                            </span>
                            {CROWD_OPTIONS.map((opt) => (
                              <button
                                key={opt}
                                type="button"
                                disabled={busyId === `crowd-${w.id}`}
                                onClick={() => void handleUpdateCrowd(w.id, opt)}
                                aria-pressed={w.crowd_meter === opt}
                                className={`min-h-[34px] rounded-full border px-3 text-xs font-bold ${
                                  w.crowd_meter === opt
                                    ? "border-[#FFB800] bg-[#FFB800] text-[#0F2347]"
                                    : "border-[#DCE6F5] bg-white text-[#475569] hover:border-[#0033A0]"
                                }`}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>

                          <button
                            type="button"
                            disabled={busyId === `kloter-${w.id}`}
                            onClick={() => void handlePanggilKloter(w.id)}
                            className="inline-flex min-h-[38px] items-center rounded-full bg-[#0033A0] px-4 py-1.5 text-xs font-bold text-white hover:bg-[#002678]"
                          >
                            Panggil Kloter #{w.kloter_berjalan + 1}
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ) : null}

            {/* TAB 2: Validasi Check-In & Reservasi */}
            {overview && activeTab === "reservasi" ? (
              <section className="space-y-6">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    void handleCheckIn(kodeCheckIn);
                  }}
                  className="rounded-2xl border border-[#DCE6F5] bg-white p-5"
                >
                  <label
                    htmlFor="checkin-kode"
                    className="block text-sm font-bold text-[#0F2347]"
                  >
                    Validasi Check-In Gerbang (Kode Booking atau Token QR)
                  </label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <input
                      id="checkin-kode"
                      type="text"
                      required
                      value={kodeCheckIn}
                      onChange={(e) => setKodeCheckIn(e.target.value)}
                      placeholder="Contoh: JLJ-20261123-ABCD atau JLJ-QR-..."
                      className="min-h-[44px] flex-1 rounded-xl border border-[#B9C8DC] px-3.5 text-sm"
                    />
                    <button
                      type="submit"
                      disabled={Boolean(busyId)}
                      className="inline-flex min-h-[44px] items-center rounded-full bg-[#0033A0] px-6 text-sm font-bold text-white hover:bg-[#002678]"
                    >
                      Validasi Check-In
                    </button>
                  </div>
                </form>

                <div
                  tabIndex={0}
                  role="region"
                  aria-labelledby="reservasi-table-caption"
                  className="admin-table-wrap rounded-2xl border border-[#DCE6F5] bg-white"
                >
                  <table
                    className="admin-table-reservasi text-left text-xs"
                    style={
                      {
                        "--col-2": '"Pengunjung"',
                        "--col-3": '"Paket & Tanggal"',
                        "--col-4": '"Total"',
                        "--col-5": '"Status"',
                        "--col-6": '"Aksi"',
                      } as CSSProperties
                    }
                  >
                    <caption
                      id="reservasi-table-caption"
                      className="border-b border-[#DCE6F5] px-4 py-3 text-left text-sm font-bold text-[#0F2347]"
                    >
                      Daftar Reservasi Tiket Terbaru
                    </caption>
                    <thead>
                      <tr className="border-b border-[#DCE6F5] text-[#475569]">
                        <th scope="col" className="px-4 py-3 font-bold">
                          Kode Booking
                        </th>
                        <th scope="col" className="px-4 py-3 font-bold">
                          Pengunjung
                        </th>
                        <th scope="col" className="px-4 py-3 font-bold">
                          Paket &amp; Tanggal
                        </th>
                        <th scope="col" className="px-4 py-3 font-bold">
                          Total
                        </th>
                        <th scope="col" className="px-4 py-3 font-bold">
                          Status Kunjungan
                        </th>
                        <th scope="col" className="px-4 py-3 font-bold">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {overview.reservasi_terbaru.map((r) => (
                        <tr key={r.id} className="border-t border-[#E6EEF8]">
                          <th
                            scope="row"
                            className="px-4 py-3 font-bold tabular-nums text-[#0033A0]"
                          >
                            {r.kode_booking}
                          </th>
                          <td className="px-4 py-3 text-[#0F2347]">
                            <span className="font-semibold">
                              {r.pengunjung_nama}
                            </span>
                            <br />
                            <span className="text-[#475569]">
                              {r.pengunjung_email}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-[#475569]">
                            {r.nama_paket}
                            <br />
                            {r.tanggal_kunjungan} · {r.jumlah_tiket} tiket
                          </td>
                          <td className="px-4 py-3 font-bold tabular-nums text-[#0F2347]">
                            {formatRupiah(r.total_harga)}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-block rounded-full px-2.5 py-1 font-bold ${
                                r.status_kunjungan === "Aktif di Kawasan"
                                  ? "bg-[#DCFCE7] text-[#14532D]"
                                  : "bg-[#FEF3C7] text-[#78350F]"
                              }`}
                            >
                              {r.status_kunjungan}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {r.status_kunjungan === "Aktif di Kawasan" ? (
                              <span className="text-[#475569]">
                                Sudah Check-in
                              </span>
                            ) : (
                              <button
                                type="button"
                                disabled={busyId === `checkin-${r.kode_booking}`}
                                onClick={() => void handleCheckIn(r.kode_booking)}
                                className="min-h-[34px] rounded-full bg-[#0033A0] px-3.5 py-1 text-xs font-bold text-white hover:bg-[#002678]"
                              >
                                Check-In
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            ) : null}

            {/* TAB 3: Kuota Harian & Antrean Aktif */}
            {overview && activeTab === "kuota" ? (
              <section className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-2xl border border-[#DCE6F5] bg-white p-5">
                  <h2
                    className="text-base font-bold text-[#0F2347]"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Kuota Harian Kawasan (14 Hari)
                  </h2>
                  <div className="mt-4 space-y-2.5">
                    {overview.kalender_kuota.map((k) => (
                      <div
                        key={k.tanggal}
                        className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#E6EEF8] bg-[#F8FBFF] px-4 py-3 text-xs"
                      >
                        <div>
                          <p className="font-bold tabular-nums text-[#0F2347]">
                            {k.tanggal}
                          </p>
                          <p className="tabular-nums text-[#475569]">
                            Terpakai {k.kuota_terpakai.toLocaleString("id-ID")}{" "}
                            / {k.kuota_maksimal.toLocaleString("id-ID")} (Sisa{" "}
                            {k.sisa_kuota.toLocaleString("id-ID")})
                          </p>
                        </div>
                        <button
                          type="button"
                          disabled={busyId === `kuota-${k.tanggal}`}
                          onClick={() =>
                            void handleToggleKuotaStatus(
                              k.tanggal,
                              k.kuota_maksimal,
                              k.status_kawasan
                            )
                          }
                          className={`min-h-[34px] rounded-full px-3.5 py-1 font-bold ${
                            k.status_kawasan === "Buka"
                              ? "bg-[#DCFCE7] text-[#14532D] hover:bg-[#BBF7D0]"
                              : "bg-[#FEE2E2] text-[#7F1D1D] hover:bg-[#FECACA]"
                          }`}
                        >
                          {k.status_kawasan} (Ubah)
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-[#DCE6F5] bg-white p-5">
                  <h2
                    className="text-base font-bold text-[#0F2347]"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Antrean Virtual Aktif Saat Ini
                  </h2>
                  {overview.antrean_aktif_list.length === 0 ? (
                    <p className="mt-4 text-sm text-[#475569]">
                      Belum ada antrean aktif saat ini.
                    </p>
                  ) : (
                    <div className="mt-4 space-y-2.5">
                      {overview.antrean_aktif_list.map((a) => (
                        <div
                          key={a.id}
                          className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#E6EEF8] bg-[#F8FBFF] px-4 py-3 text-xs"
                        >
                          <div>
                            <p className="font-bold text-[#0F2347]">
                              {a.nomor_antrean} · {a.nama_wahana}
                            </p>
                            <p className="text-[#475569]">
                              {a.pengunjung_nama} · Kloter #{a.nomor_kloter} ·
                              Est. {a.estimasi_tunggu_menit} mnt
                            </p>
                          </div>
                          <span
                            className={`rounded-full px-2.5 py-1 font-bold ${
                              a.status_antrean === "Dipanggil"
                                ? "bg-[#FEF3C7] text-[#78350F]"
                                : "bg-[#EBF5FF] text-[#0033A0]"
                            }`}
                          >
                            {a.status_antrean}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </section>
            ) : null}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
