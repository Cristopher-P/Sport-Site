import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "CanchaHoy — Horarios de partidos hoy y análisis premium",
    template: "%s · CanchaHoy",
  },
  description:
    "Horarios y próximos partidos de las principales ligas de fútbol, NBA y NFL, más análisis estadístico premium de varios partidos por venir.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-neutral-950 text-neutral-100">
        <Header />
        <main className="flex-1 mx-auto w-full max-w-5xl px-4 py-8">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
