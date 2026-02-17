"use client";
import { Typewriter } from "react-simple-typewriter";
import { useActivePage } from "./context/ActivePageContext";

export default function Home() {
  const { activePage, setActivePage } = useActivePage();

  if (activePage === "Experience") {
    return (
      <main className="text-white">
        <section className="py-16">
          <h2 className="text-3xl font-bold text-center mb-12">Experience</h2>
          <div className="space-y-12 max-w-4xl mx-auto">
            <ExperienceCard
              title="Student Engineering Intern @ Dogwood Gaming"
              date="January 2025 - Present"
              items={[
                "Built an AI-powered marketing platform for game developers featuring competitor analysis, content generation, and multi-platform social media scheduling.",
                "Developed full-stack application with React/TypeScript frontend, Go/Gin backend, and PostgreSQL database with sqlc for queries, containerized using Docker.",
                "Integrated a RAG system leveraging game documentation and competitor data to deliver context-aware content recommendations with 1–2 second query latency.",
                "Designed and implemented persistent chat history with group-based authorization, storing sessions in PostgreSQL and injecting last 3 conversation turns into LLM context.",
                "Refactored authentication from localStorage to HTTP-only JWT cookies with secure group+user ID validation to prevent XSS.",
                "Implemented task queue using Celery for social media automation and Instagram scraping with Selenium.",
              ]}
              links={[]}
            />
            <ExperienceCard
              title="LocalStream"
              date="January 2026"
              items={[
                "Built peer-to-peer screen sharing application using WebRTC for media streaming and Go WebSocket server for signaling, supporting 5+ concurrent cross-device viewers over local network.",
                "Implemented thread-safe room management with sync.RWMutex to handle concurrent connections and prevent race conditions in shared state.",
                "Scaled architecture from 1-to-1 to 1-to-many connections while maintaining direct WebRTC P2P media paths with server handling only signaling.",
                "Tech Stack: Go, Next.js, WebRTC, WebSockets, Docker, HTTPS.",
              ]}
              links={[
                {
                  platform: "GitHub",
                  link: "https://github.com/Niraj-Dhakall/local-stream",
                },
              ]}
            />
            <ExperienceCard
              title="Scrum Master/Developer @ Retriever Proposal Portal"
              date="Fall 2025"
              items={[
                "Developed a full-stack project portal connecting UMBC students with faculty-led initiatives using Next.js, Prisma, and MongoDB.",
                "Implemented role-based access control for three user types (students, stakeholders, admins), enabling secure project discovery and collaboration.",
                "Built unit tests for frontend components using Jest to ensure reliable functionality.",
                "Collaborated with faculty stakeholders to define requirements and iterate on features, resulting in the platform being presented to campus leadership.",
                "Managed sprint cycles using Jira, including backlog prioritization, task decomposition, and progress tracking.",
              ]}
              links={[
                {
                  platform: "GitHub",
                  link: "https://github.com/Niraj-Dhakall/4-4-7-proj",
                },
                {
                  platform: "Demo",
                  link: "https://drive.google.com/file/d/16I6GV69U-dsn0tulfODAi9CJkxWhGGB9/view?usp=sharing",
                },
              ]}
            />
            <ExperienceCard
              title="Teaching Assistant @ UMBC"
              date="Fall 2025"
              items={[
                "Hosted weekly labs for 18 students, teaching Python programming and foundational coding concepts.",
                "Held office hours to assist students with coding assignments and problem-solving strategies.",
                "Graded assignments, projects, and exams, providing constructive feedback on code quality, logic, and style.",
                "Mentored students to strengthen their understanding of programming fundamentals.",
              ]}
              links={[]}
            />
            <ExperienceCard
              title="Research Assistant @ UMBC"
              date="October 2024 – January 2025"
              items={[
                "Assisted the DAMS lab in researching privacy policies for IoT devices.",
                "Used Python and Large Language Models (LLMs) to validate triples for Knowledge Graph construction.",
                "Contributed to advancing privacy research in the Internet of Things domain.",
              ]}
              links={[]}
            />
            <ExperienceCard
              title="Teaching Fellow @ UMBC"
              date="January 2024 – June 2024"
              items={[
                "Assisted students in weekly office hours on Object-Oriented Programming concepts.",
                "Helped students with complex projects involving memory management using pointers, linked lists, and inheritance.",
                "Graded bi-weekly C++ projects focusing on memory management, polymorphism, and inheritance.",
                "Provided mentorship and guidance to help students master fundamental computer science concepts.",
              ]}
              links={[]}
            />
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="text-white">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center min-h-[80vh] gap-5 py-12">
        <div className="flex-1 space-y-6">
          <h3
            className="text-3xl text-[#3498db] sm:text-xl md:text-5xl font-bold"
            style={{ fontFamily: "Jersey 10" }}
          >
            Hello I'm
          </h3>
          <div className="h-[3rem] md:h-[4rem]">
            <h1 className="text-3xl md:text-5xl font-bold">
              <Typewriter
                words={[
                  "Niraj Dhakal",
                  "A Software Engineer",
                  "Looking for New Grad Roles",
                ]}
                loop={true}
                cursor
                cursorStyle="."
                typeSpeed={70}
                deleteSpeed={100}
                delaySpeed={1000}
                cursorColor="red"
              />
            </h1>
          </div>
          <p className="text-gray-300 text-lg  md:text-xl leading-relaxed max-w-xl">
            Software engineer with production experience building AI-powered
            systems and full-stack applications. Skilled in Go, React,
            PostgreSQL, and RAG architecture. Experienced in end-to-end feature
            ownership from design through deployment.
          </p>
          <div className="flex gap-2">
            <a
              href="/images/NirajDhakalResumeLatest.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block border border-white px-8 py-3 text-white font-semibold tracking-wider hover:bg-white hover:text-black transition-colors"
            >
              Resume
            </a>
            <div>
              <button
                className="border bg-white border-white md:hidden lg:hidden px-8 py-3 text-black font-semibold tracking-wider hover:bg-gray-300 hover:text-black transition-colors"
                onClick={() => setActivePage("Experience")}
              >
                Experience
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-1 justify-center">
          <img
            src="/images/IMG_0195.jpg"
            alt="Niraj Dhakal"
            className="w-80 h-80 md:w-90 md:h-90 sm:w-50 sm:h-50 object-cover rounded-lg"
          />
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-16 text-center">
        <h2 className="text-3xl font-bold mb-8">Skills</h2>
        <div className="flex gap-6 overflow-x-auto pb-4 justify-center flex-wrap">
          {[
            { icon: "go", name: "Go" },
            { icon: "ts", name: "TypeScript" },
            { icon: "py", name: "Python" },
            { icon: "postgres", name: "PostgreSQL" },
            { icon: "cpp", name: "C++" },
            { icon: "swift", name: "Swift" },
            { icon: "html,css", name: "HTML/CSS" },
          ].map((skill) => (
            <div
              key={skill.name}
              className="flex flex-col items-center min-w-[100px]"
            >
              <img
                className="w-16 h-16 md:w-20 md:h-20 object-contain"
                src={`https://skillicons.dev/icons?i=${skill.icon}`}
                alt={skill.name}
              />
              <h4 className="mt-2 text-sm font-semibold">{skill.name}</h4>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <div className="flex gap-4 justify-center flex-wrap">
            {["react", "next", "firebase", "tailwind", "materialui"].map(
              (icon) => (
                <img
                  key={icon}
                  className="w-16 h-16 md:w-20 md:h-20 object-contain"
                  src={`https://skillicons.dev/icons?i=${icon}`}
                  alt={icon}
                />
              ),
            )}
          </div>
          <h4 className="mt-2 text-sm font-semibold">React Stack</h4>
        </div>
      </section>

      {/* Education Section */}
      <section className="py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Education</h2>
        <div className="max-w-4xl mx-auto bg-neutral-900 border border-neutral-700 rounded-lg p-8">
          <h3 className="text-xl font-bold">
            University of Maryland, Baltimore County
          </h3>
          <h4 className="text-gray-400 mt-1">
            Bachelor of Science in Computer Science | Expected May 2026
          </h4>
          <p className="mt-3">
            <span className="font-semibold">GPA:</span> 3.625
          </p>
          <p className="mt-1">
            <span className="font-semibold">Relevant Coursework:</span> Data
            Structures, C++ Programming, Python Programming, Operating Systems,
            Artificial Intelligence, Machine Learning.
          </p>
        </div>
      </section>
    </main>
  );
}

type ExperienceLink = {
  platform: string;
  link: string;
};

function ExperienceCard({
  title,
  date,
  items,
  links,
}: {
  title: string;
  date: string;
  items: string[];
  links: ExperienceLink[];
}) {
  return (
    <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-6">
      <h3 className="text-xl font-bold">{title}</h3>
      <h4 className="text-gray-400 mt-1 mb-4">{date}</h4>
      <ul className="list-disc pl-6 space-y-2 text-gray-300 text-left">
        {items.map((item, i) => (
          <li key={i} className="leading-relaxed">
            {item}
          </li>
        ))}
      </ul>
      {links.length > 0 && (
        <div className="mt-4 flex gap-3 flex-wrap">
          {links.map((l) => (
            <a
              key={l.platform}
              href={l.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block border border-white px-4 py-2 text-sm text-white font-semibold rounded hover:bg-white hover:text-black transition-colors"
            >
              {l.platform}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
