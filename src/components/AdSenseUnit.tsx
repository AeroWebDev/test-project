"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export default function AdSenseUnit() {
  const hydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const adRef = useRef<HTMLModElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    const ad = adRef.current;

    if (!hydrated || !ad || initialized.current || ad.dataset.adStatus) {
      return;
    }

    initialized.current = true;
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  }, [hydrated]);

  if (!hydrated) {
    return null;
  }

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
