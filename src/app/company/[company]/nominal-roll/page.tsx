import PageWrapper from "@/components/page-wrapper";
import { getCompany } from "@/lib/db";

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

  return (
    <PageWrapper className="flex flex-col w-full h-screen items-center justify-center">
      <p>
        Nominal Roll for
        <span className="italic"> {company.name} coy </span>
        is coming soon...
      </p>
    </PageWrapper>
  );
}
