// src/features/member/hooks/useCurrentMember.ts
import { useEffect, useState } from 'react';
import { memberStorage } from '../utils/memberStorage';
import { Member } from '../types';

export const useCurrentMember = () => {
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const stored = await memberStorage.getMember();
      setMember(stored);
      setLoading(false);
    };
    load();
  }, []);

  return { member, loading, isLoggedIn: !!member };
};
