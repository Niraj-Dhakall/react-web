"use client";

import { useMemo, useState } from "react";

/* A simplified example that reproduces the documented "gamma" situation:
   the chunk with the answer contains the exact word, but search-by-meaning
   ranks it too low for the combined mode to lift it into the top 5.
   Ranks are hypothetical; scores are computed live from the real formulas. */
type Chunk = {
  id: string;
  t: string;
  d: number | null;
  b: number | null;
  answer?: boolean;
};
const CH: Chunk[] = [
  { id: "A", t: "Sounds related, but never says “gamma”", d: 1, b: 3 },
  { id: "B", t: "Sounds related, but never says “gamma”", d: 2, b: 5 },
  { id: "C", t: "Same topic, different section", d: 3, b: 7 },
  { id: "D", t: "Same topic, different section", d: 4, b: 4 },
  { id: "E", t: "Loosely related", d: 5, b: 10 },
  { id: "F", t: "Loosely related, no matching words", d: 6, b: null },
  { id: "H", t: "Says “gamma”, but about something else", d: 20, b: 1 },
  {
    id: "G",
    t: "The chunk that contains the answer",
    d: 40,
    b: 2,
    answer: true,
  },
];

const STOP = new Set(
  "a an and are as at be by for from how in is it of on or that the this to what when where which who why with does do did".split(
    " ",
  ),
);
const tokenize = (t: string) =>
  t
    .normalize("NFKC")
    .toLowerCase()
    .match(/[\p{L}\p{N}_]+/gu) ?? [];

const K = 5;
const ROW = 44;
type Mode = "dense" | "bm25" | "hybrid";

const MODES: { id: Mode; label: string; tech: string; how: string }[] = [
  {
    id: "dense",
    label: "By meaning",
    tech: "dense",
    how: "Compares what the question means with what each chunk means. Good with paraphrases, but it can overlook a rare exact word.",
  },
  {
    id: "bm25",
    label: "By keyword",
    tech: "bm25",
    how: "Looks for chunks that contain the question’s exact words. Rare words like “gamma” count the most. This is the system’s default.",
  },
  {
    id: "hybrid",
    label: "Both",
    tech: "hybrid",
    how: "Runs both searches and blends the two rankings. The slider sets how much each one counts.",
  },
];

