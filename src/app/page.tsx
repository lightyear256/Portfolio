"use client";
import Image from "next/image";
import Header from "./components/Header";
import TypewriterEffect from "./components/TypeWriting";
import Card from "./components/card";
import { Github, Mail, Linkedin, Heart, ArrowUpRight, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import axios from "axios";
import ClickSpark from './components/click';
import { MyInterest, Facts, techStackByCategory, categoryConfig, Project } from './data';
import StatsSection from './components/statsSection';
import MusicPlayer from './components/MusicPlayer';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const heroRef = useRef(null);
  const aboutRef = useRef(null);
  const techStackRef = useRef(null);
  const projectsRef = useRef(null);
  const contactRef = useRef(null);
  const statsRef = useRef(null);

  interface SectionRef {
    current: HTMLElement | null;
  }

  const scrollToSection = (ref: SectionRef) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  interface FormData {
    name: string;
    email: string;
    message: string;
  }

  interface ApiResponse {
    success?: boolean;
    message?: string;
    error?: string;
    details?: string[];
  }

  const [formData, setFormData] = useState<FormData>({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitStatus, setSubmitStatus] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (submitStatus) setSubmitStatus("");
  };

  const validateForm = (): string[] => {
    const errors: string[] = [];
    if (!formData.name.trim() || formData.name.trim().length < 2) errors.push("Name must be at least 2 characters long");
    if (formData.name.trim().length > 100) errors.push("Name must be less than 100 characters");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) errors.push("Please enter a valid email address");
    if (!formData.message.trim() || formData.message.trim().length < 10) errors.push("Message must be at least 10 characters long");
    if (formData.message.trim().length > 1000) errors.push("Message must be less than 1000 characters");
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (validationErrors.length > 0) { setSubmitStatus(`Please fix: ${validationErrors.join(", ")}`); return; }
    setIsSubmitting(true);
    setSubmitStatus("");
    try {
      const response = await axios.post("/api/contact", formData, { headers: { "Content-Type": "application/json" } });
      const data: ApiResponse = response.data;
      if (data.success) {
        setSubmitStatus("Message sent successfully! You should receive a confirmation email shortly.");
        setFormData({ name: "", email: "", message: "" });
      } else {
        let errorMessage = data.error || "Failed to send message. Please try again.";
        if (data.details && data.details.length > 0) errorMessage += ` Details: ${data.details.join(", ")}`;
        setSubmitStatus(errorMessage);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          const data = error.response.data;
          let errorMessage = data?.error || "Failed to send message. Please try again.";
          if (data?.details && data.details.length > 0) errorMessage += ` Details: ${data.details.join(", ")}`;
          setSubmitStatus(errorMessage);
        } else if (error.request) {
          setSubmitStatus("Network error. Please check your connection and try again.");
        } else {
          setSubmitStatus("An unexpected error occurred. Please try again.");
        }
      } else {
        setSubmitStatus("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  interface ContactClickParams { type: "leetcode" | "linkedin" | "github"; value: string; }
  const handleContactClick1 = (type: ContactClickParams["type"], value: ContactClickParams["value"]): void => {
    switch (type) {
      case "leetcode": window.open(`https://leetcode.com/u/${value}`, "_blank"); break;
      case "linkedin": window.open(`https://linkedin.com/in/${value}`, "_blank"); break;
      case "github": window.open(`https://github.com/${value}`, "_blank"); break;
    }
  };

  useEffect(() => {
    const tl = gsap.timeline();
    tl.from(".hero-eyebrow", { opacity: 0, y: 20, duration: 0.6, ease: "power3.out" })
      .from(".hero-name-line1", { opacity: 0, x: -60, duration: 0.9, ease: "power3.out" }, "-=0.2")
      .from(".hero-name-line2", { opacity: 0, x: 60, duration: 0.9, ease: "power3.out" }, "-=0.7")
      .from(".hero-typewriter", { opacity: 0, y: 20, duration: 0.7, ease: "power2.out" }, "-=0.3")
      .from(".hero-description", { opacity: 0, y: 20, duration: 0.7, ease: "power2.out" }, "-=0.4")
      .from(".hero-cta", { opacity: 0, y: 20, scale: 0.95, duration: 0.6, ease: "back.out(1.7)" }, "-=0.3")
      .from(".hero-scroll-hint", { opacity: 0, duration: 0.5 }, "-=0.1");

    const sections = [".about-title", ".tech-title", ".projects-title", ".contact-title"];
    sections.forEach(sel => {
      gsap.fromTo(sel, { opacity: 0, y: 40 }, {
        opacity: 1, y: 0, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: sel, start: "top 85%", toggleActions: "play none none reverse" }
      });
    });

    gsap.fromTo(".stats-card", { opacity: 0, y: 50, scale: 0.97 }, {
  opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "back.out(1.4)", stagger: 0.15,
  scrollTrigger: { trigger: ".stats-card", start: "top 85%", toggleActions: "play none none reverse" }
});


    gsap.fromTo(".about-text-block", { opacity: 0, x: -40 }, {
      opacity: 1, x: 0, duration: 1, ease: "power3.out",
      scrollTrigger: { trigger: ".about-text-block", start: "top 80%", toggleActions: "play none none reverse" }
    });

    gsap.fromTo(".about-image-block", { opacity: 0, scale: 0.9 }, {
      opacity: 1, scale: 1, duration: 1.1, ease: "back.out(1.4)",
      scrollTrigger: { trigger: ".about-image-block", start: "top 80%", toggleActions: "play none none reverse" }
    });

    gsap.fromTo(".interest-tag", { opacity: 0, scale: 0.7 }, {
      opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.7)", stagger: 0.07,
      scrollTrigger: { trigger: ".interest-tag", start: "top 90%", toggleActions: "play none none reverse" }
    });

    gsap.fromTo(".fact-item", { opacity: 0, x: -20 }, {
      opacity: 1, x: 0, duration: 0.6, stagger: 0.1,
      scrollTrigger: { trigger: ".fact-item", start: "top 90%", toggleActions: "play none none reverse" }
    });

    gsap.fromTo(".tech-card", { opacity: 0, y: 50, scale: 0.95 }, {
      opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "back.out(1.4)", stagger: 0.15,
      scrollTrigger: { trigger: ".tech-card", start: "top 85%", toggleActions: "play none none reverse" }
    });

    gsap.fromTo(".project-card", { opacity: 0, y: 50 }, {
      opacity: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.2,
      scrollTrigger: { trigger: ".project-card", start: "top 85%", toggleActions: "play none none reverse" }
    });

    gsap.fromTo(".contact-card", { opacity: 0, y: 30 }, {
      opacity: 1, y: 0, duration: 0.7, ease: "power3.out", stagger: 0.12,
      scrollTrigger: { trigger: ".contact-card", start: "top 85%", toggleActions: "play none none reverse" }
    });

    gsap.fromTo(".contact-form", { opacity: 0, x: 40 }, {
      opacity: 1, x: 0, duration: 0.9, ease: "power3.out",
      scrollTrigger: { trigger: ".contact-form", start: "top 85%", toggleActions: "play none none reverse" }
    });

    gsap.to(".hero-scroll-hint", { y: 8, duration: 1.4, ease: "sine.inOut", yoyo: true, repeat: -1 });

    gsap.to(".blob-1", { y: -30, x: 20, duration: 8, ease: "sine.inOut", yoyo: true, repeat: -1 });
    gsap.to(".blob-2", { y: 20, x: -15, duration: 10, ease: "sine.inOut", yoyo: true, repeat: -1 });
    gsap.to(".blob-3", { y: -15, x: 25, duration: 7, ease: "sine.inOut", yoyo: true, repeat: -1 });

    return () => { ScrollTrigger.getAll().forEach(t => t.kill()); };
  }, []);

  return (
    <div className="text-white" style={{ fontFamily: "'DM Sans', 'Syne', sans-serif", background: "#080c14" }}>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

        * { box-sizing: border-box; }

        :root {
          --lime: #c8f542;
          --lime-dim: #a0c435;
          --navy: #080c14;
          --navy-2: #0d1526;
          --navy-3: #111e34;
          --slate: #1a2640;
          --slate-light: #253452;
          --muted: #8899aa;
          --text: #e8f0f8;
        }

        body { background: var(--navy); color: var(--text); }

        ::selection { background: var(--lime); color: var(--navy); }

        .syne { font-family: 'Syne', sans-serif; }

        .noise::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          opacity: 0.025;
          pointer-events: none;
          z-index: 0;
        }

        .lime-glow {
          box-shadow: 0 0 40px rgba(200, 245, 66, 0.12);
        }

        .lime-glow:hover {
          box-shadow: 0 0 60px rgba(200, 245, 66, 0.22);
        }

        .tag {
          background: rgba(200, 245, 66, 0.08);
          border: 1px solid rgba(200, 245, 66, 0.2);
          color: var(--lime);
          padding: 6px 14px;
          border-radius: 100px;
          font-size: 0.8rem;
          font-weight: 500;
          transition: all 0.2s;
          cursor: default;
          display: inline-block;
        }
        .tag:hover { background: rgba(200, 245, 66, 0.15); transform: scale(1.05); }

        .section-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.7rem;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: var(--lime);
          font-weight: 500;
        }

        .card-hover {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .card-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 60px rgba(0,0,0,0.4);
        }

        input, textarea {
          background: rgba(255,255,255,0.04) !important;
          border: 1px solid rgba(255,255,255,0.08) !important;
          color: white !important;
          transition: border-color 0.2s, box-shadow 0.2s !important;
          outline: none !important;
        }
        input:focus, textarea:focus {
          border-color: var(--lime) !important;
          box-shadow: 0 0 0 3px rgba(200, 245, 66, 0.1) !important;
        }
        input::placeholder, textarea::placeholder { color: var(--muted) !important; }

        .number-badge {
          font-family: 'Syne', sans-serif;
          font-size: 0.65rem;
          color: var(--lime);
          opacity: 0.5;
          letter-spacing: 0.1em;
        }

        .divider-line {
          width: 100%;
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(255,255,255,0.08), transparent);
        }

        .submit-btn {
          background: var(--lime);
          color: var(--navy);
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          letter-spacing: 0.05em;
          border-radius: 6px;
          padding: 14px 32px;
          width: 100%;
          transition: opacity 0.2s, transform 0.2s;
          border: none;
          cursor: pointer;
          font-size: 0.95rem;
        }
        .submit-btn:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); }
        .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }
      `}</style>

      <ClickSpark sparkColor='#c8f542' sparkSize={8} sparkRadius={18} sparkCount={10} duration={450}>

        <Header
          home={heroRef}
          about={aboutRef}
          techstack={techStackRef}
          contact={contactRef}
          stats={statsRef}
          project={projectsRef}
        />

        <section
          ref={heroRef}
          className="relative noise overflow-hidden min-h-screen flex flex-col justify-center px-8 md:px-20 pt-28 pb-20"
          style={{ background: "linear-gradient(135deg, #080c14 0%, #0d1526 60%, #0a1020 100%)" }}
        >
          <div className="blob-1 absolute top-[-120px] right-[-80px] w-[500px] h-[500px] rounded-full opacity-[0.07]"
            style={{ background: "radial-gradient(circle, #c8f542, transparent 70%)" }} />
          <div className="blob-2 absolute bottom-[-100px] left-[-60px] w-[400px] h-[400px] rounded-full opacity-[0.05]"
            style={{ background: "radial-gradient(circle, #4a90ff, transparent 70%)" }} />
          <div className="blob-3 absolute top-[40%] left-[30%] w-[300px] h-[300px] rounded-full opacity-[0.04]"
            style={{ background: "radial-gradient(circle, #c8f542, transparent 70%)" }} />

          <div className="absolute inset-0 pointer-events-none"
            style={{ backgroundImage: "linear-gradient(rgba(200,245,66,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(200,245,66,0.03) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

          <div className="relative z-10 max-w-6xl">
            <div className="hero-eyebrow flex items-center gap-3 mb-8">
              <div className="w-8 h-px" style={{ background: "var(--lime)" }} />
              <span className="section-label">Portfolio 2025</span>
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "var(--lime)" }} />
            </div>

            <h1 className="syne mb-6 pb-2 w-full" style={{ lineHeight: 1.05 }}>
  <div
    className="hero-name-line1 font-extrabold tracking-tight w-full"
    style={{
      fontSize: "min(7.5vw, 7rem)",
      color: "var(--text)",
    }}
  >
    Ayushmaan
  </div>
  <div
    className="hero-name-line2 font-extrabold tracking-tight flex items-end gap-4 flex-wrap w-full"
    style={{
      fontSize: "min(7.5vw, 7rem)",
      WebkitTextStroke: "1px rgba(255,255,255,0.3)",
      color: "transparent",
    }}
  >
    Kumar
    <span
      className="font-normal tracking-normal"
      style={{
        WebkitTextStroke: "0px",
        color: "var(--lime)",
        fontSize: "min(2.5vw, 2.2rem)",
        marginBottom: "0.4em",
      }}
    >
      .dev
    </span>
  </div>
</h1>

            <div className="hero-typewriter mb-6">
              <TypewriterEffect />
            </div>

            <p className="hero-description text-lg max-w-xl leading-relaxed mb-10" style={{ color: "var(--muted)" }}>
              I build modern, responsive websites and have a strong foundation in
              Data Structures and Algorithms. Always eager to explore new technologies
              and grow through hands-on learning.
            </p>

            <div className="hero-cta flex items-center gap-5 flex-wrap mb-7">
              <Link href="https://www.linkedin.com/in/ayushmaan-kumar/">
                <button className="syne font-bold flex items-center gap-2 px-7 py-3.5 rounded-md text-sm transition-all duration-200 hover:opacity-90 hover:translate-y-[-1px]"
                  style={{ background: "var(--lime)", color: "var(--navy)" }}>
                  Let&apos;s Connect
                  <ArrowUpRight size={16} />
                </button>
              </Link>
              <button
                onClick={() => scrollToSection(projectsRef)}
                className="syne font-medium flex items-center gap-2 px-7 py-3.5 rounded-md text-sm transition-all duration-200 hover:bg-white/10"
                style={{ border: "1px solid rgba(255,255,255,0.15)", color: "var(--text)" }}>
                View Projects
              </button>
            </div>
          </div>

          <div className="hero-scroll-hint absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
            <span className="section-label">Scroll</span>
            <ChevronDown size={16} style={{ color: "var(--lime)" }} />
          </div>

          <div className="absolute bottom-0 right-0 hidden md:flex items-stretch">
            {[["IIIT", "Dharwad"], ["Full Stack", "Developer"], ["DSA", "Enthusiast"]].map(([a, b], i) => (
              <div key={i} className="px-8 py-6 flex flex-col justify-center border-l"
                style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
                <div className="syne font-bold text-base" style={{ color: "var(--lime)" }}>{a}</div>
                <div className="text-xs" style={{ color: "var(--muted)" }}>{b}</div>
              </div>
            ))}
          </div>
        </section>

        <section ref={aboutRef} className="relative py-32 px-8 md:px-20" style={{ background: "var(--navy-2)" }}>
          <div className="divider-line mb-12" />
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-4 about-title">
              <span className="section-label">/ About me</span>
            </div>
            <h2 className="syne text-[clamp(2.5rem,6vw,5rem)] font-extrabold mb-20 about-title"
              style={{ color: "var(--text)" }}>
              The Human<br />Behind the Code
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div className="about-text-block space-y-8">
                <p className="text-lg leading-relaxed" style={{ color: "var(--muted)" }}>
                  Hello, I&apos;m <span style={{ color: "var(--text)", fontWeight: 600 }}>Ayushmaan</span>, a student at IIIT Dharwad.
                  I enjoy building websites and actively practice Data Structures and Algorithms.
                  Competitive programming keeps me sharp, and exploring new technologies keeps me inspired.
                </p>

                <div>
                  <div className="section-label mb-4">Currently working on</div>
                  <p style={{ color: "var(--muted)" }} className="leading-relaxed">
                    Diving deep into full-stack development — crafting clean, efficient code and exploring
                    emerging technologies in the web development space.
                  </p>
                </div>

                <div>
                  <div className="section-label mb-4">Interests</div>
                  <div className="flex flex-wrap gap-2">
                    {MyInterest.map((interest, idx) => (
                      <span key={idx} className="interest-tag tag">{interest}</span>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="section-label mb-4">Quick facts</div>
                  <div className="grid grid-cols-1 gap-3">
                    {Facts.map((fact, idx) => (
                      <div key={idx} className="fact-item flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "var(--lime)" }} />
                        <span style={{ color: "var(--muted)" }}>{fact}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="about-image-block flex flex-col items-center lg:items-end gap-6">
                <div className="relative">
                  <div className="absolute -bottom-4 -right-4 w-full h-full rounded-2xl border"
                    style={{ borderColor: "var(--lime)", opacity: 0.4 }} />
                  <Image
                    src="/assets/Ayushmaan_latest.jpg"
                    alt="Ayushmaan Kumar"
                    width={420}
                    height={500}
                    className="rounded-2xl object-cover relative grayscale-100 z-10"
                    style={{ filter: "grayscale(20%) contrast(1.05)" }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl z-20"
                    style={{ background: "var(--lime)" }} />
                </div>
                <div className="text-center lg:text-right">
                  <div className="syne font-bold" style={{ color: "var(--lime)" }}>Always Learning</div>
                  <div className="text-sm mt-1" style={{ color: "var(--muted)" }}>Coding · Creating · Competing</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section ref={techStackRef} className="relative py-32 px-8 md:px-20" style={{ background: "var(--navy)" }}>
          <div className="divider-line mb-12" />
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-4 tech-title">
              <span className="section-label">/ Tech Stack</span>
            </div>
            <h2 className="syne text-[clamp(2.5rem,6vw,5rem)] font-extrabold mb-4 tech-title" style={{ color: "var(--text)" }}>
              Tools of the Trade
            </h2>
            <p className="mb-20 tech-title" style={{ color: "var(--muted)" }}>Technologies I work with</p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {Object.entries(techStackByCategory).map(([category, techs], catIdx) => {
                type CategoryKey = keyof typeof categoryConfig;
                const config = categoryConfig[category as CategoryKey];
                return (
                  <div key={category} className="tech-card card-hover rounded-2xl p-7 border"
                    style={{ background: "var(--navy-2)", borderColor: "rgba(255,255,255,0.07)" }}>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full" style={{ background: "var(--lime)" }} />
                        <span className="syne font-bold text-sm tracking-widest uppercase" style={{ color: "var(--lime)" }}>
                          {config.title}
                        </span>
                      </div>
                      <span className="number-badge">{String(catIdx + 1).padStart(2, "0")}</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {techs.map((tech, i) => (
                        <div key={i} className="tech-item flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 hover:bg-white/5 cursor-default group"
                          style={{ border: "1px solid rgba(255,255,255,0.05)" }}>
                          <Image src={tech.imgLink} alt={tech.title} width={20} height={20} className="object-contain opacity-70 group-hover:opacity-100 transition-opacity" />
                          <span className="text-sm" style={{ color: "var(--muted)" }}>{tech.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section ref={projectsRef} className="relative py-32 px-8 md:px-20" style={{ background: "var(--navy-2)" }}>
          <div className="divider-line mb-12" />
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-4 projects-title">
              <span className="section-label">/ Projects</span>
            </div>
            <h2 className="syne text-[clamp(2.5rem,6vw,5rem)] font-extrabold mb-20 projects-title" style={{ color: "var(--text)" }}>
              Things I&apos;ve Built
            </h2>

            <div className="flex flex-wrap gap-8">
              {Project.map((value, id) => (
                <div key={id} className="project-card">
                  <Card value={value} />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section ref={statsRef} className="relative py-32 px-8 md:px-20" style={{ background: "var(--navy-3)" }}>
  <div className="divider-line mb-12" />
  <div className="max-w-7xl mx-auto">
    <div className="flex items-center gap-4 mb-4 stats-title">
      <span className="section-label">/ Stats</span>
    </div>
    <h2 className="syne text-[clamp(2.5rem,6vw,5rem)] font-extrabold mb-4 stats-title" style={{ color: "var(--text)" }}>
      By the Numbers
    </h2>
    <p className="mb-20 stats-title" style={{ color: "var(--muted)" }}>
      GitHub activity & LeetCode progress
    </p>
    <div className="stats-card">
      <StatsSection />
    </div>
  </div>
</section>
        <section ref={contactRef} className="relative py-32 px-8 md:px-20" style={{ background: "var(--navy)" }}>
          <div className="divider-line mb-12" />
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-4 contact-title">
              <span className="section-label">/ Contact</span>
            </div>
            <h2 className="syne text-[clamp(2.5rem,6vw,5rem)] font-extrabold mb-6 contact-title" style={{ color: "var(--text)" }}>
              Let&apos;s Build Something
            </h2>
            <p className="mb-20 contact-title max-w-lg text-lg leading-relaxed" style={{ color: "var(--muted)" }}>
              Open to discussing new opportunities, interesting projects, or just chatting about tech.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <div className="space-y-4">
                {[
                  { type: "leetcode" as const, label: "LeetCode", handle: "ayushmaan25", icon: (
                    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor">
                      <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" />
                    </svg>
                  )},
                  { type: "linkedin" as const, label: "LinkedIn", handle: "ayushmaan-kumar", icon: <Linkedin size={20} /> },
                  { type: "github" as const, label: "GitHub", handle: "lightyear256", icon: <Github size={20} /> },
                ].map(({ type, label, handle, icon }) => (
                  <div key={type} className="contact-card card-hover flex items-center justify-between px-6 py-5 rounded-xl cursor-pointer group"
                    style={{ background: "var(--navy-2)", border: "1px solid rgba(255,255,255,0.07)" }}
                    onClick={() => handleContactClick1(type, handle)}>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ background: "rgba(200,245,66,0.08)", color: "var(--lime)" }}>
                        {icon}
                      </div>
                      <div>
                        <div className="syne font-semibold text-sm">{label}</div>
                        <div className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>{handle}</div>
                      </div>
                    </div>
                    <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ color: "var(--lime)" }} />
                  </div>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="contact-form space-y-5">
                {[
                  { id: "name", label: "Name", type: "text", placeholder: "Your Name" },
                  { id: "email", label: "Email", type: "email", placeholder: "your@email.com" },
                ].map(field => (
                  <div key={field.id}>
                    <label htmlFor={field.id} className="section-label block mb-2">{field.label}</label>
                    <input
                      type={field.type}
                      id={field.id}
                      name={field.id}
                      value={formData[field.id as keyof FormData]}
                      onChange={handleInputChange}
                      required
                      placeholder={field.placeholder}
                      className="w-full px-4 py-3 rounded-lg text-sm"
                    />
                  </div>
                ))}
                <div>
                  <label htmlFor="message" className="section-label block mb-2">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    placeholder="Working on something cool? Let's chat!"
                    className="w-full px-4 py-3 rounded-lg text-sm resize-none"
                  />
                </div>

                <button type="submit" disabled={isSubmitting} className="submit-btn">
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Sending...
                    </span>
                  ) : "Send Message →"}
                </button>

                {submitStatus && (
                  <div className="p-4 rounded-lg text-sm"
                    style={{
                      background: submitStatus.includes("success") ? "rgba(200,245,66,0.08)" : "rgba(255,80,80,0.08)",
                      border: `1px solid ${submitStatus.includes("success") ? "rgba(200,245,66,0.2)" : "rgba(255,80,80,0.2)"}`,
                      color: submitStatus.includes("success") ? "var(--lime)" : "#ff8080"
                    }}>
                    {submitStatus}
                  </div>
                )}
              </form>
            </div>
          </div>
        </section>

        <footer className="bg-gradient-to-br from-slate-950 to-black border-t border-slate-800 font-mono pb-14">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold text-lime-400 mb-4">
                Ayushmaan Kumar
              </h3>
              <p className="text-gray-400 mb-6 max-w-md">
                Full-stack developer passionate about creating innovative web
                solutions and solving complex problems through clean, efficient
                code.
              </p>
              <div className="flex space-x-4">
                <Link
                  href="https://github.com/lightyear256"
                  className="hover-card glow-on-hover text-gray-400 hover:text-lime-400 transition-colors duration-300"
                >
                  <Github className="w-6 h-6" />
                </Link>
                <Link
                  href="https://www.linkedin.com/in/ayushmaan-kumar/"
                  className="hover-card glow-on-hover text-gray-400 hover:text-lime-400 transition-colors duration-300"
                >
                  <Linkedin></Linkedin>
                </Link>
                <a
                  href="mailto:ayushmaan@example.com"
                  className="hover-card glow-on-hover text-gray-400 hover:text-lime-400 transition-colors duration-300"
                >
                  <Mail></Mail>
                </a>
                <Link
                  href="https://leetcode.com/u/ayushmaan25/"
                  className="hover-card glow-on-hover text-gray-400 hover:text-lime-400 transition-colors duration-300"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LeetCode Profile"
                >
                  <svg
                    role="img"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                  >
                    <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" />
                  </svg>
                </Link>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-4">
                Quick Links
              </h4>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => scrollToSection(aboutRef)}
                    className="text-gray-400 hover:text-lime-400 transition-colors duration-300"
                  >
                    About
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection(techStackRef)}
                    className="text-gray-400 hover:text-lime-400 transition-colors duration-300"
                  >
                    Tech Stack
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection(projectsRef)}
                    className="text-gray-400 hover:text-lime-400 transition-colors duration-300"
                  >
                    Projects
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection(contactRef)}
                    className="text-gray-400 hover:text-lime-400 transition-colors duration-300"
                  >
                    Contact
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-4">
                Core Skills
              </h4>
              <ul className="space-y-2">
                <li className="text-gray-400">React & Next.js</li>
                <li className="text-gray-400">Node.js & Express</li>
                <li className="text-gray-400">Full-Stack Development</li>
                <li className="text-gray-400">Problem Solving</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © 2025 Ayushmaan Kumar. All rights reserved.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <div className="text-gray-400 flex items-center gap-x-2 text-sm">
                  <div>Made with</div>
                  <Heart className="text-rose-600 size-5"></Heart>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-lime-400 rounded-full animate-pulse"></div>
          <div
            className="absolute top-3/4 right-1/4 w-1 h-1 bg-lime-300 rounded-full animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-lime-500 rounded-full animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>
      </footer>
                <MusicPlayer src="/music/bg.mp3" />
      </ClickSpark>
    </div>
  );
}
