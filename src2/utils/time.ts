import { format, isToday } from 'date-fns';
import { ko } from 'date-fns/locale';

type TimeFormatMode = 'relative' | 'absolute';

export const formatTime = (
  date: string | number | Date,
  mode: TimeFormatMode = 'relative',
): string => {
  try {
    const now = new Date();
    const d = new Date(date);

    if (mode === 'relative') {
      const diff = now.getTime() - d.getTime();
      const mins = Math.floor(diff / (1000 * 60));
      const hours = Math.floor(mins / 60);
      const days = Math.floor(hours / 24);

      const sameYear = now.getFullYear() === d.getFullYear();

      if (mins < 1) return '방금 전';
      if (mins < 60) return `${mins}분 전`;
      if (hours < 24) return `${hours}시간 전`;
      if (days === 1) return '어제';
      if (days < 7) return `${days}일 전`;
      // ✅ 연도가 다르면 연도까지 표시
      return sameYear ? format(d, 'MM.dd') : format(d, 'yyyy.MM.dd');
    }

    // ✅ 절대시간 (올해/작년 확실히 분리)
    const diffMs = now.getTime() - d.getTime();
    const diffHour = diffMs / (1000 * 60 * 60);
    const sameYear = now.getFullYear() === d.getFullYear();

    if (diffHour < 1) return `${Math.floor(diffHour * 60)}분 전`;
    if (isToday(d)) return format(d, 'a h:mm', { locale: ko });
    if (sameYear) return format(d, 'M월 d일', { locale: ko });
    return format(d, 'yyyy년 M월 d일', { locale: ko });
  } catch {
    return '';
  }
};
