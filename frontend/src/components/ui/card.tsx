import * as React from "react";

import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeProvider";
import { useAuth } from "@/contexts/AuthProvider";

function Card({ className, ...props }: React.ComponentProps<"div">) {
  const { activeTheme } = useTheme();
  const { isLogged } = useAuth();
  return (
    <div
      data-slot="card"
      style={
        isLogged
          ? {
              backgroundColor: activeTheme.cardColor,
              border: `1px solid ${activeTheme.borderColor}`,
              color: activeTheme.primaryText,
            }
          : {
              backgroundColor: "black",
              border: `1px solid oklch(21% 0.006 285.885)`,
              color: "white",
            }
      }
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-1 rounded-xl border py-6 shadow-sm p-4",
        className
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6", className)}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
