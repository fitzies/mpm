import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  ActiveStatusWithCommander,
  ActiveStatusWithRecruit,
  CommanderWithStatuses,
  RecruitWithStatuses,
} from "../../types";
import { getRecruits } from "./db";
import { Recruit, StatusType } from "@prisma/client";

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
  const year = parseInt("20" + dateString.substring(4, 6));

  const date = new Date(year, month, day, 23, 59); // Set hours to 23 and minutes to 59

  date.setHours(date.getHours());
  if (process.env.NODE_ENV !== "production") {
    date.setHours(date.getHours() + 8);
  }

  return date;
}

export function getOutOfCampStrength(
  arr: RecruitWithStatuses[] | CommanderWithStatuses[],
  platoon?: 1 | 2 | 3 | 4
): number {
  const sgDate = getSingaporeDate(); // Get current date/time in Singapore timezone

  let count = 0;

  if (platoon !== undefined && platoon > 0) {
    arr.forEach((y) => {
      // Check if any status is 'MC' or 'Other'
      if (
        y.statuses.some(
          (status) =>
            (status.type === "MC" || status.type === "Other") &&
            parseDate(status.endDate) >= sgDate &&
            parseInt(status.recruitId!.substring(1, 2)) === platoon
        )
      ) {
        count++; // Increment count if condition is met
      }
    });
    return count;
  }

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

export const getPlatoonStrength = (arr: Recruit[], platoon: 1 | 2 | 3 | 4) => {
  const res = arr.filter(
    (recruit) => parseInt(recruit.id.substring(1, 2)) === platoon
  );
  return res.length;
};

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

export const plusToString = (type: string): string => {
  return type === StatusType.LDP1
    ? "LD + 1"
    : type === StatusType.LDP2
    ? "LD + 2"
    : type === StatusType.MCP1
    ? "MC + 1"
    : type === StatusType.MCP2
    ? "MC + 2"
    : type; // Fallback if none of the types match
};

export const getStatusType = (str: string) => {
  if (str === "LD") return StatusType.LD;
  if (str === "MC") return StatusType.MC;
  if (str === "Other") return StatusType.Other;
  if (str === "CustomStatus") return StatusType.CustomStatus;
  if (str === "Physio") return StatusType.Physio;
  if (str === "ReportSick") return StatusType.ReportSick;
};

export const validDate = (date1: string, date2: string): boolean => {
  // Check if a date is valid and return a Date object
  const parseDate = (dateStr: string): Date | null => {
    if (dateStr.length !== 6) return null;

    const day = parseInt(dateStr.slice(0, 2), 10);
    const month = parseInt(dateStr.slice(2, 4), 10) - 1; // Months are 0-indexed
    const year = parseInt(dateStr.slice(4, 6), 10) + 2000; // Assuming years are from 2000+

    const date = new Date(year, month, day);

    // Validate if the created date matches the input
    return date.getDate() === day &&
      date.getMonth() === month &&
      date.getFullYear() === year
      ? date
      : null;
  };

  // Parse both dates
  const dateObj1 = parseDate(date1);
  const dateObj2 = parseDate(date2);

  // Return false if either date is invalid or if date1 is not earlier than date2
  return dateObj1 !== null && dateObj2 !== null && dateObj1 <= dateObj2;
};

export function isWeekendOrMonday(date: Date) {
  const day = date.getDay();
  return day === 0 || day === 1 || day === 6;
}

export function filterResults(
  query: string,
  statuses: ActiveStatusWithRecruit[] | ActiveStatusWithCommander[]
) {
  query = query.toUpperCase();
  if (Array.isArray(statuses)) {
    // Check if it's an array of ActiveStatusWithRecruit
    if (statuses.length > 0 && "recruit" in statuses[0]) {
      return (statuses as ActiveStatusWithRecruit[]).filter(
        (status) =>
          status.recruit?.name.includes(query) ||
          status.recruit?.id.includes(query) ||
          status.type.includes(query)
      );
    }

    // Check if it's an array of ActiveStatusWithCommander
    if (statuses.length > 0 && "commander" in statuses[0]) {
      return (statuses as ActiveStatusWithCommander[]).filter(
        (status) =>
          status.commander?.name.includes(query) || status.type.includes(query)
      );
    }
  }

  return statuses;
}

export function sort_by_name() {
  return function (
    elem1: ActiveStatusWithRecruit | ActiveStatusWithCommander,
    elem2: ActiveStatusWithRecruit | ActiveStatusWithCommander
  ): number {
    // let name1: string = "";
    // let name2: string = "";
    let id1: string = "";
    let id2: string = "";

    if ("recruit" in elem1 && elem1.recruit) {
      // name1 = elem1.recruit.name; // Access name from ActiveStatusWithRecruit
      id1 = elem1.recruit.id; // Access name from ActiveStatusWithRecruit
    } else if ("commander" in elem1 && elem1.commander) {
      // name1 = elem1.commander.name; // Access name from ActiveStatusWithCommander
      id1 = elem1.commander.id; // Access name from ActiveStatusWithCommander
    }

    if ("recruit" in elem2 && elem2.recruit) {
      // name2 = elem2.recruit.name; // Access name from ActiveStatusWithRecruit
      id2 = elem2.recruit.id; // Access name from ActiveStatusWithRecruit
    } else if ("commander" in elem2 && elem2.commander) {
      // name2 = elem2.commander.name; // Access name from ActiveStatusWithCommander
      id2 = elem2.commander.id; // Access name from ActiveStatusWithCommander
    }

    //   if (name1 < name2) {
    //     return -1;
    //   } else if (name1 > name2) {
    //     return 1;
    //   } else {
    //     return 0;
    //   }
    // };
    if (id1 < id2) {
      return -1;
    } else if (id1 > id2) {
      return 1;
    } else {
      return 0;
    }
  };
}

export function getCountdown(): {
  hours: number;
  minutes: number;
  seconds: number;
} {
  const now = new Date();
  const target = new Date();

  // Set the target to 09:00
  target.setHours(9, 0, 0, 0);

  // If the current time is past 08:00, set the target to 08:00 the next day
  if (now > target) {
    target.setDate(target.getDate() + 1);
  }

  // Calculate the difference in milliseconds
  const difference = target.getTime() - now.getTime();

  // Convert the difference to hours, minutes, and seconds
  const hours = Math.floor(difference / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);

  // Return the countdown as a string in "HH:MM:SS" format
  // return `${hours.toString().padStart(2, "0")}:${minutes
  //   .toString()
  //   .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  return { hours, minutes, seconds };
}

//setCountdown(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
