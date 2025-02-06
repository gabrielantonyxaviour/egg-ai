"use client";

import { use, useEffect } from "react";
import { useEnvironmentStore } from "../context";
import { useRouter } from "next/navigation";

export default function Chef() {
    const { user } = useEnvironmentStore((store) => store)
    const router = useRouter()
    useEffect(() => {
        if (user == undefined) router.push('/');


    }, [])
    return <div>
        <p>Hello</p>
    </div>
}