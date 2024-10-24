"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { deleteStatus, getActiveStatuses, getCompany } from "./db";
import prisma from "./prisma";
import {
  dateToStringDate,
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
import { SessionData } from "../../types";
import { redirect } from "next/navigation";

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
  const companyId = data.get("companyId")?.toString();

  if (!title || !type || !date || !companyId) {
    throw Error("Please fill in the form details correctly");
  }

  if (!validOneDate(date)) {
    throw Error("Please enter a correct date");
  }
  const company = await prisma.company.findFirst({
    where: { id: parseInt(companyId) },
  });

  if (!company) {
    throw Error("This company does not exist");
  }

  try {
    console.log(type, companyId);
    await prisma.conduct.create({
      data: {
        title,
        date,
        type: type as ConductType,
        companyId: company.id,
      },
    });
  } catch (error) {
    console.log("\n\n\n---", error, "\n\n\n---");
    throw Error("There was an issue creating your conduct");
  }

  revalidatePath(`/company/${company.name.toLowerCase()}/conducts`);

  return true;
}

async function recruitsParticipationStatus(
  date: string,
  companyId: number,
  fallouts: string[]
) {
  const parsedDate = parseDate(date); // Parse ddmmyy into a Date object

  // Fetch all recruits and their statuses
  const recruitsWithStatuses = await prisma.recruit.findMany({
    where: { companyId },
    include: {
      statuses: true, // Include related statuses
    },
  });

  // Map each recruit to an object with their participation status
  const participationStatus = recruitsWithStatuses.map((recruit) => {
    // If the recruit is in the fallouts array, exclude them immediately
    if (fallouts.includes(recruit.id)) {
      return null;
    }

    // Check recruit's statuses to determine participation
    const participated = !recruit.statuses.some((status) => {
      const statusStartDate = parseDate(status.startDate);
      const statusEndDate = parseDate(status.endDate);

      // Check if the parsedDate is **within the status period** (startDate <= parsedDate <= endDate)
      const isStatusActive =
        parsedDate >= statusStartDate && parsedDate <= statusEndDate;

      // Special check for "LD" or "MC" statuses: exclude if within 2 days after endDate
      const isWithinGracePeriod =
        (status.type === "LD" || status.type === "MC") &&
        parsedDate > statusEndDate &&
        parsedDate <=
          new Date(statusEndDate.getTime() + 1 * 24 * 60 * 60 * 1000); // 2-day grace period

      // Exclude if the status is active on the date or if it falls within the grace period
      return isStatusActive || isWithinGracePeriod;
    });

    // If `participated` is true, include the recruit, otherwise exclude them (return null)
    return participated ? recruit : null;
  });

  // Filter out null values and return only participating recruits
  return participationStatus.filter((recruit) => recruit !== null) as Recruit[]; // Replace 'Recruit' with the appropriate type if defined
}

export async function editStrength(data: FormData) {
  const fallOuts = data.get("fall-outs")?.toString() || ""; // Handle empty fallOuts
  const date = data.get("date")?.toString();
  const conductId = data.get("conductId")?.toString();

  // Check for missing fields
  if (!date || !conductId) {
    throw Error("Missing some required fields.");
  }

  // Fetch conduct and related company
  const conduct = await prisma.conduct.findFirst({
    where: { id: parseInt(conductId) },
    include: { company: true },
  });

  if (!conduct) {
    throw Error("Conduct not found.");
  }

  // Split fallouts string into an array of IDs
  const fallOutsArray = fallOuts
    ? fallOuts.split(",").map((id) => id.trim())
    : [];

  // Get recruits participation status
  const strength = await recruitsParticipationStatus(
    date,
    conduct.companyId,
    fallOutsArray
  );

  // Update the conduct with the new recruits and fallouts
  await prisma.conduct.update({
    where: { id: parseInt(conductId) },
    data: {
      recruits: {
        set: [], // First clear existing recruits
        connect: strength.map((recruit) => ({ id: recruit.id })), // Add eligible recruits
      },
      fallouts: fallOutsArray, // Update fallouts
    },
  });

  // Revalidate the path to update the page after the changes
  revalidatePath(
    `/company/${conduct.company.name.toLocaleLowerCase()}/conducts/${conductId}`
  );
  return true;
}

export async function getParticipants(conductId: number): Promise<
  {
    recruitId: string;
    recruitName: string;
    participated: boolean;
    reason: string[];
  }[]
