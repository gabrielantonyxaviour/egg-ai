import jwt from 'jsonwebtoken';

interface TokenPayload {
    userId: string;
    telegramId: number;
    exp?: number;
    iat?: number;
}

const JWT_SECRET = process.env.JWT_SECRET || '';
const TOKEN_EXPIRY = '30d'; // 1 month validity

export function generateToken(payload: Omit<TokenPayload, 'exp' | 'iat'>): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

export function verifyToken(token: string): TokenPayload | null {
    try {
        return jwt.verify(token, JWT_SECRET) as TokenPayload;
    } catch (error) {
        return null;
    }
}
