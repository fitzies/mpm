"use client";

import { useToast } from "@/hooks/use-toast";
import { Button } from "./ui/button";

export default function LearnMoreBtn() {
  const { toast } = useToast();
  const handleClick = () => {
    toast({ title: "Coming soon..." });
  };
  return (
    <Button variant={"secondary"} onClick={handleClick}>
      Learn more
    </Button>
  );
}
