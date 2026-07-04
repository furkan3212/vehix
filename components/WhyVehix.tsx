export default function WhyVehix() {
  const features = [
    {
      title: "Anonymous Contact",
      description:
        "Allow anyone to contact you without revealing your phone number.",
      icon: "🔒",
    },
    {
      title: "Smart Parking",
      description:
        "Save your parking location with one tap and navigate back anytime.",
      icon: "📍",
    },
    {
      title: "Emergency Access",
      description:
        "Show emergency contact information only when it's really needed.",
      icon: "🚨",
    },
    {
      title: "Vehicle History",
      description:
        "Store service records and maintenance reminders in one place.",
      icon: "🚗",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-8 py-28">
      <div className="text-center mb-16">
        <h2 className="text-5xl font-bold text-white">
          Why Choose <span className="text-blue-500">Vehix?</span>
        </h2>

        <p className="text-gray-400 mt-5 max-w-2xl mx-auto">
          More than a QR sticker. Vehix gives your vehicle a secure digital
          identity with smart features designed for everyday convenience.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="rounded-3xl border border-white/10 bg-white/5 p-8 hover:border-blue-500 hover:-translate-y-2 transition-all duration-300"
          >
            <div className="text-5xl mb-6">{feature.icon}</div>

            <h3 className="text-2xl font-semibold text-white mb-4">
              {feature.title}
            </h3>

            <p className="text-gray-400">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}