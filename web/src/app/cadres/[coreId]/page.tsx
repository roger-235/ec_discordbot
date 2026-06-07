import Link from "next/link"
import prisma from "@/lib/prisma"

export default async function CadreDetailPage({
  params,
}: {
  params: Promise<{ coreId: string }>
}) {
  const { coreId } = await params
  const core = await prisma.cores.findUnique({
    where: { coreId: parseInt(coreId) },
    include: { user: { select: { name: true, year: true } } },
  })

  if (!core) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-10 space-y-4">
        <span className="silk block text-red-500">ERR · 404 · 找不到此幹部</span>
        <Link href="/cadres" className="silk hover:text-[#c8d8c8] transition-colors inline-block">
          ← 幹部
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-6">
      <Link href="/cadres" className="silk hover:text-[#c8d8c8] transition-colors inline-block">
        ← 幹部
      </Link>

      <div className="pcb-card p-8">
        <div className="flex flex-col sm:flex-row gap-8">
          <div className="shrink-0">
            {core.imageURL ? (
              <img
                src={core.imageURL}
                alt={core.user.name}
                className="w-32 h-32 object-cover border-2 border-[#b87333]"
              />
            ) : (
              <div className="w-32 h-32 border-2 border-[#b87333] flex items-center justify-center text-[#b87333] text-2xl font-black">
                IC
              </div>
            )}
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <span className="silk block mb-2">YEAR: {core.user.year} · VCC=5V</span>
              <h1 className="text-3xl font-black text-[#e8f0e8]">{core.user.name}</h1>
              <p className="text-[#d4a843] mt-1">{core.position}</p>
            </div>

            <div className="border-t border-[#3a6a3e] pt-4">
              <span className="silk block mb-2 text-[#4a7a4a]"># 自我介紹</span>
              <p className="text-sm text-[#c8d8c8] leading-relaxed">{core.introduction}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
