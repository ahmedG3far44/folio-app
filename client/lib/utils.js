import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export async function checkIsAdmin(userId) {
  try {
    const request = await fetch(`http://localhost:4000/api/${userId}/user`);
    const data = await request.json();
    console.log(data.role==="USER"?false: true);

    return data.role === "USER" ? false : true 
  } catch (error) {
    console.log(error.message);
  }
}
