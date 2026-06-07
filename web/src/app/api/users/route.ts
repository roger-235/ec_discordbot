import prisma from "@/lib/prisma"

export async function POST(request: Request){
    const body = await request.json()
    const users = await prisma.users.create({
        data: {
            studentId: body.studentId,
            year: body.year,
            name: body.name,
            class: body.class,
            identity: body.identity,
        }
    })
    return Response.json(users, { status: 201 })
}
export async function GET(request: Request){
    const users = await prisma.users.findMany()
    return Response.json(users)
}