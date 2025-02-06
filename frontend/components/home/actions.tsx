"use client";

import { ArrowUpRightFromSquare, X } from "lucide-react";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import { shortenAddress } from "@/lib/utils";
import { formatEther } from "viem";

export default function Actions({ close, setOpenResearch }: { close: () => void; setOpenResearch: () => void }) {
    const testData = [{
        id: "bvdokjsnvdosvnjnj",
        asset: "BTC/USDT",
        amount: "150",
        chef: 'neiltrades',
        type: 'Futures',
        timeLeft: '1d 2h 3m',
        status: 'Ongoing',
        pnl: undefined,

    }]
    return <div className="relative w-[68%] h-full  bg-black rounded-sm">
        <div className="absolute w-full h-full flex flex-col -top-[0.5%] -left-[0.5%] space-y-2 sen rounded-sm text-sm border-2 border-black py-2 bg-[#faefe0] text-black">
            <div className="flex justify-between items-center w-full px-6">
                <p className="font-bold text-lg">Trade Actions</p>
                <X className="cursor-pointer hover:text-gray-700" onClick={close} />
            </div>
            <Separator className="bg-black" />

            <ScrollArea className="h-[450px] px-6">
                <table className="w-full">
                    <thead>
                        <tr className="text-left border-b-2 border-black sticky top-0 bg-[#faefe0]">
                            <th className="py-3 font-bold">Id</th>
                            <th className="py-3 font-bold">Asset</th>
                            <th className="py-3 font-bold">Amount</th>
                            <th className="py-3 font-bold">Chef</th>
                            <th className="py-3 font-bold">Type</th>
                            <th className="py-3 font-bold">Timeframe</th>
                            <th className="py-3 font-bold">Status</th>
                            <th className="py-3 font-bold">PNL</th>
                            <th className="py-3 font-bold">View</th>
                        </tr>
                    </thead>
                    <tbody>
                        {testData.map((item, id) => (
                            <tr
                                key={id}
                                className="border-b border-black/20 hover:bg-black/5"
                            >
                                <td className="py-4 pl-3">{id + 1}</td>
                                <td
                                    className="py-4 font-mono cursor-pointer"
                                    onClick={() => {
                                        window.open(
                                            "https://arbiscan.io/" +
                                            "",
                                            "_blank"
                                        );
                                    }}
                                >
                                    {item.asset}
                                </td>
                                <td className="py-4">{item.amount}</td>
                                <td className="py-4">{item.chef}</td>
                                <td className="py-4">{item.type}</td>
                                <td className="py-4">{item.timeLeft}</td>
                                <td className="py-4">{item.status}</td>
                                <td className="py-4">{item.pnl ? item.pnl : "N/A"}</td>
                                <td className="py-4 font-bold">
                                    <ArrowUpRightFromSquare className="cursor-pointer hover:text-gray-700" width={16} onClick={setOpenResearch} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </ScrollArea>
        </div>
    </div>

}
