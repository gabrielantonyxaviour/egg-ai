"use client";

import { CircleDashedIcon, X } from "lucide-react";
import { useEnvironmentStore } from "../context";
import { useEffect, useState } from "react";

export default function CreateRecipe({ close }: { close: () => void }) {

    return <div className="w-[600px] h-[700px] absolute top-[22%] left-[32%] bg-black rounded-sm">
        <div
            onClick={() => { }}
            className={`absolute w-[600px] h-[700px] flex flex-col items-center -top-[1%] -left-[1%] w-full h-full space-y-2 sen rounded-sm text-sm border border-[2px] border-black py-2 bg-[#faefe0] text-black`}
        >

            <div className="flex justify-between items-center w-full px-2">
                <p className="px-4 font-bold text-lg">
                    Create Recipe
                </p>
                <X className="cursor-pointer" onClick={close} />
            </div>

        </div>
    </div>

}
