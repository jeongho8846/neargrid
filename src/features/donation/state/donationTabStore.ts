// 📄 src/features/donation/state/donationTabStore.ts
import { create } from 'zustand';
import type { DonationRankingItem } from '../api/getDonationRankThreadByDonor';
import type { DonationRecordItem } from '../api/getDonationThreadByThread';

type RankingState = {
  items: DonationRankingItem[];
  nextCursor?: string | null;
  hasNext: boolean;
};

type DonationTabState = {
  record: {
    items: DonationRecordItem[];
    nextCursor?: string;
    hasNext: boolean;
  };
  ranking: RankingState;
  rankDonorByRecipient: RankingState; // 🆕 받은 도네이션 랭킹
  rankRecipientByDonor: RankingState; // 🆕 준 도네이션 랭킹

  setRecord: (data: Partial<DonationTabState['record']>) => void;
  setRanking: (data: Partial<RankingState>) => void;
  setRankDonorByRecipient: (data: Partial<RankingState>) => void;
  setRankRecipientByDonor: (data: Partial<RankingState>) => void;

  clearAll: () => void;
};

export const useDonationTabStore = create<DonationTabState>(set => ({
  record: { items: [], nextCursor: undefined, hasNext: true },
  ranking: { items: [], nextCursor: undefined, hasNext: true },
  rankDonorByRecipient: { items: [], nextCursor: undefined, hasNext: true },
  rankRecipientByDonor: { items: [], nextCursor: undefined, hasNext: true },

  setRecord: data => set(state => ({ record: { ...state.record, ...data } })),
  setRanking: data =>
    set(state => ({ ranking: { ...state.ranking, ...data } })),
  setRankDonorByRecipient: data =>
    set(state => ({
      rankDonorByRecipient: { ...state.rankDonorByRecipient, ...data },
    })),
  setRankRecipientByDonor: data =>
    set(state => ({
      rankRecipientByDonor: { ...state.rankRecipientByDonor, ...data },
    })),

  clearAll: () =>
    set({
      record: { items: [], nextCursor: undefined, hasNext: true },
      ranking: { items: [], nextCursor: undefined, hasNext: true },
      rankDonorByRecipient: { items: [], nextCursor: undefined, hasNext: true },
      rankRecipientByDonor: { items: [], nextCursor: undefined, hasNext: true },
    }),
}));
