import PageWrapper from "@/components/page-wrapper";
import ReportSickChunk from "@/components/report-sick-chunk";
import prisma from "@/lib/prisma";
import { getDate } from "@/lib/utils";

export default async function Page({
  params,
}: {
  params: { company: string };
}) {
  const company = await prisma.company.findFirst({
    where: { name: params.company.toLowerCase() },
  });
  const reportSickList = await prisma.reportSick.findMany({
    where: { companyId: company?.id, date: getDate() },
    include: { recruit: true, status: true },
  });

  return (
    <PageWrapper>
      <ReportSickChunk reportSickList={reportSickList} />
    </PageWrapper>
  );
}
