import { Ellipsis } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { TableCell } from "./ui/table";
import {
  ActiveStatusWithCommander,
  ActiveStatusWithRecruit,
} from "../../types";
import { Company } from "@prisma/client";
import { handleDeleteStatus } from "@/lib/actions";

const CellEdit = ({
  status,
  company,
}: {
  status: ActiveStatusWithRecruit | ActiveStatusWithCommander;
  company: Company;
}) => {
  return (
    <TableCell className="text-right">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <Ellipsis className="h-4 w-4" />
            <span className="sr-only">Actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {/* <DropdownMenuItem className="cursor-pointer">Edit</DropdownMenuItem> */}
          <form action={handleDeleteStatus}>
            <input className="hidden" name="statusId" value={status.id} />
            <input
              className="hidden"
              name="companyName"
              value={company.name.toLowerCase()}
            />
            <DropdownMenuItem className="cursor-pointer" asChild>
              <button className="w-full">Delete</button>
            </DropdownMenuItem>
          </form>
        </DropdownMenuContent>
      </DropdownMenu>
    </TableCell>
  );
};

export default CellEdit;
