"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function NewMemberPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    studentId: "",
    year: "",
    name: "",
    class: "",
    identity: "member",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, year: parseInt(form.year) }),
    })

    if (res.ok) {
      router.push("/members")
    } else {
      setError("ERR · 新增失敗，請確認資料是否正確")
    }

    setLoading(false)
  }

  const fields = [
    { name: "studentId", label: "學號", placeholder: "C114152236", type: "text" },
    { name: "year", label: "學年", placeholder: "114", type: "number" },
    { name: "name", label: "姓名", placeholder: "黃宥睿", type: "text" },
    { name: "class", label: "班級", placeholder: "四子二乙", type: "text" },
  ]

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-3">
      <div className="pcb-card px-8 py-5">
        <span className="silk block mb-2">WRITE · NEW-NODE · J1</span>
        <h1 className="text-3xl font-black text-[#e8f0e8]">新增會員</h1>
      </div>

      <div className="pcb-card p-8 max-w-xl">
        <form onSubmit={handleSubmit} className="space-y-5">
          {fields.map((f) => (
            <div key={f.name}>
              <span className="silk block mb-2 text-[#4a7a4a]"># {f.label}</span>
              <div className="flex">
                <span className="border border-[#4a8a4e] border-r-0 bg-[#1a4a1e] px-3 flex items-center text-[#4a7a4a] text-xs">
                  {f.label.slice(0, 2)}
                </span>
                <input
                  name={f.name}
                  type={f.type}
                  value={form[f.name as keyof typeof form]}
                  onChange={handleChange}
                  placeholder={f.placeholder}
                  required
                  className="flex-1 border border-[#4a8a4e] bg-[#1a4a1e] text-[#c8d8c8] placeholder-[#4a8a4e] px-4 py-2.5 text-xs focus:outline-none focus:border-[#b87333] transition-colors"
                />
              </div>
            </div>
          ))}

          <div>
            <span className="silk block mb-2 text-[#4a7a4a]"># IDENTITY</span>
            <select
              name="identity"
              value={form.identity}
              onChange={handleChange}
              className="w-full border border-[#4a8a4e] bg-[#1a4a1e] text-[#c8d8c8] px-4 py-2.5 text-xs focus:outline-none focus:border-[#b87333] transition-colors"
            >
              <option value="member">會員</option>
              <option value="cadre">幹部</option>
              <option value="admin">管理員</option>
            </select>
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
