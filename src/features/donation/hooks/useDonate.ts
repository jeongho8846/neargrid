// src/features/donation/hooks/useDonate.ts
import { useState } from 'react';
import {
  createDonationForThread,
  type CreateDonationThreadParams,
  type CreateDonationThreadResponse,
} from '@/features/donation/api/createDonationForThread';

/** 쓰레드 도네이션 전용 훅 */
export const useDonate = () => {
  const [loading, setLoading] = useState(false);

  const donate = async (
    args: CreateDonationThreadParams,
  ): Promise<CreateDonationThreadResponse> => {
    try {
      setLoading(true);
      return await createDonationForThread(args);
    } finally {
      setLoading(false);
    }
  };

  return { donate, loading };
};
