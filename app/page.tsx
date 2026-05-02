import type { ReactNode } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ChevronDown,
  CloudRain,
  Droplets,
  Leaf,
  Mountain,
  Snowflake,
  UserCircle,
  Waves,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { getWaterAnalysis } from "@/lib/WaterService";

function getPreviewColor(status: string) {
  if (status === "Very Healthy" || status === "Healthy") {
    return "bg-emerald-600";
  }

  if (status === "Watch") {
    return "bg-amber-500";
  }

  if (status === "Drought Risk") {
    return "bg-orange-600";
  }

  return "bg-red-700";
}

function getPreviewIcon(status: string) {
  if (status === "Very Healthy" || status === "Healthy") {
    return CheckCircle;
  }

  return AlertTriangle;
}

export default async function HomePage() {
  const analysis = await getWaterAnalysis();

  const previewStatus = analysis?.waterStatus ?? "Unavailable";
  const previewScore = analysis?.waterScore ?? "--";
  const previewText =
    analysis?.explanation ??
    "Water data could not be loaded right now. Please try again later.";

  const snowpack = analysis ? `${analysis.latest.snowpack}%` : "--";
  const reservoirs = analysis ? `${analysis.latest.reservoir}%` : "--";
  const precipitation = analysis ? `${analysis.latest.precip}%` : "--";

  const PreviewIcon = getPreviewIcon(previewStatus);

  const highlights = [
    {
      title: "Water Score",
      description: analysis
        ? `The current water score is ${analysis.waterScore}, which means conditions are ${analysis.waterStatus.toLowerCase()}.`
        : "A simple score that reflects overall water conditions in your area.",
      icon: Droplets,
      bg: "bg-sky-100",
      iconColor: "text-sky-800",
    },
    {
      title: "Flood Risk",
      description: analysis
        ? `Current flood risk level: ${analysis.floodRisk}.`
        : "See how snowpack, precipitation, and reservoirs affect future water supply.",
      icon: CloudRain,
      bg: "bg-teal-100",
      iconColor: "text-sky-800",
    },
    {
      title: "Drought Risk",
      description: analysis
        ? `Current drought risk level: ${analysis.droughtRisk}.`
        : "Compare current conditions to past years and historical patterns.",
      icon: Mountain,
      bg: "bg-green-100",
      iconColor: "text-slate-700",
    },
    {
      title: "Action Tips",
      description: analysis
        ? `Recommended action: ${analysis.recommendation}.`
        : "Practical steps you can take to conserve and protect our water.",
      icon: Leaf,
      bg: "bg-orange-100",
      iconColor: "text-amber-700",
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
            <Link href="/insights" className="hover:text-sky-700">
              Insights
            </Link>

            <Link href="/recommendations" className="hover:text-sky-700">
              Recommendations
            </Link>

            <Link href="/about" className="hover:text-sky-700">
              About
            </Link>
          </div>

        </nav>
      </header>

      <section className="relative overflow-hidden border-b border-slate-200">
        <div className="absolute inset-0 bg-gradient-to-br from-[#faf8f2] via-[#eef7f8] to-[#faf8f2]" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 lg:grid-cols-2 lg:px-8 lg:py-28">
          <div>
            <h1 className="max-w-xl text-5xl font-black leading-tight tracking-tight text-slate-950 md:text-6xl">
              Understand your water conditions.
            </h1>

            <p className="mt-6 max-w-xl text-xl font-medium leading-8 text-slate-700">
              Water Watch turns snowpack, precipitation, and reservoir data into
              a simple score, clear insights, and practical conservation tips.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/insights"
                className="rounded-xl bg-sky-800 px-7 py-4 text-center font-bold text-white shadow-lg transition hover:bg-sky-900"
              >
                View Insights
              </Link>

              <Link
                href="/recommendations"
                className="rounded-xl border-2 border-slate-400 bg-white/70 px-7 py-4 text-center font-bold text-slate-700 transition hover:border-sky-700 hover:text-sky-800"
              >
                See Recommendations
              </Link>
            </div>
          </div>

          <Link
            href="/insights"
            className="group block rounded-2xl bg-white p-4 shadow-2xl ring-1 ring-slate-200 transition hover:-translate-y-1"
          >
            <div className="rounded-2xl bg-slate-50 p-5">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-lg font-black text-blue-950">
                  <Droplets className="text-blue-800" size={24} />
                  Water Watch
                </div>

                <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-bold text-green-700">
                  Live Preview
                </span>
              </div>

              <div
                className={`rounded-2xl px-6 py-8 text-center text-white shadow-lg ${getPreviewColor(
                  previewStatus
                )}`}
              >
                <PreviewIcon
                  className="mx-auto mb-4"
                  size={56}
                  strokeWidth={2.5}
                />

                <p className="text-4xl font-black tracking-[0.2em]">
                  {previewStatus}
                </p>

                <p className="mt-2 text-xl font-bold">
                  Water Score: {previewScore}
                </p>

                <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-white/90">
                  {previewText}
                </p>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                <MiniStatCard
                  icon={<Snowflake size={28} />}
                  title="Snowpack"
                  value={snowpack}
                  label="Current Level"
                />

                <MiniStatCard
                  icon={<Waves size={28} />}
                  title="Reservoirs"
                  value={reservoirs}
                  label="Current Storage"
                />

                <MiniStatCard
                  icon={<CloudRain size={28} />}
                  title="Precipitation"
                  value={precipitation}
                  label="Current Level"
                />
              </div>

              <div className="mt-5 flex items-center justify-center gap-2 font-bold text-sky-800">
                View full insights
                <ArrowRight
                  size={18}
                  className="transition group-hover:translate-x-1"
                />
              </div>
            </div>
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <h2 className="text-center text-3xl font-black text-slate-950">
          Key Highlights
        </h2>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map((item) => {
            const Icon = item.icon;

            return (
              <article
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div
                  className={`mb-5 flex h-16 w-16 items-center justify-center rounded-full ${item.bg} ${item.iconColor}`}
                >
                  <Icon size={34} />
                </div>

                <h3 className="text-xl font-black text-slate-900">
                  {item.title}
                </h3>

                <p className="mt-4 leading-7 text-slate-600">
                  {item.description}
                </p>

                <Link
                  href="/insights"
                  className="mt-6 inline-flex items-center gap-2 font-bold text-sky-700 hover:text-sky-900"
                >
                  Learn more
                  <ArrowRight size={18} />
                </Link>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}

function MiniStatCard({
  icon,
  title,
  value,
  label,
}: {
  icon: ReactNode;
  title: string;
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-xl bg-white p-4 text-center shadow-sm ring-1 ring-slate-200">
      <div className="mx-auto mb-2 flex justify-center text-sky-700">
        {icon}
      </div>

      <p className="font-black text-slate-900">{title}</p>
      <p className="mt-2 text-2xl font-black text-sky-700">{value}</p>
      <p className="mt-1 text-xs font-medium text-slate-500">{label}</p>
    </div>
  );
}