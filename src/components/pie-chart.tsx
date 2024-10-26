"use client";
import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";
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

const chartData = [
  { barrackDamage: "electrical", entries: 275, fill: "var(--color-chrome)" },
  { barrackDamage: "structural", entries: 200, fill: "var(--color-safari)" },
  { barrackDamage: "plumbing", entries: 287, fill: "var(--color-firefox)" },
  { barrackDamage: "doors", entries: 173, fill: "var(--color-edge)" },
  { barrackDamage: "windows", entries: 190, fill: "var(--color-safari)" },
  { barrackDamage: "furniture", entries: 190, fill: "var(--color-chrome)" },
  { barrackDamage: "others", entries: 190, fill: "var(--color-other)" },
];

const chartConfig = {
  visitors: {
    label: "Entries",
  },
  electrical: {
    label: "Electrical",
    color: "hsl(var(--chart-1))",
  },
  structural: {
    label: "Structural",
    color: "hsl(var(--chart-2))",
  },
  plumbing: {
    label: "Plumbing",
    color: "hsl(var(--chart-3))",
  },
  doors: {
    label: "Doors",
    color: "hsl(var(--chart-4))",
  },
  windows: {
    label: "Windows",
    color: "hsl(var(--chart-5))",
  },
  furniture: {
    label: "Furniture",
    color: "hsl(var(--chart-6))",
  },
  other: {
    label: "Other",
    color: "hsl(var(--chart-7))",
  },
} satisfies ChartConfig;

export default function BarrackDamagePieChart() {
  const totalVisitors = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.entries, 0);
  }, []);

  return (
    <>
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Barrack Damage - Entries</CardTitle>
          <CardDescription>Oct 2024 ~</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={chartData}
                dataKey="entries"
                nameKey="barrackDamage"
                innerRadius={60}
                strokeWidth={5}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {totalVisitors.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            Visitors
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col gap-2 text-sm">
          <div className="flex items-center gap-2 font-medium leading-none">
            Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
          </div>
          <div className="leading-none text-muted-foreground">
            Showing total visitors for the last 6 months
          </div>
        </CardFooter>
      </Card>
    </>
  );
}
