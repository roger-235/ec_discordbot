"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

const links = [
  { href: "/", label: "首頁", ref: "SW1" },
  { href: "/cadres", label: "幹部", ref: "SW2" },
  { href: "/activities", label: "活動", ref: "SW3" },
  { href: "/members/search", label: "查詢", ref: "SW4" },
]

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-[#1a4a1e] border-b-2 border-[#b87333]">
      <div className="max-w-5xl mx-auto px-6 h-12 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-5 h-5 rounded-full bg-[#b87333] border-2 border-[#d4a843] flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-[#0a1a0d]" />
          </div>
          <span className="text-[#c8d8c8] text-xs font-bold tracking-widest">NKUST-EC · U1</span>
        </Link>

        <nav className="hidden sm:flex items-center">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative px-4 py-3 text-xs tracking-widest transition-colors ${
                pathname === link.href
                  ? "text-[#d4a843]"
                  : "text-[#4a7a4a] hover:text-[#c8d8c8]"
              }`}
            >
              <span className="silk block mb-0.5">{link.ref}</span>
              {link.label}
              {pathname === link.href && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#b87333]" />
              )}
            </Link>
          ))}
        </nav>

        <button
          onClick={() => setOpen(!open)}
          className="sm:hidden text-xs text-[#4a7a4a] hover:text-[#c8d8c8] transition-colors"
        >
          {open ? "[OFF]" : "[ON]"}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="sm:hidden absolute top-full left-0 right-0 bg-[#1a4a1e] border-t border-[#2a5a2e] border-b border-b-[#b87333]"
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-6 py-3 text-xs border-b border-[#1a3a1d] transition-colors ${
                  pathname === link.href
                    ? "text-[#d4a843] border-l-2 border-l-[#b87333]"
                    : "text-[#4a7a4a] hover:text-[#c8d8c8]"
                }`}
              >
                <span className="silk">{link.ref}</span>
                {link.label}
              </Link>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
