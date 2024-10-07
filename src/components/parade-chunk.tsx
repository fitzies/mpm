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

const ParadeChunk = ({ company }: { company: string }) => {
  const [countdown, setCountdown] = useState<string>("");

  useEffect(() => {
    const updateCountdown = () => {
      const { hours, minutes } = getCountdown();
      setCountdown(
        `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}`
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
        <CardDescription>Submit your parade state</CardDescription>
      </CardHeader>
      <CardContent className="flex gap-4 items-center">
        <Button size="sm">Submit</Button>
        {/* <Button asChild size="sm" className="gap-1" variant={"secondary"}>
          <Link href={`${company}/statuses`}>Edit Statuses</Link>
        </Button> */}
        <p className="text-sm text-zinc-400 italic">
          Will auto-submit in {countdown}
        </p>
      </CardContent>
    </Card>
  );
};

export default ParadeChunk;
