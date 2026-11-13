"use client";

import { useEffect, useRef, useState } from "react";
import { pair } from "@/data/researchAgent";

const W = 760;
const H = 290;
const P = { t: 26, r: 12, b: 34, l: 40 };
const iw = W - P.l - P.r;
const ih = H - P.t - P.b;
const y = (v: number) => P.t + ih * (1 - v);
const gw = iw / pair.metrics.length;
const bw = Math.min(30, gw * 0.3);

function barPath(x0: number, v: number) {
  const r = 4;
  const top = y(v);
  return `M${x0} ${y(0)} V${top + r} Q${x0} ${top} ${x0 + r} ${top} H${x0 + bw - r} Q${x0 + bw} ${top} ${x0 + bw} ${top + r} V${y(0)} Z`;
}

export function PipelineBars() {
  const ref = useRef<HTMLDivElement>(null);
  const [grown, setGrown] = useState(false);
  const [tip, setTip] = useState<{ i: number; which: "single" | "multi" } | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setGrown(true);
        io.disconnect();
      }
    }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="relative">
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full min-w-[620px]" role="img" aria-label="Seven metrics, single vs multi pipeline; every pair is identical">
          {[0, 0.25, 0.5, 0.75, 1].map((t) => (
            <g key={t}>
              <line x1={P.l} x2={W - P.r} y1={y(t)} y2={y(t)} stroke="var(--color-line)" />
              <text x={P.l - 8} y={y(t) + 4} textAnchor="end" className="fill-faint font-mono text-[10.5px]">
                {t.toFixed(2)}
              </text>
            </g>
          ))}
          {pair.metrics.map((m, i) => {
            const cx = P.l + gw * i + gw / 2;
            return (
              <g key={m.m}>
                {(["single", "multi"] as const).map((which, j) => {
                  const v = which === "single" ? m.a : m.b;
                  const x0 = j === 0 ? cx - bw - 1 : cx + 1;
                  return (
                    <g key={which}>
                      <path
                        d={barPath(x0, v)}
                        fill={j === 0 ? "var(--color-s1)" : "var(--color-s2)"}
                        style={{
                          transformOrigin: `0 ${y(0)}px`,
                          transform: `scaleY(${grown ? 1 : 0})`,
                          transition: `transform 800ms cubic-bezier(0.23,1,0.32,1) ${i * 60 + j * 40}ms`,
                        }}
                      />
                      <rect
                        x={x0 - 2}
                        y={P.t}
                        width={bw + 4}
                        height={ih}
                        fill="transparent"
                        onMouseEnter={() => setTip({ i, which })}
                        onMouseLeave={() => setTip(null)}
                      />
                    </g>
                  );
                })}
                <text x={cx} y={y(Math.max(m.a, m.b)) - 7} textAnchor="middle" className="fill-fg font-mono text-[10.5px]">
                  {m.a.toFixed(3)}
                </text>
                <text x={cx} y={H - P.b + 20} textAnchor="middle" className="fill-mut font-mono text-[11px]">
                  {m.m}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      {tip && (
        <div
          className="pointer-events-none absolute top-0 z-10 -translate-x-1/2 rounded-lg border border-line-bright bg-ink/95 px-3 py-2 font-mono text-[11px] text-mut shadow-xl"
          style={{ left: `${((P.l + gw * tip.i + gw / 2) / W) * 100}%` }}
        >
          <span className="text-fg">{pair.metrics[tip.i].m}</span> · {tip.which}:{" "}
          <span className="text-fg">
            {(tip.which === "single" ? pair.metrics[tip.i].a : pair.metrics[tip.i].b).toFixed(3)}
          </span>
        </div>
      )}
    </div>
  );
}
