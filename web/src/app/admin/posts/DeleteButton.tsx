"use client"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function DeleteButton({ postId }: { postId: number }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!confirm("確定要刪除這篇文章嗎？")) return
    setLoading(true)
    await fetch(`/api/posts/${postId}`, { method: "DELETE" })
    router.refresh()
    setLoading(false)
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="border border-red-500/50 text-red-400 hover:bg-red-500/10 disabled:opacity-40 px-3 py-1.5 text-xs transition-colors"
    >
      {loading ? "刪除中" : "刪除"}
    </button>
  )
}
