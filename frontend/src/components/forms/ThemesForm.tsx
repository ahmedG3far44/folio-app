import { useTheme } from "@/contexts/ThemeProvider"; 

import { Card } from "../ui/card";

import { easeInOut, motion } from "motion/react";

import Loader from "../loader";
import ThemeCard from "../cards/ThemeCard";

function ThemesForm() {
  const { activeTheme, themesList, switchTheme, loading } = useTheme();
  return (
    <div className="w-full space-y-4">
      <div className="w-fit p-4 space-y-8">
        <h1 className="text-lg lg:text-2xl font-semibold">Active Theme</h1>
        <>
          {loading ? (
            <div className="w-full flex items-center justify-center ">
              <Loader size="md" />
            </div>
          ) : (
            <ThemeCard
              id={activeTheme.id}
              themeName={activeTheme.themeName}
              backgroundColor={activeTheme.backgroundColor}
              cardColor={activeTheme.cardColor}
              primaryText={activeTheme.primaryText}
              secondaryText={activeTheme.secondaryText}
              borderColor={activeTheme.borderColor}
            />
          )}
        </>
      </div>

      <div className="p-4 flex justify-start flex-col items-start flex-wrap gap-4 w-3/4">
        <h1 className="p-4 text-lg lg:text-2xl font-semibold">Available Themes</h1>
        {themesList?.length > 0 ? (
          <div className="grid place-items-center grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2  my-4">
            {themesList.map((theme) => {
              return (
                <motion.div
                  initial={{ scale: 0.9 }}
                  whileHover={{ scale: 1 }}
                  transition={{ duration: 0.1, ease: easeInOut }}
                  onClick={() => switchTheme({ newActiveTheme: theme })}
                  role="button"
                  className="cursor-pointer duration-150 hover:opacity-75"
                  key={theme.id}
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
              );
            })}
          </div>
        ) : (
          <Card className="p-4 flex justify-center items-center">
            <p
              style={{ color: activeTheme.secondaryText }}
              className="text-sm font-semibold"
            >
              There is no other themes are available right now
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}

export default ThemesForm;
