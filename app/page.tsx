"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import {
  motion,
  useInView,
  useMotionValue,
  useTransform,
  animate,
  useReducedMotion
} from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Bell,
  CheckCircle2,
  Mail,
  Search,
  ShoppingBag,
  Star,
  Store,
  Truck,
  Zap
} from "lucide-react";

const stores = [
  { name: "Dadu Charger", price: 18499, delivery: "Same day", rating: 4.5, stock: "Available" },
  { name: "Junaid Tech", price: 19199, delivery: "1-2 days", rating: 4.6, stock: "Available" },
  { name: "CZone", price: 19900, delivery: "2 days", rating: 4.7, stock: "Available" },
  { name: "Paklap", price: 20500, delivery: "2-3 days", rating: 4.6, stock: "Available" },
  { name: "Tejar", price: 21350, delivery: "3-5 days", rating: 4.4, stock: "Limited" },
  { name: "The Binary Store", price: 21800, delivery: "2-4 days", rating: 4.3, stock: "Available" },
  { name: "eTechPoint", price: 22499, delivery: "3 days", rating: 4.2, stock: "Available" },
  { name: "Authentico", price: 23100, delivery: "4 days", rating: 4.4, stock: "Available" },
  { name: "The Brand Store", price: 23999, delivery: "5 days", rating: 4.1, stock: "Limited" },
  { name: "MasterTech", price: 24650, delivery: "3-5 days", rating: 4.2, stock: "Available" }
];

const ROMAN_TAGLINES = [
  "Sasti cheez? Mil jayegi.",
  "Har dukaan, ek search mein.",
  "Mehngai ko goodbye bolo.",
  "Aapka paisa, aapki bachat.",
  "Tabs band karo, Tolmol kholo."
];

const HEADLINES = [
  "Sasti cheez?\nMil jayegi.",
  "Mehngai ko\nGoodbye bolo.",
  "Bas naam likho.\nQeemat hum dhoond lenge.",
  "Tabs band karo.\nTolmol kholo.",
  "Ek click.\nSab kuch saamne.",
  "Khareedo wahaan,\njahaan sasti ho."
];

const SEARCH_TERMS = [
  "RTX 4070 GPU",
  "Mechanical keyboard",
  "Gaming mouse",
  "PS5 controller",
  "144Hz monitor",
  "Gaming headset",
  "1TB NVMe SSD",
  "Gaming chair"
];

const pkr = new Intl.NumberFormat("en-PK", {
  style: "currency",
  currency: "PKR",
  maximumFractionDigits: 0
});

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } }
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } }
};

type WaitlistCtx = {
  seed: string;
  setSeed: (v: string) => void;
};
const WaitlistContext = createContext<WaitlistCtx>({ seed: "", setSeed: () => {} });
const useWaitlist = () => useContext(WaitlistContext);

function scrollToCTA() {
  document.getElementById("cta")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Page() {
  const reduce = useReducedMotion();
  const [seed, setSeed] = useState("");

  useEffect(() => {
    if (reduce) return;
    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true, wheelMultiplier: 0.9 });
    let id = 0;
    const raf = (t: number) => {
      lenis.raf(t);
      id = requestAnimationFrame(raf);
    };
    id = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(id);
      lenis.destroy();
    };
  }, [reduce]);

  return (
    <WaitlistContext.Provider value={{ seed, setSeed }}>
      <main className="min-h-screen bg-white text-ink">
        <Header />
        <Hero />
        <StepSection
          index={1}
          label="1"
          title="Search once. Anywhere."
          text="Type any product name on Tolmol instead of opening every store manually. One query covers the whole market."
          Visual={SearchVisual}
        />
        <StepSection
          index={2}
          label="2"
          title="See every store side by side."
          text="Each result is a clean store card with price, delivery, rating and stock — together, never scattered."
          Visual={ResultsVisual}
          reverse
        />
        <StepSection
          index={3}
          label="3"
          title="Price gaps become obvious."
          text="The same results turn into a sorted PKR comparison so the cheapest, most trusted option jumps out."
          Visual={CompareVisual}
        />
        <StepSection
          index={4}
          label="4"
          title="The best option, highlighted."
          text="Tolmol surfaces the best buying option with the savings, delivery and rating in one card."
          Visual={BestVisual}
          reverse
        />
        <WaitlistSection />
      </main>
    </WaitlistContext.Provider>
  );
}

