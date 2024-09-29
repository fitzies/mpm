"use server";

import { revalidatePath } from "next/cache";
import { deleteStatus } from "./db";
import prisma from "./prisma";
import { getStatusType } from "./utils";
import { StatusType } from "@prisma/client";

export const handleDeleteStatus = async (data: FormData) => {
  const statusId = data.get("statusId");
  const companyName = data.get("companyName");

  console.log(companyName);

  if (!statusId || !companyName) {
    console.error("No status found...");
    throw Error;
  }

  await deleteStatus(parseInt(statusId.toString()));

  revalidatePath(`/company/${companyName}/statuses`);
};

export async function handleCreateStatus(data: FormData) {
  const fourD = data.get("4d");
  const status = data.get("status");
  const startDate = data.get("start-date");
  const endDate = data.get("end-date");

  const company = data.get("company");

  console.log(company);

  // Check for correct inputs

  if (!fourD || !status || !startDate || !endDate || !company) {
    console.log("Form inputs wrong...");
    return;
  }

  const _status: StatusType | undefined = getStatusType(status.toString());

  if (!_status) {
    console.log("Status is wrong...");
    return;
  }

  const newStatus = await prisma.status.create({
    data: {
      recruitId: fourD.toString(),
      startDate: startDate.toString(),
      endDate: endDate.toString(),
      type: _status,
    },
  });

  console.log(newStatus);

  revalidatePath(`company/${company.toString().toLowerCase()}/statuses`);
}
