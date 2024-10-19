"use client";

import { StatusType } from "@prisma/client";
import { useState } from "react";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Input } from "./ui/input";

export const SelectStatus = ({ index }: { index: number }) => {
  const [select, setSelect] = useState<StatusType>();

  const excludedStatuses: StatusType[] = [
    "MCP1",
    "LDP1",
    "MCP2",
    "LDP2",
    "ReportSick",
    "Physio",
  ];
  const statuses = Object.values(StatusType).filter(
    (status) => !excludedStatuses.includes(status)
  );

  return (
    <>
      <div className="grid grid-cols-6 items-center gap-4 lg:ml-0 ml-4">
        <Label className="text-right">Status</Label>
        <Select
          name={`status-${index}`}
          value={select}
          onValueChange={(value) => setSelect(value as StatusType)}
        >
          <SelectTrigger className="col-span-4">
            <SelectValue placeholder="Select a status" />
          </SelectTrigger>
          <SelectContent>
            {statuses.map((status) => {
              return (
                <SelectItem value={status} key={status}>
                  {status === "Other"
                    ? "Out of Camp"
                    : status === "CustomStatus"
                    ? "Custom"
                    : status}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-6 items-center gap-4 lg:ml-0 ml-4">
        <Label htmlFor="remarks" className={`text-right`}>
          Specify
        </Label>
        <Input
          name={`remarks-${index}`}
          className="col-span-4"
          disabled={select === "LD" || select === "MC"}
        />
      </div>
    </>
  );
};
