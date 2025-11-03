import { ServerThreadDto, Thread } from '../model/ThreadModel';

export const mapServerThread = (dto: ServerThreadDto): Thread => ({
  threadId: dto.threadId,
  threadType: dto.threadType,

  description: dto.description ?? '',
  contentImageUrls: (dto.contentImageUrls ?? []).filter(Boolean),
  videoUrls: (dto.videoUrls ?? []).filter(Boolean),

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

  /** ✅ 받은 후원 포인트 총합 */
  donationPointReceivedCount: dto.donationPointReceivedCount ?? 0,
});

export const mapServerThreads = (dtos: ServerThreadDto[]): Thread[] =>
  (dtos ?? []).map(mapServerThread);
