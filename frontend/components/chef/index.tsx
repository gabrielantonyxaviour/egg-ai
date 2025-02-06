"use client";

import { use, useEffect } from "react";
import { useEnvironmentStore } from "../context";
import { useRouter } from "next/navigation";

export default function Chef() {
    const { user } = useEnvironmentStore((store) => store)
    const router = useRouter()
    useEffect(() => {
        if (user == undefined) { router.push('/'); return; }
        (async () => {
            const response = await fetch(`/api/chef?username=${user.username}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            })
            const data = await response.json()
            console.log(data)
            // if (data.)
        })()
    }, [])
    return <div>
        <p>Hello</p>
    </div>
}