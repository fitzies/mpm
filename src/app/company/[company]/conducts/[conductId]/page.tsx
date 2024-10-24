import Chunk from "@/components/chunk";
import PageWrapper from "@/components/page-wrapper";
import prisma from "@/lib/prisma";
import { Trash, Upload } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import ParticipatingTable from "@/components/participating-table";
import EditStrength from "@/components/edit-strength";
import { deleteConduct, getParticipants } from "@/lib/actions";
import ConductingStructure from "@/components/conducting-structure";
import { formatString, parseDate } from "@/lib/utils";
import { CustomDialog } from "@/components/custom-dialog";
import { Button } from "@/components/ui/button";
import Search from "@/components/search";

const Page = async ({
  params,
  searchParams,
}: {
  params: { conductId: string };
  searchParams: { query?: string; page?: string };
}) => {
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

  const query = searchParams?.query || "";

  let commanders = {
    supervising: "None",
    conducting: "None",
    chiefSafety: "None",
  };

  if (conduct.supervisingId && conduct.conductingId && conduct.chiefSafetyId) {
    const commanderIds = [
      conduct.supervisingId,
      conduct.conductingId,
      conduct.chiefSafetyId,
    ];

    const commandersData = await prisma.commander.findMany({
      where: {
        id: { in: commanderIds },
      },
    });

    commanders = {
      supervising:
        commandersData.find((c) => c.id === conduct.supervisingId)?.name ??
        "None",
      conducting:
        commandersData.find((c) => c.id === conduct.conductingId)?.name ??
        "None",
      chiefSafety:
        commandersData.find((c) => c.id === conduct.chiefSafetyId)?.name ??
        "None",
    };
  }

  return (
    <PageWrapper className="!py-24 !px-12 flex flex-col">
      <div className="w-full flex justify-between items-center mb-6">
        <div className="flex lg:flex-row flex-col lg:items-center lg:gap-4 items-start">
          <h1 className="text-3xl font-bold">{conduct.title}</h1>
          <p className="text-sm text-zinc-400">{formatString(conduct.date)}</p>
        </div>
        <div className="flex items-center gap-3">
          <CustomDialog
            trigger={
              <Trash className="text-zinc-400 hover:text-white cursor-pointer duration-150" />
            }
            title="Are you absolutely sure?"
            description=" This action cannot be undone. This will permanently delete this conduct and remove all data about it from our servers."
            btn={<Button variant={"destructive"}>Delete</Button>}
            action={deleteConduct}
          >
            <input className="hidden" name="conductId" value={conduct.id} />
          </CustomDialog>
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
        <Chunk title="Supervising" body={commanders.supervising} />
        <Chunk title="Conducting" body={commanders.conducting} />
        <Chunk title="Chief Safety" body={commanders.chiefSafety} />
        <Chunk
          title="Participating Strength"
          body={`${conduct.recruits.length}/${conduct.company.recruits.length}`}
        />
      </div>
      <div className="w-full flex justify-between gap-2 items-center mb-4">
        <Search notAbsolute />
        <div className="flex gap-2">
          <ConductingStructure
            conductId={conduct.id}
            commanders={conduct.company.commanders}
          />
          <EditStrength conduct={conduct} />
        </div>
      </div>
      <ParticipatingTable
        participants={participants}
        fallouts={conduct.fallouts}
        query={query}
        conduct={conduct}
      />
    </PageWrapper>
  );
};

export default Page;
