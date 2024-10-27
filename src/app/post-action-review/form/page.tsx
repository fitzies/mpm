import PageWrapper from "@/components/page-wrapper";
import PostActionReviewForm from "@/components/post-action-review-form";
import { getSessionData } from "@/lib/actions";
import { getCommander, getCompany } from "@/lib/db";
import { Company } from "@prisma/client";

export default async function Page() {
  const session = await getSessionData();
  const commander = await getCommander(session);

  if (!commander) {
    return (
      <PageWrapper className="w-full h-screen flex justify-center items-center">
        <p>You are not logged in</p>
      </PageWrapper>
    );
  }

  const company = await getCompany(commander?.companyId);

  return (
    <PageWrapper>
      <PostActionReviewForm
        name={commander.name}
        company={company as Company}
      />
    </PageWrapper>
  );
}
