import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

const CompanyCard = ({
  company,
  description,
}: {
  company: string;
  description: string;
}) => {
  return (
    <Link href={`/company/${company.toLowerCase()}`}>
      <Card className="h-full">
        <CardHeader>
          <CardTitle>{company}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
};

export default CompanyCard;
