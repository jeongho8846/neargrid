import { format, isToday, isYesterday } from 'date-fns';
import { ko } from 'date-fns/locale';

/**
 * 🔹 채팅/알림용 시간 포맷 (자동 로컬 타임존 대응)
 */
export const formatChatTime = (dateString?: string | null): string => {
  if (!dateString) return '';

  /**
   * 서버가 UTC를 내려줄 때(예: "2026-01-11T03:26:57.503846941")만 Z를 붙여서 UTC로 해석.
   * 이미 타임존 정보(+/- 또는 Z)가 포함된 문자열이면 그대로 사용.
   */
  const hasZoneInfo = /([zZ]|[+-]\d{2}:?\d{2})$/.test(dateString);
  const safeString = hasZoneInfo ? dateString : `${dateString}Z`;

  const date = new Date(safeString);

  if (isToday(date)) {
    return format(date, 'a h:mm', { locale: ko });
  }

  if (isYesterday(date)) {
    return '어제';
  }

  return format(date, 'M월 d일', { locale: ko });
};
