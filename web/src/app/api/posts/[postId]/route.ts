import prisma from "@/lib/prisma"

export async function GET(
    request: Request,
    { params }: { params: Promise<{ postId: string }> }
){
    const { postId } = await params
    const post = await prisma.posts.findUnique({
        where: { postId: parseInt(postId) }
    })
    if (!post) return Response.json({ error: "not found" }, { status: 404 })
    return Response.json(post)
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ postId: string }> }
){
    const body = await request.json()
    const { postId } = await params
    const post = await prisma.posts.update({
        where: { postId: parseInt(postId) },
        data: {
            title:      body.title,
            content:    body.content,
            applyURL:   body.applyURL,
            eventTime:  body.eventTime
        }
    })
    return Response.json(post, { status: 201 })
}

export async function DELETE(
    request:Request,
    { params }: { params: Promise<{ postId: string }>}
){
    const { postId } = await params
    await prisma.posts.delete({
        where: { postId: parseInt(postId) }
    })
    return Response.json(null, { status: 204 })
}