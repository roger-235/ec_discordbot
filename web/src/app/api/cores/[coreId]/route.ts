import prisma from "@/lib/prisma"

export async function GET(
    request: Request,
    { params }: { params: Promise<{ coreId: string }>}
){
    const { coreId } = await params
    const core = await prisma.cores.findUnique({
        where: { coreId: parseInt(coreId) },
        include: { user: { select: { name: true, year: true } } }
    })
    if(!core) return Response.json({ error: "not found" }, { status: 404 })
    return Response.json(core)
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ coreId: string }>}
){
    const body = await request.json()
    const { coreId } = await params
    const core = await prisma.cores.update({
        where: { coreId: parseInt(coreId)},
        data: {
            studentId: body.studentId,
            imageURL: body.imageURL,
            linkURL: body.linkURL,
            position: body.position,
            introduction: body.introduction
        }
    })
    return Response.json(core, { status: 201 })
}

export async function DELETE(
    request:Request,
    { params }: { params: Promise<{ coreId: string }>}
){
    const { coreId } = await params
    await prisma.posts.delete({
        where: { postId: parseInt(coreId) }
    })
    return Response.json(null, { status: 204 })
}