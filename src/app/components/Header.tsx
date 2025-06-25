import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

interface SectionRef {
 current: HTMLElement | null;
}

interface HeaderProps {
 home: SectionRef;
 about: SectionRef;
 techstack: SectionRef;
 project: SectionRef;
 contact: SectionRef;
}

export default function Header(props: HeaderProps) {
 const headerRef = useRef(null);
 const lastScrollY = useRef(0);
 const [isMenuOpen, setIsMenuOpen] = useState(false);

 useEffect(() => {
   const handleScroll = () => {
     const currentScrollY = window.scrollY;

     if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
       gsap.to(headerRef.current, {
         y: -100,
         duration: 0,
         ease: "power2.out",
       });
     } else if (
       currentScrollY < lastScrollY.current ||
       currentScrollY <= 100
     ) {
       gsap.to(headerRef.current, {
         y: 0,
         duration: 0,
         ease: "power2.out",
       });
     }

     lastScrollY.current = currentScrollY;
   };

   window.addEventListener("scroll", handleScroll, { passive: true });

   return () => {
     window.removeEventListener("scroll", handleScroll);
   };
 }, []);

 interface SectionRef {
   current: HTMLElement | null;
 }

 const scrollToSection = (ref: SectionRef) => {
   ref.current?.scrollIntoView({
     behavior: "smooth",
     block: "start",
   });
   setIsMenuOpen(false); 
 };

 return (
   <>
     <div
       ref={headerRef}
       className="fixed top-0 w-full h-20 bg-gradient-to-br from-[#101c2c] to-slate-950 text-white flex items-center justify-between p-4 sm:p-6 lg:p-10 font-mono z-50 transition-all duration-300"
     >
       <div
         className="text-xl sm:text-2xl text-emerald-400 cursor-pointer"
         onClick={() => scrollToSection(props.home)}
       >
         &lt;Ayushmaan Kumar/&gt;
       </div>
       
       <div className="justify-between hidden lg:flex items-center gap-x-8 text-lg font-mono">
         <div
           className="cursor-pointer hover:text-emerald-400 transition-colors duration-200"
           onClick={() => scrollToSection(props.home)}
         >
           Home
         </div>
         <div
           className="cursor-pointer hover:text-emerald-400 transition-colors duration-200"
           onClick={() => scrollToSection(props.about)}
         >
           About Me
         </div>
         <div
           className="cursor-pointer hover:text-emerald-400 transition-colors duration-200"
           onClick={() => scrollToSection(props.techstack)}
         >
           Tech Stack
         </div>
         <div
           className="cursor-pointer hover:text-emerald-400 transition-colors duration-200"
           onClick={() => scrollToSection(props.project)}
         >
           Projects
         </div>
         <div
           className="cursor-pointer hover:text-emerald-400 transition-colors duration-200"
           onClick={() => scrollToSection(props.contact)}
         >
           Contact me
         </div>
         <button
           onClick={() => {
             const link = document.createElement("a");
             link.href = "/resume.pdf"; 
             link.download = "Ayushmaan_Resume.pdf"; 
             document.body.appendChild(link);
             link.click();
             document.body.removeChild(link);
           }}
           className="border border-teal-500 p-2 px-4 rounded-md cursor-pointer text-teal-500 hover:bg-teal-500 hover:text-slate-900 transition-all duration-200"
         >
           Resume
         </button>
       </div>

       <button
         onClick={() => setIsMenuOpen(!isMenuOpen)}
         className="lg:hidden flex flex-col gap-1 p-2"
       >
         <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
         <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
         <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
       </button>
     </div>

     {isMenuOpen && (
       <div className="fixed top-20 left-0 w-full bg-gradient-to-br from-[#101c2c] to-slate-950 text-white lg:hidden z-40 font-mono">
         <div className="flex flex-col p-6 space-y-4">
           <div
             className="cursor-pointer hover:text-emerald-400 transition-colors duration-200 py-2"
             onClick={() => scrollToSection(props.home)}
           >
             Home
           </div>
           <div
             className="cursor-pointer hover:text-emerald-400 transition-colors duration-200 py-2"
             onClick={() => scrollToSection(props.about)}
           >
             About Me
           </div>
           <div
             className="cursor-pointer hover:text-emerald-400 transition-colors duration-200 py-2"
             onClick={() => scrollToSection(props.techstack)}
           >
             Tech Stack
           </div>
           <div
             className="cursor-pointer hover:text-emerald-400 transition-colors duration-200 py-2"
             onClick={() => scrollToSection(props.project)}
           >
             Projects
           </div>
           <div
             className="cursor-pointer hover:text-emerald-400 transition-colors duration-200 py-2"
             onClick={() => scrollToSection(props.contact)}
           >
             Contact me
           </div>
           <button
             onClick={() => {
               const link = document.createElement("a");
               link.href = "/resume.pdf"; 
               link.download = "Ayushmaan_Resume.pdf"; 
               document.body.appendChild(link);
               link.click();
               document.body.removeChild(link);
               setIsMenuOpen(false);
             }}
             className="border border-teal-500 p-2 px-4 rounded-md cursor-pointer text-teal-500 hover:bg-teal-500 hover:text-slate-900 transition-all duration-200 self-start"
           >
             Resume
           </button>
         </div>
       </div>
     )}
   </>
 );
}