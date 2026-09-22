/* ------------------------------------------------------------------ */
/*  portfolio.ts — the only file you need to edit day-to-day.          */
/*                                                                     */
/*  To add images/videos to any entry:                                 */
/*    1. Drop files into  public/media/<slug>/                         */
/*    2. Add items to that entry's `media` array below                 */
/*                                                                     */
/*  media examples:                                                    */
/*    { type: "image", src: "/media/castcreel/map.png",                */
/*      alt: "live DNR stocking map" }                                 */
/*    { type: "video", src: "/media/castcreel/demo.mp4",               */
/*      poster: "/media/castcreel/demo-poster.jpg",                    */
/*      alt: "catch card animation demo" }                             */
/* ------------------------------------------------------------------ */

export type MediaItem = {
  type: "image" | "video";
  /** Path under /public, e.g. "/media/localstream/rooms.png" */
  src: string;
  /** Shown in the caption bar and used as alt text — keep it short */
  alt: string;
  /** Optional poster frame for videos (strongly recommended) */
  poster?: string;
};

export type LinkItem = {
  label: string;
  href: string;
};

export type Entry = {
  slug: string;
  title: string;
  org?: string;
  date: string;
  /** One or two lines shown up front on project cards */
  summary?: string;
  items: string[];
  links: LinkItem[];
  media: MediaItem[];
  tags?: string[];
};

/* ------------------------------------------------------------------ */
/*  Profile                                                            */
/* ------------------------------------------------------------------ */

export const profile = {
  name: "Niraj Dhakal",
  roles: ["software engineer", "full-stack developer", "AI systems builder"],
  availability: "Open to new-grad software roles",
  blurb:
    "Software engineer with production experience building AI-powered systems and full-stack applications. Skilled in Go, React, PostgreSQL, and RAG architecture with end-to-end feature ownership from design through deployment.",
  email: "me@nirajd.dev",
  resume: "/images/NirajDhakalResumeLatest.pdf",
  photo: { src: "/images/IMG_0195.jpg", alt: "Niraj Dhakal" },
  socials: [
    { label: "GitHub", href: "https://github.com/Niraj-Dhakall" },
    // TODO: add your LinkedIn URL
    // { label: "LinkedIn", href: "https://www.linkedin.com/in/..." },
  ] satisfies LinkItem[],
};

/* ------------------------------------------------------------------ */
/*  Experience (roles)                                                 */
/* ------------------------------------------------------------------ */

export const experience: Entry[] = [
  {
    slug: "dogwood",
    title: "Software Engineer",
    org: "Dogwood Gaming",
    date: "Jan 2025 — Present",
    items: [
      "Built an AI-powered marketing platform for game developers featuring competitor analysis, content generation, and multi-platform social media scheduling.",
      "Developed full-stack application with React/TypeScript frontend, Go/Gin backend, and PostgreSQL database with sqlc for queries, containerized using Docker.",
      "Integrated a RAG system leveraging game documentation and competitor data to deliver context-aware content recommendations.",
      "Designed and implemented persistent chat history with group-based authorization, storing sessions in PostgreSQL and injecting last 3 conversation turns into LLM context.",
      "Refactored authentication from localStorage to HTTP-only JWT cookies with secure group+user ID validation to prevent XSS.",
      "Implemented task queue using Celery for social media automation and Instagram scraping with Selenium.",
      "Built a custom dashboard to allow users to play roulette on android devices using WebRTC and WebSockets through Unreal Engine.",
      "Developed a point to point pathfinding algorithm to draw lines on a map using Unreal Engine's NavMesh and A* algorithm.",
    ],
    links: [],
    media: [
      {
        type: "image",
        src: "/media/dogwood/dgwooddemo.png",
        alt: "AI chat assistant grounded on competitor data",
      },
      {
        type: "image",
        src: "/media/dogwood/dgwooddemo2.png",
        alt: "competitor analytics dashboard",
      },
      {
        type: "image",
        src: "/media/dogwood/dgwooddemo3.png",
        alt: "marketing content generator with competitor insights",
      },
      {
        type: "video",
        src: "/media/dogwood/dgwooddemo4.mp4",
        poster: "/media/dogwood/dgwooddemo4-poster.jpg",
        alt: "platform walkthrough — dashboard to competitor tracking",
      },
    ],
    tags: ["Go", "React", "PostgreSQL", "RAG", "Docker"],
  },
  {
    slug: "umbc-ta",
    title: "Teaching Assistant",
    org: "UMBC",
    date: "Fall 2025",
    items: [
      "Hosted weekly labs for 18 students, teaching Python programming and foundational coding concepts.",
      "Held office hours to assist students with coding assignments and problem-solving strategies.",
      "Graded assignments, projects, and exams, providing constructive feedback on code quality, logic, and style.",
    ],
    links: [],
    media: [],
    tags: ["Python", "Teaching"],
  },
  {
    slug: "umbc-research",
    title: "Research Assistant",
    org: "UMBC — DAMS Lab",
    date: "Oct 2024 — Jan 2025",
    items: [
      "Researched privacy policies for IoT devices in the DAMS lab.",
      "Used Python and Large Language Models to validate triples for Knowledge Graph construction.",
      "Contributed to advancing privacy research in the Internet of Things domain.",
    ],
    links: [],
    media: [],
    tags: ["Python", "LLMs", "Knowledge Graphs"],
  },
  {
    slug: "umbc-tf",
    title: "Teaching Fellow",
    org: "UMBC",
    date: "Jan 2024 — Jun 2024",
    items: [
      "Assisted students in weekly office hours on Object-Oriented Programming concepts.",
      "Helped students with complex projects involving memory management using pointers, linked lists, and inheritance.",
      "Graded bi-weekly C++ projects focusing on memory management, polymorphism, and inheritance.",
    ],
    links: [],
    media: [],
    tags: ["C++", "Mentorship"],
  },
];

