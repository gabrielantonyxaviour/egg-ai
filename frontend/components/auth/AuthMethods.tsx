import Image from 'next/image';
import { Button } from "@/components/ui/button";
import {
    Mail,
    Phone,
    Wallet,
    Key
} from "lucide-react";
type AuthView = 'default' | 'email' | 'phone' | 'wallet' | 'webauthn';
interface AuthMethodsProps {
    handleGoogleLogin: () => Promise<void>;
    handleDiscordLogin: () => Promise<void>;
    setView: React.Dispatch<React.SetStateAction<AuthView>>;
}

const AuthMethods = ({
    handleGoogleLogin,
    handleDiscordLogin,
    setView,
}: AuthMethodsProps) => {
    return (
        <>
            <div className="flex flex-col space-y-4 w-full max-w-sm mx-auto p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                    <Button
                        variant="outline"
                        className="w-full flex items-center space-x-2 lg:h-12 h-10 bg-[#c49963] text-white hover:bg-[#d74b1a] hover:text-white"
                        onClick={handleGoogleLogin}
                    >
                        <img
                            src="/google.png"
                            alt="Google logo"
                            className="w-5 h-5"
                        />
                        <span>Google</span>
                    </Button>

                    <Button
                        variant="outline"
                        className="w-full flex items-center space-x-2 lg:h-12 h-10 bg-[#c49963] text-white hover:bg-[#d74b1a] hover:text-white"
                        onClick={handleDiscordLogin}
                    >
                        <img
                            src="/discord.png"
                            alt="Discord logo"
                            className="w-5 h-5"
                        />
                        <span>Discord</span>
                    </Button>
                </div>

                <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className=" px-2 text-muted-foreground">
                            Or continue with
                        </span>
                    </div>
                </div>

                <div className="flex flex-col space-y-2">
                    <Button
                        variant="outline"
                        className="w-full flex items-center space-x-2 lg:h-12 h-10 bg-[#c49963] text-white hover:bg-[#d74b1a] hover:text-white"
                        onClick={() => setView('email')}
                    >
                        <Mail className="w-5 h-5" />
                        <span>Email</span>
                    </Button>

                    <Button
                        variant="outline"
                        className="w-full flex items-center space-x-2 lg:h-12 h-10 bg-[#c49963] text-white hover:bg-[#d74b1a] hover:text-white"
                        onClick={() => setView('phone')}
                    >
                        <Phone className="w-5 h-5" />
                        <span>Phone</span>
                    </Button>

                    <Button
                        variant="outline"
                        className="w-full flex items-center space-x-2 lg:h-12 h-10 bg-[#c49963] text-white hover:bg-[#d74b1a] hover:text-white"
                        onClick={() => setView('wallet')}
                    >
                        <Wallet className="w-5 h-5" />
                        <span>Web3 Wallet</span>
                    </Button>

                    <Button
                        variant="outline"
                        className="w-full flex items-center space-x-2 lg:h-12 h-10 bg-[#c49963] text-white hover:bg-[#d74b1a] hover:text-white"
                        onClick={() => setView('webauthn')}
                    >
                        <Key className="w-5 h-5" />
                        <span>Passkey</span>
                    </Button>
                </div>
            </div>
        </>
    );
};

export default AuthMethods;
