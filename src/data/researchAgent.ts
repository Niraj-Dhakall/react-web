/* ------------------------------------------------------------------ */
/*  researchAgent.ts — every fact on /projects/research-agent.          */
/*  Source: public/media/docs.md (research-agent system docs,          */
/*  documented against commit c66e272, 12 November 2026).              */
/*                                                                     */
/*  Anything an interactive demo uses that is NOT from the docs is     */
/*  kept in the demo component and labelled "illustrative" on screen.  */
/* ------------------------------------------------------------------ */

export const meta = {
  commit: "c66e272",
  documented: "12 November 2026",
  lede: "research-agent answers questions over a fixed corpus of physics and machine-learning study notes. A planner splits your question, parallel workers retrieve evidence and answer from numbered sources, and a synthesizer merges their findings into one answer. Every [n] maps back to a real chunk in SQLite, and every change is scored against a hand-curated golden set.",
};

export const heroFacts = [
  ["3", "PDFs"],
  ["141", "chunks"],
  ["1536", "-d vectors"],
  ["≤5", "sub-questions"],
  ["18", "golden questions"],
  ["20", "saved eval runs"],
  ["32", "offline unit tests"],
] as const;

export const headline = [
  { value: "1.000", label: "recall@5" },
  { value: "1.000", label: "citations" },
  { value: "1.000", label: "refusal" },
  { value: "0.875", label: "accuracy" },
];

/* ---------------- ingest ---------------- */

export const ingestSteps = [
  {
    file: "chunk.py",
    title: "Parse",
    body: "Markdown, text and PDF become typed elements with a section path. PDF extraction repairs merged words, stray page numbers and run-on headings.",
    spec: [
      ["formats", "md · text · pdf"],
      ["pdf via", "pdfplumber, x_tolerance=1"],
    ],
  },
  {
    file: "chunk.py",
    title: "Chunk",
    body: "A sentence-aware window that never crosses a heading and never mixes prose with code. Overlap is whole trailing sentences, never a mid-sentence cut.",
    spec: [
      ["target", "400 tokens"],
      ["range", "300–500 · overlap 50"],
    ],
  },
  {
    file: "embed.py",
    title: "Embed",
    body: "Identical text is embedded once. A content-keyed cache makes re-ingesting, and re-asking the same question, free.",
    spec: [
      ["model", "text-embedding-3-small"],
      ["cache key", "sha256(model_id::text)"],
    ],
  },
  {
    file: "index.py",
    title: "Index",
    body: "Vectors are stored as BLOBs in SQLite and added to one HNSW index per embedding model. Integer labels join ANN hits back to chunk rows.",
    spec: [
      ["HNSW", "M=16 · ef_c=200 · ef_s=64"],
      ["chunk_id", "doc_id::index"],
    ],
  },
] as const;

export const chunkerRules = [
  {
    b: "Never crosses a heading.",
    d: "A new section starts a new chunk with no overlap seed, so a retrieved chunk always belongs to one section path.",
  },
  {
    b: "Never mixes prose and code.",
    d: "The buffer flushes whenever the element kind changes.",
  },
  {
    b: "Stable, POSIX doc ids.",
    d: "A Windows \\ id once ingested every PDF twice: 282 vectors instead of 141. IDs now use as_posix() on every OS.",
  },
  {
    b: "One index per model.",
    d: "model_id = provider:model:dim keys the cache, the table and the HNSW filename, so vector spaces never mix.",
  },
];

export const corpus = [
  { name: "Chapter12.pdf", chunks: 99 },
  { name: "S4979_GR_intro2.pdf", chunks: 24 },
  { name: "ml-study-guide-detailed.pdf", chunks: 18 },
];

/* ---------------- retrieve ---------------- */

/* Retrieval-only sweep, 12 answerable golden questions, k=5, 27 Sep */
export const sweep = [
  { mode: "dense", alpha: "–", recall: "0.917", mrr: "0.697", prec: "0.317", p50: "1" },
  { mode: "bm25", alpha: "–", recall: "1.000", mrr: "0.850", prec: "0.400", p50: "0", best: true },
  { mode: "hybrid", alpha: "0.3", recall: "0.917", mrr: "0.812", prec: "0.317", p50: "6" },
  { mode: "hybrid", alpha: "0.5", recall: "0.917", mrr: "0.812", prec: "0.333", p50: "6" },
  { mode: "hybrid", alpha: "0.7", recall: "0.917", mrr: "0.778", prec: "0.317", p50: "6" },
];

