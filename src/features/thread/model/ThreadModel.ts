/**
 * 🛰️ 서버에서 오는 원본 DTO
 */
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

/**
 * 🧩 앱 내부에서 사용하는 정규화된 Thread 모델
 * (React Query 캐시에 이 형태로 저장)
 */
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

/**
 * 📦 피드/지도/검색 공용 Thread API 응답 타입
 */
export type FetchThreadsResponse = {
  threadResponseSingleDtos: ServerThreadDto[];
  nextCursorMark: string | null;
};

/**
 * 🪄 스켈레톤/플레이스홀더용 Thread 생성 함수
 */
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

/**
 * 🧭 서버 DTO → 앱 Thread 모델 변환기
 * 모든 fetch 계열 API에서 공용으로 사용 (Feed, Map, Search 등)
 */
export const mapServerThread = (dto: ServerThreadDto): Thread => ({
  threadId: dto.threadId,
  threadType: dto.threadType,
  description: dto.description ?? '',
  contentImageUrls: dto.contentImageUrls ?? [],
  videoUrls: dto.videoUrls ?? [],

  memberId: dto.memberId,
  memberNickName: dto.memberNickName,
  memberProfileImageUrl: dto.memberProfileImageUrl ?? '',

  createDatetime: dto.createDatetime,
  updateDatetime: dto.updateDatetime,
  distanceFromCurrentMember: dto.distanceFromCurrentMember ?? 0,

  popularityScore: dto.popularityScore ?? 0,
  popularityScoreRecent: dto.popularityScoreRecent ?? 0,

  latitude: dto.gpsLocationResponseDto?.latitude ?? 0,
  longitude: dto.gpsLocationResponseDto?.longitude ?? 0,

  reactedByCurrentMember: dto.reactedByCurrentMember ?? false,
  reactionCount: dto.reactionCount ?? 0,
  commentThreadCount: dto.commentThreadCount ?? 0,

  available: dto.available ?? true,
  private: dto.private ?? false,
  hiddenDueToReport: dto.hiddenDueToReport ?? false,

  markerImageUrl: dto.markerImageUrl ?? '',

  bountyPoint: dto.bountyPoint ?? null,
  expireDateTime: dto.expireDateTime ?? null,
  remainDateTime: dto.remainDateTime ?? null,

  childThreadCount: dto.childThreadCount ?? 0,
  childThreadDirectCount: dto.childThreadDirectCount ?? 0,
  childThreadWritableByOthers: dto.childThreadWritableByOthers ?? false,
});
