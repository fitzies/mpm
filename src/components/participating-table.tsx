"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Ellipsis } from "lucide-react";
import { CustomDialog } from "./custom-dialog";
import { Button } from "./ui/button";
import { Conduct } from "@prisma/client";
import { upsertRecruitIntoConduct } from "@/lib/actions";

const ParticipatingTable = ({
  participants,
  fallouts,
  query,
  conduct,
}: {
  participants: {
    recruitId: string;
    recruitName: string;
    participated: boolean;
    reason: string[];
  }[];
  fallouts: string[];
  query: string;
  conduct: Conduct;
}) => {
  participants.sort(
    (a, b) =>
      parseInt(a.recruitId.substring(1)) - parseInt(b.recruitId.substring(1))
  );

  const queried =
    query.length > 1
      ? participants.filter(
          (a) =>
            a.recruitName.includes(query.toUpperCase()) ||
            a.recruitId.includes(query.toUpperCase()) ||
            a.reason.includes(query.toUpperCase())
        )
      : participants;

  return (
    <>
      <Table>
        <TableCaption></TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            {/* <TableHead className="text-center">Reason</TableHead> */}
            <TableHead className="text-center">Participatated</TableHead>
            <TableHead className="text-center">Reason</TableHead>
            <TableHead className="text-right">Upsert</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {queried.map((participant) => {
            // const reason = participant.reason.sort((a, b) => b. - a);
            return (
              <TableRow key={participant.recruitId}>
                <TableCell className="font-medium">
                  {participant.recruitId} {participant.recruitName}
                </TableCell>
                {/* <TableCell className="font-medium">{participant.recruitId} {participant.recruitName}</TableCell> */}
                {/* <TableCell className="text-center"></TableCell> */}
                <TableCell className="text-center">
                  {participant.participated ? "Yes" : "No"}
                </TableCell>
                <TableCell className="text-center">
                  {fallouts.includes(participant.recruitId)
                    ? "Fell out"
                    : !participant.participated
                    ? participant.reason.join(", ")
                    : ""}
                </TableCell>
                <TableCell className="text-right">
                  <CustomDialog
                    title={`${
                      participant.participated
                        ? "This recruit is already participating"
                        : "Are you sure you want to override and make this recruit present"
                    }`}
                    description={""}
                    trigger={<Ellipsis className="ml-auto mr-2" />}
                    btn={
                      <Button
                        className="w-full"
                        disabled={participant.participated}
                      >
                        Confirm
                      </Button>
                    }
                    loadingBtn={
                      <Button className="w-full" disabled>
                        ...
                      </Button>
                    }
                    action={upsertRecruitIntoConduct}
                  >
                    <input
                      className="hidden"
                      name="conductId"
                      value={conduct.id}
                    />
                    <input
                      className="hidden"
                      name="recruitId"
                      value={participant.recruitId}
                    />
                  </CustomDialog>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
};

export default ParticipatingTable;
