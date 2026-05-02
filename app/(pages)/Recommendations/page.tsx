import Link from "next/link";
import {
    ChevronDown,
    Leaf,
    Mountain,
    Sprout,
    UserCircle,
    Wrench,
    Droplets,
} from "lucide-react";

export default function RecommendationsPage() {
    const actions = [
        {
            title: "Reduce outdoor watering",
            description:
                "Water early in the morning or evening and follow seasonal watering guidelines.",
            buttonText: "Learn how",
            cardBg: "bg-green-50",
            buttonStyle: "bg-green-700 hover:bg-green-800",
            imageSrc: "/assets/WaterConservationImage.png",
            articleUrl: "https://www.sjwater.org/Water-Resources-Management/Conservation/Conservation/At-Home#At-Home",
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
            articleUrl: "https://water.ca.gov/Programs/Water-Use-And-Efficiency/Agricultural-Water-Use-Efficiency",
        },
    ];

    return (
        <main className="min-h-screen bg-[#faf8f2] text-slate-900">
            <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur">
                <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-sky-100 text-sky-800">
                            <Droplets size={26} />
                        </div>

                        <span className="text-xl font-black tracking-wide text-slate-900">
                            Hydro Flow
                        </span>
                    </Link>

                    <div className="hidden items-center gap-10 font-semibold text-slate-600 md:flex">
                        <Link href="/" className="hover:text-sky-700">
                            Home
                        </Link>
                        <Link href="/dashboard" className="hover:text-sky-700">
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
                    {actions.map((action) => {
                        return (
                            <article
                                key={action.title}
                                className={`${action.cardBg} flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg`}>
                                <div className="mb-6 flex h-45 items-center justify-center rounded-xl bg-white/60">
                                    <img
                                        src={action.imageSrc}
                                        alt={action.title}
                                        className="object-cover h-45"
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
                        );
                    })}
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
                        href="/dashboard"
                        className="rounded-xl border-2 border-orange-300 bg-white/60 px-8 py-4 text-center font-black text-amber-800 transition hover:border-amber-700 hover:bg-white"
                    >
                        Check Water Status
                    </Link>
                </div>
            </section>
        </main>
    );
}