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

export default function StatsDashboardPage() {
  const supplyCards = [
    {
      title: "Snowpack",
      value: "110%",
      label: "Above Average",
      icon: Snowflake,
      ring: "border-sky-700",
    },
    {
      title: "Reservoirs",
      value: "85%",
      label: "Capacity Reached",
      icon: Waves,
      ring: "border-sky-700",
    },
    {
      title: "Recent Rainfall",
      value: '4.2"',
      label: "Past 30 Days",
      icon: CloudRain,
      progress: "w-[82%]",
    },
  ];

  const alerts = [
    {
      region: "North Valley",
      allocation: "100%",
      status: "Clear",
      type: "clear",
    },
    {
      region: "South Basin",
      allocation: "100%",
      status: "Clear",
      type: "clear",
    },
    {
      region: "Eastern Highlands",
      allocation: "85%",
      status: "Watch",
      type: "watch",
    },
    {
      region: "Western Plains",
      allocation: "100%",
      status: "Clear",
      type: "clear",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 text-blue-950">
      {/* Top Bar */}
      <header className="border-b border-slate-200 bg-white">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-8">
          <Link href="/" className="flex items-center gap-2 text-xl font-black">
            <Droplets className="text-blue-800" />
            HydroFlow
          </Link>

          <div className="flex items-center gap-6 text-blue-900">
            <Bell size={22} />
            <Settings size={24} />
            <UserCircle size={36} />
          </div>
        </nav>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        {/* Status Banner */}
        <section className="rounded-2xl bg-emerald-600 px-6 py-10 text-center text-white shadow-xl md:py-12">
          <CheckCircle className="mx-auto mb-5" size={72} strokeWidth={2.5} />

          <h1 className="text-5xl font-black tracking-[0.25em]">SAFE</h1>

          <p className="mt-4 text-2xl font-bold">Current Water Status</p>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-emerald-50">
            Reservoir levels are optimal. No immediate agricultural or
            residential restrictions in effect.
          </p>
        </section>

        {/* Supply Cards */}
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

                  {card.progress ? (
                    <>
                      <p className="mt-6 text-5xl font-black text-sky-700">
                        {card.value}
                      </p>

                      <div className="mx-auto mt-4 h-3 max-w-xs rounded-full bg-slate-300">
                        <div
                          className={`${card.progress} h-3 rounded-full bg-sky-700`}
                        />
                      </div>
                    </>
                  ) : (
                    <div className="mx-auto mt-6 flex h-32 w-32 items-center justify-center rounded-full border-[10px] border-sky-700 text-3xl font-black">
                      {card.value}
                    </div>
                  )}

                  <p className="mt-5 text-slate-600">{card.label}</p>
                </article>
              );
            })}
          </div>
        </section>

        {/* Regional Alerts */}
        <section className="mt-10">
          <div className="flex items-end justify-between border-b border-slate-300 pb-3">
            <h2 className="text-3xl font-black">Farmer&apos;s Regional Alerts</h2>

            <Link
              href="/stats/regions"
              className="hidden text-sm font-black uppercase tracking-[0.25em] text-sky-700 hover:text-sky-900 sm:block"
            >
              View All Regions
            </Link>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {alerts.map((alert) => {
              const isWatch = alert.type === "watch";

              return (
                <article
                  key={alert.region}
                  className={`rounded-2xl bg-slate-200 p-6 shadow-sm ${
                    isWatch ? "border-l-4 border-amber-500" : "border-l-4 border-emerald-500"
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-black">{alert.region}</h3>
                      <p className="mt-2 text-slate-600">
                        Allocation: {alert.allocation}
                      </p>
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