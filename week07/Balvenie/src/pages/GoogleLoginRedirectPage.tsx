import { useEffect } from "react";

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

    try {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      // Header 등에서 즉시 갱신되도록 커스텀 이벤트 발행
      window.dispatchEvent(new CustomEvent("localStorageChange"));
    } catch (e) {
      console.error("Persist failed", e);
    }

    window.location.replace("/mypage");
  }, []);

  return null;
}