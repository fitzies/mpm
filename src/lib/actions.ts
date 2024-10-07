"use server";

import { revalidatePath } from "next/cache";
import { deleteStatus } from "./db";
import prisma from "./prisma";
import { getDate, getStatusType, validDate } from "./utils";
import { StatusType } from "@prisma/client";
import axios from "axios";
import { paradeStateMessage } from "./parade-state-message";

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

  const commander = data.get("commander");

  // Check for correct inputs

  if (!commander && !fourD) {
    console.log("Never input 4d/commander");
    return "Please enter a correct 4d/commander";
  }

  if (!status || !startDate || !endDate || !company) {
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

  if (!fourD && commander) {
    try {
      await prisma.status.create({
        data: {
          commanderId: parseInt(commander.toString()),
          startDate: startDate.toString(),
          endDate: endDate.toString(),
          type: _status,
          remarks: remarks ?? "",
        },
      });
    } catch (error) {
      console.error(error);
      return "Please input an existing commander...";
    }
  }

  if (fourD && !commander) {
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
  }

  revalidatePath(`company/${company.toString().toLowerCase()}/statuses`);
  return true;
}

export async function submitPolar(data: FormData) {
  const fourD = data.get("4d")?.toString();
  const accessToken = data.get("access-token")?.toString();
  const userId = data.get("user-id")?.toString();

  if (!fourD || !accessToken || !userId) {
    console.log("No 4d or access token is given.");
    console.log(fourD, accessToken, userId);
    return "No 4d or access token is given.";
  }

  try {
    await prisma.recruit.update({
      where: { id: fourD },
      data: { polarAccessToken: accessToken, polarUserId: userId },
    });
    return true;
  } catch (error) {
    console.log(error);
    return "This 4D does not exist";
  }
}

export const handleSubmitParadeState = async (data: FormData) => {
  const companyId = data.get("companyId");

  if (!companyId) {
    return "No company was provided";
  }

  const company = await prisma.company.findFirst({
    where: { id: parseInt(companyId.toString()) },
  });

  if (!company) {
    return "No company found";
  }

  // if (company.paradeStateSubmitted === getDate()) {
  //   return `${company.name} has already submitted their Parade State.`;
  // }

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
        id: parseInt(companyId.toString()), // Find the record by the company ID
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
