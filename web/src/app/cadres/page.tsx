export const dynamic = 'force-dynamic'
import Link from "next/link"
import prisma from "@/lib/prisma"

export default async function CadresPage() {
  const cores = await prisma.cores.findMany({
    include: { user: { select: { name: true, year: true } } },
  })
  const [president, ...rest] = cores

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-3">
      <div className="pcb-card px-8 py-5">
        <span className="silk block mb-2">BOM · BILL OF MATERIALS</span>
        <h1 className="text-3xl font-black text-[#e8f0e8]">幹部介紹</h1>
      </div>

      {cores.length === 0 ? (
        <div className="pcb-card px-8 py-10">
          <span className="silk block text-[#4a7a4a]">目前沒有幹部資料</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Link
            href={`/cadres/${president.coreId}`}
            className="pcb-card p-8 md:row-span-2 flex flex-col justify-between hover:border-[#d4a843] transition-colors"
            style={{ borderColor: "#b87333" }}
          >
            <div>
              <span className="silk block mb-6">IC1 · PRESIDENT</span>
              <div className="w-16 h-16 border-2 border-[#b87333] flex items-center justify-center text-[#b87333] text-xl mb-6 font-black">
                IC
              </div>
              <p className="text-3xl font-black text-[#e8f0e8] mb-2">{president.user.name}</p>
              <p className="text-sm text-[#d4a843]">{president.position}</p>
              <p className="text-xs text-[#4a7a4a] mt-3 line-clamp-3">{president.sentence}</p>
            </div>
            <span className="silk mt-8 block">YEAR: {president.user.year} · VCC=5V</span>
          </Link>

          {rest.map((c, i) => (
            <Link
              key={c.coreId}
              href={`/cadres/${c.coreId}`}
              className="pcb-card p-6 hover:border-[#b87333] transition-colors"
            >
              <span className="silk block mb-3">IC{i + 2}</span>
              <div className="w-8 h-8 border border-[#4a8a4e] flex items-center justify-center text-[#4a7a4a] text-xs mb-4">
                IC
              </div>
              <p className="text-lg font-black text-[#e8f0e8]">{c.user.name}</p>
              <p className="text-xs text-[#b87333] mt-1">{c.position}</p>
              <span className="silk block mt-4">YEAR: {c.user.year}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
