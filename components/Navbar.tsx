import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl bg-black/30 border-b border-white/10">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-5">

        {/* Logo */}
        <div>
          <h1 className="text-3xl font-extrabold tracking-wide">
            <span className="text-blue-500">V</span>ehix
          </h1>

          <p className="text-xs text-gray-400 tracking-[3px] uppercase">
            Smart Identity
          </p>
        </div>

        {/* Navigation */}
        <div className="hidden md:flex items-center gap-8 text-gray-300">
          <a href="#" className="hover:text-blue-500 transition">Home</a>
          <a href="#" className="hover:text-blue-500 transition">Features</a>
          <a href="#" className="hover:text-blue-500 transition">How It Works</a>
          <a href="#" className="hover:text-blue-500 transition">Pricing</a>
          <a href="#" className="hover:text-blue-500 transition">Contact</a>
        </div>

        {/* Buttons */}
        <div className="flex gap-4">

          <Link
            href="/login"
            className="text-white hover:text-blue-500 transition flex items-center"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl transition"
          >
            Get Started
          </Link>

        </div>

      </div>
    </nav>
  );
}