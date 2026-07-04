const steps = [
  {
    number: "01",
    title: "Create Account",
    description:
      "Register in less than a minute and create your secure Vehix account.",
  },
  {
    number: "02",
    title: "Add Your Vehicle",
    description:
      "Enter your vehicle details and create its digital identity.",
  },
  {
    number: "03",
    title: "Generate QR",
    description:
      "Generate your unique Vehix QR code and order your premium sticker.",
  },
  {
    number: "04",
    title: "Stick It",
    description:
      "Place the QR sticker on your vehicle where it's easily visible.",
  },
  {
    number: "05",
    title: "Someone Scans",
    description:
      "Anyone can securely contact you without seeing your phone number.",
  },
  {
    number: "06",
    title: "You're Notified",
    description:
      "Receive an instant notification and reply securely from your dashboard.",
  },
];

export default function HowItWorks() {
  return (
    <section className="max-w-7xl mx-auto px-8 py-28">

      <div className="text-center mb-20">

        <h2 className="text-5xl font-bold text-white">
          How It <span className="text-blue-500">Works</span>
        </h2>

        <p className="text-gray-400 mt-5 max-w-2xl mx-auto">
          Getting started with Vehix takes just a few minutes.
        </p>

      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

        {steps.map((step) => (

          <div
            key={step.number}
            className="relative rounded-3xl border border-white/10 bg-white/5 p-8 hover:border-blue-500 transition-all duration-300 hover:-translate-y-2"
          >

            <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-2xl font-bold mb-8">
              {step.number}
            </div>

            <h3 className="text-2xl font-semibold text-white mb-4">
              {step.title}
            </h3>

            <p className="text-gray-400 leading-7">
              {step.description}
            </p>

          </div>

        ))}

      </div>

    </section>
  );
}