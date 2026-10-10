import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react";
import { ChromeOrb } from "./ChromeOrb";
import { useInView } from "@/hooks/use-in-view";

export const NAME = "YOUR NAME";
const MAILTO = "mailto:?subject=A%20problem%20worth%20solving";

function Lines({ lines, className = "", delay = 0 }: { lines: ReactNode[]; className?: string; delay?: number }) {
  return (
    <span className={className}>
      {lines.map((l, i) => (
        <span key={i} className="mask-line" style={{ "--i": i, "--d": `${delay}ms` } as CSSProperties}>
          <span>{l}</span>
        </span>
      ))}
    </span>
  );
}

function Section({ id, className = "", children, threshold = 0.2 }: { id?: string; className?: string; children: ReactNode; threshold?: number }) {
  const [ref, inView] = useInView<HTMLElement>(threshold);
  return (
    <section id={id} ref={ref} className={`relative overflow-hidden ${inView ? "is-in" : ""} ${className}`}>
      {children}
    </section>
  );
}

function Marquee({ text, className = "", dur = "30s", rev = false }: { text: string; className?: string; dur?: string; rev?: boolean }) {
  const row = Array.from({ length: 6 }, () => text).join("  ✦  ") + "  ✦  ";
  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`} aria-hidden>
      <div className={`marquee inline-block ${rev ? "marquee-rev" : ""}`} style={{ "--dur": dur } as CSSProperties}>
        <span>{row}</span>
        <span>{row}</span>
      </div>
    </div>
  );
}

/* ---------------- HERO ---------------- */
export function Hero() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 650);
    return () => clearTimeout(t);
  }, []);
  return (
    <header className={`grain relative min-h-[100svh] overflow-hidden bg-obsidian ${ready ? "is-in" : ""}`}>
      <div className="intro-bar pointer-events-none absolute inset-x-0 top-1/2 z-30 h-[3px] bg-lime" />
      <div className="orb-in pointer-events-none absolute right-[-30vw] top-[8vh] h-[90vw] w-[90vw] max-h-[1100px] max-w-[1100px] sm:right-[-12vw] sm:top-[2vh] sm:h-[70vw] sm:w-[70vw] lg:right-[-6vw] lg:h-[60vw] lg:w-[60vw]">
        <ChromeOrb />
      </div>
      <div className="pointer-events-none absolute left-[55%] top-[18%] hidden h-[38vw] w-[38vw] rounded-full border border-silver/15 lg:block" style={{ animation: "spin 60s linear infinite" }}>
        <span className="absolute -top-1 left-1/2 h-2 w-2 bg-lime" />
      </div>

      <nav className="fade-late relative z-20 flex items-center justify-between px-5 py-5 sm:px-10" style={{ "--d": "1.3s" } as CSSProperties}>
        <a href="#top" className="label text-paper">{NAME}</a>
        <div className="flex gap-5">
          <a href="#about" className="label hidden text-silver hover:text-lime sm:inline">About</a>
          <a href="#services" className="label hidden text-silver hover:text-lime sm:inline">Services</a>
          <a href="#contact" className="label text-lime hover:text-paper">Contact ↗</a>
        </div>
      </nav>

      <div id="top" className="relative z-10 flex min-h-[calc(100svh-72px)] flex-col justify-end px-5 pb-8 sm:px-10 sm:pb-10">
        <h1 className="display text-[17vw] text-paper sm:text-[14vw] lg:text-[11.5vw]">
          <Lines
            delay={150}
            lines={[
              "Turning",
              <>Business <span className="text-uv">problems</span></>,
              <>into <span className="hollow text-silver">growth</span></>,
              <>strategies<span className="text-lime">.</span></>,
            ]}
          />
        </h1>
        <div className="fade-late mt-8 flex flex-wrap items-end justify-between gap-6" style={{ "--d": "1.6s" } as CSSProperties}>
          <p className="label text-silver">
            <span className="mr-3 inline-block h-2 w-2 bg-lime align-middle" />
            Strategy. Positioning. Growth.
          </p>
          <a href="#about" className="group flex items-center gap-4 border border-paper/30 px-6 py-4 transition-colors hover:border-lime hover:bg-lime hover:text-obsidian">
            <span className="label">Explore</span>
            <span className="inline-block transition-transform group-hover:translate-y-1">↓</span>
          </a>
        </div>
      </div>
    </header>
  );
}

/* ---------------- ABOUT ---------------- */
export function About() {
  const imgRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = imgRef.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const p = (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight;
        el.style.setProperty("--py", `${p * -60}px`);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <Section id="about" className="bg-obsidian py-24 sm:py-36">
      <Marquee text="Strategy that doesn't stop at the slide deck" className="display mb-20 text-[12vw] text-uv/20 sm:text-[8vw]" dur="45s" />
      <div className="grid gap-12 px-5 sm:px-10 lg:grid-cols-12">
        <div ref={imgRef} className="wipe relative aspect-[4/5] lg:col-span-5" style={{ "--wipe": "var(--uv)" } as CSSProperties}>
          {/* Designed placeholder — swap for a real portrait */}
          <div className="absolute inset-0 overflow-hidden bg-card" style={{ transform: "translateY(var(--py, 0))" }}>
            <div className="absolute inset-0" style={{ background: "repeating-linear-gradient(0deg, transparent 0 11px, color-mix(in oklab, var(--silver) 10%, transparent) 11px 12px)" }} />
            <div className="absolute left-1/2 top-[30%] h-[38%] w-[46%] -translate-x-1/2 rounded-full border border-silver/40" />
            <div className="absolute bottom-0 left-1/2 h-[34%] w-[80%] -translate-x-1/2 rounded-t-full border border-b-0 border-silver/40" />
            <div className="absolute left-0 top-[48%] h-px w-full bg-lime" />
            <span className="display absolute bottom-4 right-4 text-[22vw] leading-none text-uv/70 lg:text-[10vw]">10</span>
          </div>
          <span className="label absolute -bottom-7 left-0 text-muted-foreground">[ Portrait — placeholder ]</span>
          <span className="label absolute -top-7 right-0 text-lime">Fig. 01</span>
        </div>
        <div className="flex flex-col justify-center lg:col-span-7 lg:pl-10">
          <p className="label mb-8 text-lime">01 — About</p>
          <h2 className="display text-[13vw] text-paper sm:text-[9vw] lg:text-[6.4vw]">
            <Lines lines={["Strategy is", "easy to", <span className="text-uv">recommend.</span>, <span className="hollow text-silver">Harder to</span>, <span className="hollow text-silver">execute.</span>]} />
          </h2>
          <p className="rv mt-10 max-w-lg text-lg text-silver" style={{ "--d": "500ms" } as CSSProperties}>
            A decade between strategy rooms and delivery calendars. Building positioning, shaping brands, running campaigns and making plans work in reality.
          </p>
          <p className="rv mt-6 border-l-2 border-laser pl-4 font-mono text-sm text-paper" style={{ "--d": "650ms" } as CSSProperties}>
            Strategy that doesn't stop at the slide deck.
          </p>
          <div className="rv mt-10 flex flex-wrap gap-x-8 gap-y-2" style={{ "--d": "800ms" } as CSSProperties}>
            {["Positioning", "Brand", "Campaigns", "Delivery"].map((t) => (
              <span key={t} className="label text-muted-foreground">+ {t}</span>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ---------------- QUESTIONS ---------------- */
const QUESTIONS = ["Where do we begin?", "Is the budget working?", "Why aren't we converting?", "Is the positioning right?", "What's stopping scale?", "How do we grow retention?"];

export function Questions() {
  const [active, setActive] = useState<number | null>(null);
  return (
    <Section className="bg-lime py-24 text-obsidian sm:py-32">
      <div className="px-5 sm:px-10">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
          <h2 className="display max-w-4xl text-[12vw] sm:text-[8vw] lg:text-[6vw]">
            <Lines lines={["What's really", "holding growth back?"]} />
          </h2>
          <p className="label">02 — Diagnosis / tap a line</p>
        </div>
        <ul className="border-t-2 border-obsidian">
          {QUESTIONS.map((q, i) => {
            const on = active === i;
            return (
              <li key={q} className="border-b-2 border-obsidian">
                <button
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={() => setActive(i)}
                  onBlur={() => setActive(null)}
                  onClick={() => setActive(on ? null : i)}
                  aria-pressed={on}
                  className={`group relative flex w-full items-center gap-4 overflow-hidden px-2 py-4 text-left transition-colors duration-300 sm:gap-8 sm:py-6 ${on ? "bg-obsidian text-lime" : ""}`}
                >
                  <span className="label w-10 shrink-0">{String(i + 1).padStart(2, "0")} /</span>
                  <span className={`display text-[8vw] transition-transform duration-500 sm:text-[5.5vw] lg:text-[4.4vw] ${on ? "translate-x-3 sm:translate-x-8" : ""}`} style={{ transitionTimingFunction: "var(--ease-out)" }}>
                    {q}
                  </span>
                  <span className={`ml-auto hidden h-10 w-10 shrink-0 border-2 transition-all duration-500 sm:block ${on ? "rotate-45 border-uv bg-uv" : "border-obsidian"}`} />
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </Section>
  );
}

/* ---------------- SERVICES ---------------- */
const SERVICES = [
  { t: "Go-to-market", d: "Find the right market and route to demand.", align: "justify-start", style: "text-paper" },
  { t: "Growth", d: "Identify friction and build a plan to remove it.", align: "justify-end", style: "text-uv" },
  { t: "Commerce", d: "Improve conversion and customer value.", align: "justify-center", style: "hollow text-silver" },
  { t: "Marketing", d: "Connect channels to business outcomes.", align: "justify-start sm:pl-[12vw]", style: "text-paper italic" },
  { t: "Positioning", d: "Give customers a reason to choose you.", align: "justify-end", style: "text-lime" },
  { t: "Digital", d: "Connect brand, content and performance.", align: "justify-start", style: "hollow text-uv" },
];

export function Services() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <Section id="services" className="bg-obsidian py-24 sm:py-36">
      <div className="px-5 sm:px-10">
        <p className="label mb-6 text-lime">03 — Services</p>
        <h2 className="display mb-16 text-[12vw] text-paper sm:text-[8vw] lg:text-[6vw]">
          <Lines lines={["Where strategy", <>meets <span className="text-laser">action.</span></>]} />
        </h2>
        <div className="border-t border-border">
          {SERVICES.map((s, i) => {
            const on = open === i;
            return (
              <div key={s.t} className="border-b border-border">
                <button
                  type="button"
                  aria-expanded={on}
                  aria-controls={`svc-${i}`}
                  onClick={() => setOpen(on ? null : i)}
                  className={`group flex w-full items-center gap-4 py-5 text-left sm:py-6 ${s.align}`}
                >
                  <span className="label text-muted-foreground transition-colors group-hover:text-lime">{String(i + 1).padStart(2, "0")}</span>
                  <span className={`display text-[12vw] transition-transform duration-500 group-hover:-skew-x-6 sm:text-[9vw] lg:text-[7.5vw] ${s.style}`}>{s.t}</span>
                  <span className={`label transition-transform duration-500 ${on ? "rotate-45 text-lime" : "text-muted-foreground"}`}>+</span>
                </button>
                <div id={`svc-${i}`} role="region" className="grid transition-[grid-template-rows] duration-500" style={{ gridTemplateRows: on ? "1fr" : "0fr", transitionTimingFunction: "var(--ease-out)" }}>
                  <div className="overflow-hidden">
                    <p className={`flex pb-8 font-mono text-base text-silver sm:text-lg ${s.align}`}>
                      <span className="border-l-2 border-lime pl-4">→ {s.d}</span>
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}

/* ---------------- PROCESS ---------------- */
const STEPS = ["Listen", "Audit", "Strategize", "Execute"];

export function Process() {
  const ref = useRef<HTMLElement>(null);
  const [p, setP] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const v = (window.innerHeight * 0.6 - r.top) / r.height;
        setP(Math.max(0, Math.min(1, v)));
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const activeIdx = Math.min(STEPS.length - 1, Math.floor(p * STEPS.length * 1.05));

  return (
    <section ref={ref} className="relative overflow-hidden bg-uv py-24 sm:py-32">
      <div className="px-5 sm:px-10">
        <div className="mb-14 flex items-end justify-between">
          <p className="label text-paper">04 — Process</p>
          <p className="label text-lime">{String(activeIdx + 1).padStart(2, "0")} / 04</p>
        </div>
        <div className="relative pl-8 sm:pl-16">
          <div className="absolute bottom-0 left-2 top-0 w-px bg-paper/25 sm:left-5" />
          <div className="absolute left-2 top-0 w-[3px] -translate-x-px bg-lime sm:left-5" style={{ height: `${p * 100}%` }} />
          <div className="absolute left-2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-lime sm:left-5" style={{ top: `${p * 100}%` }} />
          {STEPS.map((s, i) => {
            const on = i <= activeIdx;
            return (
              <div key={s} className="flex items-baseline gap-4 py-2 sm:gap-8">
                <span className={`label transition-colors ${on ? "text-lime" : "text-paper/40"}`}>{String(i + 1).padStart(2, "0")}</span>
                <span
                  className={`display text-[15vw] transition-all duration-700 sm:text-[12vw] lg:text-[10vw] ${on ? "text-obsidian" : "hollow text-paper/40"} ${i === activeIdx ? "translate-x-4 sm:translate-x-10" : ""}`}
                  style={{ transitionTimingFunction: "var(--ease-out)" }}
                >
                  {s}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------------- EXECUTION ---------------- */
export function Execution() {
  return (
    <Section className="grain bg-obsidian py-28 sm:py-40">
      <div className="pointer-events-none absolute inset-0 flex flex-col justify-center gap-2 opacity-90" aria-hidden>
        <Marquee text="Brand · Content · Digital · Performance" className="display -rotate-3 bg-laser py-2 text-[7vw] text-obsidian sm:text-[4vw]" dur="25s" />
        <Marquee text="Big thinking · Real execution" className="display rotate-2 py-2 text-[7vw] text-uv/40 sm:text-[4vw]" dur="35s" rev />
      </div>
      <div className="relative z-10 px-5 text-center sm:px-10">
        <p className="label mb-8 text-laser">05 — Execution</p>
        <h2 className="display text-[16vw] text-paper sm:text-[12vw] lg:text-[10vw]" style={{ textShadow: "0 0 60px var(--obsidian)" }}>
          <Lines lines={["Big thinking.", <span className="text-lime">Real execution.</span>]} />
        </h2>
        <p className="rv label mt-10 text-silver" style={{ "--d": "400ms" } as CSSProperties}>Brand. Content. Digital. Performance.</p>
      </div>
    </Section>
  );
}

/* ---------------- FIELD NOTES ---------------- */
const NOTES = ["Disrupt the market", "Clarity before channels", "Bad positioning is expensive", "Virality is a piece of art", "Conversion is a context problem"];

export function FieldNotes() {
  return (
    <Section className="bg-obsidian py-24 sm:py-32">
      <div className="px-5 sm:px-10">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-4">
          <h2 className="display text-[14vw] text-paper sm:text-[9vw] lg:text-[7vw]">
            <Lines lines={[<>Field notes<span className="text-laser">.</span></>]} />
          </h2>
          <p className="label text-muted-foreground">Coming soon</p>
        </div>
        <ul>
          {NOTES.map((n, i) => (
            <li key={n} className="rv group flex flex-wrap items-baseline gap-x-6 gap-y-1 border-t border-border py-5 transition-colors hover:border-laser" style={{ "--d": `${i * 80}ms` } as CSSProperties}>
              <span className="label w-16 text-laser">N°{String(i + 1).padStart(2, "0")}</span>
              <span className="display text-[8vw] text-silver transition-all duration-500 group-hover:translate-x-3 group-hover:text-paper sm:text-[5vw] lg:text-[3.6vw]">{n}</span>
              <span className="label ml-auto text-muted-foreground">Note · In draft</span>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

/* ---------------- CONTACT ---------------- */
export function Contact() {
  return (
    <Section id="contact" className="flex min-h-[100svh] flex-col bg-obsidian">
      <div className="wipe relative flex flex-1 flex-col justify-center overflow-hidden px-5 py-24 sm:px-10" style={{ "--wipe": "var(--uv)" } as CSSProperties}>
        <div className="pointer-events-none absolute -right-[20vw] top-1/2 h-[80vw] w-[80vw] -translate-y-1/2 rounded-full bg-uv sm:-right-[10vw] sm:h-[55vw] sm:w-[55vw]" style={{ boxShadow: "var(--glow-uv)" }} aria-hidden />
        <div className="pointer-events-none absolute -right-[20vw] top-1/2 h-[80vw] w-[80vw] -translate-y-1/2 sm:-right-[10vw] sm:h-[55vw] sm:w-[55vw]" style={{ animation: "spin 30s linear infinite" }} aria-hidden>
          <span className="absolute left-1/2 top-0 h-4 w-4 -translate-x-1/2 bg-lime" />
        </div>
        <p className="label relative mb-8 text-lime">06 — Contact</p>
        <h2 className="display relative text-[15vw] text-paper sm:text-[11vw] lg:text-[9.5vw]">
          <Lines lines={["Got a problem", "worth", <span className="text-lime">solving?</span>]} />
        </h2>
        <p className="rv relative mt-8 font-mono text-lg text-silver" style={{ "--d": "400ms" } as CSSProperties}>Let's get into it.</p>
        <a
          href={MAILTO}
          className="rv group relative mt-10 inline-flex w-fit items-center gap-4 bg-lime px-7 py-5 text-obsidian transition-colors hover:bg-paper"
          style={{ "--d": "550ms" } as CSSProperties}
        >
          <span className="display text-xl sm:text-3xl">Start a conversation</span>
          <span className="text-2xl transition-transform group-hover:translate-x-2">→</span>
        </a>
      </div>
      <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-border px-5 py-6 sm:px-10">
        <span className="label text-muted-foreground">© {new Date().getFullYear()} {NAME}</span>
        <span className="label text-muted-foreground">Strategy. Positioning. Growth.</span>
        <a href="#top" className="label text-paper hover:text-lime">Back to top ↑</a>
      </footer>
    </Section>
  );
}
