import { format, isToday, isYesterday } from 'date-fns';
import { ko } from 'date-fns/locale';

/**
 * 🔹 채팅/알림용 시간 포맷 (자동 로컬 타임존 대응)
 */
export const formatChatTime = (dateString?: string | null): string => {
  if (!dateString) return '';

  // ✅ "Z"가 없으면 UTC로 명시해서 해석
  const safeString = dateString.endsWith('Z') ? dateString : `${dateString}Z`;

  const date = new Date(safeString);

  if (isToday(date)) {
    return format(date, 'a h:mm', { locale: ko });
  }

  if (isYesterday(date)) {
    return '어제';
  }

  return format(date, 'M월 d일', { locale: ko });
};
