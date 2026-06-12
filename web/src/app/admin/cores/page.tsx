export const dynamic = 'force-dynamic'
import Link from "next/link"
import prisma from "@/lib/prisma"
import DeleteButton from "./DeleteButton"

export default async function AdminCoresPage() {
  const cores = await prisma.cores.findMany({
    include: { user: { select: { name: true, year: true } } },
  })

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-3">
      <div className="pcb-card px-8 py-5 flex items-center justify-between">
        <div>
          <span className="silk block mb-2">WRITE · CORES · CH=ADMIN</span>
          <h1 className="text-3xl font-black text-[#e8f0e8]">幹部管理</h1>
        </div>
        <Link
          href="/admin/cores/new"
          className="border border-[#b87333] text-[#d4a843] hover:bg-[#b87333]/10 px-4 py-2 text-xs tracking-widest transition-colors"
        >
          + 新增
        </Link>
      </div>

      <div className="pcb-card divide-y divide-[#3a6a3e]">
        <div className="grid grid-cols-12 px-6 py-3 silk text-[#4a7a4a] text-xs">
          <span className="col-span-1">ID</span>
          <span className="col-span-3">姓名</span>
          <span className="col-span-3">職位</span>
          <span className="col-span-2">學年</span>
          <span className="col-span-3"></span>
        </div>

        {cores.length === 0 && (
          <p className="px-6 py-8 silk text-[#4a7a4a]">目前沒有幹部資料</p>
        )}

        {cores.map((core) => (
          <div key={core.coreId} className="grid grid-cols-12 px-6 py-4 text-xs items-center hover:bg-[#b87333]/5 transition-colors">
            <span className="col-span-1 silk text-[#4a7a4a]">{core.coreId}</span>
            <span className="col-span-3 text-[#c8d8c8]">{core.user.name}</span>
            <span className="col-span-3 text-[#4a7a4a]">{core.position}</span>
            <span className="col-span-2 silk text-[#4a7a4a]">{core.user.year}</span>
            <div className="col-span-3 flex items-center gap-2 justify-end">
              <Link
                href={`/admin/cores/${core.coreId}/edit`}
                className="border border-[#4a8a4e] text-[#7aaa7a] hover:border-[#b87333] hover:text-[#d4a843] px-3 py-1.5 text-xs transition-colors"
              >
                編輯
              </Link>
              <DeleteButton coreId={core.coreId} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
