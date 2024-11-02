import Dashboard from "@/components/dashboard";
import PageWrapper from "@/components/page-wrapper";
import { getActiveStatuses, getCompany, getRecruits } from "@/lib/db";
import { getOutOfCampStrength } from "@/lib/utils";
import { Recruit, StatusType } from "@prisma/client";

export default async function Page({
  params,
  searchParams,
}: {
  params: { company: string };
  searchParams: { platoon?: number };
}) {
  const company = await getCompany(params.company);

  if (!company) {
    return <></>;
  }

  // const platoon = searchpa;
  const platoon = searchParams?.platoon || 1;

  const companyStatuses = await getActiveStatuses(
    company.id,
    [StatusType.LD, StatusType.MC, StatusType.Other, StatusType.CustomStatus],
    true
  );

  const recruits = await getRecruits(company.id);

  const sections = Array.from({ length: 4 }, (_, i) =>
    recruits.filter(
      (recruit) =>
        recruit.id.substring(0, 3) ===
        `${company.name.substring(0, 1).toUpperCase()}${platoon}${i + 1}`
    )
  );

  return (
    <PageWrapper>
      <div className="grid lg:grid-cols-4 grid-cols-1 gap-4">
        {sections.map(async (section, index) => {
          const strength = await getOutOfCampStrength(section);
          const sectionStatuses = await getActiveStatuses(
            company.id,
            [
              StatusType.LD,
              StatusType.MC,
              StatusType.Other,
              StatusType.CustomStatus,
            ],
            true
          );
          return (
            <>
              <Dashboard
                title={`Section ${platoon}-${index + 1}`}
                headers={{ left: "Recruit", right: "Reason" }}
                length={`${section.length - strength} / ${section.length}`}
                data={section
                  .map((sectionItem) =>
                    sectionStatuses.filter(
                      (s) => sectionItem.id === s.recruit!.id
                    )
                  )
                  .flat()}
                noBtn
              />
            </>
          );
        })}
      </div>
    </PageWrapper>
  );
}
