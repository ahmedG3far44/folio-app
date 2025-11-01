import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
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

export function BarChartComponent({ data }: { data: Insight[] }) {
  const { activeTheme } = useTheme();

  const chartConfig = {
    name: {
      label: "Name",
      color: activeTheme.primaryText,
    },
    value: {
      label: "Value",
      color: "#3b82f6",
    },
  } satisfies ChartConfig;

  const isDarkTheme =
    activeTheme.backgroundColor.startsWith("#0") ||
    activeTheme.backgroundColor.startsWith("#1") ||
    activeTheme.backgroundColor.startsWith("#2");

  const primaryBarColor = isDarkTheme ? "#8b5cf6" : "#7c3aed";
  const secondaryBarColor = isDarkTheme ? "#60a5fa" : "#3b82f6";

  return (
    <div className="w-full">
      <ChartContainer
        config={chartConfig}
        className="min-h-[200px] sm:min-h-[250px] md:min-h-[300px] lg:min-h-[350px] w-full"
      >
        <BarChart
          accessibilityLayer
          data={data}
          margin={{
            top: 20,
            right: 12,
            bottom: 20,
            left: 12,
          }}
        >
          <CartesianGrid
            vertical={false}
            stroke={activeTheme.borderColor}
            strokeDasharray="3 3"
            opacity={0.3}
          />

          <XAxis
            dataKey="name"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tick={{
              fill: activeTheme.secondaryText,
              fontSize: 12,
            }}
            tickFormatter={(value) => {
              if (typeof value === "string" && value.length > 10) {
                return value.slice(0, 8) + "...";
              }
              return value;
            }}
          />

          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{
              fill: activeTheme.secondaryText,
              fontSize: 12,
            }}
            width={40}
          />

          <ChartTooltip
            content={
              <ChartTooltipContent
                style={{
                  backgroundColor: activeTheme.cardColor,
                  color: activeTheme.primaryText,
                  borderColor: activeTheme.borderColor,
                  borderWidth: "1px",
                  borderRadius: "8px",
                  boxShadow: isDarkTheme
                    ? "0 4px 6px -1px rgb(0 0 0 / 0.3)"
                    : "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
                labelStyle={{
                  color: activeTheme.primaryText,
                  fontWeight: 600,
                }}
                itemStyle={{
                  color: activeTheme.secondaryText,
                }}
              />
            }
            cursor={{
              fill: activeTheme.borderColor,
              opacity: 0.1,
            }}
          />
          <ChartLegend
            content={
              <ChartLegendContent
                style={{
                  color: activeTheme.secondaryText,
                }}
              />
            }
          />

          <Bar
            dataKey="name"
            fill={primaryBarColor}
            radius={[6, 6, 0, 0]}
            maxBarSize={60}
            animationDuration={800}
          />
          <Bar
            dataKey="value"
            fill={secondaryBarColor}
            radius={[6, 6, 0, 0]}
            maxBarSize={60}
            animationDuration={800}
          />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
