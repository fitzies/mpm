"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

const Bubble = ({ type }: { type: "Recruit" | "Commander" | "Multiple" }) => {
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant={"ghost"}
            size={"sm"}
            className="text-sm flex justify-start"
          >
            {type}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {type !== "Multiple"
                ? `Add a new ${type.toLowerCase()} status`
                : `Add ${type.toLowerCase()} statuses`}
            </DialogTitle>
            <DialogDescription>
              Please provide the necessary information to create a new status
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

const AddStatus = () => {
  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button className="absolute right-0">+</Button>
        </PopoverTrigger>
        <PopoverContent className="flex flex-col w-32 !p-1 gap-1">
          <Bubble type="Recruit" />
          <Bubble type="Commander" />
          <Bubble type="Multiple" />
        </PopoverContent>
      </Popover>
    </>
  );
};

export default AddStatus;
