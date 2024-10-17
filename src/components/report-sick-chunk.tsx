"use client";

import Image from "next/image";
import { MoreHorizontal } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ReportSickWithDetails } from "../../types";
import { deleteReportSick } from "@/lib/actions";
import NewReportSick from "./new-report-sick";

export default function ReportSickChunk({
  reportSickList,
}: {
  reportSickList: ReportSickWithDetails[];
}) {
  return (
    <Card>
      <CardHeader className="flex !flex-row !justify-between !items-center">
        <div className="flex flex-col gap-2">
          <CardTitle>Report Sick</CardTitle>
          <CardDescription className="lg:block hidden">
            Append new report sick personnel
          </CardDescription>
        </div>
        <NewReportSick />
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Recieved?</TableHead>
              <TableHead className="hidden md:table-cell">Status</TableHead>
              <TableHead className="hidden md:table-cell">Dates</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reportSickList.map((cell) => {
              return (
                <TableRow key={cell.id}>
                  <TableCell className="font-medium">
                    {cell.recruit4d} {cell.recruit.name}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {!cell.fufilled ? "Awaiting" : "Recieved"}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {cell.fufilled && cell.status ? cell.status.type : "Null"}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">Null</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-haspopup="true"
                          size="icon"
                          variant="ghost"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <form action={deleteReportSick}>
                          <input
                            type="text"
                            className="hidden"
                            name="id"
                            value={cell.id}
                          />
                          <DropdownMenuItem>
                            <button type="submit">Delete</button>
                          </DropdownMenuItem>
                        </form>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
      {/* <CardFooter></CardFooter> */}
    </Card>
  );
}
