"use client";

import { SelectAppointment } from "./select-appointment";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { setConductingStructure } from "@/lib/actions";
import { useState } from "react";
import { Commander } from "@prisma/client";
import { useToast } from "@/hooks/use-toast";

export default function ConductingStructure({
  conductId,
  commanders,
}: {
  conductId: number;
  commanders: Commander[];
}) {
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const { toast } = useToast();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size={"sm"} variant={"secondary"}>
          Conducting
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change the conducting structure</DialogTitle>
          <DialogDescription>
            Change the supervising, conducting, and chief safety
          </DialogDescription>
        </DialogHeader>
        <form
          className="grid gap-4 pt-4"
          action={async (data: FormData) => {
            try {
              setLoading(() => true);
              const res = await setConductingStructure(data);
              if (res) {
                toast({ title: "Conducting structure updated" });
                setOpen(() => false);
              }
            } catch (error) {
              if (error instanceof Error) {
                setError(() => error.message);
              } else {
                setError(() => "Something went wrong");
              }
            } finally {
              setLoading(() => false);
            }
          }}
        >
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="fallOuts" className="text-right">
              Supervising
            </Label>
            <SelectAppointment commanders={commanders} name="supervising" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="fallOuts" className="text-right">
              Conducting
            </Label>
            <SelectAppointment commanders={commanders} name="conducting" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="fallOuts" className="text-right">
              Chief Safety
            </Label>
            <SelectAppointment commanders={commanders} name="chief-safety" />
          </div>
          <Button>Submit</Button>
          {error ? <p className="text-sm text-red-400">{error}</p> : null}
          <input className="hidden" name="conductId" value={conductId} />
        </form>
      </DialogContent>
    </Dialog>
  );
}
