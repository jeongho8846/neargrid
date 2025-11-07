import { create } from 'zustand';

type ToastType = 'success' | 'error' | 'info';

type Toast = {
  id: number;
  message: string;
  type: ToastType;
};

type ToastState = {
  toast: Toast | null;
  showToast: (message: string, type?: ToastType) => void;
  hideToast: () => void;
};

export const useToastStore = create<ToastState>(set => ({
  toast: null,

  showToast: (message, type = 'info') =>
    set({
      toast: {
        id: Date.now(),
        message,
        type,
      },
    }),

  hideToast: () => set({ toast: null }),
}));
