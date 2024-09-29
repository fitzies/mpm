import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusType } from "@prisma/client";

const AddStatus = () => {
  const excludedStatuses = ["MCP1", "MCP2", "LDP1", "LDP2"];

  const statusTypes = Object.values(StatusType).filter(
    (status) => !excludedStatuses.includes(status)
  );

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="absolute right-0">+</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a new status</DialogTitle>
            <DialogDescription>
              Please provide the necessary information to create a new status
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4 items-start w-full">
            <div className="flex items-center gap-12">
              <Label htmlFor="4d">4d</Label>
              <Input
                id="4d"
                name="4d"
                placeholder="V1101"
                className="col-span-3"
              />
            </div>
            <div className="flex items-center gap-6">
              <Label htmlFor="status">Status</Label>
              <Select>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="LD" />
                </SelectTrigger>
                <SelectContent>
                  {statusTypes.map((type, index) => {
                    return (
                      <SelectItem value={type} key={type + index}>
                        {type === "CustomStatus"
                          ? "Custom"
                          : type === "ReportSick"
                          ? "Report Sick"
                          : type}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            <div className="flex">
              <div className="flex items-center gap-9">
                <Label htmlFor="start-date">Start</Label>
                <Input
                  id="start-date"
                  name="start-date"
                  placeholder="290924"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="end-date" className="text-right">
                  End
                </Label>
                <Input
                  id="start-date"
                  name="start-date"
                  placeholder="290924"
                  className="col-span-3"
                />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddStatus;
