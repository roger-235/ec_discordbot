export const dynamic = 'force-dynamic'
import Link from "next/link"
import prisma from "@/lib/prisma"

export default async function ActivityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const post = await prisma.posts.findUnique({
    where: { postId: parseInt(id) },
  })

  if (!post) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-10 space-y-4">
        <span className="silk block text-red-500">ERR · 404 · 找不到此活動</span>
        <Link href="/activities" className="silk hover:text-[#c8d8c8] transition-colors inline-block">
          ← 活動
        </Link>
      </div>
    )
  }

  const date = post.eventTime ? new Date(post.eventTime) : null

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-6">
      <Link href="/activities" className="silk hover:text-[#c8d8c8] transition-colors inline-block">
        ← 活動
      </Link>

      <div className="pcb-card p-8">
        <div className="flex flex-col sm:flex-row items-start gap-8">
          {date && (
            <div className="text-center shrink-0 border-r border-[#4a8a4e] pr-8">
              <span className="silk block mb-1">{String(date.getMonth() + 1).padStart(2, "0")}</span>
              <p className="text-6xl font-black text-[#c8d8c8] leading-none">{String(date.getDate()).padStart(2, "0")}</p>
              <span className="silk block mt-1">{date.getFullYear()}</span>
            </div>
          )}

          <div className="flex-1 space-y-6">
            <div>
              <span className="silk block mb-2">EVT-{String(post.postId).padStart(3, "0")}</span>
              <h1 className="text-2xl font-black text-[#c8d8c8]">{post.title}</h1>
            </div>

            <div className="border-t border-[#3a6a3e] pt-4">
              <span className="silk block mb-2 text-[#4a7a4a]"># 內容</span>
              <p className="text-sm text-[#c8d8c8] leading-relaxed whitespace-pre-wrap">{post.content}</p>
            </div>

            {post.applyURL && (
              <div className="border-t border-[#3a6a3e] pt-4">
                <span className="silk block mb-2 text-[#4a7a4a]"># 報名連結</span>
                <a
                  href={post.applyURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#b87333] hover:text-[#d4a843] text-xs transition-colors"
                >
                  {post.applyURL} →
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