/* ------------------------------------------------------------------ */
/*  Projects                                                           */
/* ------------------------------------------------------------------ */

export const projects: Entry[] = [
  {
    slug: "localstream",
    title: "LocalStream",
    date: "Jan 2026",
    summary:
      "Peer-to-peer screen sharing over the local network with WebRTC media paths and a Go WebSocket server handling only signaling.",
    items: [
      "Built peer-to-peer screen sharing using WebRTC for media streaming and a Go WebSocket server for signaling, supporting 5+ concurrent cross-device viewers.",
      "Implemented thread-safe room management with sync.RWMutex to handle concurrent connections and prevent race conditions in shared state.",
      "Scaled architecture from 1-to-1 to 1-to-many connections while keeping direct WebRTC P2P media paths, with the server handling only signaling.",
    ],
    links: [
      {
        label: "GitHub",
        href: "https://github.com/Niraj-Dhakall/local-stream",
      },
    ],
    media: [
      // ↓ Replace these placeholders with real screenshots / a screen recording
      {
        type: "image",
        src: "/media/localstream/localStreamdemo.gif",
        alt: "Gif demo of LocalStream",
      },
      {
        type: "image",
        src: "/media/localstream/localStreamdemo2.png",
        alt: "Screenshot of LocalStream",
      },
      // { type: "video", src: "/media/localstream/demo.mp4",
      //   poster: "/media/localstream/demo-poster.jpg",
      //   alt: "multi-device streaming demo" },
    ],
    tags: ["Go", "WebRTC", "WebSockets", "Next.js", "Docker"],
  },
  {
    slug: "retriever-portal",
    title: "Retriever Proposal Portal",
    org: "Scrum Master / Developer",
    date: "Fall 2025",
    summary:
      "A project portal connecting UMBC students with faculty-led initiatives with role-based access for students, stakeholders, and admins.",
    items: [
      "Developed a full-stack project portal using Next.js, Prisma, and MongoDB.",
      "Implemented role-based access control for three user types, enabling secure project discovery and collaboration.",
      "Built unit tests for frontend components using Jest to ensure reliable functionality.",
      "Collaborated with faculty stakeholders to define requirements and iterate on features with the platform being presented to campus leadership.",
      "Managed sprint cycles in Jira: backlog prioritization, task decomposition, and progress tracking.",
    ],
    links: [
      { label: "GitHub", href: "https://github.com/Niraj-Dhakall/4-4-7-proj" },
      {
        label: "Demo",
        href: "https://drive.google.com/file/d/16I6GV69U-dsn0tulfODAi9CJkxWhGGB9/view?usp=sharing",
      },
    ],
    media: [
      {
        type: "image",
        src: "/media/retriever/retriever-1.png",
        alt: "project discovery — student view",
      },
      {
        type: "image",
        src: "/media/retriever/retriever-2.png",
        alt: "project detail — apply flow",
      },
      {
        type: "image",
        src: "/media/retriever/retriever-3.png",
        alt: "admin dashboard — classes & stakeholders",
      },
      {
        type: "image",
        src: "/media/retriever/retriever-4.png",
        alt: "student profile — section & group",
      },
      {
        type: "image",
        src: "/media/retriever/retriever-5.png",
        alt: "project manager dashboard — overview",
      },
      {
        type: "image",
        src: "/media/retriever/retriever-6.png",
        alt: "proposal request form — new project",
      },
    ],
    tags: ["Next.js", "Prisma", "MongoDB", "Jest", "Agile"],
  },

  // ------------------------------------------------------------------
  // Template for your next project — uncomment and fill in.
  // CastCreel would demo beautifully here with a screen recording.
  // ------------------------------------------------------------------
  // {
  //   slug: "castcreel",
  //   title: "CastCreel",
  //   date: "2026",
  //   summary:
  //     "React Native fishing companion — live DNR stocking map, catch logging, and animated catch cards.",
  //   items: [
  //     "…",
  //   ],
  //   links: [],
  //   media: [
  //     { type: "video", src: "/media/castcreel/map-demo.mp4",
  //       poster: "/media/castcreel/map-demo-poster.jpg",
  //       alt: "live stocking map with species filters" },
  //   ],
  //   tags: ["React Native", "MapLibre", "TypeScript"],
  // },
];

/* ------------------------------------------------------------------ */
/*  Skills — grouped rows read faster than an icon wall                */
/* ------------------------------------------------------------------ */

export const skills: { label: string; items: string[] }[] = [
  { label: "Languages", items: ["Go", "TypeScript", "Python", "C++", "SQL"] },
  {
    label: "Frontend",
    items: ["React", "Next.js", "Tailwind CSS", "Material UI"],
  },
  {
    label: "Backend & Data",
    items: ["Gin", "PostgreSQL", "pgvector", "Redis", "Celery", "Firebase"],
  },
  {
    label: "Infra & AI",
    items: ["Docker", "WebRTC", "RAG pipelines", "Selenium", "Ollama"],
  },
];

/* ------------------------------------------------------------------ */
/*  Education                                                          */
/* ------------------------------------------------------------------ */

export const education = {
  school: "University of Maryland, Baltimore County",
  degree: "B.S. in Computer Science",
  date: "May 2026",
  gpa: "3.665 — Cum Laude",
  coursework:
    "Data Structures, Operating Systems, Artificial Intelligence, Machine Learning, Malware Analysis, C++ and Python Programming",
};
