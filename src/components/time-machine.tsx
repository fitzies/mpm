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
import { History } from "lucide-react";
import { Input } from "./ui/input";
import { useState } from "react";
import Link from "next/link";

export default function TimeMachine({ company }: { company: string }) {
  const [value, setValue] = useState<string>("");

  const isValid = () => {
    const ddmmyyRegex = /^(\d{2})(\d{2})(\d{2})$/;

    if (value.length !== 6 || value === "" || !ddmmyyRegex.test(value)) {
      return false;
    }

    return true;
  };

  return (
    <Dialog>
      <DialogTrigger>
        <Button variant={"secondary"} className="!px-2">
          <History className="scale-75 text-zinc-400" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Time Machine</DialogTitle>
          <DialogDescription>
            Choose a date and see all statuses that were involved with that
            respective date
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <Input
            type="text"
            placeholder="010124"
            value={value}
            onChange={(e) => setValue(() => e.target.value)}
            maxLength={6}
          />
          <Button className="w-full" disabled={!isValid()}>
            <Link
              href={`/company/${company}/time-machine?date=${value}`}
              className="w-full"
            >
              Submit
            </Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
