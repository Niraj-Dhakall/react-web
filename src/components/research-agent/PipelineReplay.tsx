"use client";

import { useEffect, useRef, useState } from "react";

/* Example walkthrough in plain language. Questions and corpus excerpts come
   from the docs (CLI examples, golden hints, reference answers); the merged
   prose and the off-topic question wording are illustrative. */

type Lane = { chunk: string; ans: string; cites: string };
type Scenario = {
  tab: string;
  q: string;
  plan: string[];
  planText: string;
  lanes: Lane[];
  merged: boolean;
  synthLine: string;
  synthText: string;
  answer: string;
  cites: string[];
  refusal?: boolean;
};

const SC: Record<string, Scenario> = {
  multi: {
    tab: "Two-part question",
    q: "Compare Einstein's photoelectric equation with the de Broglie wavelength formula.",
    plan: [
      "What is Einstein's photoelectric equation?",
      "What is the de Broglie wavelength formula?",
    ],
    planText:
      "This question asks two things, so the planner splits it into two smaller questions.",
    lanes: [
      {
        chunk: "Chapter12.pdf · “hf = K + E … photoelectric equation”",
        ans: "hf = K + E_B: photon energy equals the electron’s kinetic energy plus its binding energy.",
        cites: "[1]",
      },
      {
        chunk: "Chapter12.pdf · “h/p is called the de Broglie wavelength”",
        ans: "λ = h/p: Planck’s constant divided by the particle’s momentum.",
        cites: "[1]",
      },
    ],
    merged: true,
    synthLine: "2 answers combined into 1",
    synthText:
      "The synthesizer joins the two answers into one and renumbers the sources so every [n] still points to the right place.",
    answer:
      "The photoelectric equation, hf = K + E_B, splits a photon’s energy between the electron’s kinetic and binding energy [1]. The de Broglie relation, λ = h/p, gives matter a wavelength [2].",
    cites: [
      "[1] Chapter12.pdf — hf = K + E … photoelectric equation",
      "[2] Chapter12.pdf — h/p is called the de Broglie wavelength",
    ],
  },
  single: {
    tab: "Simple question",
    q: "What is Einstein's photoelectric equation?",
    plan: ["What is Einstein's photoelectric equation?"],
    planText:
      "This question is already simple, so the planner keeps it as one.",
    lanes: [
      {
        chunk: "Chapter12.pdf · “hf = K + E … photoelectric equation”",
        ans: "hf = K + EB: photon energy equals the electron’s kinetic energy plus its binding energy.",
        cites: "[1]",
      },
    ],
    merged: false,
    synthLine: "only 1 answer, nothing to combine",
    synthText:
      "There is only one answer, so there is nothing to combine. It is passed straight through.",
    answer:
      "hf = K + EB: the photon energy (hf) equals the electron’s kinetic energy (K) plus its binding energy (EB) [1].",
    cites: ["[1] Chapter12.pdf — hf = K + E … photoelectric equation"],
  },
  oos: {
    tab: "Off-topic question",
    q: "How do I center a div with CSS?",
    plan: ["How do I center a div with CSS?"],
    planText:
      "The documents are physics and machine-learning notes. The planner still passes the question on, unchanged.",
    lanes: [
      {
        chunk: "nothing about CSS in any chunk",
        ans: "The context does not answer this question.",
        cites: "no sources",
      },
    ],
    merged: false,
    synthLine: "only 1 answer, nothing to combine",
    synthText:
      "The worker found nothing relevant, so it says so instead of guessing.",
    answer:
      "The provided context does not cover CSS, so this can’t be answered from the corpus.",
    cites: ["No sources: the system declined instead of making something up."],
    refusal: true,
  },
};

type Key = keyof typeof SC;

/* The walkthrough: one plain-language caption per step. */
type Step = { title: string; body: (s: Scenario) => string; ms: number };
const STEPS: Step[] = [
  { title: "Ask", body: () => "You ask a question in the terminal.", ms: 2000 },
  { title: "Plan", body: (s) => s.planText, ms: 2600 },
  {
    title: "Search",
    body: (s) =>
      `${s.lanes.length > 1 ? "Each worker searches" : "A worker searches"} the documents for the chunk most likely to hold the answer.`,
    ms: 2600,
  },
  {
    title: "Answer",
    body: (s) =>
      `${s.lanes.length > 1 ? "Each worker answers" : "The worker answers"} using only what it found, and notes which chunk the answer came from.`,
    ms: 2800,
  },
  { title: "Combine", body: (s) => s.synthText, ms: 2600 },
  {
    title: "Final answer",
    body: (s) =>
      s.refusal
        ? "The system declines rather than making something up."
        : "Every [n] points to a real chunk the system read. Hover one to see its source.",
    ms: 0,
  },
];
const LAST = STEPS.length - 1;

