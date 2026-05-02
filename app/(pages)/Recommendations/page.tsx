"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Leaf, Droplets, Sprout } from "lucide-react";
import {
  getCurrentWaterTips,
  WaterAnalysis,
  WaterTip,
} from "@/lib/WaterService";

function getTipCardStyle(level: string, tipView: "home" | "farm") {
  if (level === "Good") {
    return tipView === "home"
      ? "border-emerald-200 bg-emerald-50"
      : "border-green-200 bg-green-50";
  }

  if (level === "Watch") {
    return "border-amber-200 bg-amber-50";
  }

  if (level === "Warning") {
    return "border-orange-200 bg-orange-50";
  }

  return "border-red-200 bg-red-50";
}

function getTipLabelStyle(level: string, tipView: "home" | "farm") {
  if (level === "Good") {
    return tipView === "home" ? "text-emerald-700" : "text-green-700";
  }

  if (level === "Watch") {
    return "text-amber-700";
  }

  if (level === "Warning") {
    return "text-orange-700";
  }

  return "text-red-700";
}

export default function RecommendationsPage() {
  const [tipView, setTipView] = useState<"home" | "farm">("home");
  const [analysis, setAnalysis] = useState<WaterAnalysis | null>(null);
  const [homeTips, setHomeTips] = useState<WaterTip[]>([]);
  const [farmTips, setFarmTips] = useState<WaterTip[]>([]);

  useEffect(() => {
    let loaded = false;

    const refreshTimer = setTimeout(() => {
      if (!loaded) {
        window.location.reload();
      }
    }, 5000);

    async function loadTips() {
      const result = await getCurrentWaterTips();

      setAnalysis(result.analysis);
      setHomeTips(result.homeTips);
      setFarmTips(result.farmTips);

      if (result.homeTips.length > 0 || result.farmTips.length > 0) {
        loaded = true;
        clearTimeout(refreshTimer);
      }
    }

    loadTips();

    return () => {
      clearTimeout(refreshTimer);
    };
  }, []);

  const actions = [
    {
      title: "Reduce outdoor watering",
      description:
        "Water early in the morning or evening and follow seasonal watering guidelines.",
      buttonText: "Learn how",
      cardBg: "bg-green-50",
      buttonStyle: "bg-green-700 hover:bg-green-800",
      imageSrc: "/assets/WaterConservationImage.png",
      articleUrl:
        "https://www.sjwater.org/Water-Resources-Management/Conservation/Conservation/At-Home#At-Home",
    },
    {
      title: "Check for leaks",
      description:
        "A small leak can waste gallons of water every day. Check toilets, faucets, and irrigation systems.",
      buttonText: "Get tips",
      cardBg: "bg-sky-50",
      buttonStyle: "bg-sky-800 hover:bg-sky-900",
      imageSrc: "/assets/LeaksCardImage.png",
      articleUrl: "https://www.epa.gov/watersense/fix-leak-week",
    },
    {
      title: "Improve agricultural water efficiency",
      description:
        "Explore irrigation practices, water management strategies, and resources that help farmers use water more efficiently.",
      buttonText: "View resources",
      cardBg: "bg-orange-50",
      buttonStyle: "bg-amber-700 hover:bg-amber-800",
      imageSrc: "/assets/PlantlifeWater.png",
      articleUrl:
        "https://water.ca.gov/Programs/Water-Use-And-Efficiency/Agricultural-Water-Use-Efficiency",
    },
  ];

  const fallbackTips: WaterTip[] = [
    {
      title: "Loading current conditions",
      description:
        "Tips will update once current water data finishes loading.",
      level: "Watch",
    },
    {
      title: "Review water conditions",
      description:
        "Check snowpack, precipitation, and reservoir levels before making water decisions.",
      level: "Watch",
    },
    {
      title: "Avoid waste",
      description:
        "While data loads, avoid unnecessary outdoor watering or irrigation changes.",
      level: "Watch",
    },
  ];

  const activeTips =
    tipView === "home"
      ? homeTips.length > 0
        ? homeTips
        : fallbackTips
      : farmTips.length > 0
      ? farmTips
      : fallbackTips;

  return (
    <main className="min-h-screen bg-[#faf8f2] text-slate-900">
      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-sky-100 text-sky-800">
              <Droplets size={26} />
            </div>

            <span className="text-xl font-black tracking-wide text-slate-900">
              Water Wise
            </span>
          </Link>

          <div className="hidden items-center gap-10 font-semibold text-slate-600 md:flex">
            <Link href="/" className="hover:text-sky-700">
              Home
            </Link>

            <Link href="/Insights" className="hover:text-sky-700">
              Insights
            </Link>

            <Link
              href="/Recommendations"
              className="border-b-2 border-sky-600 pb-2 text-slate-900"
            >
              Recommendations
            </Link>
          </div>
        </nav>
      </header>

      <section className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-950">
            Recommended Actions
          </h1>

          <p className="mt-3 text-lg font-medium text-slate-600">
            Small steps make a big impact.
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {actions.map((action) => (
            <article
              key={action.title}
              className={`${action.cardBg} flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg`}
            >
              <div className="mb-6 flex h-45 items-center justify-center rounded-xl bg-white/60">
                <img
                  src={action.imageSrc}
                  alt={action.title}
                  className="h-45 object-cover"
                />
              </div>

              <h2 className="text-2xl font-black text-slate-900">
                {action.title}
              </h2>

              <p className="mt-4 min-h-[96px] text-lg font-medium leading-8 text-slate-700">
                {action.description}
              </p>

              <a
                href={action.articleUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-auto inline-flex w-fit rounded-lg px-6 py-3 font-black text-white shadow-md transition ${action.buttonStyle}`}
              >
                {action.buttonText}
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-12 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-sky-100 text-sky-800">
                {tipView === "home" ? (
                  <Droplets size={30} />
                ) : (
                  <Sprout size={30} />
                )}
              </div>

              <div>
                <h2 className="text-2xl font-black text-slate-950">
                  Current Water Condition Tips
                </h2>

                <p className="mt-2 text-lg font-medium text-slate-600">
                  {tipView === "home"
                    ? "Tips for everyday water use based on current conditions."
                    : "Farm-focused tips for irrigation and crop planning."}
                </p>

                {analysis && (
                  <p className="mt-2 text-sm font-bold text-slate-500">
                    Current status: {analysis.waterStatus} · Drought:{" "}
                    {analysis.droughtRisk} · Flood: {analysis.floodRisk}
                  </p>
                )}

                {!analysis && (
                  <p className="mt-2 text-sm font-bold text-slate-500">
                    Loading current water conditions...
                  </p>
                )}
              </div>
            </div>

            <div className="flex rounded-xl border border-slate-200 bg-slate-100 p-1">
              <button
                onClick={() => setTipView("home")}
                className={`rounded-lg px-5 py-3 font-black transition ${
                  tipView === "home"
                    ? "bg-sky-800 text-white shadow-sm"
                    : "text-slate-600 hover:text-sky-800"
                }`}
              >
                Home Tips
              </button>

              <button
                onClick={() => setTipView("farm")}
                className={`rounded-lg px-5 py-3 font-black transition ${
                  tipView === "farm"
                    ? "bg-green-700 text-white shadow-sm"
                    : "text-slate-600 hover:text-green-700"
                }`}
              >
                Farm Tips
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {activeTips.map((tip, index) => (
              <article
                key={`${tip.title}-${index}`}
                className={`rounded-xl border p-5 ${getTipCardStyle(
                  tip.level,
                  tipView
                )}`}
              >
                <p
                  className={`text-sm font-black uppercase tracking-[0.2em] ${getTipLabelStyle(
                    tip.level,
                    tipView
                  )}`}
                >
                  {tipView === "home"
                    ? `Tip ${index + 1} · ${tip.level}`
                    : `Farm Tip ${index + 1} · ${tip.level}`}
                </p>

                <h3 className="mt-3 text-xl font-black text-slate-900">
                  {tip.title}
                </h3>

                <p className="mt-3 text-base font-medium leading-7 text-slate-700">
                  {tip.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-[#f2ede3]">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-8 md:flex-row md:items-center md:justify-between lg:px-8">
          <div className="flex items-center gap-5">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700">
              <Leaf size={42} />
            </div>

            <div>
              <h3 className="text-xl font-black text-slate-900">
                Every drop counts.
              </h3>

              <p className="mt-2 max-w-2xl text-lg font-medium leading-7 text-slate-700">
                By working together, we can protect our water for people and
                nature.
              </p>
            </div>
          </div>

          <Link
            href="/Insights"
            className="rounded-xl border-2 border-orange-300 bg-white/60 px-8 py-4 text-center font-black text-amber-800 transition hover:border-amber-700 hover:bg-white"
          >
            Check Water Insights
          </Link>
        </div>
      </section>
    </main>
  );
}