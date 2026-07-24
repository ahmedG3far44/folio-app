import { ReactNode } from "react";

function Container({ children }: { children: ReactNode }) {
  return (
    <div className="w-full min-h-screen flex flex-col items-center lg:w-3/4 mx-auto space-y-10 px-4 lg:px-0">
      {children}
    </div>
  );
}

export default Container;
