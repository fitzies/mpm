import Image from "next/image";
import capture from "../images/capture.png";
import { BorderBeam } from "@/components/ui/border-beam";
// import { BentoDemo } from "@/components/bento-demo";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import LearnMoreBtn from "@/components/learn-more";

export default async function Page() {
  return (
    <main className="w-screen flex flex-col items-center px-12 py-16">
      <div className="flex flex-col gap-4 mx-auto w-full items-center">
        <h1 className="lg:text-6xl text-xl font-bold text-center w-10/12">
          Effortlessly monitor your soldiers conducts, attendance, and statuses
          all in one place
        </h1>
        <p className="text-zinc-400 lg:text-lg text-xs text-center">
          Easily keep track of your teams activities, presence, and overall
          performance details in a single, streamlined platform for oversight.
        </p>
      </div>
      <div className="flex gap-2 mt-8">
        <Button asChild>
          <Link href={"/login"}>Continue</Link>
        </Button>
        <LearnMoreBtn />
      </div>
      <div className="lg:w-3/4 w-full relative border border-zinc-800 p-2 my-12 rounded-xl mx-auto lg:block hidden">
        <Image src={capture} alt="hello" className="rounded-xl" />
        <BorderBeam />
      </div>
      {/* <div className="w-3/4  my-8">
        <BentoDemo />
      </div> */}
    </main>
  );
}
