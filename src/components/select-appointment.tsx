import { Commander } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export const SelectAppointment = ({
  commanders,
  name,
}: {
  commanders: Commander[];
  name: string;
}) => {
  return (
    <Select name={name}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Choose" />
      </SelectTrigger>
      <SelectContent>
        {commanders.map((commander) => {
          return (
            <SelectItem value={commander.id.toString()} key={commander.id}>
              {commander.name}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};
