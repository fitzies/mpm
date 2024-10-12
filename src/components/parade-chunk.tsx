"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import { getCountdown, getDate } from "@/lib/utils";
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
import { useToast } from "@/hooks/use-toast";

const SubmitParadeStateDialog = ({ company }: { company: Company }) => {
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const { toast } = useToast();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button size="sm" asChild>
        <DialogTrigger>Continue</DialogTrigger>
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure you want to submit.</DialogTitle>
          <DialogDescription>
            Your Parade State will be forwarded to be publicly viewed.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <form
            className="flex items-center justify-between w-full"
            onSubmit={async (e) => {
              e.preventDefault(); // Prevent default form submission
              setLoading(true); // Set loading state before async call
              const data = new FormData(e.target as HTMLFormElement);
              try {
                const res = await handleSubmitParadeState(data);
                if (res === true) {
                  console.log("Submitted successfully");
                  setLoading(false); // Set loading to false after success
                  toast({
                    title: "Parade State Submitted",
                    description: `${
                      company.name
                    }'s Parade State has been submitted for ${getDate()}`,
                  });
                  setOpen(() => false);
                } else {
                  setError(res); // Set error if submission fails
                  setLoading(false); // Set loading to false after error
                }
              } catch (error) {
                console.error(error);
                setError("Submission failed"); // Handle any unexpected errors
                setLoading(false); // Set loading to false in case of errors
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
            <Button disabled={loading}>{loading ? "..." : "Confirm"}</Button>
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
        {/* <p className="text-sm text-zinc-400 italic">
          Will auto-submit in {countdown}
        </p> */}
      </CardContent>
    </Card>
  );
};

export default ParadeChunk;
