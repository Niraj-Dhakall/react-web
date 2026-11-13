"use client";

import { useEffect, useRef, useState } from "react";

/* The rendered pipeline animation (public/media/make_pipeline_gif.py).
   One MP4 that plays straight through; the scene buttons seek into it.
   Start times mirror SCENES in the script, which forces a keyframe at each
   one so jumps land instantly on the scene's first frame. */
const SCENES = [
  { name: "Chunk", start: 0 },
  { name: "Index", start: 4.6 },
  { name: "Plan", start: 9.2 },
  { name: "Workers", start: 13.6 },
  { name: "Synthesize", start: 19.2 },
  { name: "Evaluate", start: 25.2 },
];
const TOTAL = 32.4;
const end = (i: number) => SCENES[i + 1]?.start ?? TOTAL;
const sceneAt = (t: number) => {
  for (let i = SCENES.length - 1; i >= 0; i--) if (t >= SCENES[i].start - 0.01) return i;
  return 0;
};

export function PipelineFilm() {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [t, setT] = useState(0);
  const userPaused = useRef(false);

  // play while on screen; reduced motion waits for an explicit play
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) userPaused.current = true;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !userPaused.current) v.play().catch(() => {});
        else if (!e.isIntersecting) v.pause();
      },
      { threshold: 0.35 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  // smooth progress while playing (timeupdate only fires ~4×/s)
  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    const tick = () => {
      if (ref.current) setT(ref.current.currentTime);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  const play = () => {
    userPaused.current = false;
    ref.current?.play().catch(() => {});
  };

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) play();
    else {
      userPaused.current = true;
      v.pause();
    }
  };

  const jump = (i: number) => {
    const v = ref.current;
    if (!v) return;
    v.currentTime = SCENES[i].start;
    setT(SCENES[i].start);
    play();
  };

  const cur = sceneAt(t);

  return (
    <figure className="ticks overflow-hidden rounded-2xl border border-line bg-ink">
      <video
        ref={ref}
        className="block aspect-[1200/676] w-full cursor-pointer"
        poster="/media/research-agent-pipeline.jpg"
        muted
        loop
        playsInline
        preload="auto"
        onClick={toggle}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onSeeked={(e) => setT(e.currentTarget.currentTime)}
        aria-label="Animation of the research-agent pipeline: chunk, index, plan, workers, synthesize, evaluate"
      >
        <source src="/media/research-agent-pipeline.mp4" type="video/mp4" />
      </video>

      <figcaption className="border-t border-line bg-well px-3 py-3 sm:px-4">
        <div className="flex items-stretch gap-2">
          <button
            type="button"
            onClick={toggle}
            aria-label={playing ? "Pause animation" : "Play animation"}
            className="btn w-10 shrink-0 rounded-md border border-line font-mono text-xs text-mut hover:border-accent hover:text-accent"
          >
            {playing ? "❚❚" : "▶"}
          </button>
          <div role="group" aria-label="Jump to scene" className="grid min-w-0 flex-1 grid-cols-3 gap-1.5 sm:grid-cols-6">
            {SCENES.map((s, i) => {
              const fill = Math.min(1, Math.max(0, (t - s.start) / (end(i) - s.start)));
              const active = i === cur;
              return (
                <button
                  key={s.name}
                  type="button"
                  onClick={() => jump(i)}
                  aria-current={active ? "step" : undefined}
                  className={`btn group relative overflow-hidden rounded-md border px-2 pb-2.5 pt-1.5 text-left transition-colors ${
                    active ? "border-accent/60 bg-accent/10" : "border-line hover:border-line-bright"
                  }`}
                >
                  <span className={`block font-mono text-[10px] ${active ? "text-accent" : "text-faint"}`}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={`block truncate text-[13px] font-medium ${active ? "text-fg" : "text-mut group-hover:text-fg"}`}
                  >
                    {s.name}
                  </span>
                  <span aria-hidden className="absolute inset-x-0 bottom-0 h-[3px] bg-line">
                    <span
                      className={`block h-full origin-left ${active ? "bg-accent" : "bg-faint"}`}
                      style={{ transform: `scaleX(${fill})` }}
                    />
                  </span>
                </button>
              );
            })}
          </div>
        </div>
        <p className="mt-2.5 font-mono text-[11px] text-faint">
          plays straight through · pick a scene to jump to it · real query, chunk ids and 12 Nov eval scores
        </p>
      </figcaption>
    </figure>
  );
}
