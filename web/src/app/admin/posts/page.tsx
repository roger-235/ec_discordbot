export const dynamic = 'force-dynamic'
import Link from "next/link"
import prisma from "@/lib/prisma"
import DeleteButton from "./DeleteButton"

export default async function AdminPostsPage() {
  const posts = await prisma.posts.findMany({
    orderBy: { createTime: "desc" },
  })

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-3">
      <div className="pcb-card px-8 py-5 flex items-center justify-between">
        <div>
          <span className="silk block mb-2">WRITE · POSTS · CH=ADMIN</span>
          <h1 className="text-3xl font-black text-[#e8f0e8]">活動管理</h1>
        </div>
        <Link
          href="/admin/posts/new"
          className="border border-[#b87333] text-[#d4a843] hover:bg-[#b87333]/10 px-4 py-2 text-xs tracking-widest transition-colors"
        >
          + 新增
        </Link>
      </div>

      <div className="pcb-card divide-y divide-[#3a6a3e]">
        <div className="grid grid-cols-12 px-6 py-3 silk text-[#4a7a4a] text-xs">
          <span className="col-span-1">ID</span>
          <span className="col-span-5">標題</span>
          <span className="col-span-3">活動日期</span>
          <span className="col-span-3">建立時間</span>
        </div>

        {posts.length === 0 && (
          <p className="px-6 py-8 silk text-[#4a7a4a]">目前沒有文章</p>
        )}

        {posts.map((post) => (
          <div key={post.postId} className="grid grid-cols-12 px-6 py-4 text-xs items-center hover:bg-[#b87333]/5 transition-colors">
            <span className="col-span-1 silk text-[#4a7a4a]">{post.postId}</span>
            <span className="col-span-5 text-[#c8d8c8] truncate pr-4">{post.title}</span>
            <span className="col-span-3 silk text-[#4a7a4a]">
              {post.eventTime ? new Date(post.eventTime).toLocaleDateString("zh-TW") : "—"}
            </span>
            <div className="col-span-3 flex items-center gap-2">
              <span className="silk text-[#4a7a4a] flex-1">
                {new Date(post.createTime).toLocaleDateString("zh-TW")}
              </span>
              <Link
                href={`/admin/posts/${post.postId}/edit`}
                className="border border-[#4a8a4e] text-[#7aaa7a] hover:border-[#b87333] hover:text-[#d4a843] px-3 py-1.5 text-xs transition-colors"
              >
                編輯
              </Link>
              <DeleteButton postId={post.postId} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
