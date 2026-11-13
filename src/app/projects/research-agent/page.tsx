import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { Reveal } from "@/components/Reveal";
import { RunHistoryChart } from "@/components/RunHistoryChart";
import { SiteNav } from "@/components/SiteNav";
import { ChunkerDemo } from "@/components/research-agent/ChunkerDemo";
import { ByNumDemo, RenumberDemo } from "@/components/research-agent/CitationDemos";
import { CopyCommand } from "@/components/research-agent/CopyCommand";
import { PipelineBars } from "@/components/research-agent/PipelineBars";
import { PipelineReplay } from "@/components/research-agent/PipelineReplay";
import { RetrievalLab } from "@/components/research-agent/RetrievalLab";
import { WaveScheduler } from "@/components/research-agent/WaveScheduler";
import {
  chunkerRules,
  commands,
  corpus,
  failModes,
  golden,
  headline,
  heroFacts,
  ingestSteps,
  judges,
  meta,
  pair,
  plannerRails,
  roadmap,
  stack,
  stories,
  sweep,
  whyBm25,
} from "@/data/researchAgent";

export const metadata: Metadata = {
  title: "Research Agent | Niraj Dhakal",
  description:
    "A local multi-agent research system whose answers can only cite what they read — with a first-class evaluation harness.",
};

