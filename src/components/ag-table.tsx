import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { parseDate } from "@/lib/utils";

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
  let arr: (Conduct & { recruits: Recruit[] })[] = conducts.filter(
    (conduct) => conduct.type === type
  );

  arr = arr.sort(
    (a, b) => parseDate(a.date).getTime() - parseDate(b.date).getTime()
  );

  const recruits = company.recruits.sort(
    (a, b) => parseInt(a.id.substring(1)) - parseInt(b.id.substring(1))
  );

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
