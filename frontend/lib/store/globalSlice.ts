import { StateCreator } from "zustand";
import { Chef, User } from "@/types";

interface GlobalState {
  user: User | null;
  chef: Chef | null;
  ethBalance: string;
  solBalance: string;
  avaxBalance: string;
  ethPrice: string;
  solPrice: string;
  avaxPrice: string;
  totalEquity: string;
  pnl: string;
  user_follows: string[];
}

interface GlobalActions {
  setUser: (user: User | null) => void;
  setChef: (chef: Chef | null) => void;
  setEthBalance: (balance: string) => void;
  setSolBalance: (balance: string) => void;
  setAvaxBalance: (balance: string) => void;
  setEthPrice: (price: string) => void;
  setSolPrice: (price: string) => void;
  setAvaxPrice: (price: string) => void;
  setTotalEquity: (equity: string) => void;
  setPnl: (pnl: string) => void;
  setUserFollows: (user_follows: string[]) => void;
  setUserFollow: (user_follow: string) => void;
}

export type GlobalSlice = GlobalState & GlobalActions;

export const initialGlobalState: GlobalState = {
  user: null,
  ethBalance: "0",
  solBalance: "0",
  avaxBalance: "0",
  ethPrice: "0",
  solPrice: "0",
  avaxPrice: "0",
  totalEquity: "0",
  chef: null,
  pnl: "0",
  user_follows: []
};

export const createGlobalSlice: StateCreator<
  GlobalSlice,
  [],
  [],
  GlobalSlice
> = (set) => ({
  ...initialGlobalState,
  setUser: (user) => {
    set({ user });
  },
  setEthBalance: (ethBalance) => {
    set({ ethBalance });
  },
  setSolBalance: (solBalance) => {
    set({ solBalance });
  },
  setEthPrice: (ethPrice) => {
    set({ ethPrice });
  }
  ,
  setSolPrice: (solPrice) => {
    set({ solPrice });
  },
  setTotalEquity: (totalEquity) => {
    set({ totalEquity });
  },
  setPnl: (pnl) => {
    set({ pnl });
  },
  setChef: (chef) => {
    set({ chef });
  },
  setUserFollows: (user_follows) => {
    set({ user_follows });
  },
  setUserFollow: (user_follow) => {
    set((state) => {
      if (state.user_follows.includes(user_follow)) {
        return {
          user_follows: [...state.user_follows]
        }
      } else {
        return {
          user_follows: [...state.user_follows, user_follow]
        };
      }
    });
  },
  setAvaxBalance: (avaxBalance) => {
    set({ avaxBalance });
  },
  setAvaxPrice: (avaxPrice) => {
    set({ avaxPrice });
  }

});
