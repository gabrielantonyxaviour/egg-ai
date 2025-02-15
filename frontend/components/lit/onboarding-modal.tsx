import { IRelayPKP, SessionSigs } from '@lit-protocol/types';
import { CircleDashedIcon, Copy, RefreshCcw } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"
import {
    RadioGroup,
    RadioGroupItem,
} from "@/components/ui/radio-group"
import { PKPEthersWallet } from '@lit-protocol/pkp-ethers';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { ScrollArea, ScrollBar } from '../ui/scroll-area';
import { createPublicClient, FeeCapTooHighError, formatEther, http } from 'viem';
import { mainnet } from 'viem/chains'
import { LitContracts } from '@lit-protocol/contracts-sdk';
import { litDevnet, toolIpfsCids } from '@/lib/constants';
import { getPkpToolRegistryContract, litNodeClient } from '@/lib/lit';
import { AUTH_METHOD_SCOPE, LIT_NETWORK } from '@lit-protocol/constants';
import { User } from '@/types';
import { useRouter } from 'next/navigation';
import { useEnvironmentStore } from '../context';

interface OnboardingModalProps {
    error?: Error;
    loadingStatus: number;
    accounts: IRelayPKP[];
    currentAccount: IRelayPKP | undefined;
    sessionSigs: SessionSigs | undefined;
    setCurrentAccount: any;
    signUp: () => void;
}

