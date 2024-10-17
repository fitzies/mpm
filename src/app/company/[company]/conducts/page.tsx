import ConductCard from "@/components/conduct-card";
import NewConduct from "@/components/new-conduct";
import PageWrapper from "@/components/page-wrapper";
import Search from "@/components/search";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import Link from "next/link";

const Page = async ({ params }: { params: { company: string } }) => {
  const company = await prisma.company.findFirst({
    where: {
      name:
        params.company.substring(0, 1).toUpperCase() +
        params.company.substring(1),
    },
    include: {
      conducts: {
        include: { recruits: true, company: { include: { recruits: true } } },
      },
    },
  });

  if (!company) {
    return (
      <div className="h-screen flex items-center justify-center">
        Company not found...
      </div>
    );
  }

  const conducts = company.conducts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <PageWrapper className="flex flex-col justify-center items-center">
      <div className="flex justify-end items-center gap-4 w-full">
        {/* <Search notAbsolute size="w-full" /> */}
        {/* <p className="text-zinc-400 lg:text-md text-sm">
          Please note that this feature is in beta
        </p> */}
        <Button asChild variant={"secondary"}>
          <Link href={"conducts/overview"}>Overview</Link>
        </Button>
        <NewConduct company={company} />
      </div>
      <div className="grid lg:grid-cols-4 grid-cols-1 py-4 w-full gap-4">
        {conducts.map((conduct) => {
          return (
            <ConductCard conduct={conduct} key={conduct.title + conduct.id} />
          );
        })}
      </div>
    </PageWrapper>
  );
};

export default Page;
