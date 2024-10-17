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
import EditStrength from "@/components/edit-strength";
import { getParticipants } from "@/lib/actions";
import ConductingStructure from "@/components/conducting-structure";

const Page = async ({ params }: { params: { conductId: string } }) => {
  const conduct = await prisma.conduct.findUnique({
    where: { id: parseInt(params.conductId) },
    include: {
      recruits: true,
      company: { include: { recruits: true, commanders: true } },
    },
  });

  if (!conduct) {
    return (
      <div className="h-screen flex justify-center items-center">
        This conduct does not exist
      </div>
    );
  }

  const participants = await getParticipants(conduct.id);

  const commanders =
    conduct.supervisingId && conduct.conductingId && conduct.chiefSafetyId
      ? await prisma.commander.findMany({
          where: {
            id: {
              in: [
                conduct.supervisingId,
                conduct.conductingId,
                conduct.chiefSafetyId,
              ],
            },
          },
        })
      : ["None", "None", "None"];

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
        <Chunk
          title="Supervising"
          body={
            typeof commanders[0] === "string"
              ? commanders[0]
              : commanders[0].name
          }
        />
        <Chunk
          title="Conducting"
          body={
            typeof commanders[1] === "string"
              ? commanders[1]
              : commanders[1].name
          }
        />
        <Chunk
          title="Chief Safety"
          body={
            typeof commanders[2] === "string"
              ? commanders[2]
              : commanders[2].name
          }
        />
        <Chunk
          title="Participating Strength"
          body={`${conduct.recruits.length}/${conduct.company.recruits.length}`}
        />
      </div>
      <div className="w-full flex justify-end gap-2 items-center mb-4">
        <ConductingStructure
          conductId={conduct.id}
          commanders={conduct.company.commanders}
        />
        <EditStrength conduct={conduct} />
      </div>
      <ParticipatingTable
        participants={participants}
        fallouts={conduct.fallouts}
      />
    </PageWrapper>
  );
};

export default Page;
