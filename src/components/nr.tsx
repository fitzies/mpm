"use client";

import DataTable from "./data-table";
import { DataTableType } from "../../types";
import { useState } from "react";
import { Company } from "@prisma/client";

export default function NR({
  data,
  company,
}: {
  data: DataTableType;
  company: Company;
}) {
  const [selected, setSelected] = useState<number[]>([]);

  const getSelected = () => {
    return data.rows.filter((_, index) => selected.includes(index));
  };

  return (
    <>
      <div className="flex pb-4 pt-2 justify-end">
        {/* <Button
          onClick={() => setIsDialogOpen(true)}
          disabled={getSelected().length <= 0}
        >
          Book in/out
        </Button>
        <CustomDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          title={`Are you sure you want to book out ${
            getSelected().length
          } recruits`}
          description={`This will not book out recruits currently on MC or Out of Camp for other reasons. This recruit will automatically be booked in on ${dateToStringDate(
            new Date(new Date().setDate(new Date().getDate() + 1))
          )}`}
          action={handleBookOut} // Reference the handler directly
          btn="Submit"
        /> */}
      </div>
      <DataTable data={data} selected={selected} setSelected={setSelected} />
    </>
  );
}
