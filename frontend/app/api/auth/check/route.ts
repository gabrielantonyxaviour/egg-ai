import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt';

export async function GET(request: NextRequest) {
    const cookieStore = cookies();
    const token = cookieStore.get('auth_token');

    if (!token) {
        return NextResponse.json(
            { success: false, message: 'No token found' },
            { status: 401 }
        );
    }

    const payload = verifyToken(token.value);
    if (!payload) {
        return NextResponse.json(
            { success: false, message: 'Invalid token' },
            { status: 401 }
        );
    }

    return NextResponse.json({
        success: true,
        user: {
            userId: payload.userId,
            telegramId: payload.telegramId
        }
    });
}