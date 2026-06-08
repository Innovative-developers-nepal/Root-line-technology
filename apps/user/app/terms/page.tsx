import type { Metadata } from "next";
import { buildMetadata, SITE } from "@rootline/seo";
import { LegalLayout } from "@/components/legal-layout";
import { LegalSection } from "@/components/legal-section";
import type { TocSection } from "@/components/legal-toc";

export const metadata: Metadata = buildMetadata({
  title: "Terms of Service",
  description:
    "Rootline Technology Terms of Service — the terms governing your use of our website and services.",
  path: "/terms",
});

const LAST_UPDATED = "May 25, 2026";

const SECTIONS: TocSection[] = [
  { id: "acceptance", title: "Acceptance and Eligibility" },
  { id: "services", title: "Services" },
  { id: "user-obligations", title: "User Obligations" },
  { id: "prohibited-conduct", title: "Prohibited Conduct" },
  { id: "intellectual-property", title: "Intellectual Property" },
  { id: "confidentiality", title: "Confidentiality" },
  { id: "limitation-liability", title: "Limitation of Liability" },
  { id: "indemnification", title: "Indemnification" },
  { id: "termination", title: "Termination" },
  { id: "governing-law", title: "Governing Law and Dispute Resolution" },
  { id: "changes", title: "Changes to These Terms" },
  { id: "contact", title: "Contact" },
];

export default function TermsPage() {
  return (
    <LegalLayout
      title="Terms of Service"
      description="The terms governing your use of our website and services."
      lastUpdated={LAST_UPDATED}
      path="/terms"
      sections={SECTIONS}
    >
      <div className="prose prose-neutral dark:prose-invert max-w-none text-foreground prose-headings:text-foreground prose-a:text-foreground prose-strong:text-foreground">
        <p>
          These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of the website,
          products, and services provided by <strong>Rootline Technology Pvt Ltd</strong>
          (&ldquo;Rootline,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;), a
          company registered in Nepal. By accessing or using our services, you agree to be bound by
          these Terms. If you do not agree, please do not use our services.
        </p>
        <p>
          These Terms are governed by the laws of Nepal, including the{" "}
          <strong>Electronic Transactions Act, 2063 (2008)</strong>, the{" "}
          <strong>Information Technology (Interim Guidance) Act, 2063 (2008)</strong>, and the{" "}
          <strong>Consumer Protection Act, 2075 (2018)</strong>.
        </p>
      </div>

      <LegalSection number="01" id="acceptance" title="Acceptance and Eligibility">
        <p>By accessing our website or using our services, you confirm that:</p>
        <ul>
          <li>You have read, understood, and agree to these Terms.</li>
          <li>You are at least 18 years of age or have the consent of a legal guardian.</li>
          <li>You have the legal capacity to enter into a binding agreement under Nepali law.</li>
          <li>
            If you are using our services on behalf of an entity, you represent that you are
            authorized to bind that entity to these Terms.
          </li>
        </ul>
      </LegalSection>

      <LegalSection number="02" id="services" title="Services">
        <p>
          Rootline Technology provides software engineering, security auditing (VAPT), mobile
          application development, and web platform development services. The specific scope,
          deliverables, and timelines for paid services will be defined in a separate Statement of
          Work (SoW) or service agreement executed between the parties.
        </p>
      </LegalSection>

      <LegalSection number="03" id="user-obligations" title="User Obligations">
        <p>You agree to:</p>
        <ul>
          <li>Provide accurate, current, and complete information when using our services.</li>
          <li>Use our website and services only for lawful purposes.</li>
          <li>Not engage in any activity that disrupts or interferes with our systems.</li>
          <li>Not attempt to gain unauthorized access to any part of our infrastructure.</li>
          <li>Comply with all applicable laws and regulations of Nepal.</li>
        </ul>
      </LegalSection>

      <LegalSection number="04" id="prohibited-conduct" title="Prohibited Conduct">
        <p>You may not:</p>
        <ul>
          <li>Use our services to transmit malware, viruses, or any harmful code.</li>
          <li>
            Reverse engineer, decompile, or disassemble any part of our software or infrastructure.
          </li>
          <li>Violate the intellectual property rights of Rootline or any third party.</li>
          <li>Use our services for any fraudulent or illegal activity.</li>
        </ul>
      </LegalSection>

      <LegalSection number="05" id="intellectual-property" title="Intellectual Property">
        <p>
          All content, trademarks, logos, software, and materials provided on our website and
          through our services are the intellectual property of Rootline Technology Pvt Ltd or its
          licensors, protected under the <strong>Copyright Act, 2059 (2002)</strong> and other
          applicable laws of Nepal.
        </p>
        <p>
          Nothing in these Terms grants you any right, title, or interest in our intellectual
          property. You may not reproduce, distribute, modify, or create derivative works without
          our prior written consent.
        </p>
      </LegalSection>

      <LegalSection number="06" id="confidentiality" title="Confidentiality">
        <p>
          Both parties agree to maintain the confidentiality of any proprietary or sensitive
          information disclosed during the course of our engagement. This obligation survives the
          termination of these Terms.
        </p>
      </LegalSection>

      <LegalSection number="07" id="limitation-liability" title="Limitation of Liability">
        <p>To the maximum extent permitted by the laws of Nepal:</p>
        <ul>
          <li>
            Our services are provided &ldquo;as is&rdquo; without warranties of any kind, express or
            implied.
          </li>
          <li>
            We shall not be liable for any indirect, incidental, special, or consequential damages
            arising from your use of our services.
          </li>
          <li>
            Our total liability for any claim arising under these Terms shall not exceed the amount
            paid by you for the specific service giving rise to the claim.
          </li>
        </ul>
      </LegalSection>

      <LegalSection number="08" id="indemnification" title="Indemnification">
        <p>
          You agree to indemnify and hold Rootline harmless from any claims, damages, losses, or
          expenses arising out of your breach of these Terms or your misuse of our services.
        </p>
      </LegalSection>

      <LegalSection number="09" id="termination" title="Termination">
        <p>
          We reserve the right to suspend or terminate your access to our services at any time,
          without prior notice, if you violate these Terms or applicable law. Upon termination, your
          right to use our services ceases immediately.
        </p>
      </LegalSection>

      <LegalSection number="10" id="governing-law" title="Governing Law and Dispute Resolution">
        <p>
          These Terms are governed by the laws of <strong>Nepal</strong>. Any disputes arising out of
          or relating to these Terms shall first be resolved through good-faith negotiations. If the
          dispute cannot be resolved within 30 days, it shall be submitted to the exclusive
          jurisdiction of the courts in <strong>Kathmandu, Nepal</strong>.
        </p>
        <p>
          Nothing in this section prevents either party from seeking injunctive or equitable relief
          in any court of competent jurisdiction.
        </p>
      </LegalSection>

      <LegalSection number="11" id="changes" title="Changes to These Terms">
        <p>
          We may revise these Terms from time to time. The updated version will be posted on this
          page with an updated &ldquo;Last updated&rdquo; date. Continued use of our services after
          changes constitutes acceptance of the revised Terms.
        </p>
      </LegalSection>

      <LegalSection number="12" id="contact" title="Contact">
        <p>If you have questions about these Terms, please contact us:</p>
        <ul>
          <li>
            Email: <a href={`mailto:${SITE.contact.email}`}>{SITE.contact.email}</a>
          </li>
          <li>Address: {SITE.contact.address}</li>
          {SITE.contact.phone && <li>Phone: {SITE.contact.phone}</li>}
        </ul>
      </LegalSection>
    </LegalLayout>
  );
}
