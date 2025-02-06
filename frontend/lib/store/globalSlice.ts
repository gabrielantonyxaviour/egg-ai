import { StateCreator } from "zustand";
import { TelegramUser } from "@/types/telegram";
interface GlobalState {
  user: TelegramUser | null;

}

interface GlobalActions {

  setUser: (user: TelegramUser) => void;
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
