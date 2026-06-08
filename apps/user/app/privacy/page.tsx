import type { Metadata } from "next";
import { buildMetadata, SITE } from "@rootline/seo";
import { LegalLayout } from "@/components/legal-layout";
import { LegalSection } from "@/components/legal-section";
import type { TocSection } from "@/components/legal-toc";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description:
    "Rootline Technology Privacy Policy — how we collect, use, and protect your personal data under Nepali law.",
  path: "/privacy",
});

const LAST_UPDATED = "May 25, 2026";

const SECTIONS: TocSection[] = [
  { id: "info-we-collect", title: "Information We Collect" },
  { id: "how-we-collect", title: "How We Collect Your Data" },
  { id: "how-we-use", title: "How We Use Your Data" },
  { id: "legal-basis", title: "Legal Basis for Processing" },
  { id: "data-sharing", title: "Data Sharing and Disclosure" },
  { id: "cookies", title: "Cookies and Tracking Technologies" },
  { id: "data-retention", title: "Data Retention" },
  { id: "data-security", title: "Data Security" },
  { id: "your-rights", title: "Your Rights Under Nepali Law" },
  { id: "third-party-links", title: "Third-Party Links" },
  { id: "international-transfers", title: "International Data Transfers" },
  { id: "changes", title: "Changes to This Policy" },
  { id: "contact-us", title: "Contact Us" },
];

