import Chunk from "@/components/chunk";
import PageWrapper from "@/components/page-wrapper";
import prisma from "@/lib/prisma";
import { Upload } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import ParticipatingTable from "@/components/participating-table";
import { Button } from "@/components/ui/button";
import EditStrength from "@/components/edit-strength";
import { getParticipants } from "@/lib/actions";

const Page = async ({ params }: { params: { conductId: string } }) => {
  const conduct = await prisma.conduct.findUnique({
    where: { id: parseInt(params.conductId) },
    include: { recruits: true, company: { include: { recruits: true } } },
  });

  if (!conduct) {
    return (
      <div className="h-screen flex justify-center items-center">
        This conduct does not exist
      </div>
    );
  }

  const participants = await getParticipants(conduct.id)

  return (
    <PageWrapper className="!py-24 !px-12 flex flex-col">
      <div className="w-full flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{conduct.title}</h1>
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger>
              <Upload className="text-zinc-400 hover:text-white cursor-pointer duration-150" />
            </PopoverTrigger>
            <PopoverContent className="text-sm">
              Upload AI (Coming soon)
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="grid lg:grid-cols-4 grid-cols-1 w-full gap-3 mb-10">
        <Chunk title="Supervising" body="None" />
        <Chunk title="Conducting" body="None" />
        <Chunk title="Chief Safety" body="None" />
        <Chunk
          title="Participating Strength"
          body={`${conduct.recruits.length}/${conduct.company.recruits.length}`}
        />
      </div>
      <div className="w-full flex justify-end gap-2 items-center mb-4">
        <Button size={"sm"} variant={"secondary"}>
          Conducting
        </Button>
        <EditStrength conduct={conduct} />
      </div>
      <ParticipatingTable participants={participants} />
    </PageWrapper>
  );
};

export default Page;
