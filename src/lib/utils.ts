import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  ActiveStatusWithCommander,
  ActiveStatusWithRecruit,
  CommanderWithStatuses,
  RecruitWithConducts,
  RecruitWithStatuses,
} from "../../types";
import { getRecruits } from "./db";
import {
  Company,
  Conduct,
  ConductType,
  Recruit,
  StatusType,
} from "@prisma/client";
import { paradeStateMessage } from "./parade-state-message";
import axios from "axios";
import prisma from "./prisma";

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

export function getDate(): string {
  const now = new Date();

  const day = String(now.getDate()).padStart(2, "0"); // Get day and pad to 2 digits
  const month = String(now.getMonth() + 1).padStart(2, "0"); // Get month (0-indexed, so add 1)
  const year = String(now.getFullYear()).slice(-2); // Get last two digits of the year

  return `${day}${month}${year}`;
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
            (status.type === "MC" ||
              status.type === "Other" ||
              status.type === "BookedOut") &&
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
          (status.type === "MC" ||
            status.type === "Other" ||
            status.type === "BookedOut") &&
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
  return type === StatusType.LDP1 || type === "LDP1"
    ? "LD + 1"
    : type === StatusType.LDP2 || type === "LDP2"
    ? "LD + 2"
    : type === StatusType.MCP1 || type === "MCP1"
    ? "MC + 1"
    : type === StatusType.MCP2 || type === "MCP2"
    ? "MC + 2"
    : type; // Fallback if none of the types match
};

export const getStatusType = (str: string): StatusType | undefined => {
  if (str === "LD") return StatusType.LD;
  if (str === "MC") return StatusType.MC;
  if (str === "Other") return StatusType.Other;
  if (str === "CustomStatus") return StatusType.CustomStatus;
  if (str === "Physio") return StatusType.Physio;
  if (str === "ReportSick") return StatusType.ReportSick;
};

export function validOneDate(date: string) {
  if (date.length !== 6) return null;

  const day = parseInt(date.slice(0, 2), 10);
  const month = parseInt(date.slice(2, 4), 10) - 1; // Months are 0-indexed
  const year = parseInt(date.slice(4, 6), 10) + 2000; // Assuming years are from 2000+

  const dateObj = new Date(year, month, day);

  return dateObj.getDate() === day &&
    dateObj.getMonth() === month &&
    dateObj.getFullYear() === year
    ? dateObj
    : null;
}

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
  const day = now.getDay(); // Get the current day of the week (0 = Sunday, 6 = Saturday)

  if (day >= 1 && day <= 4) {
    // Monday to Thursday: set target to 09:00
    target.setHours(9, 0, 0, 0);
  } else if (day === 5) {
    // Friday: set target to 09:00
    target.setHours(9, 0, 0, 0);

    // If current time is past Friday 09:00, set the target to Sunday 20:45
    if (now > target) {
      target.setDate(target.getDate() + 2); // Skip to Sunday
      target.setHours(20, 45, 0, 0);
    }
  } else if (day === 0) {
    // Sunday: set target to 20:45
    target.setHours(20, 45, 0, 0);
  }

  // If the current time is past the target for any other day, set the target to the next day
  if (now > target && day !== 5) {
    target.setDate(target.getDate() + 1);
  }

  // Calculate the difference in milliseconds
  const difference = target.getTime() - now.getTime();

  // Convert the difference to hours, minutes, and seconds
  const hours = Math.floor(difference / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);

  return { hours, minutes, seconds };
}

export function calculateDays(startDate: string, endDate: string): number {
  const start = parseDate(startDate);
  const end = parseDate(endDate);

  // Calculate the difference in time (milliseconds)
  const diffTime = end.getTime() - start.getTime();

  // Convert the difference from milliseconds to days and add 1 to count the start day
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

  return diffDays;
}

export const sendTelegramState = async (company: Company) => {
  const botToken = process.env.TELEGRAM_BOT_TOKEN as string;
  const chatId = process.env.TELEGRAM_CHAT_ID as string;

  const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

  try {
    const textList = await paradeStateMessage(company);

    // Check for error in message generation
    if (!textList || textList === "Error") {
      return "Failed to generate message.";
    }

    // Send all messages in sequence using for...of loop
    for (const text of textList) {
      const response = await axios.post(telegramUrl, {
        chat_id: chatId,
        text: text,
      });

      // Check if message sending was successful
      if (!response.data.ok) {
        return "Failed to send message, please try again later.";
      }
    }

    // If all messages were sent successfully, update the paradeStateSubmitted field
    await prisma.company.update({
      where: {
        id: company.id, // Find the record by the company ID
      },
      data: {
        paradeStateSubmitted: getDate(), // Update the paradeStateSubmitted field
      },
    });

    return true;
  } catch (error) {
    console.error("Error sending message to Telegram:", error);
    return "Error sending message, please try again later.";
  }
};

export function encrypt(plaintext: string, key: string): string {
  let result = "";

  for (let i = 0; i < plaintext.length; i++) {
    // XOR each character with the key character (repeating the key as necessary)
    result += String.fromCharCode(
      plaintext.charCodeAt(i) ^ key.charCodeAt(i % key.length)
    );
  }

  // Convert the result to a string that can be safely transmitted
  return Buffer.from(result, "binary").toString("base64");
}

export function decrypt(encryptedText: string, key: string): string {
  const binaryString = Buffer.from(encryptedText, "base64").toString("binary");
  let result = "";

  for (let i = 0; i < binaryString.length; i++) {
    // XOR each character with the key character (repeating the key as necessary)
    result += String.fromCharCode(
      binaryString.charCodeAt(i) ^ key.charCodeAt(i % key.length)
    );
  }

  return result;
}

export const addSpacesToEnumValue = (value: string) => {
  return value.replace(/([a-z])([A-Z])/g, "$1 $2");
};

export const removeSpacesToEnumValue = (value: string) => {
  return value.replace(" ", "");
};

export const formatString = (date: string) => {
  return parseDate(date).toUTCString().split("23")[0];
};

export const dateToStringDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, "0"); // Get day and pad with leading 0
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based, so +1 and pad with 0
  const year = String(date.getFullYear()).slice(-2); // Get last 2 digits of the year

  return `${day}${month}${year}`; // Format as ddmmyy
};

export const checkRecruitOutOfCamp = (
  recruitId: string,
  statuses: ActiveStatusWithRecruit[]
): boolean => {
  // Check if any status belongs to the recruit and indicates they are out of camp
  return statuses.some((status) => {
    return (
      status.recruit?.id === recruitId &&
      (status.type === StatusType.BookedOut ||
        status.type === StatusType.Other ||
        status.type === StatusType.MC)
    );
  });
};

export function getLatestConduct(
  recruit: RecruitWithConducts,
  conductType: "SOC" | "RouteMarch"
) {
  const conduct =
    conductType === "SOC" ? ConductType.SOC : ConductType.RouteMarch;

  const recruitsConducts = recruit.conducts.filter(
    (c: Conduct) => c.type === conduct
  );

  if (recruitsConducts.length <= 0) {
    return `None`;
  }
  return `${addSpacesToEnumValue(conductType)} ${recruitsConducts.length}`;
}
