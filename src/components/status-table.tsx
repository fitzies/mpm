import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Company } from "@prisma/client";
import { filterResults, plusToString } from "@/lib/utils";
import CellEdit from "@/components/cell-edit";
// import AddStatus from "@/components/add-status2";
// import AddStatus from "@/components/add-status";

import { sort_by_name } from "@/lib/utils";
import {
  ActiveStatusWithCommander,
  ActiveStatusWithRecruit,
} from "../../types";

export const StatusTable = ({
  statuses,
  company,
  query,
}: {
  statuses: ActiveStatusWithRecruit[] | ActiveStatusWithCommander[];
  company: Company;
  query: string;
}) => {
  statuses = statuses.sort(sort_by_name());

  return (
    <div>
      <Table>
        <TableCaption>List of statuses</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Recruit</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Status</TableHead>
            <TableHead className="text-right">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filterResults(query, statuses).map(
            (
              status: ActiveStatusWithRecruit | ActiveStatusWithCommander,
              index
            ) => (
              <TableRow key={status.endDate + index}>
                <TableCell className="font-medium">
                  {/* Check if it's a recruit or commander */}
                  {"recruit" in status
                    ? `${status.recruit?.id} ${status.recruit?.name}`
                    : `${status.commander?.name}`}
                </TableCell>
                <TableCell>
                  {status.startDate} - {status.endDate}
                </TableCell>
                <TableCell className="text-right">
                  {status.type === "BookedOut"
                    ? "Booked out"
                    : status.type === "Other" || status.type === "CustomStatus"
                    ? status.remarks
                    : plusToString(status.type)}
                </TableCell>
                <CellEdit status={status} company={company} />
              </TableRow>
            )
          )}
        </TableBody>
      </Table>
    </div>
  );
};
