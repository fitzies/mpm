import Image from "next/image";
import capture from "../images/capture.png";
import { BorderBeam } from "@/components/ui/border-beam";
import { BentoDemo } from "@/components/bento-demo";

export default async function Page() {
  return (
    <main className="w-screen flex flex-col items-center px-12 py-16">
      <div className="flex flex-col gap-4 mx-auto w-full items-center">
        <h1 className="lg:text-6xl text-xl font-bold text-center w-10/12">
          Effortlessly monitor your soldiers conducts, attendance, and statuses
          all in one place
        </h1>
        <p className="text-zinc-400 lg:text-lg text-xs text-center">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta nisi
          ducimus asperiores ratione facilis ut numquam harum minus repellendus
          porro!
        </p>
      </div>
      <div className="w-3/4 relative border border-zinc-800 p-2 my-12 rounded-xl mx-auto lg:block hidden">
        <Image src={capture} alt="hello" className="rounded-xl" />
        <BorderBeam />
      </div>
      <div className="w-3/4 lg:block hidden my-8">
        <BentoDemo />
      </div>
    </main>
  );
}
