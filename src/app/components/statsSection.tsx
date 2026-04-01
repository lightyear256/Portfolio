"use client";
import { useEffect, useCallback, useState } from "react";

const GH = "lightyear256";
const LC = "ayushmaan25";

const GH_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN ?? "";

function ghFetch(url: string) {
  const headers: Record<string, string> = { Accept: "application/vnd.github+json" };
  if (GH_TOKEN) headers["Authorization"] = `Bearer ${GH_TOKEN}`;
  return fetch(url, { headers });
}

const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178c6", JavaScript: "#f7df1e", Python: "#3572A5",
  "C++": "#f34b7d", C: "#555555", Java: "#b07219", Go: "#00ADD8",
  Rust: "#dea584", HTML: "#e34c26", CSS: "#563d7c", Shell: "#89e051",
  Kotlin: "#A97BFF", Swift: "#F05138", Ruby: "#701516", Dart: "#00B4AB",
};

interface GHData {
  stars: number; forks: number; repos: number; followers: number;
  streak: number; pushes: number[];
  topLangs: { name: string; pct: number; color: string }[];
}
interface LCData {
  solved: number; easy: number; medium: number; hard: number;
  totalEasy: number; totalMedium: number; totalHard: number;
  ranking: number; acceptanceRate: number;
  contributionPoint: number;
  calendar: Record<string, number>;
}

function Sk({ w = "w-full", h = "h-3" }: { w?: string; h?: string }) {
  return <div className={`${w} ${h} rounded-md bg-white/5 animate-pulse`} />;
}

function ErrMsg({ msg }: { msg: string }) {
  return <p className="text-xs text-red-400 leading-relaxed">{msg}</p>;
}

function RateLimitMsg() {
  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-xs text-amber-400 font-semibold">⚠ GitHub API rate limit reached</p>
      <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
        Resets in ~1 hour. Add{" "}
        <code className="text-xs bg-white/5 px-1 py-0.5 rounded">NEXT_PUBLIC_GITHUB_TOKEN</code>
        {" "}to .env.local to fix permanently.
      </p>
    </div>
  );
}

function Label({ children }: { children: string }) {
  return (
    <p className="text-[0.6rem] tracking-[0.22em] uppercase font-semibold mb-3"
      style={{ color: "var(--muted)" }}>
      {children}
    </p>
  );
}

function PBadge({ platform, user, color }: { platform: string; user: string; color: string }) {
  return (
    <div className="flex items-center gap-2 min-w-0">
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ background: color, boxShadow: `0 0 8px ${color}88` }} />
      <span className="font-extrabold text-[0.68rem] tracking-[0.18em] uppercase flex-shrink-0"
        style={{ fontFamily: "'Syne', sans-serif", color }}>
        {platform}
      </span>
      <span className="ml-auto text-[0.62rem] font-mono truncate min-w-0"
        style={{ color: "var(--muted)" }}>
        {user}
      </span>
    </div>
  );
}

function StatRow({ label, value, accent = false }: { label: string; value: string | number; accent?: boolean }) {
  return (
    <div className="flex justify-between items-center gap-3 py-2 border-b border-white/[0.04]">
      <span className="text-[0.77rem]" style={{ color: "var(--muted)" }}>{label}</span>
      <span className="text-[0.84rem] font-bold" style={{
        fontFamily: "'Syne', sans-serif",
        color: accent ? "var(--lime)" : "var(--text)",
      }}>
        {value}
      </span>
    </div>
  );
}

function SectionDivider({ icon, title, handle, color }: {
  icon: React.ReactNode; title: string; handle: string; color: string;
}) {
  return (
    <div className="flex items-center gap-2.5 mb-5 min-w-0">
      <span className="flex-shrink-0">{icon}</span>
      <span className="font-extrabold text-[0.9rem] tracking-wide flex-shrink-0"
        style={{ fontFamily: "'Syne', sans-serif", color: "var(--text)" }}>
        {title}
      </span>
      <div className="flex-1 h-px mx-2 min-w-[8px]" style={{ background: "rgba(255,255,255,0.05)" }} />
      <span className="text-[0.65rem] font-mono flex-shrink-0 max-w-[40%] truncate px-2.5 py-0.5 rounded-full"
        style={{ color, background: `${color}18`, border: `1px solid ${color}30` }}>
        {handle}
      </span>
    </div>
  );
}

