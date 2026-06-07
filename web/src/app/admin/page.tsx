import Link from "next/link"

const stats = [
  { ref: "R1", label: "總會員", value: "—" },
  { ref: "R2", label: "已繳費", value: "—" },
  { ref: "R3", label: "幹部數", value: "—" },
]

const actions = [
  { href: "/members", ref: "SW1", label: "LIST-MEMBERS", desc: "會員列表" },
  { href: "/members/new", ref: "SW2", label: "ADD-MEMBER", desc: "新增會員" },
  { href: "/admin/cores", ref: "SW3", label: "LIST-CADRES", desc: "幹部管理" },
  { href: "/admin/posts", ref: "SW4", label: "LIST-ACTIVITIES", desc: "活動管理" },
]

export default function AdminPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-4">

      <div className="pcb-card p-6">
        <span className="silk block mb-2">SYS · ADMIN-PANEL · AUTH=ROOT</span>
        <h1 className="text-2xl font-black text-[#c8d8c8]">管理後台</h1>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {stats.map((s) => (
          <div key={s.ref} className="pcb-card px-6 py-6">
            <span className="silk block mb-2">{s.ref} · {s.label}</span>
            <p className="text-4xl font-black text-[#c8d8c8]">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="pcb-card divide-y divide-[#3a6a3e]">
        <div className="px-6 py-3">
          <span className="silk">J1~J4 · ACTIONS</span>
        </div>
        {actions.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group flex items-center justify-between px-6 py-4 hover:bg-[#b87333]/5 transition-colors"
          >
            <div>
              <span className="silk block mb-1">{item.ref} · {item.label}</span>
              <p className="text-sm text-[#c8d8c8] group-hover:text-[#d4a843] transition-colors">{item.desc}</p>
            </div>
            <span className="text-[#4a8a4e] group-hover:text-[#b87333] transition-colors">→</span>
          </Link>
        ))}
      </div>

    </div>
  )
}
