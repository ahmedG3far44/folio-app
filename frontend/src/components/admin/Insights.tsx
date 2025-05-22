import { useEffect, useState } from "react";
import { useTheme } from "@/contexts/ThemeProvider";
import { useAdmin } from "@/contexts/AdminProvider";

import { Card } from "../ui/card";
import { BarChartComponent } from "./BarChartComponent";
import { Insight } from "@/lib/types";

import Loader from "../loader";

// import { PieChartComponent } from "./PieChartComponent";
import {
  LucideBoxes,
  LucideMessageCircle,
  LucidePaintRoller,
  LucidePaperclip,
  LucidePencil,
  LucideUsers,
} from "lucide-react";

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

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <Loader size="md" />
      </div>
    );
  return (
    <div className="flex flex-col gap-4  lg:gap-8">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-4">
        {Object.entries(insights).map(([key, value]) => (
          <Card
            style={{
              backgroundColor: activeTheme.cardColor,
              color: activeTheme.primaryText,
              borderColor: activeTheme.borderColor,
            }}
            className={
              "flex items-start justify-between shadow-md border relative"
            }
            key={key}
          >
            <div className="flex flex-col items-start justify-center gap-1">
              <h1 className="font-bold">
                {key.split("_").join(" ").toUpperCase()}
              </h1>
              <h1 className="font-bold text-2xl">{value.toLocaleString()}</h1>
              <p
                style={{ color: activeTheme.secondaryText }}
                className="text-sm"
              >
                {key === "projects" && "The total number of projects"}
                {key === "feedbacks" && "The total number of feedbacks"}
                {key === "totalThemes" && "The total number of themes"}
                {key === "totalSkills" && "The total number of skills"}
                {key === "totalExperiences" &&
                  "The total number of experiences"}
                {key === "totalUsers" && "The total number of users"}
              </p>
            </div>
            <div
              style={{ color: activeTheme.secondaryText }}
              className="absolute top-5 right-5 flex items-center justify-center gap-4"
            >
              {key === "projects" && <LucideBoxes size={20} />}
              {key === "feedbacks" && <LucideMessageCircle size={20} />}
              {key === "totalThemes" && <LucidePaintRoller size={20} />}
              {key === "totalSkills" && <LucidePencil size={20} />}
              {key === "totalExperiences" && <LucidePaperclip size={20} />}
              {key === "totalUsers" && <LucideUsers size={20} />}
            </div>
          </Card>
        ))}
      </div>
      <div className="w-full flex flex-wrap lg:flex-nowrap items-center justify-center gap-4">
        <Card className="p-4 flex-1 flex items-center justify-center">
          <BarChartComponent data={listInsights} />
        </Card>
        <Card className="p-4 flex-1 flex items-center justify-center">
          <BarChartComponent data={listInsights} />
        </Card>
      </div>
    </div>
  );
}

export default Insights;
