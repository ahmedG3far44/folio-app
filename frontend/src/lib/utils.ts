import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// export const uploadFileToS3 = (file: File) => {
//   try {
//     console.log("");
//   } catch (err) {
//     console.log((err as Error).message);
//   }
// };
