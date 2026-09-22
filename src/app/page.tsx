import type { CSSProperties, ReactNode } from "react";
import { MediaGallery } from "@/components/MediaGallery";
import { Reveal } from "@/components/Reveal";
import { RotatingText } from "@/components/RotatingText";
import { SiteNav } from "@/components/SiteNav";
import {
  ArrowUpRight,
  FileText,
  GitHub,
  LinkedIn,
  Mail,
} from "@/components/icons";
import {
  education,
  experience,
  profile,
  projects,
  skills,
  type Entry,
} from "@/data/portfolio";

export default function Home() {
  return (
    <div id="top">
      <SiteNav />

      <main className="mx-auto max-w-5xl px-5 sm:px-8">
        <Hero />

        {/* ------------------------------------------------------------ */}
        <section id="experience" className="scroll-mt-28 py-20 sm:py-24">
          <Reveal>
            <SectionLabel meta={String(experience.length).padStart(2, "0")}>
              experience
            </SectionLabel>
          </Reveal>

          <ol className="mt-12">
            {experience.map((entry, i) => (
              <Reveal as="li" key={entry.slug} delay={Math.min(i, 3) * 60}>
                <ExperienceItem
                  entry={entry}
                  last={i === experience.length - 1}
                />
              </Reveal>
            ))}
          </ol>
        </section>

        {/* ------------------------------------------------------------ */}
        <section id="projects" className="scroll-mt-28 py-20 sm:py-24">
          <Reveal>
            <SectionLabel meta={String(projects.length).padStart(2, "0")}>
              projects
            </SectionLabel>
          </Reveal>

          <div className="mt-12 grid grid-cols-1 gap-8">
            {projects.map((project, i) => (
              <Reveal key={project.slug} delay={Math.min(i, 2) * 80}>
                <ProjectCard project={project} />
              </Reveal>
            ))}
          </div>
        </section>

        {/* ------------------------------------------------------------ */}
        <section id="skills" className="scroll-mt-28 py-20 sm:py-24">
          <Reveal>
            <SectionLabel>skills</SectionLabel>
          </Reveal>

          <div className="mt-12 grid grid-cols-1 gap-y-8">
            {skills.map((group) => (
              <Reveal key={group.label}>
                <div className="grid grid-cols-1 items-baseline gap-x-8 gap-y-2 sm:grid-cols-[10rem_1fr]">
                  <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-faint">
                    {group.label}
                  </h3>
                  <p className="text-[15px] leading-relaxed text-mut">
                    {group.items.map((item, i) => (
                      <span key={item}>
                        <span className="text-fg">{item}</span>
                        {i < group.items.length - 1 && (
                          <>
                            <span className="mx-1.5 text-faint">·</span>{" "}
                          </>
                        )}
                      </span>
                    ))}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ------------------------------------------------------------ */}
        <section id="education" className="scroll-mt-28 py-20 sm:py-24">
          <Reveal>
            <SectionLabel>education</SectionLabel>
          </Reveal>

          <Reveal>
            <div className="mt-12 rounded-2xl border border-line bg-raised p-6 sm:p-8">
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                <h3 className="text-lg font-semibold tracking-tight text-fg">
                  {education.school}
                </h3>
                <span className="font-mono text-xs text-faint">
                  {education.date}
                </span>
              </div>
              <p className="mt-1 text-mut">
                {education.degree}
                <span className="mx-2 text-faint">·</span>
                <span className="text-fg">GPA {education.gpa}</span>
              </p>
              <p className="mt-4 text-sm leading-relaxed text-mut">
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-faint">
                  Coursework{" "}
                </span>
                <span className="ml-1">{education.coursework}</span>
              </p>
            </div>
          </Reveal>
        </section>

        {/* ------------------------------------------------------------ */}
        <section id="contact" className="scroll-mt-28 py-24 sm:py-32">
          <Reveal>
            <SectionLabel>contact</SectionLabel>
            <h2 className="mt-10 font-display text-4xl font-bold tracking-[-0.02em] text-fg sm:text-6xl">
              Want to work together<span className="text-accent">?</span>
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-mut">
              I&apos;m always looking for new opportunities to work on
              interesting projects.
            </p>
            <a
              href={`mailto:${profile.email}`}
              className="link-sweep mt-8 inline-block font-mono text-xl text-fg transition-colors duration-200 hover:text-accent sm:text-2xl"
            >
              {profile.email}
            </a>
            <div className="mt-10 flex flex-wrap gap-3">
              {profile.socials.map((s) => (
                <GhostLink key={s.href} href={s.href}>
                  {s.label === "GitHub" && <GitHub />}
                  {s.label === "LinkedIn" && <LinkedIn />}
                  {s.label}
                </GhostLink>
              ))}
              <GhostLink href={profile.resume}>
                <FileText />
                Resume
              </GhostLink>
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2 px-5 py-8 font-mono text-xs text-faint sm:px-8">
          <span>© {new Date().getFullYear()} Niraj Dhakal</span>
          <span>built with ❤️</span>
        </div>
      </footer>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero                                                               */
/* ------------------------------------------------------------------ */

function Hero() {
  return (
    <section className="flex min-h-[92svh] items-center pb-16 pt-32">
      <div className="grid w-full grid-cols-1 items-center gap-12 md:grid-cols-[1.2fr_0.8fr] md:gap-8">
        <div>
          {/* <p
            className="intro inline-flex items-center gap-2.5 rounded-full border border-line bg-raised py-1.5 pl-3 pr-4 font-mono text-xs text-mut"
            style={{ "--i": 0 } as CSSProperties}
          >
            <span
              className="pulse-dot h-2 w-2 rounded-full bg-ok"
              aria-hidden
            />
            {profile.availability}
          </p> */}

          <h1
            className="intro mt-7 font-display text-6xl font-bold leading-[0.98] tracking-[-0.03em] text-fg sm:text-7xl lg:text-8xl"
            style={{ "--i": 1 } as CSSProperties}
          >
            Niraj
            <br />
            Dhakal<span className="text-accent">.</span>
          </h1>

          <p
            className="intro mt-6 font-mono text-base text-faint sm:text-lg"
            style={{ "--i": 2 } as CSSProperties}
          >
            /&nbsp;
            <span className="text-fg">
              <RotatingText words={profile.roles} />
            </span>
          </p>

          <p
            className="intro mt-6 max-w-xl text-lg leading-relaxed text-mut"
            style={{ "--i": 3 } as CSSProperties}
          >
            {profile.blurb}
          </p>

          <div
            className="intro mt-9 flex flex-wrap gap-3"
            style={{ "--i": 4 } as CSSProperties}
          >
            <a
              href={profile.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="btn inline-flex items-center gap-2 bg-accent px-6 py-3 font-mono text-sm font-medium text-ink hover:bg-accent-soft"
            >
              <FileText />
              Resume
            </a>
            <GhostLink href={profile.socials[0]?.href ?? "#"}>
              <GitHub />
              GitHub
            </GhostLink>
            <GhostLink href={profile.socials[1]?.href ?? "#"}>
              <LinkedIn />
              LinkedIn
            </GhostLink>
            <GhostLink href={`mailto:${profile.email}`}>
              <Mail />
              Email
            </GhostLink>
          </div>
        </div>

        <div
          className="intro justify-self-center md:justify-self-end"
          style={{ "--i": 2 } as CSSProperties}
        >
          <figure className="ticks relative m-0">
            <div className="overflow-hidden border border-line bg-well">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={profile.photo.src}
                alt={profile.photo.alt}
                className="aspect-[4/5] w-64 object-cover sm:w-72"
              />
              <figcaption className="border-t border-line bg-well px-3 py-2 font-mono text-[11px] leading-none tracking-wide text-mut">
                {/* <span className="text-accent">img_0195.jpg</span>
                <span className="text-faint"> — </span>the engineer in question */}
              </figcaption>
            </div>
          </figure>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Section label — a labeled hairline, not another loud heading       */
/* ------------------------------------------------------------------ */

function SectionLabel({
  children,
  meta,
}: {
  children: ReactNode;
  meta?: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
        {children}
      </h2>
      <span aria-hidden className="h-px flex-1 bg-line" />
      {meta && (
        <span className="font-mono text-xs tabular-nums text-faint">
          {meta}
        </span>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Experience timeline                                                */
/* ------------------------------------------------------------------ */

function ExperienceItem({ entry, last }: { entry: Entry; last: boolean }) {
  return (
    <div className="grid grid-cols-1 gap-x-8 sm:grid-cols-[10rem_1fr]">
      <div className="pt-0.5 font-mono text-xs leading-6 text-faint">
        {entry.date}
      </div>

      <div
        className={`relative border-l border-line pl-7 ${last ? "pb-2" : "pb-14"} max-sm:mt-2`}
      >
        {/* node */}
        <span
          aria-hidden
          className="absolute -left-[3.5px] top-2 h-[7px] w-[7px] rounded-full bg-accent"
        />

        <h3 className="text-lg font-semibold tracking-tight text-fg">
          {entry.org}
          <span className="font-normal text-mut"> — {entry.title}</span>
        </h3>

        <ul className="mt-4 space-y-2.5 text-[15px] leading-relaxed text-mut">
          {entry.items.map((item) => (
            <li key={item} className="flex gap-3">
              <span
                aria-hidden
                className="mt-[9px] h-px w-3 shrink-0 bg-line-bright"
              />
              {item}
            </li>
          ))}
        </ul>

        {entry.media.length > 0 && (
          <div className="mt-6 max-w-xl">
            <MediaGallery
              media={entry.media}
              label={entry.org?.toLowerCase() ?? entry.slug}
              aspect="aspect-video"
            />
          </div>
        )}

        {entry.tags && (
          <div className="mt-5 flex flex-wrap gap-2">
            {entry.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Project card — media leads, bullets fold away                      */
/* ------------------------------------------------------------------ */

function ProjectCard({ project }: { project: Entry }) {
  return (
    <article className="group rounded-2xl border border-line bg-raised p-6 transition-colors duration-300 hover:border-line-bright sm:p-8">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h3 className="text-xl font-semibold tracking-tight text-fg">
          {project.title}
          {project.org && (
            <span className="ml-3 text-sm font-normal text-mut">
              {project.org}
            </span>
          )}
        </h3>
        <span className="font-mono text-xs text-faint">{project.date}</span>
      </div>

      {project.summary && (
        <p className="mt-3 max-w-2xl leading-relaxed text-mut">
          {project.summary}
        </p>
      )}

      {project.media.length > 0 && (
        <div className="mt-6">
          <MediaGallery
            media={project.media}
            label={project.title.toLowerCase()}
          />
        </div>
      )}

      <details className="group/details mt-6">
        <summary className="btn inline-flex cursor-pointer list-none items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-faint transition-colors duration-200 hover:text-accent [&::-webkit-details-marker]:hidden">
          <span
            aria-hidden
            className="inline-block transition-transform duration-200 ease-out-strong group-open/details:rotate-45"
          >
            +
          </span>
          build notes
        </summary>
        <ul className="mt-4 space-y-2.5 text-[15px] leading-relaxed text-mut">
          {project.items.map((item) => (
            <li key={item} className="flex gap-3">
              <span
                aria-hidden
                className="mt-[9px] h-px w-3 shrink-0 bg-line-bright"
              />
              {item}
            </li>
          ))}
        </ul>
      </details>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {project.tags?.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {project.links.map((link) => (
            <GhostLink key={link.href} href={link.href} small>
              {link.label}
              <ArrowUpRight width={13} height={13} />
            </GhostLink>
          ))}
        </div>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/*  Bits                                                               */
/* ------------------------------------------------------------------ */

function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="border border-line px-2.5 py-1 font-mono text-[11px] leading-none text-mut">
      {children}
    </span>
  );
}

function GhostLink({
  href,
  children,
  small = false,
}: {
  href: string;
  children: ReactNode;
  small?: boolean;
}) {
  const external = href.startsWith("http") || href.endsWith(".pdf");
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`btn inline-flex items-center gap-2 border border-line text-fg hover:border-accent hover:text-accent ${
        small ? "px-3.5 py-2 font-mono text-xs" : "px-5 py-3 font-mono text-sm"
      }`}
    >
      {children}
    </a>
  );
}
