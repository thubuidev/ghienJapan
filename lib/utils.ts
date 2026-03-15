import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const JPY_TO_VND_RATE = 170;

export function convertJpyToVnd(jpy: number): number {
  return Math.round(jpy * JPY_TO_VND_RATE);
}

export function formatPrice(amount: number, currency: 'JPY' | 'VND' = 'JPY'): string {
  if (currency === 'JPY') {
    return `¥${amount.toLocaleString('ja-JP')}`;
  }
  return `${amount.toLocaleString('vi-VN')}đ`;
}

export function formatCurrency(amount: number, currency: 'JPY' | 'VND' = 'JPY'): string {
  if (currency === 'JPY') {
    return `¥${amount.toLocaleString()}`;
  }
  return `${amount.toLocaleString()}₫`;
}
