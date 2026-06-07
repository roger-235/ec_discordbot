import prisma from "@/lib/prisma"

export async function POST(request: Request){
    const body = await request.json()
    const cores = await prisma.cores.create({
        data: {
            studentId: body.studentId,
            imageURL: body.imageURL,
            linkURL: body.linkURL,
            position: body.position,
            introduction: body.introduction
        }
    })
    return Response.json(cores, { status: 201 })
}

export async function GET(request: Request){
    const cores = await prisma.cores.findMany({
        include: { user: { select: { name: true, year: true }}}
    })
    return Response.json(cores)
}