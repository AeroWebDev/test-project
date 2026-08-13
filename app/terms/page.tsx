import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "RoBoCodes Terms of Service.",
};

export default function TermsPage() {
  return (
    <main className="main-content section-container content-page">
      <h1>Terms of Service</h1>
      <p>Last updated: August 2026</p>

      <h2>1. Acceptance of Terms</h2>
      <p>
        By accessing or using RoBoCodes (the &quot;Site&quot;), you agree to be bound by these
        Terms of Service. If you do not agree with any part of these terms, please do not use
        the Site.
      </p>

      <h2>2. Description of Service</h2>
      <p>
        RoBoCodes is a free, independent resource that lists publicly available promotional
        codes for Roblox games. No account, registration, or payment is required to browse or
        copy codes.
      </p>

      <h2>3. No Affiliation with Roblox Corporation</h2>
      <p>
        RoBoCodes is an independent fan resource and is not affiliated with, endorsed by,
        sponsored by, or otherwise associated with Roblox Corporation or the developers of any
        game listed on this Site. All game names, logos, and trademarks belong to their
        respective owners and are used solely to identify the games the codes apply to.
      </p>

      <h2>4. Accuracy of Codes</h2>
      <p>
        Codes are collected and published on a best-effort basis. Game developers control when
        a code activates and expires, not RoBoCodes, so a code may stop working at any time
        without notice. We do not guarantee that any code will be valid, and we are not
        responsible for rewards, items, or in-game effects tied to a code.
      </p>

      <h2>5. Advertising</h2>
      <p>
        The Site is supported by advertising. Ads may be served by third-party networks that
        use cookies or similar technologies; see our <a href="/privacy">Privacy Policy</a> for
        details.
      </p>

      <h2>6. Acceptable Use</h2>
      <p>
        You agree not to scrape, mass-download, or use automated tools to extract content from
        the Site without our prior written permission, and not to use the Site in any way that
        could disable, overburden, or impair it.
      </p>

      <h2>7. Intellectual Property</h2>
      <p>
        The Site&apos;s original text, design, and layout are owned by RoBoCodes. Game titles,
        logos, and other trademarks referenced on the Site remain the property of their
        respective owners and are used under fair, nominative use for identification purposes
        only.
      </p>

      <h2>8. Children&apos;s Use</h2>
      <p>
        Many Roblox players are minors. The Site does not require any account or personal
        information to be used, and we encourage parents and guardians to supervise younger
        users&apos; browsing. See our <a href="/privacy">Privacy Policy</a> for more on how we
        handle data.
      </p>

      <h2>9. Disclaimer &amp; Limitation of Liability</h2>
      <p>
        The Site is provided &quot;as is&quot; and &quot;as available&quot; without warranties
        of any kind. To the fullest extent permitted by law, RoBoCodes is not liable for any
        indirect, incidental, or consequential damages arising from your use of the Site or
        reliance on any code listed here.
      </p>

      <h2>10. Changes to These Terms</h2>
      <p>
        We may update these Terms from time to time. Continued use of the Site after changes
        are posted constitutes acceptance of the revised Terms.
      </p>

      <h2>11. Governing Law</h2>
      <p>These Terms are governed by the laws of Egypt/Cairo.</p>

      <h2>12. Contact Us</h2>
      <p>
        Questions about these Terms? Reach us at{" "}
        <a href="mailto:aeroteam.agency@gmail.com">aeroteam.agency@gmail.com</a>.
      </p>
    </main>
  );
}