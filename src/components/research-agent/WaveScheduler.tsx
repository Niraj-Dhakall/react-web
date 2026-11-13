"use client";

import { useMemo, useState } from "react";

/* Illustrative durations. The scheduling rule is the real one:
   each wave runs every sub-question whose deps are done, bounded by
   asyncio.Semaphore(max_workers); gather() waits for the whole wave. */
const PLAN = [
  { q: "What does L1 regularization do to model weights?", d: 1.6, deps: [] as number[] },
  { q: "What does L2 regularization do to model weights?", d: 2.1, deps: [] as number[] },
  { q: "How does regularization reduce overfitting?", d: 1.3, deps: [] as number[] },
  { q: "Which of the two produces sparse models, and why?", d: 1.5, deps: [0, 1] },
];
const PLAN_T = 0.9;
const SYN_T = 1.1;
const TMAX = 9;

function schedule(n: number) {
  const out: Record<number, [number, number]> = {};
  const waves: { span: [number, number]; members: number[] }[] = [];
  const done = new Set<number>();
  let pending = PLAN.map((_, i) => i);
  let t = PLAN_T;
  while (pending.length) {
    const ready = pending.filter((i) => PLAN[i].deps.every((d) => done.has(d)));
    if (!ready.length) break;
    const slots = Array(n).fill(t) as number[];
    let end = t;
    for (const i of ready) {
      let si = 0;
      slots.forEach((v, j) => {
        if (v < slots[si]) si = j;
      });
      const s = slots[si];
      const e = s + PLAN[i].d;
      slots[si] = e;
      out[i] = [s, e];
      end = Math.max(end, e);
    }
    waves.push({ span: [t, end], members: ready });
    ready.forEach((i) => done.add(i));
    pending = pending.filter((i) => !done.has(i));
    t = end;
  }
  return { out, waves, synth: [t, t + SYN_T] as [number, number] };
}

const pct = (x: number) => `${(x / TMAX) * 100}%`;

export function WaveScheduler() {
  const [n, setN] = useState(3);
  const s = useMemo(() => schedule(n), [n]);

  const rows: { key: string; label: React.ReactNode; span: [number, number]; kind: "c" | "w"; text: string; idx?: number }[] = [
    { key: "p", label: <b className="font-semibold text-fg">Planner</b>, span: [0, PLAN_T], kind: "c", text: "plan" },
    ...PLAN.map((p, i) => ({
      key: String(i),
      idx: i,
      label: (
        <>
          <span className="font-mono text-[11px] text-faint">
            {i}
            {p.deps.length ? ` ← [${p.deps.join(",")}]` : ""}
          </span>{" "}
          {p.q}
        </>
      ),
      span: s.out[i],
      kind: "w" as const,
      text: `${(s.out[i][1] - s.out[i][0]).toFixed(1)}s`,
    })),
    { key: "s", label: <b className="font-semibold text-fg">Synthesizer</b>, span: s.synth, kind: "c", text: "merge" },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-xl">
          <h3 className="text-lg font-semibold text-fg">One run, scheduled</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-mut">
            A hypothetical four-part plan with one dependency. Sub-question
            3 depends on 0 and 1, so it starts only after all of wave 1 finishes:{" "}
            <code className="font-mono text-[12px] text-fg">asyncio.gather</code> waits for the whole wave.{" "}
            <span className="font-mono text-[11px] text-faint">illustrative durations</span>
          </p>
        </div>
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-faint">--max-workers</p>
          <div role="group" aria-label="max workers" className="mt-1.5 inline-flex gap-1 rounded-lg border border-line bg-well p-1">
            {[1, 2, 3].map((v) => (
              <button
                key={v}
                type="button"
                aria-pressed={n === v}
                onClick={() => setN(v)}
                className={`btn w-9 rounded-md py-1.5 font-mono text-xs ${n === v ? "bg-accent text-ink" : "text-mut hover:text-fg"}`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto">
        <div className="min-w-[560px]">
          {rows.map((r) => {
            const wave = r.idx !== undefined ? s.waves.find((w) => w.members.includes(r.idx!)) : undefined;
            return (
              <div key={r.key} className="grid min-h-[38px] grid-cols-[minmax(130px,230px)_minmax(0,1fr)] items-center gap-3">
                <div className="text-[13px] leading-snug text-mut">{r.label}</div>
                <div className="relative h-6 border-l border-line">
                  {wave && (
                    <span
                      className="absolute -inset-y-1.5 rounded bg-s1/10 transition-all duration-700 ease-out-strong"
                      style={{ left: pct(wave.span[0]), width: pct(wave.span[1] - wave.span[0]) }}
                    />
                  )}
                  <span
                    className={`absolute top-0.5 flex h-5 items-center overflow-hidden whitespace-nowrap rounded pl-1.5 font-mono text-[10px] text-white transition-all duration-700 ease-out-strong ${
                      r.kind === "w" ? "bg-s1" : "bg-s2"
                    }`}
                    style={{ left: pct(r.span[0]), width: `calc(${pct(r.span[1] - r.span[0])} - 2px)` }}
                  >
                    {r.text}
                  </span>
                </div>
              </div>
            );
          })}
          <div className="grid grid-cols-[minmax(130px,230px)_minmax(0,1fr)] gap-3">
            <div />
            <div className="relative mt-1 h-5 font-mono text-[10px] text-faint">
              {Array.from({ length: TMAX + 1 }, (_, i) => (
                <span key={i} className="absolute -translate-x-1/2" style={{ left: pct(i) }}>
                  {i}s
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] text-faint">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-s2" />
            planner / synthesizer
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-s1" />
            worker
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-s1/15 outline outline-1 outline-line" />
            dependency wave
          </span>
        </div>
        <p className="font-mono text-xs text-mut">
          end to end ≈ <span className="text-fg">{s.synth[1].toFixed(1)}s</span> · wave 1 ends at{" "}
          {s.waves[0].span[1].toFixed(1)}s
        </p>
      </div>
    </div>
  );
}
