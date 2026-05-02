import Link from "next/link";
import Image from "next/image";
import {
  ChevronDown,
  Droplets,
  Leaf,
  Mountain,
  Sprout,
  UserCircle,
  Wrench,
} from "lucide-react";

export default function RecommendationsPage() {
  const actions = [
    {
      title: "Reduce outdoor watering",
      description:
        "Water early in the morning or evening and follow seasonal watering guidelines.",
      buttonText: "Learn how",
      href: "/recommendations/outdoor-watering",
      image: "/assets/reduce-outdoor-watering.jpg",
      cardBg: "bg-green-50",
      buttonStyle: "bg-green-700 hover:bg-green-800",
      fallbackIcon: Sprout,
    },
    {
      title: "Check for leaks",
      description:
        "A small leak can waste gallons of water every day. Check toilets, faucets, and irrigation systems.",
      buttonText: "Get tips",
      href: "/recommendations/leaks",
      image: "/assets/check-for-leaks.jpg",
      cardBg: "bg-sky-50",
      buttonStyle: "bg-sky-800 hover:bg-sky-900",
      fallbackIcon: Wrench,
    },
    {
      title: "Use water wisely outdoors",
      description:
        "Choose native plants, add mulch, and use smart irrigation to keep your yard healthy.",
      buttonText: "Explore ideas",
      href: "/recommendations/outdoor-ideas",
      image: "/assets/water-wise-outdoors.jpg",
      cardBg: "bg-orange-50",
      buttonStyle: "bg-amber-700 hover:bg-amber-800",
      fallbackIcon: Leaf,
    },
  ];

  return (
    <main className="min-h-screen bg-[#faf8f2] text-slate-900">
      {/* Navbar */}
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
            <Link href="/" className="hover:text-sky-700">
              Dashboard
            </Link>

            <Link href="/insights" className="hover:text-sky-700">
              Insights
            </Link>

            <Link
              href="/recommendations"
              className="border-b-2 border-sky-600 pb-2 text-slate-900"
            >
              Recommendations
            </Link>

            <Link href="/about" className="hover:text-sky-700">
              About
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <button className="hidden items-center gap-3 rounded-xl border border-slate-300 bg-white px-4 py-3 font-semibold text-slate-600 shadow-sm sm:flex">
              Boulder, CO
              <ChevronDown size={18} />
            </button>

            <button className="rounded-full bg-slate-900 p-2 text-white">
              <UserCircle size={28} />
            </button>
          </div>
        </nav>
      </header>

      {/* Main Content */}
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
          {actions.map((action) => {
            const FallbackIcon = action.fallbackIcon;

            return (
              <article
                key={action.title}
                className={`${action.cardBg} overflow-hidden rounded-2xl border border-slate-200 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg`}
              >
                <div className="relative mb-6 flex h-44 items-center justify-center overflow-hidden rounded-xl bg-white/50">
                  <Image
                    src={action.image}
                    alt={action.title}
                    fill
                    className="object-cover"
                  />

                  {/* 
                    If you do not have the image assets yet, you can remove the
                    Image component above and this icon will work as a visual placeholder.
                  */}
                  <FallbackIcon className="hidden text-sky-800" size={72} />
                </div>

                <h2 className="text-2xl font-black text-slate-900">
                  {action.title}
                </h2>

                <p className="mt-4 min-h-[96px] text-lg font-medium leading-8 text-slate-700">
                  {action.description}
                </p>

                <Link
                  href={action.href}
                  className={`mt-2 inline-flex rounded-lg px-6 py-3 font-black text-white shadow-md transition ${action.buttonStyle}`}
                >
                  {action.buttonText}
                </Link>
              </article>
            );
          })}
        </div>
      </section>

      {/* Bottom Callout */}
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
            href="/resources"
            className="rounded-xl border-2 border-orange-300 bg-white/60 px-8 py-4 text-center font-black text-amber-800 transition hover:border-amber-700 hover:bg-white"
          >
            See More Resources
          </Link>
        </div>
      </section>
    </main>
  );
}