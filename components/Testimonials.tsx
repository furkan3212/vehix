const testimonials = [
  {
    name: "Rahul Sharma",
    role: "Car Enthusiast",
    review:
      "Vehix helped me when someone accidentally hit my parked car. They scanned the QR and contacted me instantly.",
  },
  {
    name: "Ayesha Khan",
    role: "Daily Commuter",
    review:
      "The Smart Parking feature is amazing. I never forget where I parked anymore.",
  },
  {
    name: "Arjun Mehta",
    role: "Bike Owner",
    review:
      "The privacy feature is my favorite. Nobody can see my phone number but they can still reach me.",
  },
];

export default function Testimonials() {
  return (
    <section className="max-w-7xl mx-auto px-8 py-28">
      <div className="text-center mb-16">
        <h2 className="text-5xl font-bold text-white">
          Loved by <span className="text-blue-500">Vehicle Owners</span>
        </h2>

        <p className="text-gray-400 mt-5">
          Here's what our future users have to say.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {testimonials.map((user) => (
          <div
            key={user.name}
            className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:border-blue-500 transition-all duration-300"
          >
            <p className="text-gray-300 leading-8">
              "{user.review}"
            </p>

            <div className="mt-8">
              <h3 className="text-xl font-bold text-white">
                {user.name}
              </h3>

              <p className="text-blue-400">
                {user.role}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}