import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";

export default function NewReportSick() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>+</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add new reporting sick personnel</DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
