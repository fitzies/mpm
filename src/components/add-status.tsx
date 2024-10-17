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
import { Commander, StatusType } from "@prisma/client";
import { useState } from "react";
import { handleCreateStatus } from "@/lib/actions";
import { Switch } from "./ui/switch";

const AddStatus = ({
  company,
  commanders,
}: {
  company: string;
  commanders: Commander[];
}) => {
  const [open, setOpen] = useState<boolean>();
  const [error, setError] = useState<string>();

  const [isCommander, setIsCommander] = useState<boolean>(false);
  const [commander, setCommander] = useState<string>();

  const [fourD, setFourD] = useState<string>("");
  const [status, setStatus] = useState<string>();
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const excludedStatuses = ["MCP1", "MCP2", "LDP1", "LDP2", "ReportSick", "Physio"];

  const statusTypes = Object.values(StatusType).filter(
    (status) => !excludedStatuses.includes(status)
  );

  const formFilled = () => {
    return (
      (fourD.length === 5 || commander) &&
      startDate.length === 6 &&
      endDate.length === 6
    );
  };

  const openDialog = () => {
    setOpen(() => true);
  };

  const handleSubmitForm = async (data: FormData) => {
    const res = await handleCreateStatus(data);
    if (res !== true) {
      setError(() => res);
    } else {
      setOpen(() => false);
      setFourD(() => "");
      setCommander(() => "");
      setStatus(() => "");
      setStartDate(() => "");
      setEndDate(() => "");
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(() => v);
      }}
    >
      <DialogTrigger asChild>
        <Button className="absolute right-0" onClick={openDialog}>
          +
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a new status</DialogTitle>
          <DialogDescription>
            Please provide the necessary information to create a new status
          </DialogDescription>
        </DialogHeader>
        <form
          action={async (data: FormData) => {
            handleSubmitForm(data);
          }}
        >
          <input
            type="text"
            className="hidden"
            name="company"
            value={company}
          />

          <div className="flex flex-col gap-4 py-4 items-start w-full">
            <div className="flex items-center gap-12">
              {!isCommander ? (
                <Label htmlFor="4d">4d</Label>
              ) : (
                <Label htmlFor="CR">CR</Label>
              )}
              {!isCommander ? (
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
              ) : (
                <Select
                  name="commander"
                  value={commander}
                  onValueChange={(e) => setCommander(() => e)}
                >
                  <SelectTrigger className="w-2/3">
                    <SelectValue placeholder="Choose" />
                  </SelectTrigger>
                  <SelectContent>
                    {commanders.map((commander) => {
                      return (
                        <SelectItem
                          value={commander.id.toString()}
                          key={commander.id.toString()}
                        >
                          {commander.name}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              )}
              <div className="flex gap-2 items-center lg:absolute lg:right-6">
                <p className="text-sm text-zinc-400">Commander</p>
                <Switch
                  checked={isCommander}
                  onCheckedChange={setIsCommander}
                />
              </div>
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
                          : type === "Other"
                          ? "Out of Camp"
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
                  type="number"
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
                  type="number"
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
          <p className="text-sm text-red-500">{error}</p>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddStatus;
