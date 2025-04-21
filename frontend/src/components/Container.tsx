import { ReactNode } from "react";

function Container({ children }: { children: ReactNode }) {
  return <div className="w-full min-h-screen flex flex-col justify-between items-center lg:w-3/4 m-auto">{children}</div>;
}

export default Container;
