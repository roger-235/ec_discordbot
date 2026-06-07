import prisma from "@/lib/prisma"
 
export async function POST(request: Request){
    const body = await request.json()
    const posts = await prisma.posts.create({
        data: {
            title: body.title,
            content: body.content,
            applyURL: body.applyURL,
            eventTime: body.eventTime
        }
    })
    return Response.json(posts, { status: 201 } )
}

export async function GET(request: Request){
    const posts = await prisma.posts.findMany()
    return Response.json(posts)
}