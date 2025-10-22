// 서버에서 오는 원본 DTO
export type ServerThreadDto = {
  threadId: string;
  threadType: string;
  description: string | null;
  contentImageUrls: string[] | null;
  videoUrls: string[] | null;

  memberId: string;
  memberNickName: string;
  memberProfileImageUrl: string | null;

  createDatetime: string;
  updateDatetime: string;
  distanceFromCurrentMember: number | null;

  popularityScore: number | null;
  popularityScoreRecent: number | null;

  gpsLocationResponseDto?: {
    latitude: number;
    longitude: number;
    altitude?: number;
  } | null;

  reactedByCurrentMember: boolean | null;
  reactionCount: number | null;
  commentThreadCount: number | null;

  childThreadCount: number | null;
  childThreadDirectCount: number | null;
  childThreadGpsLocationResponseDtos?: any[] | null;
  childThreadWritableByOthers: boolean | null;

  available: boolean | null;
  private: boolean | null;
  hiddenDueToReport: boolean | null;

  markerImageUrl: string | null;

  bountyPoint: number | null;
  expireDateTime: string | null;
  remainDateTime: string | null;
};

// 앱 내부에서 쓰는 정규화된 도메인 모델 (캐시에 넣는 타입)
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
  popularityScoreRecent: number;

  latitude: number;
  longitude: number;

  reactedByCurrentMember: boolean;
  reactionCount: number;
  commentThreadCount: number;

  available: boolean;
  private: boolean;
  hiddenDueToReport: boolean;

  markerImageUrl: string;

  bountyPoint: number | null;
  expireDateTime: string | null;
  remainDateTime: string | null;

  childThreadCount: number;
  childThreadDirectCount: number;
  childThreadWritableByOthers: boolean;
};

// 페치 응답
export type FetchThreadsResponse = {
  threadResponseSingleDtos: ServerThreadDto[];
  nextCursorMark: string | null;
};

// 스켈레톤/플레이스홀더용
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
  popularityScoreRecent: 0,

  latitude: 0,
  longitude: 0,

  reactedByCurrentMember: false,
  reactionCount: 0,
  commentThreadCount: 0,

  available: true,
  private: false,
  hiddenDueToReport: false,

  markerImageUrl: '',

  bountyPoint: null,
  expireDateTime: null,
  remainDateTime: null,

  childThreadCount: 0,
  childThreadDirectCount: 0,
  childThreadWritableByOthers: false,
});
