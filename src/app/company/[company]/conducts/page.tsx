import PageWrapper from "@/components/page-wrapper";
import { paradeStateMessage } from "@/lib/parade-state-message";
import prisma from "@/lib/prisma";

const Page = async () => {
  return (
    <PageWrapper className="flex justify-center items-center h-screen">
      <div>Coming soon</div>
    </PageWrapper>
  );
};

export default Page;
