"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { api, ApiError, saveAuthSession } from "@/lib/api";

export default function DaftarPage() {
  const router = useRouter();
  const [namaLengkap, setNamaLengkap] = useState("");
  const [email, setEmail] = useState("");
  const [nik, setNik] = useState("");
  const [noWa, setNoWa] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);
    try {
      const res = await api.register({
        nama_lengkap: namaLengkap,
        email,
        password,
        nik,
        no_wa: noWa,
      });
      saveAuthSession(res.token, res.user);
      router.push("/pesan");
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.errors) {
          const firstField = Object.values(err.errors)[0];
          setErrorMsg(firstField?.[0] || err.message);
        } else {
          setErrorMsg(err.message);
        }
      } else {
        setErrorMsg("Pendaftaran gagal. Silakan periksa data kembali.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-full flex-col bg-[#F4F8FC] text-[#0F2347]">
      <Navbar />

      <main
        id="main-content"
        tabIndex={-1}
        className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-12"
      >
        <div className="rounded-2xl border border-[#DCE6F5] bg-white p-6 shadow-[0_8px_28px_rgba(0,51,160,0.06)] sm:p-8">
          <h1
            className="text-3xl font-bold tracking-tight text-[#0033A0]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Daftar Akun Wisatawan
          </h1>
          <p className="mt-1.5 text-sm text-[#475569]">
            Buat akun untuk memesan tiket Dufan Ancol dan menggunakan antrean
            virtual wahana.
          </p>

          {errorMsg ? (
            <div
              role="alert"
              className="mt-4 rounded-xl border border-[#FCA5A5] bg-[#FEE2E2] px-4 py-3 text-sm font-semibold text-[#7F1D1D]"
            >
              {errorMsg}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="reg-nama"
                className="block text-sm font-semibold text-[#0F2347]"
              >
                Nama Lengkap
              </label>
              <input
                id="reg-nama"
                name="nama_lengkap"
                type="text"
                required
                autoComplete="name"
                value={namaLengkap}
                onChange={(e) => setNamaLengkap(e.target.value)}
                placeholder="Nama lengkap sesuai identitas"
                className="mt-1.5 min-h-[48px] w-full rounded-xl border border-[#B9C8DC] bg-white px-3.5 py-2 text-base text-[#0F2347] placeholder:text-[#5B6B82]"
              />
            </div>

            <div>
              <label
                htmlFor="reg-email"
                className="block text-sm font-semibold text-[#0F2347]"
              >
                Alamat Email
              </label>
              <input
                id="reg-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="mt-1.5 min-h-[48px] w-full rounded-xl border border-[#B9C8DC] bg-white px-3.5 py-2 text-base text-[#0F2347] placeholder:text-[#5B6B82]"
              />
            </div>

            <div>
              <label
                htmlFor="reg-nik"
                className="block text-sm font-semibold text-[#0F2347]"
              >
                NIK (16 Digit)
              </label>
              <input
                id="reg-nik"
                name="nik"
                type="text"
                required
                inputMode="numeric"
                minLength={16}
                maxLength={16}
                pattern="\d{16}"
                value={nik}
                onChange={(e) => setNik(e.target.value.replace(/\D/g, ""))}
                placeholder="16 digit angka NIK"
                className="mt-1.5 min-h-[48px] w-full rounded-xl border border-[#B9C8DC] bg-white px-3.5 py-2 text-base tabular-nums text-[#0F2347] placeholder:text-[#5B6B82]"
              />
            </div>

            <div>
              <label
                htmlFor="reg-wa"
                className="block text-sm font-semibold text-[#0F2347]"
              >
                Nomor WhatsApp
              </label>
              <input
                id="reg-wa"
                name="no_wa"
                type="tel"
                required
                autoComplete="tel"
                inputMode="tel"
                value={noWa}
                onChange={(e) => setNoWa(e.target.value)}
                placeholder="081234567890"
                className="mt-1.5 min-h-[48px] w-full rounded-xl border border-[#B9C8DC] bg-white px-3.5 py-2 text-base tabular-nums text-[#0F2347] placeholder:text-[#5B6B82]"
              />
            </div>

            <div>
              <label
                htmlFor="reg-password"
                className="block text-sm font-semibold text-[#0F2347]"
              >
                Kata Sandi
              </label>
              <input
                id="reg-password"
                name="password"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                aria-describedby="reg-pass-hint"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 8 karakter"
                className="mt-1.5 min-h-[48px] w-full rounded-xl border border-[#B9C8DC] bg-white px-3.5 py-2 text-base text-[#0F2347] placeholder:text-[#5B6B82]"
              />
              <span
                id="reg-pass-hint"
                className="mt-1 block text-xs text-[#475569]"
              >
                Minimal 8 karakter.
              </span>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex min-h-[48px] w-full items-center justify-center rounded-full bg-[#0033A0] px-5 py-3 text-sm font-bold text-white hover:bg-[#002678] disabled:bg-[#E2EAF4] disabled:text-[#475569]"
            >
              {submitting ? "Mendaftarkan Akun..." : "Daftar & Lanjut Pesan"}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-[#475569]">
            Sudah memiliki akun?{" "}
            <Link
              href="/masuk"
              className="font-bold text-[#0033A0] underline"
            >
              Masuk di sini
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
