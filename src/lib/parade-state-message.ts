import { Company, StatusType } from "@prisma/client";
import {
  getActiveStatuses,
  getCommanderActiveStatuses,
  getCommanders,
  getCompany,
} from "./db";
import {
  calculateDays,
  getDate,
  getOutOfCampStrength,
  plusToString,
  sort_by_name,
} from "./utils";
import {
  ActiveStatusWithCommander,
  ActiveStatusWithRecruit,
} from "../../types";

const paradeMessage = async (
  // company: Company,
  companyName: string,
  mcMap: { [key: string]: string[] },
  statusMap: { [key: string]: string[] },
  otherMap: { [key: string]: string[] },
  commanderMap: { [key: string]: string[] }
) => {
  const company = await getCompany(companyName);

  if (!company) {
    return "Error";
  }

  const recruits = company.recruits;
  const totalRecruitStrength = recruits.length;
  const currentRecruitStrength =
    totalRecruitStrength -
    (Object.values(mcMap).length + Object.values(otherMap).length);

  const commanders = company.commanders;
  const totalCommanderStrength = commanders.length;
  const currentCommanderStrength =
    company!.commanders.length - getOutOfCampStrength(company!.commanders);

  return [
    `${company.name} Parade State ${getDate()}

Total Recruit Strength: ${totalRecruitStrength}
Current Recruit Strength: ${currentRecruitStrength}`,

    `MC (${Object.keys(mcMap).length.toString()}):
${Object.entries(mcMap)
  .map(([key, values]) => {
    return `${key}\n${values.map((value) => `\t• ${value}`).join("\n")}`; // Using two spaces instead of '\t'
  })
  .join("\n\n")}`,

    `Statuses (${Object.keys(statusMap).length.toString()}):
${Object.entries(statusMap)
  .map(([key, values]) => {
    return `${key}\n${values.map((value) => `\t• ${value}`).join("\n")}`; // Using two spaces instead of '\t'
  })
  .join("\n\n")}`,

    `Other (${Object.keys(otherMap).length.toString()}):
${Object.entries(otherMap)
  .map(([key, values]) => {
    return `${key}\n${values.map((value) => `\t• ${value}`).join("\n")}`; // Using two spaces instead of '\t'
  })
  .join("\n\n")}`,

    `Commanders Total: ${totalCommanderStrength}
Commanders Present: ${currentCommanderStrength}

Commanders (${Object.keys(commanderMap).length.toString()}):
${Object.entries(commanderMap)
  .map(([key, values]) => {
    return `${key}\n${values.map((value) => `\t• ${value}`).join("\n")}`; // Using two spaces instead of '\t'
  })
  .join("\n\n")}

`,
  ];
};

const turnToKV = (arr: ActiveStatusWithRecruit[]) => {
  const map: { [key: string]: string[] } = {};
  const plusOne = ["MCP1", "MCP2", "LDP1", "LDP2"];

  arr.forEach((status, index) => {
    if (status.recruit && status.recruitId !== null) {
      const key = `${index + 1}. ${status.recruit.id} ${status.recruit.name}`;

      if (!map[key]) {
        map[key] = [];
      }

      const value = `${
        plusOne.includes(status.type)
          ? ""
          : calculateDays(status.startDate, status.endDate) + " "
      }${plusOne.includes(status.type) ? "" : "DAY "}${
        status.type === "CustomStatus" || status.type === "Other"
          ? status.remarks
          : plusToString(status.type)
      } (${status.startDate} - ${status.endDate})`;

      map[key].push(value); // Add status type to the array
    }
  });
  return map;
};

const commanderTurnToKV = (arr: ActiveStatusWithCommander[]) => {
  const map: { [key: string]: string[] } = {};
  const plusOne = ["MCP1", "MCP2", "LDP1", "LDP2"];

  arr.forEach((status, index) => {
    if (status.commander && status.commander !== null) {
      const key = `${index + 1}. ${status.commander.name}`;

      if (!map[key]) {
        map[key] = [];
      }

      const value = `${
        plusOne.includes(status.type)
          ? ""
          : calculateDays(status.startDate, status.endDate) + " "
      }${plusOne.includes(status.type) ? "" : "DAY "}${
        status.type === "CustomStatus" || status.type === "Other"
          ? status.remarks
          : plusToString(status.type)
      } (${status.startDate} - ${status.endDate})`;

      map[key].push(value); // Add status type to the array
    }
  });
  return map;
};

export const paradeStateMessage = async (company: Company) => {
  let statusesList = await getActiveStatuses(
    company.id,
    [StatusType.CustomStatus, StatusType.LD],
    true
  );
  statusesList = statusesList.sort(sort_by_name());
  const statusMap: { [key: string]: string[] } = turnToKV(statusesList);

  let mcList = await getActiveStatuses(company.id, [
    // StatusType.Other,
    StatusType.MC,
  ]);
  mcList = mcList.sort(sort_by_name());
  const mcMap: { [key: string]: string[] } = turnToKV(mcList);

  let otherList = await getActiveStatuses(company.id, [
    StatusType.Other,
    // StatusType.MC,
  ]);
  otherList = otherList.sort(sort_by_name());
  const otherMap: { [key: string]: string[] } = turnToKV(otherList);

  let commanderStatusList = await getCommanderActiveStatuses(
    company.id,
    [StatusType.CustomStatus, StatusType.LD, StatusType.MC, StatusType.Other],
    true
  );
  commanderStatusList = commanderStatusList.sort(sort_by_name());
  const commanderMap: { [key: string]: string[] } =
    commanderTurnToKV(commanderStatusList);

  // return statusMap
  return paradeMessage(company.name, mcMap, statusMap, otherMap, commanderMap);
};