export const whyBm25 = [
  {
    n: "↑",
    b: "Best on every retrieval metric",
    d: "and the only mode that finds the “gamma” question, an exact-token match that dense ranks too low for fusion to rescue.",
  },
  {
    n: "⚡",
    b: "Fastest.",
    d: "No query-embedding call; the index is built in memory from live_chunks() on first use.",
  },
  {
    n: "≈",
    b: "Hybrid is close behind.",
    d: "In judged runs it scored one question higher on faithfulness (0.917 vs 0.833). Revisit once the golden set has paraphrase-heavy questions.",
  },
];

/* ---------------- agents ---------------- */

export const plannerRails = [
  {
    n: "5",
    b: "Hard cap of five sub-questions.",
    d: "An uncapped planner is the most expensive failure mode in a multi-agent system.",
  },
  {
    n: "←",
    b: "Backward-only dependencies.",
    d: "Invalid items are dropped and the remaining indices remapped, so the wave loop always has work it can start.",
  },
  {
    n: "1",
    b: "Focused questions stay whole.",
    d: "On the 18 golden questions, all 14 single-hop and out-of-scope questions get 1 sub-question; the 4 multi-hop ones get 2–4.",
  },
  {
    n: "⤺",
    b: "Falls back, never fails.",
    d: "On an API error or bad JSON the plan becomes the original query — which is just the single-worker path.",
  },
];

export const failModes = [
  { who: "Planner", when: "API error, bad JSON, or no valid sub-questions.", then: "1-item plan: the original query" },
  { who: "Worker", when: "No chunks, empty completion, unparseable JSON, or any exception.", then: "WorkerFinding(answer=None, error=…)" },
  { who: "Orchestrator", when: "A worker raises anyway inside gather.", then: "\"worker crashed: …\" finding; run continues" },
  { who: "Synthesizer", when: "LLM error or bad JSON — or nothing answered.", then: "best finding, or \"No answer: …\"" },
];

/* ---------------- measure ---------------- */

export const judges = [
  {
    name: "Correctness",
    tag: "answerable · 16",
    body: "Does the answer state the same fact as the reference? Wording may differ; −13.6 eV vs −13 eV may not.",
    json: '{"is_correct": bool, "reasoning": str}',
  },
  {
    name: "Faithfulness",
    tag: "answerable · 16",
    body: "Is every claim derivable from the full retrieved chunks? Separate from truth, so it tells retrieval failures apart from hallucination.",
    json: '{"is_faithful": bool, "unsupported_claims": [str], …}',
  },
  {
    name: "Refusal",
    tag: "out of scope · 2",
    body: "Did the system decline instead of inventing an answer? A “No answer:” prefix is accepted without an API call.",
    json: '{"correctly_refused": bool, "checked_via": …}',
  },
  {
    name: "Citations",
    tag: "no LLM",
    body: "At least one source, every [n] points to a real source, and merged answers carry at least one marker.",
    json: "CitationCheck(n_sources, n_markers, invalid_markers, ok)",
  },
];

export const golden = {
  byCategory: [
    { k: "numerical", n: 6 },
    { k: "factual", n: 4 },
    { k: "multi_hop", n: 4 },
    { k: "ambiguous", n: 2 },
    { k: "out_of_scope", n: 2 },
  ],
};

/* recall@5 and MRR across the ten valid runs, 21–28 Sep (09 §1) */
export const history = [
  { run: "20260921_001527", d: "21 Sep", tag: "", recall: 0.75, mrr: 0.538, old: true, ch: "Aggregation bugs fixed; MRR still ÷ 14" },
  { run: "20260922_010323", d: "22 Sep", tag: "", recall: 0.75, mrr: 0.538, old: true, ch: "Last run with the original Unicode hints" },
  { run: "20260925_010146", d: "25 Sep", tag: "ASCII", recall: 0.5, mrr: 0.324, old: true, ch: "Hints rewritten in ASCII: 3 correct retrievals scored as misses" },
  { run: "20260925_015708", d: "25 Sep", tag: "dedup", recall: 0.583, mrr: 0.36, old: true, ch: "Duplicate corpus removed (282 → 141 vectors)" },
  { run: "20260925_021740", d: "25 Sep", tag: "fixed", recall: 0.833, mrr: 0.669, old: false, ch: "Hints re-derived from extracted text; MRR ÷ 12; query cache on" },
  { run: "20260926_220629", d: "26 Sep", tag: "dense", recall: 0.917, mrr: 0.697, old: false, ch: "Phase 2 dense baseline" },
  { run: "20260927_152118", d: "27 Sep", tag: "hybrid", recall: 0.917, mrr: 0.812, old: false, ch: "Phase 3: hybrid α = 0.5" },
  { run: "20260927_152236", d: "27 Sep", tag: "bm25", recall: 1.0, mrr: 0.85, old: false, ch: "Phase 3: bm25, became the default" },
  { run: "20260928_232850", d: "28 Sep", tag: "single", recall: 1.0, mrr: 0.85, old: false, ch: "Phase 4 paired run: single worker" },
  { run: "20260928_233028", d: "28 Sep", tag: "multi", recall: 1.0, mrr: 0.85, old: false, ch: "Phase 4 paired run: multi-agent" },
];

