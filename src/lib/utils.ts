import { Recruit } from "@prisma/client";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { CommanderWithStatuses, RecruitWithStatuses } from "../../types";
import { getRecruits } from "./db";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getSingaporeDate() {
  const utcTime = new Date(); // Current UTC time
  const sgDate = new Date(utcTime.getTime() + 8 * 60 * 60 * 1000); // Adjust for Singapore time

  return sgDate;
}

export function parseDate(dateString: string): Date {
  const day = parseInt(dateString.substring(0, 2));
  const month = parseInt(dateString.substring(2, 4)) - 1; // JavaScript months are 0-indexed
  const year = parseInt("20" + dateString.substring(4, 6)); // Assuming 20XX format

  // Create a date object for the specified date at 23:59 (local time)
  const date = new Date(year, month, day, 23, 59); // Set hours to 23 and minutes to 59

  // Set the time to Singapore time (UTC+8)
  date.setHours(date.getHours() + 8); // Adjust for Singapore time

  console.log(date);
  return date; // Return the adjusted date
}

export function getCurrentStrength(
  arr: RecruitWithStatuses[] | CommanderWithStatuses[]
): number {
  const sgDate = getSingaporeDate(); // Get current date/time in Singapore timezone

  let count = 0;

  arr.forEach((y) => {
    // Check if any status is 'MC' or 'Other'
    if (
      y.statuses.some(
        (status) =>
          (status.type === "MC" || status.type === "Other") &&
          parseDate(status.endDate) >= sgDate
      )
    ) {
      count++; // Increment count if condition is met
    }
  });

  return count; // Return the total count of recruits or commanders with 'MC' or 'Other' statuses
}

export const getRecruitsOnStatus = async (
  companyId: number,
  statuses: string[] // Note: This is now an array of status types
): Promise<RecruitWithStatuses[]> => {
  const sgDate = getSingaporeDate(); // Get current Singapore date and time

  const recruits = await getRecruits(companyId); // Fetch all recruits for the given company

  // Filter recruits based on the provided statuses
  const recruitsOnStatus = recruits
    .filter((recruit) =>
      recruit.statuses.some(
        (status) =>
          statuses.includes(status.type) && parseDate(status.endDate) > sgDate // Check if status type is in the provided array and if endDate is greater than current SG time
      )
    )
    .map((recruit) => ({
      ...recruit, // Spread the recruit properties
      statuses: recruit.statuses.filter((status) =>
        statuses.includes(status.type)
      ), // Filter statuses to include only the specified ones
    }));

  return recruitsOnStatus; // Return the filtered list of recruits with the specified statuses
};
