'use client'

import Image from "next/image";
import { useEffect, useState } from "react";
import { useEnvironmentStore } from "../context";
import Profile from "./profile";
import Chefs from "./chefs";
import Actions from "./actions";
import Mode from "./mode";
import Chef from "../chef/profile";
import { useRouter } from "next/navigation";
import Chat from "./chat";
import { createPublicClient, formatEther, http } from "viem";
import { arbitrumSepolia, avalancheFuji } from "viem/chains";
import useAccounts from "@/hooks/useAccounts";

export default function Home() {
    const nav = [
        {
            id: 1,
            name: "Profile",
            image: "/home/money.png",
        },
        {
            id: 2,
            name: "Actions",
            image: "/home/actions.png",
        },
        {
            id: 3,
            name: "Chefs",
            image: "/home/chef.png",
        },
        {
            id: 4,
            name: "Mode",
            image: "/home/modes.png",
        },
        {
            id: 5,
            name: "Chat",
            image: "/home/chick.png",
        },
        {
            id: 6,
            name: "Chef",
            image: "/home/chef.png",
        }
    ];
    const { user, setEthPrice, setArbPkpBalance, setAvaxPkpBalance, setArbSafeBalance, setAvaxSafeBalance, setAvaxPrice, setTotalEquity, currentPkpAccount, currentSessionSigs } = useEnvironmentStore(store => store)
    const [showWindows, setShowWindows] = useState([false, false, false, false, false, false]);
    const router = useRouter();
    const [searchUsername, setSearchUsername] = useState('')
    const [selectedTradeId, setSelectedTradeId] = useState('')

    useEffect(() => {
        if (user == undefined) { router.push('/'); return; }

        (async () => {
            try {
                const res = await fetch(`/api/alchemy/prices`);
                const { eth, avax, error } = await res.json();
                console.log("PRICES!")
                console.log({ eth, avax, error })
                if (error) throw new Error(error);
                setEthPrice(eth)
                setAvaxPrice(avax)
                console.log('Creating Arbitrum public client');
                const arbPublicClient = createPublicClient({
                    chain: arbitrumSepolia,
                    transport: http()
                });
                console.log('Fetching Arbitrum balance for address:', currentPkpAccount?.ethAddress);
                const balance = parseFloat(formatEther(await arbPublicClient.getBalance({
                    address: currentPkpAccount?.ethAddress as `0x${string}`,
                })));
                console.log('Fetched Arbitrum balance:', balance);
                setArbPkpBalance(balance.toString());

                console.log('Creating Avalanche public client');
                const avaxPublicClient = createPublicClient({
                    chain: avalancheFuji,
                    transport: http()
                });
                console.log('Fetching Avalanche balance for address:', currentPkpAccount?.ethAddress);
                const balance2 = parseFloat(formatEther(await avaxPublicClient.getBalance({
                    address: currentPkpAccount?.ethAddress as `0x${string}`,
                })));
                console.log('Fetched Avalanche balance:', balance2);
                setAvaxPkpBalance(balance2.toString());
                const safeArbBalance = parseFloat(formatEther(await arbPublicClient.getBalance({
                    address: user.safe_address as `0x${string}`,
                })));
                console.log('Fetched Arbitrum safe balance:', safeArbBalance);
                const safeAvaxBalance = parseFloat(formatEther(await avaxPublicClient.getBalance({
                    address: user.safe_address as `0x${string}`,
                })));
                console.log('Fetched Avalanche safe balance:', safeAvaxBalance);
                setAvaxSafeBalance(safeAvaxBalance.toString());
                setArbSafeBalance(safeArbBalance.toString());
                setTotalEquity(((safeArbBalance * parseFloat(eth)) + (safeAvaxBalance * parseFloat(avax))).toFixed(2))
            } catch (error) {
                console.error('Failed to fetch data:', error);
            }
        })()
    }
        , [user])



    return user == undefined ? <div></div> : (
        <div className="flex justify-between h-screen">
            <div className="flex flex-col h-full justify-center items-center space-y-8 xl:space-y-12  px-6">
                {(user?.mode == "TREN" ? [nav[0], nav[1], nav[3]] : [nav[0], nav[1], nav[2], nav[3]]).map((i) => (
                    <div
                        key={i.id}
                        className="relative bg-black xl:w-[125px] xl:h-[100px] w-[100px] h-[80px] rounded-sm"
                    >
                        <div
                            onClick={() => {
                                setShowWindows((prev) =>
                                    prev.map((val, index) => (index === i.id - 1 ? !val : val))
                                );
                            }}
                            className={`absolute flex flex-col justify-center items-center -top-[4px] -left-[4px] w-full h-full space-y-2 sen  rounded-sm text-sm border border-[2px] border-black p-2 cursor-pointer ${showWindows[i.id - 1]
                                ? "bg-[#faefe0] text-black font-bold"
                                : "bg-[#c49963] text-white"
                                }`}
                        >
                            <img src={i.image} alt={i.name} className="w-[30px] h-[30px] xl:w-[50px] xl:h-[50px]" />
                            <p className="lg:text-sm md:text-xs hidden md:block">{i.name}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="w-full flex my-auto space-x-4 h-[80%] px-4">
                {showWindows[0] && (
                    <Profile
                        close={() => {
                            setShowWindows((prev) =>
                                prev.map((val, index) => (index === 0 ? !val : val))
                            );
                        }}
                    />
                )}
                {showWindows[1] && (
                    <Actions
                        close={() => {
                            setShowWindows((prev) =>
                                prev.map((val, index) => (index === 1 ? !val : val))
                            );
                        }}
                        setSelectedTradeId={(tradeId) => {
                            setSelectedTradeId(tradeId)
                        }}
                    />
                )}

                {showWindows[2] && (
                    <Chefs
                        setSearchUsername={setSearchUsername}
                        close={() => {
                            setShowWindows((prev) =>
                                prev.map((val, index) => (index === 2 ? !val : val))
                            );
                        }}
                    />
                )}
                {showWindows[3] && (
                    <Mode
                        close={() => {
                            setShowWindows((prev) =>
                                prev.map((val, index) => (index === 3 ? !val : val))
                            );
                        }}
                    />
                )}

                {selectedTradeId && (
                    <Chat
                        close={() => {
                            setSelectedTradeId('')
                        }}
                        selectedTradeId={selectedTradeId}
                    />
                )}
                {searchUsername && (
                    <Chef
                        chef_id={searchUsername}
                        close={() => {
                            setSearchUsername('')
                        }}
                    />
                )}
            </div>
        </div>
    )
}