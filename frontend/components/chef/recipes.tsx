"use client";

import { ArrowUpRightFromSquare, CircleDashedIcon, X } from "lucide-react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import { useEffect, useState } from "react";
import { useEnvironmentStore } from "../context";
import { TradePlay } from "@/types";
// Countdown Timer Component
const CountdownTimer = ({ createdAt, timeframe }: {
    createdAt: string;
    timeframe: number;
}) => {
    const [timeLeft, setTimeLeft] = useState("");

    useEffect(() => {
        const calculateTimeLeft = () => {
            const created = new Date(createdAt).getTime();
            const expiryTime = created + (timeframe * 1000); // Convert seconds to milliseconds
            const now = new Date().getTime();
            const difference = expiryTime - now;

            if (difference <= 0) {
                return "Expired";
            }

            // Calculate time units
            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            // Format the string
            const parts = [];
            if (days > 0) parts.push(`${days}d`);
            if (hours > 0) parts.push(`${hours}h`);
            if (minutes > 0) parts.push(`${minutes}m`);
            parts.push(`${seconds}s`);

            return parts.join(" ");
        };

        // Initial calculation
        setTimeLeft(calculateTimeLeft());

        // Update every second
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        // Cleanup
        return () => clearInterval(timer);
    }, [createdAt, timeframe]);

    return <span>{timeLeft}</span>;
};

export default function Recipes({ setOpenDetailedRecipe, close }: { setOpenDetailedRecipe: (id: string) => void; close: () => void }) {
    const { chef } = useEnvironmentStore(store => store)
    const [recipes, setRecipes] = useState<TradePlay[]>([]);
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        if (chef == undefined) return;

        console.log(`Fetching recipes for chef: ${chef.username}`);

        (async () => {
            try {
                const response = await fetch(`/api/supabase/get-recipes?chef=${chef.id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    }
                })
                const { recipes: fetchedRecipes, error } = await response.json();

                if (error) {
                    console.error(`Error fetching recipes: ${error.message}`);
                    return;
                }
                setRecipes(fetchedRecipes);
                console.log("Data fetched successfully:", fetchedRecipes)
            } catch (error) {
                console.error("Error fetching data:", error)
            }
            setLoading(false)
        })()

    }, [chef])
    return <div className="relative w-[68%] h-full bg-black rounded-sm">
        <div className="absolute w-full h-full flex flex-col -top-[0.5%] -left-[0.5%] space-y-2 sen rounded-sm text-sm border-2 border-black py-2 bg-[#faefe0] text-black">
            <div className="flex justify-between items-center px-4">
                <h2 className="text-xl font-bold">Your Recipes</h2>
                <Button variant="ghost" size="icon" onClick={close} className="hover:bg-transparent">
                    <X className="h-4 w-4" />
                </Button>
            </div>

            <ScrollArea className="h-[450px] px-6">
                <table className="w-full h-full">
                    <thead>
                        <tr className="text-left border-b-2 border-black sticky top-0 bg-[#faefe0]">
                            <th className="py-3 font-bold text-center">Id</th>
                            <th className="py-3 font-bold text-center">Chain</th>
                            <th className="py-3 font-bold text-center">Asset</th>
                            <th className="py-3 font-bold text-center">Direction </th>
                            <th className="py-3 font-bold text-center">Timeframe </th>
                            <th className="py-3 font-bold text-center">Trade Type</th>
                            <th className="py-3 font-bold text-center">Status</th>
                            <th className="py-3 font-bold text-center">PNL %</th>
                            <th className="py-3 font-bold text-center">xPNL %</th>
                            <th className="py-3 font-bold text-center">View</th>
                        </tr>
                    </thead>

                    {loading ? <div className="w-full h-full flex items-center justify-center">
                        <CircleDashedIcon className="animate-spin" />
                    </div> : <tbody>
                        {recipes.map((item, id) => (
                            <tr
                                key={id}
                                className="border-b border-black/20 hover:bg-black/5"
                            >
                                <td className="py-4 text-center pl-3">{id + 1}</td>
                                <td className="py-4 text-center">{item.chain}</td>
                                <td className="py-4 text-center">{item.asset}</td>
                                <td className="py-4 text-center">{item.direction}</td>
                                <td className="py-4 text-center"> <CountdownTimer
                                    createdAt={item.created_at ? item.created_at : new Date().toISOString()}
                                    timeframe={item.timeframe ? parseInt(item.timeframe) : 0}
                                /></td>
                                <td className="py-4 text-center">{item.trade_type}</td>
                                <td className="py-4 text-center">{item.status}</td>
                                <td className="py-4 text-center">{item.pnl_percentage ? item.pnl_percentage : "N/A"}</td>
                                <td className="py-4 text-center">{item.expected_pnl}</td>
                                <td className="py-4 text-center font-bold ">
                                    <ArrowUpRightFromSquare className="cursor-pointer hover:text-gray-700 mx-auto" width={16} onClick={() => {
                                        if (!item || !item.id) return
                                        setOpenDetailedRecipe(item.id)
                                    }} />
                                </td>
                            </tr>
                        ))}
                    </tbody>}

                </table>
            </ScrollArea>
        </div>
    </div>

}
