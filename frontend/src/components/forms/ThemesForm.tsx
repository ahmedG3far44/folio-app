import { useTheme } from "@/contexts/ThemeProvider"; // import { Card } from "../ui/card";
import ThemeCard from "../cards/ThemeCard";
import { easeInOut, motion } from "motion/react";

function ThemesForm() {
  const { activeTheme, themesList, switchTheme } = useTheme();
  return (
    <div className="w-full space-y-4">
      <div className="w-fit p-4 space-y-8">
        <h1 className="text-3xl font-black">Active Theme</h1>
        <ThemeCard
          id={activeTheme.id}
          backgroundColor={activeTheme.backgroundColor}
          cardColor={activeTheme.cardColor}
          primaryText={activeTheme.primaryText}
          secondaryText={activeTheme.secondaryText}
          borderColor={activeTheme.borderColor}
        />
      </div>

      <h1 className="p-4 text-2xl font-semibold">Available Themes</h1>
      <div className="p-4 flex justify-start items-start flex-wrap gap-4 w-3/4">
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
    </div>
  );
}

export default ThemesForm;