export default function OnboardingModal({ loadingStatus, accounts, setCurrentAccount, currentAccount, sessionSigs, error, signUp }: OnboardingModalProps) {
    const [selectedValue, setSelectedValue] = useState("0")
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [copied, setCopied] = useState(false);
    const [refreshed, setRefreshed] = useState(false)
    const [litBalance, setLitBalance] = useState(0);
    const [loadingStep, setLoadingStep] = useState(0)
    const router = useRouter()
    const { setUser } = useEnvironmentStore((state) => state)

    const fetchLitBalance = async (address: string) => {
        try {

            const publicClient = createPublicClient({
                chain: litDevnet,
                transport: http()
            })
            const balance = await publicClient.getBalance({
                address: currentAccount?.ethAddress as `0x${string}`,
            })

            const formattedBalance = formatEther(balance)

            setLitBalance(parseFloat(formattedBalance))
        } catch (error) {
            console.error('Failed to fetch balance:', error)
        }
    }

    useEffect(() => {
        if (currentAccount?.ethAddress)
            fetchLitBalance(currentAccount?.ethAddress as `0x${string}`)
    }, [currentAccount?.ethAddress])
    const handleCopy = async (address: string | undefined): Promise<void> => {
        if (!address) return;

        try {
            await navigator.clipboard.writeText(address);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);

        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const handleRefresh = async (address: string | undefined): Promise<void> => {
        if (!address) return;

        try {
            await fetchLitBalance(address)
            setRefreshed(true);
            setTimeout(() => setRefreshed(false), 2000);

        } catch (err) {
            console.error('Failed to refresh:', err);
        }
    };
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const selectedAccount = accounts[parseInt(selectedValue)]
        return setCurrentAccount(selectedAccount)
    }

    const handleCreateAccountSubmit = async (e: React.FormEvent) => {
        try {
            e.preventDefault()
            if (!currentAccount) return
            setLoadingStep(1)
            await litNodeClient.connect();
            const pkpWallet = new PKPEthersWallet({
                controllerSessionSigs: sessionSigs,
                pkpPubKey: currentAccount.publicKey,
                litNodeClient: litNodeClient,
            });
            await pkpWallet.init();


            const toolRegistryContract = getPkpToolRegistryContract({
                rpcUrl: "https://yellowstone-rpc.litprotocol.com",
                contractAddress: '0x2707eabb60D262024F8738455811a338B0ECd3EC',
            }, pkpWallet)

            console.log("Tool Registry Contract")
            console.log(toolRegistryContract.address)

            // First add Delegatee
            console.log("Tx Params")
            console.log([
                currentAccount.tokenId
                , [process.env.NEXT_PUBLIC_AI_AGENT_ADDRESS]
            ])

            const isDelegatee = await toolRegistryContract.isPkpDelegatee(
                currentAccount.tokenId, process.env.NEXT_PUBLIC_AI_AGENT_ADDRESS
            )
            console.log("Is Delegatee: ", isDelegatee)

            if (!isDelegatee) {
                const tx = await toolRegistryContract.addDelegatees(
                    currentAccount.tokenId
                    , [process.env.NEXT_PUBLIC_AI_AGENT_ADDRESS], {
                    gasLimit: 300000
                })
                console.log(tx)
                const txReceipt = await tx.wait()
                console.log("Add Delegatee Receipt: ", txReceipt)
            }


            // Register Tool
            setLoadingStep(2)

            const litContracts = new LitContracts({
                signer: pkpWallet,
                network: LIT_NETWORK.DatilDev,
                debug: false,
            });
            await litContracts.connect();
            const addPermittedActionTxOne = await litContracts.addPermittedAction({
                ipfsId: toolIpfsCids[0],
                authMethodScopes: [AUTH_METHOD_SCOPE.SignAnything],
                pkpTokenId: currentAccount.tokenId as any,
            });

            console.log("First permitted action added:", addPermittedActionTxOne);

            const addPermittedActionTxTwo = await litContracts.addPermittedAction({
                ipfsId: toolIpfsCids[1],
                authMethodScopes: [AUTH_METHOD_SCOPE.SignAnything],
                pkpTokenId: currentAccount.tokenId as any,
            });

            console.log("Second permitted action added:", addPermittedActionTxTwo);

            const toolIpfsCidParams = []
            const [isToolOneRegistered,] = await toolRegistryContract.isToolRegistered(currentAccount.tokenId, toolIpfsCids[0])
            console.log("Is Tool One Registered: ", isToolOneRegistered)
            if (!isToolOneRegistered) {
                toolIpfsCidParams.push(toolIpfsCids[0])
            }
            const [isToolTwoRegistered,] = await toolRegistryContract.isToolRegistered(currentAccount.tokenId, toolIpfsCids[1])
            console.log("Is Tool Two Registered: ", isToolTwoRegistered)
            if (!isToolTwoRegistered) {
                toolIpfsCidParams.push(toolIpfsCids[1])
            }
            if (toolIpfsCidParams.length > 0) {
                console.log("Register Tx params")
                console.log([
                    currentAccount.tokenId,
                    toolIpfsCidParams,
                    true
                ])
                const registerTx = await toolRegistryContract.registerTools(
                    currentAccount.tokenId,
                    toolIpfsCidParams,
                    true, {
                    gasLimit: 600000
                });

                console.log("Transaction sent:", registerTx);
                const registerTxReceipt = await registerTx.wait()
                console.log("Register tools for PKP Receipt: ", registerTxReceipt)
            }


            // Permit Tool
            setLoadingStep(3)

            const [isToolOnePermitted,] = await toolRegistryContract.isToolPermittedForDelegatee(currentAccount.tokenId, toolIpfsCids[0], process.env.NEXT_PUBLIC_AI_AGENT_ADDRESS)

            if (!isToolOnePermitted) {
                console.log("First Tool Permit Tx Params")
                console.log([
                    currentAccount.tokenId,
                    [toolIpfsCids[0]],
                    [process.env.NEXT_PUBLIC_AI_AGENT_ADDRESS]
                ])
                const firstToolPermitTx = await toolRegistryContract.permitToolsForDelegatees(
                    currentAccount.tokenId,
                    [toolIpfsCids[0]],
                    [process.env.NEXT_PUBLIC_AI_AGENT_ADDRESS], {
                    gasLimit: 500000
                });
                console.log("First Tool Permit Tx:", firstToolPermitTx)
                const firstToolPermitTxReceipt = await firstToolPermitTx.wait()
                console.log("First Tool Permit Receipt: ", firstToolPermitTxReceipt)
            }

            const [isToolTwoPermitted,] = await toolRegistryContract.isToolPermittedForDelegatee(currentAccount.tokenId, toolIpfsCids[1], process.env.NEXT_PUBLIC_AI_AGENT_ADDRESS)

            if (!isToolTwoPermitted) {
                console.log("Second Tool Permit Tx Params")
                console.log([
                    currentAccount.tokenId,
                    [toolIpfsCids[1]],
                    [process.env.NEXT_PUBLIC_AI_AGENT_ADDRESS]
                ])
                const secondToolPermitTx = await toolRegistryContract.permitToolsForDelegatees(
                    currentAccount.tokenId,
                    [toolIpfsCids[1]],
                    [process.env.NEXT_PUBLIC_AI_AGENT_ADDRESS], {
                    gasLimit: 500000
                });
                console.log("Second Tool Permit Tx:", secondToolPermitTx)
                const secondToolPermitTxReceipt = await secondToolPermitTx.wait()
                console.log("Second Tool Permit Receipt: ", secondToolPermitTxReceipt)
            }

            // Create Safe
            setLoadingStep(4)

            const createSafeResponse = await fetch('/api/safe/create', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    pkpEthAddress: currentAccount.ethAddress,
                    additionalSigner: process.env.NEXT_PUBLIC_AI_AGENT_ADDRESS
                }),
            })

            const { safeAddress } = await createSafeResponse.json()

            // Store everything in supabase
            setLoadingStep(5)

            const user: User = {
                id: BigInt(currentAccount.tokenId.hex).toString(),
                name,
                email,
                safe_address: safeAddress,
                pkp_address: currentAccount.ethAddress,
                agent_url: "https://notable-honestly-urchin.ngrok-free.app/chat",
                paused: false,
                mode: 'TREN',
            }

            await fetch('/api/supabase/create-user', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(user),
            })

            setUser(user)

            // Everything done
            setLoadingStep(6)
        } catch (e) {
            console.log(e)
            setLoadingStep(0)
        }

    }
    return <div className="sen absolute bg-black top-[13%] lg:top-[20%] left-[27%] lg:left-[33%] w-[100%] md:w-[550px] 2xl:h-[60%] lg:h-[70%] h-[80%] rounded-xl mx-auto">
        <div className="p-4 absolute flex flex-col justify-start -top-[4px] -left-[4px] bg-[#faefe0]  w-full mx-auto h-full rounded-xl border-[1px] border-black">
            <div className="flex flex-col items-center justify-center space-x-2 text-center pt-2 font-bold text-xl sen tracking-wide">
                <Image src="/lit.jpg" width={40} height={25} alt="lit" className="rounded-full group-hover:filter group-hover:invert" />
                <p>Connect Lit Wallet</p>
            </div>
            {
                loadingStatus == 1 ? <div className="flex justify-center flex-1 space-x-2 pb-8 items-center">
                    <CircleDashedIcon className="h-6 w-6 animate-spin" /> <p>Authenticating your credentials</p>
                </div> : loadingStatus == 2 ? <div className="flex justify-center flex-1 space-x-2 pb-8 items-center">
                    <CircleDashedIcon className="h-6 w-6 animate-spin" /> <p>Looking up your accounts</p>
                </div> : loadingStatus == 3 ? <div className="flex justify-center flex-1 space-x-2 pb-8 items-center">
                    <CircleDashedIcon className="h-6 w-6 animate-spin" /> <p>Securing your session</p>
                </div> : loadingStatus == 4 ? <>
                    <h1 className='mt-8'>Choose your account</h1>
                    <p className='mb-4'>Continue with one of your accounts.</p>
                    <form onSubmit={handleSubmit} className="space-y-6">

                        <ScrollArea className="max-h-[250px] overflow-y-auto">
                            <RadioGroup
                                defaultValue="0"
                                value={selectedValue}
                                onValueChange={setSelectedValue}
                                className="space-y-2"
                            >
                                {accounts.map((account, index) => (
                                    <div
                                        key={`account-${index}`}
                                        className="flex items-center space-x-2 rounded-lg border p-4 transition-colors data-[state=checked]:border-[#c49963]"
                                        data-state={selectedValue === index.toString() ? "checked" : "unchecked"}
                                    >
                                        <RadioGroupItem
                                            value={index.toString()}
                                            id={account.ethAddress}
                                            className="data-[state=checked]:border-primary"
                                        />
                                        <label
                                            htmlFor={account.ethAddress}
                                            className="flex-grow cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            {account.ethAddress.toLowerCase()}
                                        </label>
                                    </div>
                                ))}
                            </RadioGroup>

                        </ScrollArea>

                        <Button type="submit" className="w-full">
                            Continue
                        </Button>
                    </form>
                </> : loadingStatus == 5 ? <Card className='my-12 bg-transparent border-[#c49963]'>
                    {error && (
                        <Alert variant="destructive" className="mb-4">
                            <AlertDescription>{error.message}</AlertDescription>
                        </Alert>
                    )}

                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">
                            Need a PKP?
                        </CardTitle>
                        <CardDescription>
                            There doesn&apos;t seem to be a Lit wallet associated with your
                            credentials. Create one today.
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <Button
                            onClick={signUp}
                            className="w-full bg-[#c49963] text-white hover:bg-[#d74b1a] hover:text-white"
                        >
                            Sign up
                        </Button>
                    </CardContent>
                </Card> : loadingStatus == 6 ? <div className="flex justify-center flex-1 space-x-2 pb-8 items-center">
                    <CircleDashedIcon className="h-6 w-6 animate-spin" /> <p>Fetching Account</p>
                </div> : loadingStatus == 7 ? <div className="flex justify-center flex-1 space-x-2 pb-8 items-center">
                    <CircleDashedIcon className="h-6 w-6 animate-spin" /> <p>Logging in</p>
                </div> : <div className="w-full max-w-md mx-auto pt-6">
                    <div className="space-y-2 mb-4">
                        <h1 className="text-xl font-bold">Create EggAI account</h1>
                    </div>

                    <form onSubmit={handleCreateAccountSubmit} className="space-y-4">
                        <ScrollArea className='2xl:max-h-[320px] xl:max-h-[300px] lg:max-h-[250px] max-h-[200px] overflow-y-auto '>
                            <div className="space-y-4 px-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        placeholder="Enter your name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center space-x-1">  <Label htmlFor="pkp">Lit PKP Wallet</Label>
                                        <button
                                            type="button" onClick={() => handleCopy(currentAccount?.ethAddress || '')}
                                            className="hover:bg-transparent rounded transition-colors pl-2"
                                        >
                                            <Copy size={12} />
                                        </button>

                                        {copied && <span className="text-sm">Copied!</span>}
                                        <div className='flex-1 flex justify-end space-x-1 text-sm'>
                                            {refreshed && <span className="text-sm">Refreshed!</span>}
                                            <button
                                                type="button" onClick={() => handleRefresh(currentAccount?.ethAddress || '')}
                                                className="hover:bg-transparent rounded transition-colors p-1"
                                            >
                                                <RefreshCcw size={12} />
                                            </button>
                                            <p className='font-semibold'>Balance:</p>
                                            <p>{litBalance.toFixed(4)}</p>
                                            <p className=''>TSTLPX</p>

                                        </div>
                                    </div>

                                    <Input
                                        id="pkp"
                                        value={currentAccount?.ethAddress}
                                        disabled
                                        className="bg-muted font-mono text-sm"
                                    />

                                </div>
                            </div>

                            {litBalance < 0.0001 && <Alert className="bg-yellow-50 border-yellow-200">
                                <AlertCircle className="h-4 w-4 text-yellow-600" />
                                <AlertDescription className="text-yellow-800">
                                    Please fund this wallet with testnet tokens before continuing.
                                    <a
                                        href="https://chronicle-yellowstone-faucet.getlit.dev/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-yellow-900 underline ml-1"
                                    >
                                        Get testnet tokens
                                    </a>
                                </AlertDescription>
                            </Alert>}
                            <ScrollBar className='' />
                        </ScrollArea>

                        {loadingStep != 6 &&
                            <Button
                                type="submit"
                                className="w-full flex space-x-2 items-center justify-center"
                                disabled={litBalance < 0.0001 || !name || !email || loadingStep > 0}
                            >
                                {loadingStep != 0 && <CircleDashedIcon className="h-6 w-6 animate-spin" />}
                                <p>
                                    {loadingStep == 0 ? 'Create Account' : loadingStep == 1 ? 'Adding Delegatee' : loadingStep == 2 ? 'Registering Tool' : loadingStep == 3 ? 'Permitting Tool' : loadingStep == 4 ? 'Creating Safe' : loadingStep == 5 ? 'Finishing up' : 'Done'}
                                </p>
                            </Button>}
                        {loadingStep == 6 && <Button
                            className="w-full"
                            type='button'
                            onClick={() => {
                                router.push('/home')
                            }}
                        >
                            Finish Setup 🎉
                        </Button>}
                    </form>
                </div>
            }
        </div>
    </div>
}