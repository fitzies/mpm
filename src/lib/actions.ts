"use server";

import { revalidatePath } from "next/cache";
import { deleteStatus } from "./db";
import prisma from "./prisma";
import { getStatusType, validDate } from "./utils";
import { StatusType } from "@prisma/client";

export const handleDeleteStatus = async (data: FormData) => {
  const statusId = data.get("statusId");
  const companyName = data.get("companyName");

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
  const remarks = data.get("remarks")?.toString() ?? "";

  const company = data.get("company");

  // Check for correct inputs

  if (!fourD || !status || !startDate || !endDate || !company) {
    console.log("Form inputs wrong...");
    return "Please input the form correctly...";
  }

  const _status: StatusType | undefined = getStatusType(status.toString());

  if (!_status) {
    console.log("Status is wrong...");
    return "This status doesn't exist...";
  }

  if (!validDate(startDate.toString(), endDate.toString())) {
    console.log("Dates are wrong...");
    return "Please input valid dates...";
  }

  try {
    await prisma.status.create({
      data: {
        recruitId: fourD.toString(),
        startDate: startDate.toString(),
        endDate: endDate.toString(),
        type: _status,
        remarks: remarks ?? "",
      },
    });
  } catch (error) {
    console.error(error);
    return "Please enter an existing 4d...";
  }

  revalidatePath(`company/${company.toString().toLowerCase()}/statuses`);
  return true;
}
