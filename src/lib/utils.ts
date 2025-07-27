import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string, language: string = 'english'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Spanish format: dd/mm/yyyy
  if (language === 'spanish') {
    const day = dateObj.getDate().toString().padStart(2, '0');
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const year = dateObj.getFullYear().toString();
    return `${day}/${month}/${year}`;
  }
  
  // English format: mm/dd/yyyy
  const day = dateObj.getDate().toString().padStart(2, '0');
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const year = dateObj.getFullYear().toString();
  return `${month}/${day}/${year}`;
}
