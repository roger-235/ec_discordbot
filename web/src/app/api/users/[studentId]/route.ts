import prisma from "@/lib/prisma"

export async function GET(
    request:Request,
    { params }: { params: Promise<{ studentId: string }>}
){
    const { studentId } = await params
    const user = await prisma.users.findUnique({
        where: { studentId: studentId.toUpperCase() }
    })
    if (!user) return Response.json({ error: "not found"}, { status: 404 })
    return Response.json(user)
}