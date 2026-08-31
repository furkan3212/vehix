import Link from "next/link";

const COMPANY_NAME = "Vehix";
const PRIVACY_EMAIL = "privacy@vehix.co.in";
const GRIEVANCE_EMAIL = "privacy@vehix.co.in";

export default function TermsPage() {
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
            Legal · Terms of Service
          </div>

          <h1 className="max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">
            Terms & Conditions
          </h1>

          <p className="mt-6 max-w-3xl text-base leading-8 text-zinc-400 sm:text-lg">
            These Terms & Conditions govern your access to and use of Vehix,
            including our website, vehicle identity services, QR services,
            communication features and related products.
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

      {/* Main */}
      <section className="mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[220px_1fr]">
          {/* Navigation */}
          <aside className="hidden lg:block">
            <div className="sticky top-28 rounded-2xl border border-white/10 bg-white/[0.025] p-5">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">
                On this page
              </p>

              <nav className="space-y-3 text-sm">
                <a href="#acceptance" className="block text-zinc-400 hover:text-white">
                  Acceptance
                </a>

                <a href="#eligibility" className="block text-zinc-400 hover:text-white">
                  Eligibility
                </a>

                <a href="#account" className="block text-zinc-400 hover:text-white">
                  Accounts
                </a>

                <a href="#vehicles" className="block text-zinc-400 hover:text-white">
                  Vehicle information
                </a>

                <a href="#qr" className="block text-zinc-400 hover:text-white">
                  QR services
                </a>

                <a href="#communication" className="block text-zinc-400 hover:text-white">
                  Communication
                </a>

                <a href="#payments" className="block text-zinc-400 hover:text-white">
                  Payments
                </a>

                <a href="#acceptable-use" className="block text-zinc-400 hover:text-white">
                  Acceptable use
                </a>

                <a href="#intellectual-property" className="block text-zinc-400 hover:text-white">
                  Intellectual property
                </a>

                <a href="#third-party" className="block text-zinc-400 hover:text-white">
                  Third parties
                </a>

                <a href="#availability" className="block text-zinc-400 hover:text-white">
                  Availability
                </a>

                <a href="#termination" className="block text-zinc-400 hover:text-white">
                  Termination
                </a>

                <a href="#liability" className="block text-zinc-400 hover:text-white">
                  Liability
                </a>

                <a href="#indemnity" className="block text-zinc-400 hover:text-white">
                  Indemnity
                </a>

                <a href="#law" className="block text-zinc-400 hover:text-white">
                  Governing law
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

          {/* Content */}
          <article className="min-w-0">
            <div className="space-y-12">

              {/* Intro */}
              <section>
                <div className="rounded-2xl border border-blue-500/20 bg-blue-500/[0.06] p-6">
                  <h2 className="text-lg font-bold">
                    Please read these terms carefully
                  </h2>

                  <p className="mt-3 leading-7 text-zinc-300">
                    By accessing or using Vehix, you acknowledge that you have
                    read and understood these Terms & Conditions and agree to
                    be bound by them to the extent permitted by applicable law.
                  </p>

                  <p className="mt-3 leading-7 text-zinc-400">
                    If you do not agree with these Terms, please do not use the
                    relevant Vehix services.
                  </p>
                </div>
              </section>

              {/* 01 */}
              <section id="acceptance">
                <SectionTitle
                  number="01"
                  title="Acceptance of these Terms"
                />

                <p>
                  These Terms & Conditions ("Terms") apply to your use of the
                  Vehix website, platform, vehicle identity services, QR
                  services, communication features, purchases and related
                  services.
                </p>

                <p>
                  References to "Vehix", "we", "us" or "our" mean the operator
                  of the Vehix service. References to "you", "your" or "user"
                  mean the person accessing or using our services.
                </p>
              </section>

              {/* 02 */}
              <section id="eligibility">
                <SectionTitle
                  number="02"
                  title="Eligibility"
                />

                <p>
                  You may use Vehix only where you are legally permitted to
                  enter into an agreement under applicable law.
                </p>

                <p>
                  If you use Vehix on behalf of another person, organisation or
                  vehicle owner, you represent that you have appropriate
                  authority to do so.
                </p>
              </section>

              {/* 03 */}
              <section id="account">
                <SectionTitle
                  number="03"
                  title="Accounts and account security"
                />

                <p>
                  Certain Vehix features may require you to create an account
                  or provide information necessary to use the service.
                </p>

                <BulletList
                  items={[
                    "You are responsible for providing accurate information.",
                    "You are responsible for keeping your account credentials confidential.",
                    "You should not share your password or authentication credentials with unauthorised persons.",
                    "You should notify Vehix if you believe your account has been compromised.",
                    "You are responsible for activity performed through your account to the extent permitted by applicable law.",
                  ]}
                />

                <p>
                  Vehix may suspend or restrict access where reasonably
                  necessary to protect users, the platform, or the security of
                  the service.
                </p>
              </section>

              {/* 04 */}
              <section id="vehicles">
                <SectionTitle
                  number="04"
                  title="Vehicle information"
                />

                <p>
                  Vehix allows users to create and manage digital information
                  associated with vehicles.
                </p>

                <p>
                  You are responsible for ensuring that information you submit
                  about a vehicle is accurate and that you have the necessary
                  rights or authority to provide that information.
                </p>

                <InfoBox title="Important">
                  <p>
                    Vehix does not represent that the information submitted by
                    a user constitutes official government vehicle-registration
                    records or replaces documents issued by a government
                    authority.
                  </p>
                </InfoBox>
              </section>

              {/* 05 */}
              <section id="qr">
                <SectionTitle
                  number="05"
                  title="Vehicle QR services"
                />

                <p>
                  Vehix may provide QR codes that connect a physical vehicle
                  with a digital Vehix profile or vehicle-related services.
                </p>

                <p>
                  QR codes should be used only for legitimate vehicle-related
                  purposes. Users must not knowingly place a QR code on a
                  vehicle that they do not own or have permission to manage.
                </p>

                <BulletList
                  items={[
                    "Do not use Vehix QR codes to impersonate another person.",
                    "Do not use QR codes to mislead, defraud or harass others.",
                    "Do not deliberately provide false or misleading vehicle information.",
                    "Do not attempt to bypass Vehix security or access controls.",
                  ]}
                />
              </section>

              {/* 06 */}
              <section id="communication">
                <SectionTitle
                  number="06"
                  title="Communication features"
                />

                <p>
                  Vehix may provide features that allow a person interacting
                  with a vehicle QR code to contact or notify a vehicle owner.
                </p>

                <p>
                  Depending on the feature, communication may be facilitated
                  through third-party telecommunications or messaging
                  providers.
                </p>

                <p>
                  Users must use communication features responsibly and must
                  not use them for spam, harassment, threats, fraud or any
                  unlawful activity.
                </p>

                <InfoBox title="Privacy">
                  <p>
                    Where supported, Vehix may use controlled communication
                    mechanisms designed to reduce unnecessary exposure of
                    personal phone numbers or other contact information.
                  </p>
                </InfoBox>
              </section>

              {/* 07 */}
              <section id="payments">
                <SectionTitle
                  number="07"
                  title="Orders, payments and purchases"
                />

                <p>
                  Certain Vehix products or services may require payment.
                  Prices, applicable taxes, payment terms and other commercial
                  conditions may be displayed at the time of purchase.
                </p>

                <p>
                  Payments may be processed through third-party payment
                  providers. Vehix may not directly receive or store complete
                  payment-card credentials processed by such providers.
                </p>

                <p>
                  Orders may be subject to availability, verification,
                  applicable taxes, delivery conditions and other terms
                  displayed at checkout.
                </p>
              </section>

              {/* 08 */}
              <section id="acceptable-use">
                <SectionTitle
                  number="08"
                  title="Acceptable use"
                />

                <p>
                  You agree not to misuse Vehix or use the platform in a way
                  that could damage, disrupt or compromise the service.
                </p>

                <BulletList
                  items={[
                    "Use Vehix for unlawful purposes.",
                    "Attempt to gain unauthorised access to accounts, databases, servers or systems.",
                    "Introduce malware, malicious code or harmful content.",
                    "Interfere with the operation or security of the platform.",
                    "Scrape or systematically extract data without permission.",
                    "Impersonate Vehix, another user or another organisation.",
                    "Use the service to harass, threaten, stalk or abuse another person.",
                    "Submit fraudulent, misleading or knowingly inaccurate information.",
                    "Use communication features for spam or unsolicited commercial communication.",
                    "Attempt to circumvent limitations or security controls.",
                  ]}
                />
              </section>

              {/* 09 */}
              <section id="intellectual-property">
                <SectionTitle
                  number="09"
                  title="Intellectual property"
                />

                <p>
                  Unless otherwise stated, the Vehix name, branding, logos,
                  designs, software, website content, interfaces, graphics,
                  text and other materials provided by Vehix are owned by or
                  licensed to Vehix and may be protected by applicable
                  intellectual-property laws.
                </p>

                <p>
                  Your use of Vehix does not transfer ownership of Vehix
                  intellectual property to you.
                </p>

                <p>
                  You may not copy, reproduce, modify, distribute, sell,
                  reverse engineer or commercially exploit Vehix materials
                  except where expressly permitted by law or by Vehix in
                  writing.
                </p>
              </section>

              {/* 10 */}
              <section id="third-party">
                <SectionTitle
                  number="10"
                  title="Third-party services"
                />

                <p>
                  Vehix may integrate with or rely upon third-party services,
                  including payment providers, telecommunications providers,
                  hosting providers, analytics services, mapping services and
                  other technology providers.
                </p>

                <p>
                  Third-party services may have their own terms and privacy
                  policies. Your use of those services may therefore also be
                  subject to their applicable terms.
                </p>
              </section>

              {/* 11 */}
              <section id="availability">
                <SectionTitle
                  number="11"
                  title="Service availability"
                />

                <p>
                  We aim to keep Vehix available and reliable, but we do not
                  guarantee that the service will always be uninterrupted,
                  error-free or available at all times.
                </p>

                <p>
                  Service availability may be affected by maintenance,
                  upgrades, telecommunications failures, internet failures,
                  third-party services, security incidents or circumstances
                  beyond our reasonable control.
                </p>
              </section>

              {/* 12 */}
              <section>
                <SectionTitle
                  number="12"
                  title="User-generated information"
                />

                <p>
                  You remain responsible for information, content, images,
                  vehicle details or other material that you submit through
                  Vehix.
                </p>

                <p>
                  You represent that you have the necessary rights and
                  permissions to provide such material and that its use through
                  Vehix does not knowingly violate applicable law or the rights
                  of another person.
                </p>
              </section>

              {/* 13 */}
              <section id="termination">
                <SectionTitle
                  number="13"
                  title="Suspension and termination"
                />

                <p>
                  You may stop using Vehix at any time.
                </p>

                <p>
                  Vehix may suspend, restrict or terminate access to all or
                  part of the service where reasonably necessary, including
                  where:
                </p>

                <BulletList
                  items={[
                    "You materially breach these Terms.",
                    "Your use creates a security or operational risk.",
                    "The service is being misused.",
                    "Required by applicable law or a lawful authority.",
                    "Necessary to protect users, Vehix or third parties.",
                  ]}
                />

                <p>
                  Termination does not automatically remove obligations or
                  rights that by their nature should continue after termination.
                </p>
              </section>

              {/* 14 */}
              <section id="liability">
                <SectionTitle
                  number="14"
                  title="Disclaimers and limitation of liability"
                />

                <p>
                  To the maximum extent permitted by applicable law, Vehix
                  provides its services on an "as available" basis and does not
                  guarantee that every feature will meet every individual
                  requirement or operate without interruption.
                </p>

                <p>
                  Vehix is not responsible for circumstances outside its
                  reasonable control, including failures of telecommunications
                  networks, internet connectivity, third-party providers,
                  payment systems or user-provided information.
                </p>

                <p>
                  Nothing in these Terms is intended to exclude or limit
                  liability where such exclusion or limitation is prohibited
                  by applicable law.
                </p>
              </section>

              {/* 15 */}
              <section id="indemnity">
                <SectionTitle
                  number="15"
                  title="Indemnity"
                />

                <p>
                  To the extent permitted by applicable law, you agree to
                  reasonably indemnify and hold Vehix harmless from claims,
                  losses, liabilities or expenses arising from your unlawful
                  use of the service, material breach of these Terms, or
                  infringement of another person's rights caused by information
                  or content you provide.
                </p>
              </section>

              {/* 16 */}
              <section id="law">
                <SectionTitle
                  number="16"
                  title="Governing law and jurisdiction"
                />

                <p>
                  These Terms are intended to be governed by the laws
                  applicable in India.
                </p>

                <p>
                  Subject to any mandatory rights or remedies available under
                  applicable law, disputes relating to the services will be
                  subject to the jurisdiction of the appropriate courts in
                  India.
                </p>
              </section>

              {/* 17 */}
              <section>
                <SectionTitle
                  number="17"
                  title="Privacy"
                />

                <p>
                  Your use of Vehix is also subject to our Privacy Policy,
                  which explains how personal data may be collected, used,
                  stored and processed.
                </p>

                <div className="mt-6">
                  <Link
                    href="/privacy"
                    className="inline-flex items-center rounded-full border border-blue-500/30 bg-blue-500/10 px-5 py-3 text-sm font-semibold text-blue-400 transition hover:bg-blue-500/20"
                  >
                    Read Vehix Privacy Policy →
                  </Link>
                </div>
              </section>

              {/* 18 */}
              <section id="changes">
                <SectionTitle
                  number="18"
                  title="Changes to these Terms"
                />

                <p>
                  Vehix may update these Terms from time to time to reflect
                  changes to the service, technology, business operations or
                  applicable legal requirements.
                </p>

                <p>
                  Where appropriate, material changes may be communicated
                  through the website, application, email or another suitable
                  method.
                </p>

                <p>
                  The latest version of these Terms will be made available
                  through the Vehix website.
                </p>
              </section>

              {/* 19 */}
              <section id="contact">
                <SectionTitle
                  number="19"
                  title="Contact and grievances"
                />

                <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-7">
                  <h3 className="text-xl font-bold">
                    Need help?
                  </h3>

                  <p className="mt-3 leading-7 text-zinc-400">
                    If you have a question about these Terms, your account,
                    Vehix services or a grievance, contact us using the
                    details below.
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

              {/* Final notice */}
              <section>
                <div className="border-t border-white/10 pt-8">
                  <p className="text-sm leading-7 text-zinc-500">
                    These Terms are intended to establish the general
                    conditions for using Vehix. They do not remove or restrict
                    any consumer, privacy or other legal right that cannot
                    lawfully be excluded or limited.
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
              className="hover:text-white"
            >
              Privacy Policy
            </Link>

            <Link
              href="/terms"
              className="text-zinc-300 hover:text-white"
            >
              Terms & Conditions
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

/* --------------------------------
   Reusable components
--------------------------------- */

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

function BulletList({
  items,
}: {
  items: string[];
}) {
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
      <div className="text-sm font-bold text-white">
        {title}
      </div>

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