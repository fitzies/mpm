import Chunk from "@/components/chunk";
import Dashboard from "@/components/dashboard";
import PageWrapper from "@/components/page-wrapper";
import ParadeChunk from "@/components/parade-chunk";
import { getActiveStatuses, getCompany } from "@/lib/db";
import prisma from "@/lib/prisma";
import {
  getOutOfCampStrength,
  getPlatoonStrength,
  parseDate,
} from "@/lib/utils";
import { StatusType } from "@prisma/client";

const Page = async ({ params }: { params: { company: string } }) => {
  const companyName =
    params.company.substring(0, 1).toUpperCase() + params.company.substring(1);

  const company = await getCompany(companyName);

  if (!company) {
    return <p>{companyName} does not exist...</p>;
  }

  const recruitsOnStatus = await getActiveStatuses(
    company.id,
    [StatusType.LD, StatusType.CustomStatus],
    true
  );

  const recruitsOnMC = await getActiveStatuses(
    company.id,
    [StatusType.MC, StatusType.Other],
    false
  );

  let conducts = await prisma.conduct.findMany({
    where: { companyId: company.id },
    include: { recruits: true },
  });

  // Sort conducts by date in descending order
  conducts = conducts.sort(
    (a, b) => parseDate(b.date).getTime() - parseDate(a.date).getTime()
  );

  // Total recruits in the company
  const totalRecruits = company.recruits.length;

  // Calculate total participation percentage for each conduct
  const totalParticipationPercentage = conducts.reduce((total, conduct) => {
    const participatingRecruits = conduct.recruits.length; // Number of participating recruits
    const participationPercentage = participatingRecruits / totalRecruits; // Calculate participation percentage
    return total + participationPercentage; // Sum the participation percentages
  }, 0);

  // Calculate average participation percentage
  const averageParticipationPercentage =
    totalParticipationPercentage / conducts.length;

  return (
    <PageWrapper className="flex min-h-screen flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="w-full grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <Chunk
            title="Recruit Strength"
            body={`${
              company.recruits.length - recruitsOnMC.length
            } / ${company.recruits.length.toString()}`}
          ></Chunk>
          <Chunk
            title="Commander Strength"
            body={`${
              company.commanders.length -
              getOutOfCampStrength(company.commanders)
            } / ${company.commanders.length.toString()}`}
          ></Chunk>
          <Chunk
            title="Latest conduct"
            body={conducts.length > 0 ? conducts[0].title : "None"}
          ></Chunk>
          <Chunk
            title="Participation mean"
            body={`${
              (averageParticipationPercentage * 100).toString().split(".")[0]
            }%`}
          ></Chunk>
        </div>
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-4">
          <Dashboard
            title="Statuses"
            headers={{ left: "Recruit", right: "Status" }}
            data={recruitsOnStatus.slice(0, 5)}
            length={recruitsOnStatus.length}
            href={`${params.company}/statuses`}
          />
          <Dashboard
            title="Out of Camp"
            headers={{ left: "Recruit", right: "Reason" }}
            data={recruitsOnMC.slice(0, 5)}
            length={recruitsOnMC.length}
            href={`${params.company}/statuses`}
          />
        </div>
        <div className="grid gap-4 md:gap-8 lg:grid-rows-2 xl:grid-cols-2">
          {/* <ParadeChunk company={params.company} /> */}
          <Chunk
            title="Platoon 1 Strength"
            body={`${
              getPlatoonStrength(company.recruits, 1) -
              getOutOfCampStrength(company.recruits, 1)
            } / ${getPlatoonStrength(company.recruits, 1)}`}
          />
          <Chunk
            title="Platoon 2 Strength"
            body={`${
              getPlatoonStrength(company.recruits, 2) -
              getOutOfCampStrength(company.recruits, 2)
            } / ${getPlatoonStrength(company.recruits, 2)}`}
          />
          <Chunk
            title="Platoon 3 Strength"
            body={`${
              getPlatoonStrength(company.recruits, 3) -
              getOutOfCampStrength(company.recruits, 3)
            } / ${getPlatoonStrength(company.recruits, 3)}`}
          />
          <Chunk
            title="Platoon 4 Strength"
            body={`${
              getPlatoonStrength(company.recruits, 4) -
              getOutOfCampStrength(company.recruits, 4)
            } / ${getPlatoonStrength(company.recruits, 4)}`}
          />
          <ParadeChunk company={company} />
        </div>
      </main>
    </PageWrapper>
  );
};

export default Page;
