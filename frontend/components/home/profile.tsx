"use client";

import Image from "next/image";
import { useEnvironmentStore } from "../context";
import { useEffect, useState } from "react";
import { Copy } from "lucide-react";

export default function Profile({ close }: { close: () => void }) {
    const { user, ethBalance, solBalance, totalEquity, pnl } = useEnvironmentStore((store => store))
    const [copiedEVM, setCopiedEVM] = useState<boolean>(false);
    const [copiedSOL, setCopiedSOL] = useState<boolean>(false);


    const handleCopy = async (address: string | undefined, type: 'EVM' | 'SOL'): Promise<void> => {
        if (!address) return;

        try {
            await navigator.clipboard.writeText(address);
            if (type === 'EVM') {
                setCopiedEVM(true);
                setTimeout(() => setCopiedEVM(false), 2000);
            } else {
                setCopiedSOL(true);
                setTimeout(() => setCopiedSOL(false), 2000);
            }
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return <div className="w-[35%] h-[62%] relative bg-black rounded-sm">
        <div
            onClick={() => { }}
            className={`absolute flex flex-col p-6 h-full  -top-[4px] -left-[4px] w-full sen rounded-sm text-sm border border-[2px] border-black bg-[#faefe0] text-black`}
        >
            <p className="text-4xl nouns">SUP FREN 🍳</p>
            <p>gains are calling, put the fries in the bag!</p>
            <div className="flex justify-around pt-4">
                <div className="">
                    <p className="font-semibold text-base pb-1">Total Equity</p>
                    <p className="text-2xl nouns">{totalEquity} <span className="text-sm font-bold sen">USDT</span></p>
                </div>
                <div className="">
                    <p className="font-semibold text-base pb-1">Average PNL</p>
                    <p className="text-2xl nouns">{pnl}% <span className="text-sm font-bold sen">(7 DAYS)</span></p>
                </div>
            </div>
            <div className="flex space-x-2 pt-5 items-center">
                <Image src={'/chains/arb.png'} width={25} height={25} alt={'arb'} />
                <h3 className="font-semibold text-base">EVM Wallet</h3>
                <button
                    onClick={() => handleCopy(user?.evm_address || '', 'EVM')}
                    className=" hover:bg-gray-100 rounded transition-colors"
                >
                    <Copy size={12} />
                </button>
                {copiedEVM && (
                    <span className="text-sm text-black ml-2">
                        Copied!
                    </span>
                )}
            </div>
            <div className="flex items-center">
                <div className="w-[30px]"></div>
                <div className="flex items-center flex-grow">
                    <p className="mr-2">{user?.evm_address}</p>

                </div>
                <p>{parseFloat(ethBalance).toFixed(2)} {"ETH"}</p>
            </div>
            <div className="flex space-x-2 pt-4 items-center">
                <Image src={'/chains/sol.png'} width={25} height={25} alt={'arb'} />
                <h3 className="font-semibold text-base">SOL Wallet</h3>
                <button
                    onClick={() => handleCopy(user?.solana_address || "", 'SOL')}
                    className=" hover:bg-gray-100 rounded transition-colors"
                >
                    <Copy size={12} />
                </button>
                {copiedSOL && (
                    <span className="text-sm text-black ml-2">
                        Copied!
                    </span>
                )}
            </div>
            <div className="flex items-center">
                <div className="w-[30px]"></div>
                <div className="flex items-center flex-grow">
                    <p className="mr-2">{user?.solana_address}</p>

                </div>
                <p>{parseFloat(solBalance).toFixed(2)} {"ETH"}</p>
            </div>


            <div className="flex flex-col justify-center items-center py-8">
                <h3 className="font-semibold text-lg pb-2">Current Mode</h3>
                <Image src={user?.mode == "CHAD" ? '/chad.png' : "/tren.png"} alt="chad" width={user?.mode == 'TREN' ? 40 : 50} height={user?.mode == 'TREN' ? 40 : 50} />
                <p className="nouns spacing-2 tracking-wide text-xl py-1">{user?.mode}</p>
            </div>
        </div>


    </div >

}
