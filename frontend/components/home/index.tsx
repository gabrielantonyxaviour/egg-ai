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

export default function Home() {
    const nav = [
        {
            id: 1,
            name: "Profile",
            image: "/home/profile.png",
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
            name: "Chef",
            image: "/home/chef.png",
        }
    ];
    const { user, setEthPrice, setSolPrice, setEthBalance, setAvaxBalance, setAvaxPrice, setSolBalance, setTotalEquity } = useEnvironmentStore(store => store)
    const [showWindows, setShowWindows] = useState([false, false, false, false, false]);
    const router = useRouter();
    const [searchUsername, setSearchUsername] = useState('')

    useEffect(() => {
        if (user == undefined) router.push('/');

        (async () => {
            try {
                const res = await fetch(`/api/alchemy/prices`);
                const { eth, avax, error } = await res.json();
                // const { eth, sol, error } = await res.json();
                if (error) throw new Error(error);
                setEthPrice(eth)
                setAvaxPrice(avax)
                // setSolPrice(sol)
                // const bRes = await fetch(`/api/balances?eth=${user?.evm_address}&sol=${user?.solana_address}&prod=${process.env.NEXT_PUBLIC_IS_PROD}`);
                const bRes = await fetch(`/api/balances?eth=${user?.evm_address}&prod=${process.env.NEXT_PUBLIC_IS_PROD}`);
                // const { ethBalance, solBalance } = await bRes.json();
                const { ethBalance, avaxBalance } = await bRes.json();
                setEthBalance(ethBalance)
                setAvaxBalance(avaxBalance)
                // setSolBalance(solBalance)

                setTotalEquity((parseFloat(ethBalance) * parseFloat(eth)).toFixed(2) + (parseFloat(avaxBalance) * parseFloat(avax)).toFixed(2))
                // setTotalEquity((parseFloat(ethBalance) * parseFloat(eth) + parseFloat(solBalance) * parseFloat(sol)).toFixed(2))
            } catch (error) {
                console.error('Failed to fetch data:', error);
            }
        })()
    }
        , [user])



    return user == undefined ? <div></div> : (
        <div className="flex justify-between h-screen">
            <div className="flex flex-col h-full justify-center space-y-12  px-6">
                {(user?.mode == "TREN" ? [nav[0], nav[1], nav[3]] : [nav[0], nav[1], nav[2], nav[3]]).map((i) => (
                    <div
                        key={i.id}
                        className="relative bg-black w-[130px] h-[100px] rounded-sm"
                    >
                        <div
                            onClick={() => {
                                setShowWindows((prev) =>
                                    prev.map((val, index) => (index === i.id - 1 ? !val : val))
                                );
                            }}
                            className={`absolute flex flex-col items-center -top-[4px] -left-[4px] w-[130px] h-[100px] space-y-2 sen  rounded-sm text-sm border border-[2px] border-black p-2 cursor-pointer ${showWindows[i.id - 1]
                                ? "bg-[#faefe0] text-black font-bold"
                                : "bg-[#c49963] text-white"
                                }`}
                        >
                            <Image src={i.image} width={50} height={50} alt={i.name} />
                            <p>{i.name}</p>
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
                        setOpenResearch={() => {

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