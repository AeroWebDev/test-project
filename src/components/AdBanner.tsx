"use client";

import { useEffect } from "react";

type AdBannerTypes = {
  dataAdSlot: string;
  dataAdFormat: string;
  dataFullWidthResponsive: boolean;
};

type AdSenseWindow = Window & {
  adsbygoogle?: Array<Record<string, unknown>>;
};

const AdBanner = ({
  dataAdSlot,
  dataAdFormat,
  dataFullWidthResponsive,
}: AdBannerTypes) => {
  useEffect(() => {
    try {
      const adsWindow = window as AdSenseWindow;
      adsWindow.adsbygoogle = adsWindow.adsbygoogle || [];
      adsWindow.adsbygoogle.push({});
    } catch (error) {
      const message = error instanceof Error ? error.message : "Ad initialization failed";
      console.log(message);
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block" }}
      data-ad-client="ca-pub-8322508130871793"
      data-ad-slot={dataAdSlot}
      data-ad-format={dataAdFormat}
      data-full-width-responsive={dataFullWidthResponsive.toString()}
    />
  );
};

export default AdBanner;
