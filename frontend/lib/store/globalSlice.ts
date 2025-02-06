import { StateCreator } from "zustand";
import { User } from "@/types";
interface GlobalState {
  user: User | null;
}

interface GlobalActions {
  setUser: (user: User) => void;
}

export type GlobalSlice = GlobalState & GlobalActions;

export const initialGlobalState: GlobalState = {
  user: null,
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
});
