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

export const getActiveStatuses = async (
  companyId: number,
  statuses: StatusType[]
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
    }));

  return activeStatuses; // Return the active statuses
};
