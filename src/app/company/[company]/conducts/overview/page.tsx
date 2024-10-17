import { AgTable } from "@/components/ag-table";
import { ConductSelect } from "@/components/conduct-select";
import PageWrapper from "@/components/page-wrapper";
import prisma from "@/lib/prisma";
import { ConductType } from "@prisma/client";

export default async function Page({
  params,
  searchParams,
}: {
  params: { company: string };
  searchParams: { conduct: string };
}) {
  const company = await prisma.company.findFirst({
    where: {
      name:
        params.company.substring(0, 1).toUpperCase() +
        params.company.substring(1),
    },
    include: { recruits: true },
  });

  if (!company) {
    return <></>;
  }
  const conducts = await prisma.conduct.findMany({
    where: { companyId: company.id },
    include: { recruits: true },
  });

  return (
    <PageWrapper className="!py-24 !px-12 flex flex-col">
      <div className="w-full flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Overview</h1>
      </div>
      <ConductSelect />
      <AgTable
        type={searchParams.conduct as ConductType}
        conducts={conducts}
        company={company}
      />
    </PageWrapper>
  );
}
