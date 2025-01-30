"use client";

import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

export default  function useToken() {
  const { getToken, getAccessToken, getAccessTokenRaw } = useKindeBrowserClient();
  const token =  getToken();
  console.log(token, "access token")
  return { token };
}
