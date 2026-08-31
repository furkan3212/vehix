import Link from "next/link";

const COMPANY_NAME = "Vehix";
const WEBSITE_URL = "https://www.vehix.co.in";
const PRIVACY_EMAIL = "privacy@vehix.co.in";
const GRIEVANCE_EMAIL = "privacy@vehix.co.in";

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#05070b] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#05070b]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <Link
            href="/"
            className="flex items-center gap-3 transition-opacity hover:opacity-80"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-lg font-black shadow-lg shadow-blue-600/20">
              V
            </div>

            <div>
              <div className="text-lg font-black tracking-tight">
                VEHIX
              </div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-zinc-500">
                Smart Vehicle Identity
              </div>
            </div>
          </Link>

          <Link
            href="/"
            className="rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-zinc-300 transition hover:border-white/20 hover:bg-white/5 hover:text-white"
          >
            Back to Vehix
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-white/10 bg-gradient-to-b from-blue-950/30 via-[#05070b] to-[#05070b]">
        <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-20">
          <div className="mb-5 inline-flex items-center rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
            Privacy & Data Protection
          </div>

          <h1 className="max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">
            Privacy Policy
          </h1>

          <p className="mt-6 max-w-3xl text-base leading-8 text-zinc-400 sm:text-lg">
            At Vehix, we believe that your vehicle information and personal
            information should be handled responsibly, transparently and
            securely.
          </p>

          <div className="mt-8 flex flex-wrap gap-3 text-sm text-zinc-500">
            <span className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2">
              Last updated: 31 August 2026
            </span>

            <span className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2">
              India
            </span>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[220px_1fr]">
          {/* Table of contents */}
          <aside className="hidden lg:block">
            <div className="sticky top-28 rounded-2xl border border-white/10 bg-white/[0.025] p-5">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">
                On this page
              </p>

              <nav className="space-y-3 text-sm">
                <a href="#who-we-are" className="block text-zinc-400 hover:text-white">
                  Who we are
                </a>
                <a href="#information" className="block text-zinc-400 hover:text-white">
                  Information we collect
                </a>
                <a href="#purpose" className="block text-zinc-400 hover:text-white">
                  Why we use information
                </a>
                <a href="#qr" className="block text-zinc-400 hover:text-white">
                  Vehicle QR services
                </a>
                <a href="#calls" className="block text-zinc-400 hover:text-white">
                  Communication
                </a>
                <a href="#sharing" className="block text-zinc-400 hover:text-white">
                  Sharing
                </a>
                <a href="#security" className="block text-zinc-400 hover:text-white">
                  Security
                </a>
                <a href="#retention" className="block text-zinc-400 hover:text-white">
                  Retention
                </a>
                <a href="#rights" className="block text-zinc-400 hover:text-white">
                  Your rights
                </a>
                <a href="#children" className="block text-zinc-400 hover:text-white">
                  Children
                </a>
                <a href="#changes" className="block text-zinc-400 hover:text-white">
                  Changes
                </a>
                <a href="#contact" className="block text-zinc-400 hover:text-white">
                  Contact
                </a>
              </nav>
            </div>
          </aside>

          {/* Main policy */}
          <article className="min-w-0">
            <div className="space-y-12">
              <section>
                <div className="rounded-2xl border border-blue-500/20 bg-blue-500/[0.06] p-6">
                  <h2 className="text-lg font-bold">
                    Important privacy notice
                  </h2>

                  <p className="mt-3 leading-7 text-zinc-300">
                    This Privacy Policy explains how {COMPANY_NAME} may
                    collect, use, store, disclose and otherwise process
                    personal data when you use our website, vehicle QR
                    services, vehicle identity features, communication
                    features and related services.
                  </p>

                  <p className="mt-3 leading-7 text-zinc-400">
                    This policy is intended to provide transparency about our
                    data practices and our approach to applicable Indian data
                    protection requirements, including the Digital Personal
                    Data Protection Act, 2023 and applicable rules.
                  </p>
                </div>
              </section>

              <section id="who-we-are">
                <SectionTitle number="01" title="Who we are" />

                <p>
                  {COMPANY_NAME} is a smart vehicle identity and vehicle
                  communication platform designed to help vehicle owners
                  connect their vehicles with useful digital services.
                </p>

                <p>
                  Throughout this policy, "Vehix", "we", "us" or "our" refers
                  to the operator of the Vehix service.
                </p>

                <InfoBox title="Contact">
                  <p>
                    Privacy enquiries:{" "}
                    <a
                      href={`mailto:${PRIVACY_EMAIL}`}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      {PRIVACY_EMAIL}
                    </a>
                  </p>
                </InfoBox>
              </section>

              <section id="information">
                <SectionTitle number="02" title="Information we may collect" />

                <p>
                  Depending on which Vehix features you use, we may process
                  different categories of information.
                </p>

                <DataTable
                  rows={[
                    [
                      "Account information",
                      "Name, email address, mobile number and account credentials or identifiers.",
                    ],
                    [
                      "Vehicle information",
                      "Vehicle registration details, vehicle number, make, model, colour and other vehicle information you choose to provide.",
                    ],
                    [
                      "Vehicle QR information",
                      "QR code identifier, vehicle identifier and information necessary to provide the QR-linked vehicle services.",
                    ],
                    [
                      "Contact information",
                      "Information you provide when contacting Vehix or when using communication features.",
                    ],
                    [
                      "Communication information",
                      "Information relating to calls, messages, alerts or requests made through Vehix features.",
                    ],
                    [
                      "Transaction information",
                      "Order, subscription, payment-related and purchase information required to provide paid services.",
                    ],
                    [
                      "Technical information",
                      "Device, browser, IP address, approximate location derived from technical information where applicable, logs and diagnostic information.",
                    ],
                    [
                      "Usage information",
                      "Information about how you interact with Vehix services, features and pages.",
                    ],
                    [
                      "Support information",
                      "Information you provide when requesting assistance, reporting an issue or communicating with our team.",
                    ],
                  ]}
                />

                <p className="mt-5">
                  We aim to collect only information that is reasonably
                  necessary for the relevant service or specified purpose.
                </p>
              </section>

              <section id="purpose">
                <SectionTitle
                  number="03"
                  title="Why we use personal data"
                />

                <p>
                  We may process personal data for specific and lawful
                  purposes, including:
                </p>

                <BulletList
                  items={[
                    "Creating and managing your Vehix account.",
                    "Registering and managing vehicles associated with your account.",
                    "Generating, maintaining and operating Vehix vehicle QR codes.",
                    "Enabling vehicle owners and other authorised users to use vehicle-related communication features.",
                    "Sending vehicle alerts or notifications requested through the service.",
                    "Providing customer support and responding to enquiries.",
                    "Processing orders, subscriptions and payments.",
                    "Preventing fraud, abuse, unauthorised access and misuse of the service.",
                    "Maintaining, securing and improving the Vehix platform.",
                    "Troubleshooting technical problems and monitoring service performance.",
                    "Complying with applicable legal obligations and responding to lawful requests.",
                    "Protecting the rights, property and safety of Vehix, our users and others.",
                  ]}
                />
              </section>

              <section id="qr">
                <SectionTitle
                  number="04"
                  title="Vehicle QR codes and public-facing information"
                />

                <p>
                  Vehix QR codes are designed to provide a convenient way to
                  interact with vehicle-related services.
                </p>

                <p>
                  Depending on how a vehicle owner configures their QR code,
                  certain vehicle-related information or actions may be made
                  available to a person who scans the QR code.
                </p>

                <InfoBox title="Privacy by design">
                  <p>
                    Vehix is designed so that a QR scan does not automatically
                    require the vehicle owner's personal contact details to be
                    publicly displayed. Where communication features are
                    available, we aim to use controlled communication mechanisms
                    rather than unnecessarily exposing personal information.
                  </p>
                </InfoBox>

                <p>
                  Vehicle owners are responsible for ensuring that information
                  they choose to make available through their vehicle profile
                  is appropriate and does not unnecessarily expose another
                  person's personal information.
                </p>
              </section>

              <section id="calls">
                <SectionTitle
                  number="05"
                  title="Calls, messages and communication"
                />

                <p>
                  Certain Vehix features may allow a person who interacts with
                  a vehicle QR code to request communication with the vehicle
                  owner.
                </p>

                <p>
                  Where technically and commercially available, Vehix may use
                  third-party communication providers to facilitate calls,
                  messaging or notifications.
                </p>

                <p>
                  Such providers may process limited information necessary to
                  establish or deliver the communication. Their processing may
                  also be governed by their own privacy policies and applicable
                  contractual obligations.
                </p>
              </section>

              <section id="sharing">
                <SectionTitle number="06" title="When we may share information" />

                <p>
                  We do not intend to sell personal data as a product.
                </p>

                <p>
                  We may share or provide access to personal data where
                  reasonably necessary for the purposes described in this
                  policy, including with:
                </p>

                <BulletList
                  items={[
                    "Technology and infrastructure providers that help operate Vehix.",
                    "Payment and transaction service providers where required to process payments.",
                    "Communication providers where required to provide calls, SMS or other communication services.",
                    "Cloud hosting, database, security and analytics providers where required to operate and secure the service.",
                    "Professional advisers, auditors or service providers where reasonably necessary.",
                    "Government authorities, law enforcement agencies or other persons where required or authorised by applicable law.",
                  ]}
                />

                <p>
                  We seek to ensure that service providers receiving personal
                  data process it only for appropriate purposes and with
                  reasonable safeguards.
                </p>
              </section>

              <section id="security">
                <SectionTitle number="07" title="Security of personal data" />

                <p>
                  We take reasonable technical and organisational measures
                  designed to protect personal data against unauthorised
                  access, disclosure, alteration, loss, misuse or destruction.
                </p>

                <BulletList
                  items={[
                    "Access controls and authentication mechanisms.",
                    "Server-side handling of sensitive credentials and secrets.",
                    "Reasonable database security controls.",
                    "Monitoring and logging of relevant system activity.",
                    "Restricted access to personal data based on operational requirements.",
                    "Security updates and maintenance of the Vehix platform.",
                  ]}
                />

                <p>
                  No internet-based service can guarantee absolute security.
                  We therefore continuously work to improve the security and
                  resilience of our systems.
                </p>
              </section>

              <section id="retention">
                <SectionTitle number="08" title="How long we retain information" />

                <p>
                  We retain personal data only for as long as reasonably
                  necessary for the purpose for which it was collected,
                  continued operation of the relevant service, compliance with
                  legal obligations, dispute resolution, security and
                  legitimate business requirements.
                </p>

                <p>
                  When personal data is no longer required, we may delete,
                  anonymise or otherwise securely dispose of it, subject to
                  applicable legal or operational requirements.
                </p>
              </section>

              <section id="rights">
                <SectionTitle number="09" title="Your privacy rights" />

                <p>
                  Subject to applicable law and any conditions or exceptions
                  that may apply, you may have rights relating to your personal
                  data, including rights concerning:
                </p>

                <BulletList
                  items={[
                    "Access to information about the processing of your personal data.",
                    "Correction of inaccurate or incomplete personal data.",
                    "Erasure of personal data where applicable.",
                    "Withdrawal of consent where consent is the basis for processing.",
                    "Grievance redressal.",
                    "Making a complaint to the appropriate authority or Data Protection Board where applicable.",
                  ]}
                />

                <InfoBox title="How to make a request">
                  <p>
                    Send your request to{" "}
                    <a
                      href={`mailto:${PRIVACY_EMAIL}`}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      {PRIVACY_EMAIL}
                    </a>
                    .
                  </p>

                  <p className="mt-3">
                    To protect your account and personal information, we may
                    need to verify your identity before completing certain
                    requests.
                  </p>
                </InfoBox>

                <p>
                  Where processing is based on consent, applicable law provides
                  for withdrawal of consent, and the withdrawal process should
                  be reasonably accessible.
                </p>
              </section>

              <section id="children">
                <SectionTitle number="10" title="Children's personal data" />

                <p>
                  Vehix is not intended to knowingly collect personal data
                  from children in circumstances where applicable law requires
                  additional safeguards or verifiable parental consent.
                </p>

                <p>
                  If you believe a child has provided personal data to Vehix in
                  circumstances where this was not appropriate, please contact
                  us so that we can review the situation.
                </p>
              </section>

              <section>
                <SectionTitle
                  number="11"
                  title="Cookies and similar technologies"
                />

                <p>
                  Vehix may use cookies, local storage and similar technologies
                  where reasonably necessary to operate, secure and improve the
                  website.
                </p>

                <p>
                  Where additional technologies are used for analytics,
                  preferences or other purposes, we will provide appropriate
                  information and choices where required by applicable law.
                </p>
              </section>

              <section>
                <SectionTitle
                  number="12"
                  title="Third-party services and websites"
                />

                <p>
                  Vehix may contain links to or integrations with third-party
                  websites and services.
                </p>

                <p>
                  Third-party services operate independently and may have their
                  own privacy policies. We encourage you to review the privacy
                  practices of any third-party service before providing personal
                  information to it.
                </p>
              </section>

              <section>
                <SectionTitle
                  number="13"
                  title="International processing"
                />

                <p>
                  Some technology or service providers used by Vehix may
                  process information from locations outside India.
                </p>

                <p>
                  Where personal data is processed outside India, Vehix will
                  take into account applicable Indian legal requirements,
                  contractual safeguards and other appropriate protections.
                </p>
              </section>

              <section>
                <SectionTitle
                  number="14"
                  title="Data breaches and security incidents"
                />

                <p>
                  If a personal data breach occurs, Vehix will assess the
                  incident and take steps required under applicable law,
                  including appropriate containment, investigation,
                  remediation and notifications where legally required.
                </p>
              </section>

              <section>
                <SectionTitle
                  number="15"
                  title="Changes to this Privacy Policy"
                />

                <p>
                  We may update this Privacy Policy from time to time to
                  reflect changes to our services, technology, legal
                  requirements or privacy practices.
                </p>

                <p>
                  When we make material changes, we may provide an appropriate
                  notice through the website, application, email or another
                  suitable communication channel.
                </p>

                <p>
                  The latest version will always be made available through the
                  Vehix website.
                </p>
              </section>

              <section id="changes">
                <SectionTitle
                  number="16"
                  title="Applicable law"
                />

                <p>
                  This Privacy Policy is intended to be interpreted consistently
                  with applicable laws and regulations of India, including
                  applicable provisions of the Digital Personal Data
                  Protection Act, 2023 and rules made under it.
                </p>

                <p>
                  Nothing in this policy is intended to remove or restrict a
                  right or protection that cannot lawfully be excluded.
                </p>
              </section>

              <section id="contact">
                <SectionTitle
                  number="17"
                  title="Privacy and grievance contact"
                />

                <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-7">
                  <h3 className="text-xl font-bold">
                    Need help with your personal data?
                  </h3>

                  <p className="mt-3 leading-7 text-zinc-400">
                    If you have a privacy question, want to exercise an
                    applicable privacy right, or wish to raise a grievance,
                    contact Vehix using the details below.
                  </p>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <ContactCard
                      title="Privacy"
                      value={PRIVACY_EMAIL}
                      href={`mailto:${PRIVACY_EMAIL}`}
                    />

                    <ContactCard
                      title="Grievance"
                      value={GRIEVANCE_EMAIL}
                      href={`mailto:${GRIEVANCE_EMAIL}`}
                    />
                  </div>
                </div>
              </section>

              {/* Legal disclaimer */}
              <section>
                <div className="border-t border-white/10 pt-8">
                  <p className="text-sm leading-7 text-zinc-500">
                    This Privacy Policy is provided to explain Vehix's
                    intended privacy and data-handling practices. It is not a
                    representation that Vehix has received any government
                    certification, approval or accreditation. Vehix will
                    continue to update its privacy practices and documentation
                    as applicable legal requirements and the Vehix service
                    evolve.
                  </p>
                </div>
              </section>
            </div>
          </article>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/20">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-8 text-sm text-zinc-500 sm:px-8 md:flex-row md:items-center md:justify-between">
          <div>
            © {new Date().getFullYear()} {COMPANY_NAME}. All rights reserved.
          </div>

          <div className="flex flex-wrap gap-5">
            <Link
              href="/privacy"
              className="text-zinc-300 hover:text-white"
            >
              Privacy Policy
            </Link>

            <Link
              href="/"
              className="hover:text-white"
            >
              Home
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

/* -----------------------------
   Reusable components
------------------------------ */

function SectionTitle({
  number,
  title,
}: {
  number: string;
  title: string;
}) {
  return (
    <div className="mb-5 flex items-start gap-4">
      <span className="mt-1 shrink-0 text-xs font-bold tracking-[0.2em] text-blue-500">
        {number}
      </span>

      <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
        {title}
      </h2>
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="mt-5 space-y-3">
      {items.map((item, index) => (
        <li
          key={index}
          className="flex gap-3 leading-7 text-zinc-300"
        >
          <span className="mt-[10px] h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function InfoBox({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.025] p-5">
      <div className="text-sm font-bold text-white">{title}</div>

      <div className="mt-2 text-sm leading-7 text-zinc-400">
        {children}
      </div>
    </div>
  );
}

function ContactCard({
  title,
  value,
  href,
}: {
  title: string;
  value: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className="rounded-2xl border border-white/10 bg-black/20 p-5 transition hover:border-blue-500/30 hover:bg-blue-500/[0.04]"
    >
      <div className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">
        {title}
      </div>

      <div className="mt-2 break-all text-sm font-semibold text-blue-400">
        {value}
      </div>
    </a>
  );
}

function DataTable({
  rows,
}: {
  rows: [string, string][];
}) {
  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
      <div className="grid grid-cols-1 bg-white/[0.04] sm:grid-cols-[220px_1fr]">
        <div className="border-b border-white/10 p-4 text-xs font-bold uppercase tracking-[0.15em] text-zinc-500 sm:border-r">
          Category
        </div>

        <div className="border-b border-white/10 p-4 text-xs font-bold uppercase tracking-[0.15em] text-zinc-500">
          Examples
        </div>

        {rows.map(([category, examples], index) => (
          <div key={category} className="contents">
            <div
              className={`border-b border-white/10 p-4 font-semibold text-zinc-200 sm:border-r ${
                index === rows.length - 1 ? "sm:border-b-0" : ""
              }`}
            >
              {category}
            </div>

            <div
              className={`border-b border-white/10 p-4 leading-7 text-zinc-400 ${
                index === rows.length - 1 ? "border-b-0" : ""
              }`}
            >
              {examples}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}