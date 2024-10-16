import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Recruit } from "@prisma/client";

const ParticipatingTable = ({ participants }: { participants: {recruitId: string, recruitName: string, participated: boolean}[] }) => {

  participants.sort((a, b) => parseInt(a.recruitId.substring(1)) - parseInt(b.recruitId.substring(1)))

  return (
    <>
      <Table>
        <TableCaption></TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Name</TableHead>
            {/* <TableHead className="text-center">Reason</TableHead> */}
            <TableHead className="text-right">Participatated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
            {participants.map((participant) => {
              return (
          <TableRow key={participant.recruitId}>
                  <TableCell className="font-medium">{participant.recruitId} {participant.recruitName}</TableCell>
                  {/* <TableCell className="font-medium">{participant.recruitId} {participant.recruitName}</TableCell> */}
                  {/* <TableCell className="text-center"></TableCell> */}
                  <TableCell className="text-right">{participant.participated ? "Yes" : "No"}</TableCell>
          </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </>
  );
};

export default ParticipatingTable;
