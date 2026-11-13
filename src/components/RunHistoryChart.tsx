"use client";

import { useState } from "react";
import { history } from "@/data/researchAgent";

const W = 760;
const H = 320;
const P = { t: 18, r: 16, b: 54, l: 40 };
const iw = W - P.l - P.r;
const ih = H - P.t - P.b;
const n = history.length;
const x = (i: number) => P.l + (iw * (i + 0.5)) / n;
const y = (v: number) => P.t + ih * (1 - v);
const line = (k: "recall" | "mrr") => history.map((d, i) => `${i ? "L" : "M"}${x(i)} ${y(d[k])}`).join(" ");

export function RunHistoryChart() {
  const [active, setActive] = useState<number | null>(null);
  const d = active !== null ? history[active] : null;

  return (
    <figure className="m-0">
      <div className="relative">
        <div className="overflow-x-auto">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="block h-auto w-full min-w-[620px]"
            role="img"
            aria-label="recall@5 and MRR across ten eval runs, 21 to 28 September 2026"
            onMouseLeave={() => setActive(null)}
          >
            {[0, 0.25, 0.5, 0.75, 1].map((t) => (
              <g key={t}>
                <line x1={P.l} x2={W - P.r} y1={y(t)} y2={y(t)} stroke="var(--color-line)" />
                <text x={P.l - 8} y={y(t) + 4} textAnchor="end" className="fill-faint font-mono text-[10.5px]">
                  {t.toFixed(2)}
                </text>
              </g>
            ))}

            {/* broken-hints band */}
            <rect x={x(2) - iw / n / 2} y={P.t} width={iw / n} height={ih} fill="var(--color-bad)" opacity={0.1} />
            <text x={x(2)} y={P.t + 12} textAnchor="middle" className="fill-bad font-mono text-[10px]">
              broken hints
            </text>

            {history.map((h, i) => (
              <g key={h.run}>
                <text x={x(i)} y={H - P.b + 18} textAnchor="middle" className="fill-mut font-mono text-[10.5px]">
                  {h.d}
                </text>
                {h.tag && (
                  <text x={x(i)} y={H - P.b + 33} textAnchor="middle" className="fill-faint font-mono text-[10px]">
                    {h.tag}
                  </text>
                )}
              </g>
            ))}

            {active !== null && (
              <line x1={x(active)} x2={x(active)} y1={P.t} y2={P.t + ih} stroke="var(--color-line-bright)" strokeDasharray="3 3" />
            )}

            <path d={line("recall")} fill="none" stroke="var(--color-s1)" strokeWidth={2} strokeLinejoin="round" />
            <path d={line("mrr")} fill="none" stroke="var(--color-s2)" strokeWidth={2} strokeLinejoin="round" />

            {history.map((h, i) => (
              <g key={h.run + "pts"}>
                <circle cx={x(i)} cy={y(h.recall)} r={active === i ? 5.5 : 4.5} fill="var(--color-s1)" stroke="var(--color-raised)" strokeWidth={2} />
                <circle
                  cx={x(i)}
                  cy={y(h.mrr)}
                  r={active === i ? 5.5 : 4.5}
                  fill={h.old ? "var(--color-raised)" : "var(--color-s2)"}
                  stroke={h.old ? "var(--color-s2)" : "var(--color-raised)"}
                  strokeWidth={2}
                />
              </g>
            ))}

            <text x={x(n - 1) - 8} y={y(1) - 10} textAnchor="end" className="fill-fg font-mono text-[11px]">
              recall@5 1.000
            </text>
            <text x={x(n - 1) - 8} y={y(0.85) + 20} textAnchor="end" className="fill-fg font-mono text-[11px]">
              MRR 0.850
            </text>

            {history.map((h, i) => (
              <rect
                key={h.run + "hit"}
                x={x(i) - iw / n / 2}
                y={P.t}
                width={iw / n}
                height={ih}
                fill="transparent"
                onMouseEnter={() => setActive(i)}
                onClick={() => setActive(i)}
              />
            ))}
          </svg>
        </div>

        {d && active !== null && (
          <div
            className="pointer-events-none absolute top-2 z-10 w-60 rounded-lg border border-line-bright bg-ink/95 p-3 font-mono text-[11px] leading-relaxed shadow-xl backdrop-blur"
            style={{
              left: `${(x(active) / W) * 100}%`,
              transform: active >= n / 2 ? "translateX(calc(-100% - 14px))" : "translateX(14px)",
            }}
          >
            <div className="text-fg">{d.run}</div>
            <div className="mt-1 text-mut">
              recall@5 <span className="text-fg">{d.recall.toFixed(3)}</span> · MRR{" "}
              <span className="text-fg">{d.mrr.toFixed(3)}</span>
              {d.old ? " (÷14)" : ""}
            </div>
            <div className="mt-1.5 font-sans text-[12px] text-mut">{d.ch}</div>
          </div>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 font-mono text-[11px] text-mut">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-[3px] w-4 rounded bg-s1" />
          recall@5
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-[3px] w-4 rounded bg-s2" />
          MRR
        </span>
        <span className="text-faint">○ hollow = MRR averaged over 14 cases (before the 25 Sep fix)</span>
      </div>

      <details className="mt-3">
        <summary className="cursor-pointer font-mono text-[11px] uppercase tracking-[0.2em] text-faint hover:text-accent">
          table view
        </summary>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[560px] text-[12px]">
            <thead className="text-left font-mono text-[10.5px] uppercase tracking-wider text-faint">
              <tr>
                <th className="py-1.5 pr-3 font-normal">run</th>
                <th className="py-1.5 pr-3 font-normal">change</th>
                <th className="py-1.5 pr-3 text-right font-normal">recall@5</th>
                <th className="py-1.5 text-right font-normal">MRR</th>
              </tr>
            </thead>
            <tbody className="text-mut">
              {history.map((h) => (
                <tr key={h.run} className="border-t border-line">
                  <td className="py-1.5 pr-3 font-mono text-fg">{h.run}</td>
                  <td className="py-1.5 pr-3">{h.ch}</td>
                  <td className="py-1.5 pr-3 text-right font-mono tabular-nums">{h.recall.toFixed(3)}</td>
                  <td className="py-1.5 text-right font-mono tabular-nums">{h.mrr.toFixed(3)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </figure>
  );
}
