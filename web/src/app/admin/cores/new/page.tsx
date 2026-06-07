"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function NewCorePage() {
  const router = useRouter()
  const [form, setForm] = useState({
    studentId: "",
    position: "",
    introduction: "",
    imageURL: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const res = await fetch("/api/cores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        studentId: form.studentId,
        position: form.position,
        introduction: form.introduction,
        imageURL: form.imageURL || "",
      }),
    })

    if (res.ok) {
      router.push("/admin/cores")
    } else {
      const data = await res.json()
      setError(data?.error ?? "新增失敗")
    }
    setLoading(false)
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-3">
      <div className="pcb-card px-8 py-5">
        <Link href="/admin/cores" className="silk hover:text-[#c8d8c8] transition-colors inline-block mb-4">
          ← 幹部管理
        </Link>
        <span className="silk block mb-2">WRITE · NEW-CORE</span>
        <h1 className="text-3xl font-black text-[#e8f0e8]">新增幹部</h1>
      </div>

      <div className="pcb-card p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <span className="silk block mb-2 text-[#4a7a4a]"># 學號（需已在會員列表）</span>
            <input
              name="studentId"
              value={form.studentId}
              onChange={handleChange}
              placeholder="C114001"
              required
              className="w-full border border-[#4a8a4e] bg-[#1a4a1e] text-[#c8d8c8] placeholder-[#4a8a4e] px-4 py-2.5 text-xs focus:outline-none focus:border-[#b87333] transition-colors"
            />
          </div>

          <div>
            <span className="silk block mb-2 text-[#4a7a4a]"># 職位</span>
            <input
              name="position"
              value={form.position}
              onChange={handleChange}
              placeholder="會長"
              required
              className="w-full border border-[#4a8a4e] bg-[#1a4a1e] text-[#c8d8c8] placeholder-[#4a8a4e] px-4 py-2.5 text-xs focus:outline-none focus:border-[#b87333] transition-colors"
            />
          </div>

          <div>
            <span className="silk block mb-2 text-[#4a7a4a]"># 自我介紹</span>
            <textarea
              name="introduction"
              value={form.introduction}
              onChange={handleChange}
              required
              rows={4}
              className="w-full border border-[#4a8a4e] bg-[#1a4a1e] text-[#c8d8c8] placeholder-[#4a8a4e] px-4 py-2.5 text-xs focus:outline-none focus:border-[#b87333] transition-colors resize-none"
            />
          </div>

          <div>
            <span className="silk block mb-2 text-[#4a7a4a]"># 照片網址（選填）</span>
            <input
              name="imageURL"
              value={form.imageURL}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full border border-[#4a8a4e] bg-[#1a4a1e] text-[#c8d8c8] placeholder-[#4a8a4e] px-4 py-2.5 text-xs focus:outline-none focus:border-[#b87333] transition-colors"
            />
          </div>

          {error && <p className="silk text-red-400 text-xs">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full border border-[#b87333] text-[#d4a843] hover:bg-[#b87333]/10 disabled:opacity-40 py-2.5 text-xs tracking-widest transition-colors"
          >
            {loading ? "新增中..." : "新增"}
          </button>
        </form>
      </div>
    </div>
  )
}
