import { useEffect, useRef } from 'react';
import { useBottomSheetStore } from '@/common/state/bottomSheetStore';

/**
 * ✅ useBottomSheetVisibility
 * - 제스처 발생 시 네비게이터 숨김
 * - 2초간 제스처 없음 → 자동 복귀
 */
export const useBottomSheetVisibility = () => {
  const { isInteracting, setInteracting, setVisible } = useBottomSheetStore();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isInteracting) {
      setVisible(false);

      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(() => {
        setInteracting(false);
        setVisible(true);
      }, 2000);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isInteracting, setInteracting, setVisible]);
};