export function RetrievalLab() {
  const [q, setQ] = useState(
    "In the ML study guide, what does gamma represent?",
  );
  const [mode, setMode] = useState<Mode>("bm25");
  const [alpha, setAlpha] = useState(0.5);
  const toks = tokenize(q);
  const m = MODES.find((x) => x.id === mode)!;

  const ranked = useMemo(() => {
    const score = (c: Chunk) => {
      if (mode === "dense") return c.d ? 1 / c.d : -1;
      if (mode === "bm25") return c.b ? 1 / c.b : -1;
      return (
        (c.d ? alpha / (60 + c.d) : 0) + (c.b ? (1 - alpha) / (60 + c.b) : 0)
      );
    };
    return [...CH]
      .map((c) => ({ c, s: score(c) }))
      .sort((x, y) => y.s - x.s || (x.c.id < y.c.id ? -1 : 1));
  }, [mode, alpha]);

  const pos = new Map(ranked.map((r, i) => [r.c.id, i]));
  const gi = pos.get("G") ?? 0;
  const hit = gi < K;
  const G = CH.find((c) => c.answer)!;
  const fusedG = alpha / (60 + G.d!) + (1 - alpha) / (60 + G.b!);

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.95fr_1.05fr]">
      <div>
        <Step n="1">The question</Step>
        <input
          id="q-in"
          type="text"
          aria-label="Question"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          spellCheck={false}
          autoComplete="off"
          disabled={true}
          className="mt-2 w-full rounded-lg border border-line bg-well px-3 py-2.5 text-[15px] text-fg outline-none focus:border-accent"
        />
        <p className="mt-3 text-[13px] text-mut">
          Keyword search would look for these words:
        </p>
        <div
          className="mt-2 flex min-h-[30px] flex-wrap gap-1.5"
          aria-live="polite"
        >
          {toks.length ? (
            toks.map((t, i) => (
              <span
                key={t + i}
                className={`rounded px-2 py-0.5 font-mono text-xs ${
                  STOP.has(t)
                    ? "border border-dashed border-line text-faint line-through"
                    : "bg-accent/20 text-fg"
                }`}
              >
                {t}
              </span>
            ))
          ) : (
            <span className="text-xs text-faint">
              Type a question to see its keywords.
            </span>
          )}
        </div>
        <p className="mt-1.5 text-[12px] text-faint">
          Crossed-out words are too common to help, so they are ignored.
        </p>

        <div className="mt-7">
          <Step n="2">Pick how to search</Step>
        </div>
        <div
          role="group"
          aria-label="Search type"
          className="mt-2 inline-flex flex-wrap gap-1 rounded-lg border border-line bg-well p-1"
        >
          {MODES.map((x) => (
            <button
              key={x.id}
              type="button"
              aria-pressed={mode === x.id}
              onClick={() => setMode(x.id)}
              className={`btn rounded-md px-3.5 py-1.5 text-[13px] font-medium ${mode === x.id ? "bg-accent text-ink" : "text-mut hover:text-fg"}`}
            >
              {x.label}
            </button>
          ))}
        </div>
        <p
          className="mt-3 min-h-[3.75rem] text-sm leading-relaxed text-mut"
          aria-live="polite"
        >
          {m.how}{" "}
          <span className="font-mono text-[11px] text-faint">({m.tech})</span>
        </p>

        {mode === "hybrid" && (
          <div className="mt-2">
            <input
              id="alpha"
              type="range"
              aria-label="Balance between keyword and meaning"
              min={0.05}
              max={0.95}
              step={0.05}
              value={alpha}
              onChange={(e) => setAlpha(Number(e.target.value))}
              className="w-full accent-[var(--color-accent)]"
            />
            <div className="flex justify-between text-[12px] text-faint">
              <span>← more keyword</span>
              <span className="font-mono">α = {alpha.toFixed(2)}</span>
              <span>more meaning →</span>
            </div>
            <details className="mt-3 text-[12px] text-faint">
              <summary className="cursor-pointer hover:text-mut">
                Show the math
              </summary>
              <p className="mt-2 rounded-lg border border-dashed border-line bg-well px-3 py-2.5 font-mono text-[11.5px] leading-relaxed text-mut">
                score = α/(60 + meaning rank) + (1−α)/(60 + keyword rank)
                <br />
                answer chunk = {alpha.toFixed(2)}/(60+{G.d}) +{" "}
                {(1 - alpha).toFixed(2)}/(60+{G.b}) ={" "}
                <span className="text-fg">{fusedG.toFixed(4)}</span>
              </p>
            </details>
          </div>
        )}
      </div>

      <div>
        <Step n="3">What the search brings back</Step>
        <p className="mt-2 text-[13px] text-mut">
          Only the top {K} chunks are kept. If the answer is not in them, the
          system cannot use it.
        </p>
        <div className="relative mt-3" style={{ height: CH.length * ROW + 12 }}>
          {CH.map((c) => {
            const i = pos.get(c.id) ?? 0;
            return (
              <div
                key={c.id}
                className={`absolute inset-x-0 grid h-[38px] grid-cols-[22px_minmax(0,1fr)] items-center gap-2.5 rounded-lg border px-3 transition-[transform,opacity] duration-500 ease-out-strong ${
                  c.answer
                    ? "border-accent/70 bg-accent/10"
                    : "border-line bg-well"
                } ${i >= K ? "opacity-45" : ""}`}
                style={{
                  transform: `translateY(${i * ROW + (i >= K ? 12 : 0)}px)`,
                }}
              >
                <span className="font-mono text-[11px] text-faint">
                  {i + 1}
                </span>
                <span
                  className={`truncate text-[13px] ${c.answer ? "font-semibold text-fg" : "text-mut"}`}
                >
                  {c.answer && <span className="mr-1.5 text-accent">★</span>}
                  {c.t}
                </span>
              </div>
            );
          })}
          <div
            className="absolute inset-x-0 border-t-2 border-dashed border-fg/50"
            style={{ transform: `translateY(${K * ROW + 3}px)` }}
          >
            <span className="absolute -top-2.5 right-0 bg-raised px-1.5 text-[11px] text-mut">
              top {K} cut-off
            </span>
          </div>
        </div>

        <p
          className={`mt-4 rounded-lg px-3.5 py-2.5 text-sm leading-relaxed ${hit ? "bg-ok/10 text-fg" : "bg-bad/10 text-fg"}`}
          aria-live="polite"
        >
          <b className={hit ? "text-ok" : "text-bad"}>
            {hit ? "✓ Found." : "✗ Missed."}
          </b>{" "}
          {hit
            ? `The answer chunk is #${gi + 1}, inside the top ${K}.${mode === "bm25" ? " Now try “By meaning” and watch it drop out." : ""}`
            : `The answer chunk is #${gi + 1}, outside the top ${K}, so the system would never read it.`}
        </p>
        <p className="mt-2 text-[12px] text-faint">
          Simplified example with made-up ranks. The scoring formulas are the
          real ones.
        </p>
      </div>
    </div>
  );
}

function Step({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-2.5 font-semibold text-fg">
      <span className="grid h-6 w-6 place-items-center rounded-full bg-accent font-mono text-[12px] font-bold text-ink">
        {n}
      </span>
      {children}
    </p>
  );
}