export default function PrivacyPage() {
  return (
    <LegalLayout
      title="Privacy Policy"
      description="How we collect, use, and protect your personal data under Nepali law."
      lastUpdated={LAST_UPDATED}
      path="/privacy"
      sections={SECTIONS}
    >
      <div className="prose prose-neutral dark:prose-invert max-w-none text-foreground prose-headings:text-foreground prose-a:text-foreground prose-strong:text-foreground">
        <p>
          Rootline Technology Pvt Ltd (&ldquo;Rootline,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo;
          or &ldquo;our&rdquo;) respects your privacy and is committed to protecting your personal
          data. This Privacy Policy explains how we collect, use, disclose, and safeguard your
          information when you visit our website or use our services, in accordance with the{" "}
          <strong>Constitution of Nepal (2015)</strong>,{" "}
          <strong>Privacy Act, 2075 (2018)</strong>, and{" "}
          <strong>Privacy Rules, 2077 (2020)</strong>.
        </p>
      </div>

      <LegalSection number="01" id="info-we-collect" title="Information We Collect">
        <p>We may collect the following categories of personal data:</p>
        <ul>
          <li>
            <strong>Identity Data:</strong> name, username, company name, job title.
          </li>
          <li>
            <strong>Contact Data:</strong> email address, phone number, physical address.
          </li>
          <li>
            <strong>Technical Data:</strong> IP address, browser type, device information, operating
            system, and usage data collected through cookies and similar technologies.
          </li>
          <li>
            <strong>Communication Data:</strong> messages you send through our contact forms, emails,
            or support channels.
          </li>
          <li>
            <strong>Project Data:</strong> information you share in the course of engaging our
            engineering and security services.
          </li>
        </ul>
      </LegalSection>

      <LegalSection number="02" id="how-we-collect" title="How We Collect Your Data">
        <p>We collect data through:</p>
        <ul>
          <li>
            <strong>Direct interactions:</strong> when you fill out forms, correspond with us via
            email, or engage our services.
          </li>
          <li>
            <strong>Automated technologies:</strong> cookies, server logs, and analytics tools (see
            Section 6).
          </li>
          <li>
            <strong>Third parties:</strong> publicly available sources and business partners, where
            permitted by law.
          </li>
        </ul>
      </LegalSection>

      <LegalSection number="03" id="how-we-use" title="How We Use Your Data">
        <p>We use your personal data only for the following lawful purposes:</p>
        <ul>
          <li>To provide and maintain our services.</li>
          <li>To respond to your inquiries and support requests.</li>
          <li>To send administrative information, including changes to our terms or policies.</li>
          <li>To improve our website, services, and user experience.</li>
          <li>To comply with legal obligations under Nepali law.</li>
          <li>To protect our rights, property, and safety, and those of our users.</li>
        </ul>
      </LegalSection>

      <LegalSection number="04" id="legal-basis" title="Legal Basis for Processing">
        <p>
          Under the <strong>Privacy Act, 2075</strong>, we process your data based on one or more of
          the following lawful grounds:
        </p>
        <ul>
          <li>Your consent (which you may withdraw at any time).</li>
          <li>Performance of a contract with you.</li>
          <li>Compliance with a legal obligation.</li>
          <li>Legitimate business interests that do not override your privacy rights.</li>
        </ul>
      </LegalSection>

      <LegalSection number="05" id="data-sharing" title="Data Sharing and Disclosure">
        <p>
          We do not sell your personal data. We may share your data only in the following
          circumstances:
        </p>
        <ul>
          <li>
            <strong>Service providers:</strong> trusted third parties who process data on our behalf
            (e.g., hosting, analytics, payment processing) under strict contractual obligations.
          </li>
          <li>
            <strong>Legal compliance:</strong> when required by a court order, law enforcement, or
            other government authority in Nepal.
          </li>
          <li>
            <strong>Business transfers:</strong> in connection with a merger, acquisition, or sale of
            assets.
          </li>
        </ul>
      </LegalSection>

      <LegalSection number="06" id="cookies" title="Cookies and Tracking Technologies">
        <p>
          We use cookies and similar tracking technologies to enhance your browsing experience. You
          can control cookie preferences through your browser settings. For more details, see our
          Cookie Policy available on request.
        </p>
      </LegalSection>

      <LegalSection number="07" id="data-retention" title="Data Retention">
        <p>
          We retain your personal data only as long as necessary to fulfill the purposes for which it
          was collected, or as required by Nepali law. When data is no longer needed, we securely
          delete or anonymize it.
        </p>
      </LegalSection>

      <LegalSection number="08" id="data-security" title="Data Security">
        <p>
          We implement appropriate technical and organizational measures to protect your personal
          data against unauthorized access, alteration, disclosure, or destruction, including
          encryption, access controls, and regular security audits.
        </p>
      </LegalSection>

      <LegalSection number="09" id="your-rights" title="Your Rights Under Nepali Law">
        <p>
          The <strong>Privacy Act, 2075</strong> grants you the following rights regarding your
          personal data:
        </p>
        <ul>
          <li>
            <strong>Right to Access:</strong> request a copy of the personal data we hold about you.
          </li>
          <li>
            <strong>Right to Correction:</strong> request correction of inaccurate or incomplete
            data.
          </li>
          <li>
            <strong>Right to Deletion:</strong> request deletion of your data, subject to legal
            retention requirements.
          </li>
          <li>
            <strong>Right to Withdraw Consent:</strong> withdraw your consent at any time where we
            rely on consent as the legal basis.
          </li>
          <li>
            <strong>Right to Complain:</strong> lodge a complaint with the relevant data protection
            authority in Nepal.
          </li>
        </ul>
        <p>
          To exercise any of these rights, contact us at{" "}
          <a href={`mailto:${SITE.contact.email}`}>{SITE.contact.email}</a>.
        </p>
      </LegalSection>

      <LegalSection number="10" id="third-party-links" title="Third-Party Links">
        <p>
          Our website may contain links to external sites. We are not responsible for the privacy
          practices of such third parties. We encourage you to review their privacy policies before
          providing any personal data.
        </p>
      </LegalSection>

      <LegalSection number="11" id="international-transfers" title="International Data Transfers">
        <p>
          Your data may be stored and processed on servers located outside Nepal. When we transfer
          data internationally, we ensure appropriate safeguards are in place in accordance with the
          Privacy Act, 2075.
        </p>
      </LegalSection>

      <LegalSection number="12" id="changes" title="Changes to This Policy">
        <p>
          We may update this Privacy Policy from time to time. Changes will be posted on this page
          with an updated &ldquo;Last updated&rdquo; date. We encourage you to review this policy
          periodically.
        </p>
      </LegalSection>

      <LegalSection number="13" id="contact-us" title="Contact Us">
        <p>
          If you have questions, concerns, or requests regarding this Privacy Policy or our data
          practices, please contact us:
        </p>
        <ul>
          <li>
            Email: <a href={`mailto:${SITE.contact.email}`}>{SITE.contact.email}</a>
          </li>
          <li>
            Address: {SITE.contact.address}
          </li>
          <li>Phone: {SITE.contact.phone}</li>
        </ul>
      </LegalSection>
    </LegalLayout>
  );
}
