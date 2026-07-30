import Link from "next/link";

export default function Hero() {
  return (
    <section className="bg-[#0B0B0F] text-white">
      <div className="max-w-7xl mx-auto px-8 py-24 grid md:grid-cols-2 gap-16 items-center">

        {/* Left Side */}
        <div>

          <p className="text-blue-500 font-semibold uppercase tracking-widest mb-4">
            Smart Vehicle Identity
          </p>

          <h1 className="text-6xl font-extrabold leading-tight">
            Your Vehicle
            <br />
            Deserves a
            <span className="text-blue-500"> Digital Identity.</span>
          </h1>

          <p className="text-gray-400 text-lg mt-8 leading-8">
            Vehix allows anyone to securely contact your vehicle,
            save your parking location,
            receive maintenance reminders,
            and protect your privacy using a smart QR identity.
          </p>

          <div className="mt-10 flex gap-5">

            <Link
              href="/register"
              className="bg-blue-600 hover:bg-blue-700 px-7 py-4 rounded-xl font-semibold transition"
            >
              Get Your Vehix ➜
            </Link>

            <button className="border border-gray-700 px-7 py-4 rounded-xl hover:border-blue-500 transition">
              Watch Demo
            </button>

          </div>

        </div>

        {/* Right Side */}
        <div className="flex justify-center">

          <div className="bg-[#111827] border border-gray-700 rounded-3xl p-8 w-[350px] shadow-2xl">

            <h2 className="text-3xl font-bold text-center mb-6">
              VEHIX
            </h2>

            <div className="bg-white rounded-xl h-48 flex items-center justify-center text-black font-bold text-xl">
              QR CODE
            </div>

            <p className="text-center mt-6 text-gray-300">
              Need to contact this vehicle owner?
            </p>

            <button className="mt-6 w-full bg-blue-600 py-3 rounded-xl hover:bg-blue-700 transition">
              Scan Here
            </button>

            <div className="mt-8 space-y-3 text-sm text-gray-400">
              <p>✅ Privacy Protected</p>
              <p>✅ Smart Parking</p>
              <p>✅ Emergency Ready</p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}