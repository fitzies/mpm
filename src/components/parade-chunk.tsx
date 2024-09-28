import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import Link from "next/link";

const ParadeChunk = ({ company }: { company: string }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Parade State</CardTitle>
        <CardDescription>Generate a text parade state</CardDescription>
      </CardHeader>
      <CardContent className="flex gap-4">
        <Button size="sm">Generate</Button>
        <Button asChild size="sm" className="gap-1" variant={"secondary"}>
          <Link href={`${company}/statuses`}>Edit Statuses</Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default ParadeChunk;
