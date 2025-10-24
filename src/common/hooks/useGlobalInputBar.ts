import { useGlobalInputBarStore } from '../state/globalInputBarStore';

export const useGlobalInputBar = () => {
  const open = useGlobalInputBarStore(state => state.open);
  const close = useGlobalInputBarStore(state => state.close);
  const setText = useGlobalInputBarStore(state => state.setText);
  const isVisible = useGlobalInputBarStore(state => state.isVisible);
  const text = useGlobalInputBarStore(state => state.text);

  return { open, close, setText, isVisible, text };
};
