import { CircleDashedIcon, X, TrendingUp, Users, BarChart, Save, Zap, Check } from "lucide-react";
import { useEnvironmentStore } from "../context";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "../ui/button";

export type Chef = {
    id: string;
    username: string;
    name: string | null;
    bio: string | null;
    image: string | null;
    sub_fee: number | null;
    niche: string | null;
    total_subscribers: number;
    avg_pnl_percentage: number;
    avg_calls_per_day: number;
}

export default function ChefProfile({ chef_id, close }: { chef_id: string; close: () => void }) {
    const { user, chef, user_follows } = useEnvironmentStore((store) => store);
    const [chefData, setChefData] = useState<Chef | null>(null);
    const [isYourProfile, setIsYourProfile] = useState(false);
    useEffect(() => {
        console.log("useEffect triggered with chef_id:", chef_id);
        if (chef != undefined && chef_id === chef.id) {
            console.log("Setting chef data from store.");
            setIsYourProfile(true);
            setChefData(chef);
            return;
        }

        (async () => {
            console.log("Fetching chef data from API.");
            const response = await fetch(`/api/supabase/get-chef?username=${chef_id}`);
            const { chef, error } = await response.json();
            if (error) {
                console.error("Failed to fetch chef data:", error);
                return;
            }
            console.log("Fetched chef data:", chef);
            setChefData(chef);
        })();

    }, [chef_id]);

    return <div className="w-[600px] h-[500px] absolute top-[22%] left-[32%] bg-black rounded-sm">
        <div className="absolute w-[600px] h-[500px] flex flex-col -top-[1%] -left-[1%] space-y-6 sen rounded-sm text-sm border-2 border-black p-6 bg-[#faefe0] text-black overflow-y-auto">
            {/* Header */}
            {!chefData ? <div className="w-full h-full flex items-center justify-center">
                <CircleDashedIcon className="animate-spin" />
            </div> : <>

                <div className="flex justify-between items-center w-full">
                    <p className="font-bold text-lg">{chefData.id == chef?.id ? "Your Profile" : "Chef Profile"}</p>
                    <X className="cursor-pointer hover:text-gray-600" onClick={close} />
                </div>

                <Separator className="bg-[#faefe0]" />

                {/* Profile Header */}
                <div className="flex items-start space-x-6">
                    <Avatar className="h-24 w-24">
                        <AvatarImage src={chefData.image || ''} />
                        <AvatarFallback>
                            {chefData.name?.charAt(0) || chefData.username.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                        <div>
                            <h2 className="text-2xl font-bold">{chefData.name || chefData.username}</h2>
                            <p className="text-gray-600">@{chefData.username}</p>
                        </div>
                        {chefData.niche && (
                            <span className="inline-block px-2 py-0.5 font-semibold  bg-[#c49963] text-[#faefe0] rounded-full text-sm">
                                {chefData.niche}
                            </span>
                        )}
                        {chefData.bio && (
                            <p className="text-sm text-gray-700 max-w-md">{chefData.bio}</p>
                        )}
                    </div>
                </div>

                <Separator className="bg-[#faefe0]" />

                {/* Stats */}
                <div className="grid grid-cols-3 w-full gap-6 pl-6">
                    <div className="space-y-1">
                        <div className="flex  items-center gap-2 text-gray-600">
                            <TrendingUp className="h-4 w-4" />
                            <span className="text-sm">Avg. PNL</span>
                        </div>
                        <p className="text-2xl font-bold">{chefData.avg_pnl_percentage.toFixed(2)}%</p>
                    </div>

                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-gray-600">
                            <Users className="h-4 w-4" />
                            <span className="text-sm">Subscribers</span>
                        </div>
                        <p className="text-2xl font-bold">{chefData.total_subscribers}</p>
                    </div>

                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-gray-600">
                            <BarChart className="h-4 w-4" />
                            <span className="text-sm">Calls/Day</span>
                        </div>
                        <p className="text-2xl font-bold">{chefData.avg_calls_per_day.toFixed(1)}</p>
                    </div>
                </div>

                <Separator className="bg-[#faefe0]" />

                {/* Subscription */}
                {chefData.id == chef?.id && (
                    <div className="flex flex-col items-center space-y-1">
                        <div className="relative bg-black w-[200px] h-[34px] rounded-sm mx-auto">       <Button
                            onClick={async (e) => {

                            }}
                            className="group absolute -top-[4px] -left-[2px] rounded-sm w-full h-[36px] flex py-4 px-6 bg-[#c49963] hover:bg-[#d74b1a] hover:text-white border-[1px] border-black mr-[2px]"
                        >
                            {!user_follows.includes(chefData.id) ? <>
                                <Zap className="h-6 w-6" />
                                <p>Follow</p>
                            </> : <>
                                <Check className="h-6 w-6" />
                                <p>Subscribed</p>
                            </>}

                        </Button></div>

                        {!user_follows.includes(chefData.id) && (
                            <p className="text-xs">at 10 USDT/month</p>
                        )}
                    </div>

                )}
            </>}

        </div>
    </div>
}