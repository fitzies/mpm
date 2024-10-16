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
            <TableHead className="text-center">Reason</TableHead>
            <TableHead className="text-right">Participation</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            {participants.map((participants) => {
              return (
                <>
                  <TableCell className="font-medium">INV001</TableCell>
                  <TableCell className="text-center">Credit Card</TableCell>
                  <TableCell className="text-right">$250.00</TableCell>
                </>
              );
            })}
          </TableRow>
        </TableBody>
      </Table>
    </>
  );
};

export default ParticipatingTable;
