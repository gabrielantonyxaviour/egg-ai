import { NextRequest, NextResponse } from 'next/server';
import { createHmac } from 'crypto';
import { cookies } from 'next/headers';
import { TelegramUser } from '@/types/telegram';
import { generateToken } from '@/lib/jwt';

export async function POST(request: NextRequest) {

    try {
        const userData: TelegramUser = await request.json();
        const { hash, ...dataToCheck } = userData;

        // Get your bot token from environment variables
        const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

        if (!BOT_TOKEN) {
            return NextResponse.json(
                { success: false, message: 'Bot token not configured' },
                { status: 500 }
            );
        }

        // Create data check string
        const dataCheckString = Object.keys(dataToCheck)
            .sort()
            .map(key => `${key}=${dataToCheck[key as keyof typeof dataToCheck]}`)
            .join('\n');

        // Create hash
        const secretKey = createHmac('sha256', 'WebAppData').update(BOT_TOKEN).digest();
        const calculatedHash = createHmac('sha256', secretKey)
            .update(dataCheckString)
            .digest('hex');

        // Verify hash
        if (calculatedHash !== hash) {
            return NextResponse.json(
                { success: false, message: 'Invalid authentication' },
                { status: 401 }
            );
        }


        const token = generateToken({
            userId: 'gasvgns', // Replace with actual user ID
            telegramId: userData.id
        });
        const response = NextResponse.json({
            success: true,
            user: dataToCheck
        });
        response.cookies.set({
            name: 'auth_token',
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 30 * 24 * 60 * 60, // 30 days in seconds
            path: '/',
        });
        return response;

    } catch (error) {
        console.error('Error processing Telegram authentication:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}
