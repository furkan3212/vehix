export default function Footer() {
  return (
    <footer className="border-t border-white/10 mt-24">
      <div className="max-w-7xl mx-auto px-8 py-16">

        <div className="grid md:grid-cols-4 gap-12">

          <div>
            <h2 className="text-3xl font-bold text-white">
              <span className="text-blue-500">V</span>ehix
            </h2>

            <p className="text-gray-400 mt-5 leading-7">
              Smart digital identity for every vehicle.
              Making parking, privacy and emergency
              communication simple.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-5">
              Product
            </h3>

            <ul className="space-y-3 text-gray-400">
              <li>Features</li>
              <li>Pricing</li>
              <li>How it Works</li>
              <li>QR Stickers</li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-5">
              Company
            </h3>

            <ul className="space-y-3 text-gray-400">
              <li>About</li>
              <li>Contact</li>
              <li>Privacy Policy</li>
              <li>Terms</li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-5">
              Follow Us
            </h3>

            <ul className="space-y-3 text-gray-400">
              <li>Instagram</li>
              <li>LinkedIn</li>
              <li>X (Twitter)</li>
              <li>YouTube</li>
            </ul>
          </div>

        </div>

        <div className="border-t border-white/10 mt-12 pt-8 text-center text-gray-500">
          © 2026 Vehix. Built with ❤️ in India.
        </div>

      </div>
    </footer>
  );
}