import { CodeXml, ExternalLink, Github, ArrowUpRight } from "lucide-react";
import Link from "next/link";

type CardProps = {
  value: {
    name: string;
    description: string;
    githubLink?: string;
    hosted: boolean;
    hostedLink?: string;
    techStack: Array<string>;
  };
};

export default function Card({ value }: CardProps) {
  return (
    <div
      className="group relative w-[340px] flex flex-col gap-5 rounded-2xl p-7 transition-all duration-300"
      style={{
        background: "var(--navy, #0d1526)",
        border: "1px solid rgba(255,255,255,0.07)",
        minHeight: "280px",
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(200,245,66,0.3)";
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 20px 60px rgba(0,0,0,0.3)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.07)";
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
      }}
    >
      <div className="flex items-center justify-between">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ background: "rgba(200,245,66,0.08)", color: "#c8f542" }}
        >
          <CodeXml size={20} />
        </div>
        <div className="flex items-center gap-3">
          {value.githubLink && (
            <Link href={value.githubLink} target="_blank" rel="noopener noreferrer">
              <div
                className="w-8 h-8 flex items-center justify-center rounded-md transition-all duration-200 hover:bg-white/10"
                style={{ color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <Github size={15} />
              </div>
            </Link>
          )}
          {value.hosted && value.hostedLink && (
            <Link href={value.hostedLink} target="_blank" rel="noopener noreferrer">
              <div
                className="w-8 h-8 flex items-center justify-center rounded-md transition-all duration-200 hover:bg-white/10"
                style={{ color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <ExternalLink size={15} />
              </div>
            </Link>
          )}
        </div>
      </div>

      <div>
        <h3
          className="text-lg font-bold mb-2 flex items-center gap-2 group-hover:text-white transition-colors"
          style={{ fontFamily: "'Syne', sans-serif", color: "#e8f0f8" }}
        >
          {value.name}
          <ArrowUpRight
            size={14}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ color: "#c8f542" }}
          />
        </h3>
        <p className="text-sm leading-relaxed" style={{ color: "#8899aa" }}>
          {value.description}
        </p>
      </div>

      <div className="flex-1" />

      <div className="flex flex-wrap gap-2">
        {value.techStack.map((tech, i) => (
          <span
            key={i}
            className="px-3 py-1 rounded-full text-xs font-medium"
            style={{
              background: "rgba(200,245,66,0.07)",
              border: "1px solid rgba(200,245,66,0.18)",
              color: "#c8f542",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}
