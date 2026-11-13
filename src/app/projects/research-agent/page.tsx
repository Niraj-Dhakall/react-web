import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { Reveal } from "@/components/Reveal";
import { RunHistoryChart } from "@/components/RunHistoryChart";
import { SiteNav } from "@/components/SiteNav";
import { ChunkerDemo } from "@/components/research-agent/ChunkerDemo";
import {
  ByNumDemo,
  RenumberDemo,
} from "@/components/research-agent/CitationDemos";
import { CopyCommand } from "@/components/research-agent/CopyCommand";
import { PipelineBars } from "@/components/research-agent/PipelineBars";
import { PipelineFilm } from "@/components/research-agent/PipelineFilm";
import { PipelineReplay } from "@/components/research-agent/PipelineReplay";
import { RetrievalLab } from "@/components/research-agent/RetrievalLab";
import { WaveScheduler } from "@/components/research-agent/WaveScheduler";
import {
  corpus,
  headline,
  heroFacts,
  meta,
  roadmap,
  stack,
  sweep,
} from "@/data/researchAgent";

export const metadata: Metadata = {
  title: "Research Agent | Niraj Dhakal",
  description:
    "A local multi-agent research system whose answers can only cite what they read — with a first-class evaluation harness.",
};

const checks = [
  {
    q: "Is it correct?",
    tech: "correctness",
    body: "Does the answer say the same thing as the known answer?",
  },
  {
    q: "Is it grounded?",
    tech: "faithfulness",
    body: "Is every claim backed by the chunks it retrieved, with nothing made up?",
  },
  {
    q: "Does it know when to say no?",
    tech: "refusal",
    body: "For questions the documents cannot answer, does it decline instead of inventing something?",
  },
  {
    q: "Are the sources real?",
    tech: "citations",
    body: "Does every [n] marker point to a real source?",
  },
];

const chapters = [
  { id: "watch", label: "▶ animation" },
  { id: "ingest", label: "1 ingest" },
  { id: "retrieve", label: "2 retrieval" },
  { id: "agents", label: "3 agents" },
  { id: "citations", label: "4 citations" },
  { id: "measure", label: "5 results" },
  { id: "run", label: "6 run it" },
];

