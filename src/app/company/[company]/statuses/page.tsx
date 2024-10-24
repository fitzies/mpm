import PageWrapper from "@/components/page-wrapper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getActiveStatuses,
  getCommanderActiveStatuses,
  getCompany,
} from "@/lib/db";
import { StatusType } from "@prisma/client";
import Search from "@/components/search";

import AddStatusPopover from "@/components/add-status-popover";
import { StatusTable } from "@/components/status-table";

const Page = async ({
  params,
  searchParams,
}: {
  params: { company: string };
  searchParams: { query?: string; page?: string };
}) => {
  const companyName =
    params.company.substring(0, 1).toUpperCase() + params.company.substring(1);

  const company = await getCompany(companyName);

  if (!company) {
    return (
      <PageWrapper className="w-full h-screen flex justify-center items-center">
        <p>No company found</p>
      </PageWrapper>
    );
  }

  const allStatusesList = await getActiveStatuses(
    company.id,
    [
      StatusType.CustomStatus,
      StatusType.LD,
      StatusType.MC,
      StatusType.Other,
      // StatusType.BookedOut,
    ],
    true
  );

  const statusesList = await getActiveStatuses(
    company.id,
    [StatusType.CustomStatus, StatusType.LD],
    true
  );

  const outOfCampList = await getActiveStatuses(company.id, [
    StatusType.Other,
    StatusType.MC,
    // StatusType.BookedOut,
  ]);

  const commanderStatusList = await getCommanderActiveStatuses(
    company.id,
    [
      StatusType.CustomStatus,
      StatusType.LD,
      StatusType.MC,
      StatusType.Other,
      // StatusType.BookedOut,
    ],
    true
  );

  const query = searchParams?.query || "";

  return (
    <PageWrapper className="flex flex-col items-center">
      <Tabs
        defaultValue="All"
        className="flex flex-col items-center my-4 lg:w-5/6 w-full"
      >
        <div className="relative w-full flex justify-between items-center">
          <Search />
          <TabsList className="lg:mx-auto">
            <TabsTrigger value="All">All</TabsTrigger>
            <TabsTrigger value="Statuses">Statuses</TabsTrigger>
            <TabsTrigger value="Out of camp">Out of camp</TabsTrigger>
            <TabsTrigger value="Commanders">CR</TabsTrigger>
          </TabsList>
          <AddStatusPopover company={company} />
        </div>
        <TabsContent value="All" className="w-full">
          <StatusTable
            statuses={allStatusesList}
            company={company}
            query={query}
          />
        </TabsContent>
        <TabsContent value="Statuses" className="w-full">
          <StatusTable
            statuses={statusesList}
            company={company}
            query={query}
          />
        </TabsContent>
        <TabsContent value="Out of camp" className="w-full">
          <StatusTable
            statuses={outOfCampList}
            company={company}
            query={query}
          />
        </TabsContent>
        <TabsContent value="Commanders" className="w-full">
          <StatusTable
            statuses={commanderStatusList}
            company={company}
            query={query}
          />
        </TabsContent>
      </Tabs>
    </PageWrapper>
  );
};

export default Page;
