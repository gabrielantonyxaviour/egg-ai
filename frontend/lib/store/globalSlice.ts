import { StateCreator } from "zustand";
import { User } from "@/types";
interface GlobalState {
  user: User | null;
  ethBalance: string;
  solBalance: string;
}

interface GlobalActions {
  setUser: (user: User) => void;
  setEthBalance: (balance: string) => void;
  setSolBalance: (balance: string) => void;
}

export type GlobalSlice = GlobalState & GlobalActions;

export const initialGlobalState: GlobalState = {
  user: null,
  ethBalance: "0",
  solBalance: "0",
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
});
