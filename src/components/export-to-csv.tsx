"use client";

import { Company, Conduct, ConductType, Recruit } from "@prisma/client";
import { Button } from "./ui/button";
import { downloadExcel, generateExcel, sortForConductTable } from "@/lib/utils";

export default function ExportToCsv({
  type,
  conducts,
  company,
}: {
  type: ConductType;
  conducts: (Conduct & { recruits: Recruit[] })[];
  company: Company & { recruits: Recruit[] };
}) {
  const { arr, recruits } = sortForConductTable(conducts, company, type);

  return (
    <Button
      size={"sm"}
      variant={"secondary"}
      onClick={() => {
        const workbook = generateExcel(recruits, arr);
        downloadExcel(workbook, "conduct.xlsx");
      }}
    >
      Export to CSV
    </Button>
  );
}
