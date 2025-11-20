import { useEffect } from "react";
import { authStore } from "../authStore";

export default function GoogleLoginRedirectPage() {
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const accessToken  = p.get("accessToken");
    const refreshToken = p.get("refreshToken");

    if (!accessToken || !refreshToken) {
      console.error("Missing tokens");
      window.location.replace("/login");
      return;
    }

    authStore.setTokens(accessToken, refreshToken);
    window.location.replace("/mypage");
  }, []);

  return null;
}
