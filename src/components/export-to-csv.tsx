"use client";

import { Company, Conduct, ConductType, Recruit } from "@prisma/client";
import { Button } from "./ui/button";
import { downloadCSV, generateCSV, sortForConductTable } from "@/lib/utils";

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

  const csv = generateCSV(recruits, arr);

  return (
    <Button
      size={"sm"}
      variant={"secondary"}
      onClick={() => {
        downloadCSV(csv, "conduct");
      }}
    >
      Export to CSV
    </Button>
  );
}
