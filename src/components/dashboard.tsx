"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

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
import { ActiveStatusWithRecruit } from "../../types";
import { StatusType } from "@prisma/client";

const plusToString = (type: string): string => {
  return type === StatusType.LDP1
    ? "LD + 1"
    : type === StatusType.LDP2
    ? "LD + 2"
    : type === StatusType.MCP1
    ? "MC + 1"
    : type === StatusType.MCP2
    ? "MC + 2"
    : type; // Fallback if none of the types match
};

export default function Dashboard({
  title,
  headers,
  data,
  length,
}: {
  title: string;
  headers: { left: string; right: string };
  data?: ActiveStatusWithRecruit[];
  length: number;
}) {
  if (!data) {
    data = [];
  }

  return (
    <Card className="xl:col-span-2">
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>
            {title} ({length})
          </CardTitle>
          {/* <CardDescription>{description}</CardDescription> */}
        </div>
        <Button asChild size="sm" className="ml-auto gap-1">
          <Link href="#">
            View All
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{headers.left}</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">{headers.right}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((status: ActiveStatusWithRecruit, index: number) => {
              return (
                <TableRow key={status.recruit!.name + index}>
                  <TableCell>
                    <div className="font-medium">{`${status.recruit!.id} REC ${
                      status.recruit!.name
                    }`}</div>
                  </TableCell>
                  <TableCell className="table-cell">{`${status.startDate} - ${status.endDate}`}</TableCell>
                  <TableCell className="text-right">
                    {plusToString(status.type)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