const chapters = [
  { id: "ingest", label: "ingest" },
  { id: "retrieve", label: "retrieve" },
  { id: "agents", label: "agents" },
  { id: "citations", label: "citations" },
  { id: "measure", label: "measure" },
  { id: "roadmap", label: "roadmap" },
  { id: "run", label: "run it" },
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
            <div className="intro mt-8 flex flex-wrap gap-3" style={{ "--i": 5 } as CSSProperties}>
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
                <p className="font-display text-4xl font-bold tabular-nums tracking-tight text-fg">{h.value}</p>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.15em] text-accent">{h.label}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 font-mono text-[11px] text-faint">
            Checkpoint 4 baseline · 18 golden questions · bm25 · gpt-4o-mini agents, gpt-4o judges · 12 Nov 2026
          </p>
        </Reveal>

        <Reveal>
          <nav aria-label="Chapters" className="mt-10 flex flex-wrap gap-2">
            {chapters.map((c, i) => (
              <a
                key={c.id}
                href={`#${c.id}`}
                className="btn rounded-full border border-line px-3.5 py-1.5 font-mono text-xs text-mut hover:border-line-bright hover:text-fg"
              >
                <span className="mr-1.5 text-faint">{String(i + 1).padStart(2, "0")}</span>
                {c.label}
              </a>
            ))}
          </nav>
        </Reveal>

        {/* =========================== INGEST =========================== */}
        <Chapter
          id="ingest"
          n="01"
          eyebrow="the write path"
          title="Documents become numbered, searchable chunks."
          lede="Ingestion runs once per document. SQLite is the source of truth; the HNSW and BM25 indexes are rebuildable caches derived from it."
        >
          <Reveal>
            <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
              {ingestSteps.map((s, i) => (
                <div key={s.title} className="bg-raised p-5 sm:p-6">
                  <div className="flex items-center justify-between font-mono text-[11px]">
                    <span className="text-faint">{s.file}</span>
                    <span className="text-accent">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <h3 className="mt-2 text-xl font-semibold text-fg">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-mut">{s.body}</p>
                  <dl className="mt-4 grid gap-1 font-mono text-[11.5px]">
                    {s.spec.map(([k, v]) => (
                      <div key={k} className="flex gap-2">
                        <dt className="text-faint">{k}</dt>
                        <dd className="text-fg">{v}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal>
            <Panel className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-[1.2fr_1fr]">
              <ChunkerDemo />
              <div>
                <h3 className="text-lg font-semibold text-fg">Invariants the chunker keeps</h3>
                <ol className="mt-4 space-y-3.5">
                  {chunkerRules.map((r, i) => (
                    <li key={r.b} className="grid grid-cols-[24px_minmax(0,1fr)] gap-2 text-sm leading-relaxed text-mut">
                      <span className="font-mono text-[11px] leading-6 text-faint">{["i", "ii", "iii", "iv"][i]}</span>
                      <span>
                        <b className="font-semibold text-fg">{r.b}</b> {r.d}
                      </span>
                    </li>
                  ))}
                </ol>
                <div className="mt-6 rounded-xl border border-line bg-well p-4">
                  <div className="flex items-baseline justify-between">
                    <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-faint">corpus</span>
                    <span className="font-mono text-[11px] text-faint">141 chunks · 141 embeddings</span>
                  </div>
                  <div className="mt-3 space-y-2.5">
                    {corpus.map((d) => (
                      <div key={d.name} className="grid grid-cols-[minmax(0,1fr)_2.5rem] items-center gap-3">
                        <div>
                          <span className="block truncate font-mono text-[11.5px] text-mut">{d.name}</span>
                          <span className="mt-1 block h-1.5 overflow-hidden rounded-full bg-raised">
                            <span className="block h-full rounded-full bg-accent" style={{ width: `${(d.chunks / 99) * 100}%` }} />
                          </span>
                        </div>
                        <span className="text-right font-mono text-sm tabular-nums text-fg">{d.chunks}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Panel>
          </Reveal>
        </Chapter>

        {/* =========================== RETRIEVE =========================== */}
        <Chapter
          id="retrieve"
          n="02"
          eyebrow="retrieval · phase 3"
          title="Dense, keyword, or both — fused by rank."
          lede="Dense search finds meaning; BM25 finds exact tokens like “gamma”. Hybrid mode fuses both ranked lists with weighted reciprocal rank fusion, so the incomparable score scales never need normalizing."
        >
          <Reveal>
            <Panel>
              <RetrievalLab />
            </Panel>
          </Reveal>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Reveal>
              <Panel className="h-full">
                <h3 className="text-lg font-semibold text-fg">Measured on the golden set</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-mut">
                  Retrieval-only sweep over the 12 answerable questions at k = 5,
                  27 Sep. Query vectors come from the cache, so a repeat sweep
                  makes zero API calls.
                </p>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[420px] text-sm">
                    <thead>
                      <tr className="border-b border-fg/40 text-left font-mono text-[10.5px] uppercase tracking-wider text-faint">
                        <th className="py-2 pr-3 font-normal">mode</th>
                        <th className="py-2 pr-3 text-right font-normal normal-case">α</th>
                        <th className="py-2 pr-3 text-right font-normal">recall@5</th>
                        <th className="py-2 pr-3 text-right font-normal">MRR</th>
                        <th className="py-2 pr-3 text-right font-normal">prec@5</th>
                        <th className="py-2 text-right font-normal">p50 ms</th>
                      </tr>
                    </thead>
                    <tbody className="font-mono text-[12.5px]">
                      {sweep.map((r) => (
                        <tr key={r.mode + r.alpha} className={`border-b border-line ${r.best ? "bg-accent/10 text-fg" : "text-mut"}`}>
                          <td className="py-2 pl-1 pr-3">
                            {r.mode}
                            {r.best && (
                              <span className="ml-2 rounded-full bg-ok/15 px-2 py-0.5 text-[10px] font-semibold text-ok">default</span>
                            )}
                          </td>
                          <td className="py-2 pr-3 text-right">{r.alpha}</td>
                          <td className="py-2 pr-3 text-right">{r.recall}</td>
                          <td className="py-2 pr-3 text-right">{r.mrr}</td>
                          <td className="py-2 pr-3 text-right">{r.prec}</td>
                          <td className="py-2 pr-1 text-right">{r.p50}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Panel>
            </Reveal>
            <Reveal delay={70}>
              <Panel className="h-full">
                <h3 className="text-lg font-semibold text-fg">Why bm25 is the default</h3>
                <RuleList items={whyBm25} />
                <p className="mt-5 font-mono text-[11px] text-faint">
                  Switch with RETRIEVAL_MODE and HYBRID_ALPHA in .env
                </p>
              </Panel>
            </Reveal>
          </div>
        </Chapter>

        {/* =========================== AGENTS =========================== */}
        <Chapter
          id="agents"
          n="03"
          eyebrow="orchestration · phase 4"
          title="Plan, fan out in waves, merge."
          lede="The planner returns at most five sub-questions, each depending only on earlier ones. Independent sub-questions run in parallel under a semaphore; a dependent one waits for its wave and receives earlier answers as context."
        >
          <Reveal>
            <Panel>
              <WaveScheduler />
            </Panel>
          </Reveal>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Reveal>
              <Panel className="h-full">
                <h3 className="text-lg font-semibold text-fg">What a dependent worker sees</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-mut">
                  Answers from its dependencies arrive as <code className="font-mono text-[12px] text-fg">WorkerInput.context</code>,
                  ahead of the numbered chunks. The full chunk text is included —
                  at k=8 and ≤500-token chunks, roughly 4,000 tokens of context.
                </p>
                <pre className="mt-4 overflow-x-auto whitespace-pre-wrap rounded-lg border border-line bg-well p-4 font-mono text-[11.5px] leading-relaxed text-mut">
                  {"Question: <sub_question>\n"}
                  <span className="rounded bg-accent/20 text-fg">{"Established: - <dep question> -> <dep answer>"}</span>
                  {"\nContext: [Chunk 1]\nTitle: Chapter12.pdf\nURL: None\nText: <full chunk text>\n\n[Chunk 2]\n…"}
                </pre>
              </Panel>
            </Reveal>
            <Reveal delay={70}>
              <Panel className="h-full">
                <h3 className="text-lg font-semibold text-fg">The planner’s guard rails</h3>
                <RuleList items={plannerRails} />
              </Panel>
            </Reveal>
          </div>
        </Chapter>

        {/* =========================== CITATIONS =========================== */}
        <Chapter
          id="citations"
          n="04"
          eyebrow="citation integrity"
          title="The model cites numbers. The system owns the IDs."
          lede="The LLM is never asked for a chunk ID. It sees numbered sources and cites integers. Numbers the system didn’t hand out are dropped — at both levels — so an answer can’t point to evidence it never saw."
        >
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Reveal>
              <ByNumDemo />
            </Reveal>
            <Reveal delay={70}>
              <RenumberDemo />
            </Reveal>
          </div>

          <Reveal>
            <h3 className="mt-14 text-2xl font-semibold tracking-tight text-fg">Every agent degrades instead of crashing</h3>
            <p className="mt-1.5 text-sm text-mut">Configuration errors aside, nothing reaches the user as a stack trace.</p>
            <div className="mt-5 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
              {failModes.map((f) => (
                <div key={f.who} className="bg-raised p-5">
                  <h4 className="font-semibold text-fg">{f.who}</h4>
                  <p className="mt-1.5 text-sm leading-relaxed text-mut">{f.when}</p>
                  <p className="mt-3 rounded-md border-l-2 border-ok bg-well px-2.5 py-1.5 font-mono text-[11px] text-fg">
                    → {f.then}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </Chapter>

        {/* =========================== MEASURE =========================== */}
        <Chapter
          id="measure"
          n="05"
          eyebrow="evaluation harness"
          title="Every change has to beat a number."
          lede="A hand-curated golden set runs through the same code the CLI uses. Retrieval is scored with pure functions, generation by three LLM judges plus a deterministic citation check. Every run is saved to eval_runs/<timestamp>/run.json."
        >
          <Reveal>
            <Panel>
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h3 className="text-lg font-semibold text-fg">Four scores, four different questions</h3>
                <div className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-[11px] text-faint">
                  {golden.byCategory.map((c) => (
                    <span key={c.k}>
                      <span className="text-fg">{c.n}</span> {c.k}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {judges.map((j) => (
                  <div key={j.name} className="rounded-xl border border-line bg-well p-4">
                    <span
                      className={`rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold ${
                        j.tag.startsWith("out") ? "bg-accent/15 text-accent" : j.tag === "no LLM" ? "bg-ok/15 text-ok" : "bg-blue/15 text-blue"
                      }`}
                    >
                      {j.tag}
                    </span>
                    <h4 className="mt-2.5 font-semibold text-fg">{j.name}</h4>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-mut">{j.body}</p>
                    <p className="mt-3 break-words font-mono text-[10.5px] text-faint">{j.json}</p>
                  </div>
                ))}
              </div>
            </Panel>
          </Reveal>

          <Reveal>
            <Panel className="mt-6">
              <h3 className="text-lg font-semibold text-fg">How retrieval quality moved, run by run</h3>
              <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-mut">
                Ten valid judged runs, 21–28 September 2026, on the 14-question
                set. The dip was a broken golden set, not a broken retriever.
                Hover a point to see what changed.
              </p>
              <div className="mt-5">
                <RunHistoryChart />
              </div>
            </Panel>
          </Reveal>

          <Reveal>
            <Panel className="mt-6">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h3 className="text-lg font-semibold text-fg">Single worker vs multi-agent, same questions</h3>
                <span className="font-mono text-[11px] text-faint">Checkpoint 4 · 12 Nov · 18 questions</span>
              </div>
              <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-mut">
                Retrieval scores the original question, so those bars must match
                — and they do. In the current baseline pair, every generation
                score matches too.
              </p>
              <div className="mt-5">
                <PipelineBars />
              </div>
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 font-mono text-[11px] text-mut">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-sm bg-s1" />
                  single · {pair.single}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-sm bg-s2" />
                  multi · {pair.multi}
                </span>
              </div>
              <div className="mt-6 grid grid-cols-2 border-t border-line sm:grid-cols-4">
                {pair.stats.map(([v, l]) => (
                  <div key={l} className="pr-3 pt-4">
                    <p className="font-display text-3xl font-bold tabular-nums tracking-tight text-fg">{v}</p>
                    <p className="mt-0.5 font-mono text-[10.5px] uppercase tracking-wider text-faint">{l}</p>
                  </div>
                ))}
              </div>
              <p className="mt-5 max-w-2xl text-sm leading-relaxed text-mut">
                Read as <span className="text-fg">no regression</span> at about
                1.6× the cost, not a proven improvement: with 4 multi-hop
                questions, one judge flip is 25 points, and an earlier multi-hop
                edge didn’t repeat.
              </p>
            </Panel>
          </Reveal>

          <Reveal>
            <h3 className="mt-14 text-2xl font-semibold tracking-tight text-fg">Reading the eval before trusting it</h3>
            <p className="mt-1.5 max-w-2xl text-sm text-mut">
              Several step changes came from the dataset or the scoring code,
              not the system. Each one was traced before the number was accepted.
            </p>
          </Reveal>
          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {stories.map((s, i) => (
              <Reveal key={s.tag} delay={(i % 3) * 60}>
                <article className="h-full rounded-2xl border border-line bg-raised p-5 transition-colors duration-300 hover:border-line-bright">
                  <span className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-accent">{s.tag}</span>
                  <h4 className="mt-2 font-semibold leading-snug text-fg">{s.title}</h4>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-mut">{s.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </Chapter>

        {/* =========================== ROADMAP =========================== */}
        <Chapter
          id="roadmap"
          n="06"
          eyebrow="build order"
          title="Nine phases, each behind a checkpoint."
          lede="The eval harness was built second, so every later phase could be measured instead of assumed. Phases 1–4 are done; 5–9 exist as documented stubs."
        >
          <Reveal>
            <ol className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3 lg:grid-cols-9">
              {roadmap.map((p) => (
                <li key={p.n} className={`flex flex-col gap-1.5 p-4 ${p.s === "done" ? "bg-ok/[0.07]" : "bg-raised"}`}>
                  <span className="font-mono text-[10.5px] text-faint">PHASE {p.n}</span>
                  <h4 className={`text-[15px] font-semibold leading-tight ${p.s === "done" ? "text-fg" : "text-mut"}`}>{p.t}</h4>
                  <p className="text-[12px] leading-snug text-faint">{p.d}</p>
                  <span
                    className={`mt-auto w-fit rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold ${
                      p.s === "done" ? "bg-ok/15 text-ok" : "bg-well text-faint"
                    }`}
                  >
                    {p.s}
                  </span>
                </li>
              ))}
            </ol>
          </Reveal>
        </Chapter>

        {/* =========================== RUN =========================== */}
        <Chapter
          id="run"
          n="07"
          eyebrow="run it"
          title="Six commands cover everything."
          lede="Run from the repo root with OPENAI_API_KEY in .env. Use the project venv's python for the eval and test commands."
        >
          <Reveal>
            <div className="grid grid-cols-1 gap-x-8 gap-y-5 lg:grid-cols-2">
              {commands.map((c) => (
                <div key={c.cmd}>
                  <p className="mb-2 text-sm text-mut">{c.cap}</p>
                  <CopyCommand cmd={c.cmd} />
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal>
            <div className="mt-10 flex flex-wrap gap-2">
              {stack.map((s) => (
                <span key={s} className="rounded-full border border-line px-3 py-1 font-mono text-[11px] text-mut">
                  {s}
                </span>
              ))}
            </div>
            <p className="mt-8 font-mono text-xs text-faint">
              Built from the project docs, documented against commit {meta.commit} (main), {meta.documented}.
              <Link href="/#projects" className="link-sweep ml-3 text-mut hover:text-accent">
                ← back to projects
              </Link>
            </p>
          </Reveal>
        </Chapter>
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
  title,
  lede,
  children,
}: {
  id: string;
  n: string;
  eyebrow: string;
  title: string;
  lede: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 pt-20 sm:pt-28">
      <Reveal>
        <div className="mb-10 grid grid-cols-1 items-end gap-x-12 gap-y-4 border-t border-line-bright pt-6 lg:grid-cols-2">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
              <span className="mr-3 text-faint">{n}</span>
              {eyebrow}
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold leading-[1.05] tracking-[-0.025em] text-fg sm:text-[2.6rem]">
              {title}
            </h2>
          </div>
          <p className="max-w-xl text-[16px] leading-relaxed text-mut">{lede}</p>
        </div>
      </Reveal>
      {children}
    </section>
  );
}

function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-line bg-raised p-5 sm:p-7 ${className}`}>{children}</div>;
}

function RuleList({ items }: { items: { n: string; b: string; d: string }[] }) {
  return (
    <ul className="mt-4 space-y-3.5">
      {items.map((r) => (
        <li key={r.b} className="grid grid-cols-[26px_minmax(0,1fr)] gap-2 text-sm leading-relaxed text-mut">
          <span className="font-mono text-[12px] leading-6 text-accent">{r.n}</span>
          <span>
            <b className="font-semibold text-fg">{r.b}</b> {r.d}
          </span>
        </li>
      ))}
    </ul>
  );
}
