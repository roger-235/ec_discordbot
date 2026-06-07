"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

type Result = {
  found: boolean
  studentId?: string
  name?: string
  isPaid?: boolean
  identity?: string
}

export default function MemberSearchPage() {
  const [studentId, setStudentId] = useState("")
  const [result, setResult] = useState<Result | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setResult(null)
    const res = await fetch(`/api/users/${studentId}`)
    if (res.ok) {
      const data = await res.json()
      setResult({ found: true, ...data })
    } else {
      setResult({ found: false })
    }
    setLoading(false)
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-6">
      <div className="pcb-card p-6">
        <span className="silk block mb-2">PROBE · MEMBER-LOOKUP · TP1</span>
        <h1 className="text-2xl font-black text-[#c8d8c8]">會員查詢</h1>
      </div>

      <div className="pcb-card p-8 max-w-xl">
        <span className="silk block mb-4">INPUT · STUDENT-ID · J1-PIN1</span>
        <form onSubmit={handleSearch} className="flex">
          <span className="border border-[#4a8a4e] border-r-0 bg-[#1a4a1e] px-3 flex items-center text-[#4a7a4a] text-xs">
            TP1
          </span>
          <input
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            placeholder="B11123456"
            required
            className="flex-1 border border-[#4a8a4e] border-r-0 bg-[#1a4a1e] text-[#c8d8c8] placeholder-[#4a8a4e] px-4 py-2.5 text-xs focus:outline-none focus:border-[#b87333] transition-colors"
          />
          <button
            type="submit"
            disabled={loading}
            className="border border-[#b87333] text-[#d4a843] hover:bg-[#b87333]/10 disabled:opacity-40 px-6 py-2.5 text-xs tracking-widest transition-colors"
          >
            {loading ? "查詢中" : "查詢"}
          </button>
        </form>

        <AnimatePresence mode="wait">
          {result && (
            <motion.div
              key={result.found ? "found" : "notfound"}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-8 pt-6 border-t border-[#3a6a3e]"
            >
              {result.found ? (
                <>
                  <span className="silk block mb-4 text-[#b87333]">OUTPUT · SIGNAL DETECTED</span>
                  <div className="space-y-3">
                    {[
                      { label: "學號", value: result.studentId },
                      { label: "姓名", value: result.name },
                      { label: "身份", value: result.identity },
                      { label: "繳費狀態", value: result.isPaid ? "已繳費" : "未繳費", ok: result.isPaid },
                    ].map((row) => (
                      <div key={row.label} className="flex gap-4 text-xs">
                        <span className="silk w-28 shrink-0">{row.label}</span>
                        <span className={row.ok === false ? "text-red-400" : row.ok ? "text-[#b87333]" : "text-[#c8d8c8]"}>
                          {row.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <span className="silk block mb-2 text-red-500">ERR · NO SIGNAL · {studentId.toUpperCase()}</span>
                  <p className="text-xs text-[#4a7a4a]"># 查無此學號，請確認是否是建工校區電子工程系日間部學生</p>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
