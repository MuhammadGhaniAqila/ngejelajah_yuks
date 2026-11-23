import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const jakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Jelajahin | Smart Ticketing & Virtual Queue Dufan Ancol",
  description:
    "Pesan tiket masuk berkuota, cek status live dan kepadatan wahana Dufan Ancol, serta kelola antrean virtual dalam satu sistem Jelajahin.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${poppins.variable} ${jakartaSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-[#0F2347]">
        <a
          href="#main-content"
          className="visually-hidden focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-lg focus:bg-[#FFB800] focus:px-4 focus:py-2 focus:font-bold focus:text-[#0F2347]"
        >
          Lewati ke konten utama
        </a>
        {children}
      </body>
    </html>
  );
}
