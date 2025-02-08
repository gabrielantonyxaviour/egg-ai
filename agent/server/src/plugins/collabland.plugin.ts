import { Plugin } from "@ai16z/eliza";

import { PlayTradeAction } from "./actions/play-trade.action.js";
import { ValidateResults } from "./actions/validate-results.action.js";
export const collablandPlugin: Plugin = {
  name: "collabland",
  description: "Integrate Collab.Land smart account for the bot",
  actions: [
    new PlayTradeAction(),
    new ValidateResults()
  ],
  providers: [
  ],
};
