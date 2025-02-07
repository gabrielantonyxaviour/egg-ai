'use client'

import Image from "next/image";
import { useEffect, useState } from "react";
import { useEnvironmentStore } from "../context";
import { useRouter } from "next/navigation";
import Chef from "./profile";
import Recipes from "./recipes";
import CreateRecipe from "./create";

export default function ChefHome() {
    const nav = [
        {
            id: 1,
            name: "Profile",
            image: "/chef/profile.png",
        },
        {
            id: 2,
            name: "Recipes",
            image: "/chef/recipe.png",
        },
        {
            id: 3,
            name: "Play",
            image: "/chef/create.png",
        },
    ];
    const { user, chef } = useEnvironmentStore(store => store)
    const [openDetailedRecipe, setOpenDetailedRecipe] = useState("")
    const [showWindows, setShowWindows] = useState([false, false, false, false, false]);
    const router = useRouter();

    useEffect(() => {
        if (user == undefined || chef == undefined) router.push('/');
    }, [user])

    return user == undefined || chef == undefined ? <div></div> : (
        <div className="flex justify-between h-screen">
            <div className="flex flex-col h-full justify-center space-y-12  px-6">
                {nav.map((i) => (
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
                {showWindows[2] && (
                    <CreateRecipe
                        close={() => {
                            setShowWindows((prev) =>
                                prev.map((val, index) => (index === 2 ? !val : val))
                            );
                        }}
                    />
                )}
                {showWindows[1] && (
                    <Recipes
                        setOpenDetailedRecipe={setOpenDetailedRecipe}
                        close={() => {
                            setShowWindows((prev) =>
                                prev.map((val, index) => (index === 1 ? !val : val))
                            );
                        }}

                    />
                )}
                {showWindows[0] && (
                    <Chef
                        chef_id={user.username}
                        close={() => {
                            setShowWindows((prev) =>
                                prev.map((val, index) => (index === 0 ? !val : val))
                            );
                        }}
                    />
                )}




            </div>
        </div>
    )
}