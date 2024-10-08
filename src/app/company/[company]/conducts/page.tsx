import PageWrapper from "@/components/page-wrapper";
import { paradeStateMessage } from "@/lib/parade-state-message";
import prisma from "@/lib/prisma";

const Page = async () => {
  const company = await prisma.company.findFirst({ where: { id: 1 } });
  const msg = await paradeStateMessage(company!);

  return (
    <PageWrapper className="flex justify-center items-center h-screen">
      {/* <div>Coming soon</div> */}
      <textarea name="" id="" className="w-1/2 h-[50vh]">
        {JSON.stringify(msg)}
      </textarea>
    </PageWrapper>
  );
};

export default Page;
