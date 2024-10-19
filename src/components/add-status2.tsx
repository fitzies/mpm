"use client";

import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useEffect, useState } from "react";
import { StatusType } from "@prisma/client";
import axios from "axios";
import { SelectStatus } from "./select-status";
import { X } from "lucide-react";
import { addMultipleStatuses } from "@/lib/actions";

export const Bubble = ({ type }: { type: "Recruit" | "Commander" }) => {
  const [id, setId] = useState("");
  const [recruit, setRecruit] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const [open, setOpen] = useState(false);

  const [statusCount, setStatusCount] = useState(1);

  const increaseCount = () => {
    if (statusCount >= 3) {
      return;
    }
    setStatusCount((prev) => prev + 1);
  };

  const decreaseCount = () => {
    if (statusCount <= 1) {
      return;
    }
    setStatusCount((prev) => prev - 1);
  };

  useEffect(() => {
    const fetchRecruit = async () => {
      if (id && id.length === 5) {
        // Only fetch if id is present
        try {
          const response = await axios.get(`/api/recruit?id=${id}`);
          setRecruit(() => response.data.recruit.name);
          setError(() => "");
        } catch (error) {
          if (error instanceof Error) {
            setError(() => "Recruit doesn't exist");
          } else {
            setError("Something went wrong");
          }
        }
      } else {
        setRecruit(() => "");
      }
    };

    fetchRecruit();
  }, [id]);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
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
            <DialogTitle>{`Add a new ${type.toLowerCase()} status`}</DialogTitle>
            <DialogDescription>
              Please provide the necessary information to create a new status
            </DialogDescription>
          </DialogHeader>
          <form
            action={async (data) => {
              try {
                const res = await addMultipleStatuses(data);
                if (res === true) {
                  setOpen(() => false);
                }
              } catch (error) {
                if (error instanceof Error) {
                  setError(() => error.message);
                }
                setError(() => "Something went wrong");
              }
            }}
          >
            <div className="grid gap-4 py-2">
              <div className="grid grid-cols-6 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  4D
                </Label>
                <Input
                  name="4d"
                  className="col-span-4"
                  value={id}
                  onChange={(e) => setId(e.target.value)} // Update ID when input changes
                  maxLength={5}
                />
              </div>
              <div className="grid grid-cols-6 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Name
                </Label>
                <Input
                  name="name"
                  className="col-span-4 !border-transparent outline-none text-zinc-600 focus-visible:outline-none"
                  value={error === "Recruit doesn't exist" ? "" : recruit} // Show recruit's name
                  readOnly // Make it read-only if you don't want the user to edit the name
                />
              </div>
            </div>
            {Array(statusCount)
              .fill(0)
              .map((status, index) => (
                <NewStatus
                  key={status}
                  index={index}
                  increaseCount={increaseCount}
                  decreaseCount={decreaseCount}
                  current={statusCount}
                />
              ))}
            <Button className="mt-4 w-full">Submit</Button>
            <p className="text-sm text-red-400 mt-4">{error}</p>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

function NewStatus({
  index,
  increaseCount,
  decreaseCount,
  current,
}: {
  index: number;
  increaseCount: () => void;
  decreaseCount: () => void;
  current: number;
}) {
  const [status, setStatus] = useState<StatusType | null>();

  return (
    <div className="border-2 border-zinc-900 rounded-xl grid gap-4 py-4 my-2">
      <div className="absolute right-10 cursor-pointer" onClick={decreaseCount}>
        <X className="scale-75 text-zinc-400 hover:text-white" />
      </div>
      <SelectStatus index={index} />
      <div className="grid grid-cols-6 items-center gap-6 lg:ml-0 ml-4">
        <Label htmlFor="username" className="text-right">
          Date
        </Label>
        <Input
          name={`start-date-${index}`}
          className="col-span-2"
          placeholder="161024"
        />
        <Input
          name={`end-date-${index}`}
          className="col-span-2"
          placeholder="221024"
        />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:ml-0 ml-4">
        {index === 2 || current > index + 1 ? null : (
          <Button
            variant={"secondary"}
            className="mx-5"
            onClick={increaseCount}
          >
            Another
          </Button>
        )}
      </div>
    </div>
  );
}
