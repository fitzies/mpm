import PageWrapper from "@/components/page-wrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getBarrackDamages } from "@/lib/db";
import { getStatusColor } from "@/lib/utils";
import Link from "next/link";

const barracksData = [
  {
    id: 1,
    name: "Alpha",
    type: "Structual",
    damagePercentage: 15,
    status: "Minor",
  },
  {
    id: 2,
    name: "Bravo",
    type: "Structual",
    damagePercentage: 45,
    status: "Moderate",
  },
  {
    id: 3,
    name: "Charlie",
    type: "Structual",
    damagePercentage: 80,
    status: "Severe",
  },
  {
    id: 4,
    name: "Delta",
    type: "Structual",
    damagePercentage: 5,
    status: "Minimal",
  },
  {
    id: 5,
    name: "Echo",
    type: "Structual",
    damagePercentage: 60,
    status: "Moderate",
  },
];

export default async function Page() {
  const barrackDamages = await getBarrackDamages();

  return (
    <PageWrapper className="!py-4">
      <div className="w-full flex justify-end gap-3">
        <Button size={"sm"} variant={"secondary"}>
          ...
        </Button>
        <Button size={"sm"} asChild>
          <Link href={"/barrack-damages/form"}>New entry</Link>
        </Button>
      </div>
      <Card className="my-4">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Barrack Damage Entries
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {barrackDamages.map((barracks) => (
                <TableRow key={barracks.id}>
                  <TableCell className="font-medium">{barracks.name}</TableCell>
                  <TableCell>{barracks.type}</TableCell>
                  <TableCell>
                    <Badge
                      className={getStatusColor(
                        barracks.severe ? "Severe" : "Moderate"
                      )}
                    >
                      {barracks.severe ? "Severe" : "Moderate"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      // onClick={() => setSelectedBarracks(barracks)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </PageWrapper>
  );
}
