import { Commander, Recruit, ReportSick, Status } from "@prisma/client";

type RecruitWithStatuses = Recruit & {
  statuses: Status[];
};

type CommanderWithStatuses = Commander & {
  statuses: Status[];
};

interface ActiveStatusWithRecruit {
  id: number; // Status ID
  type: string; // Status type (e.g., "MC", "Other")
  startDate: string; // Start date in ddmmyy format
  endDate: string; // End date in ddmmyy format
  recruitId: number | null; // Allow recruitId to be null
  recruit: Recruit | null; // Recruit can also be null
  remarks?: string;
}

interface ActiveStatusWithCommander {
  id: number; // Status ID
  type: string; // Status type (e.g., "MC", "Other")
  startDate: string; // Start date in ddmmyy format
  endDate: string; // End date in ddmmyy format
  commanderId: number | null; // Allow recruitId to be null
  commander: Recruit | null; // Recruit can also be null
  remarks?: string;
}

// interface PlusStatusWithRecruit {
//   id: number; // Status ID
//   type: string; // Status type (e.g., "MC", "Other")
//   endDate: string; // End date in ddmmyy format
//   recruitId: number | null; // Allow recruitId to be null
//   recruit: Recruit | null; // Recruit can also be null
// }

interface SessionData {
  // Define the structure of your session data
  userId: number;
  username: string;
  // Add other fields as necessary
}

type ConductWithRecruits = Prisma.ConductGetPayload<{
  include: { recruits: true; company: true };
}>;

type ReportSickWithDetails = {
  id: number; // Autoincremented integer
  recruit4d: string; // recruit4d references Recruit.id
  recruit: Recruit; // Relation to Recruit model
  date: string; // Stored as a string in the database
  companyId: number; // Company ID as an integer
  fufilled: boolean; // Boolean, default false
  statusId?: number | null; // Optional status ID
  status?: Status | null; // Optional relation to Status
};

export type DataTableType = {
  headers: string[];
  rows: (string | JSX.Element)[][];
};