> {
  const conduct = await prisma.conduct.findUnique({
    where: { id: conductId },
    include: {
      recruits: true,
      company: { include: { recruits: { include: { statuses: true } } } },
    },
  });

  if (!conduct) {
    throw new Error("Can't retrieve conduct.");
  }

  if (conduct.recruits.length <= 0) {
    return [];
  }

  const participants = conduct.recruits; // Recruits that participated in the conduct
  const allRecruits = conduct.company.recruits; // All recruits in the company

  // Map all recruits to the participation status
  const participationStatus = allRecruits.map((recruit) => {
    const participated = participants.some(
      (participant) => participant.id === recruit.id
    ); // Check if the recruit participated

    const _status = recruit.statuses.filter(
      (status) =>
        parseDate(status.startDate) <= parseDate(conduct.date) &&
        parseDate(status.endDate) >= parseDate(conduct.date)
    );

    const oneDayAgo = parseDate(conduct.date);
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    const P1 = recruit.statuses.filter((status) => {
      const endDate = parseDate(status.endDate);

      // Check if the status is only one day expired
      const isOneDayExpired =
        endDate < parseDate(conduct.date) && endDate >= oneDayAgo;

      // Check for the status type being MC or LD
      const isMCOrLD = status.type === "MC" || status.type === "LD";

      return isOneDayExpired && isMCOrLD;
    });

    const reason: string[] = _status.map((a) =>
      a.type === "CustomStatus" || a.type === "Other" ? a.remarks ?? "" : a.type
    );

    P1.map((p1) => reason.push(`${p1.type.toString()} + 1`));

    return {
      recruitId: recruit.id,
      recruitName: recruit.name,
      participated: participated, // true if in the participants list, false otherwise
      reason: reason,
    };
  });

  return participationStatus;
}

export const deleteReportSick = async (data: FormData) => {
  const id = data.get("id")?.toString();

  if (!id) {
    throw Error("This object does not exist.");
  }

  const reportSick = await prisma.reportSick.delete({
    where: { id: parseInt(id) },
  });

  const company = await prisma.company.findFirst({
    where: { id: reportSick?.companyId },
  });

  revalidatePath(`/company/${company?.name}/report-sick`);
};

export const setConductingStructure = async (data: FormData) => {
  const supervisingId = data.get("supervising")?.toString();
  const conductingId = data.get("conducting")?.toString();
  const chiefSafetyId = data.get("chief-safety")?.toString();

  const conductId = data.get("conductId")?.toString();

  if (!supervisingId || !conductingId || !chiefSafetyId || !conductId) {
    throw Error("Please fill in all fields for conducting structure");
  }

  // Step 1: Set fields to null
  await prisma.conduct.update({
    where: { id: parseInt(conductId) },
    data: {
      supervisingId: null,
      conductingId: null,
      chiefSafetyId: null,
    },
  });

  // Step 2: Update with new IDs
  const conduct = await prisma.conduct.update({
    where: { id: parseInt(conductId) },
    data: {
      supervisingId: parseInt(supervisingId),
      conductingId: parseInt(conductingId),
      chiefSafetyId: parseInt(chiefSafetyId),
    },
  });

  console.log("supervising: " + supervisingId);
  console.log("conducting: " + conductingId);
  console.log("chiefSafety: " + chiefSafetyId);

  const company = await prisma.company.findFirst({
    where: { id: conduct.companyId },
  });

  revalidatePath(
    `/company/${company?.name.toLowerCase()}/conducts/${conduct.id}`
  );
  return true;
};

export const deleteConduct = async (data: FormData) => {
  const _id = data.get("conductId")?.toString();

  if (!_id) {
    throw Error("This conduct does not exist");
  }

  const id = parseInt(_id);

  const conduct = await prisma.conduct.delete({
    where: { id },
    include: { company: true },
  });

  redirect(`/company/${conduct.company.name.toLowerCase()}/conducts`);
};

export async function upsertRecruitIntoConduct(data: FormData) {
  const conductId = data.get("conductId")?.toString();
  const recruitId = data.get("recruitId")?.toString();

  if (!conductId || !recruitId) {
    throw Error("Either this recruit or conduct does not exist");
  }

  const conduct = await prisma.conduct.findFirst({
    where: { id: parseInt(conductId) },
    select: { fallouts: true, recruits: true },
  });

  const company = await prisma.company.findFirst({
    where: { conducts: { some: { id: parseInt(conductId) } } },
  });

  if (!conduct || !company) {
    throw Error("This conduct does not exist");
  }

  // Remove the recruitId from fallouts if it exists
  const updatedFallouts = conduct.fallouts.filter((id) => id !== recruitId);

  // Append the recruitId to participating
  const newRecruit = await prisma.recruit.findFirst({
    where: { id: recruitId },
  });
  const updatedParticipating = [...conduct.recruits, newRecruit];

  // Update the conduct record with new fallouts and participating arrays
  await prisma.conduct.update({
    where: { id: parseInt(conductId) },
    data: {
      fallouts: updatedFallouts,
      // recruits: updatedParticipating,
      recruits: {
        set: [], // First clear existing recruits
        connect: updatedParticipating.map((recruit) => ({ id: recruit!.id })), // Add eligible recruits
      },
    },
  });

  revalidatePath(`/company/${company.name.toLowerCase}/conducts/${conductId}`);

  return true;
}

