import { create } from "zustand";

type ToastStore = {
  message: string;
  showToast: (message: string) => void;
  clearToast: () => void;
};

export const useToastStore = create<ToastStore>((set) => ({
  message: "",
  showToast: (message) => set({ message }),
  clearToast: () => set({ message: "" }),
}));
