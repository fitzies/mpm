"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Company, ConductType } from "@prisma/client";
import { addSpacesToEnumValue } from "@/lib/utils";
import { createConduct } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";

const NewConduct = ({ company }: { company: Company }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [conduct, setConduct] = useState<{
    title: string;
    type: ConductType;
    date: string;
  }>({ title: "", type: "EnduranceRun", date: "" });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const { toast } = useToast();

  const formFilled = () => {
    return conduct.title.length > 3 && conduct.date.length === 6;
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>+</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a new conduct</DialogTitle>
            <DialogDescription>
              Fill in the necessary details to create a conduct for your
              company.
            </DialogDescription>
          </DialogHeader>
          <form
            className="grid gap-4 py-4"
            action={async (data: FormData) => {
              try {
                setLoading(() => true);
                const res = await createConduct(data);
                if (res) {
                  toast({
                    title: `Conduct created`,
                    description: `${conduct.title} was successfully created`,
                  });
                  setOpen(() => false);
                }
              } catch (error: unknown) {
                if (error instanceof Error) {
                  setError(() => error.message); // Safely access the message
                } else {
                  setError(() => "An unknown error occurred"); // Fallback for unknown error types
                }
              } finally {
                setLoading(() => false);
              }
            }}
          >
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Conduct Title
              </Label>
              <Input
                name="title"
                placeholder="Distance Interval 6"
                className="col-span-3"
                onChange={(e) =>
                  setConduct((prev) => {
                    return { ...prev, title: e.target.value };
                  })
                }
                value={conduct.title}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Type</Label>
              <Select
                name="type"
                onValueChange={(value: ConductType) =>
                  setConduct((prev) => {
                    return { ...prev, type: value }; // Ensure value is of type ConductType
                  })
                }
                value={conduct.type}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Type of conduct" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(ConductType).map((type) => {
                    return (
                      <SelectItem value={type} key={type}>
                        {addSpacesToEnumValue(type)}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Date
              </Label>
              <Input
                name="date"
                placeholder="161024"
                className="col-span-3"
                value={conduct.date}
                onChange={(e) =>
                  setConduct((prev) => {
                    return { ...prev, date: e.target.value };
                  })
                }
              />
            </div>
            <Button type="submit" disabled={!formFilled() || loading}>
              {loading ? "..." : "Create"}
            </Button>
            {error.length > 0 ? (
              <p className="text-sm text-red-400">{error}</p>
            ) : null}
            <input className="hidden" name="companyId" value={company.id} />
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewConduct;
