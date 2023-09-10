import dayjs from 'dayjs';

export function formatDate(timestamp: number) {
  return dayjs(timestamp * 1000).format("DD.MM.YYYY, HH:mm:ss")
}
