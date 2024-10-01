import { StatusType } from "@prisma/client";
import prisma from "./prisma";
import { getSingaporeDate, parseDate } from "./utils";
import { ActiveStatusWithRecruit } from "../../types";

export const getCompany = async (company: string) => {
  return await prisma.company.findFirst({
    where: { name: company },
    include: {
      recruits: {
        include: {
          statuses: true, // Include the statuses of each recruit
        },
      },
      commanders: { include: { statuses: true } }, // Include commanders
    },
  });
};

export const getRecruits = async (companyId: number) => {
  const recruits = await prisma.recruit.findMany({
    where: {
      companyId,
    },
    include: {
      statuses: true,
    },
  });

  return recruits;
};

export const getRecruitsWithStatus = async (
  companyId: number,
  statuses: StatusType[]
) => {
  const recruits = await prisma.recruit.findMany({
    where: {
      companyId,
      statuses: {
        some: {
          type: {
            in: statuses, // Filter by the provided statuses
          },
        },
      },
    },
    distinct: ["id"], // Ensure unique recruits are counted
  });

  return recruits.length; // Return the count of unique recruits
};

export const getActiveStatuses = async (
  companyId: number,
  statuses: StatusType[],
  plus: boolean = false
): Promise<ActiveStatusWithRecruit[]> => {
  const sgTime = getSingaporeDate();

  const _statuses = await prisma.status.findMany({
    where: {
      recruit: { companyId },
      type: { in: statuses },
    },
    include: {
      recruit: true,
    },
  });

  // Filter and map to ActiveStatusWithRecruit
  const activeStatuses: ActiveStatusWithRecruit[] = _statuses
    .filter((status) => {
      const endDate = parseDate(status.endDate);
      return endDate > sgTime; // Check if endDate is greater than current Singapore time
    })
    .map((status) => ({
      id: status.id,
      type: status.type,
      startDate: status.startDate,
      endDate: status.endDate,
      recruitId: status.recruitId ? Number(status.recruitId) : null,
      recruit: status.recruit,
      remarks: status.remarks ?? "",
    }));

  if (!plus) {
    return activeStatuses; // Return the active statuses if plus is false
  }

  const plusStatuses = await getPlusStatuses(companyId);

  // Concatenate the active statuses and plus statuses
  return activeStatuses.concat(plusStatuses);
};

export const getPlusStatuses = async (
  companyId: number
): Promise<ActiveStatusWithRecruit[]> => {
  const sgTime = getSingaporeDate(); // Get current Singapore date and time

  const expiredStatuses = await prisma.status.findMany({
    where: {
      recruit: { companyId },
      type: { in: ["MC", "LD"] }, // Filter by "MC" or "LD"
    },
    include: {
      recruit: true,
    },
  });

  const filteredStatuses = expiredStatuses
    .filter((status) => {
      const endDate = parseDate(status.endDate); // Parse endDate to Date object
      const endDatePlus2 = new Date(
        endDate.getTime() + 2 * 24 * 60 * 60 * 1000
      ); // Add 2 days

      return endDate < sgTime && endDatePlus2 > sgTime; // Check if status is expired and within 2 days
    })
    .map((status) => {
      const endDate = parseDate(status.endDate);
      // const timeDifference = sgTime.getTime() - endDate.getTime();
      // const daysDifference = Math.floor(
      //   sgTime.getUTCDate() - endDate.getUTCDate()
      // ); // Calculate the difference in days
      const sgTimeMidnight = new Date(
        sgTime.getFullYear(),
        sgTime.getMonth(),
        sgTime.getDate()
      );
      const endDateMidnight = new Date(
        endDate.getFullYear(),
        endDate.getMonth(),
        endDate.getDate()
      );

      // Get the difference in time (milliseconds)
      const timeDifference =
        sgTimeMidnight.getTime() - endDateMidnight.getTime();

      // Convert the difference from milliseconds to days
      const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
      // console.log(sgTimeMidnight, endDateMidnight);

      let updatedType = status.type;

      // Update status type based on the conditions
      if (status.type === "MC") {
        if (daysDifference === 1) {
          updatedType = StatusType.MCP1; // MC expired 1 day ago
        } else if (daysDifference === 2) {
          updatedType = StatusType.MCP2; // MC expired 2 days ago
        }
      } else if (status.type === "LD") {
        if (daysDifference === 1) {
          updatedType = StatusType.LDP1; // LD expired 1 day ago
        } else if (daysDifference === 2) {
          updatedType = StatusType.LDP2; // LD expired 2 days ago
        }
      }

      return {
        id: status.id,
        type: updatedType, // Use the updated type
        startDate: status.startDate,
        endDate: status.endDate,
        recruitId: status.recruitId, // Keep recruitId as string
        recruit: status.recruit,
        remarks: status.remarks,
      };
    });

  return filteredStatuses as ActiveStatusWithRecruit[];
};

export const deleteStatus = async (statusId: number) => {
  await prisma.status.delete({ where: { id: statusId } });
};

export const getRecruit = async (id: string) => {
  return await prisma.recruit.findFirst({ where: { id } });
};
