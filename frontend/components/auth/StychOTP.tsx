import { useState } from 'react';
import { useStytch } from '@stytch/nextjs';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
type AuthView = 'default' | 'email' | 'phone' | 'wallet' | 'webauthn';

interface StytchOTPProps {
    method: OtpMethod;
    authWithStytch: any;
    setView: React.Dispatch<React.SetStateAction<AuthView>>;
}

type OtpMethod = 'email' | 'phone';
type OtpStep = 'submit' | 'verify';

/**
 * One-time passcodes can be sent via phone number through Stytch
 */
const StytchOTP = ({ method, authWithStytch, setView }: StytchOTPProps) => {
    const [step, setStep] = useState<OtpStep>('submit');
    const [userId, setUserId] = useState<string>('');
    const [methodId, setMethodId] = useState<string>('');
    const [code, setCode] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error>();

    const stytchClient = useStytch();

    async function sendPasscode(event: any) {
        event.preventDefault();
        setLoading(true);
        setError(undefined);
        try {
            let response;
            if (method === 'email') {
                response = await stytchClient.otps.email.loginOrCreate(userId);
            } else {
                response = await stytchClient.otps.sms.loginOrCreate(
                    !userId.startsWith('+') ? `+${userId}` : userId
                );
            }
            console.log(response);
            setMethodId(response.method_id);
            setStep('verify');
        } catch (err: any) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }

    async function authenticate(event: any) {
        event.preventDefault();
        setLoading(true);
        setError(undefined);
        try {
            const response = await stytchClient.otps.authenticate(code, methodId, {
                session_duration_minutes: 60,
            });
            await authWithStytch(response.session_jwt, response.user_id, method);
        } catch (err: any) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Card className="w-full max-w-md mx-auto my-12 bg-transparent border-[#c49963]">
            {error && (
                <Alert variant="destructive" className="mb-4">
                    <AlertDescription>{error.message}</AlertDescription>
                </Alert>
            )}

            {step === 'submit' && (
                <>
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">
                            Enter your {method}
                        </CardTitle>
                        <CardDescription>
                            A verification code will be sent to your {method}.
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={sendPasscode} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor={method} className="sr-only">
                                    {method === 'email' ? 'Email' : 'Phone number'}
                                </Label>
                                <Input
                                    id={method}
                                    value={userId}
                                    onChange={e => setUserId(e.target.value)}
                                    type={method === 'email' ? 'email' : 'tel'}
                                    name={method}
                                    placeholder={method === 'email' ? 'Your email' : 'Your phone number'}
                                    autoComplete="off"
                                    className="w-full"
                                />
                            </div>

                            <div className="flex flex-col space-y-2">
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-[#c49963] text-white hover:bg-[#d74b1a] hover:text-white"
                                >
                                    Send code
                                </Button>

                                <Button
                                    type="button"
                                    variant="link"
                                    onClick={() => setView('default')}
                                    className="w-full text-black"
                                >
                                    Back
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </>
            )}

            {step === 'verify' && (
                <>
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">
                            Check your {method}
                        </CardTitle>
                        <CardDescription>
                            Enter the 6-digit verification code to {userId}
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={authenticate} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="code" className="sr-only">
                                    Code
                                </Label>
                                <Input
                                    id="code"
                                    value={code}
                                    onChange={e => setCode(e.target.value)}
                                    type="text"
                                    name="code"
                                    placeholder="Verification code"
                                    autoComplete="off"
                                    className="w-full"
                                />
                            </div>

                            <div className="flex flex-col space-y-2">
                                <Button
                                    type="submit"
                                    className="w-full hover:bg-[#568428] hover:text-white"
                                >
                                    Verify
                                </Button>

                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setStep('submit')}
                                    className="w-full hover:bg-[#d74b1a] hover:text-white"
                                >
                                    Try again
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </>
            )}
        </Card>
    );
};

export default StytchOTP;
