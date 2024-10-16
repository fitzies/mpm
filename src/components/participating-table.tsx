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

const ParticipatingTable = ({ participants }: { participants: Recruit[] }) => {
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
          <TableRow key={participant.id}>
                  <TableCell className="font-medium">{participant.id} {participant.name}</TableCell>
                  {/* <TableCell className="text-center"></TableCell> */}
                  <TableCell className="text-right">Yes</TableCell>
          </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </>
  );
};

export default ParticipatingTable;
