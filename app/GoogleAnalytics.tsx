"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    dataLayer: any[];
  }
}

export default function GoogleAnalytics() {
  useEffect(() => {
    const script = document.createElement("script");

    script.async = true;
    script.src =
      "https://www.googletagmanager.com/gtag/js?id=G-MZKZHDE70L";

    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];

    function gtag(...args: any[]) {
      window.dataLayer.push(args);
    }

    gtag("js", new Date());
    gtag("config", "G-MZKZHDE70L");
  }, []);

  return null;
}