"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function NewPostPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    title: "",
    content: "",
    applyURL: "",
    eventTime: "",
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

    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.title,
        content: form.content,
        applyURL: form.applyURL || null,
        eventTime: form.eventTime || null,
      }),
    })

    if (res.ok) {
      router.push("/admin/posts")
    } else {
      setError("新增失敗")
    }
    setLoading(false)
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-3">
      <div className="pcb-card px-8 py-5">
        <Link href="/admin/posts" className="silk hover:text-[#c8d8c8] transition-colors inline-block mb-4">
          ← 活動管理
        </Link>
        <span className="silk block mb-2">WRITE · NEW-POST</span>
        <h1 className="text-3xl font-black text-[#e8f0e8]">新增活動</h1>
      </div>

      <div className="pcb-card p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <span className="silk block mb-2 text-[#4a7a4a]"># 標題</span>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full border border-[#4a8a4e] bg-[#1a4a1e] text-[#c8d8c8] placeholder-[#4a8a4e] px-4 py-2.5 text-xs focus:outline-none focus:border-[#b87333] transition-colors"
            />
          </div>

          <div>
            <span className="silk block mb-2 text-[#4a7a4a]"># 內容</span>
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              required
              rows={6}
              className="w-full border border-[#4a8a4e] bg-[#1a4a1e] text-[#c8d8c8] placeholder-[#4a8a4e] px-4 py-2.5 text-xs focus:outline-none focus:border-[#b87333] transition-colors resize-none"
            />
          </div>

          <div>
            <span className="silk block mb-2 text-[#4a7a4a]"># 活動日期（選填）</span>
            <input
              name="eventTime"
              type="date"
              value={form.eventTime}
              onChange={handleChange}
              className="w-full border border-[#4a8a4e] bg-[#1a4a1e] text-[#c8d8c8] px-4 py-2.5 text-xs focus:outline-none focus:border-[#b87333] transition-colors"
            />
          </div>

          <div>
            <span className="silk block mb-2 text-[#4a7a4a]"># 報名連結（選填）</span>
            <input
              name="applyURL"
              value={form.applyURL}
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
