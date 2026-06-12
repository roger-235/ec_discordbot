"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function EditCorePage({ params }: { params: Promise<{ coreId: string }> }) {
  const router = useRouter()
  const [form, setForm] = useState({
    position: "",
    sentence: "",
    imageURL: "",
  })
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    params.then(({ coreId }) => {
      fetch(`/api/cores/${coreId}`)
        .then((r) => r.json())
        .then((core) => {
          setForm({
            position: core.position ?? "",
            sentence: core.sentence ?? "",
            imageURL: core.imageURL ?? "",
          })
          setName(core.user?.name ?? "")
          setFetching(false)
        })
    })
  }, [params])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const { coreId } = await params
    const res = await fetch(`/api/cores/${coreId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        position: form.position,
        sentence: form.sentence,
        imageURL: form.imageURL || "",
      }),
    })

    if (res.ok) {
      router.push("/admin/cores")
    } else {
      setError("更新失敗")
    }
    setLoading(false)
  }

  if (fetching) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <p className="silk text-[#4a7a4a]">載入中...</p>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-3">
      <div className="pcb-card px-8 py-5">
        <Link href="/admin/cores" className="silk hover:text-[#c8d8c8] transition-colors inline-block mb-4">
          ← 幹部管理
        </Link>
        <span className="silk block mb-2">WRITE · EDIT-CORE</span>
        <h1 className="text-3xl font-black text-[#e8f0e8]">編輯幹部 · {name}</h1>
      </div>

      <div className="pcb-card p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <span className="silk block mb-2 text-[#4a7a4a]"># 職位</span>
            <input
              name="position"
              value={form.position}
              onChange={handleChange}
              required
              className="w-full border border-[#4a8a4e] bg-[#1a4a1e] text-[#c8d8c8] px-4 py-2.5 text-xs focus:outline-none focus:border-[#b87333] transition-colors"
            />
          </div>

          <div>
            <span className="silk block mb-2 text-[#4a7a4a]"># 自我介紹</span>
            <textarea
              name="sentence"
              value={form.sentence}
              onChange={handleChange}
              required
              rows={4}
              className="w-full border border-[#4a8a4e] bg-[#1a4a1e] text-[#c8d8c8] px-4 py-2.5 text-xs focus:outline-none focus:border-[#b87333] transition-colors resize-none"
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
            {loading ? "更新中..." : "更新"}
          </button>
        </form>
      </div>
    </div>
  )
}
