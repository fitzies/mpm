import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

const CompanyCard = ({ company }: { company: string }) => {
  return (
    <Link href={`/company/${company.toLowerCase()}`}>
      <Card className="h-full">
        <CardHeader>
          <CardTitle>{company}</CardTitle>
          <CardDescription>Lorem ipsum dolor sit amet.</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
};

export default CompanyCard;
