import { useConnect } from 'wagmi';
import { useIsMounted } from '../../hooks/useIsMounted';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Image from 'next/image';
type AuthView = 'default' | 'email' | 'phone' | 'wallet' | 'webauthn';

interface WalletMethodsProps {
    authWithEthWallet: (connector: any) => Promise<void>;
    setView: React.Dispatch<React.SetStateAction<AuthView>>;
}

const WalletMethods = ({ authWithEthWallet, setView }: WalletMethodsProps) => {
    const isMounted = useIsMounted();
    const { connectors } = useConnect();

    if (!isMounted) return null;

    return (
        <Card className="w-full max-w-md mx-auto my-12 bg-transparent border-[#c49963]">
            <CardHeader>
                <CardTitle className="text-2xl font-bold">
                    Connect your web3 wallet
                </CardTitle>
                <CardDescription>
                    Connect your wallet then sign a message to verify you&apos;re the owner
                    of the address.
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
                <div className="flex flex-col space-y-3">
                    {connectors.map(connector => (
                        <Button
                            key={connector.id}
                            variant="outline"
                            disabled={!connector.ready}
                            onClick={() => authWithEthWallet({ connector })}
                            className="w-full h-12 flex items-center space-x-3 justify-start px-4 bg-[#c49963] text-white hover:bg-[#d74b1a] hover:text-white"
                        >
                            {connector.name.toLowerCase() === 'metamask' && (
                                <div className="relative w-6 h-6">
                                    <img
                                        src="/metamask.png"
                                        alt="MetaMask logo"
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                            )}
                            {connector.name.toLowerCase() === 'coinbase wallet' && (
                                <div className="relative w-6 h-6">
                                    <img
                                        src="/coinbase.png"

                                        alt="Coinbase logo"
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                            )}
                            <span className="flex-grow text-left">
                                Continue with {connector.name}
                            </span>
                        </Button>
                    ))}
                </div>

                <Button
                    variant="link"
                    onClick={() => setView('default')}
                    className="w-full mt-2 text-black"
                >
                    Back
                </Button>
            </CardContent>
        </Card>
    );
};

export default WalletMethods;
