import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "RoBoCodes Privacy Policy.",
};

export default function PrivacyPage() {
  return (
    <main className="main-content section-container content-page">
      <h1>Privacy Policy</h1>
      <p>Last updated: August 2026</p>

      <h2>1. Information We Collect</h2>
      <p>
        RoBoCodes does not require account registration or any personal information to browse
        or copy game codes. We may automatically collect non-personal analytics data such as
        browser type, device type, approximate location (derived from IP address), and pages
        viewed, to help us understand how the Site is used and to improve performance.
      </p>

      <h2>2. Cookies and Local Storage</h2>
      <p>
        We use essential cookies and browser local storage to remember interface preferences
        and to briefly cache the &quot;copied&quot; state of a code button. You can clear or
        block these at any time through your browser settings; the Site will still function
        without them.
      </p>

      <h2>3. Advertising</h2>
      <p>
        The Site displays ads served by third-party advertising networks. These networks may
        use cookies, device identifiers, or similar technologies to serve ads and measure their
        performance. We do not control these third-party technologies directly; you can review
        or adjust ad personalization through your browser or device settings, or through the ad
        network&apos;s own opt-out tools.
      </p>

      <h2>4. Children&apos;s Privacy</h2>
      <p>
        RoBoCodes does not knowingly collect personal information from children. Because many
        visitors to gaming sites like this one may be under 13, we do not ask for names, email
        addresses, or any other personal details anywhere on the Site. If we become aware that
        personal information has been collected from a child without appropriate consent, we
        will delete it. Parents or guardians who believe their child has provided personal
        information to us can contact us to request its removal.
      </p>

      <h2>5. Your Rights</h2>
      <p>
        Depending on where you live, you may have rights to access, correct, or request
        deletion of data we hold about you. Since we do not maintain personal accounts or
        profiles, most requests will relate to analytics or advertising identifiers — contact
        us and we will do our best to help.
      </p>

      <h2>6. Third-Party Links</h2>
      <p>
        Our website contains links to official game pages and social channels. We are not
        responsible for the privacy practices of third-party platforms; please review their own
        policies before sharing information with them.
      </p>

      <h2>7. Data Security</h2>
      <p>
        We take reasonable technical measures to protect the data we collect, but no method of
        transmission or storage is completely secure, and we cannot guarantee absolute
        security.
      </p>

      <h2>8. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. Changes will be posted on this
        page with an updated &quot;Last updated&quot; date.
      </p>

      <h2>9. Contact Us</h2>
      <p>
        Questions about this Policy? Reach us at{" "}
        <a href="mailto:aeroteam.agency@gmail.com">aeroteam.agency@gmail.com</a>.
      </p>
    </main>
  );
}