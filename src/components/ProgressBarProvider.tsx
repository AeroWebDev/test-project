"use client";

import { AppProgressBar as ProgressBar } from "next-nprogress-bar";

export default function ProgressBarProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ProgressBar
        height="3px"
        color="#c084fc"
        options={{ showSpinner: false, speed: 200, minimum: 0.1 }}
        shallowRouting
      />
      {children}
    </>
  );
}
