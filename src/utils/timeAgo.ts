import {
  differenceInSeconds,
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
  differenceInMonths,
  differenceInYears,
} from "date-fns";

export const timeAgo = (date: Date | string): string => {
  const now = new Date();
  const targetDate = typeof date === "string" ? new Date(date) : date;

  const seconds = differenceInSeconds(now, targetDate);
  if (seconds < 5) return "Just now";
  if (seconds < 60) return `${seconds} sec${seconds > 1 ? "s" : ""} ago`;

  const minutes = differenceInMinutes(now, targetDate);
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;

  const hours = differenceInHours(now, targetDate);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;

  const days = differenceInDays(now, targetDate);
  if (days < 30) return `${days} day${days > 1 ? "s" : ""} ago`;

  const months = differenceInMonths(now, targetDate);
  if (months < 12) return `${months} month${months > 1 ? "s" : ""} ago`;

  const years = differenceInYears(now, targetDate);
  return `${years} year${years > 1 ? "s" : ""} ago`;
};
