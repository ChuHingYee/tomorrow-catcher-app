import dayjs from 'dayjs';
import type {ConfigType} from 'dayjs';

export function formatDateTime(date: ConfigType) {
  return date && date !== -1 ? dayjs(date).format('YYYY/MM/DD HH:mm') : '-';
}
