import { useEffect, useState } from "react";
import { useTheme } from "@/contexts/ThemeProvider";
import { useAdmin } from "@/contexts/AdminProvider";
import { Card } from "../ui/card";
import { BarChartComponent } from "./BarChartComponent";
import { Insight } from "@/lib/types";
import Loader from "../loader";
import {
  Box,
  MessageCircle,
  PaintBucket,
  Pencil,
  Paperclip,
  Users,
  TrendingUp,
  Activity,
  BarChart3,
} from "lucide-react";

const statConfig = {
  projects: {
    icon: Box,
    label: "Projects",
    description: "Total number of projects",
    color: "#3b82f6",
  },
  feedbacks: {
    icon: MessageCircle,
    label: "Feedbacks",
    description: "Total number of feedbacks",
    color: "#8b5cf6",
  },
  totalThemes: {
    icon: PaintBucket,
    label: "Themes",
    description: "Total number of themes",
    color: "#ec4899",
  },
  totalSkills: {
    icon: Pencil,
    label: "Skills",
    description: "Total number of skills",
    color: "#10b981",
  },
  totalExperiences: {
    icon: Paperclip,
    label: "Experiences",
    description: "Total number of experiences",
    color: "#f59e0b",
  },
  totalUsers: {
    icon: Users,
    label: "Users",
    description: "Total number of users",
    color: "#06b6d4",
  },
};

