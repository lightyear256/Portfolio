"use client";
import Image from "next/image";
import Header from "./components/Header";
import TypewriterEffect from "./components/TypeWriting";
import Card from "./components/card";
import {
  Github,
  Mail,
  Linkedin,
  Heart
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import axios from "axios";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const heroRef = useRef(null);
  const aboutRef = useRef(null);
  const techStackRef = useRef(null);
  const projectsRef = useRef(null);
  const contactRef = useRef(null);

  interface SectionRef {
    current: HTMLElement | null;
  }

  const scrollToSection = (ref: SectionRef) => {
    ref.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
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

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitStatus, setSubmitStatus] = useState<string>("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear any previous status when user starts typing
    if (submitStatus) {
      setSubmitStatus("");
    }
  };

  const validateForm = (): string[] => {
    const errors: string[] = [];

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errors.push("Name must be at least 2 characters long");
    }

    if (formData.name.trim().length > 100) {
      errors.push("Name must be less than 100 characters");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      errors.push("Please enter a valid email address");
    }

    if (!formData.message.trim() || formData.message.trim().length < 10) {
      errors.push("Message must be at least 10 characters long");
    }

    if (formData.message.trim().length > 1000) {
      errors.push("Message must be less than 1000 characters");
    }

    return errors;
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setSubmitStatus(
        `Please fix the following errors: ${validationErrors.join(", ")}`
      );
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("");

    try {
      const response = await axios.post("/api/contact", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data: ApiResponse = response.data;

      if (data.success) {
        setSubmitStatus(
          "Message sent successfully! You should receive a confirmation email shortly."
        );
        setFormData({
          name: "",
          email: "",
          message: "",
        });
      } else {
        let errorMessage =
          data.error || "Failed to send message. Please try again.";

        if (data.details && data.details.length > 0) {
          errorMessage += ` Details: ${data.details.join(", ")}`;
        }

        setSubmitStatus(errorMessage);
      }
    } catch (error) {
      console.error("Contact form submission error:", error);

      if (axios.isAxiosError(error)) {
        if (error.response) {
          const data = error.response.data;
          let errorMessage =
            data?.error || "Failed to send message. Please try again.";

          if (data?.details && data.details.length > 0) {
            errorMessage += ` Details: ${data.details.join(", ")}`;
          }

          setSubmitStatus(errorMessage);
        } else if (error.request) {
          setSubmitStatus(
            "Network error. Please check your connection and try again."
          );
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

  interface ContactClickParams {
    type: "leetcode" | "linkedin" | "github";
    value: string;
  }

  const handleContactClick1 = (
    type: ContactClickParams["type"],
    value: ContactClickParams["value"]
  ): void => {
    switch (type) {
      case "leetcode":
        window.open(`https://leetcode.com/u/${value}`, "_blank");
        break;
      case "linkedin":
        window.open(`https://linkedin.com/in/${value}`, "_blank");
        break;
      case "github":
        window.open(`https://github.com/${value}`, "_blank");
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    const tl = gsap.timeline();

    tl.from(".hero-greeting", {
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: "power2.out",
    })
      .from(
        ".hero-name",
        {
          opacity: 0,
          y: 40,
          duration: 1,
          ease: "power2.out",
        },
        "-=0.3"
      )
      .from(
        ".hero-typewriter",
        {
          opacity: 0,
          y: 30,
          duration: 0.8,
          ease: "power2.out",
        },
        "-=0.5"
      )
      .from(
        ".hero-description",
        {
          opacity: 0,
          y: 30,
          duration: 0.8,
          ease: "power2.out",
        },
        "-=0.3"
      )
      .fromTo(
  ".hero-button",
  {
    opacity: 0,
    y: 30,
    scale: 0.9,
  },
  {
    opacity: 1,
    y: 0,
    scale: 1,
    duration: 0.8,
    ease: "back.out(1.7)",
  },
  "-=0.3"
);

    gsap.fromTo(
      ".about-title",
      { opacity: 0, x: -100 },
      {
        opacity: 1,
        x: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".about-title",
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      }
    );

    gsap.fromTo(
      ".about-content",
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".about-content",
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      }
    );

    gsap.fromTo(
      ".about-image",
      { opacity: 0, scale: 0.8, rotation: -5 },
      {
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: 1.2,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: ".about-image",
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      }
    );

    gsap.fromTo(
      ".interest-tag",
      { opacity: 0, y: 20, scale: 0.8 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        ease: "back.out(1.7)",
        stagger: 0.1,
        scrollTrigger: {
          trigger: ".interest-tag",
          start: "top 90%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      }
    );

    gsap.fromTo(
      ".fact-item",
      { opacity: 0, x: -30 },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: "power2.out",
        stagger: 0.2,
        scrollTrigger: {
          trigger: ".fact-item",
          start: "top 90%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      }
    );

    gsap.fromTo(
      ".tech-title",
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".tech-title",
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      }
    );

    gsap.fromTo(
      ".tech-card",
      { opacity: 0, y: 60, scale: 0.9 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        ease: "back.out(1.7)",
        stagger: 0.2,
        scrollTrigger: {
          trigger: ".tech-card",
          start: "top 85%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      }
    );

    gsap.fromTo(
      ".tech-item",
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.05,
        scrollTrigger: {
          trigger: ".tech-item",
          start: "top 90%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      }
    );

    gsap.fromTo(
      ".projects-title",
      { opacity: 0, x: -100 },
      {
        opacity: 1,
        x: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".projects-title",
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      }
    );

    gsap.fromTo(
      ".project-card",
      { opacity: 0, y: 50, rotationY: -15 },
      {
        opacity: 1,
        y: 0,
        rotationY: 0,
        duration: 1,
        ease: "back.out(1.7)",
        stagger: 0.2,
        scrollTrigger: {
          trigger: ".project-card",
          start: "top 85%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      }
    );

    gsap.fromTo(
      ".contact-title",
      { opacity: 0, scale: 0.5 },
      {
        opacity: 1,
        scale: 1,
        duration: 1.2,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: ".contact-title",
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      }
    );

    gsap.to(".floating-dot", {
      y: -10,
      duration: 2,
      ease: "power2.inOut",
      yoyo: true,
      repeat: -1,
      stagger: 0.3,
    });

    const techIcons = document.querySelectorAll(".tech-icon");
    techIcons.forEach((icon) => {
      icon.addEventListener("mouseenter", () => {
        gsap.to(icon, {
          rotation: 360,
          duration: 0.8,
          ease: "power2.out",
        });
      });
    });

    const cards = document.querySelectorAll(".hover-card");
    cards.forEach((card) => {
      card.addEventListener("mouseenter", () => {
        gsap.to(card, {
          y: -8,
          scale: 1.02,
          duration: 0.3,
          ease: "power2.out",
        });
      });

      card.addEventListener("mouseleave", () => {
        gsap.to(card, {
          y: 0,
          scale: 1,
          duration: 0.3,
          ease: "power2.out",
        });
      });
    });

    const glowElements = document.querySelectorAll(".glow-on-hover");
    glowElements.forEach((element) => {
      element.addEventListener("mouseenter", () => {
        gsap.to(element, {
          boxShadow: "0 0 30px rgba(16, 185, 129, 0.5)",
          duration: 0.3,
          ease: "power2.out",
        });
      });

      element.addEventListener("mouseleave", () => {
        gsap.to(element, {
          boxShadow: "none",
          duration: 0.3,
          ease: "power2.out",
        });
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  interface FormData {
    name: string;
    email: string;
    message: string;
  }

 

  const techStackByCategory = {
    languages: [
      {
        title: "JavaScript",
        imgLink:
          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
      },
      {
        title: "TypeScript",
        imgLink:
          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
      },
      {
        title: "Python",
        imgLink:
          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
      },
      {
        title: "C",
        imgLink:
          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg",
      },
      {
        title: "C++",
        imgLink:
          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg",
      },
      {
        title: "Java",
        imgLink:
          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
      },
    ],

    frontend: [
      {
        title: "HTML5",
        imgLink:
          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
      },
      {
        title: "CSS3",
        imgLink:
          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
      },
      {
        title: "React",
        imgLink:
          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
      },
      {
        title: "Next.js",
        imgLink:
          "https://raw.githubusercontent.com/devicons/devicon/refs/heads/master/icons/nextjs/nextjs-line-wordmark.svg",
      },
      {
        title: "Tailwind",
        imgLink:
          "https://raw.githubusercontent.com/devicons/devicon/refs/heads/master/icons/tailwindcss/tailwindcss-original-wordmark.svg",
      },
      {
        title: "axios",
        imgLink:
          "https://raw.githubusercontent.com/devicons/devicon/refs/heads/master/icons/axios/axios-plain-wordmark.svg",
      },
    ],

    backend: [
      {
        title: "Node.js",
        imgLink:
          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
      },
      {
        title: "Express.js",
        imgLink:
          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg",
      },
      {
        title: "Prisma",
        imgLink:
          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prisma/prisma-original.svg",
      },
    ],

    databases: [
      {
        title: "MongoDB",
        imgLink:
          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
      },
      {
        title: "PostgreSQL",
        imgLink:
          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
      },
      {
        title: "MySQL",
        imgLink:
          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
      },
    ],
  };

  const Project = [
    {
      name: "ChatRTC",
      description:
        "A real-time chat application where users can sign up, log in, create chat rooms, and join others using room codes. Built with Express.js and JWT for authentication, and uses native WebSocket for real-time communication",
      hosted: true,
      githubLink: "https://github.com/lightyear256/Chat-RTC",
      hostedLink: "https://chat-rtc-three.vercel.app/",
    },
    {
      name: "Second-Brain",
      description:
        "Second Brain is a web app for saving and organizing important links like YouTube videos, tweets, and more. Users can sign up and log in using JWT-based authentication. It also allows creating a shareable version of your saved links to access or share your &apos;brain&apos; easily.",
      hosted: false,
      githubLink: "https://github.com/lightyear256/Second-Brain-App",
    },
    {
      name: "Geo-fence Attendance App",
      description:
        "Geo-Fence Attendance App built with Expo automates attendance using location-based check-ins via Expo Location and supports biometric/face authentication for two-step verification. It features JWT-based sign up/sign in, and shows detailed attendance reports. Backend is built with Express.js.",
      hosted: false,
      githubLink: "https://github.com/lightyear256/attendance-final",
    },
    {
      name: "Hand-Gesture Volume Controller ",
      description:
        "Hand-Gesture Volume Controller is a Python project that uses OpenCV and MediaPipe to control system volume by calculating the distance between the thumb and index finger in real-time hand tracking.",
      hosted: false,
      githubLink:
        "https://github.com/lightyear256/Hand-gesture-volume-controller",
    },
  ];

  const MyInterest = [
    "Web Development",
    "Competative Programmer",
    "Data Structure & Algorithms",
    "Problem Solving",
    "Badminton",
    "Swimming",
  ];

  const Facts = [
    "IIIT Dharwad Student",
    "Full-Stack Developer",
    "Competitive Programmer",
    "Tech Enthusiast",
  ];

  const categoryConfig = {
    languages: {
      title: "Programming Languages",
      gradient: "from-blue-500/20 to-cyan-500/20",
      border: "border-blue-500/30",
      glow: "shadow-blue-500/20",
      accent: "text-blue-400",
    },
    frontend: {
      title: "Frontend Technologies",
      gradient: "from-emerald-500/20 to-teal-500/20",
      border: "border-emerald-500/30",
      glow: "shadow-emerald-500/20",
      accent: "text-emerald-400",
    },
    backend: {
      title: "Backend Technologies",
      gradient: "from-purple-500/20 to-violet-500/20",
      border: "border-purple-500/30",
      glow: "shadow-purple-500/20",
      accent: "text-purple-400",
    },
    databases: {
      title: "Database Systems",
      gradient: "from-orange-500/20 to-red-500/20",
      border: "border-orange-500/30",
      glow: "shadow-orange-500/20",
      accent: "text-orange-400",
    },
  };
  return (
    <div className="text-white font-mono">
      <Header
        home={heroRef}
        about={aboutRef}
        techstack={techStackRef}
        contact={contactRef}
        project={projectsRef}
      />

      <section
        ref={heroRef}
        className="bg-gradient-to-br from-[#101c2c] to-slate-950 w-full min-h-screen flex justify-start items-center md:items-start p-15 pt-32 flex-col  gap-y-5 text-center md:text-left"
      >
        <div className="hero-greeting text-2xl text-emerald-500">
          Hi, my name is
        </div>
        <div className="hero-name text-5xl font-extrabold md:text-7xl">
          Ayushmaan Kumar.
        </div>
        <div className="hero-typewriter">
          <TypewriterEffect />
        </div>
        <div className="hero-description text-xl max-w-3xl">
          I build modern, responsive websites and have a strong foundation in
          Data Structures and Algorithms. I&apos;m always eager to explore new
          technologies and grow through hands-on learning.
        </div>
        <Link href={"https://www.linkedin.com/in/ayushmaan-kumar/"}>
          <button className="hero-button glow-on-hover text-emerald-500 border border-emerald-500 w-50 p-3 rounded-md cursor-pointer hover:bg-emerald-500 hover:text-black transition-all duration-300 transform hover:scale-105">
            Lets Connect
          </button>
        </Link>
      </section>

      <section
        ref={aboutRef}
        className="bg-gradient-to-br from-[#101c2c] to-slate-950 w-full min-h-screen flex justify-start p-15 flex-col text-left gap-y-7"
      >
        <div className="about-title text-5xl md:text-6xl font-bold text-emerald-500">
          About Me
        </div>
        <div className="about-content  flex flex-col gap-y-10 lg:flex-row md:gap-x-15 justify-start items-start">
          <div className="text-lg max-w-2xl text-center md:text-left">
            Hello, my name is Ayushmaan, and I&apos;m a student at IIIT Dharwad. I
            enjoy building websites. I actively practice Data Structures and
            Algorithms and take part in competitive programming. Exploring new
            technologies and improving my skills through hands-on experience
            keeps me motivated.
            <div className="mt-8 space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-emerald-400 mb-3">
                  What I&apos;m Working On
                </h3>
                <p className="text-gray-300">
                  Currently diving deep into full-stack development, I&apos;m
                  passionate about creating clean, efficient code and learning
                  emerging technologies in the web development space.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-emerald-400 mb-3">
                  My Interests
                </h3>
                <div className="flex flex-wrap gap-3">
                  {MyInterest.map((interest, idx) => (
                    <span
                      key={idx}
                      className="interest-tag px-4 py-2 bg-emerald-500/20 text-emerald-300 rounded-full text-sm border border-emerald-500/30 hover:bg-emerald-500/30 hover:scale-110 transition-all duration-300 cursor-pointer"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-emerald-400 mb-3">
                  Quick Facts
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Facts.map((fact, idx) => (
                    <div
                      key={idx}
                      className="fact-item flex items-center gap-3"
                    >
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      <span className="text-gray-300">{fact}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="about-image flex flex-col items-center mx-auto gap-6">
            <Image
              src="/assets/Ayushmaan_latest.jpg"
              alt="Ayushmaan Kumar"
              width={400}
              height={400}
              className="rounded-lg grayscale-100"
            />

            <div className="text-center">
              <div className="text-emerald-400 font-semibold text-lg">
                Always Learning
              </div>
              <div className="text-gray-400 text-sm mt-1">
                Coding • Creating • Competing
              </div>
            </div>

            <div className="flex gap-2 opacity-60">
              <div className="floating-dot w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
              <div
                className="floating-dot w-3 h-3 bg-emerald-400 rounded-full animate-pulse"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className="floating-dot w-3 h-3 bg-emerald-300 rounded-full animate-pulse"
                style={{ animationDelay: "0.4s" }}
              ></div>
            </div>
          </div>
        </div>
      </section>

      <section
        ref={techStackRef}
        className="bg-gradient-to-br from-[#101c2c] to-slate-950 w-full min-h-screen flex justify-start p-15 flex-col text-left gap-y-7"
      >
        <div className="tech-title">
          <h2 className="text-6xl font-bold text-emerald-500 mb-2">
            Tech Stack
          </h2>
          <p className="text-zinc-500 text-base">Technologies I work with</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto w-full">
          {Object.entries(techStackByCategory).map(([category, techs]) => {
            type CategoryKey = keyof typeof categoryConfig;
            const config = categoryConfig[category as CategoryKey];
            return (
              <div
                key={category}
                className="tech-card hover-card relative group"
              >
                <div
                  className={`absolute -inset-0.5 bg-gradient-to-r ${config.gradient} rounded-2xl blur opacity-20 group-hover:opacity-60 transition duration-500`}
                ></div>

                <div
                  className={`relative bg-gradient-to-br from-slate-900/90 to-black-950/90 backdrop-blur-sm rounded-2xl border ${config.border} p-6 h-full`}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div
                      className={`w-3 h-3 rounded-full bg-gradient-to-r ${config.gradient} animate-pulse`}
                    ></div>
                    <h3
                      className={`text-xl font-bold ${config.accent} uppercase tracking-wider`}
                    >
                      {config.title}
                    </h3>
                    <div className="flex-1 h-px bg-gradient-to-r from-zinc-700 to-transparent"></div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {techs.map((tech, index) => (
                      <div
                        key={index}
                        className="tech-item group/item relative"
                      >
                        <div
                          className={`absolute -inset-1 bg-gradient-to-r ${config.gradient} rounded-lg blur opacity-0 group-hover/item:opacity-30 transition duration-500`}
                        ></div>

                        <div className="relative flex flex-col lg:flex-row items-center gap-3 p-3 rounded-lg bg-zinc-800/30 backdrop-blur-sm border border-zinc-700/50 hover:border-zinc-600 hover:bg-zinc-800/50 transition-all duration-300 cursor-pointer group-hover/item:transform group-hover/item:scale-110 group-hover/item:shadow-lg">
                          <div className="w-8 h-8 flex-shrink-0 relative">
                            <Image
                              src={tech.imgLink}
                              alt={tech.title}
                              height={25}
                              width={25}
                              className="tech-icon w-full h-full object-contain opacity-80 group-hover/item:opacity-100 transition-opacity duration-300"
                            />
                            <div
                              className={`absolute -inset-1 border-2 border-transparent ${config.border} rounded-full opacity-0 group-hover/item:opacity-100 transition-opacity duration-300`}
                            ></div>
                          </div>
                          <span className="text-zinc-300 text-sm font-medium group-hover/item:text-white transition-colors duration-300">
                            {tech.title}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end mt-4">
                    <span className={`text-xs ${config.accent} opacity-60`}>
                      {techs.length} technologies
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section
        ref={projectsRef}
        className="bg-gradient-to-br from-[#101c2c] to-slate-950 w-full min-h-screen flex justify-start p-15 flex-col text-left gap-y-7"
      >
        <div className="projects-title text-6xl text-emerald-500">Project</div>
        <div className="flex flex-wrap gap-x-1 gap-y-1 justify-center xl:justify-start items-center">
          {Project.map((value, id) => (
            <div key={id} className="project-card">
              <Card value={value} />
            </div>
          ))}
        </div>
      </section>

      <section
        ref={contactRef}
        className="bg-gradient-to-br from-[#101c2c] to-slate-950 w-full min-h-screen flex justify-start p-15 flex-col text-left gap-y-7"
      >
        <div className="contact-title text-6xl text-emerald-500 mb-8">
          Contact Me
        </div>

        <div className="flex flex-col lg:flex-row gap-12 max-w-6xl mx-auto w-full">
          <div className="lg:w-1/2 space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Let&apos;s Connect!
              </h3>
              <p className="text-gray-300 text-lg leading-relaxed">
                I&apos;m always open to discussing new opportunities, interesting
                projects, or just having a chat about technology and
                development. Feel free to reach out!
              </p>
            </div>

            <div className="space-y-6">
              <div
                onClick={() => handleContactClick1("leetcode", "ayushmaan25")}
                className="hover-card glow-on-hover flex items-center gap-4 p-4 rounded-lg bg-slate-800/50 border border-slate-700 transition-all duration-300 cursor-pointer transform hover:scale-105"
              >
                <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center">
                  <svg
                    role="img"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="#34D399"
                  >
                    <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-semibold">Leetcode</h4>
                  <p className="text-gray-400">ayushmaan25</p>
                </div>
              </div>

              <div
                onClick={() =>
                  handleContactClick1("linkedin", "ayushmaan-kumar")
                }
                className="hover-card glow-on-hover flex items-center gap-4 p-4 rounded-lg bg-slate-800/50 border border-slate-700 transition-all duration-300 cursor-pointer transform hover:scale-105"
              >
                <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center">
                  <Linkedin className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-white font-semibold">LinkedIn</h4>
                  <p className="text-gray-400">ayushmaan-kumar</p>
                </div>
              </div>

              <div
                onClick={() => handleContactClick1("github", "lightyear256")}
                className="hover-card glow-on-hover flex items-center gap-4 p-4 rounded-lg bg-slate-800/50 border border-slate-700 transition-all duration-300 cursor-pointer transform hover:scale-105"
              >
                <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center">
                  <Github className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-white font-semibold">GitHub</h4>
                  <p className="text-gray-400">lightyear256</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-1/2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="glow-on-hover w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300"
                  placeholder="Your Name"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="glow-on-hover w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300"
                  placeholder="Your Email"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="glow-on-hover w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300 resize-none"
                  placeholder="Working on something cool? Let&apos;s chat!"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="glow-on-hover w-full px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Sending...
                  </span>
                ) : (
                  "Send Message"
                )}
              </button>

              {submitStatus && (
                <div
                  className={`p-4 rounded-lg ${
                    submitStatus.includes("success")
                      ? "bg-emerald-500/20 border border-emerald-500/30"
                      : "bg-red-500/20 border border-red-500/30"
                  }`}
                >
                  <p
                    className={`text-sm ${
                      submitStatus.includes("success")
                        ? "text-emerald-300"
                        : "text-red-300"
                    }`}
                  >
                    {submitStatus}
                  </p>
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      <footer className="bg-gradient-to-br from-slate-950 to-black border-t border-slate-800 font-mono">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold text-emerald-400 mb-4">
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
                  className="hover-card glow-on-hover text-gray-400 hover:text-emerald-400 transition-colors duration-300"
                >
                  <Github className="w-6 h-6" />
                </Link>
                <Link
                  href="https://www.linkedin.com/in/ayushmaan-kumar/"
                  className="hover-card glow-on-hover text-gray-400 hover:text-emerald-400 transition-colors duration-300"
                >
                  <Linkedin></Linkedin>
                </Link>
                <a
                  href="mailto:ayushmaan@example.com"
                  className="hover-card glow-on-hover text-gray-400 hover:text-emerald-400 transition-colors duration-300"
                >
                  <Mail></Mail>
                </a>
                <Link
                  href="https://leetcode.com/u/ayushmaan25/"
                  className="hover-card glow-on-hover text-gray-400 hover:text-emerald-400 transition-colors duration-300"
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
                    className="text-gray-400 hover:text-emerald-400 transition-colors duration-300"
                  >
                    About
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection(techStackRef)}
                    className="text-gray-400 hover:text-emerald-400 transition-colors duration-300"
                  >
                    Tech Stack
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection(projectsRef)}
                    className="text-gray-400 hover:text-emerald-400 transition-colors duration-300"
                  >
                    Projects
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection(contactRef)}
                    className="text-gray-400 hover:text-emerald-400 transition-colors duration-300"
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
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
          <div
            className="absolute top-3/4 right-1/4 w-1 h-1 bg-emerald-300 rounded-full animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>
      </footer>
    </div>
  );
}
