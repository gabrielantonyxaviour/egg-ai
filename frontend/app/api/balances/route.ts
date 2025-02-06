export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const eth = searchParams.get('eth') || ""
    const sol = searchParams.get('sol') || ""
    const prod = JSON.parse(searchParams.get('prod') || "false")
    const ethRpc = !prod ? `https://arb-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY || ""}` : `https://arb-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY || ""}`
    const solRpc = !prod ? `https://solana-devnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY || ""}` : `https://solana-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY || ""}`
    let ethBalance = "0";
    let solBalance = "0";

    try {
        const ethResponse = await fetch(ethRpc, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                jsonrpc: '2.0',
                method: 'eth_getBalance',
                params: [eth, 'latest'],
                id: 1
            }),
        });
        const ethData = await ethResponse.json();
        if (ethData.result) ethBalance = (parseInt(ethData.result, 16) / 1e18).toString();
        else return Response.json({
            error: "Failed to fetch ETH Balance",
        }, {
            status: 500
        })

        const solResponse = await fetch(solRpc, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                jsonrpc: '2.0',
                id: 1,
                method: 'getBalance',
                params: [sol],
            }),
        });
        const solData = await solResponse.json();
        if (solData.result?.value) solBalance = (parseFloat(solData.result.value) / 1e9).toString();
        else return Response.json({
            error: "Failed to fetch SOL Balance"
        }, {
            status: 500
        })

        return Response.json({ ethBalance, solBalance })
    } catch (error: any) {
        return Response.json({ error: error.message }, { status: 500 })
    }
}
