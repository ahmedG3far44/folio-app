"use server";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export default async function credentials() {
  const { getUser, isAuthenticated, getPermission, getAccessToken } =
    await getKindeServerSession();
  const user = await getUser();
  const accessToken = await getAccessToken();
  const permission = await getPermission("admin:create");
  const isLogged = await isAuthenticated();
  return {
    user,
    isLogged,
    isAdmin: permission?.isGranted,
    accessToken,
  };
}
