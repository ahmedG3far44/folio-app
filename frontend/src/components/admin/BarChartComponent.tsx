"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Insight } from "@/lib/types";
import { useTheme } from "@/contexts/ThemeProvider";

// const chartData = [
//   { month: "January", desktop: 186, mobile: 80 },
//   { month: "February", desktop: 305, mobile: 200 },
//   { month: "March", desktop: 237, mobile: 120 },
//   { month: "April", desktop: 73, mobile: 190 },
//   { month: "May", desktop: 209, mobile: 130 },
//   { month: "June", desktop: 214, mobile: 140 },
// ];

const chartConfig = {
  name: {
    label: "Name",
    color: "#000",
  },
  value: {
    label: "Value",
    color: "#60a5fa",
  },
} satisfies ChartConfig;

export function BarChartComponent({ data }: { data: Insight[] }) {
  const { activeTheme } = useTheme();
  return (
    <ChartContainer
      style={{ color: activeTheme.primaryText }}
      config={chartConfig}
      className="min-h-[200px] w-full   m-auto "
    >
      <BarChart accessibilityLayer data={data}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="name"
          tickLine={true}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(6, -1)}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              className="bg-zinc-950 text-white border-none"
              style={{
                backgroundColor: activeTheme.cardColor,
                color: activeTheme.primaryText,
              }}
            />
          }
        />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="name" fill="purple" radius={4} />
        <Bar dataKey="value" fill="skyblue" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