export async function addMultipleStatuses(data: FormData) {
  type StatusEntry = {
    type: StatusType;
    startDate: string;
    endDate: string;
    remarks?: string | null; // Remarks can be optional or nullable
  };

  const recruitData: { id: string; name: string; statuses: StatusEntry[] } = {
    id: data.get("4d")!.toString(),
    name: data.get("name")!.toString(),
    statuses: [],
  };

  // Dynamically extract status data
  let i = 0;
  while (data.has(`status-${i}`)) {
    recruitData.statuses.push({
      type: getStatusType(data.get(`status-${i}`)!.toString())!,
      startDate: data.get(`start-date-${i}`)!.toString(),
      endDate: data.get(`end-date-${i}`)!.toString(),
      remarks: data.get(`remarks-${i}`)?.toString() || "", // Use optional chaining
    });
    i++;
  }

  // Prepare data for Prisma, assuming the 'type' field is required
  const statusData = recruitData.statuses.map((status) => {
    if (!validDate(status.startDate, status.endDate)) {
      throw Error("Please enter correct dates");
    }
    return {
      recruitId: recruitData.id, // Assuming this is the ID for the recruit
      type: status.type,
      startDate: status.startDate,
      endDate: status.endDate,
      remarks: status.remarks,
    };
  });

  // Create status entries in the database
  await prisma.status
    .createMany({ data: statusData })
    .then(() => {
      console.log("Statuses created successfully");
    })
    .catch((error) => {
      console.error("Error creating statuses:", error);
      throw Error("Please make sure all the details are filled correctly");
    });

  const company = await prisma.company.findFirst({
    where: { recruits: { some: { id: data.get("4d")!.toString() } } },
  });
  revalidatePath(`/company/${company?.name.toLowerCase()}/statuses`);
  return true;
}

export const bookOutRecruits = async (data: FormData) => {
  const { ids, wholeCompany, companyId } = {
    ids: data.get("4ds")?.toString(),
    wholeCompany: data.get("whole-company")?.toString(),
    companyId: data.get("company-id")?.toString(),
  };

  const startDate = getDate();
  const endDate = dateToStringDate(
    new Date(new Date().setDate(new Date().getDate() + 2))
  );

  if (!companyId || (!ids && !wholeCompany)) {
    throw Error("Please fill in all the necessary fields");
  }
  const company = await prisma.company.findFirst({
    where: { id: parseInt(companyId) },
  });

  if (ids && !wholeCompany) {
    const idsList = ids.split(", "); // Split the string into an array of recruit IDs

    try {
      const res = await prisma.status.createMany({
        data: idsList.map((recruitId) => ({
          startDate,
          endDate,
          type: "BookedOut",
          recruitId, // Assign recruitId from the list
        })),
      });
      if (res.count === idsList.length) {
        revalidatePath(`/company/${company?.name.toLowerCase()}/statuses`);
        return true;
      }
    } catch (error) {
      console.error(error);
      if (error instanceof Error) throw Error(error.message);
    }
  }

  if (wholeCompany && !ids) {
    const recruits = await prisma.recruit.findMany({
      where: {
        companyId: parseInt(companyId),
      },
    });
    const statusesData = recruits.map((recruit) => ({
      startDate,
      endDate,
      type: StatusType.BookedOut,
      recruitId: recruit.id, // Use the recruit ID from the fetched recruits
    }));

    try {
      const res = await prisma.status.createMany({
        data: statusesData,
      });
      if (res.count === recruits.length && res) {
        revalidatePath(`/company/${company?.name.toLowerCase()}/statuses`);
        return true;
      }
    } catch (error) {
      console.error(error);
      if (error instanceof Error) throw Error(error.message);
    }
  }

  throw Error("Something went wrong");
};

export async function bookOut(data: FormData) {
  const unparsed4ds = data.get("4ds")?.toString();
  const companyId = data.get("company-id")?.toString();

  if (!unparsed4ds || !companyId) {
    throw Error("Something went very wrong");
  }

  const company = await prisma.company.findFirst({
    where: { id: parseInt(companyId) },
  });

  if (!company) {
    throw Error("This company does not exist");
  }

  const ids = JSON.parse(unparsed4ds);
  const startDate = getDate();
  const endDate = dateToStringDate(
    new Date(new Date().setDate(new Date().getDate() + 2))
  );

  let recruits = await prisma.recruit.findMany({
    where: {
      companyId: parseInt(companyId),
    },
  });

  recruits = recruits.filter((recruit) => ids.includes(recruit.id));

  const statusesData = recruits.map((recruit) => ({
    startDate,
    endDate,
    type: StatusType.BookedOut,
    recruitId: recruit.id, // Use the recruit ID from the fetched recruits
  }));

  try {
    const res = await prisma.status.createMany({
      data: statusesData,
    });
    if (res.count === recruits.length && res) {
      revalidatePath(`/company/${company.name.toLowerCase()}/nominal-roll`);
      return true;
    }
  } catch (error) {
    console.error(error);
    if (error instanceof Error) throw Error(error.message);
  }
}