export function PipelineReplay() {
  const [key, setKey] = useState<Key>("multi");
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [hover, setHover] = useState<number | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const s = SC[key];
  const cur = STEPS[step];

  /* start once the console is on screen */
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setPlaying(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* auto-advance */
  useEffect(() => {
    if (!playing || step >= LAST) return;
    const t = setTimeout(() => {
      const next = step + 1;
      setStep(next);
      if (next >= LAST) setPlaying(false);
    }, STEPS[step].ms);
    return () => clearTimeout(t);
  }, [playing, step]);

  const restart = (k: Key = key) => {
    setKey(k);
    setStep(0);
    setPlaying(true);
  };
  const go = (n: number) => {
    setPlaying(false);
    setStep(Math.max(0, Math.min(LAST, n)));
  };

  /* what is visible at this step */
  const planShown = step >= 1;
  const searching = step === 2;
  const lanesShown = step >= 2;
  const answered = step >= 3;
  const synthShown = step >= 4;
  const answerShown = step >= 5;
  const stage = [0, 1, 2, 2, 3, 4][step];
  const stageState = (i: number) =>
    stage === i ? "active" : stage > i ? "done" : "idle";
  const answerParts = s.answer.split(/(\[\d\])/);

  return (
    <div
      ref={rootRef}
      className="ticks overflow-hidden border border-line bg-raised shadow-2xl shadow-black/40"
    >
      {/* window chrome + query tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-line px-3.5 py-3">
        <div
          role="tablist"
          aria-label="Example questions"
          className="flex flex-1 flex-wrap gap-1.5"
        >
          {(Object.keys(SC) as Key[]).map((k) => (
            <button
              key={k}
              role="tab"
              aria-selected={k === key}
              onClick={() => restart(k)}
              className={`btn rounded-full border px-3 py-1 font-mono text-[11px] ${
                k === key
                  ? "border-accent bg-accent text-ink"
                  : "border-line text-mut hover:border-line-bright hover:text-fg"
              }`}
            >
              {SC[k].tab}
            </button>
          ))}
        </div>
      </div>

      {/* narration */}
      <div
        className="border-b border-line bg-well px-4 py-3"
        aria-live="polite"
      >
        <div className="flex items-baseline justify-between gap-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-accent">
            step {step + 1}/{STEPS.length} · {cur.title}
          </p>
          <div className="flex shrink-0 items-center gap-1">
            <CtlButton
              label="Previous step"
              onClick={() => go(step - 1)}
              disabled={step === 0}
            >
              ‹
            </CtlButton>
            {step >= LAST ? (
              <CtlButton label="Replay" onClick={() => restart()}>
                ↻
              </CtlButton>
            ) : (
              <CtlButton
                label={playing ? "Pause" : "Play"}
                onClick={() => setPlaying((p) => !p)}
              >
                {playing ? "❚❚" : "▶"}
              </CtlButton>
            )}
            <CtlButton
              label="Next step"
              onClick={() => go(step + 1)}
              disabled={step >= LAST}
            >
              ›
            </CtlButton>
          </div>
        </div>
        <p
          key={`${key}-${step}`}
          className="fade-in mt-1.5 min-h-[2.75rem] text-[13.5px] leading-snug text-fg"
        >
          {cur.body(s)}
        </p>
        <div
          className="mt-2.5 flex gap-1"
          role="group"
          aria-label="Jump to step"
        >
          {STEPS.map((st, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Step ${i + 1}: ${st.title}`}
              onClick={() => go(i)}
              className="group relative h-3 flex-1 cursor-pointer"
            >
              <span className="absolute inset-x-0 top-1 h-1 overflow-hidden rounded-full bg-line">
                <span
                  key={
                    i === step && playing ? `${key}-${step}-run` : `${key}-${i}`
                  }
                  className={`block h-full origin-left rounded-full bg-accent ${i === step && playing && st.ms ? "progress-fill" : ""}`}
                  style={
                    i === step && playing && st.ms
                      ? { animationDuration: `${st.ms}ms` }
                      : { transform: `scaleX(${i <= step ? 1 : 0})` }
                  }
                />
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pb-3 pt-1 lg:min-h-[585px]">
        {/* Question */}
        <StageRow label="Question" state={step === 0 ? "active" : "done"}>
          <p className="text-[15px] font-medium leading-snug text-fg">{s.q}</p>
        </StageRow>

        {/* Plan */}
        <StageRow label="Plan" state={stageState(1)}>
          {planShown ? (
            s.plan.map((p, i) => (
              <div
                key={`${key}-${p}`}
                className="fade-in flex gap-2 py-0.5 text-sm leading-snug text-fg"
                style={{ animationDelay: `${i * 220}ms` }}
              >
                <span className="w-4 shrink-0 font-mono text-[11px] text-faint">
                  {i + 1}.
                </span>
                {p}
              </div>
            ))
          ) : (
            <Placeholder>waiting for the planner…</Placeholder>
          )}
        </StageRow>

        {/* Workers */}
        <StageRow label="Workers" state={stageState(2)}>
          {lanesShown ? (
            <div
              className={`grid gap-2 ${s.lanes.length > 1 ? "sm:grid-cols-2" : ""}`}
            >
              {s.lanes.map((l, i) => (
                <div
                  key={`${key}-${i}`}
                  className="fade-in rounded-lg border border-line bg-well px-3 py-2.5"
                >
                  <div className="flex justify-between gap-2 font-mono text-[10.5px] text-faint">
                    <span>worker {i + 1}</span>
                    <span className={searching ? "text-accent" : "text-ok"}>
                      {searching ? (
                        <>
                          searching<span className="thinking">…</span>
                        </>
                      ) : (
                        "done ✓"
                      )}
                    </span>
                  </div>
                  <p className="mt-2 rounded border-l-2 border-accent bg-raised px-2 py-1 font-mono text-[10.5px] leading-snug text-mut">
                    {searching
                      ? "looking through the documents"
                      : `found: ${l.chunk}`}
                  </p>
                  {answered && (
                    <p className="fade-in mt-1.5 text-[13px] leading-snug text-fg">
                      <span className="font-bold">Answer:</span> {l.ans}{" "}
                      <span className="font-mono text-[10.5px] text-blue">
                        {l.cites}
                      </span>
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <Placeholder>
              {planShown
                ? `${s.lanes.length} worker${s.lanes.length > 1 ? "s" : ""} ready`
                : "nothing to do yet"}
            </Placeholder>
          )}
        </StageRow>

        {/* Combine */}
        <StageRow label="Combine" state={stageState(3)}>
          {synthShown ? (
            <p className="fade-in text-[13px] leading-snug text-mut">
              {s.synthLine} <span className="text-ok">✓</span>
            </p>
          ) : (
            <Placeholder>waiting for the workers…</Placeholder>
          )}
        </StageRow>

        {/* Answer */}
        <StageRow label="Answer" state={stageState(4)} last>
          {answerShown ? (
            <div className="fade-in">
              <p
                className={`text-[15px] leading-relaxed ${s.refusal ? "italic text-mut" : "text-fg"}`}
              >
                {answerParts.map((part, i) => {
                  const m = part.match(/^\[(\d)\]$/);
                  if (!m) return <span key={i}>{part}</span>;
                  const n = Number(m[1]);
                  return (
                    <sup
                      key={i}
                      onMouseEnter={() => setHover(n)}
                      onMouseLeave={() => setHover(null)}
                      className="ml-px cursor-default rounded px-0.5 font-mono text-[10px] font-semibold text-blue hover:bg-accent/25"
                    >
                      [{n}]
                    </sup>
                  );
                })}
              </p>
              <ul className="mt-2.5 grid gap-1">
                {s.cites.map((c, i) => (
                  <li
                    key={c}
                    className={`rounded px-2 py-1 font-mono text-[10.5px] text-mut transition-colors ${hover === i + 1 ? "bg-accent/20 text-fg" : ""}`}
                  >
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <Placeholder>not yet</Placeholder>
          )}
        </StageRow>
      </div>

      <div className="flex flex-wrap justify-between gap-2 border-t border-line bg-well px-4 py-2.5 font-mono text-[10.5px] text-faint">
        <span>
          {s.lanes.length > 1
            ? "planner → 2 workers → synthesizer"
            : "planner → 1 worker"}
        </span>
        <span>example run</span>
      </div>
    </div>
  );
}

function Placeholder({ children }: { children: React.ReactNode }) {
  return <p className="py-0.5 font-mono text-[11px] text-faint">{children}</p>;
}

function StageRow({
  label,
  state,
  last,
  children,
}: {
  label: string;
  state: "idle" | "active" | "done";
  last?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`grid grid-cols-[84px_minmax(0,1fr)] gap-3 py-3 transition-opacity duration-300 ${last ? "" : "border-b border-line"}`}
      style={{ opacity: state === "idle" ? 0.5 : 1 }}
    >
      <div
        className={`flex items-start gap-2 pt-0.5 font-mono text-[10.5px] uppercase tracking-wider ${state === "active" ? "text-fg" : "text-faint"}`}
      >
        <span
          className={`mt-[3px] h-2 w-2 shrink-0 rounded-full transition-all duration-300 ${
            state === "active"
              ? "bg-accent shadow-[0_0_0_4px_rgba(245,165,36,0.25)]"
              : state === "done"
                ? "bg-ok"
                : "bg-line-bright"
          }`}
        />
        {label}
      </div>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

function CtlButton({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className="btn grid h-7 w-7 place-items-center rounded-md border border-line font-mono text-[11px] text-mut hover:border-accent hover:text-accent disabled:pointer-events-none disabled:opacity-30"
    >
      {children}
    </button>
  );
}
