import type { Metadata } from "next";
import { Section, SectionHeading } from "@rootline/ui/blocks";
import { Container } from "@rootline/ui/components";
import { buildMetadata, breadcrumbJsonLd, renderJsonLd, SITE } from "@rootline/seo";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description: "Rootline Technology Privacy Policy — how we collect, use, and protect your personal data under Nepali law.",
  path: "/privacy",
});

const LAST_UPDATED = "May 25, 2026";

export default function PrivacyPage() {
  return (
    <main className="min-h-dvh">
      <Section>
        <Container size="md" className="py-16">
          <SectionHeading
            eyebrow="Legal"
            title="Privacy Policy"
            description={`Last updated: ${LAST_UPDATED}`}
            size="lg"
          />

          <article className="prose prose-neutral dark:prose-invert mx-auto mt-10">
            <p>
              Rootline Technology Pvt Ltd ("Rootline," "we," "us," or "our") respects your privacy
              and is committed to protecting your personal data. This Privacy Policy explains how we
              collect, use, disclose, and safeguard your information when you visit our website or
              use our services, in accordance with the <strong>Constitution of Nepal (2015)</strong>,{" "}
              <strong>Privacy Act, 2075 (2018)</strong>, and{" "}
              <strong>Privacy Rules, 2077 (2020)</strong>.
            </p>

            <h2>1. Information We Collect</h2>
            <p>We may collect the following categories of personal data:</p>
            <ul>
              <li>
                <strong>Identity Data:</strong> name, username, company name, job title.
              </li>
              <li>
                <strong>Contact Data:</strong> email address, phone number, physical address.
              </li>
              <li>
                <strong>Technical Data:</strong> IP address, browser type, device information,
                operating system, and usage data collected through cookies and similar
                technologies.
              </li>
              <li>
                <strong>Communication Data:</strong> messages you send through our contact forms,
                emails, or support channels.
              </li>
              <li>
                <strong>Project Data:</strong> information you share in the course of engaging our
                engineering and security services.
              </li>
            </ul>

            <h2>2. How We Collect Your Data</h2>
            <p>We collect data through:</p>
            <ul>
              <li>
                <strong>Direct interactions:</strong> when you fill out forms, correspond with us
                via email, or engage our services.
              </li>
              <li>
                <strong>Automated technologies:</strong> cookies, server logs, and analytics tools
                (see Section 6).
              </li>
              <li>
                <strong>Third parties:</strong> publicly available sources and business partners,
                where permitted by law.
              </li>
            </ul>

            <h2>3. How We Use Your Data</h2>
            <p>We use your personal data only for the following lawful purposes:</p>
            <ul>
              <li>To provide and maintain our services.</li>
              <li>To respond to your inquiries and support requests.</li>
              <li>To send administrative information, including changes to our terms or policies.</li>
              <li>To improve our website, services, and user experience.</li>
              <li>To comply with legal obligations under Nepali law.</li>
              <li>To protect our rights, property, and safety, and those of our users.</li>
            </ul>

            <h2>4. Legal Basis for Processing</h2>
            <p>
              Under the <strong>Privacy Act, 2075</strong>, we process your data based on one or
              more of the following lawful grounds:
            </p>
            <ul>
              <li>Your consent (which you may withdraw at any time).</li>
              <li>Performance of a contract with you.</li>
              <li>Compliance with a legal obligation.</li>
              <li>Legitimate business interests that do not override your privacy rights.</li>
            </ul>

            <h2>5. Data Sharing and Disclosure</h2>
            <p>
              We do not sell your personal data. We may share your data only in the following
              circumstances:
            </p>
            <ul>
              <li>
                <strong>Service providers:</strong> trusted third parties who process data on our
                behalf (e.g., hosting, analytics, payment processing) under strict contractual
                obligations.
              </li>
              <li>
                <strong>Legal compliance:</strong> when required by a court order, law enforcement,
                or other government authority in Nepal.
              </li>
              <li>
                <strong>Business transfers:</strong> in connection with a merger, acquisition, or
                sale of assets.
              </li>
            </ul>

            <h2>6. Cookies and Tracking Technologies</h2>
            <p>
              We use cookies and similar tracking technologies to enhance your browsing experience.
              You can control cookie preferences through your browser settings. For more details,
              see our Cookie Policy available on request.
            </p>

            <h2>7. Data Retention</h2>
            <p>
              We retain your personal data only as long as necessary to fulfill the purposes for
              which it was collected, or as required by Nepali law. When data is no longer needed,
              we securely delete or anonymize it.
            </p>

            <h2>8. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your
              personal data against unauthorized access, alteration, disclosure, or destruction,
              including encryption, access controls, and regular security audits.
            </p>

            <h2>9. Your Rights Under Nepali Law</h2>
            <p>
              The <strong>Privacy Act, 2075</strong> grants you the following rights regarding your
              personal data:
            </p>
            <ul>
              <li>
                <strong>Right to Access:</strong> request a copy of the personal data we hold about
                you.
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
                <strong>Right to Withdraw Consent:</strong> withdraw your consent at any time where
                we rely on consent as the legal basis.
              </li>
              <li>
                <strong>Right to Complain:</strong> lodge a complaint with the relevant data
                protection authority in Nepal.
              </li>
            </ul>
            <p>
              To exercise any of these rights, contact us at{" "}
              <a href={`mailto:${SITE.contact.email}`}>{SITE.contact.email}</a>.
            </p>

            <h2>10. Third-Party Links</h2>
            <p>
              Our website may contain links to external sites. We are not responsible for the
              privacy practices of such third parties. We encourage you to review their privacy
              policies before providing any personal data.
            </p>

            <h2>11. International Data Transfers</h2>
            <p>
              Your data may be stored and processed on servers located outside Nepal. When we
              transfer data internationally, we ensure appropriate safeguards are in place in
              accordance with the Privacy Act, 2075.
            </p>

            <h2>12. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Changes will be posted on this
              page with an updated "Last updated" date. We encourage you to review this policy
              periodically.
            </p>

            <h2>13. Contact Us</h2>
            <p>
              If you have questions, concerns, or requests regarding this Privacy Policy or our
              data practices, please contact us:
            </p>
            <ul>
              <li>Email: <a href={`mailto:${SITE.contact.email}`}>{SITE.contact.email}</a></li>
              <li>Address: {SITE.contact.address}</li>
              <li>Phone: {SITE.contact.phone}</li>
            </ul>
          </article>
        </Container>
      </Section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: renderJsonLd(
            breadcrumbJsonLd([
              { name: "Home", url: SITE.url },
              { name: "Privacy Policy", url: `${SITE.url}/privacy` },
            ]),
          ),
        }}
      />
    </main>
  );
}
