"use client";

import { ArrowUpRightFromSquare, X } from "lucide-react";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import { shortenAddress } from "@/lib/utils";
import { formatEther } from "viem";
import { useEffect } from "react";
import { useEnvironmentStore } from "../context";
import { CountdownTimer } from "../countdown-timer";

export default function Actions({ close, setSelectedTradeId }: { close: () => void; setSelectedTradeId: (tradeId: string) => void }) {
    const { actions } = useEnvironmentStore(store => store)


    return <div className="2xl:relative absolute 2xl:top-[0%] 2xl:left-[0%] left-[24%] w-[68%] 2xl:h-full h-[600px]  bg-black rounded-sm">
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
                            <th className="py-3 font-bold text-center">Id</th>
                            <th className="py-3 font-bold text-center">Asset</th>
                            <th className="py-3 font-bold text-center">Amount (USDT)</th>
                            <th className="py-3 font-bold text-center">Chef</th>
                            <th className="py-3 font-bold text-center">Type</th>
                            <th className="py-3 font-bold text-center">Timeframe</th>
                            <th className="py-3 font-bold text-center">Status</th>
                            <th className="py-3 font-bold text-center">PNL (USDT)</th>
                            <th className="py-3 font-bold text-center">View</th>
                        </tr>
                    </thead>
                    <tbody>
                        {actions && actions.map((item, id) => (
                            <tr
                                key={id}
                                className="border-b border-black/20 hover:bg-black/5"
                            >
                                <td className="py-4 text-center pl-3">{id + 1}</td>
                                <td
                                    className="py-4 text-center font-mono cursor-pointer"
                                    onClick={() => {
                                        window.open(
                                            "https://arbiscan.io/" +
                                            "",
                                            "_blank"
                                        );
                                    }}
                                >
                                    {item.trade_play.asset}
                                </td>
                                <td className="py-4 text-center">{item.amount}</td>
                                <td className="py-4 text-center">{item.trade_play.chef?.username}</td>
                                <td className="py-4 text-center">{item.trade_play.trade_type}</td>
                                <td className="py-4 text-center"> <CountdownTimer
                                    createdAt={item.created_at ? item.created_at : new Date().toISOString()}
                                    timeframe={item.trade_play.timeframe ? parseInt(item.trade_play.timeframe) : 0}
                                /></td>
                                <td className="py-4 text-center">{item.status}</td>
                                <td className="py-4 text-center">{item.pnl_usdt ? item.pnl_usdt : "N/A"}</td>
                                <td className="py-4 text-center font-bold ">
                                    <ArrowUpRightFromSquare className="cursor-pointer hover:text-gray-700 mx-auto" width={16} onClick={() => {
                                        if (item.trade_play.id)
                                            setSelectedTradeId(item.id)
                                    }} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {
                    (!actions || actions.length === 0) && <div className="w-full flex justify-center pt-12">
                        <p className="text-md font-semibold text-gray-500">No actions found</p>
                    </div>
                }
            </ScrollArea>
        </div>
    </div>

}
