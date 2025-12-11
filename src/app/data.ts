export const techStackByCategory = {
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

export const Project = [
    {
  "name": "Forge",
  "description": "Forge is a simple online code editor that supports writing and executing programs in C, C++, Python, JavaScript, Rust, Ruby, and Java. It runs code through a backend execution system that queues jobs using BullMQ and processes them inside isolated Docker environments. The platform provides a clean, minimal interface with syntax highlighting and fast feedback for quick code testing and learning.",
  "hosted": true,
  // "githubLink": "https://github.com/lightyear256/Forge",
  "hostedLink": "https://forge.ayushmaan.tech/",
  "techStack": [
    "Next.js",
    "TypeScript",
    "Node.js",
    "Express.js",
    "BullMQ",
    "Redis",
    "Docker (language-specific runtimes)",
    "Monaco Editor",
    "Tailwind CSS"
  ]
},


    {
  "name": "HomeQuest",
  "description": "A lightweight real-estate CRM application for managing clients and deals. It provides secure authentication, client registration, deal tracking, and robust backend validation, with server-side rendering on the home page for SEO.",
  "hosted": true,
  "githubLink": "https://github.com/lightyear256/Home-Quest",
  "hostedLink": "https://home-quest-azure.vercel.app/",
  "techStack": [
    "Next.js",
    "Express.js",
    "TypeScript",
    "Prisma",
    "PostgreSQL",
    "JWT (JSON Web Token)",
    "Zod",
    "Tailwind CSS",
    "Multer"
  ]
}
,{
  name: "PropSnap",
  description: "A modern real estate platform with property browsing, listing, search, and management, featuring secure authentication, detailed listings, and robust data validation.",
  hosted: true,
  githubLink: "https://github.com/lightyear256/PropSnap",
  hostedLink: "https://prop-snap-flame.vercel.app/",
  techStack: [
    "Next.js",
    "Express.js", 
    "TypeScript",
    "Prisma",
    "PostgreSQL",
    "JWT (JSON Web Token)",
    "Zod",
    "Tailwind CSS",
    "Multer"
  ],
},
    {
      name: "ChatRTC",
      description:
        "A real-time chat application where users can sign up, log in, create chat rooms, and join others using room codes. Built with Express.js and JWT for authentication, and uses native WebSocket for real-time communication",
      hosted: true,
      githubLink: "https://github.com/lightyear256/Chat-RTC",
      hostedLink: "https://chat-rtc-three.vercel.app/",
      techStack: [
        "React.js",
        "Node.js",
        "Express.js",
        "JWT (JSON Web Token)",
        "WebSocket (native)",
        "MongoDB",
      ],
    },
    {
      name: "Second-Brain",
      description:
        "Second Brain is a web app to save and organize important links like YouTube videos and tweets. It features JWT-based authentication and lets users create a shareable version of their saved content — their own 'brain'.",
      hosted: false,
      githubLink: "https://github.com/lightyear256/Second-Brain-App",
      techStack:[
  "React.js",
  "Node.js",
  "Express.js",
  "JWT (JSON Web Token)",
  "MongoDB"
]
    },
    {
      name: "Geo-fence Attendance App",
      description:
        "Geo-Fence Attendance App automates check-ins using location and biometric/face verification. Built with Expo and Express.js, it features JWT auth and detailed attendance reports.",
      hosted: false,
      githubLink: "https://github.com/lightyear256/attendance-final",
      techStack:[
  "React Native (Expo)",
  "Express.js",
  "Node.js",
  "JWT (JSON Web Token)",
  "MongoDB",
  "Expo Location",
  "Expo Local Authentication"
]

    },
    {
      name: "Hand-Gesture Volume Controller ",
      description:
        "Hand-Gesture Volume Controller is a Python project that uses OpenCV and MediaPipe to control system volume by calculating the distance between the thumb and index finger in real-time hand tracking.",
      hosted: false,
      githubLink:
        "https://github.com/lightyear256/Hand-gesture-volume-controller",
      techStack:[
  "Python",
  "OpenCV",
  "MediaPipe",
  "PyCaw"
]

    },
  ];

export const MyInterest = [
    "Web Development",
    "Competative Programmer",
    "Data Structure & Algorithms",
    "Problem Solving",
    "Badminton",
    "Swimming",
  ];

  export const Facts = [
    "IIIT Dharwad Student",
    "Full-Stack Developer",
    "Competitive Programmer",
    "Tech Enthusiast",
  ];

  export const categoryConfig = {
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