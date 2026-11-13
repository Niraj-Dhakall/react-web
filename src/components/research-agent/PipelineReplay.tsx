"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/* Illustrative replays. Questions and corpus excerpts come from the docs
   (CLI examples, golden hints, reference answers); the merged prose and the
   out-of-scope question wording are illustrative. */

type Lane = { chunk: string; ans: string; cites: string };
type Scenario = {
  tab: string;
  q: string;
  plan: string[];
  planNote: string;
  lanes: Lane[];
  synth: string;
  answer: string;
  cites: string[];
  calls: string;
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
    planNote: "2 independent sub-questions → one wave, run in parallel",
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
    synth: "LLM merge — 2 findings → one global source list, markers renumbered.",
    answer:
      "The photoelectric equation, hf = K + E_B, splits a photon’s energy between the electron’s kinetic and binding energy [1]. The de Broglie relation, λ = h/p, gives matter a wavelength [2].",
    cites: [
      "[1] Chapter12.pdf — hf = K + E … photoelectric equation",
      "[2] Chapter12.pdf — h/p is called the de Broglie wavelength",
    ],
    calls: "LLM calls: planner 1 · workers 2 · synthesizer 1",
  },
  single: {
    tab: "Single-hop",
    q: "What is Einstein's photoelectric equation?",
    plan: ["What is Einstein's photoelectric equation?"],
    planNote: "Already focused → exactly one sub-question, unchanged",
    lanes: [
      {
        chunk: "Chapter12.pdf · “hf = K + E … photoelectric equation”",
        ans: "hf = K + EB — photon energy equals the electron’s kinetic energy plus its binding energy.",
        cites: "[1]",
      },
    ],
    synth: "Pass-through — one finding, so no LLM call; answer and citations returned unchanged.",
    answer:
      "hf = K + EB — the photon energy (hf) equals the electron’s kinetic energy (K) plus its binding energy (EB) [1].",
    cites: ["[1] Chapter12.pdf — hf = K + E … photoelectric equation"],
    calls: "LLM calls: planner 1 · worker 1 · synthesizer 0",
  },
  oos: {
    tab: "Out of scope",
    q: "How do I center a div with CSS?",
    plan: ["How do I center a div with CSS?"],
    planNote: "Out-of-scope queries stay whole — the corpus is physics and ML notes",
    lanes: [
      {
        chunk: "BM25 always returns some chunk — none of them is about CSS",
        ans: "The context does not answer this question.",
        cites: "no citations",
      },
    ],
    synth: "Pass-through — the worker declined in prose, with nothing to cite.",
    answer: "The provided context does not cover CSS, so this can’t be answered from the corpus.",
    cites: ["Refusal judge → correctly refused"],
    calls: "LLM calls: planner 1 · worker 1 · synthesizer 0",
    refusal: true,
  },
};

const STAGES = ["Plan", "Workers", "Synth", "Answer"] as const;
type StageState = "idle" | "active" | "done";
const LANE_STEPS = ["retrieving", "calling LLM", "mapping citations"];

