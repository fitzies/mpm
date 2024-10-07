"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import { getCountdown } from "@/lib/utils";
import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Company } from "@prisma/client";
import { handleSubmitParadeState } from "@/lib/actions";

const SubmitParadeStateDialog = ({ company }: { company: Company }) => {
  const [error, setError] = useState<string>("");

  return (
    <Dialog>
      <Button size="sm" asChild>
        <DialogTrigger>Submit</DialogTrigger>
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure you want to submit.</DialogTitle>
          <DialogDescription>
            <p>
              Once you submit, you will not be able to re-submit for the day.
            </p>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <form
            className="flex items-center justify-between w-full"
            action={async (data: FormData) => {
              const res = await handleSubmitParadeState(data);
              if (res === true) {
                console.log("Submitted successfully");
              } else {
                setError(() => res);
              }
            }}
          >
            <input
              type="text"
              className="hidden"
              value={company.id}
              name="companyId"
            />
            <p className="text-sm text-red-400 text-left">{error}</p>
            <Button>Confirm</Button>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const ParadeChunk = ({ company }: { company: Company }) => {
  const [countdown, setCountdown] = useState<string>("");

  useEffect(() => {
    const updateCountdown = () => {
      const { hours, minutes } = getCountdown();
      setCountdown(
        `${hours.toString().padStart(2, "0")} hours and ${minutes
          .toString()
          .padStart(2, "0")} minutes`
      );
    };

    updateCountdown(); // Initial calculation
    const intervalId = setInterval(updateCountdown, 60000); // Update every minute (60000 ms)

    // Cleanup function to clear the interval
    return () => clearInterval(intervalId);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Parade State</CardTitle>
        <CardDescription>
          Your parade state will auto-submit at 0900hrs everyday, & at 2045hrs
          on Sunday.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex gap-4 items-center justify-between">
        {/* <Button asChild size="sm" className="gap-1" variant={"secondary"}>
          <Link href={`${company}/statuses`}>Edit Statuses</Link>
          </Button> */}
        <SubmitParadeStateDialog company={company} />
        <p className="text-sm text-zinc-400 italic">
          Will auto-submit in {countdown}
        </p>
      </CardContent>
    </Card>
  );
};

export default ParadeChunk;
