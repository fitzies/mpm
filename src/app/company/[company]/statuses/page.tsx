import PageWrapper from "@/components/page-wrapper";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getActiveStatuses,
  getCommanderActiveStatuses,
  getCompany,
} from "@/lib/db";
import { Company, StatusType } from "@prisma/client";
import {
  ActiveStatusWithCommander,
  ActiveStatusWithRecruit,
} from "../../../../../types";
import { plusToString } from "@/lib/utils";
import CellEdit from "@/components/cell-edit";
import AddStatus from "@/components/add-status";

const StatusTable = ({
  statuses,
  company,
}: {
  statuses: ActiveStatusWithRecruit[] | ActiveStatusWithCommander[];
  company: Company;
}) => {
  return (
    <div>
      <Table>
        <TableCaption>List of statuses</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Recruit</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Status</TableHead>
            <TableHead className="text-right">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {statuses.map(
            (
              status: ActiveStatusWithRecruit | ActiveStatusWithCommander,
              index
            ) => (
              <TableRow key={status.endDate + index}>
                <TableCell className="font-medium">
                  {/* Check if it's a recruit or commander */}
                  {"recruit" in status
                    ? `${status.recruit?.id} ${status.recruit?.name}`
                    : `${status.commander?.name}`}
                </TableCell>
                <TableCell>
                  {status.startDate} - {status.endDate}
                </TableCell>
                <TableCell className="text-right">
                  {status.type === "Other" || status.type === "CustomStatus"
                    ? status.remarks
                    : plusToString(status.type)}
                </TableCell>
                <CellEdit status={status} company={company} />
              </TableRow>
            )
          )}
        </TableBody>
      </Table>
    </div>
  );
};

const Page = async ({ params }: { params: { company: string } }) => {
  const companyName =
    params.company.substring(0, 1).toUpperCase() + params.company.substring(1);

  const company = await getCompany(companyName);

  if (!company) {
    return <>No company found</>;
  }

  const allStatusesList = await getActiveStatuses(
    company.id,
    [StatusType.CustomStatus, StatusType.LD, StatusType.MC, StatusType.Other],
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
  ]);

  const commanderStatusList = await getCommanderActiveStatuses(
    company.id,
    [StatusType.CustomStatus, StatusType.LD, StatusType.MC, StatusType.Other],
    true
  );

  return (
    <PageWrapper className="flex flex-col items-center">
      <Tabs
        defaultValue="All"
        className="flex flex-col items-center my-4 lg:w-3/4 w-full"
      >
        <div className="relative w-full flex items-center">
          <TabsList className="lg:mx-auto">
            <TabsTrigger value="All">All</TabsTrigger>
            <TabsTrigger value="Statuses">Statuses</TabsTrigger>
            <TabsTrigger value="Out of camp">Out of camp</TabsTrigger>
            <TabsTrigger value="Commanders">CR</TabsTrigger>
          </TabsList>
          <AddStatus company={params.company} commanders={company.commanders} />
        </div>
        <TabsContent value="All" className="w-full">
          <StatusTable statuses={allStatusesList} company={company} />
        </TabsContent>
        <TabsContent value="Statuses" className="w-full">
          <StatusTable statuses={statusesList} company={company} />
        </TabsContent>
        <TabsContent value="Out of camp" className="w-full">
          <StatusTable statuses={outOfCampList} company={company} />
        </TabsContent>
        <TabsContent value="Commanders" className="w-full">
          <StatusTable statuses={commanderStatusList} company={company} />
        </TabsContent>
      </Tabs>
    </PageWrapper>
  );
};

export default Page;
