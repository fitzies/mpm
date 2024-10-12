import { Commander, Recruit, Status } from "@prisma/client";

type RecruitWithStatuses = Recruit & {
  statuses: Status[];
};

type CommanderWithStatuses = Commander & {
  statuses: Status[];
};

// interface BaseStatusWithRecruit {
//   id: number; // Status ID
//   type: string; // Status type (e.g., "MC", "Other")
//   startDate: string; // Start date in ddmmyy format
//   endDate: string; // End date in ddmmyy format
//   remarks?: string;
// }

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
