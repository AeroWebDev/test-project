"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export default function AdSenseUnit() {
  const adRef = useRef<HTMLModElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    const ad = adRef.current;

    if (!ad || initialized.current || ad.dataset.adsbygoogleStatus) {
      return;
    }

    initialized.current = true;
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  }, []);

  return (
    <ins
      ref={adRef}
      className="adsbygoogle"
      style={{ display: "block" }}
      data-ad-client="ca-pub-8322508130871793"
      data-ad-slot="1635825885"
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