function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a href="#top" className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-xl bg-blue-50 text-cyanline">
            <Search className="size-5" />
          </div>
          <span className="text-lg font-semibold tracking-tight">Tolmol</span>
        </a>
        <a
          href="#cta"
          className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:translate-y-[-1px]"
        >
          <Bell className="size-4" /> Join waitlist
        </a>
      </nav>
    </header>
  );
}

function Hero() {
  const { setSeed } = useWaitlist();
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const placeholder = useCyclingTerm(!focused && query === "");
  const headline = useTypewriterCycle(HEADLINES, true, 2400, 55, 22);

  return (
    <section id="top" className="relative overflow-hidden pt-32 pb-24 sm:pt-40 sm:pb-32">
      <div className="simpleGrid absolute inset-0" aria-hidden />
      <div className="absolute left-[6%] top-24 size-80 rounded-full bg-blue-100/70 blur-3xl" aria-hidden />
      <div className="absolute right-[8%] bottom-0 size-96 rounded-full bg-blue-50 blur-3xl" aria-hidden />

      <motion.div
        initial="hidden"
        animate="show"
        variants={stagger}
        className="relative mx-auto max-w-5xl px-6 text-center"
      >
        <motion.p
          variants={fadeUp}
          className="text-sm font-bold uppercase tracking-[0.32em] text-cyanline sm:text-base"
        >
          TOLMOL
        </motion.p>
        <motion.h1
          variants={fadeUp}
          aria-live="polite"
          className="mt-6 min-h-[6.5rem] whitespace-pre-line text-5xl font-semibold leading-[1.04] tracking-tight text-ink sm:min-h-[10rem] sm:text-7xl"
        >
          <span className="typingText">{headline || " "}</span>
        </motion.h1>
        <motion.p
          variants={fadeUp}
          className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600"
        >
          Tolmol pulls live prices for anything you shop for — from headphones to groceries — into
          one clean comparison flow.
        </motion.p>
        <motion.div variants={fadeUp} className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <a href="#step-1" className="premiumButton">
            See how it works <ArrowRight className="size-5" />
          </a>
          <a href="#cta" className="secondaryButton">
            <Bell className="size-4" /> Join waitlist
          </a>
        </motion.div>

        <motion.form
          variants={fadeUp}
          onSubmit={(e) => {
            e.preventDefault();
            setSeed(query);
            scrollToCTA();
          }}
          className={`relative mx-auto mt-16 flex w-full max-w-2xl items-center gap-4 rounded-3xl border bg-slate-50 px-5 py-4 transition-all ${
            focused ? "border-cyanline/60 ring-4 ring-cyanline/15 bg-white" : "border-slate-200"
          }`}
        >
          <Search className="size-6 shrink-0 text-cyanline" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={placeholder}
            aria-label="Search any product"
            className="flex-1 bg-transparent text-xl font-semibold text-ink outline-none placeholder:text-slate-400"
          />
          <button
            type="submit"
            className="shrink-0 rounded-full bg-ink px-4 py-2 text-sm font-bold text-white transition hover:translate-y-[-1px]"
          >
            <span className="hidden sm:inline">Notify me</span>
            <Bell className="size-4 sm:hidden" />
          </button>
        </motion.form>
      </motion.div>
    </section>
  );
}