export default function ResearchAgentPage() {
  return (
    <div id="top">
      <SiteNav />

      <main className="mx-auto max-w-6xl px-5 sm:px-8">
        {/* =========================== HERO =========================== */}
        <section className="grid grid-cols-1 items-start gap-12 pb-10 pt-32 sm:pt-36 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.08fr)] lg:gap-14">
          <div>
            <Link
              href="/#projects"
              className="intro inline-flex items-center gap-2 font-mono text-xs text-faint transition-colors hover:text-accent"
              style={{ "--i": 0 } as CSSProperties}
            >
              ← projects / <span className="text-accent">featured</span>
            </Link>
            <p
              className="intro mt-6 font-mono text-xs uppercase tracking-[0.2em] text-faint"
              style={{ "--i": 1 } as CSSProperties}
            >
              research-agent · local multi-agent RAG · python 3.11+
            </p>
            <h1
              className="intro mt-4 font-display text-5xl font-bold leading-[1.02] tracking-[-0.03em] text-fg sm:text-6xl xl:text-[4.25rem]"
              style={{ "--i": 2 } as CSSProperties}
            >
              Answers that can only{" "}
              <span className="hl-sweep">cite what they read</span>
              <span className="text-accent">.</span>
            </h1>
            <p
              className="intro mt-6 max-w-xl text-lg leading-relaxed text-mut"
              style={{ "--i": 3 } as CSSProperties}
            >
              {meta.lede}
            </p>
            <div
              className="intro mt-7 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[12.5px] text-faint"
              style={{ "--i": 4 } as CSSProperties}
            >
              {heroFacts.map(([v, l]) => (
                <span key={l}>
                  <span className="text-fg">{v}</span>
                  {l.startsWith("-") ? "" : " "}
                  {l}
                </span>
              ))}
            </div>
            <div
              className="intro mt-8 flex flex-wrap gap-3"
              style={{ "--i": 5 } as CSSProperties}
            >
              <a
                href="#retrieve"
                className="btn inline-flex items-center gap-2 bg-accent px-5 py-2.5 font-mono text-sm font-medium text-ink hover:bg-accent-soft"
              >
                see how retrieval works
              </a>
              <a
                href="#measure"
                className="btn inline-flex items-center gap-2 border border-line px-5 py-2.5 font-mono text-sm text-fg hover:border-line-bright"
              >
                see the numbers
              </a>
            </div>
          </div>

          <div className="intro" style={{ "--i": 3 } as CSSProperties}>
            <PipelineReplay />
          </div>
        </section>

        {/* headline numbers */}
        <Reveal>
          <div className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-4">
            {headline.map((h) => (
              <div key={h.label} className="bg-raised px-5 py-5 sm:px-6">
                <p className="font-display text-4xl font-bold tabular-nums tracking-tight text-fg">
                  {h.value}
                </p>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.15em] text-accent">
                  {h.label}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-3 font-mono text-[11px] text-faint">
            Checkpoint 4 baseline · 18 golden questions · bm25 · gpt-4o-mini
            agents, gpt-4o judges · 12 Nov 2026
          </p>
        </Reveal>

        <Reveal>
          <nav aria-label="Sections" className="mt-10 flex flex-wrap gap-2">
            {chapters.map((c) => (
              <a
                key={c.id}
                href={`#${c.id}`}
                className="btn rounded-full border border-line px-3.5 py-1.5 font-mono text-xs text-mut hover:border-line-bright hover:text-fg"
              >
                {c.label}
              </a>
            ))}
          </nav>
        </Reveal>

        {/* =========================== ANIMATION =========================== */}
        <Chapter
          id="watch"
          n="▶"
          eyebrow="animation"
          title="The whole pipeline in 32 seconds."
          lede="An animated walkthrough of one real question, from PDF to scored answer. It plays on its own; use the buttons under it to jump to a step."
        >
          <Reveal>
            <PipelineFilm />
          </Reveal>
        </Chapter>

        {/* =========================== INGEST =========================== */}
        <Chapter
          id="ingest"
          n="1"
          eyebrow="ingest"
          title="PDFs become numbered chunks."
          lede="The system cannot search a whole PDF at once. So each PDF is first cut into small pieces called chunks, and every chunk gets a number that answers can point back to."
        >
          <Reveal>
            <Panel className="grid grid-cols-1 gap-10 lg:grid-cols-[1.2fr_1fr]">
              <ChunkerDemo />
              <div>
                <h3 className="text-lg font-semibold text-fg">
                  Why cut it this way?
                </h3>
                <ul className="mt-4 space-y-3.5">
                  <li className="text-sm leading-relaxed text-mut">
                    <b className="font-semibold text-fg">
                      One topic per chunk.
                    </b>{" "}
                    A chunk never crosses a heading, so it always belongs to a
                    single section.
                  </li>
                  <li className="text-sm leading-relaxed text-mut">
                    <b className="font-semibold text-fg">
                      Text and code stay apart.
                    </b>{" "}
                    They are never mixed in the same chunk.
                  </li>
                </ul>
                <h3 className="mt-8 text-lg font-semibold text-fg">
                  The library: 3 PDFs, 141 chunks
                </h3>
                <div className="mt-4 space-y-3">
                  {corpus.map((d) => (
                    <div
                      key={d.name}
                      className="grid grid-cols-[minmax(0,1fr)_2.5rem] items-center gap-3"
                    >
                      <div>
                        <span className="block truncate font-mono text-[11.5px] text-mut">
                          {d.name}
                        </span>
                        <span className="mt-1 block h-1.5 overflow-hidden rounded-full bg-well">
                          <span
                            className="block h-full rounded-full bg-accent"
                            style={{ width: `${(d.chunks / 99) * 100}%` }}
                          />
                        </span>
                      </div>
                      <span className="text-right font-mono text-sm tabular-nums text-fg">
                        {d.chunks}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Panel>
          </Reveal>
        </Chapter>

        {/* =========================== RETRIEVE =========================== */}
        <Chapter
          id="retrieve"
          n="2"
          eyebrow="retrieval"
          title="Find the right chunk."
          lede="The system can only answer from what it finds. So before it writes anything, it searches all 141 chunks for the few that hold the answer. There are three ways to search. Try each one:"
        >
          <Reveal>
            <Panel>
              <RetrievalLab />
            </Panel>
          </Reveal>

          <Reveal>
            <Panel className="mt-6 grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
              <div>
                <h3 className="text-lg font-semibold text-fg">
                  Keyword search won, so it is the default
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-mut">
                  All three were tested on real questions about these documents.
                  Keyword search put the right chunk in the top 5{" "}
                  <span className="text-fg">every time</span>, and ranked it
                  higher than the other two did on average.
                </p>
                <p className="mt-3 text-[12px] leading-relaxed text-faint">
                  For the technical reader: bm25 vs dense vs hybrid (weighted
                  RRF), 12 answerable golden questions, k = 5.
                </p>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-fg/40 text-left text-[12px] text-faint">
                    <th className="py-2 pr-3 font-normal">Search type</th>
                    <th className="py-2 pr-3 text-right font-normal">
                      Answer in top 5
                      <span className="block font-mono text-[10px]">
                        recall@5
                      </span>
                    </th>
                    <th className="py-2 text-right font-normal">
                      How near the top
                      <span className="block font-mono text-[10px]">MRR</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="text-[13px]">
                  {sweep.map((r) => (
                    <tr
                      key={r.mode + r.alpha}
                      className={`border-b border-line ${r.best ? "bg-accent/10 text-fg" : "text-mut"}`}
                    >
                      <td className="py-2 pl-1 pr-3">
                        {r.mode === "dense"
                          ? "By meaning"
                          : r.mode === "bm25"
                            ? "By keyword"
                            : "Both"}
                        {r.mode === "hybrid" && (
                          <span className="font-mono text-[11px] text-faint">
                            {" "}
                            α={r.alpha}
                          </span>
                        )}
                        {r.best && (
                          <span className="ml-2 rounded-full bg-ok/15 px-2 py-0.5 text-[10px] font-semibold text-ok">
                            default
                          </span>
                        )}
                      </td>
                      <td className="py-2 pr-3 text-right font-mono">
                        {(Number(r.recall) * 100).toFixed(0)}%
                      </td>
                      <td className="py-2 pr-1 text-right font-mono">
                        {r.mrr}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Panel>
          </Reveal>
        </Chapter>

        {/* =========================== AGENTS =========================== */}
        <Chapter
          id="agents"
          n="3"
          eyebrow="agents"
          title="Plan, run in parallel, merge."
          lede="A big question is easier to answer in pieces. A planner splits it into at most five smaller questions, workers answer the pieces at the same time, and a synthesizer joins their answers into one."
        >
          <Reveal>
            <Panel>
              <WaveScheduler />
            </Panel>
          </Reveal>
        </Chapter>

        {/* =========================== CITATIONS =========================== */}
        <Chapter
          id="citations"
          n="4"
          eyebrow="citations"
          title="It cannot cite what it did not read."
          lede="AI models sometimes make up their sources. Here the model never writes a source itself. It can only pick from a numbered list the system handed it, and anything not on that list is thrown away."
        >
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Reveal>
              <ByNumDemo />
            </Reveal>
            <Reveal delay={70}>
              <RenumberDemo />
            </Reveal>
          </div>
        </Chapter>

        {/* =========================== MEASURE =========================== */}
        <Chapter
          id="measure"
          n="5"
          eyebrow="results"
          title="Every change has to beat a number."
          lede="How do you know a change made an AI system better and not worse? You test it. 18 hand-written questions with known answers are run through the system, and four checks grade every answer."
        >
          <Reveal>
            <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
              {checks.map((c) => (
                <div key={c.tech} className="bg-raised p-5">
                  <h3 className="font-semibold text-fg">{c.q}</h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-mut">
                    {c.body}
                  </p>
                  <p className="mt-3 font-mono text-[10.5px] text-faint">
                    {c.tech}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal>
            <Panel className="mt-6">
              <h3 className="text-lg font-semibold text-fg">
                Does the extra teamwork cost any quality?
              </h3>
              <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-mut">
                The same 18 questions were answered two ways: by one worker
                alone (single), and by the full planner, workers and synthesizer
                team (multi). Every score came out{" "}
                <span className="text-fg">exactly the same</span>, at about 1.6×
                the cost. So far that is a tie, not a proven win. 1.0 is a
                perfect score. 12 Nov 2026.
              </p>
              <div className="mt-5">
                <PipelineBars />
              </div>
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 font-mono text-[11px] text-mut">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-sm bg-s1" />
                  single
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-sm bg-s2" />
                  multi
                </span>
              </div>
            </Panel>
          </Reveal>

          <Reveal>
            <Panel className="mt-6">
              <h3 className="text-lg font-semibold text-fg">
                Search quality over time
              </h3>
              <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-mut">
                Each point is one test run from 21–28 September 2026. Higher is
                better. The dip was a mistake in the test questions, not in the
                system. Hover a point to see what changed.
              </p>
              <div className="mt-5">
                <RunHistoryChart />
              </div>
            </Panel>
          </Reveal>
        </Chapter>

        {/* =========================== RUN =========================== */}

        <Reveal>
          <h3 className="mt-12 text-lg font-semibold text-fg">
            What is built so far
          </h3>
          <ol className="mt-4 flex flex-wrap gap-2">
            {roadmap.map((p) => (
              <li
                key={p.n}
                className={`rounded-full border px-3 py-1.5 font-mono text-[11.5px] ${
                  p.s === "done"
                    ? "border-ok/40 bg-ok/[0.07] text-fg"
                    : "border-line text-faint"
                }`}
              >
                <span className={p.s === "done" ? "text-ok" : ""}>
                  {p.s === "done" ? "✓" : p.n}
                </span>{" "}
                {p.t}
              </li>
            ))}
          </ol>
          <p className="mt-3 font-mono text-[11px] text-faint">
            ✓ done · numbered phases are planned
          </p>

          <div className="mt-10 flex flex-wrap gap-2">
            {stack.map((s) => (
              <span
                key={s}
                className="rounded-full border border-line px-3 py-1 font-mono text-[11px] text-mut"
              >
                {s}
              </span>
            ))}
          </div>
          <p className="mt-8 font-mono text-xs text-faint">
            <Link
              href="/#projects"
              className="link-sweep ml-3 text-mut hover:text-accent"
            >
              ← back to projects
            </Link>{" "}
            <span className="text-faint">Updated on {meta.documented}.</span>
          </p>
        </Reveal>
      </main>

      <footer className="mt-10 border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-5 py-8 font-mono text-xs text-faint sm:px-8">
          <span>© {new Date().getFullYear()} Niraj Dhakal</span>
          <span>built with ❤️</span>
        </div>
      </footer>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function Chapter({
  id,
  n,
  eyebrow,
  title = "",
  lede = "",
  children,
}: {
  id: string;
  n: string;
  eyebrow: string;
  title?: string;
  lede?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 pt-20 sm:pt-24">
      <Reveal>
        <div className="mb-8 border-t border-line-bright pt-6">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-accent">
            <span className="mr-2.5 text-faint">{n}</span>
            {eyebrow}
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold leading-[1.05] tracking-[-0.025em] text-fg sm:text-[2.4rem]">
            {title}
          </h2>
          <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-mut">
            {lede}
          </p>
        </div>
      </Reveal>
      {children}
    </section>
  );
}

function Panel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-line bg-raised p-5 sm:p-7 ${className}`}
    >
      {children}
    </div>
  );
}
