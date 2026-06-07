"use client"
import Link from "next/link"
import { motion } from "framer-motion"

type Post = {
  postId: number
  title: string
  createTime: Date
}

export default function HomeClient({ posts, postCount, coreCount }: { posts: Post[]; postCount: number; coreCount: number }) {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-3">

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="pcb-card p-10 flex items-end justify-between gap-8 min-h-[220px]"
      >
        <div>
          <span className="silk block mb-5">REF: U1 · NKUST-EC · VCC=3.3V · GND</span>
          <h1 className="text-5xl font-black text-[#e8f0e8] leading-none tracking-tight mb-4">
            電子工程系<br />
            <span className="text-[#d4a843]">系學會</span>
          </h1>
          <p className="text-sm text-[#7aaa7a] max-w-xs leading-relaxed">
            # 國立高雄科技大學 建工校區
          </p>
        </div>
        <div className="flex flex-col gap-3 shrink-0 self-end pb-1">
          <Link
            href="/activities"
            className="border border-[#b87333] text-[#d4a843] hover:bg-[#b87333]/10 text-xs px-8 py-3 tracking-widest transition-colors block text-center"
          >
            活動 →
          </Link>
          <Link
            href="/members/search"
            className="border border-[#4a8a4e] text-[#7aaa7a] hover:border-[#7aaa7a] hover:text-[#e8f0e8] text-xs px-8 py-3 tracking-widest transition-colors block text-center"
          >
            會員查詢
          </Link>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">

        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="md:col-span-7 pcb-card divide-y divide-[#3a6a3e]"
        >
          <div className="px-6 py-3 flex items-center justify-between">
            <span className="silk">C1 · LOG OUTPUT</span>
            <span className="silk">CH=ALL</span>
          </div>
          {posts.length === 0 && (
            <p className="px-6 py-6 silk text-[#4a7a4a]">目前沒有公告</p>
          )}
          {posts.map((post, i) => (
            <motion.div
              key={post.postId}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 + i * 0.08 }}
            >
              <Link
                href={`/activities/${post.postId}`}
                className="flex items-center gap-4 px-6 py-4 hover:bg-[#b87333]/5 transition-colors"
              >
                <span className="silk w-20 shrink-0">MSG-{String(post.postId).padStart(3, "0")}</span>
                <span className="text-[#e8f0e8] text-sm flex-1">{post.title}</span>
                <span className="silk shrink-0 hidden sm:block">
                  {new Date(post.createTime).toLocaleDateString("zh-TW")}
                </span>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <div className="md:col-span-5 flex flex-col gap-3">
          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35, duration: 0.6 }}
            className="pcb-card grid grid-cols-3 divide-x divide-[#3a6a3e]"
          >
            {[
              { ref: "R1", label: "學年", val: String(new Date().getFullYear() - (new Date().getMonth() >= 7 ? 1911 : 1912)) },
              { ref: "R2", label: "活動數量", val: String(postCount) },
              { ref: "R3", label: "幹部數量", val: String(coreCount) },
            ].map((s) => (
              <div key={s.ref} className="px-4 py-5 text-center">
                <span className="silk block mb-1">{s.label}</span>
                <p className="text-2xl font-black text-[#e8f0e8]">{s.val}</p>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="pcb-card divide-y divide-[#3a6a3e] flex-1"
          >
            <div className="px-6 py-3">
              <span className="silk">J1~J3 · CONNECTORS</span>
            </div>
            {[
              { href: "/cadres", ref: "J1", label: "幹部介紹" },
              { href: "/activities", ref: "J2", label: "活動資訊" },
              { href: "/members/search", ref: "J3", label: "會員查詢" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-center justify-between px-6 py-3.5 hover:bg-[#b87333]/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="silk">{item.ref}</span>
                  <span className="text-sm text-[#e8f0e8] group-hover:text-[#d4a843] transition-colors">{item.label}</span>
                </div>
                <span className="text-[#4a8a4e] group-hover:text-[#b87333] transition-colors">→</span>
              </Link>
            ))}
          </motion.div>
        </div>
      </div>

    </div>
  )
}
