import { ReactNode } from "react";
import { Link } from "react-router-dom";

function SecondaryBtn({
  children,
  className,
  path,
}: {
  children: ReactNode;
  path: string;
  className?: string;
}) {
  return (
    <Link
      className={`${className} bg-zinc-300 px-4 py-2 text-nowrap rounded-md text-sm text-zinc-900 cursor-pointer hover:opacity-75 duration-150`}
      to={`/${path}`}
    >
      {children}
    </Link>
  );
}

export default SecondaryBtn;
