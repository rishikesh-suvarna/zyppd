import moment from 'moment';

export function parseDate(date: Date | string, short: boolean = false): string {
  if (short) {
    return moment(date).format('Do MMMM YYYY');
  }
  return moment(date).format('Do MMMM YYYY, hh:mm A');
}