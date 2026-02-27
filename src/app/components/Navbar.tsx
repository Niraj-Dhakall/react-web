"use client";
import { useState } from "react";
import { useActivePage } from "../context/ActivePageContext";

const pages = ["Home", "Experience"];

const Navbar = () => {
  const { activePage, setActivePage } = useActivePage();
  const [menuOpen, setMenuOpen] = useState(false);

  const handlePageClick = (page: string) => {
    setActivePage(page);
    setMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-lg bg-black/30 border-b border-neutral-800 text-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-3">
          {/* Logo + Title */}
          <div className="flex items-center">
            <button className="font-mono flex font-bold tracking-widest text-lg md:text-xl text-white no-underline hover:text-gray-300">
              <a href="/" className="flex">
                <img
                  className="mr-2 w-6 h-6"
                  alt="Niraj Dhakal Logo"
                  draggable="false"
                  src="https://i.imgur.com/142Glwu.png"
                />
                Niraj Dhakal
              </a>
            </button>
          </div>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1 flex-grow ml-6">
            {pages.map((page) => (
              <button
                key={page}
                onClick={() => handlePageClick(page)}
                className={`my-2 px-3 py-1 text-white rounded transition-colors ${
                  activePage === page
                    ? "bg-neutral-700"
                    : "hover:bg-neutral-800"
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          {/* Social links + hamburger */}
          <div className="flex items-center gap-4">
            <a
              href="https://www.linkedin.com/in/nirajdhakal26"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="LinkedIn"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 448 512"
              >
                <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z" />
              </svg>
            </a>
            <a
              href="https://github.com/Niraj-Dhakall"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 448 512"
              >
                <path d="M224 0C100.3 0 0 100.3 0 224c0 99.7 64.7 183.5 151.4 213.2 11.1 2 15.2-4.8 15.2-10.6 0-5.2-.2-18.7-.3-36.8-61.8 13.4-74.8-29.8-74.8-29.8-10.1-25.6-24.6-32.4-24.6-32.4-20.1-13.7 1.5-13.4 1.5-13.4 22.2 1.6 33.8 22.7 33.8 22.7 19.7 33.6 51.7 23.9 64.2 18.3 2.2-14.3 7.7-23.9 14-29.4-48.5-5.5-99.4-24.2-99.4-107.6 0-23.8 8.5-43.2 22.4-58.6-2.2-5.5-9.7-28.3 2.1-58.9 0 0 18.3-5.9 60.2 22.5 17.5-4.9 36.5-7.3 55.3-7.4 18.8.1 37.8 2.5 55.3 7.4 41.8-28.4 60.1-22.5 60.1-22.5 11.8 30.6 4.3 53.4 2.1 58.9 13.9 15.4 22.4 34.8 22.4 58.6 0 83.4-50.9 102.1-99.4 107.6 7.9 6.7 15.1 19.9 15.1 40.3 0 29.1-.3 52.9-.3 60.1 0 5.8 4.1 12.7 15.2 10.6C359.3 407.5 448 323.7 448 224 448 100.3 347.7 0 224 0z" />
              </svg>
            </a>
            <a
              href="mailto:nirajd1@umbc.edu"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Email"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </a>

            {/* Hamburger button - mobile only */}
            <button
              className="md:hidden text-white"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                {menuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {menuOpen && (
          <div className="md:hidden pb-3 border-t border-neutral-800">
            {pages.map((page) => (
              <button
                key={page}
                onClick={() => handlePageClick(page)}
                className={`block w-full text-left px-3 py-2 rounded transition-colors ${
                  activePage === page
                    ? "bg-neutral-700"
                    : "hover:bg-neutral-800"
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
