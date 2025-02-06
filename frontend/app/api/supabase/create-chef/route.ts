import { createChef } from '@/lib/supabase'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const chef = await createChef(body)

        if (!chef) {
            return Response.json(
                { error: 'Failed to create chef' },
                { status: 400 }
            )
        }

        return Response.json({ chef })
    } catch (error) {
        return Response.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

