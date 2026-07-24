import { useTheme } from "@/contexts/ThemeProvider";

import { easeInOut, motion } from "motion/react";

import Loader from "../loader";
import ThemeCard from "../cards/ThemeCard";

function ThemesForm() {
  const { activeTheme, themesList, switchTheme, loading } = useTheme();
  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Active Theme</h2>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader size="md" />
          </div>
        ) : (
          <div className="inline-block p-4 rounded-xl border"
            style={{
              borderColor: activeTheme.borderColor,
            }}
          >
            <ThemeCard
              id={activeTheme.id}
              themeName={activeTheme.themeName}
              backgroundColor={activeTheme.backgroundColor}
              cardColor={activeTheme.cardColor}
              primaryText={activeTheme.primaryText}
              secondaryText={activeTheme.secondaryText}
              borderColor={activeTheme.borderColor}
            />
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Available Themes</h2>
        {themesList.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {themesList.map((theme) => (
              <motion.div
                key={theme.id}
                initial={{ scale: 0.95 }}
                whileHover={{ scale: 1 }}
                transition={{ duration: 0.15, ease: easeInOut }}
                onClick={() => switchTheme({ newActiveThemeId: theme.id })}
                role="button"
                tabIndex={0}
                className="cursor-pointer rounded-xl p-3 border hover:opacity-80 duration-150"
                style={{
                  backgroundColor: activeTheme.cardColor,
                  borderColor: activeTheme.borderColor,
                }}
              >
                <ThemeCard
                  id={theme.id}
                  themeName={theme.themeName}
                  backgroundColor={theme.backgroundColor}
                  cardColor={theme.cardColor}
                  primaryText={theme.primaryText}
                  secondaryText={theme.secondaryText}
                  borderColor={theme.borderColor}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <div
            className="flex items-center justify-center py-12 rounded-xl border"
            style={{
              backgroundColor: activeTheme.cardColor,
              borderColor: activeTheme.borderColor,
              color: activeTheme.secondaryText,
            }}
          >
            <p className="text-sm">No other themes available</p>
          </div>
        )}
      </section>
    </div>
  );
}

export default ThemesForm;