/* Checkpoint 4 pair 2 — current baseline (12 Nov, 18 examples) */
export const pair = {
  single: "20261112_215035",
  multi: "20261112_215229",
  metrics: [
    { m: "accuracy", a: 0.875, b: 0.875 },
    { m: "faithfulness", a: 0.875, b: 0.875 },
    { m: "citations", a: 1, b: 1 },
    { m: "refusal", a: 1, b: 1 },
    { m: "recall@5", a: 1, b: 1 },
    { m: "MRR", a: 0.815, b: 0.815 },
    { m: "precision@5", a: 0.388, b: 0.388 },
  ],
  stats: [
    ["1.6×", "cost, multi vs single"],
    ["$0.0142", "multi · 18 questions"],
    ["$0.0087", "single · 18 questions"],
    ["1.39", "mean sub-questions"],
  ],
};

export const stories = [
  {
    tag: "Step B",
    title: "recall@5 fell 0.75 → 0.50 with no retrieval change",
    body: "Golden hints had been rewritten in ASCII: λ = h became lambda = h and a real U+2212 minus became a hyphen, so three correct retrievals stopped matching the extracted text. The arithmetic checked out exactly (9/12 → 6/12); embedding jitter was ruled out.",
  },
  {
    tag: "Step C",
    title: "Precision dropped — and that was the honest number",
    body: "The store held every PDF twice under Windows and POSIX doc ids. Duplicate pairs both counted as top-5 hits and inflated precision@5. Deduplicating 282 → 141 vectors gave the real score.",
  },
  {
    tag: "Step G",
    title: "The faithfulness judge never saw the real context",
    body: "It was judging against the worker's own 9–30-character excerpts, so grounded answers failed whenever the model quoted too little. It now sees the full text of every retrieved chunk.",
  },
  {
    tag: "Step H",
    title: "The planner over-split simple questions",
    body: "Single-fact questions were split into 5 sub-questions. The prompt now counts what the query explicitly asks for; single-hop questions stay whole and multi-hop ones get 2–4.",
  },
  {
    tag: "Steps I + J",
    title: "Merged answers had silently lost their citations",
    body: "Synthesized answers carried no [n] markers while accuracy and faithfulness still read 1.000. The prompt now requires them, the code keeps every source if none appear, and a deterministic citation metric guards it.",
  },
];

/* ---------------- roadmap ---------------- */

export const roadmap: { n: number; t: string; d: string; s: "done" | "planned" }[] = [
  { n: 1, t: "Single agent", d: "Chunk, embed, index, cited worker, CLI.", s: "done" },
  { n: 2, t: "Eval harness", d: "Golden set, metrics, judges, saved runs.", s: "done" },
  { n: 3, t: "Hybrid search", d: "BM25 + RRF. Met 27 Sep.", s: "done" },
  { n: 4, t: "Multi-agent", d: "Planner, waves, synthesizer. Met 12 Nov.", s: "done" },
  { n: 5, t: "Memory", d: "Scratchpad, resumable run state, episodic recall.", s: "planned" },
  { n: 6, t: "Critic loop", d: "Check claims and coverage; re-run at most twice.", s: "planned" },
  { n: 7, t: "Tracing", d: "Every run saves a JSON trace.", s: "planned" },
  { n: 8, t: "HTTP API", d: "POST /research with FastAPI.", s: "planned" },
  { n: 9, t: "Stage machine", d: "A plain Enum state machine, not LangGraph.", s: "planned" },
];

/* ---------------- run it ---------------- */

// export const commands = [
//   { cap: "Ask a question (multi-agent by default)", cmd: 'research-agent research "Compare L1 and L2 regularization"' },
//   { cap: "One worker, no planner or synthesizer", cmd: "research-agent research \"What is Einstein's photoelectric equation?\" --single" },
//   { cap: "Ingest a Markdown document", cmd: "research-agent ingest guides/implementation-plan.md --format markdown --doc-id implementation-plan" },
//   { cap: "Cheap retrieval sweep (no chat calls)", cmd: "python -m research_system.eval.runner --retrieval-only" },
//   { cap: "Full judged eval, either pipeline", cmd: "python -m research_system.eval.runner --pipeline multi" },
//   { cap: "Unit tests (offline)", cmd: 'python -m pytest research_system/tests/unit -o addopts="" -q' },
// ];

export const stack = [
  "Python 3.11+",
  "asyncio",
  "OpenAI gpt-4o-mini / gpt-4o",
  "text-embedding-3-small",
  "SQLite",
  "hnswlib",
  "rank_bm25",
  "pdfplumber",
  "tiktoken",
  "click",
];
