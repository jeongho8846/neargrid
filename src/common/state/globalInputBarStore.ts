import { create } from 'zustand';

type GlobalInputBarState = {
  isVisible: boolean;
  text: string;
  placeholder?: string;
  onSubmit?: (text: string) => void;
  open: (params: {
    placeholder?: string;
    onSubmit?: (text: string) => void;
  }) => void;
  close: () => void;
  setText: (text: string) => void;
};

export const useGlobalInputBarStore = create<GlobalInputBarState>(set => ({
  isVisible: false,
  text: '',
  placeholder: '',
  onSubmit: undefined,
  open: ({ placeholder, onSubmit }) =>
    set({ isVisible: true, placeholder, onSubmit }),
  close: () => set({ isVisible: false, text: '', onSubmit: undefined }),
  setText: text => set({ text }),
}));
