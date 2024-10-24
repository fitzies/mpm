import PageWrapper from "@/components/page-wrapper";
import { getActiveStatuses, getCompany } from "@/lib/db";
import { DataTableType, RecruitWithStatuses } from "../../../../../types";
import NR from "@/components/nr";
import { StatusType } from "@prisma/client";
import {
  checkRecruitOutOfCamp,
  getLatestConduct,
  parseDate,
} from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export default async function Page({
  params,
}: {
  params: { company: string };
}) {
  const company = await getCompany(params.company);

  if (!company) {
    return (
      <PageWrapper>
        <p>This company does not exist</p>
      </PageWrapper>
    );
  }

  const statuses = await getActiveStatuses(company.id, [
    StatusType.Other,
    StatusType.MC,
    StatusType.BookedOut,
  ]);

  const recruits = company.recruits.sort(
    (a, b) => parseInt(a.id.substring(1)) - parseInt(b.id.substring(1))
  );

  const tableData: DataTableType = {
    headers: ["4D", "Name", "SOC", "RM", "HA", "Booked in"],
    rows: recruits.map((recruit) => [
      recruit.id,
      recruit.name,
      getLatestConduct(recruit, "SOC"),
      getLatestConduct(recruit, "RouteMarch"),
      "Nil",
      // recruit.statuses
      //   .map((status) => {
      //     if (
      //       parseDate(status.startDate) <= new Date() &&
      //       parseDate(status.endDate) >= new Date() &&
      //       (status.type === StatusType.BookedOut ||
      //         status.type === StatusType.MC ||
      //         status.type === StatusType.Other)
      //     ) {
      //       console.log(status.type);
      //       return status.type === "Other" ? status.remarks : status.type;
      //     } else {
      //       return null;
      //     }
      //   })
      //   .filter((status) => status !== null)
      //   .join(", "),
      checkRecruitOutOfCamp(recruit.id, statuses) ? (
        <Badge variant={"destructive"}>No</Badge>
      ) : (
        <Badge variant={"secondary"}>Yes</Badge>
      ),
    ]),
  };

  return (
    <PageWrapper className="flex flex-col">
      <NR data={tableData} company={company} />
    </PageWrapper>
  );
}
