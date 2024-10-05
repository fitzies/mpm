import { DoubleBarChart } from "@/components/double-bar-chart";
import PageWrapper from "@/components/page-wrapper";
import { RadialChart } from "@/components/radial-chart";
import { getCompany, getRSOCount, getStatusesPerDate } from "@/lib/db";

const Page = async ({ params }: { params: { company: string } }) => {
  const company = await getCompany(
    params.company.substring(0, 1).toUpperCase() + params.company.substring(1)
  );

  if (!company) {
    return (
      <PageWrapper>
        <p>This company does not exist.</p>
      </PageWrapper>
    );
  }

  const statusesPerDate = await getStatusesPerDate(company.id);

  const RSOCount = await getRSOCount(company.id);
  const percent = 0.5;

  return (
    <PageWrapper className="grid lg:grid-cols-3 grid-cols-1 gap-4">
      <DoubleBarChart
        data={statusesPerDate}
        title={`${company.name}'s Report Sick`}
        description="September - December 2024"
        trendingText=""
        subtext="The amount of statuses & MCs"
      />
      <RadialChart
        title="Report Sick Outside"
        count={RSOCount}
        description="September - December 2024"
        percent={360 * percent * (RSOCount / 30)}
        trendingText=""
        subtext="The amount of times reported sick outside of camp"
      />
    </PageWrapper>
  );
};

export default Page;
