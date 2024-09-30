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
import { plusToString } from "@/lib/utils";

export default function Dashboard({
  title,
  headers,
  data,
  length,
  href,
}: {
  title: string;
  headers: { left: string; right: string };
  data?: ActiveStatusWithRecruit[];
  length: number;
  href?: string;
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
          <Link href={href ?? ""}>
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
                    <div className="font-medium">{`${status.recruit!.id} ${
                      status.recruit!.name
                    }`}</div>
                  </TableCell>
                  <TableCell className="table-cell">{`${status.startDate} - ${status.endDate}`}</TableCell>
                  <TableCell className="text-right">
                    {status.type === "Other" || status.type === "CustomStatus"
                      ? status.remarks
                      : plusToString(status.type)}
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
