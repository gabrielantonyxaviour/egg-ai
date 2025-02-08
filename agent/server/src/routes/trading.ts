import { Router, Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import jwksClient from "jwks-rsa";



declare module "express" {
    export interface Request {
        user?: JwtPayload; // Modify this type based on the actual JWT payload structure
        tradePlay?: TradePlay;
    }
}

const router = Router();
const client = jwksClient({
    jwksUri: "https://auth.privy.io/api/v1/apps/cm6sxwdpg00d7fe5wlubpqfzn/jwks.json",
});

async function getSigningKey(kid: string): Promise<string> {
    const key = await client.getSigningKey(kid);
    return key.getPublicKey();
}

export async function verifyPrivyToken(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ error: "Unauthorized" }); // ❌ Don't return inside `async` functions
        return;
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.decode(token, { complete: true }) as { header: { kid: string } } | null;
        if (!decoded || !decoded.header.kid) {
            res.status(401).json({ error: "Invalid token" });
            return;
        }

        const key = await getSigningKey(decoded.header.kid);

        const verified = jwt.verify(token, key, { algorithms: ["RS256"] }) as JwtPayload;

        (req as any).user = verified; // ✅ Fix TypeScript error

        return next(); // ✅ Correctly call `next()`
    } catch (err) {
        res.status(401).json({ error: "Invalid token" });
        return;
    }
}



export function verifyTradeUsername(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    // Validate that request body exists
    if (!req.body) {
        res.status(400).json({ error: "Missing request body" });
        return;
    }

    const tradePlay = req.body as TradePlay;

    // Basic validation of required fields
    if (!tradePlay.username || !tradePlay.chef_id || !tradePlay.asset) {
        res.status(400).json({ error: "Missing required fields" });
        return;
    }

    // Ensure user is authenticated
    if (!req.user) {
        res.status(401).json({ error: "User not authenticated" });
        return;
    }

    // Get the authenticated username from Privy JWT
    const authenticatedUsername = req.user.telegram?.username;

    if (!authenticatedUsername) {
        res.status(401).json({ error: "No telegram username found in authentication token" });
        return;
    }

    // Verify username matches
    if (tradePlay.username !== authenticatedUsername) {
        res.status(403).json({
            error: "Username mismatch",
            message: "The provided username does not match the authenticated user"
        });
        return;
    }

    // Store validated trade play in request for later use
    req.tradePlay = tradePlay;
    next();
}


router.post("/play", verifyPrivyToken, verifyTradeUsername, async (req: Request, res: Response): Promise<void> => {
    try {
        const tradePlay = req.tradePlay!;

        // Step 1: Get Market data from GMX
        // Step 2: Get Social data from Cookie.fun
        // Step 3: Get 

        res.json({
            message: "Trade play validated",
            username: tradePlay.username,
            tradeDetails: tradePlay
        });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;
