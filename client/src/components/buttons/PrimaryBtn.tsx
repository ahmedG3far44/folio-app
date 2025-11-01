import { ReactNode } from "react";
import { Link } from "react-router-dom";

function PrimaryBtn({
  children,
  className,
  path,
  target,
  rel,
}: {
  children: ReactNode;
  path: string;
  className?: string;
  target?: string;
  rel?: string;
}) {
  return (
    <Link
      className={`${className} bg-zinc-950 text-white text-sm  rounded-md border-zinc-800 px-4 py-2 cursor-pointer border hover:opacity-75 duration-150`}
      to={`/${path}`}
      target={target}
      rel={rel}
    >
      {children}
    </Link>
  );
}

export default PrimaryBtn;