function Insights() {
  const { insights, loading } = useAdmin();
  const { activeTheme } = useTheme();
  const [listInsights, setListInsights] = useState<Insight[]>([]);

  useEffect(() => {
    const newInsights = Object.entries(insights).map(([key, value]) => ({
      name: key.toLocaleUpperCase(),
      value,
    }));
    setListInsights(newInsights);
  }, [insights]);

  const totalCount = Object.values(insights).reduce((acc, val) => acc + val, 0);

  const sortedStats = Object.entries(insights).sort((a, b) => b[1] - a[1]);
  const highestStat = sortedStats[0];
  const lowestStat = sortedStats[sortedStats.length - 1];

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <Loader size="md" />
      </div>
    );

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div>
          <h1 className="text-xl font-bold">Insights</h1>
          <p style={{ color: activeTheme.secondaryText }} className="text-sm">
            Overview of platform statistics
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card
          style={{
            backgroundColor: activeTheme.cardColor,
            borderColor: activeTheme.borderColor,
            color: activeTheme.primaryText,
          }}
          className="p-5 border"
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <p
                style={{ color: activeTheme.secondaryText }}
                className="text-xs font-medium uppercase tracking-wide"
              >
                Total
              </p>
              <p className="text-2xl font-bold mt-1">
                {totalCount.toLocaleString()}
              </p>
            </div>
            <div
              style={{ backgroundColor: activeTheme.backgroundColor }}
              className="p-2.5 rounded-lg"
            >
              <BarChart3 size={20} style={{ color: statConfig.projects.color }} />
            </div>
          </div>
          <p style={{ color: activeTheme.secondaryText }} className="text-xs">
            Combined total across all categories
          </p>
        </Card>

        <Card
          style={{
            backgroundColor: activeTheme.cardColor,
            borderColor: activeTheme.borderColor,
            color: activeTheme.primaryText,
          }}
          className="p-5 border"
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <p
                style={{ color: activeTheme.secondaryText }}
                className="text-xs font-medium uppercase tracking-wide"
              >
                Highest
              </p>
              <p className="text-lg font-bold mt-1 capitalize">
                {highestStat[0].split(/(?=[A-Z])/).join(" ")}
              </p>
            </div>
            <div
              style={{ backgroundColor: activeTheme.backgroundColor }}
              className="p-2.5 rounded-lg"
            >
              <TrendingUp size={18} style={{ color: "#10b981" }} />
            </div>
          </div>
          <p className="text-xl font-bold" style={{ color: "#10b981" }}>
            {highestStat[1].toLocaleString()}
          </p>
        </Card>

        <Card
          style={{
            backgroundColor: activeTheme.cardColor,
            borderColor: activeTheme.borderColor,
            color: activeTheme.primaryText,
          }}
          className="p-5 border"
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <p
                style={{ color: activeTheme.secondaryText }}
                className="text-xs font-medium uppercase tracking-wide"
              >
                Lowest
              </p>
              <p className="text-lg font-bold mt-1 capitalize">
                {lowestStat[0].split(/(?=[A-Z])/).join(" ")}
              </p>
            </div>
            <div
              style={{ backgroundColor: activeTheme.backgroundColor }}
              className="p-2.5 rounded-lg"
            >
              <Activity size={18} style={{ color: "#f59e0b" }} />
            </div>
          </div>
          <p className="text-xl font-bold" style={{ color: "#f59e0b" }}>
            {lowestStat[1].toLocaleString()}
          </p>
        </Card>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {Object.entries(insights).map(([key, value]) => {
          const config = statConfig[key as keyof typeof statConfig];
          const Icon = config?.icon || Box;
          const percentage =
            totalCount > 0 ? ((value / totalCount) * 100).toFixed(1) : 0;

          return (
            <Card
              key={key}
              style={{
                backgroundColor: activeTheme.cardColor,
                borderColor: activeTheme.borderColor,
                color: activeTheme.primaryText,
              }}
              className="p-4 border"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <p
                    style={{ color: activeTheme.secondaryText }}
                    className="text-xs font-medium uppercase tracking-wide"
                  >
                    {config?.label || key}
                  </p>
                  <p className="text-2xl font-bold mt-1">
                    {value.toLocaleString()}
                  </p>
                </div>
                <div
                  style={{ backgroundColor: activeTheme.backgroundColor }}
                  className="p-2 rounded-lg shrink-0"
                >
                  <Icon size={18} style={{ color: config?.color }} />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span style={{ color: activeTheme.secondaryText }}>
                    {percentage}% of total
                  </span>
                </div>
                <div
                  style={{ backgroundColor: activeTheme.backgroundColor }}
                  className="h-1.5 rounded-full overflow-hidden"
                >
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: config?.color,
                    }}
                  />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div
          style={{
            backgroundColor: activeTheme.cardColor,
            borderColor: activeTheme.borderColor,
          }}
          className="p-5 rounded-lg border"
        >
          <h3
            style={{ color: activeTheme.primaryText }}
            className="text-sm font-semibold flex items-center gap-2 mb-4"
          >
            <TrendingUp size={16} />
            Data Comparison
          </h3>
          <div className="w-full">
            <BarChartComponent data={listInsights} />
          </div>
        </div>

        <div
          style={{
            backgroundColor: activeTheme.cardColor,
            borderColor: activeTheme.borderColor,
          }}
          className="p-5 rounded-lg border"
        >
          <h3
            style={{ color: activeTheme.primaryText }}
            className="text-sm font-semibold mb-4"
          >
            Detailed Breakdown
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr
                  style={{ borderColor: activeTheme.borderColor }}
                  className="border-b"
                >
                  <th
                    className="text-left pb-2 font-medium text-xs uppercase tracking-wide"
                    style={{ color: activeTheme.secondaryText }}
                  >
                    Category
                  </th>
                  <th
                    className="text-right pb-2 font-medium text-xs uppercase tracking-wide"
                    style={{ color: activeTheme.secondaryText }}
                  >
                    Count
                  </th>
                  <th
                    className="text-right pb-2 font-medium text-xs uppercase tracking-wide"
                    style={{ color: activeTheme.secondaryText }}
                  >
                    %
                  </th>
                  <th
                    className="text-right pb-2 font-medium text-xs uppercase tracking-wide"
                    style={{ color: activeTheme.secondaryText }}
                  >
                    Rank
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(insights)
                  .sort((a, b) => b[1] - a[1])
                  .map(([key, value], index) => {
                    const config = statConfig[key as keyof typeof statConfig];
                    const Icon = config?.icon || Box;
                    const percentage =
                      totalCount > 0
                        ? ((value / totalCount) * 100).toFixed(1)
                        : 0;

                    return (
                      <tr
                        key={key}
                        style={{ borderColor: activeTheme.borderColor, color: activeTheme.primaryText }}
                        className="border-b last:border-b-0"
                      >
                        <td className="py-3 pr-3">
                          <div className="flex items-center gap-2.5">
                            <div
                              style={{ backgroundColor: activeTheme.backgroundColor }}
                              className="p-1.5 rounded-md"
                            >
                              <Icon size={14} style={{ color: config?.color }} />
                            </div>
                            <span className="font-medium text-sm">
                              {config?.label || key}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-right font-semibold">
                          {value.toLocaleString()}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <span
                            className="text-xs font-medium"
                            style={{ color: config?.color }}
                          >
                            {percentage}%
                          </span>
                        </td>
                        <td className="py-3 pl-3 text-right">
                          {index === 0 && (
                            <span
                              style={{ color: "#10b981" }}
                              className="inline-flex items-center gap-1 text-xs font-medium"
                            >
                              <TrendingUp size={12} />
                              Highest
                            </span>
                          )}
                          {index === Object.entries(insights).length - 1 && (
                            <span
                              className="inline-flex items-center gap-1 text-xs font-medium"
                              style={{ color: "#f59e0b" }}
                            >
                              <Activity size={12} />
                              Lowest
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Insights;
