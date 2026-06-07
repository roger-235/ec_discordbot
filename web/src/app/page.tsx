import prisma from "@/lib/prisma"
import HomeClient from "./HomeClient"

export default async function HomePage() {
  const [posts, postCount, coreCount] = await Promise.all([
    prisma.posts.findMany({ orderBy: { createTime: "desc" }, take: 5 }),
    prisma.posts.count(),
    prisma.cores.count(),
  ])
  return <HomeClient posts={posts} postCount={postCount} coreCount={coreCount} />
}
