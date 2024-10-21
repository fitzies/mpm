"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Checkbox } from "./ui/checkbox";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { Company } from "@prisma/client";
import { bookOutRecruits } from "@/lib/actions";
import { dateToStringDate, getDate, parseDate } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function Bookout({ company }: { company: Company }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const [bookouts, setBookouts] = useState<string>("");
  const [wholeCompany, setWholeCompany] = useState<boolean>(false);

  const { toast } = useToast();

  const isValid = () => {
    // Updated pattern: Allow single `V1101` and multiple entries separated by commas
    const pattern = /^[A-Za-z]\d{4}(, ?[A-Za-z]\d{4})*$/;

    if (bookouts.length <= 0) return false;

    const isFallOutsValid =
      (bookouts.length > 0 && pattern.test(bookouts)) || bookouts.length === 0;

    // Return true only if both are valid
    return isFallOutsValid;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={"ghost"}
          size={"sm"}
          className="text-sm flex justify-start"
        >
          Book out
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Enter in the 4Ds of those you wish to book out
          </DialogTitle>
          <DialogDescription>
            This will book recruits from {getDate()} to{" "}
            {dateToStringDate(
              new Date(new Date().setDate(new Date().getDate() + 2))
            )}
          </DialogDescription>
        </DialogHeader>
        <form
          className="grid gap-4 py-2"
          action={async (data) => {
            try {
              const res = await bookOutRecruits(data);
              if (res === true) {
                toast({ title: "Book out was successful" });
                setOpen(() => false);
              }
            } catch (error) {
              if (error instanceof Error) {
                setError(() => error.message);
              } else {
                setError(
                  () =>
                    "Something went really wrong. Please refresh and try again."
                );
              }
            }
          }}
        >
          <div className="my-2 grid grid-cols-6 items-center gap-4">
            <Label htmlFor="4ds" className="text-right">
              4Ds
            </Label>
            <Input
              name="4ds"
              className="col-span-4"
              placeholder="V1401, V2102"
              onChange={(e) => setBookouts(() => e.target.value)}
              value={bookouts}
              disabled={wholeCompany}
            />
            <HoverCard>
              <HoverCardTrigger>
                <Checkbox
                  checked={wholeCompany}
                  onCheckedChange={(e) => setWholeCompany((prev) => !prev)}
                  name="whole-company"
                  value={wholeCompany.toString()}
                />
              </HoverCardTrigger>
              <HoverCardContent className="text-sm">
                Book out the entire company
              </HoverCardContent>
            </HoverCard>
          </div>
          <Button disabled={(!isValid() && !wholeCompany) || loading}>
            Book out
          </Button>
          <input name="company-id" value={company.id} className="hidden" />
        </form>
      </DialogContent>
    </Dialog>
  );
}
