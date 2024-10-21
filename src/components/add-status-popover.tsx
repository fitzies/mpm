import { Commander, Company } from "@prisma/client";
import AddStatus from "./add-status";
import { Bubble } from "./add-status2";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import Bookout from "./book-out";

const AddStatusPopover = ({
  company,
}: {
  company: Company & { commanders: Commander[] };
}) => {
  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button className="absolute right-0">+</Button>
        </PopoverTrigger>
        <PopoverContent className="flex flex-col w-32 !p-1 gap-1">
          <Bubble type="Recruit" />
          {/* <Bubble type="Commander" /> */}
          <AddStatus
            commanders={company.commanders}
            company={company.name}
            justCommander
          />
          <Bookout company={company} />
        </PopoverContent>
      </Popover>
    </>
  );
};

export default AddStatusPopover;
