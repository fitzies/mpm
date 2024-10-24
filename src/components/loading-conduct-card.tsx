import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";

export default function LoadingConductCard() {
  return (
    <Card className="hover:-translate-y-1 duration-150 !border:animate-pulse">
      <CardHeader>
        <CardTitle className="text-transparent">Loading</CardTitle>
        <CardDescription>
          <div className="text-transparent">Loading</div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Progress value={0} className="animate-pulse" />
      </CardContent>
      <CardFooter>
        <Button className="w-full animate-pulse" variant={"secondary"}>
          <p className="text-transparent">Loading</p>
        </Button>
      </CardFooter>
    </Card>
  );
}
