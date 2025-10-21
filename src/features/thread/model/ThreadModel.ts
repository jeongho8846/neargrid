// src/features/thread/model/ThreadModel.ts
export type Thread = {
  threadId: string;
  threadType: string;
  description: string;
  contentImageUrls: string[];
  videoUrls: string[];
  memberId: string;
  memberNickName: string;
  memberProfileImageUrl: string;
  createDatetime: string;
  updateDatetime: string;
  distanceFromCurrentMember: number;
  popularityScore: number;
  latitude: number;
  longitude: number;
};

export type ThreadResponseSingleDto = Thread;

export type FetchThreadsResponse = {
  threadResponseSingleDtos: ThreadResponseSingleDto[];
  nextCursorMark: string | null;
};

// ✅ 스켈레톤 / placeholder용 기본 Thread 생성 함수
export const createEmptyThread = (id: string): Thread => ({
  threadId: id,
  threadType: 'GENERAL_THREAD',
  description: '',
  contentImageUrls: [],
  videoUrls: [],
  memberId: '',
  memberNickName: '',
  memberProfileImageUrl: '',
  createDatetime: '',
  updateDatetime: '',
  distanceFromCurrentMember: 0,
  popularityScore: 0,
  latitude: 0,
  longitude: 0,
});
