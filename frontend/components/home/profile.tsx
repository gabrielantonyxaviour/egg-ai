"use client";

import Image from "next/image";
import { useEnvironmentStore } from "../context";
import { useEffect, useState } from "react";
import { Copy, Save } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Calendar } from "@/components/ui/calendar";
import { Progress } from "@/components/ui/progress";
import { Button } from "../ui/button";
export default function Profile({ close }: { close: () => void }) {
    const { user, ethBalance, solBalance, totalEquity, pnl, setUser } = useEnvironmentStore((store => store))
    const [copiedEVM, setCopiedEVM] = useState<boolean>(false);
    const [copiedSOL, setCopiedSOL] = useState<boolean>(false);
    const [expectedPNL, setExpectedPNL] = useState(5);
    const [endDate, setEndDate] = useState<Date | undefined>(undefined);
    const [riskLevel, setRiskLevel] = useState(0);


    useEffect(() => {
        if (user) {
            setExpectedPNL(user.profit_goal ? user.profit_goal : 5)
            setEndDate(user.profit_timeline ? new Date(user.profit_timeline) : undefined)
        }
    }, [user])

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
    useEffect(() => {
        if (!endDate) return;

        const today = new Date();
        const daysDifference = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

        // Base risk calculation from PNL target
        // Logarithmic scaling for more gradual progression
        const pnlRisk = Math.log10(expectedPNL) * 20; // Scale factor of 20 makes it more gradual

        // Time factor: shorter time = higher risk
        // Using inverse log scale for time to make it more gradual
        const timeRisk = Math.max(0, 50 - (Math.log10(daysDifference) * 15));

        // Combine risks with weights
        // 60% weight to PNL risk, 40% to time risk
        let riskScore = (pnlRisk * 0.6) + (timeRisk * 0.4);

        // Additional risk for very short timeframes with high PNL
        // But make it more gradual using a sliding scale
        if (daysDifference < 30) {
            const shortTermMultiplier = 1 + ((30 - daysDifference) / 30) * (expectedPNL / 500);
            riskScore *= shortTermMultiplier;
        }

        // Normalize between 0 and 100 with a more gradual curve
        riskScore = Math.min(100, Math.max(0, riskScore));

        // Smoothing function to make transitions more gradual
        const smoothedRisk = Math.pow(riskScore / 100, 0.7) * 100;

        setRiskLevel(smoothedRisk);
    }, [expectedPNL, endDate]);
    return <div className={`w-[35%] ${user?.mode != "CHAD" ? "h-[90%]" : "h-[62%]"} relative bg-black rounded-sm`}>
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
                <div className="">
                    <h3 className="font-semibold text-base pb-1">Current Mode</h3>
                    <div className="flex space-x-1 items-center justify-center">                    <img src={user?.mode == "CHAD" ? '/chad.png' : "/tren.png"} alt="chad" className="w-[25px] h-[21px]" />
                        <p className="nouns spacing-2 tracking-wide text-lg">{user?.mode}</p></div>

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

            {user?.mode != 'CHAD' &&
                <>
                    {/* Left side - PNL and Calendar */}
                    <div className="w-full pt-4">
                        <div>
                            <div className="flex items-center pl-[64px] space-x-2">
                                <p className="font-semibold text-sm">Expected PNL</p>
                                <p className="text-sm">{expectedPNL}%</p>
                            </div>
                            <Slider
                                value={[expectedPNL]}
                                onValueChange={(value) => setExpectedPNL(value[0])}
                                min={5}
                                max={500}
                                step={1}
                                className="w-3/4 mx-auto h-3 py-3"
                            />
                        </div>


                    </div>

                    <div className="w-3/4 mx-auto flex pt-3 h-[280px]">
                        {/* Timeframe Calendar */}
                        <div className="w-3/4">
                            <p className="font-semibold text-sm">Timeframe</p>
                            <div className="transform scale-75 origin-top-left">
                                <Calendar
                                    mode="single"
                                    selected={endDate}
                                    onSelect={setEndDate}
                                    disabled={(date) => date < new Date()}
                                    className="rounded-md"
                                />
                            </div>
                        </div>
                        {/* Right side - Risk Meter */}
                        <div className="w-1/4 flex flex-col justify-start items-center">
                            <p className="font-semibold text-sm mb-2">Risk Meter</p>
                            <div className="flex pt-3">
                                <div className="w-48 relative top-[84px]">
                                    <Progress
                                        value={riskLevel}
                                        className={`w-[9px] w-48 -rotate-90 border-[1px] border-[#c49963] `}
                                    />
                                </div>

                            </div>
                        </div>
                    </div>


                    <div className="relative bg-black w-[140px] h-[34px] rounded-sm mx-auto">       <Button
                        onClick={async (e) => {
                            if (!user) return;
                            if (user.profit_goal == expectedPNL && user.profit_timeline == endDate?.toISOString()) return;
                            if (expectedPNL == 0) return;
                            if (!endDate) return;
                            await fetch(`/api/supabase/update-user`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    ...user,
                                    profit_goal: expectedPNL,
                                    profit_timeline: endDate?.toISOString(),

                                }),
                            });

                            setUser({
                                ...user,
                                profit_goal: expectedPNL,
                                profit_timeline: endDate ? endDate.getTime() : undefined
                            });

                        }}
                        className="group absolute -top-[4px] -left-[2px] rounded-sm w-full h-[36px] flex py-4 px-6 bg-[#c49963] hover:bg-[#d74b1a] hover:text-white border-[1px] border-black mr-[2px]"
                    >
                        <Save className="h-6 w-6" />
                        <p>Save Changes</p>
                    </Button></div>

                </>


            }


        </div>


    </div >

}
