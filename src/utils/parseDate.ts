import moment from 'moment';

export function parseDate(date: Date | string, short: boolean = false): string {
  if (short) {
    return moment(date).format('DD/MM/YYYY');
  }
  return moment(date).format('DD/MM/YYYY, hh:mm A');
}