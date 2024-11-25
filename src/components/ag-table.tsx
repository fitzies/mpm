import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { parseDate, sortForConductTable } from "@/lib/utils";

import { Company, Conduct, ConductType, Recruit } from "@prisma/client";
import { Badge } from "./ui/badge";

export const AgTable = async ({
  type,
  conducts,
  company,
}: {
  type: ConductType;
  conducts: (Conduct & { recruits: Recruit[] })[];
  company: Company & { recruits: Recruit[] };
}) => {
  const { arr, recruits } = sortForConductTable(conducts, company, type);
  return (
    <>
      <Table className="my-4">
        <TableCaption>A list of participants</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            {arr.map((header) => (
              <TableHead key={header.title}>{header.title}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {recruits.map((recruit) => {
            return (
              <TableRow key={recruit.id}>
                <TableCell className="font-medium">
                  {recruit.id} {recruit.name}
                </TableCell>
                {arr.map((value) => (
                  <TableCell key={value.id}>
                    {value.recruits.map((r) => r.id).includes(recruit.id) ? (
                      <Badge variant="outline">Yes</Badge>
                    ) : (
                      <Badge variant="destructive">No</Badge>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
};
