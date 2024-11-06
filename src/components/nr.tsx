"use client";

import DataTable from "./data-table";
import { DataTableType } from "../../types";
import { useState } from "react";
import { Company } from "@prisma/client";
import { Button } from "./ui/button";
import { CustomDialog } from "./custom-dialog";
import { createRecruits, deleteRecruits } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";

export default function NR({
  data,
  company,
}: {
  data: DataTableType;
  company: Company;
}) {
  const [selected, setSelected] = useState<number[]>([]);
  const [newRecruits, setNewRecruits] = useState<string>("");

  const { toast } = useToast();

  const getSelected = () => {
    return data.rows.filter((_, index) => selected.includes(index));
  };

  const pattern = /^[A-Z]\d{4} ([A-Z]+ ?)+(\n[A-Z]\d{4} ([A-Z]+ ?)+)*$/;

  return (
    <div>
      <div className="w-full flex justify-end items-center gap-2 mb-4">
        <CustomDialog
          trigger={
            <Button
              size={"sm"}
              variant={"destructive"}
              disabled={selected.length <= 0}
            >
              Remove recruit
            </Button>
          }
          title={`Are you sure you want to delete ${selected.length} recruit(s)`}
          btn={
            <Button variant={"destructive"} className="w-full">
              Delete {selected.length} recruit(s)
            </Button>
          }
          description="This will permanently remove all instances of the selected recruit(s), including their statuses and history."
          loadingBtn={
            <Button variant={"destructive"} className="w-full">
              ...
            </Button>
          }
          action={async (data) => {
            const res = await deleteRecruits(data);
            if (res === true) {
              toast({ title: "Recruits have been deleted" });
            }
          }}
        >
          <input
            className="hidden"
            name="recruits"
            value={JSON.stringify(getSelected())}
          />
        </CustomDialog>
        <CustomDialog
          title="Add new recruits"
          description="Copy and paste your recruits name and 4D from a spreadsheet to insert them. Please make sure their names are all uppercase."
          trigger={<Button size={"sm"}>Add recruit(s)</Button>}
          action={async (data) => {
            const res = await createRecruits(data);
            if (res === true) {
              toast({ title: "Recruits have been added" });
            }
          }}
          btn={
            <Button className="w-full" disabled={!pattern.test(newRecruits)}>
              Create
            </Button>
          }
          loadingBtn={
            <Button className="w-full" disabled>
              ...
            </Button>
          }
        >
          <textarea
            name="new-recruits"
            value={newRecruits}
            onChange={(e) => setNewRecruits(() => e.target.value)}
            className="w-full border rounded-xl border-zinc-700 px-4 py-4 mb-2 text-xs"
            placeholder={`T1101\tJOHN DOE\nT1102\tALEX CARUSO`}
          />
          <input
            type="text"
            className="hidden"
            name="company-id"
            value={company.id}
          />
        </CustomDialog>
      </div>
      <DataTable data={data} selected={selected} setSelected={setSelected} />
    </div>
  );
}
