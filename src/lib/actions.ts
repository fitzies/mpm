"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { deleteStatus } from "./db";
import prisma from "./prisma";
import {
  decrypt,
  encrypt,
  getDate,
  getStatusType,
  parseDate,
  validDate,
  validOneDate,
} from "./utils";
import { ConductType, Recruit, StatusType } from "@prisma/client";
import axios from "axios";
import { paradeStateMessage } from "./parade-state-message";
import { signIn } from "./auth";
import { SessionData } from "../../types";

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

  const encryptedSessionData =
    cookies().get("session")?.value ??
    JSON.stringify({
      userId: -1,
    });

  const createdBy = JSON.parse(
    decrypt(encryptedSessionData, process.env.ENCRYPTED_KEY!)
  ).userId;

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
          createdById: createdBy,
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
          createdById: 1,
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

export async function handleLogin(sessionData: SessionData): Promise<void> {
  const encryptedSessionData = encrypt(
    JSON.stringify(sessionData),
    process.env.ENCRYPTED_KEY!
  ); // Encrypt your session data
  cookies().set("session", encryptedSessionData, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
  });
  // Redirect or handle the response after setting the cookie
}

export async function getSessionData() {
  const encryptedSessionData = cookies().get("session")?.value;
  return encryptedSessionData
    ? JSON.parse(decrypt(encryptedSessionData, process.env.ENCRYPTED_KEY!))
    : null;
}

export async function createConduct(data: FormData) {
  const title = data.get("title")?.toString();
  const type = data.get("type")?.toString();
  const date = data.get("date")?.toString();
  const company = data.get("company")?.toString();

  if (!title || !type || !date || !company) {
    throw Error("Please fill in the form details correctly");
  }

  if (!validOneDate(date)) {
    throw Error("Please enter a correct date");
  }

  try {
    await prisma.conduct.create({
      data: {
        title,
        date,
        type: type as ConductType,
        companyId: parseInt(JSON.parse(company).id),
      },
    });
  } catch (error) {
    console.log(error);
    throw Error("There was an issue with create your conduct");
  }

  revalidatePath(`/company/${JSON.parse(company).name.toLowerCase()}/conducts`);

  return true;
}

async function recruitsWithoutStatus(date: string, companyId: number) {
  const parsedDate = parseDate(date);
  const formattedDate = parsedDate
    .toLocaleDateString("en-GB")
    .split("/")
    .reverse()
    .join("")
    .slice(0, 6);

  const withoutStatus = await prisma.recruit.findMany({
    where: {
      statuses: {
        none: {
          // Ensure the recruit has no status covering the given date
          startDate: { lte: formattedDate },
          endDate: { gte: formattedDate },
        },
      },
      companyId
    },
  });

  return withoutStatus;
}

export async function editStrength(data: FormData) {
  const allRecruits: boolean =
    data.get("all-recruits")?.toString().toLowerCase() === "true";
  const participated = data.get("participants")?.toString();
  const fallOuts = data.get("fall-outs")?.toString() || ""; // handle empty fallOuts

  const date = data.get("date")?.toString();
  const conductId = data.get("conductId")?.toString();

  
  if (
    allRecruits === null ||
    allRecruits === undefined ||
    !date ||
    !conductId
  ) {
    throw Error("Missing some required fields.");
  }
  const conduct = await prisma.conduct.findFirst({where: {id: parseInt(conductId)}, include: {company: true}})

  if (allRecruits) {
    const strength: Recruit[] = await recruitsWithoutStatus(date, conduct!.companyId);

    // Convert fallOuts to an array of IDs and filter out matching recruits
    const fallOutsArray = fallOuts
      ? fallOuts.split(",").map((id) => id.trim())
      : [];

    const filteredStrength = strength.filter(
      (recruit) => !fallOutsArray.includes(recruit.id)
    );

    await prisma.conduct.update({
      where: { id: parseInt(conductId) },
      data: {
        recruits: {
          set: filteredStrength.map((recruit) => ({ id: recruit.id })),
        },
      },
    });
  }


  console.log(allRecruits);
  revalidatePath(`/company/${conduct?.company.name.toLocaleLowerCase()}/conducts/${conductId}`)
}
