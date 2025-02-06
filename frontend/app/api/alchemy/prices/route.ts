export async function GET(request: Request) {
    try {
        const response = await fetch(`https://api.g.alchemy.com/prices/v1/${process.env.ALCHEMY_API_KEY || ""}/tokens/by-symbol?symbols=ETH&symbols=SOL`, { method: 'GET', headers: { accept: 'application/json' } })
        const data = await response.json()
        console.log(data)

        return Response.json({ eth: data[0].prices[0].value, sol: data[1].prices[0].value })
    } catch (error: any) {
        return Response.json({ error: error.message }, { status: 500 })
    }
}
