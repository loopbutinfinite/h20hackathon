import Link from "next/link";
import {
  ChevronDown,
  CloudRain,
  Mountain,
  Snowflake,
  UserCircle,
  Waves,
} from "lucide-react";

export default function InsightsPage() {
  const insights = [
    {
      title: "Snowpack",
      value: "110%",
      status: "Above Normal",
      text: "Snowpack acts like a natural reservoir and helps refill streams and reservoirs as it melts.",
      icon: Snowflake,
    },
    {
      title: "Precipitation",
      value: "105%",
      status: "Slightly Above Average",
      text: "Precipitation supports soil moisture, streamflow, and reservoir recovery throughout the water year.",
      icon: CloudRain,
    },
    {
      title: "Reservoirs",
      value: "90%",
      status: "Strong Capacity",
      text: "Reservoirs store water for homes, farms, ecosystems, and future dry months.",
      icon: Waves,
    },
  ];

  return (
    <main className="min-h-screen bg-[#faf8f2] text-slate-900">
      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-sky-100 text-sky-800">
              <Mountain size={26} />
            </div>

            <span className="text-xl font-black tracking-wide text-slate-900">
              WATER WATCH
            </span>
          </Link>

          <div className="hidden items-center gap-10 font-semibold text-slate-600 md:flex">
            <Link href="/dashboard" className="hover:text-sky-700">
              Dashboard
            </Link>
            <Link
              href="/insights"
              className="border-b-2 border-sky-600 pb-2 text-slate-900"
            >
              Insights
            </Link>
            <Link href="/recommendations" className="hover:text-sky-700">
              Recommendations
            </Link>
            <Link href="/about" className="hover:text-sky-700">
              About
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <button className="hidden items-center gap-3 rounded-xl border border-slate-300 bg-white px-4 py-3 font-semibold text-slate-600 shadow-sm sm:flex">
              California
              <ChevronDown size={18} />
            </button>

            <button className="rounded-full bg-slate-900 p-2 text-white">
              <UserCircle size={28} />
            </button>
          </div>
        </nav>
      </header>

      <section className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
        <h1 className="text-4xl font-black tracking-tight text-slate-950">
          Water Insights
        </h1>

        <p className="mt-3 max-w-3xl text-lg font-medium leading-8 text-slate-600">
          These key indicators help explain whether water conditions are safe,
          trending toward concern, or at risk.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {insights.map((item) => {
            const Icon = item.icon;

            return (
              <article
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sky-100 text-sky-800">
                  <Icon size={34} />
                </div>

                <h2 className="mt-5 text-2xl font-black text-slate-900">
                  {item.title}
                </h2>

                <p className="mt-3 text-5xl font-black text-sky-700">
                  {item.value}
                </p>

                <span className="mt-4 inline-flex rounded-full bg-green-100 px-4 py-2 text-sm font-black text-green-700">
                  {item.status}
                </span>

                <p className="mt-5 leading-7 text-slate-600">{item.text}</p>
              </article>
            );
          })}
        </div>

        <div className="mt-10 rounded-2xl bg-white p-8 shadow-sm border border-slate-200">
          <h2 className="text-2xl font-black text-slate-950">
            What this means
          </h2>

          <p className="mt-4 max-w-4xl text-lg leading-8 text-slate-700">
            Snowpack, precipitation, and reservoir levels work together.
            A strong snowpack can support reservoirs later in the year, while
            low precipitation or low storage can increase drought risk. Water
            Watch turns these numbers into a clear status so communities know
            when to conserve.
          </p>
        </div>
      </section>
    </main>
  );
}