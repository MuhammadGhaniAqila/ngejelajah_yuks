"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { ApiError, api, saveAuthSession } from "@/lib/api";

export default function MasukPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);
    try {
      const res = await api.login({ email, password });
      saveAuthSession(res.token, res.user);
      router.push("/tiket-saya");
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("Gagal masuk ke akun. Periksa kembali email dan sandi.");
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
        className="mx-auto flex w-full max-w-md flex-1 items-center px-4 py-12 sm:px-6"
      >
        <div className="w-full rounded-3xl border border-[#DCE6F5] bg-white p-6 shadow-[0_8px_28px_rgba(0,51,160,0.08)] sm:p-8">
          <div className="flex items-center gap-2 text-xs font-bold text-[#0033A0] uppercase">
            <LogIn className="h-4 w-4" aria-hidden="true" />
            <span>Akun Pengunjung Jelajahin</span>
          </div>
          <h1
            className="mt-2 text-2xl font-bold text-[#0F2347]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Masuk ke Akun Anda
          </h1>
          <p className="mt-1.5 text-sm text-[#475569]">
            Akses E-Ticket berkode QR dan kelola antrean virtual wahana selama
            berkunjung di Jelajahin Theme Park.
          </p>

          {errorMsg ? (
            <div
              role="alert"
              className="mt-4 rounded-xl border border-[#FCA5A5] bg-[#FEE2E2] p-3 text-sm font-semibold text-[#7F1D1D]"
            >
              {errorMsg}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="login-email"
                className="block text-sm font-semibold text-[#0F2347]"
              >
                Email Pengunjung
              </label>
              <input
                id="login-email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="username"
                spellCheck={false}
                enterKeyHint="next"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="mt-1.5 min-h-[48px] w-full rounded-xl border border-[#B9C8DC] bg-white px-3.5 py-2 text-base text-[#0F2347] placeholder:text-[#5B6B82]"
              />
            </div>

            <div>
              <label
                htmlFor="login-password"
                className="block text-sm font-semibold text-[#0F2347]"
              >
                Kata Sandi
              </label>
              <div className="relative mt-1.5">
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  enterKeyHint="done"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi"
                  className="min-h-[48px] w-full rounded-xl border border-[#B9C8DC] bg-white py-2 pr-12 pl-3.5 text-base text-[#0F2347] placeholder:text-[#5B6B82]"
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
              disabled={submitting}
              className="inline-flex min-h-[48px] w-full items-center justify-center rounded-full bg-[#0033A0] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#002678] disabled:bg-[#E2EAF4] disabled:text-[#475569]"
            >
              {submitting ? "Memproses Masuk..." : "Masuk Sekarang"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#475569]">
            Belum punya akun?{" "}
            <Link
              href="/daftar"
              className="font-bold text-[#0033A0] underline hover:text-[#002678]"
            >
              Daftar Akun Baru
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
