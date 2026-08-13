import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn more about RoBoCodes, a fast and clutter-free source for Roblox game codes.",
};

export default function AboutPage() {
  return (
    <main className="main-content section-container content-page">
      <h1>About RoBoCodes</h1>
      <p className="lead">
        RoBoCodes is dedicated to giving Roblox players fast, clean, and clutter-free redeem
        codes for their favorite games.
      </p>

      <h2>Our Mission</h2>
      <p>
        We know how frustrating it is to deal with dead codes and cluttered lists. Our mission
        is to keep a clean, easy-to-search directory of Roblox codes with 1-tap copying and
        clear, step-by-step redemption guides for every game.
      </p>

      <h2>How We Track Codes</h2>
      <p>
        We follow codes from official developer channels — X/Twitter accounts, Discord servers,
        and in-game update notes — and update our listings as new codes are released. When we
        notice a code has expired, we remove it. As with any third-party list, a code&apos;s
        activation and expiry are ultimately controlled by the game&apos;s developers, so we
        can&apos;t guarantee a given code will still work the moment you try it.
      </p>

      <h2>Disclaimer</h2>
      <p>
        RoBoCodes is an independent fan resource and is not affiliated, associated, authorized,
        endorsed by, or in any way officially connected with Roblox Corporation or any of its
        subsidiaries.
      </p>
    </main>
  );
}