import PageWrapper from "@/components/page-wrapper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Search from "@/components/search";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Ellipsis } from "lucide-react";

export default function Loading() {
  return (
    <PageWrapper className="flex flex-col items-center">
      <Tabs
        defaultValue="All"
        className="flex flex-col items-center my-4 lg:w-5/6 w-full"
      >
        <div className="relative w-full flex justify-between items-center">
          <Search />
          <TabsList className="lg:mx-auto animate-pulse">
            <TabsTrigger value="All">All</TabsTrigger>
            <TabsTrigger value="Statuses">Statuses</TabsTrigger>
            <TabsTrigger value="Out of camp">Out of camp</TabsTrigger>
            <TabsTrigger value="Commanders">CR</TabsTrigger>
          </TabsList>
          <Button className="absolute right-0">+</Button>
        </div>
        <TabsContent value="All" className="w-full">
          <div>
            <Table>
              <TableCaption>List of statuses</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead></TableHead>
                  <TableHead></TableHead>
                  <TableHead className="text-right"></TableHead>
                  <TableHead className="text-right">
                    <span className="sr-only"></span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {new Array(25).fill(0).map((_, index) => (
                  <TableRow key={"loading-" + index}>
                    <TableCell className="font-medium">
                      <p className="animate-pulse bg-zinc-800 text-transparent rounded-xl w-3/4">
                        U2208 THANVEER AHMAD S/O
                      </p>
                    </TableCell>
                    <TableCell>
                      <p className="animate-pulse bg-zinc-800 text-transparent rounded-xl w-1/2 ml-auto">
                        000000 - 000000
                      </p>
                    </TableCell>
                    <TableCell className="text-right">
                      <p className="animate-pulse bg-zinc-800 text-transparent w-1/2 ml-auto rounded-xl">
                        EX WATER PARADE (LP)
                      </p>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon">
                        <Ellipsis className="h-4 w-4 animate-pulse" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </PageWrapper>
  );
}

//<LoadingConductCard key={conduct + index} />