function ActivityGrid({ data }: { data: number[] }) {
  const max = Math.max(...data, 1);
  return (
    <div>
      <Label>push activity · last 24 weeks</Label>
      <div className="flex items-end gap-[3px] h-14">
        {data.map((v, i) => {
          const alpha = v === 0 ? 0.1 : 0.2 + (v / max) * 0.8;
          const heightPct = Math.max(v === 0 ? 8 : 14, (v / max) * 100);
          return (
            <div key={i} title={`Week ${i + 1}: ${v} pushes`}
              className="flex-1 min-w-0 rounded-t-[3px] transition-all duration-700"
              style={{ height: `${heightPct}%`, background: `rgba(200,245,66,${alpha})` }} />
          );
        })}
      </div>
      <div className="flex justify-between mt-1.5">
        <span className="text-[0.58rem]" style={{ color: "var(--muted)" }}>24 wks ago</span>
        <span className="text-[0.58rem]" style={{ color: "var(--muted)" }}>now</span>
      </div>
    </div>
  );
}

function LangChart({ langs }: { langs: GHData["topLangs"] }) {
  return (
    <div className="min-w-0">
      <Label>top languages by usage</Label>
      <div className="flex h-1.5 rounded-full overflow-hidden gap-[2px] mb-4">
        {langs.map((l, i) => (
          <div key={i} title={`${l.name} ${l.pct.toFixed(1)}%`}
            className="min-w-[3px] transition-all duration-1000"
            style={{ flex: l.pct, background: l.color }} />
        ))}
      </div>
      <div className="grid gap-x-6 gap-y-2.5"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))" }}>
        {langs.map((l) => (
          <div key={l.name} className="min-w-0">
            <div className="flex justify-between mb-1 gap-1.5">
              <span className="text-[0.72rem] flex items-center gap-1.5 min-w-0 truncate"
                style={{ color: "var(--muted)" }}>
                <span className="w-2 h-2 rounded-sm flex-shrink-0 inline-block"
                  style={{ background: l.color }} />
                <span className="truncate">{l.name}</span>
              </span>
              <span className="text-[0.72rem] font-semibold flex-shrink-0"
                style={{ color: "var(--text)" }}>
                {l.pct.toFixed(1)}%
              </span>
            </div>
            <div className="h-[3px] rounded-full overflow-hidden"
              style={{ background: "rgba(255,255,255,0.06)" }}>
              <div className="h-full rounded-full transition-all duration-1000"
                style={{ width: `${l.pct}%`, background: l.color }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LCDonut({ easy, medium, hard, solved, totalEasy, totalMedium, totalHard }: {
  easy: number; medium: number; hard: number; solved: number;
  totalEasy: number; totalMedium: number; totalHard: number;
}) {
  const r = 44, cx = 52, cy = 52, sw = 8;
  const circ = 2 * Math.PI * r;
  const total = easy + medium + hard || 1;
  const segs = [
    { val: easy,   color: "#4ade80", label: "Easy",   tot: totalEasy },
    { val: medium, color: "#f59e0b", label: "Medium", tot: totalMedium },
    { val: hard,   color: "#ef4444", label: "Hard",   tot: totalHard },
  ];
  let off = 0;
  const arcs = segs.map((s) => {
    const dash = (s.val / total) * circ;
    const a = { ...s, dash, gap: circ - dash, off };
    off += dash;
    return a;
  });

  return (
    <div className="flex flex-wrap items-center gap-5 min-w-0">
      <div className="relative flex-shrink-0" style={{ width: 104, height: 104 }}>
        <svg width="104" height="104" style={{ transform: "rotate(-90deg)" }}>
          <circle cx={cx} cy={cy} r={r} fill="none"
            stroke="rgba(255,255,255,0.05)" strokeWidth={sw} />
          {arcs.map((a, i) => (
            <circle key={i} cx={cx} cy={cy} r={r} fill="none"
              stroke={a.color} strokeWidth={sw}
              strokeDasharray={`${a.dash} ${a.gap}`}
              strokeDashoffset={-a.off}
              style={{ transition: "stroke-dasharray .9s ease" }}
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-extrabold leading-none"
            style={{ fontFamily: "'Syne',sans-serif", color: "var(--lime)" }}>
            {solved}
          </span>
          <span className="text-[0.48rem] tracking-[0.14em] uppercase mt-0.5"
            style={{ color: "var(--muted)" }}>
            solved
          </span>
        </div>
      </div>
      <div className="flex-1 flex flex-col gap-2.5 min-w-0" style={{ minWidth: 110 }}>
        {arcs.map((a) => (
          <div key={a.label} className="flex items-center gap-2 min-w-0">
            <div className="w-[7px] h-[7px] rounded-sm flex-shrink-0"
              style={{ background: a.color }} />
            <span className="text-[0.72rem] flex-1 min-w-0"
              style={{ color: "var(--muted)" }}>{a.label}</span>
            <span className="text-[0.78rem] font-bold flex-shrink-0"
              style={{ color: "var(--text)" }}>{a.val}</span>
            <span className="text-[0.62rem] flex-shrink-0 w-9 text-left"
              style={{ color: "var(--muted)" }}>/{a.tot}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function LCHeatmap({ calendar }: { calendar: Record<string, number> }) {
  const WEEKS = 15;
  const DAYS  = WEEKS * 7;
  const nowSec        = Math.floor(Date.now() / 1000);
  const todayMidnight = nowSec - (nowSec % 86400);

  const cells: { count: number; label: string }[] = [];
  for (let i = DAYS - 1; i >= 0; i--) {
    const dayMidnight = todayMidnight - i * 86400;
    const count = calendar[String(dayMidnight)] ?? 0;
    const d = new Date(dayMidnight * 1000);
    cells.push({
      count,
      label: `${d.toLocaleDateString("en-US", { month: "short", day: "numeric" })}: ${count} submissions`,
    });
  }

  const weeks: typeof cells[] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  const maxCount = Math.max(...cells.map((c) => c.count), 1);
  const alpha = (c: number) => (c === 0 ? 0.07 : 0.18 + (c / maxCount) * 0.82);
  const dayLabels = ["S", "M", "T", "W", "T", "F", "S"];

  return (
    <div className="flex flex-col items-center gap-3">
      <Label>{`submission activity · ${WEEKS} weeks`}</Label>
      <div className="flex gap-0 mx-auto">
        <div className="flex flex-col gap-[3px] mr-1.5 pt-px">
          {dayLabels.map((d, i) => (
            <div key={i} className="w-2.5 h-3 flex items-center text-[0.52rem]"
              style={{ color: "var(--muted)" }}>
              {d}
            </div>
          ))}
        </div>
        <div className="flex gap-[3px]">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {week.map((day, di) => (
                <div key={di} title={day.label}
                  className="flex-shrink-0 transition-colors duration-300"
                  style={{
                    width:        day.count === 0 ? "10px" : "12px",
                    height:       day.count === 0 ? "10px" : "12px",
                    margin:       day.count === 0 ? "1px"  : "0px",
                    borderRadius: "3px",
                    background:   day.count === 0
                      ? "rgba(255,255,255,0.04)"
                      : `rgba(245,158,11,${alpha(day.count)})`,
                  }} />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-center gap-1.5">
        <span className="text-[0.58rem]" style={{ color: "var(--muted)" }}>Less</span>
        {[0.04, 0.25, 0.45, 0.65, 0.9].map((o, i) => (
          <div key={i} className="w-2.5 h-2.5 rounded-sm" style={{
            background: o === 0.04 ? "rgba(255,255,255,0.04)" : `rgba(245,158,11,${o})`,
          }} />
        ))}
        <span className="text-[0.58rem]" style={{ color: "var(--muted)" }}>More</span>
      </div>
    </div>
  );
}

function calcAcceptanceRate(d: any): number {
  try {
    const acAll  = d?.matchedUserStats?.acSubmissionNum?.find((x: any) => x.difficulty === "All");
    const totAll = d?.matchedUserStats?.totalSubmissionNum?.find((x: any) => x.difficulty === "All")
                ?? d?.totalSubmissions?.find((x: any) => x.difficulty === "All");
    if (acAll && totAll && totAll.submissions > 0) return (acAll.submissions / totAll.submissions) * 100;
    if (typeof d?.acceptanceRate === "number") return d.acceptanceRate;
    if (typeof d?.acceptanceRate === "string") return parseFloat(d.acceptanceRate);
  } catch {}
  return 0;
}

function parseLCData(d: any): LCData {
  const calendar: Record<string, number> =
    typeof d.submissionCalendar === "string"
      ? JSON.parse(d.submissionCalendar)
      : (d.submissionCalendar ?? {});
  return {
    solved: d.totalSolved ?? 0, easy: d.easySolved ?? 0,
    medium: d.mediumSolved ?? 0, hard: d.hardSolved ?? 0,
    totalEasy: d.totalEasy ?? 935, totalMedium: d.totalMedium ?? 2033, totalHard: d.totalHard ?? 920,
    ranking: d.ranking ?? 0, acceptanceRate: calcAcceptanceRate(d),
    contributionPoint: d.contributionPoint ?? 0, calendar,
  };
}

const CARD = "rounded-[20px] p-[22px] border border-white/[0.07] min-w-0 overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(0,0,0,0.38)]";

export default function StatsSection() {
  const [gh, setGh]       = useState<GHData | null>(null);
  const [lc, setLc]       = useState<LCData | null>(null);
  const [ghL, setGhL]     = useState(true);
  const [lcL, setLcL]     = useState(true);
  const [ghErr, setGhErr] = useState<string | null>(null);
  const [ghRL, setGhRL]   = useState(false);
  const [lcErr, setLcErr] = useState<string | null>(null);
  const [ts, setTs]       = useState<Date | null>(null);
  const [spin, setSpin]   = useState(false);

  const fetchGH = useCallback(async () => {
    setGhL(true); setGhErr(null); setGhRL(false);
    try {
      const [uRes, rRes, eRes] = await Promise.all([
        ghFetch(`https://api.github.com/users/${GH}`),
        ghFetch(`https://api.github.com/users/${GH}/repos?per_page=100&sort=updated`),
        ghFetch(`https://api.github.com/users/${GH}/events/public?per_page=100`),
      ]);
      if (uRes.status === 403 || uRes.status === 429) {
        const body = await uRes.json().catch(() => ({}));
        if (body?.message?.includes("rate limit")) { setGhRL(true); setGhL(false); return; }
      }
      if (!uRes.ok) throw new Error(`GitHub user not found (${uRes.status})`);
      const user: any    = await uRes.json();
      const repos: any[] = rRes.ok ? await rRes.json() : [];
      const events: any[] = eRes.ok ? await eRes.json() : [];

      const stars = repos.reduce((s, r) => s + (r.stargazers_count || 0), 0);
      const forks = repos.reduce((s, r) => s + (r.forks_count    || 0), 0);

      const langBytes: Record<string, number> = {};
      await Promise.allSettled(repos.slice(0, 15).map(async (r) => {
        try {
          const res = await ghFetch(r.languages_url);
          if (!res.ok) return;
          const langs: Record<string, number> = await res.json();
          Object.entries(langs).forEach(([k, v]) => { langBytes[k] = (langBytes[k] || 0) + v; });
        } catch {}
      }));
      const totalBytes = Object.values(langBytes).reduce((a, b) => a + b, 0) || 1;
      const topLangs = Object.entries(langBytes)
        .sort(([, a], [, b]) => b - a).slice(0, 6)
        .map(([name, bytes]) => ({
          name, pct: (bytes / totalBytes) * 100,
          color: LANG_COLORS[name] || "#c8f542",
        }));

      const pushes = Array(24).fill(0);
      const now = Date.now();
      events.forEach((e) => {
        if (e.type !== "PushEvent") return;
        const w = Math.floor((now - new Date(e.created_at).getTime()) / (7 * 24 * 60 * 60 * 1000));
        if (w >= 0 && w < 24) pushes[23 - w] += (e.payload?.commits?.length || 1);
      });

      const pushDays = new Set(
        events.filter((e) => e.type === "PushEvent")
          .map((e) => new Date(e.created_at).toDateString())
      );
      let streak = 0;
      for (let i = 0; i < 30; i++) {
        const d = new Date(); d.setDate(d.getDate() - i);
        if (pushDays.has(d.toDateString())) streak++; else break;
      }
      setGh({ stars, forks, repos: user.public_repos, followers: user.followers, streak, pushes, topLangs });
    } catch (e: any) {
      setGhErr(e.message || "GitHub unavailable");
    } finally { setGhL(false); }
  }, []);

  const fetchLC = useCallback(async () => {
    setLcL(true); setLcErr(null);
    try {
      const res = await fetch(`https://alfa-leetcode-api.onrender.com/userProfile/${LC}`);
      if (res.ok) {
        const d = await res.json();
        if (d && (d.totalSolved !== undefined || d.easySolved !== undefined)) {
          setLc(parseLCData(d)); setLcL(false); return;
        }
      }
    } catch {}
    try {
      const res = await fetch(`https://leetcode-stats-api.herokuapp.com/${LC}`);
      if (!res.ok) throw new Error("Both LeetCode APIs unavailable");
      const d = await res.json();
      if (d?.status === "error") throw new Error(d.message || "LeetCode user not found");
      setLc(parseLCData(d));
    } catch (e: any) {
      setLcErr(e.message || "LeetCode data temporarily unavailable");
    } finally { setLcL(false); }
  }, []);

  const fetchAll = useCallback(async () => {
    setSpin(true);
    await Promise.all([fetchGH(), fetchLC()]);
    setTs(new Date());
    setTimeout(() => setSpin(false), 700);
  }, [fetchGH, fetchLC]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const GhIcon = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--lime)">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12"/>
    </svg>
  );
  const LcIcon = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b">
      <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z"/>
    </svg>
  );

  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
        .s-spin { animation: spin .7s linear }

        .stats-grid-gh {
          display: grid;
          gap: 14px;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          grid-template-areas: "overview activity" "languages languages";
        }
        .stats-grid-lc {
          display: grid;
          gap: 14px;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          grid-template-areas: "problems stats" "heatmap heatmap";
        }

        @media (max-width: 640px) {
          .stats-grid-gh {
            grid-template-columns: 1fr;
            grid-template-areas: "overview" "activity" "languages";
          }
          .stats-grid-lc {
            grid-template-columns: 1fr;
            grid-template-areas: "problems" "stats" "heatmap";
          }
          .heatmap-card {
            max-width: 100% !important;
            margin-left: 0 !important;
            margin-right: 0 !important;
          }
        }
      `}</style>

      <div className="flex items-center justify-between mb-9 gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ background: "var(--lime)", boxShadow: "0 0 8px rgba(200,245,66,.6)" }} />
          <span className="text-[0.58rem] tracking-[0.22em] uppercase font-semibold flex-shrink-0"
            style={{ color: "var(--lime)" }}>Live</span>
          {ts && (
            <span className="text-[0.6rem] truncate min-w-0" style={{ color: "var(--muted)" }}>
              · updated {ts.toLocaleTimeString()}
            </span>
          )}
        </div>
        <button
          onClick={fetchAll}
          className="flex items-center gap-1.5 flex-shrink-0 px-4 py-1.5 rounded-lg text-[0.68rem] font-bold tracking-[0.1em] cursor-pointer transition-colors duration-200"
          style={{
            background: "rgba(200,245,66,0.07)", border: "1px solid rgba(200,245,66,0.18)",
            color: "var(--lime)", fontFamily: "'Syne',sans-serif",
          }}
          onMouseEnter={e => (e.currentTarget.style.background = "rgba(200,245,66,0.14)")}
          onMouseLeave={e => (e.currentTarget.style.background = "rgba(200,245,66,0.07)")}
        >
          <svg className={spin ? "s-spin" : ""} width="13" height="13" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 0 1 15-6.7L21 8M21 12a9 9 0 0 1-15 6.7L3 16" />
            <polyline points="21 8 21 3 16 3" /><polyline points="3 16 3 21 8 21" />
          </svg>
          Refetch
        </button>
      </div>

      <SectionDivider title="GitHub" handle={GH} color="var(--lime)" icon={GhIcon} />

      <div className="stats-grid-gh mb-10">
        <div className={CARD} style={{ gridArea: "overview", background: "var(--navy)" }}>
          <PBadge platform="Overview" user={GH} color="var(--lime)" />
          <div className="mt-4">
            {ghL  ? <div className="flex flex-col gap-2.5">{Array(5).fill(0).map((_, i) => <Sk key={i} h="h-5" />)}</div>
            : ghRL ? <RateLimitMsg />
            : ghErr ? <ErrMsg msg={ghErr} />
            : gh && <>
                <StatRow label="Public repos" value={gh.repos} />
                <StatRow label="Stars earned"  value={gh.stars}        accent />
                <StatRow label="Total forks"   value={gh.forks} />
                <StatRow label="Followers"     value={gh.followers} />
                <StatRow label="Push streak"   value={`${gh.streak}d`} accent />
              </>}
          </div>
        </div>

        <div className={CARD} style={{ gridArea: "activity", background: "var(--navy)" }}>
          <PBadge platform="Activity" user={GH} color="var(--lime)" />
          <div className="mt-4">
            {ghL  ? <Sk h="h-14" />
            : ghRL ? <RateLimitMsg />
            : ghErr ? <ErrMsg msg={ghErr} />
            : gh && <ActivityGrid data={gh.pushes} />}
          </div>
        </div>

        <div className={CARD} style={{ gridArea: "languages", background: "var(--navy)" }}>
          <PBadge platform="Languages" user={GH} color="var(--lime)" />
          <div className="mt-4">
            {ghL  ? <div className="flex flex-col gap-2.5"><Sk h="h-1.5" />{Array(4).fill(0).map((_, i) => <Sk key={i} h="h-4" />)}</div>
            : ghRL ? <RateLimitMsg />
            : ghErr ? <ErrMsg msg={ghErr} />
            : gh && <LangChart langs={gh.topLangs} />}
          </div>
        </div>
      </div>

      <div className="h-px mb-9"
        style={{ background: "linear-gradient(to right,transparent,rgba(255,255,255,0.06),transparent)" }} />

      <SectionDivider title="LeetCode" handle={LC} color="#f59e0b" icon={LcIcon} />

      <div className="stats-grid-lc">
        <div className={CARD} style={{ gridArea: "problems", background: "var(--navy)" }}>
          <PBadge platform="Problems" user={LC} color="#f59e0b" />
          <div className="mt-4">
            {lcL ? (
              <div className="flex flex-wrap gap-4">
                <Sk w="w-[104px]" h="h-[104px]" />
                <div className="flex-1 flex flex-col gap-2.5 min-w-[100px]">
                  <Sk h="h-4" /><Sk h="h-4" /><Sk h="h-4" />
                </div>
              </div>
            ) : lcErr ? <ErrMsg msg={lcErr} />
              : lc && <LCDonut easy={lc.easy} medium={lc.medium} hard={lc.hard}
                  solved={lc.solved} totalEasy={lc.totalEasy}
                  totalMedium={lc.totalMedium} totalHard={lc.totalHard} />}
          </div>
        </div>

        <div className={CARD} style={{ gridArea: "stats", background: "var(--navy)" }}>
          <PBadge platform="Stats" user={LC} color="#f59e0b" />
          <div className="mt-4">
            {lcL ? <div className="flex flex-col gap-2.5">{Array(4).fill(0).map((_, i) => <Sk key={i} h="h-5" />)}</div>
            : lcErr ? <ErrMsg msg={lcErr} />
            : lc && <>
                <StatRow label="Global rank"     value={lc.ranking > 0 ? `#${lc.ranking.toLocaleString()}` : "—"} />
                <StatRow label="Acceptance rate" value={lc.acceptanceRate > 0 ? `${lc.acceptanceRate.toFixed(2)}%` : "—"} accent />
                <StatRow label="Total solved"    value={lc.solved} />
                <StatRow label="Contribution pts" value={lc.contributionPoint > 0 ? lc.contributionPoint.toLocaleString() : "—"} accent />
              </>}
          </div>
        </div>

        <div
          className={CARD + " heatmap-card flex flex-col items-center"}
          style={{
            gridArea: "heatmap",
            background: "var(--navy)",
            alignSelf: "start",
            maxWidth: "fit-content",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <div className="w-full">
            <PBadge platform="Heatmap" user={LC} color="#f59e0b" />
          </div>
          <div className="mt-4 w-full flex flex-col items-center">
            {lcL  ? <Sk h="h-24" />
            : lcErr ? <ErrMsg msg={lcErr} />
            : lc && <LCHeatmap calendar={lc.calendar} />}
          </div>
        </div>
      </div>
    </>
  );
}