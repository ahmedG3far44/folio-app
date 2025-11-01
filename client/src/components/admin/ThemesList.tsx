import { IThemeType } from "@/lib/types";
import { ChangeEvent, useState, useMemo, ReactNode } from "react";
import { useTheme } from "@/contexts/ThemeProvider";
import { useAuth } from "@/contexts/AuthProvider";
import toast from "react-hot-toast";
import ThemeCard from "../cards/ThemeCard";
import ErrorMessage from "../ErrorMessage";
import Loader from "../loader";
import { Palette, Plus, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "../ui/button";

const URL_SERVER = import.meta.env.VITE_URL_SERVER as string;

function getContrastRatio(color1: string, color2: string): number {
  const getLuminance = (color: string) => {
    const hex = color.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;

    const [rs, gs, bs] = [r, g, b].map((val) => {
      return val <= 0.03928
        ? val / 12.92
        : Math.pow((val + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
}

function getContrastRating(ratio: number): {
  text: string;
  color: string;
  icon: ReactNode;
} {
  if (ratio >= 7) {
    return {
      text: "Excellent (AAA)",
      color: "#10b981",
      icon: <CheckCircle2 size={16} />,
    };
  } else if (ratio >= 4.5) {
    return {
      text: "Good (AA)",
      color: "#3b82f6",
      icon: <CheckCircle2 size={16} />,
    };
  } else if (ratio >= 3) {
    return {
      text: "Fair (AA Large)",
      color: "#f59e0b",
      icon: <AlertCircle size={16} />,
    };
  } else {
    return {
      text: "Poor (Fails WCAG)",
      color: "#ef4444",
      icon: <AlertCircle size={16} />,
    };
  }
}

function ThemesList() {
  const { token } = useAuth();
  const { themesList, setThemesList, activeTheme, loading } = useTheme();
  const [newTheme, setNewTheme] = useState<IThemeType>({
    id: "",
    themeName: "",
    backgroundColor: "#ffffff",
    cardColor: "#f3f4f6",
    primaryText: "#1f2937",
    secondaryText: "#6b7280",
    borderColor: "#e5e7eb",
  });
  const [submitting, setSubmitting] = useState<{
    pending: boolean;
    error: string | null;
  }>({
    pending: false,
    error: null,
  });

  const contrastData = useMemo(() => {
    const bgCardRatio = getContrastRatio(
      newTheme.backgroundColor,
      newTheme.cardColor
    );
    const primaryTextBgRatio = getContrastRatio(
      newTheme.primaryText,
      newTheme.backgroundColor
    );
    const secondaryTextBgRatio = getContrastRatio(
      newTheme.secondaryText,
      newTheme.backgroundColor
    );
    const primaryTextCardRatio = getContrastRatio(
      newTheme.primaryText,
      newTheme.cardColor
    );

    return {
      bgCard: { ratio: bgCardRatio, ...getContrastRating(bgCardRatio) },
      primaryTextBg: {
        ratio: primaryTextBgRatio,
        ...getContrastRating(primaryTextBgRatio),
      },
      secondaryTextBg: {
        ratio: secondaryTextBgRatio,
        ...getContrastRating(secondaryTextBgRatio),
      },
      primaryTextCard: {
        ratio: primaryTextCardRatio,
        ...getContrastRating(primaryTextCardRatio),
      },
    };
  }, [newTheme]);

  const handleColorChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewTheme((prevTheme) => ({
      ...prevTheme,
      [name]: value,
    }));
  };

  const handleAddNewTheme = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      setSubmitting({
        pending: true,
        error: null,
      });

      const {
        themeName,
        backgroundColor,
        cardColor,
        primaryText,
        secondaryText,
        borderColor,
      } = newTheme;

      const response = await fetch(`${URL_SERVER}/admin/themes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          themeName,
          backgroundColor,
          cardColor,
          primaryText,
          secondaryText,
          borderColor,
        }),
      });

      if (!response.ok) throw new Error("Failed to add a new theme!");

      const data = await response.json();

      toast.success("New theme created successfully!");

      setNewTheme({
        id: "",
        themeName: "",
        backgroundColor: "#ffffff",
        cardColor: "#f3f4f6",
        primaryText: "#1f2937",
        secondaryText: "#6b7280",
        borderColor: "#e5e7eb",
      });

      setThemesList(data.data);
      return data;
    } catch (err) {
      toast.error((err as Error).message);
      setSubmitting({
        pending: false,
        error: (err as Error).message,
      });
    } finally {
      setSubmitting({
        pending: false,
        error: null,
      });
    }
  };

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
            <Palette size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Theme Manager</h1>
            <p style={{ color: activeTheme.secondaryText }} className="text-sm">
              {themesList.length} theme{themesList.length !== 1 ? "s" : ""}{" "}
              available
            </p>
          </div>
        </div>
      </div>

      <div
        style={{
          backgroundColor: activeTheme.backgroundColor,
          borderColor: activeTheme.borderColor,
        }}
        className="p-6 border rounded-lg"
      >
        <div className="flex items-center gap-2 mb-6">
          <Plus size={20} />
          <h2 className="text-xl font-semibold">Create New Theme</h2>
        </div>

        <div className="space-y-4">
          {submitting.error && <ErrorMessage message={submitting.error} />}

          <div>
            <label className="block text-sm font-medium mb-2">Theme Name</label>
            <input
              style={{
                backgroundColor: activeTheme.cardColor,
                borderColor: activeTheme.borderColor,
                color: activeTheme.primaryText,
              }}
              type="text"
              name="themeName"
              value={newTheme.themeName}
              placeholder="Enter theme name (e.g., Dark Mode, Ocean Blue)"
              onChange={handleColorChange}
              className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-offset-0 outline-none transition-all"
            />
          </div>

          {newTheme.themeName && (
            <div
              style={{
                backgroundColor: newTheme.backgroundColor,
                borderColor: newTheme.borderColor,
              }}
              className="p-6 rounded-lg border"
            >
              <h3
                style={{ color: newTheme.primaryText }}
                className="text-lg font-bold mb-2"
              >
                {newTheme.themeName}
              </h3>
              <p
                style={{ color: newTheme.secondaryText }}
                className="text-sm mb-4"
              >
                Live preview of your theme
              </p>
              <div
                style={{
                  backgroundColor: newTheme.cardColor,
                  borderColor: newTheme.borderColor,
                }}
                className="p-4 rounded-lg border"
              >
                <p
                  style={{ color: newTheme.primaryText }}
                  className="font-medium"
                >
                  Primary Text on Card
                </p>
                <p
                  style={{ color: newTheme.secondaryText }}
                  className="text-sm"
                >
                  Secondary text on card
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              style={{
                backgroundColor: activeTheme.cardColor,
                borderColor: activeTheme.borderColor,
              }}
              className="p-4 rounded-lg border"
            >
              <label className="block text-sm font-medium mb-3">
                Background Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  name="backgroundColor"
                  value={newTheme.backgroundColor}
                  onChange={handleColorChange}
                  className="w-16 h-16 rounded-lg cursor-pointer border-2"
                  style={{ borderColor: activeTheme.borderColor }}
                />
                <div className="flex-1">
                  <input
                    type="text"
                    value={newTheme.backgroundColor}
                    onChange={(e) =>
                      handleColorChange({
                        target: {
                          name: "backgroundColor",
                          value: e.target.value,
                        },
                      } as ChangeEvent<HTMLInputElement>)
                    }
                    className="w-full px-3 py-2 rounded-md border font-mono text-sm"
                    style={{
                      backgroundColor: activeTheme.backgroundColor,
                      borderColor: activeTheme.borderColor,
                    }}
                    placeholder="#ffffff"
                  />
                  <div
                    className="w-full h-8 mt-2 rounded-md border"
                    style={{
                      backgroundColor: newTheme.backgroundColor,
                      borderColor: activeTheme.borderColor,
                    }}
                  />
                </div>
              </div>
            </div>

            <div
              style={{
                backgroundColor: activeTheme.cardColor,
                borderColor: activeTheme.borderColor,
              }}
              className="p-4 rounded-lg border"
            >
              <label className="block text-sm font-medium mb-3">
                Card Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  name="cardColor"
                  value={newTheme.cardColor}
                  onChange={handleColorChange}
                  className="w-16 h-16 rounded-lg cursor-pointer border-2"
                  style={{ borderColor: activeTheme.borderColor }}
                />
                <div className="flex-1">
                  <input
                    type="text"
                    value={newTheme.cardColor}
                    onChange={(e) =>
                      handleColorChange({
                        target: { name: "cardColor", value: e.target.value },
                      } as ChangeEvent<HTMLInputElement>)
                    }
                    className="w-full px-3 py-2 rounded-md border font-mono text-sm"
                    style={{
                      backgroundColor: activeTheme.backgroundColor,
                      borderColor: activeTheme.borderColor,
                    }}
                    placeholder="#f3f4f6"
                  />
                  <div
                    className="w-full h-8 mt-2 rounded-md border"
                    style={{
                      backgroundColor: newTheme.cardColor,
                      borderColor: activeTheme.borderColor,
                    }}
                  />
                </div>
              </div>
            </div>

            <div
              style={{
                backgroundColor: activeTheme.cardColor,
                borderColor: activeTheme.borderColor,
              }}
              className="p-4 rounded-lg border"
            >
              <label className="block text-sm font-medium mb-3">
                Border Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  name="borderColor"
                  value={newTheme.borderColor}
                  onChange={handleColorChange}
                  className="w-16 h-16 rounded-lg cursor-pointer border-2"
                  style={{ borderColor: activeTheme.borderColor }}
                />
                <div className="flex-1">
                  <input
                    type="text"
                    value={newTheme.borderColor}
                    onChange={(e) =>
                      handleColorChange({
                        target: { name: "borderColor", value: e.target.value },
                      } as ChangeEvent<HTMLInputElement>)
                    }
                    className="w-full px-3 py-2 rounded-md border font-mono text-sm"
                    style={{
                      backgroundColor: activeTheme.backgroundColor,
                      borderColor: activeTheme.borderColor,
                    }}
                    placeholder="#e5e7eb"
                  />
                  <div
                    className="w-full h-8 mt-2 rounded-md border-4"
                    style={{
                      backgroundColor: activeTheme.backgroundColor,
                      borderColor: newTheme.borderColor,
                    }}
                  />
                </div>
              </div>
            </div>

            <div
              style={{
                backgroundColor: activeTheme.cardColor,
                borderColor: activeTheme.borderColor,
              }}
              className="p-4 rounded-lg border"
            >
              <label className="block text-sm font-medium mb-3">
                Primary Text Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  name="primaryText"
                  value={newTheme.primaryText}
                  onChange={handleColorChange}
                  className="w-16 h-16 rounded-lg cursor-pointer border-2"
                  style={{ borderColor: activeTheme.borderColor }}
                />
                <div className="flex-1">
                  <input
                    type="text"
                    value={newTheme.primaryText}
                    onChange={(e) =>
                      handleColorChange({
                        target: { name: "primaryText", value: e.target.value },
                      } as ChangeEvent<HTMLInputElement>)
                    }
                    className="w-full px-3 py-2 rounded-md border font-mono text-sm"
                    style={{
                      backgroundColor: activeTheme.backgroundColor,
                      borderColor: activeTheme.borderColor,
                    }}
                    placeholder="#1f2937"
                  />
                  <div
                    className="w-full h-8 mt-2 rounded-md border flex items-center justify-center font-bold"
                    style={{
                      backgroundColor: activeTheme.backgroundColor,
                      color: newTheme.primaryText,
                      borderColor: activeTheme.borderColor,
                    }}
                  >
                    Sample Text
                  </div>
                </div>
              </div>
            </div>
            <div
              style={{
                backgroundColor: activeTheme.cardColor,
                borderColor: activeTheme.borderColor,
              }}
              className="p-4 rounded-lg border md:col-span-2"
            >
              <label className="block text-sm font-medium mb-3">
                Secondary Text Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  name="secondaryText"
                  value={newTheme.secondaryText}
                  onChange={handleColorChange}
                  className="w-16 h-16 rounded-lg cursor-pointer border-2"
                  style={{ borderColor: activeTheme.borderColor }}
                />
                <div className="flex-1">
                  <input
                    type="text"
                    value={newTheme.secondaryText}
                    onChange={(e) =>
                      handleColorChange({
                        target: {
                          name: "secondaryText",
                          value: e.target.value,
                        },
                      } as ChangeEvent<HTMLInputElement>)
                    }
                    className="w-full px-3 py-2 rounded-md border font-mono text-sm"
                    style={{
                      backgroundColor: activeTheme.backgroundColor,
                      borderColor: activeTheme.borderColor,
                    }}
                    placeholder="#6b7280"
                  />
                  <div
                    className="w-full h-8 mt-2 rounded-md border flex items-center justify-center text-sm"
                    style={{
                      backgroundColor: activeTheme.backgroundColor,
                      color: newTheme.secondaryText,
                      borderColor: activeTheme.borderColor,
                    }}
                  >
                    Secondary Sample Text
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              backgroundColor: activeTheme.cardColor,
              borderColor: activeTheme.borderColor,
            }}
            className="p-5 rounded-lg border"
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <AlertCircle size={20} />
              Accessibility Contrast Checker
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Background vs Card</span>
                  <span className="font-mono font-bold">
                    {contrastData.bgCard.ratio.toFixed(2)}:1
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium"
                    style={{
                      backgroundColor: contrastData.bgCard.color + "20",
                      color: contrastData.bgCard.color,
                    }}
                  >
                    {contrastData.bgCard.icon}
                    {contrastData.bgCard.text}
                  </div>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all duration-300"
                    style={{
                      width: `${Math.min(
                        (contrastData.bgCard.ratio / 21) * 100,
                        100
                      )}%`,
                      backgroundColor: contrastData.bgCard.color,
                    }}
                  />
                </div>
              </div>

              {/* Primary Text vs Background */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Primary Text vs Background</span>
                  <span className="font-mono font-bold">
                    {contrastData.primaryTextBg.ratio.toFixed(2)}:1
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium"
                    style={{
                      backgroundColor: contrastData.primaryTextBg.color + "20",
                      color: contrastData.primaryTextBg.color,
                    }}
                  >
                    {contrastData.primaryTextBg.icon}
                    {contrastData.primaryTextBg.text}
                  </div>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all duration-300"
                    style={{
                      width: `${Math.min(
                        (contrastData.primaryTextBg.ratio / 21) * 100,
                        100
                      )}%`,
                      backgroundColor: contrastData.primaryTextBg.color,
                    }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Secondary Text vs Background</span>
                  <span className="font-mono font-bold">
                    {contrastData.secondaryTextBg.ratio.toFixed(2)}:1
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium"
                    style={{
                      backgroundColor:
                        contrastData.secondaryTextBg.color + "20",
                      color: contrastData.secondaryTextBg.color,
                    }}
                  >
                    {contrastData.secondaryTextBg.icon}
                    {contrastData.secondaryTextBg.text}
                  </div>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all duration-300"
                    style={{
                      width: `${Math.min(
                        (contrastData.secondaryTextBg.ratio / 21) * 100,
                        100
                      )}%`,
                      backgroundColor: contrastData.secondaryTextBg.color,
                    }}
                  />
                </div>
              </div>

              {/* Primary Text vs Card */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Primary Text vs Card</span>
                  <span className="font-mono font-bold">
                    {contrastData.primaryTextCard.ratio.toFixed(2)}:1
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium"
                    style={{
                      backgroundColor:
                        contrastData.primaryTextCard.color + "20",
                      color: contrastData.primaryTextCard.color,
                    }}
                  >
                    {contrastData.primaryTextCard.icon}
                    {contrastData.primaryTextCard.text}
                  </div>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all duration-300"
                    style={{
                      width: `${Math.min(
                        (contrastData.primaryTextCard.ratio / 21) * 100,
                        100
                      )}%`,
                      backgroundColor: contrastData.primaryTextCard.color,
                    }}
                  />
                </div>
              </div>
            </div>
            <p
              style={{ color: activeTheme.secondaryText }}
              className="text-xs mt-4"
            >
              WCAG 2.1 Guidelines: AAA (7:1) for body text, AA (4.5:1) for
              normal text, AA Large (3:1) for large text (18pt+)
            </p>
          </div>

          <Button
            className="w-full cursor-pointer"
            type="submit"
            style={{
              backgroundColor: activeTheme.backgroundColor,
              borderColor: activeTheme.borderColor,
              color: activeTheme.primaryText,
            }}
            onClick={handleAddNewTheme}
            disabled={submitting.pending}
            variant="default"
          >
            <Plus size={20} />
            Create Theme
          </Button>
        </div>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-4">Existing Themes</h2>
        {loading ? (
          <div className="w-full min-h-[200px] flex items-center justify-center">
            <Loader size="md" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {themesList.map((theme) => (
              <ThemeCard
                key={theme.id}
                id={theme.id}
                themeName={theme.themeName}
                backgroundColor={theme.backgroundColor}
                cardColor={theme.cardColor}
                borderColor={theme.borderColor}
                primaryText={theme.primaryText}
                secondaryText={theme.secondaryText}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ThemesList;
