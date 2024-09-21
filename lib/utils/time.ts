import { parse } from 'date-fns';

export function parseDate(dateString: string): Date {
  if (!dateString) return new Date();
  try {
    return parse(dateString, 'yyyy-MM-dd', new Date());
  } catch (error) {
    console.error(`Failed to parse date: ${dateString}`, error);
    return new Date();
  }
}