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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            style={{
              backgroundColor: activeTheme.cardColor,
              borderColor: activeTheme.borderColor,
            }}
            className="p-3 rounded-lg border"
          >
            <Activity size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Dashboard Insights</h1>
            <p style={{ color: activeTheme.secondaryText }} className="text-sm">
              Overview of your platform statistics
            </p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card
          style={{
            background: `linear-gradient(135deg, ${activeTheme.cardColor} 0%, ${activeTheme.backgroundColor} 100%)`,
            borderColor: activeTheme.borderColor,
          }}
          className="p-6 border col-span-1 sm:col-span-2 lg:col-span-1"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <p
                style={{ color: activeTheme.secondaryText }}
                className="text-sm font-medium"
              >
                Total Overview
              </p>
              <h2
                style={{ color: activeTheme.primaryText }}
                className="text-3xl font-bold mt-2"
              >
                {totalCount.toLocaleString()}
              </h2>
            </div>
            <div
              style={{ backgroundColor: activeTheme.backgroundColor }}
              className="p-3 rounded-lg"
            >
              <BarChart3 size={24} style={{ color: "#3b82f6" }} />
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
          className="p-6 border"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <p
                style={{ color: activeTheme.secondaryText }}
                className="text-sm font-medium"
              >
                Highest Category
              </p>
              <h3
                style={{ color: activeTheme.primaryText }}
                className="text-xl font-bold mt-2 capitalize"
              >
                {highestStat[0].split(/(?=[A-Z])/).join(" ")}
              </h3>
            </div>
            <div
              style={{ backgroundColor: activeTheme.backgroundColor }}
              className="p-3 rounded-lg"
            >
              <TrendingUp size={20} style={{ color: "#10b981" }} />
            </div>
          </div>
          <p className="text-2xl font-bold" style={{ color: "#10b981" }}>
            {highestStat[1].toLocaleString()}
          </p>
        </Card>
          
        <Card
          style={{
            backgroundColor: activeTheme.cardColor,
            borderColor: activeTheme.borderColor,
            color: activeTheme.primaryText,
          }}
          className="p-6 border"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <p
                style={{ color: activeTheme.secondaryText }}
                className="text-sm font-medium"
              >
                Lowest Category
              </p>
              <h3
                style={{ color: activeTheme.primaryText }}
                className="text-xl font-bold mt-2 capitalize"
              >
                {lowestStat[0].split(/(?=[A-Z])/).join(" ")}
              </h3>
            </div>
            <div
              style={{ backgroundColor: activeTheme.backgroundColor }}
              className="p-3 rounded-lg"
            >
              <Activity size={20} style={{ color: "#f59e0b" }} />
            </div>
          </div>
          <p className="text-2xl font-bold" style={{ color: "#f59e0b" }}>
            {lowestStat[1].toLocaleString()}
          </p>
        </Card>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
              className="p-5 border hover:shadow-lg transition-all duration-200 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <p
                    style={{ color: activeTheme.secondaryText }}
                    className="text-sm font-medium uppercase tracking-wide"
                  >
                    {config?.label || key}
                  </p>
                  <h2 className="text-3xl font-bold mt-2 group-hover:scale-105 transition-transform">
                    {value.toLocaleString()}
                  </h2>
                </div>
                <div
                  style={{
                    backgroundColor: config?.color + "20",
                  }}
                  className="p-3 rounded-xl"
                >
                  <Icon size={24} style={{ color: config?.color }} />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span style={{ color: activeTheme.secondaryText }}>
                    {config?.description}
                  </span>
                  <span className="font-bold" style={{ color: config?.color }}>
                    {percentage}%
                  </span>
                </div>
                <div
                  style={{ backgroundColor: activeTheme.backgroundColor }}
                  className="h-2 rounded-full overflow-hidden"
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
        <Card
          style={{
            backgroundColor: activeTheme.cardColor,
            borderColor: activeTheme.borderColor,
            color: activeTheme.primaryText,
          }}
          className="p-6 border"
        >
          <div className="mb-6">
            <h3 style={{ color: activeTheme.primaryText }} className="text-lg font-semibold flex items-center gap-2">
              <TrendingUp size={20} />
              Data Comparison
            </h3>
            <p
              style={{ color: activeTheme.secondaryText }}
              className="text-sm mt-1"
            >
              Comparative view of platform metrics
            </p>
          </div>
          <div className="w-full mx-auto max-w-full  ">
            <BarChartComponent data={listInsights} />
          </div>
        </Card>
      </div>
      <Card
        style={{
          backgroundColor: activeTheme.cardColor,
          borderColor: activeTheme.borderColor,
        }}
        className="p-6 border"
      >
        <h3
          style={{ color: activeTheme.primaryText }}
          className="text-lg font-semibold mb-4"
        >
          Detailed Breakdown
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr
                style={{
                  backgroundColor: activeTheme.backgroundColor,
                  borderColor: activeTheme.borderColor,
                  color: activeTheme.secondaryText,
                }}
                className="border-b"
              >
                <th className="text-left p-3 font-semibold text-sm">
                  Category
                </th>
                <th className="text-right p-3 font-semibold text-sm">Count</th>
                <th className="text-right p-3 font-semibold text-sm">
                  Percentage
                </th>
                <th className="text-right p-3 font-semibold text-sm">Status</th>
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
                      style={{
                        borderColor: activeTheme.borderColor,
                        color: activeTheme.primaryText,
                      }}
                      className="border-b last:border-b-0 hover:bg-opacity-50 transition-colors"
                    >
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <div
                            style={{ backgroundColor: config?.color + "20" }}
                            className="p-2 rounded-lg"
                          >
                            <Icon size={18} style={{ color: config?.color }} />
                          </div>
                          <span
                            style={{ color: activeTheme.primaryText }}
                            className="font-medium"
                          >
                            {config?.label || key}
                          </span>
                        </div>
                      </td>
                      <td
                        style={{ color: activeTheme.primaryText }}
                        className="p-3 text-right font-bold text-lg"
                      >
                        {value.toLocaleString()}
                      </td>
                      <td
                        style={{ color: activeTheme.primaryText }}
                        className="p-3 text-right"
                      >
                        <span
                          className="inline-block px-3 py-1 rounded-full text-sm font-medium"
                          style={{
                            backgroundColor: config?.color + "20",
                            color: activeTheme.primaryText,
                          }}
                        >
                          {percentage}%
                        </span>
                      </td>
                      <td
                        style={{ color: activeTheme.primaryText }}
                        className="p-3 text-right"
                      >
                        {index === 0 && (
                          <span
                            style={{ color: "#10b981" }}
                            className="inline-flex items-center gap-1 text-sm font-medium"
                          >
                            <TrendingUp size={14} />
                            Highest
                          </span>
                        )}
                        {index === Object.entries(insights).length - 1 && (
                          <span
                            className="inline-flex items-center gap-1 text-sm font-medium"
                            style={{ color: "#f59e0b" }}
                          >
                            <Activity size={14} />
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
      </Card>
    </div>
  );
}

export default Insights;
