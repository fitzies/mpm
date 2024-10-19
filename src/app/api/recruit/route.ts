import prisma from "@/lib/prisma"

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')?.toString()

    if (!id) {
        return new Response(JSON.stringify({ error: "No id was provided" }), { status: 400 })
    }

    try {
        const recruit = await prisma.recruit.findUnique({
            where: { id },
        })

        if (!recruit) {
            return new Response(JSON.stringify({ error: "Recruit not found" }), { status: 404 })
        }

        return new Response(JSON.stringify({ recruit }), { status: 200 })
    } catch (error) {
        console.error("Error fetching recruit:", error)
        return new Response(JSON.stringify({ error: "An error occurred" }), { status: 500 })
    }
}