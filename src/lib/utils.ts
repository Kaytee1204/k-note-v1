import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Returns YYYY-MM-DD strictly in Vietnam Timezone (Asia/Ho_Chi_Minh)
export function getVietnamISODate(dateInput?: Date | string | null): string {
  const date = dateInput ? new Date(dateInput) : new Date();
  if (isNaN(date.getTime())) return "";

  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const year = parts.find((p) => p.type === "year")?.value;
  const month = parts.find((p) => p.type === "month")?.value;
  const day = parts.find((p) => p.type === "day")?.value;

  return `${year}-${month}-${day}`;
}

// Vietnam Realtime Date Formatter (DD/MM/YYYY - Asia/Ho_Chi_Minh)
export function formatDate(dateInput?: Date | string | null): string {
  if (!dateInput) return "06/08/2026";
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "06/08/2026";

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "Asia/Ho_Chi_Minh",
  }).format(date);
}

// Vietnam Realtime Date & Time Formatter (DD/MM/YYYY HH:mm - Asia/Ho_Chi_Minh)
export function formatDateTime(dateInput?: Date | string | null): string {
  if (!dateInput) return "06/08/2026 03:00";
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "06/08/2026 03:00";

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Ho_Chi_Minh",
  }).format(date);
}
