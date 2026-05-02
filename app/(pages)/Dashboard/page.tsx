import {
  Bell,
  CheckCircle,
  CloudRain,
  Droplets,
  Settings,
  Snowflake,
  UserCircle,
  Waves,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { getWaterAnalysis } from "@/lib/WaterService";

function getStatusColor(status: string) {
  if (status === "Very Healthy" || status === "Healthy") {
    return "bg-emerald-600 text-white";
  }

  if (status === "Watch") {
    return "bg-amber-500 text-white";
  }

  if (status === "Drought Risk") {
    return "bg-orange-600 text-white";
  }

  return "bg-red-700 text-white";
}

function getMainIcon(status: string) {
  if (status === "Very Healthy" || status === "Healthy") {
    return CheckCircle;
  }

  return AlertTriangle;
}

function getRiskType(risk: string) {
  return risk === "Low" ? "clear" : "watch";
}

export default async function DashboardPage() {
  const analysis = await getWaterAnalysis();

  if (!analysis) {
    return (
      <main className="min-h-screen bg-slate-50 text-blue-950">
        <div className="mx-auto max-w-7xl px-5 py-20 text-center">
          <h1 className="text-4xl font-black">Water data unavailable</h1>
          <p className="mt-4 text-slate-600">
            We could not load the current water data. Please try again later.
          </p>
        </div>
      </main>
    );
  }

  const MainIcon = getMainIcon(analysis.waterStatus);

  const supplyCards = [
    {
      title: "Snowpack",
      value: `${analysis.latest.snowpack}%`,
      label: "Current snowpack level",
      icon: Snowflake,
    },
    {
      title: "Reservoirs",
      value: `${analysis.latest.reservoir}%`,
      label: "Current reservoir storage",
      icon: Waves,
    },
    {
      title: "Precipitation",
      value: `${analysis.latest.precip}%`,
      label: "Current precipitation level",
      icon: CloudRain,
    },
  ];

  const alerts = [
    {
      region: "Drought Risk",
      allocation:
        analysis.droughtRisk === "Low"
          ? "Drought risk is currently low."
          : "Some water indicators are below normal and should be watched.",
      status: analysis.droughtRisk,
      type: getRiskType(analysis.droughtRisk),
    },
    {
      region: "Flood Risk",
      allocation:
        analysis.floodRisk === "Low"
          ? "Flood risk is currently low."
          : "High snowpack or precipitation may increase flood concerns.",
      status: analysis.floodRisk,
      type: getRiskType(analysis.floodRisk),
    },
    {
      region: "Recommendation",
      allocation: analysis.recommendation,
      status: "Action",
      type: analysis.recommendation === "Normal Use" ? "clear" : "watch",
    },
    {
      region: "Latest Data",
      allocation: `Last updated from data point: ${analysis.latest.date}`,
      status: "Live",
      type: "clear",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 text-blue-950">
      <header className="border-b border-slate-200 bg-white">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-8">
          <Link href="/" className="flex items-center gap-2 text-xl font-black">
            <Droplets className="text-blue-800" />
            Water Watch
          </Link>

          <div className="hidden items-center gap-8 font-semibold text-slate-600 md:flex">
            <Link href="/Dashboard" className="text-sky-700">
              Dashboard
            </Link>
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

          <div className="flex items-center gap-6 text-blue-900">
            <Bell size={22} />
            <Settings size={24} />
            <UserCircle size={36} />
          </div>
        </nav>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        <section
          className={`rounded-2xl px-6 py-10 text-center shadow-xl md:py-12 ${getStatusColor(
            analysis.waterStatus
          )}`}
        >
          <MainIcon className="mx-auto mb-5" size={72} strokeWidth={2.5} />

          <h1 className="text-5xl font-black tracking-[0.25em]">
            {analysis.waterStatus}
          </h1>

          <p className="mt-4 text-2xl font-bold">
            Water Score: {analysis.waterScore}
          </p>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/90">
            {analysis.explanation}
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-3xl font-black">Water Supply at a Glance</h2>

          <div className="mt-7 grid gap-6 md:grid-cols-3">
            {supplyCards.map((card) => {
              const Icon = card.icon;

              return (
                <article
                  key={card.title}
                  className="rounded-2xl bg-slate-200 p-8 text-center shadow-sm"
                >
                  <Icon className="mx-auto text-sky-700" size={36} />

                  <h3 className="mt-5 text-2xl font-black">{card.title}</h3>

                  <div className="mx-auto mt-6 flex h-32 w-32 items-center justify-center rounded-full border-[10px] border-sky-700 text-3xl font-black">
                    {card.value}
                  </div>

                  <p className="mt-5 text-slate-600">{card.label}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mt-10">
          <div className="flex items-end justify-between border-b border-slate-300 pb-3">
            <h2 className="text-3xl font-black">Water Action Alerts</h2>

            <Link
              href="/recommendations"
              className="hidden text-sm font-black uppercase tracking-[0.25em] text-sky-700 hover:text-sky-900 sm:block"
            >
              View Recommendations
            </Link>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {alerts.map((alert) => {
              const isWatch = alert.type === "watch";

              return (
                <article
                  key={alert.region}
                  className={`rounded-2xl bg-slate-200 p-6 shadow-sm ${
                    isWatch
                      ? "border-l-4 border-amber-500"
                      : "border-l-4 border-emerald-500"
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-black">{alert.region}</h3>
                      <p className="mt-2 text-slate-600">{alert.allocation}</p>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-bold ${
                        isWatch
                          ? "bg-amber-100 text-amber-700"
                          : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {isWatch ? (
                        <AlertTriangle size={15} />
                      ) : (
                        <CheckCircle size={15} />
                      )}
                      {alert.status}
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}