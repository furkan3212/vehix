const stats = [
  {
    number: "50K+",
    title: "Vehicles Protected",
  },
  {
    number: "100K+",
    title: "QR Scans",
  },
  {
    number: "100%",
    title: "Privacy Protected",
  },
  {
    number: "24/7",
    title: "Emergency Access",
  },
];

export default function Stats() {
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-8">

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

          {stats.map((stat) => (

            <div
              key={stat.title}
              className="bg-white/5 border border-white/10 rounded-3xl p-10 text-center hover:border-blue-500 transition duration-300"
            >

              <h2 className="text-5xl font-bold text-blue-500">
                {stat.number}
              </h2>

              <p className="text-gray-400 mt-4 text-lg">
                {stat.title}
              </p>

            </div>

          ))}

        </div>

      </div>
    </section>
  );
}