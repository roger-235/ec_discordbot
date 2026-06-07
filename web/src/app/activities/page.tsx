import Link from "next/link"
import prisma from "@/lib/prisma"

export default async function ActivitiesPage() {
  const posts = await prisma.posts.findMany({
    orderBy: { eventTime: "desc" },
  })

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-6">
      <div className="pcb-card p-6">
        <span className="silk block mb-2">SIGNAL-LOG · CH=ACTIVITIES</span>
        <h1 className="text-2xl font-black text-[#c8d8c8]">活動資訊</h1>
      </div>

      <div className="pcb-card divide-y divide-[#3a6a3e]">
        {posts.length === 0 && (
          <p className="px-6 py-8 silk text-[#4a7a4a]">目前沒有活動</p>
        )}
        {posts.map((post) => {
          const date = post.eventTime ? new Date(post.eventTime) : null
          return (
            <Link
              key={post.postId}
              href={`/activities/${post.postId}`}
              className="group flex items-center gap-6 px-6 py-5 hover:bg-[#b87333]/5 transition-colors"
            >
              <div className="text-center w-12 shrink-0">
                {date ? (
                  <>
                    <span className="silk block">{String(date.getMonth() + 1).padStart(2, "0")}</span>
                    <p className="text-3xl font-black text-[#c8d8c8] leading-none">{String(date.getDate()).padStart(2, "0")}</p>
                  </>
                ) : (
                  <p className="text-xs silk text-[#4a7a4a]">待定</p>
                )}
              </div>
              <div className="w-px h-12 bg-[#4a8a4e] shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="silk block mb-1">EVT-{String(post.postId).padStart(3, "0")}</span>
                <p className="text-sm text-[#c8d8c8] group-hover:text-[#d4a843] transition-colors">{post.title}</p>
                <p className="text-xs text-[#4a7a4a] mt-0.5 truncate">{post.content}</p>
              </div>
              <span className="text-[#4a8a4e] group-hover:text-[#b87333] transition-colors shrink-0">→</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
