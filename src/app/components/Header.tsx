"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { label } from "motion/react-client";

interface SectionRef {
  current: HTMLElement | null;
}

interface HeaderProps {
  home: SectionRef;
  about: SectionRef;
  techstack: SectionRef;
  project: SectionRef;
  stats:SectionRef
  contact: SectionRef;
}

export default function Header(props: HeaderProps) {
  const headerRef = useRef(null);
  const lastScrollY = useRef(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 60);

      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        gsap.to(headerRef.current, { y: -100, duration: 0.3, ease: "power2.out" });
      } else {
        gsap.to(headerRef.current, { y: 0, duration: 0.3, ease: "power2.out" });
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (ref: SectionRef) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    setIsMenuOpen(false);
  };

  const navLinks = [
    { label: "Home", ref: props.home },
    { label: "About", ref: props.about },
    { label: "Tech Stack", ref: props.techstack },
    { label: "Projects", ref: props.project },
    { label:"Stats",ref:props.stats},
    { label: "Contact", ref: props.contact },
  ];

  return (
    <>
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500&display=swap');
        .nav-link {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.875rem;
          color: rgba(232, 240, 248, 0.55);
          cursor: pointer;
          transition: color 0.2s;
          padding: 4px 0;
          position: relative;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 1px;
          background: #c8f542;
          transition: width 0.2s;
        }
        .nav-link:hover { color: #e8f0f8; }
        .nav-link:hover::after { width: 100%; }
        .resume-btn {
          font-family: 'Syne', sans-serif;
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          padding: 8px 20px;
          border-radius: 6px;
          background: transparent;
          border: 1px solid rgba(200, 245, 66, 0.5);
          color: #c8f542;
          cursor: pointer;
          transition: all 0.2s;
        }
        .resume-btn:hover {
          background: #c8f542;
          color: #080c14;
          border-color: #c8f542;
        }
        .hamburger-bar {
          display: block;
          width: 22px;
          height: 1.5px;
          background: #e8f0f8;
          transition: all 0.3s ease;
        }
      `}</style>

      <div
        ref={headerRef}
        className="fixed top-0 w-full z-50 flex items-center justify-between px-8 md:px-16 h-[70px] transition-all duration-300"
        style={{
          background: scrolled ? "rgba(8, 12, 20, 0.9)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
        }}
      >
        <div
          className="cursor-pointer"
          style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.1rem", color: "#c8f542" }}
          onClick={() => scrollToSection(props.home)}
        >
          &lt;AK/&gt;
        </div>

        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map(({ label, ref }) => (
            <span key={label} className="nav-link" onClick={() => scrollToSection(ref)}>
              {label}
            </span>
          ))}
          <button
            className="resume-btn ml-2"
            onClick={() => {
              const link = document.createElement("a");
              link.href = "/resume.pdf";
              link.download = "Ayushmaan_Resume.pdf";
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
          >
            Resume ↗
          </button>
        </nav>

        <button
          className="lg:hidden flex flex-col gap-[5px] p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className="hamburger-bar" style={{ transform: isMenuOpen ? "rotate(45deg) translate(4px, 4px)" : "none" }} />
          <span className="hamburger-bar" style={{ opacity: isMenuOpen ? 0 : 1 }} />
          <span className="hamburger-bar" style={{ transform: isMenuOpen ? "rotate(-45deg) translate(4px, -4px)" : "none" }} />
        </button>
      </div>

      {isMenuOpen && (
        <div
          className="fixed top-[70px] left-0 w-full z-40 px-8 py-8 flex flex-col gap-5 lg:hidden"
          style={{ background: "rgba(8,12,20,0.97)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}
        >
          {navLinks.map(({ label, ref }) => (
            <span
              key={label}
              className="nav-link text-base"
              onClick={() => scrollToSection(ref)}
              style={{ fontSize: "1rem" }}
            >
              {label}
            </span>
          ))}
          <button
            className="resume-btn self-start mt-2"
            onClick={() => {
              const link = document.createElement("a");
              link.href = "/resume.pdf";
              link.download = "Ayushmaan_Resume.pdf";
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              setIsMenuOpen(false);
            }}
          >
            Resume ↗
          </button>
        </div>
      )}
    </>
  );
}
