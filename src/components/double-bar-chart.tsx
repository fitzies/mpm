"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  statuses: {
    label: "Statuses",
    color: "hsl(var(--chart-1))",
  },
  mcs: {
    label: "MCs",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

interface MonthData {
  month: string;
  statuses: number;
  mcs: number;
}

export function DoubleBarChart({
  data,
  title,
  description,
  trendingText,
  subtext,
}: {
  data: MonthData[];
  title: string;
  description: string;
  trendingText: string;
  subtext: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="statuses" fill="var(--color-statuses)" radius={4} />
            <Bar dataKey="mcs" fill="var(--color-mcs)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          {trendingText}{" "}
          {trendingText.length > 0 ? <TrendingUp className="h-4 w-4" /> : null}
        </div>
        <div className="leading-none text-muted-foreground">{subtext}</div>
      </CardFooter>
    </Card>
  );
}
