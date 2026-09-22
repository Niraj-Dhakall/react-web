"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { MediaItem } from "@/data/portfolio";
import { ChevronLeft, ChevronRight, Close, Play } from "./icons";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const pad = (n: number) => String(n + 1).padStart(2, "0");

function canHoverPlay() {
  return (
    window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function smoothOk(): ScrollBehavior {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? "auto"
    : "smooth";
}

/* ------------------------------------------------------------------ */
/*  Gallery                                                            */
/* ------------------------------------------------------------------ */

export function MediaGallery({
  media,
  label,
  aspect = "aspect-[16/10]",
}: {
  media: MediaItem[];
  /** Short context for the caption bar, e.g. the project name */
  label: string;
  aspect?: string;
}) {
  const stripRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState<number | null>(null);
  const many = media.length > 1;

  const onScroll = useCallback(() => {
    const el = stripRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      setActive(Math.round(el.scrollLeft / el.clientWidth));
    });
  }, []);

  const go = (dir: -1 | 1) => {
    const el = stripRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth, behavior: smoothOk() });
  };

  if (media.length === 0) return null;

  return (
    <>
      <figure className="ticks group/frame relative m-0">
        <div className="overflow-hidden border border-line bg-well">
          {/* strip — native snap scrolling keeps momentum + interruption free */}
          <div
            ref={stripRef}
            onScroll={many ? onScroll : undefined}
            role="group"
            aria-label={`${label} — media, ${media.length} item${many ? "s" : ""}`}
            className={`flex snap-x snap-mandatory overflow-x-auto scrollbar-none ${
              many ? "overscroll-x-contain" : ""
            }`}
          >
            {media.map((item, i) => (
              <Slide
                key={item.src}
                item={item}
                aspect={aspect}
                onOpen={() => setOpen(i)}
              />
            ))}
          </div>

          {/* caption bar — encodes what you're looking at */}
          <figcaption className="flex items-center justify-between gap-4 border-t border-line bg-well px-3 py-2 font-mono text-[11px] leading-none tracking-wide text-mut">
            <span className="truncate lowercase">
              <span className="text-accent">{label}</span>
              <span className="text-faint"> — </span>
              {media[Math.min(active, media.length - 1)].alt}
            </span>
            {many && (
              <span className="shrink-0 tabular-nums text-faint">
                <span className="text-fg">{pad(active)}</span> / {pad(media.length - 1)}
              </span>
            )}
          </figcaption>
        </div>

        {/* desktop arrows — appear on hover, never shift layout */}
        {many && (
          <>
            <StripArrow side="left" onClick={() => go(-1)} disabled={active === 0} />
            <StripArrow
              side="right"
              onClick={() => go(1)}
              disabled={active === media.length - 1}
            />
          </>
        )}
      </figure>

      {open !== null && (
        <Lightbox
          media={media}
          label={label}
          index={open}
          setIndex={setOpen}
          onClose={() => setOpen(null)}
        />
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Slide                                                              */
/* ------------------------------------------------------------------ */

function Slide({
  item,
  aspect,
  onOpen,
}: {
  item: MediaItem;
  aspect: string;
  onOpen: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <button
      type="button"
      onClick={onOpen}
      onPointerEnter={() => {
        const v = videoRef.current;
        if (v && canHoverPlay()) v.play().catch(() => {});
      }}
      onPointerLeave={() => videoRef.current?.pause()}
      aria-label={`Open ${item.alt}`}
      className={`relative w-full shrink-0 cursor-zoom-in snap-center bg-well ${aspect}`}
    >
      {item.type === "image" ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.src}
          alt={item.alt}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <>
          <video
            ref={videoRef}
            src={item.src}
            poster={item.poster}
            muted
            loop
            playsInline
            preload="metadata"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <span className="absolute bottom-2 right-2 flex items-center gap-1.5 border border-line-bright bg-ink/80 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-fg backdrop-blur-sm">
            <Play width={10} height={10} className="text-accent" /> video
          </span>
        </>
      )}
    </button>
  );
}

function StripArrow({
  side,
  onClick,
  disabled,
}: {
  side: "left" | "right";
  onClick: () => void;
  disabled: boolean;
}) {
  const Icon = side === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={side === "left" ? "Previous" : "Next"}
      className={`btn absolute top-1/2 hidden -translate-y-1/2 items-center justify-center border border-line-bright bg-ink/80 p-2 text-fg opacity-0 backdrop-blur-sm transition-opacity duration-200 hover:border-accent hover:text-accent focus-visible:opacity-100 disabled:pointer-events-none disabled:opacity-0 enabled:group-hover/frame:opacity-100 md:flex ${
        side === "left" ? "left-3" : "right-3"
      }`}
    >
      <Icon />
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Lightbox — a true modal, so it stays centered by design            */
/* ------------------------------------------------------------------ */

function Lightbox({
  media,
  label,
  index,
  setIndex,
  onClose,
}: {
  media: MediaItem[];
  label: string;
  index: number;
  setIndex: (i: number) => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const item = media[index];
  const many = media.length > 1;

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    dialog.showModal();
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, []);

  const step = useCallback(
    (dir: -1 | 1) => {
      if (many) setIndex((index + dir + media.length) % media.length);
    },
    [index, many, media.length, setIndex],
  );

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) ref.current?.close();
      }}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") step(1);
        if (e.key === "ArrowLeft") step(-1);
      }}
      aria-label={`${label} media viewer`}
      className="lightbox m-auto w-[min(96vw,72rem)] bg-transparent p-0 backdrop:bg-transparent"
    >
      <div className="ticks relative border border-line bg-raised">
        <div className="flex max-h-[78vh] items-center justify-center bg-well">
          {item.type === "image" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.src}
              alt={item.alt}
              className="max-h-[78vh] w-auto max-w-full object-contain"
            />
          ) : (
            <video
              key={item.src}
              src={item.src}
              poster={item.poster}
              controls
              autoPlay
              playsInline
              className="max-h-[78vh] w-auto max-w-full"
            />
          )}
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-line px-4 py-3 font-mono text-xs text-mut">
          <span className="truncate lowercase">
            <span className="text-accent">{label}</span>
            <span className="text-faint"> — </span>
            {item.alt}
          </span>
          <span className="flex shrink-0 items-center gap-3">
            {many && (
              <>
                <button
                  type="button"
                  onClick={() => step(-1)}
                  aria-label="Previous"
                  className="btn p-1 hover:text-accent"
                >
                  <ChevronLeft />
                </button>
                <span className="tabular-nums text-faint">
                  <span className="text-fg">{pad(index)}</span> / {pad(media.length - 1)}
                </span>
                <button
                  type="button"
                  onClick={() => step(1)}
                  aria-label="Next"
                  className="btn p-1 hover:text-accent"
                >
                  <ChevronRight />
                </button>
              </>
            )}
            <button
              type="button"
              onClick={() => ref.current?.close()}
              aria-label="Close viewer"
              className="btn p-1 hover:text-accent"
            >
              <Close />
            </button>
          </span>
        </div>
      </div>
    </dialog>
  );
}
