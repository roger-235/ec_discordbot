import type { Metadata } from "next"
import Navbar from "@/components/Navbar"
import ScrollToTop from "@/components/ScrollToTop"
import ChipBackground from "@/components/ChipBackground"
import PageTransition from "@/components/PageTransition"
import "./globals.css"

export const metadata: Metadata = {
  title: "電子工程系學會",
  description: "國立高雄科技大學 電子工程系學生會",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW" data-scroll-behavior="smooth">
      <body className="min-h-screen flex flex-col">
        <ChipBackground />
        <ScrollToTop />
        <Navbar />
        <main className="flex-1">
          <PageTransition>{children}</PageTransition>
        </main>
        <footer className="border-t-2 border-[#b87333] py-4 text-center silk">
          NKUST-EC-STUDENT-ASSOC · PCB-REV1.0 · 2025
        </footer>
      </body>
    </html>
  )
}
