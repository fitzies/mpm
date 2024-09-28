import CompanyCard from "@/components/company-card";

const Page = () => {
  return (
    <div className="flex flex-col justify-center items-center px-8 py-12 h-screen">
      <div className="grid grid-cols-2 gap-2 lg:w-1/3 lg:h-1/4">
        <CompanyCard company="Taurus" />
        <CompanyCard company="Ulysses" />
        <CompanyCard company="Viper" />
        <CompanyCard company="Wolf" />
      </div>
    </div>
  );
};

export default Page;
