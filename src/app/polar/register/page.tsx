"use client";

import PageWrapper from "@/components/page-wrapper";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

const Page = () => {
  const clientId = "746e3bd9-0abf-4f9e-852a-35ae94aebe77";

  return (
    <PageWrapper className="h-screen flex justify-center items-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Register your Polar</CardTitle>
          <CardDescription>Please click register to begin.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Button className="w-full" asChild>
            <Link
              href={`https://flow.polar.com/oauth2/authorization?response_type=code&client_id=${clientId}`}
            >
              Register
            </Link>
          </Button>
        </CardContent>
      </Card>
    </PageWrapper>
  );
};

export default Page;
