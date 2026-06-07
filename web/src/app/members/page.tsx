import Link from "next/link"
import prisma from "@/lib/prisma"

export default async function MembersPage() {
  const members = await prisma.users.findMany({
    orderBy: { studentId: "asc" },
  })

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-3">
      <div className="pcb-card px-8 py-5 flex items-center justify-between">
        <div>
          <span className="silk block mb-2">DATA-BUS · CH=MEMBERS</span>
          <h1 className="text-3xl font-black text-[#e8f0e8]">會員列表</h1>
        </div>
        <Link
          href="/members/new"
          className="border border-[#b87333] text-[#d4a843] hover:bg-[#b87333]/10 px-4 py-2 text-xs tracking-widest transition-colors"
        >
          + 新增
        </Link>
      </div>

      <div className="pcb-card divide-y divide-[#3a6a3e]">
        <div className="grid grid-cols-6 px-6 py-3 silk text-[#4a7a4a] text-xs">
          <span>學號</span>
          <span>姓名</span>
          <span>班級</span>
          <span>身份</span>
          <span>繳費</span>
          <span>點數</span>
        </div>
        {members.length === 0 && (
          <p className="px-6 py-8 silk text-[#4a7a4a]">目前沒有會員</p>
        )}
        {members.map((m) => (
          <div key={m.studentId} className="grid grid-cols-6 px-6 py-3 text-xs hover:bg-[#b87333]/5 transition-colors">
            <span className="silk text-[#c8d8c8]">{m.studentId}</span>
            <span className="text-[#c8d8c8]">{m.name}</span>
            <span className="text-[#4a7a4a]">{m.class}</span>
            <span className="text-[#4a7a4a]">{m.identity}</span>
            <span className={m.isPaid ? "text-[#b87333]" : "text-red-400"}>
              {m.isPaid ? "已繳費" : "未繳費"}
            </span>
            <span className="text-[#c8d8c8]">{m.point}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
