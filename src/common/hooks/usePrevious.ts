import { useEffect, useRef } from 'react';

export default function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined); // ✅ 초기값 undefined 지정
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}