export function PipelineReplay() {
  const [key, setKey] = useState<keyof typeof SC>("multi");
  const [stage, setStage] = useState<StageState[]>(["done", "done", "done", "done"]);
  const [lane, setLane] = useState<number[]>([3, 3]); // steps completed per lane
  const [hover, setHover] = useState<number | null>(null);
  const runRef = useRef(0);
  const s = SC[key];

  const play = useCallback(async (k: keyof typeof SC) => {
    const id = ++runRef.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const n = SC[k].lanes.length;
    if (reduce) {
      setStage(["done", "done", "done", "done"]);
      setLane(Array(n).fill(3));
      return;
    }
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
    const alive = () => id === runRef.current;
    setStage(["idle", "idle", "idle", "idle"]);
    setLane(Array(n).fill(0));
    await sleep(300);
    if (!alive()) return;
    setStage(["active", "idle", "idle", "idle"]);
    await sleep(850);
    if (!alive()) return;
    setStage(["done", "active", "idle", "idle"]);
    await Promise.all(
      Array.from({ length: n }, async (_, li) => {
        await sleep(li * 160);
        for (let step = 1; step <= 3; step++) {
          if (!alive()) return;
          await sleep(step === 2 ? 800 + li * 260 : 420);
          if (!alive()) return;
          setLane((prev) => prev.map((v, i) => (i === li ? step : v)));
        }
      }),
    );
    if (!alive()) return;
    setStage(["done", "done", "active", "idle"]);
    await sleep(n > 1 ? 900 : 450);
    if (!alive()) return;
    setStage(["done", "done", "done", "active"]);
    await sleep(450);
    if (!alive()) return;
    setStage(["done", "done", "done", "done"]);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => play("multi"), 700);
    return () => clearTimeout(t);
  }, [play]);

  const select = (k: keyof typeof SC) => {
    setKey(k);
    play(k);
  };

  const answerParts = s.answer.split(/(\[\d\])/);

  return (
    <div className="ticks overflow-hidden rounded-none border border-line bg-raised shadow-2xl shadow-black/40">
      <div className="flex flex-wrap items-center gap-2 border-b border-line px-3.5 py-3">
        <div role="tablist" aria-label="Example questions" className="flex flex-1 flex-wrap gap-1.5">
          {(Object.keys(SC) as (keyof typeof SC)[]).map((k) => (
            <button
              key={k}
              role="tab"
              aria-selected={k === key}
              onClick={() => select(k)}
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
        <button
          type="button"
          onClick={() => play(key)}
          className="btn rounded-md border border-line px-2.5 py-1 font-mono text-[11px] text-mut hover:border-line-bright hover:text-fg"
        >
          ↻ replay
        </button>
      </div>

      <div className="overflow-x-auto whitespace-nowrap border-b border-dashed border-line px-4 py-3 font-mono text-xs">
        <span className="text-faint">$ research-agent research </span>
        <span className="text-fg">&quot;{s.q}&quot;</span>
      </div>

      <div className="px-4 pb-3 pt-1">
        {/* Plan */}
        <StageRow label={STAGES[0]} state={stage[0]}>
          {s.plan.map((p, i) => (
            <div key={p} className="flex gap-2 py-0.5 text-sm leading-snug text-fg">
              <span className="w-4 shrink-0 font-mono text-[11px] text-faint">{i}.</span>
              {p}
            </div>
          ))}
          <p className="mt-1 font-mono text-[11px] text-faint">{s.planNote}</p>
        </StageRow>

        {/* Workers */}
        <StageRow label={STAGES[1]} state={stage[1]}>
          <div className="grid gap-2">
            {s.lanes.map((l, i) => {
              const done = lane[i] ?? 3;
              return (
                <div key={i} className="rounded-lg border border-line bg-well px-3 py-2.5">
                  <div className="flex justify-between gap-3 font-mono text-[10.5px] text-faint">
                    <span>worker {i} · bm25 · k=8</span>
                    <span className={done >= 3 ? "text-ok" : "text-accent"}>
                      {done >= 3 ? "done" : done === 0 && stage[1] !== "active" ? "queued" : LANE_STEPS[done]}
                    </span>
                  </div>
                  <div className="mt-2 flex gap-1">
                    {[0, 1, 2].map((st) => (
                      <span key={st} className="h-1 flex-1 overflow-hidden rounded-full bg-line">
                        <span
                          className="block h-full origin-left rounded-full bg-s1 transition-transform duration-500"
                          style={{ transform: `scaleX(${done > st ? 1 : 0})` }}
                        />
                      </span>
                    ))}
                  </div>
                  <p
                    className="mt-2 overflow-hidden text-ellipsis rounded border-l-2 border-accent bg-raised px-2 py-1 font-mono text-[10.5px] text-mut transition-opacity duration-300"
                    style={{ opacity: done >= 1 ? 1 : 0.25 }}
                  >
                    {l.chunk}
                  </p>
                  <p
                    className="mt-1.5 text-[13px] leading-snug text-fg transition-opacity duration-300"
                    style={{ opacity: done >= 3 ? 1 : 0.25 }}
                  >
                    {l.ans} <span className="font-mono text-[10.5px] text-blue">{l.cites}</span>
                  </p>
                </div>
              );
            })}
          </div>
        </StageRow>

        {/* Synth */}
        <StageRow label={STAGES[2]} state={stage[2]}>
          <p className="text-[13px] leading-snug text-mut">{s.synth}</p>
        </StageRow>

        {/* Answer */}
        <StageRow label={STAGES[3]} state={stage[3]} last>
          <p className={`text-[15px] leading-relaxed ${s.refusal ? "italic text-mut" : "text-fg"}`}>
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
        </StageRow>
      </div>

      <div className="flex flex-wrap justify-between gap-2 border-t border-line bg-well px-4 py-2.5 font-mono text-[10.5px] text-faint">
        <span>{s.calls}</span>
        <span>illustrative replay</span>
      </div>
    </div>
  );
}

function StageRow({
  label,
  state,
  last,
  children,
}: {
  label: string;
  state: StageState;
  last?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`grid grid-cols-[76px_minmax(0,1fr)] gap-3 py-3 transition-opacity duration-300 ${last ? "" : "border-b border-line"}`}
      style={{ opacity: state === "idle" ? 0.35 : 1 }}
    >
      <div className={`flex items-start gap-2 pt-0.5 font-mono text-[10.5px] uppercase tracking-wider ${state === "active" ? "text-fg" : "text-faint"}`}>
        <span
          className={`mt-[3px] h-2 w-2 shrink-0 rounded-full transition-all duration-300 ${
            state === "active" ? "bg-accent shadow-[0_0_0_4px_rgba(245,165,36,0.25)]" : state === "done" ? "bg-ok" : "bg-line-bright"
          }`}
        />
        {label}
      </div>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
