"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusType } from "@prisma/client";
import { useState } from "react";
import { handleCreateStatus } from "@/lib/actions";

const AddStatus = ({ company }: { company: string }) => {
  const [fourD, setFourD] = useState<string>("");
  const [status, setStatus] = useState<string>();
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const excludedStatuses = ["MCP1", "MCP2", "LDP1", "LDP2"];

  const statusTypes = Object.values(StatusType).filter(
    (status) => !excludedStatuses.includes(status)
  );

  const formFilled = () => {
    return fourD.length === 5 && startDate.length === 6 && endDate.length === 6;
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="absolute right-0">+</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a new status</DialogTitle>
          <DialogDescription>
            Please provide the necessary information to create a new status
          </DialogDescription>
        </DialogHeader>
        <form action={handleCreateStatus}>
          <input
            type="text"
            className="hidden"
            name="company"
            value={company}
          />
          <div className="flex flex-col gap-4 py-4 items-start w-full">
            <div className="flex items-center gap-12">
              <Label htmlFor="4d">4d</Label>
              <Input
                id="4d"
                name="4d"
                placeholder="V1101"
                className="col-span-3"
                value={fourD}
                maxLength={5}
                pattern="[A-Za-z][0-9]{4}"
                title="Please enter one letter followed by four numbers (e.g., V1201)"
                onChange={(e) => setFourD(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-6">
              <Label htmlFor="status">Status</Label>
              <Select
                name="status"
                value={status}
                onValueChange={(e) => setStatus(() => e)}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  {statusTypes.map((type, index) => {
                    return (
                      <SelectItem value={type} key={type + index}>
                        {type === "CustomStatus"
                          ? "Custom"
                          : type === "ReportSick"
                          ? "Report Sick"
                          : type}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              {status === "Other" || status === "CustomStatus" ? (
                <Input
                  id="remarks"
                  name="remarks"
                  placeholder="Please specify"
                  className="col-span-3"
                  minLength={2}
                />
              ) : null}
            </div>
            <div className="flex">
              <div className="flex items-center gap-9">
                <Label htmlFor="start-date">Start</Label>
                <Input
                  id="start-date"
                  name="start-date"
                  placeholder="290924"
                  className="col-span-3"
                  maxLength={6}
                  minLength={6}
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="end-date" className="text-right">
                  End
                </Label>
                <Input
                  id="end-date"
                  name="end-date"
                  placeholder="290924"
                  className="col-span-3"
                  maxLength={6}
                  minLength={6}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
            <Button
              className="w-full mt-4 z-50"
              disabled={!formFilled()}
              type="submit"
            >
              Submit
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddStatus;