function StepSection({
  index,
  label,
  title,
  text,
  Visual,
  reverse = false
}: {
  index: number;
  label: string;
  title: string;
  text: string;
  Visual: () => React.ReactElement;
  reverse?: boolean;
}) {
  return (
    <section id={`step-${index}`} className="relative py-24 sm:py-32">
      <div
        className={`mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2 lg:gap-16 ${
          reverse ? "lg:[&>*:first-child]:order-2" : ""
        }`}
      >
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={stagger}
        >
          <motion.div variants={fadeUp} className="mb-6 flex items-center gap-4">
            <span className="text-5xl font-semibold leading-none tracking-tight text-cyanline tabular-nums">
              {label.padStart(2, "0")}
            </span>
            <span className="h-px flex-1 bg-gradient-to-r from-cyanline/40 to-transparent" />
          </motion.div>
          <motion.h2
            variants={fadeUp}
            className="text-4xl font-semibold leading-[1.08] tracking-tight text-ink sm:text-5xl"
          >
            {title}
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
            {text}
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as const }}
          className="relative"
        >
          <Visual />
        </motion.div>
      </div>
    </section>
  );
}

function useTypewriterCycle(
  items: readonly string[],
  active: boolean,
  holdMs = 1500,
  typeMs = 60,
  deleteMs = 28
) {
  const [idx, setIdx] = useState(0);
  const [shown, setShown] = useState(items[0]);
  const [deleting, setDeleting] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || !active) {
      setShown(items[idx % items.length]);
      return;
    }
    const term = items[idx % items.length];

    if (!deleting && shown === term) {
      const t = setTimeout(() => setDeleting(true), holdMs);
      return () => clearTimeout(t);
    }
    if (deleting && shown === "") {
      const t = setTimeout(() => {
        setDeleting(false);
        setIdx((i) => (i + 1) % items.length);
      }, 220);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setShown((s) => (deleting ? term.slice(0, s.length - 1) : term.slice(0, s.length + 1)));
    }, deleting ? deleteMs : typeMs);
    return () => clearTimeout(t);
  }, [shown, deleting, idx, active, reduce, items, holdMs, typeMs, deleteMs]);

  return shown;
}

function useCyclingTerm(active: boolean) {
  return useTypewriterCycle(SEARCH_TERMS, active);
}

function CyclingSearchText({ className }: { className?: string }) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const text = useCyclingTerm(inView);

  return (
    <span ref={ref} className={`typingText ${className ?? ""}`}>
      {text || " "}
    </span>
  );
}

