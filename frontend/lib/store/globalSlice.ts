import { StateCreator } from "zustand";
import { User } from "@/types";

interface GlobalState {
  user: User | null;
  ethBalance: string;
  solBalance: string;
  ethPrice: string;
  solPrice: string;
  totalEquity: string;
  pnl: string;
}

interface GlobalActions {
  setUser: (user: User) => void;
  setEthBalance: (balance: string) => void;
  setSolBalance: (balance: string) => void;
  setEthPrice: (price: string) => void;
  setSolPrice: (price: string) => void;
  setTotalEquity: (equity: string) => void;
  setPnl: (pnl: string) => void;
}

export type GlobalSlice = GlobalState & GlobalActions;

export const initialGlobalState: GlobalState = {
  user: null,
  ethBalance: "0",
  solBalance: "0",
  ethPrice: "0",
  solPrice: "0",
  totalEquity: "0",
  pnl: "0",
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
});
