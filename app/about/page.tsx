import { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://robcodes.net";

export const metadata: Metadata = {
  title: "About RoBcodes — Who Verifies Our Roblox Codes",
  description:
    "Learn how the RoBcodes Aero Team tracks, tests, and verifies Roblox promo codes daily across Blox Fruits, Blade Ball, King Legacy, and more.",
};

const aboutSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "RoBcodes",
      url: siteUrl,
      logo: `${siteUrl}/og-image.png`,
      description:
        "RoBcodes is an independent Roblox codes directory operated by the Aero Team. We track official developer channels daily and verify each code before listing it.",
      foundingDate: "2024",
      contactPoint: {
        "@type": "ContactPoint",
        email: "aeroteam.agency@gmail.com",
        contactType: "editorial",
      },
      sameAs: ["https://discord.gg/robcodes"],
    },
    {
      "@type": "Person",
      name: "Aero Team Lead Editor",
      jobTitle: "Lead Roblox Code Verifier & Editor",
      worksFor: {
        "@type": "Organization",
        name: "RoBcodes",
      },
      description: "Dedicated Roblox gameplay tester and code verifier tracking developer announcements since 2024.",
    },
  ],
};

export default function AboutPage() {
  return (
    <main className="main-content section-container content-page">
      {/* Inject Organization & Person schema for E-E-A-T signals */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />

      <h1>About RoBcodes</h1>
      <p className="lead">
        RoBcodes is dedicated to giving Roblox players fast, clean, and clutter-free redeem
        codes for their favorite games — verified daily by the Aero Team.
      </p>

      <h2>Our Mission</h2>
      <p>
        We know how frustrating it is to deal with dead codes and cluttered lists. Our mission
        is to keep a clean, easy-to-search directory of Roblox codes with 1-tap copying and
        clear, step-by-step redemption guides for every game.
      </p>

      <h2>Who We Are</h2>
      <p>
        RoBcodes is maintained by the <strong>Aero Team</strong> — a group of Roblox enthusiasts
        and web developers who play these games actively and understand exactly what players need.
        We are not affiliated with Roblox Corporation, but we are dedicated fans who rely on the
        same codes we list. Our editorial team has been tracking Roblox developer announcements
        since 2024.
      </p>

      <h2>How We Track &amp; Verify Codes</h2>
      <p>
        Every code listed on RoBcodes goes through a consistent editorial process before it
        appears on any game page:
      </p>
      <ol>
        <li>
          <strong>Source monitoring:</strong> We follow official developer channels — X/Twitter
          accounts, Discord servers, YouTube update videos, and in-game patch notes — to catch
          new codes the moment they are released.
        </li>
        <li>
          <strong>Manual testing:</strong> Each code is manually redeemed in-game by an Aero Team
          member before being marked &quot;Active&quot; on our site. We do not list codes we
          haven&apos;t verified ourselves.
        </li>
        <li>
          <strong>Daily expiry checks:</strong> Our team re-tests active codes on a daily basis.
          When a code stops working, it is immediately moved to the &quot;Expired&quot; section so
          players always see the accurate count of working codes.
        </li>
        <li>
          <strong>Community reports:</strong> Players can report expired codes or share newly
          discovered codes via our{" "}
          <a href="/contact" className="inline-link">contact page</a> or{" "}
          <a
            href="https://discord.gg/robcodes"
            target="_blank"
            rel="noreferrer noopener"
            className="inline-link"
          >
            Discord server
          </a>
          . Verified community submissions are credited and added within hours.
        </li>
      </ol>

      <h2>Update Frequency</h2>
      <p>
        Code lists are reviewed and updated at least once every 24 hours. During major game
        updates or developer events, we update in real-time. The &quot;Last verified&quot;
        timestamp shown on each game&apos;s codes page reflects when that specific game&apos;s
        codes were last manually checked.
      </p>

      <h2>Disclaimer</h2>
      <p>
        RoBcodes is an independent fan resource and is not affiliated, associated, authorized,
        endorsed by, or in any way officially connected with Roblox Corporation or any of its
        subsidiaries. Code activation and expiry are ultimately controlled by each game&apos;s
        developers, so we cannot guarantee a code will still work the moment you try it — but
        we do everything in our power to keep listings accurate.
      </p>

      <h2>Contact Us</h2>
      <p>
        Have a new code tip, spotted an error, or want to partner with us?{" "}
        <a href="/contact" className="inline-link">Contact the Aero Team</a> or email us directly at{" "}
        <a href="mailto:aeroteam.agency@gmail.com" className="inline-link">
          aeroteam.agency@gmail.com
        </a>
        .
      </p>
    </main>
  );
}