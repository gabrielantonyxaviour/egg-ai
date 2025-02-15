import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

type WebAuthnStep = 'register' | 'authenticate';
type AuthView = 'default' | 'email' | 'phone' | 'wallet' | 'webauthn';

interface WebAuthnProps {
    start: WebAuthnStep;
    authWithWebAuthn: any;
    setView: React.Dispatch<React.SetStateAction<AuthView>>;
    registerWithWebAuthn?: any;
}

export default function WebAuthn({
    start,
    authWithWebAuthn,
    setView,
    registerWithWebAuthn,
}: WebAuthnProps) {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error>();
    const [step, setStep] = useState<WebAuthnStep>(start);

    async function handleRegister() {
        setError(undefined);
        setLoading(true);
        try {
            await registerWithWebAuthn();
            setStep('authenticate');
        } catch (err: any) {
            console.error(err);
            setError(err);
        }
        setLoading(false);
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center space-y-4 min-h-[200px]">
                {error && (
                    <Alert variant="destructive" className="mb-4">
                        <AlertDescription>{error.message}</AlertDescription>
                    </Alert>
                )}
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">
                    Follow the prompts to continue...
                </p>
            </div>
        );
    }

    return (
        <Card className="w-full max-w-md mx-auto my-12 bg-transparent border-[#c49963]">
            {error && (
                <Alert variant="destructive" className="mb-4">
                    <AlertDescription>{error.message}</AlertDescription>
                </Alert>
            )}

            {step === 'register' && (
                <>
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">
                            Register with a passkey
                        </CardTitle>
                        <CardDescription>
                            Passkeys enable simple and secure passwordless authentication.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <Button
                            variant="outline"
                            onClick={handleRegister}
                            disabled={loading}
                            className="w-full bg-[#c49963] text-white hover:bg-[#d74b1a] hover:text-white"
                        >
                            {loading && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Create a credential
                        </Button>

                        <Button
                            variant="link"
                            onClick={() => setView('default')}
                            className="w-full text-black"
                        >
                            Back
                        </Button>
                    </CardContent>
                </>
            )}

            {step === 'authenticate' && (
                <>
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">
                            Authenticate with your passkey
                        </CardTitle>
                        <CardDescription>
                            Sign in using your passkey.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <Button
                            variant="outline"
                            onClick={authWithWebAuthn}
                            disabled={loading}
                            className="w-full bg-[#c49963] text-white hover:bg-[#d74b1a] hover:text-white"
                        >
                            {loading && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Sign in with passkey
                        </Button>

                        <Button
                            variant="link"
                            onClick={() => setView('default')}
                            className="w-full text-black"
                        >
                            Back
                        </Button>
                    </CardContent>
                </>
            )}
        </Card>
    );
}
