"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { ConductWithRecruits } from "../../types";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Switch } from "./ui/switch";
import { editStrength } from "@/lib/actions";
import { Conduct } from "@prisma/client";

const EditStrength = ({ conduct }: { conduct: Conduct }) => {
  const [fallOuts, setFallOuts] = useState<string>(conduct.fallouts.join(", "));

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [open, setOpen] = useState(false);

  const isValid = () => {
    // Updated pattern: Allow single `V1101` and multiple entries separated by commas
    const pattern = /^[A-Za-z]\d{4}(, ?[A-Za-z]\d{4})*$/;

    const isFallOutsValid =
      (fallOuts.length > 0 && pattern.test(fallOuts)) || fallOuts.length === 0;

    // Return true only if both are valid
    return isFallOutsValid;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button size={"sm"} asChild>
        <DialogTrigger>Edit Strength</DialogTrigger>
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Strength</DialogTitle>
          <DialogDescription>
            Only include those who fell out, recruits on status will
            automatically be excluded from the conduct
          </DialogDescription>
        </DialogHeader>
        <form
          className="grid gap-4 pt-4"
          action={async (data) => {
            try {
              setLoading(() => true);
              const res = await editStrength(data);
              if (res === true) {
                setOpen(() => false);
              }
            } catch (error) {
              if (error instanceof Error) {
                setError(() => error.message);
              } else {
                setError(() => "There appears to be an issue");
              }
            } finally {
              setLoading(() => false);
            }
          }}
        >
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="fallOuts" className="text-right">
              Fall outs
            </Label>
            <Input
              name="fall-outs"
              placeholder="V1401, V2102"
              className="col-span-3"
              value={fallOuts}
              onChange={(e) => setFallOuts(e.target.value)}
            />
          </div>
          <Button
            className="mt-2"
            disabled={!isValid() || loading}
            type="submit"
          >
            {loading ? "..." : "Submit"}
          </Button>
          {error.length > 0 ? (
            <p className="text-sm text-red-400">{error}</p>
          ) : null}
          <input className="hidden" name="date" value={conduct.date} />
          <input className="hidden" name="conductId" value={conduct.id} />
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditStrength;
