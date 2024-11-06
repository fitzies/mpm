import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "./ui/textarea";
import { useState } from "react";
import { Button } from "./ui/button";
import { Company } from "@prisma/client";
import { serverGenerateParadeStateText } from "@/lib/actions";

export default function GenerateParadeStateText({
  company,
}: {
  company: Company;
}) {
  const [paradeMessage, setParadeMessage] = useState<string>("");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <form
          action={async () => {
            const data = new FormData();
            data.append("company", JSON.stringify(company));
            const res = await serverGenerateParadeStateText(data);
            if (res === "Error") {
              setParadeMessage(
                () => "There was an error. Please refresh and try again."
              );
              return;
            } else {
              setParadeMessage(() => res.join("\n\n"));
            }
          }}
        >
          <Button>Generate</Button>
        </form>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate your parade state</DialogTitle>
          <DialogDescription>
            Generate the current parade state into a text format for sharing
          </DialogDescription>
        </DialogHeader>
        <Textarea className="mb-2" value={paradeMessage} />
        <Button>Copy</Button>
      </DialogContent>
    </Dialog>
  );
}
