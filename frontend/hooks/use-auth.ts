import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
    userId: string;
    telegramId: number;
}

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch('/api/auth/check', {
                    credentials: 'include' // Important for sending cookies
                });

                if (!response.ok) {
                    throw new Error('Not authenticated');
                }

                const data = await response.json();
                setUser(data.user);
            } catch (error) {
                setUser(null);
                router.push('/login');
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [router]);

    return { user, loading };
}
