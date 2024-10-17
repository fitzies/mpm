import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Commander, Company, Recruit } from "@prisma/client";
import Link from "next/link";

const CompanyCard = ({
  company,
}: {
  company: Company & { recruits: Recruit[]; commanders: Commander[] };
}) => {
  return (
    <Link href={`/company/${company.name.toLowerCase()}`}>
      <Card>
        <CardHeader>
          <CardTitle>{company.name}</CardTitle>
          <CardDescription className="flex flex-col gap-1">
            {company.recruits.length} recruit(s) <br />
            {company.commanders.length} commander(s)
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
};

export default CompanyCard;
