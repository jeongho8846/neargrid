// src/features/thread/mappers/threadMapper.ts
import { Thread } from '../model/ThreadModel';

export const mapThreadResponse = (raw: any): Thread => {
  const gps = raw.gpsLocationResponseDto ?? {};
  return {
    threadId: raw.threadId,
    threadType: raw.threadType,
    description: raw.description,
    contentImageUrls: raw.contentImageUrls ?? [],
    videoUrls: raw.videoUrls ?? [],
    memberId: raw.memberId,
    memberNickName: raw.memberNickName,
    memberProfileImageUrl: raw.memberProfileImageUrl,
    createDatetime: raw.createDatetime,
    updateDatetime: raw.updateDatetime,
    distanceFromCurrentMember: raw.distanceFromCurrentMember ?? 0,
    popularityScore: raw.popularityScore ?? 0,
    latitude: gps.latitude ?? 0,
    longitude: gps.longitude ?? 0,
  };
};