function SearchVisual() {
  return (
    <div className="relative">
      <div className="absolute -inset-6 rounded-[2.5rem] bg-blue-100/50 blur-3xl" aria-hidden />
      <div className="relative rounded-[2rem] border border-slate-200 bg-white p-5 shadow-form">
        <div className="flex items-center gap-4 rounded-3xl border border-slate-200 bg-slate-50 px-5 py-5">
          <Search className="size-6 shrink-0 text-cyanline" />
          <CyclingSearchText className="flex-1 text-xl font-semibold text-ink" />
          <a
            href="#cta"
            className="ml-auto rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-cyanline transition hover:bg-blue-100"
          >
            Notify
          </a>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-2 text-center text-xs font-semibold text-slate-500">
          {["Any product", "Live prices", "Live stock"].map((tag) => (
            <span key={tag} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function ResultsVisual() {
  return (
    <div className="relative">
      <div className="absolute -inset-6 rounded-[2.5rem] bg-blue-100/40 blur-3xl" aria-hidden />
      <div className="relative rounded-[2rem] border border-slate-200 bg-white p-4 shadow-form">
        <div className="mb-3 flex items-center justify-between px-2">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
            10 store results
          </p>
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-cyanline">
            PKR prices
          </span>
        </div>
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
          className="grid gap-2"
        >
          {stores.slice(0, 6).map((store, i) => (
            <motion.div
              key={store.name}
              variants={{
                hidden: { opacity: 0, y: 18 },
                show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } }
              }}
              className={`rounded-2xl border p-3 ${
                i === 0 ? "border-cyanline/40 bg-blue-50" : "border-slate-200 bg-white"
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-blue-50 text-cyanline">
                    <Store className="size-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{store.name}</p>
                    <p className="truncate text-xs text-slate-500">
                      {store.delivery} · {store.stock}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={
                      i === 0
                        ? "font-bold text-cyanline"
                        : "font-semibold text-slate-800"
                    }
                  >
                    {pkr.format(store.price)}
                  </p>
                  <p className="text-xs text-slate-500">★ {store.rating}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

function CompareVisual() {
  const maxPrice = Math.max(...stores.map((s) => s.price));

  return (
    <div className="relative">
      <div className="absolute -inset-6 rounded-[2.5rem] bg-blue-100/40 blur-3xl" aria-hidden />
      <div className="relative rounded-[2rem] border border-slate-200 bg-white p-5 shadow-form">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
            Sorted by price
          </p>
          <span className="rounded-full bg-ink px-3 py-1 text-xs font-bold text-white">
            Cheapest first
          </span>
        </div>
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
          className="space-y-3"
        >
          {stores.slice(0, 6).map((store, i) => (
            <motion.div
              key={store.name}
              variants={{
                hidden: { opacity: 0, x: 24 },
                show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } }
              }}
              className="rounded-2xl border border-slate-200 bg-white p-3"
            >
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-semibold">{store.name}</span>
                <span className={i === 0 ? "font-bold text-cyanline" : "text-slate-700"}>
                  {pkr.format(store.price)}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.9, ease: "easeOut", delay: 0.15 + i * 0.06 }}
                  style={{ width: `${(store.price / maxPrice) * 100}%` }}
                  className={`h-full origin-left rounded-full ${
                    i === 0 ? "bg-ink" : "bg-cyanline/70"
                  }`}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

function BestVisual() {
  const best = stores[0];
  const highest = stores[stores.length - 1].price;
  const savings = highest - best.price;

  return (
    <div className="relative">
      <div className="absolute -inset-8 rounded-[2.5rem] bg-blue-200/40 blur-3xl" aria-hidden />
      <div className="relative rounded-[2rem] border border-cyanline/25 bg-white p-6 shadow-form">
        <div className="mb-6 flex items-center justify-between">
          <span className="rounded-full bg-ink px-3 py-1 text-xs font-bold text-white">
            Best result
          </span>
          <BadgeCheck className="size-6 text-cyanline" />
        </div>
        <div className="flex items-start gap-4">
          <div className="grid size-14 place-items-center rounded-2xl bg-blue-50 text-cyanline">
            <ShoppingBag className="size-7" />
          </div>
          <div>
            <p className="text-2xl font-semibold">Your watched product</p>
            <p className="mt-2 text-slate-600">
              {best.name} has the lowest visible price with same-day delivery.
            </p>
          </div>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Info icon={<Zap className="size-4" />} label="Price" value={pkr.format(best.price)} strong />
          <Info icon={<Truck className="size-4" />} label="Delivery" value={best.delivery} />
          <Info icon={<Star className="size-4" />} label="Rating" value={`${best.rating}/5`} />
          <Info icon={<CheckCircle2 className="size-4" />} label="Stock" value={best.stock} />
        </div>
        <SavingsCallout amount={savings} />
        <a
          href="#cta"
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 font-bold text-white transition hover:translate-y-[-1px]"
        >
          <Bell className="size-4" /> Join waitlist for alerts
        </a>
      </div>
    </div>
  );
}

function SavingsCallout({ amount }: { amount: number }) {
  const ref = useRef<HTMLParagraphElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => Math.round(v).toLocaleString("en-PK"));
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      mv.set(amount);
      return;
    }
    const controls = animate(mv, amount, { duration: 1.4, ease: [0.22, 1, 0.36, 1] as const });
    return () => controls.stop();
  }, [inView, amount, mv, reduce]);

  return (
    <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-sm text-slate-500">
        Compared with the highest example price, the shopper could save
      </p>
      <p ref={ref} className="mt-1 text-4xl font-semibold text-ink">
        PKR <motion.span>{rounded}</motion.span>
      </p>
    </div>
  );
}

function Info({
  icon,
  label,
  value,
  strong
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="mb-2 flex items-center gap-2 text-sm text-slate-500">
        {icon}
        {label}
      </p>
      <p className={strong ? "font-bold text-ink" : "font-semibold text-slate-800"}>{value}</p>
    </div>
  );
}

function WaitlistSection() {
  const { seed, setSeed } = useWaitlist();
  const [email, setEmail] = useState("");
  const [product, setProduct] = useState(seed);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (seed) setProduct(seed);
  }, [seed]);

  const valid = /\S+@\S+\.\S+/.test(email);

  return (
    <section
      id="cta"
      className="relative mx-auto my-24 max-w-6xl overflow-hidden rounded-[2.5rem] border border-slate-200 bg-gradient-to-br from-blue-50 via-white to-blue-50 px-6 py-20 shadow-form sm:my-32 sm:px-12 sm:py-24"
    >
      <div className="absolute inset-0 -z-10 opacity-60">
        <div className="simpleGrid h-full w-full" />
      </div>

      <div className="mx-auto grid max-w-5xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={stagger}
        >
          <motion.h2
            variants={fadeUp}
            className="text-4xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-6xl"
          >
            Join the <span className="text-cyanline">waitlist.</span>
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="mt-5 max-w-md text-lg leading-8 text-slate-600"
          >
            Be first to compare any product across every store. We'll ping you on launch and on
            price drops for items you're watching.
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
          className="relative rounded-[2rem] border border-slate-200 bg-white p-6 shadow-form sm:p-8"
        >
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="mx-auto mb-4 grid size-14 place-items-center rounded-2xl bg-blue-50 text-cyanline">
                <CheckCircle2 className="size-7" />
              </div>
              <h3 className="text-2xl font-semibold tracking-tight text-ink">
                You're on the list.
              </h3>
              <p className="mt-2 text-slate-600">
                We'll email <span className="font-semibold text-ink">{email}</span>
                {product ? (
                  <>
                    {" "}when <span className="font-semibold text-ink">{product}</span> prices drop.
                  </>
                ) : (
                  " on launch and on price drops."
                )}
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setEmail("");
                  setProduct("");
                  setSeed("");
                }}
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-bold text-ink transition hover:border-cyanline/40"
              >
                Add another
              </button>
            </motion.div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (valid) setSubmitted(true);
              }}
            >
              <h3 className="text-2xl font-semibold tracking-tight text-ink">
                Get notified
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Drop your email. Optionally tell us what you're watching.
              </p>

              <label className="mt-6 block">
                <span className="mb-1 block text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                  Email
                </span>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-cyanline/60 focus-within:ring-4 focus-within:ring-cyanline/15">
                  <Mail className="size-4 text-cyanline" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="flex-1 bg-transparent text-sm font-semibold text-ink outline-none placeholder:text-slate-400"
                  />
                </div>
              </label>

              <label className="mt-4 block">
                <span className="mb-1 block text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                  Product <span className="font-normal normal-case tracking-normal text-slate-400">(optional)</span>
                </span>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-cyanline/60 focus-within:ring-4 focus-within:ring-cyanline/15">
                  <Search className="size-4 text-cyanline" />
                  <input
                    value={product}
                    onChange={(e) => setProduct(e.target.value)}
                    placeholder="What are you watching?"
                    className="flex-1 bg-transparent text-sm font-semibold text-ink outline-none placeholder:text-slate-400"
                  />
                </div>
              </label>

              <button
                type="submit"
                disabled={!valid}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 font-bold text-white transition hover:translate-y-[-1px] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:hover:translate-y-0"
              >
                <Bell className="size-4" /> Join waitlist
              </button>
              <p className="mt-3 text-center text-xs text-slate-400">
                No spam. Unsubscribe anytime.
              </p>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
