import ConductCard from "@/components/conduct-card";
import LoadingConductCard from "@/components/loading-conduct-card";
import NewConduct from "@/components/new-conduct";
import PageWrapper from "@/components/page-wrapper";
import Spinner from "@/components/spinner";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Loading() {
  return (
    <PageWrapper className="flex flex-col justify-center items-center">
      <div className="flex justify-end items-center gap-4 w-full">
        <Button variant={"secondary"}>Overview</Button>
        <Button>+</Button>
      </div>
      <div className="grid lg:grid-cols-4 grid-cols-1 py-4 w-full gap-4">
        {new Array(10).fill(0).map((conduct, index) => {
          return <LoadingConductCard key={conduct + index} />;
        })}
      </div>
    </PageWrapper>
  );
}
