"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  CloudRain,
  Mountain,
  Snowflake,
  UserCircle,
  Waves,
} from "lucide-react";
import {
  analyzeWaterPoint,
  getWaterData,
  WaterAnalysis,
  WaterData,
} from "@/lib/WaterService";

function getIndicatorStatus(value: number) {
  if (value >= 120) return "Very High";
  if (value >= 100) return "Above Normal";
  if (value >= 90) return "Near Normal";
  if (value >= 70) return "Below Normal";
  return "Very Low";
}

function getStatusStyle(status: string) {
  if (status === "Very High") {
    return "bg-blue-100 text-blue-700";
  }

  if (status === "Above Normal" || status === "Near Normal") {
    return "bg-green-100 text-green-700";
  }

  if (status === "Below Normal") {
    return "bg-amber-100 text-amber-700";
  }

  return "bg-red-100 text-red-700";
}

export default function InsightsPage() {
  const [waterData, setWaterData] = useState<WaterData[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [analysis, setAnalysis] = useState<WaterAnalysis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWaterData() {
      const data = await getWaterData();

      setWaterData(data);

      if (data.length > 0) {
        const latestIndex = data.length - 1;

        setSelectedIndex(latestIndex);
        setAnalysis(analyzeWaterPoint(data[latestIndex]));
      }

      setLoading(false);
    }

    loadWaterData();
  }, []);

  const handleDataPointChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const index = Number(event.target.value);
    const selectedDataPoint = waterData[index];

    setSelectedIndex(index);
    setAnalysis(analyzeWaterPoint(selectedDataPoint));
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#faf8f2] text-slate-900">
        <section className="mx-auto max-w-7xl px-5 py-20 text-center lg:px-8">
          <h1 className="text-4xl font-black tracking-tight text-slate-950">
            Loading Water Insights...
          </h1>
        </section>
      </main>
    );
  }

  if (!analysis) {
    return (
      <main className="min-h-screen bg-[#faf8f2] text-slate-900">
        <section className="mx-auto max-w-7xl px-5 py-20 text-center lg:px-8">
          <h1 className="text-4xl font-black tracking-tight text-slate-950">
            Water Insights
          </h1>

          <p className="mt-4 text-lg text-slate-600">
            Water data could not be loaded right now. Please try again later.
          </p>
        </section>
      </main>
    );
  }

  const insights = [
    {
      title: "Snowpack",
      value: `${analysis.latest.snowpack}%`,
      status: getIndicatorStatus(analysis.latest.snowpack),
      text:
        analysis.latest.snowpack >= 100
          ? "Snowpack is helping support future streamflow and reservoir refill as it melts."
          : "Snowpack is below normal, which may reduce future runoff into rivers and reservoirs.",
      icon: Snowflake,
    },
    {
      title: "Precipitation",
      value: `${analysis.latest.precip}%`,
      status: getIndicatorStatus(analysis.latest.precip),
      text:
        analysis.latest.precip >= 100
          ? "Precipitation is supporting soil moisture, streamflow, and water supply recovery."
          : "Precipitation is below normal, which can increase drought pressure if the pattern continues.",
      icon: CloudRain,
    },
    {
      title: "Reservoirs",
      value: `${analysis.latest.reservoir}%`,
      status: getIndicatorStatus(analysis.latest.reservoir),
      text:
        analysis.latest.reservoir >= 85
          ? "Reservoir storage is strong and helps support homes, farms, ecosystems, and dry months."
          : "Reservoir storage is lower than ideal, so stored water should be watched closely.",
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
            <Link href="/Dashboard" className="hover:text-sky-700">
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
            <div className="relative hidden sm:block">
              <select
                value={selectedIndex}
                onChange={handleDataPointChange}
                className="appearance-none rounded-xl border border-slate-300 bg-white px-4 py-3 pr-10 font-semibold text-slate-600 shadow-sm outline-none focus:border-sky-600"
              >
                {waterData.map((item, index) => (
                  <option key={`${item.date}-${index}`} value={index}>
                    {item.date}
                  </option>
                ))}
              </select>

              <ChevronDown
                size={18}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
              />
            </div>

            <button className="rounded-full bg-slate-900 p-2 text-white">
              <UserCircle size={28} />
            </button>
          </div>
        </nav>
      </header>

      <section className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-slate-950">
              Water Insights
            </h1>

            <p className="mt-3 max-w-3xl text-lg font-medium leading-8 text-slate-600">
              These key indicators help explain whether water conditions are
              safe, trending toward concern, or at risk.
            </p>
          </div>

          <div className="sm:hidden">
            <label className="mb-2 block text-sm font-black uppercase tracking-[0.2em] text-slate-500">
              Data Point
            </label>

            <select
              value={selectedIndex}
              onChange={handleDataPointChange}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 font-semibold text-slate-600 shadow-sm outline-none focus:border-sky-600"
            >
              {waterData.map((item, index) => (
                <option key={`${item.date}-${index}`} value={index}>
                  {item.date}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-slate-500">
            Viewing Data Point
          </p>

          <p className="mt-2 text-2xl font-black text-sky-700">
            {analysis.latest.date}
          </p>
        </div>

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

                <span
                  className={`mt-4 inline-flex rounded-full px-4 py-2 text-sm font-black ${getStatusStyle(
                    item.status
                  )}`}
                >
                  {item.status}
                </span>

                <p className="mt-5 leading-7 text-slate-600">{item.text}</p>
              </article>
            );
          })}
        </div>

        <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-black text-slate-950">
            What this means
          </h2>

          <p className="mt-4 max-w-4xl text-lg leading-8 text-slate-700">
            {analysis.explanation}
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-4">
            <div className="rounded-xl bg-slate-100 p-5">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-slate-500">
                Water Score
              </p>

              <p className="mt-2 text-3xl font-black text-sky-700">
                {analysis.waterScore}
              </p>
            </div>

            <div className="rounded-xl bg-slate-100 p-5">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-slate-500">
                Status
              </p>

              <p className="mt-2 text-3xl font-black text-sky-700">
                {analysis.waterStatus}
              </p>
            </div>

            <div className="rounded-xl bg-slate-100 p-5">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-slate-500">
                Drought Risk
              </p>

              <p className="mt-2 text-3xl font-black text-sky-700">
                {analysis.droughtRisk}
              </p>
            </div>

            <div className="rounded-xl bg-slate-100 p-5">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-slate-500">
                Flood Risk
              </p>

              <p className="mt-2 text-3xl font-black text-sky-700">
                {analysis.floodRisk}
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}