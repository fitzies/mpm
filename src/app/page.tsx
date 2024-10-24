import CompanyCard from "@/components/company-card";
import prisma from "@/lib/prisma";

const Page = async () => {
  let companies = await prisma.company.findMany({
    include: { recruits: true, commanders: true },
  });

  companies = companies.filter((company) => company.id !== 0);

  return (
    <div className="grid lg:grid-cols-4 grid-cols-1 gap-2 py-4 px-4">
      {companies.map((company) => {
        return <CompanyCard company={company} key={company.id} />;
      })}
    </div>
  );
};

export default Page;
