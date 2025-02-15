import { IRelayPKP } from '@lit-protocol/types';
import { CircleDashedIcon } from 'lucide-react';
import Image from 'next/image';
import { useState } from "react";
import { Button } from "@/components/ui/button"
import {
    RadioGroup,
    RadioGroupItem,
} from "@/components/ui/radio-group"

interface OnboardingModalProps {
    loadingStatus: number;
    accounts: IRelayPKP[]
    setCurrentAccount: any;
}

export default function OnboardingModal({ loadingStatus, accounts, setCurrentAccount }: OnboardingModalProps) {
    const [selectedValue, setSelectedValue] = useState("0")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const selectedAccount = accounts[parseInt(selectedValue)]
        return setCurrentAccount(selectedAccount)
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
                </div> : <>
                    <h1>Choose your account</h1>
                    <p>Continue with one of your accounts.</p>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <RadioGroup
                            defaultValue="0"
                            value={selectedValue}
                            onValueChange={setSelectedValue}
                            className="space-y-2"
                        >
                            {accounts.map((account, index) => (
                                <div
                                    key={`account-${index}`}
                                    className="flex items-center space-x-2 rounded-lg border p-4 transition-colors hover:bg-accent data-[state=checked]:border-primary"
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

                        <Button type="submit" className="w-full">
                            Continue
                        </Button>
                    </form>
                </>

            }
        </div>
    </div>
}