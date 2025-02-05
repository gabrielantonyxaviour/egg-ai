import type { Plugin } from "@elizaos/core";

import { dkgInsert } from "./actions/dkgInsert.ts";

import { graphSearch } from "./providers/graphSearch.ts";

export * as actions from "./actions/index.ts";
export * as providers from "./providers/index.ts";

export const dkgPlugin: Plugin = {
    name: "dkg",
    description:
        "Agent DKG which allows you to store memories on the OriginTrail Decentralized Knowledge Graph",
    actions: [dkgInsert],
    providers: [graphSearch],
};
