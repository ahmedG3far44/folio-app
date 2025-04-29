import { useTheme } from "@/contexts/ThemeProvider";
import ThemeCard from "../cards/ThemeCard";
import SubmitButton from "../submit-button";
import { ChangeEvent, FormEvent, useState } from "react";
import { useAuth } from "@/contexts/AuthProvider";
import toast from "react-hot-toast";
import { IThemeType } from "@/lib/types";

const URL_SERVER = import.meta.env.VITE_URL_SERVER as string;

function ThemesList() {
  const { token } = useAuth();
  const { themesList, activeTheme } = useTheme();
  const { backgroundColor, cardColor, borderColor } = activeTheme;
  const [newTheme, setNewTheme] = useState<IThemeType>({
    backgroundColor: "#121212",
    cardColor: "#1F1F1F",
    primaryText: "#E0E0E0",
    secondaryText: "#B0B0B0",
    borderColor: "#5A5A5A",
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
    console.log(name, value);

    setNewTheme((prevTheme) => ({
      ...prevTheme,
      [name]: value,
    }));
  };
  const handleAddNewTheme = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) return;
    try {
      setSubmitting({
        pending: true,
        error: null,
      });
      console.log(newTheme);
      const response = await fetch(`${URL_SERVER}/theme`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newTheme),
      });

      if (!response.ok) throw new Error("failed to add a new theme!!");

      const data = await response.json();
      console.log(data);
      // show toast success
      toast.success("a new theme was created success!!");
      // reset form
      setNewTheme({
        backgroundColor: "",
        cardColor: "",
        primaryText: "",
        secondaryText: "",
        borderColor: "",
      });

      return data;
    } catch (err) {
      console.log(err);
      toast.error((err as Error).message);
      setSubmitting({
        pending: false,
        error: (err as Error).message,
      });
    } finally {
      console.log("first");
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
        <div
          style={{ backgroundColor: cardColor }}
          className="w-full p-4 rounded-md flex justify-between items-center gap-4"
        >
          <label htmlFor="backgroundColor">Background Color</label>

          <input
            style={{ backgroundColor: cardColor, borderColor }}
            type="color"
            name="backgroundColor"
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

      <div className="grid grid-cols-3 lg:grid-cols-5 gap-2  my-4">
        {themesList.map(
          ({
            backgroundColor,
            cardColor,
            borderColor,
            primaryText,
            secondaryText,
            id,
          }) => {
            return (
              <ThemeCard
                key={id}
                id={id}
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
