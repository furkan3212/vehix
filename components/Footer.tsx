import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-white/10 bg-[#020617]">
      <div className="mx-auto max-w-7xl px-8 py-16">

        <div className="grid gap-12 md:grid-cols-4">

          {/* BRAND */}
          <div>
            <Link
              href="/"
              className="inline-block transition-opacity hover:opacity-80"
            >
              <h2 className="text-3xl font-bold text-white">
                <span className="text-blue-500">V</span>ehix
              </h2>
            </Link>

            <p className="mt-5 max-w-sm leading-7 text-gray-400">
              Smart digital identity for every vehicle.
              Making parking, privacy and emergency
              communication simple.
            </p>

            <p className="mt-6 text-xs text-gray-600">
              Smart Vehicle Identity
            </p>
          </div>

          {/* PRODUCT */}
          <div>
            <h3 className="mb-5 font-semibold text-white">
              Product
            </h3>

            <ul className="space-y-3 text-gray-400">

              <li>
                <a
                  href="/#features"
                  className="transition hover:text-white"
                >
                  Features
                </a>
              </li>

              <li>
                <a
                  href="/#pricing"
                  className="transition hover:text-white"
                >
                  Pricing
                </a>
              </li>

              <li>
                <a
                  href="/#how-it-works"
                  className="transition hover:text-white"
                >
                  How it Works
                </a>
              </li>

              <li>
                <a
                  href="/#qr-stickers"
                  className="transition hover:text-white"
                >
                  QR Stickers
                </a>
              </li>

            </ul>
          </div>

          {/* COMPANY */}
          <div>
            <h3 className="mb-5 font-semibold text-white">
              Company
            </h3>

            <ul className="space-y-3 text-gray-400">

              <li>
                <Link
                  href="/"
                  className="transition hover:text-white"
                >
                  About
                </Link>
              </li>

              <li>
                <a
                  href="mailto:support@vehix.co.in"
                  className="transition hover:text-white"
                >
                  Contact
                </a>
              </li>

              <li>
                <Link
                  href="/privacy"
                  className="transition hover:text-white"
                >
                  Privacy Policy
                </Link>
              </li>

              <li>
                <Link
                  href="/terms"
                  className="transition hover:text-white"
                >
                  Terms & Conditions
                </Link>
              </li>

            </ul>
          </div>

          {/* FOLLOW */}
          <div>
            <h3 className="mb-5 font-semibold text-white">
              Follow Us
            </h3>

            <ul className="space-y-3 text-gray-400">

              <li>
                <a
                  href="#"
                  className="transition hover:text-white"
                >
                  Instagram
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="transition hover:text-white"
                >
                  LinkedIn
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="transition hover:text-white"
                >
                  X (Twitter)
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="transition hover:text-white"
                >
                  YouTube
                </a>
              </li>

            </ul>
          </div>

        </div>

        {/* BOTTOM */}
        <div className="mt-12 flex flex-col gap-5 border-t border-white/10 pt-8 text-sm text-gray-500 md:flex-row md:items-center md:justify-between">

          <p>
            © {new Date().getFullYear()} Vehix. Built with ❤️ in India.
          </p>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">

            <Link
              href="/privacy"
              className="transition hover:text-white"
            >
              Privacy Policy
            </Link>

            <Link
              href="/terms"
              className="transition hover:text-white"
            >
              Terms & Conditions
            </Link>

            <a
              href="mailto:privacy@vehix.co.in"
              className="transition hover:text-white"
            >
              Privacy / Grievance
            </a>

          </div>

        </div>

      </div>
    </footer>
  );
}