import { create } from 'zustand';
import type { DonationRecordItem } from '../api/getDonationThreadByThread';
import type { DonationRankingItem } from '../api/getDonationRankRecipientByDonor';

type DonationTabState = {
  /** ✅ 후원 기록 */
  record: {
    items: DonationRecordItem[];
    nextCursor?: string;
    hasNext: boolean;
  };
  /** ✅ 후원 랭킹 */
  ranking: {
    items: DonationRankingItem[];
    nextCursor?: string;
    hasNext: boolean;
  };

  /** ✅ 액션 */
  setRecord: (data: Partial<DonationTabState['record']>) => void;
  setRanking: (data: Partial<DonationTabState['ranking']>) => void;
  resetRecord: () => void;
  resetRanking: () => void;
  clearAll: () => void;
};

/**
 * ✅ 도네이션 탭 전용 Zustand 스토어
 * - 탭 전환 시 데이터 유지
 * - 시트 닫을 때 clearAll()으로 초기화
 */
export const useDonationTabStore = create<DonationTabState>(set => ({
  record: {
    items: [],
    nextCursor: undefined,
    hasNext: true,
  },
  ranking: {
    items: [],
    nextCursor: undefined,
    hasNext: true,
  },

  setRecord: data =>
    set(state => ({
      record: { ...state.record, ...data },
    })),

  setRanking: data =>
    set(state => ({
      ranking: { ...state.ranking, ...data },
    })),

  /** ✅ 기록만 초기화 */
  resetRecord: () =>
    set({
      record: { items: [], nextCursor: undefined, hasNext: true },
    }),

  /** ✅ 랭킹만 초기화 */
  resetRanking: () =>
    set({
      ranking: { items: [], nextCursor: undefined, hasNext: true },
    }),

  /** ✅ 시트 닫을 때 전체 초기화 */
  clearAll: () =>
    set({
      record: { items: [], nextCursor: undefined, hasNext: true },
      ranking: { items: [], nextCursor: undefined, hasNext: true },
    }),
}));
