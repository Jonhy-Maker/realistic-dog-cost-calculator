"use client";

import Script from "next/script";

export default function GoogleTagManager() {
  return (
    <>
      <Script
        id="google-tag-manager"
        src="https://www.googletagmanager.com/gtm.js?id=GTM-KG5S3LB7"
        strategy="afterInteractive"
      />

      <noscript>
        <iframe
          src="https://www.googletagmanager.com/ns.html?id=GTM-KG5S3LB7"
          height="0"
          width="0"
          style={{
            display: "none",
            visibility: "hidden",
          }}
        />
      </noscript>
    </>
  );
}