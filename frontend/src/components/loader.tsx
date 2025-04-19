function Loader({ size }: { size?: string | "sm" | "md" | "lg" | "xl" }) {
  return (
    <div
      className={`${
        size === "sm"
          ? "w-4 h-4"
          : size === "md"
          ? "w-8 h-8"
          : size === "lg"
          ? "w-14 h-14"
          : size === "xl"
          ? "w-20 h-20"
          : "w-4 h-4"
      }  rounded-full bg-transparent border-2 border-zinc-600 border-r-transparent animate-spin`}
    ></div>
  );
}

export default Loader;
