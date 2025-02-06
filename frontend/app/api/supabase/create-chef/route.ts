import { createChef, storeImage } from '@/lib/supabase'

export async function POST(request: Request) {
    try {
        console.log('Received request to create chef')
        const formData = await request.formData()
        const image = formData.get('image') as File
        const username = formData.get('username') as string
        const name = formData.get('name') as string
        const bio = formData.get('bio') as string
        const niches = JSON.parse(formData.get('niches') as string)
        const subFee = parseFloat(formData.get('subFee') as string)
        const fileExt = image.name.split('.').pop()
        const fileName = `${username}.${fileExt}`

        console.log('Storing image with filename:', fileName)
        const imageUrl = await storeImage(fileName, image)
        console.log('Image stored at URL:', imageUrl)

        console.log('Creating chef with data:', { username, name, bio, image: imageUrl, niche: niches, sub_fee: subFee.toString() })
        const chef = await createChef({
            username: username,
            name,
            bio,
            image: imageUrl,
            niche: niches,
            sub_fee: subFee.toString(),
        })

        if (!chef) {
            console.error('Error creating chef')
            return Response.json(
                { error: 'Error creating chef' },
                { status: 500 }
            )
        }

        console.log('Chef created successfully:', chef)
        return Response.json({ chef })
    } catch (error) {
        console.error('Internal server error:', error)
        return Response.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
