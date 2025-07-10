import { useState } from "react";
import { IThemeType } from "@/lib/types";

import { useAuth } from "@/contexts/AuthProvider";
import { useTheme } from "@/contexts/ThemeProvider";

import {  LucideX } from "lucide-react";

import toast from "react-hot-toast";
import Loader from "../loader";


const URL_SERVER = import.meta.env.VITE_URL_SERVER as string;

function ThemeCard({
  id,
  themeName,
  backgroundColor,
  cardColor,
  primaryText,
  secondaryText,
  borderColor,
}: IThemeType) {
  const { activeTheme, setThemesList } = useTheme();
  const { isAdmin, token } = useAuth();

  const [pending, setPending] = useState(false);
  const handleDeleteTheme = async (themeId: string) => {
    if (!isAdmin) return;
    try {
      setPending(true);
      const response = await fetch(`${URL_SERVER}/theme/${themeId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete theme");
      }

      const data = await response.json();
      console.log(data.data);
      setThemesList([...data.data])
      toast.success(data.message);
      
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setPending(false);
    }
  };
  return (
    <div className="flex flex-col items-start justify-start gap-2 hover:scale-95 duration-150 ">
      <h2>{themeName}</h2>
      <div
        style={{
          border: `1px solid ${activeTheme.borderColor}`,
        }}
        className="flex items-center justify-center gap-1  p-2  rounded-md relative"
      >
        {isAdmin && (
          <span className="rounded-full absolute -right-2 -top-2 text-xs shadow-md hover:bg-red-700 duration-150 cursor-pointer p-1 bg-red-500">
            <LucideX
              className="w-4 h-4 cursor-pointer"
              onClick={() => handleDeleteTheme(id as string)}
            />
          </span>
        )}
        <>
          {pending ? (
            <Loader size={"sm"} />
          ) : (
            <>
              <div
                className="w-10 h-8 border border-zinc-800 rounded-tl-md rounded-bl-md"
                style={{
                  backgroundColor: backgroundColor,
                }}
              ></div>
              <div
                className="w-10 h-8 border border-zinc-800"
                style={{
                  backgroundColor: cardColor,
                }}
              ></div>
              <div
                className="w-10 h-8 border border-zinc-800"
                style={{
                  backgroundColor: primaryText,
                }}
              ></div>
              <div
                className="w-10 h-8 border border-zinc-800"
                style={{
                  backgroundColor: secondaryText,
                }}
              ></div>
              <div
                className="w-10 h-8 border border-zinc-800 rounded-tr-md rounded-br-md"
                style={{
                  backgroundColor: borderColor,
                }}
              ></div>
            </>
          )}
        </>
      </div>
    </div>
  );
}

export default ThemeCard;
