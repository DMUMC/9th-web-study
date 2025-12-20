const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;
const WEEK = DAY * 7;

export function formatRelativeTime(value: string | number | Date) {
  const target = new Date(value).getTime();
  if (Number.isNaN(target)) return '';

  const diff = Date.now() - target;
  if (diff < MINUTE) {
    return '방금 전';
  }
  if (diff < HOUR) {
    const minutes = Math.floor(diff / MINUTE);
    return `${minutes}분 전`;
  }
  if (diff < DAY) {
    const hours = Math.floor(diff / HOUR);
    return `${hours}시간 전`;
  }
  if (diff < WEEK) {
    const days = Math.floor(diff / DAY);
    return `${days}일 전`;
  }
  const weeks = Math.floor(diff / WEEK);
  if (weeks < 5) {
    return `${weeks}주 전`;
  }
  return new Date(value).toLocaleDateString('ko-KR');
}
