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

const EditStrength = ({ conduct }: { conduct: ConductWithRecruits }) => {
  const [allRecruits, setAllRecruits] = useState<boolean>(true);
  const [participants, setParticipants] = useState<string>("");
  const [fallOuts, setFallOuts] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const isValid = () => {
    // Updated pattern: Allow single `V1101` and multiple entries separated by commas
    const pattern = /^[A-Za-z]\d{4}(, ?[A-Za-z]\d{4})*$/;

    const isParticipantsValid =
      (participants.length > 0 && pattern.test(participants)) ||
      participants.length === 0;
    const isFallOutsValid =
      (fallOuts.length > 0 && pattern.test(fallOuts)) || fallOuts.length === 0;

    // Return true only if both are valid
    return isParticipantsValid && isFallOutsValid;
  };

  return (
    <Dialog>
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
              await editStrength(data);
            } catch (error) {
              if (error instanceof Error) {
                setError(() => error.message);
              } else {
                setError(() => "There appears to be an issue");
              }
            }
          }}
        >
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              All recruits
            </Label>
            <Switch
              checked={allRecruits}
              onCheckedChange={setAllRecruits}
              name="all-recruits"
              value={allRecruits.toString()}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="participants" className="text-right">
              Participated
            </Label>
            <Input
              disabled={allRecruits}
              name="participants"
              className="col-span-3"
              placeholder="V1101, V1102"
              value={participants}
              onChange={(e) => setParticipants(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="fallOuts" className="text-right">
              Fall outs
            </Label>
            <Input
              disabled={!allRecruits}
              name="fall-outs"
              placeholder="V1401, V2102"
              className="col-span-3"
              value={fallOuts}
              onChange={(e) => setFallOuts(e.target.value)}
            />
          </div>
          <Button className="mt-2" disabled={!isValid()} type="submit">
            Submit
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
