import PageWrapper from "@/components/page-wrapper";
import { getActiveStatuses, getCompany } from "@/lib/db";
import { DataTableType } from "../../../../../types";
import NR from "@/components/nr";
import { StatusType } from "@prisma/client";
import {
  checkRecruitOutOfCamp,
  getLatestConduct,
  parseDate,
} from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    headers: ["4D", "Name", "SOC", "RM", "HA", "Days Missed", "Booked in"],
    rows: recruits.map((recruit) => [
      recruit.id,
      recruit.name,
      getLatestConduct(recruit, "SOC"),
      getLatestConduct(recruit, "RouteMarch"),
      "Nil", // You can replace this with appropriate HA logic if needed
      // Calculate total days missed
      String(
        recruit.statuses.reduce((total, status) => {
          if (status.type === "MC") {
            const startDate = parseDate(status.startDate); // Convert startDate to Date
            const endDate = parseDate(status.endDate); // Convert endDate to Date
            const daysMissed =
              (endDate.getTime() - startDate.getTime()) /
                (1000 * 60 * 60 * 24) +
              1; // Inclusive of startDate
            return total + daysMissed;
          }
          return total;
        }, 0)
      ),
      // Check if recruit is booked in
      checkRecruitOutOfCamp(recruit.id, statuses) ? (
        <Badge variant={"destructive"} key={recruit.id + " booked in"}>
          No
        </Badge>
      ) : (
        <Badge variant={"secondary"} key={recruit.id + " booked out"}>
          Yes
        </Badge>
      ),
    ]),
  };

  return (
    <PageWrapper className="flex flex-col">
      <NR data={tableData} company={company} />
    </PageWrapper>
  );
}
