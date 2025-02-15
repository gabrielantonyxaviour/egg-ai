import Image from 'next/image';
import { SELECTED_LIT_NETWORK } from '../../lib/lit';
import { useState } from "react";
import StytchOTP from '../auth/StychOTP';
import WalletMethods from '../auth/WalletMethods';
import WebAuthn from '../auth/WebAuthn';
import AuthMethods from '../auth/AuthMethods';

type AuthView = 'default' | 'email' | 'phone' | 'wallet' | 'webauthn';
interface ConnectModalProps {
    handleGoogleLogin: () => Promise<void>;
    handleDiscordLogin: () => Promise<void>;
    authWithEthWallet: any;
    registerWithWebAuthn: any;
    authWithWebAuthn: any;
    authWithStytch: any;
    error?: Error;
    mode: number;
    onClose: () => void;
    onModeToggle: () => void;
}

export default function ConnectModal({ handleGoogleLogin, handleDiscordLogin, authWithEthWallet, registerWithWebAuthn, authWithWebAuthn, authWithStytch, onModeToggle, onClose, mode }: ConnectModalProps) {
    const [view, setView] = useState<AuthView>('default');

    return <div className="sen absolute bg-black top-[13%] lg:top-[20%] left-[27%] lg:left-[33%] w-[100%] md:w-[550px] 2xl:h-[60%] lg:h-[70%] h-[80%] rounded-xl mx-auto">
        <div className="p-4 absolute flex flex-col justify-start -top-[4px] -left-[4px] bg-[#faefe0]  w-full mx-auto h-full rounded-xl border-[1px] border-black">
            <div className="flex flex-col items-center justify-center space-x-2 text-center pt-2 font-bold text-xl sen tracking-wide">
                <Image src="/lit.jpg" width={40} height={25} alt="lit" className="rounded-full group-hover:filter group-hover:invert" />
                <p>Connect Lit Wallet</p>
            </div>
            {view === 'default' && (
                <>

                    {mode == 1 ? <>
                        <p className='text-center text-md leading-tight py-2'>Welcome back!<br />Access your Lit wallet.</p>
                    </> : <>
                        <p className='text-center text-sm leading-tight py-2 px-10'>Get started on the {SELECTED_LIT_NETWORK} network.<br />Create a wallet that is secured by accounts you already have. With
                            Lit-powered programmable MPC wallets, you won&apos;t have to worry
                            about seed phrases.</p>
                    </>}
                    <AuthMethods setView={setView} handleDiscordLogin={handleDiscordLogin} handleGoogleLogin={handleGoogleLogin} />
                    <div className="flex justify-center">
                        <button
                            className="text-xs hover:underline"
                            onClick={onModeToggle}
                        >
                            {mode == 1 ? "Need an account? Sign up" : "Have an account? Log in"}
                        </button>
                    </div>
                </>
            )}
            {view === 'email' && (
                <StytchOTP
                    method={'email'}
                    authWithStytch={authWithStytch}
                    setView={setView}
                />
            )}
            {view === 'phone' && (
                <StytchOTP
                    method={'phone'}
                    authWithStytch={authWithStytch}
                    setView={setView}
                />
            )}
            {view === 'wallet' && (
                <WalletMethods
                    authWithEthWallet={authWithEthWallet}
                    setView={setView}
                />
            )}
            {view === 'webauthn' && (
                <WebAuthn
                    start={mode == 1 ? "authenticate" : 'register'}
                    authWithWebAuthn={authWithWebAuthn}
                    setView={setView}
                    registerWithWebAuthn={mode == 2 ? registerWithWebAuthn : undefined}
                />
            )}
        </div>
    </div>
}