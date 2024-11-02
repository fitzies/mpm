import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import { formatString } from "@/lib/utils";
import { Progress } from "./ui/progress";
import { ConductWithRecruits } from "../../types";
import Link from "next/link";

const ConductCard = ({ conduct }: { conduct: ConductWithRecruits }) => {
  const date = formatString(conduct.date as string);

  return (
    <>
      <Card className="hover:-translate-y-1 duration-150">
        <CardHeader>
          <CardTitle>{conduct.title}</CardTitle>
          <CardDescription>{`${date.toDateString()}`}</CardDescription>
        </CardHeader>
        <CardContent>
          <Progress
            value={
              (conduct.recruits.length / conduct.company.recruits.length) * 100
            }
          />
        </CardContent>
        <CardFooter>
          <Button className="w-full" variant={"secondary"} asChild>
            <Link
              href={`/company/${conduct.company.name.toLowerCase()}/conducts/${
                conduct.id
              }`}
            >
              View
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default ConductCard;
