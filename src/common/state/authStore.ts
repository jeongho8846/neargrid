import { create } from 'zustand';

type AuthState = {
  isAuth: boolean;
  setIsAuth: (value: boolean) => void;
};

export const useAuthStore = create<AuthState>(set => ({
  isAuth: false,
  setIsAuth: value => set({ isAuth: value }),
}));
