import { IThemeType } from "@/lib/types";
import { ChangeEvent, FormEvent, useState } from "react";
import { useTheme } from "@/contexts/ThemeProvider";
import { useAuth } from "@/contexts/AuthProvider";

import toast from "react-hot-toast";
import ThemeCard from "../cards/ThemeCard";
import ErrorMessage from "../ErrorMessage";
import SubmitButton from "../submit-button";

const URL_SERVER = import.meta.env.VITE_URL_SERVER as string;

function ThemesList() {
  const { token } = useAuth();
  const { themesList, setThemesList, activeTheme } = useTheme();
  const { backgroundColor, cardColor, borderColor } = activeTheme;
  const [newTheme, setNewTheme] = useState<IThemeType>({
    id: "",
    themeName: "",
    backgroundColor: "",
    cardColor: "",
    primaryText: "",
    secondaryText: "",
    borderColor: "",
  });
  const [submitting, setSubmitting] = useState<{
    pending: boolean;
    error: string | null;
  }>({
    pending: false,
    error: null,
  });
  const handleColorChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewTheme((prevTheme) => ({
      ...prevTheme,
      [name]: value,
    }));
    console.log("changed", newTheme);
  };
  const handleAddNewTheme = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) return;
    console.log(newTheme);
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

      if (!response.ok) throw new Error("failed to add a new theme!!");

      const data = await response.json();

      toast.success("a new theme was created success!!");

      setNewTheme({
        id: "",
        themeName: "",
        backgroundColor: "",
        cardColor: "",
        primaryText: "",
        secondaryText: "",
        borderColor: "",
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
    <div>
      <form
        onSubmit={handleAddNewTheme}
        className="w-full lg:1/2 p-4 border flex items-center justify-center flex-col gap-1"
        style={{ backgroundColor, borderColor }}
      >
        {submitting.error && <ErrorMessage message={submitting.error} />}

        <input
          id="themeName"
          style={{ backgroundColor: cardColor, borderColor }}
          type="text"
          name="themeName"
          value={newTheme.themeName}
          placeholder="Theme Name"
          onChange={handleColorChange}
          className="w-full p-4 rounded-md  overflow-hidden"
        />

        <div
          style={{ backgroundColor: cardColor }}
          className="w-full p-4 rounded-md flex justify-between items-center gap-4"
        >
          <label htmlFor="backgroundColor">Background Color</label>

          <input
            style={{ backgroundColor: cardColor, borderColor }}
            type="color"
            name="backgroundColor"
            value={newTheme.backgroundColor}
            onChange={handleColorChange}
            className=" overflow-hidden"
          />
        </div>

        <div
          style={{ backgroundColor: cardColor }}
          className="w-full p-4 rounded-md flex justify-between items-center gap-4"
        >
          <label htmlFor="cardColor">Cards Color</label>

          <input
            style={{ backgroundColor: cardColor, borderColor }}
            type="color"
            name="cardColor"
            value={newTheme.cardColor}
            onChange={handleColorChange}
            className=" overflow-hidden"
          />
        </div>
        <div
          style={{ backgroundColor: cardColor }}
          className="w-full p-4 rounded-md flex justify-between items-center gap-4"
        >
          <label htmlFor="borderColor">Borders Color</label>

          <input
            style={{ backgroundColor: cardColor, borderColor }}
            type="color"
            name="borderColor"
            value={newTheme.borderColor}
            onChange={handleColorChange}
            className=" overflow-hidden"
          />
        </div>
        <div
          style={{ backgroundColor: cardColor }}
          className="w-full p-4 rounded-md flex justify-between items-center gap-4"
        >
          <label htmlFor="primaryText">Primary Text Color</label>

          <input
            style={{ backgroundColor: cardColor, borderColor }}
            type="color"
            name="primaryText"
            value={newTheme.primaryText}
            onChange={handleColorChange}
            className=" overflow-hidden"
          />
        </div>
        <div
          style={{ backgroundColor: cardColor }}
          className="w-full p-4 rounded-md flex justify-between items-center gap-4"
        >
          <label htmlFor="secondaryText">Secondary Text Color</label>

          <input
            style={{ backgroundColor: cardColor, borderColor }}
            type="color"
            name="secondaryText"
            value={newTheme.secondaryText}
            onChange={handleColorChange}
            className=" overflow-hidden"
          />
        </div>

        <SubmitButton
          className="my-4 w-full"
          loading={submitting.pending}
          type="submit"
        >
          create theme
        </SubmitButton>
      </form>

      <div className="flex items-center justify-start flex-wrap gap-4  my-4">
        {themesList.map(
          (
            {
              themeName,
              backgroundColor,
              cardColor,
              borderColor,
              primaryText,
              secondaryText,
              id,
            },
            index
          ) => {
            return (
              <ThemeCard
                key={index}
                id={id}
                themeName={themeName}
                backgroundColor={backgroundColor}
                cardColor={cardColor}
                borderColor={borderColor}
                primaryText={primaryText}
                secondaryText={secondaryText}
              />
            );
          }
        )}
      </div>
    </div>
  );
}

export default ThemesList;
