import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Allergie-Tagebuch",
  description: "Tägliche Erfassung der Allergiesymptome",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${geist.className} h-full`}>
      <body className="min-h-full bg-gray-50 flex flex-col">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="text-lg font-bold text-emerald-700">🌿 Allergie</Link>
            <nav className="flex gap-4 text-sm text-gray-600">
              <Link href="/" className="hover:text-emerald-700">Heute</Link>
              <Link href="/verlauf" className="hover:text-emerald-700">Verlauf</Link>
              <Link href="/export" className="hover:text-emerald-700">Export</Link>
              <Link href="/einstellungen" className="hover:text-emerald-700">⚙️</Link>
            </nav>
          </div>
        </header>
        <main className="flex-1 max-w-lg mx-auto w-full px-4 py-6">
          {children}
        </main>
      </body>
    </html>
  );
}
