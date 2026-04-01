    "use client";
    import { useEffect, useRef, useState, useCallback } from "react";

    export default function MusicPlayer({ src = "/music/bg.mp3" }: { src?: string }) {
    const audioRef    = useRef<HTMLAudioElement>(null);
    const canvasRef   = useRef<HTMLCanvasElement>(null);
    const ctxRef      = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const rafRef      = useRef<number>(0);
    const tickRef     = useRef<number>(0); 
    const [playing, setPlaying] = useState(false);
    const [error,   setError]   = useState<string | null>(null);

    const draw = useCallback(() => {
        rafRef.current = requestAnimationFrame(draw);
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx    = canvas.getContext("2d")!;
        const W      = canvas.width;
        const H      = canvas.height;
        const bars   = 5;
        const barW   = Math.floor(W * 0.08);
        const gap    = Math.floor(W * 0.05);
        const totalW = bars * barW + (bars - 1) * gap;
        const startX = Math.floor((W - totalW) / 2);

        ctx.clearRect(0, 0, W, H);


        if (playing) {
  tickRef.current += 0.05;
  const t = tickRef.current;
  const phases      = [0, 1.3, 2.6, 0.8, 2.0];
  const baseHeights = [0.45, 0.65, 0.55, 0.75, 0.50];

  for (let i = 0; i < bars; i++) {
    const wave = Math.sin(t + phases[i]) * 0.28;
    const barH = Math.max(barW, (baseHeights[i] + wave) * H);
    const x    = startX + i * (barW + gap);
    ctx.fillStyle = "rgba(200,245,66,0.92)";
    ctx.fillRect(x, H - barH, barW, barH);
  }
} else {
  const idleHeights = [0.45, 0.65, 0.55, 0.75, 0.50];
  for (let i = 0; i < bars; i++) {
    const barH = idleHeights[i] * H;
    const x    = startX + i * (barW + gap);
    ctx.fillStyle = "rgba(200,245,66,0.25)";
    ctx.fillRect(x, H - barH, barW, barH);
  }
}
    }, [playing]);

useEffect(() => {
    const canvas = canvasRef.current!;
    const dpr = window.devicePixelRatio || 1;
    canvas.width  = 28 * dpr;
    canvas.height = 24 * dpr;
    canvas.getContext("2d")!.scale(dpr, dpr);

    draw();

    const tryAutoplay = () => {
        if (ctxRef.current) return; 
        try {
            const audio = audioRef.current!;
            const actx = new AudioContext();
            const analyser = actx.createAnalyser();
            analyser.fftSize = 512;
            analyser.smoothingTimeConstant = 0.82;
            const gain = actx.createGain();
            gain.gain.value = 0.01;
            actx.createMediaElementSource(audio).connect(gain);
            gain.connect(analyser);
            analyser.connect(actx.destination);
            ctxRef.current = actx;
            analyserRef.current = analyser;

            audio.play().then(() => setPlaying(true)).catch(() => {});
        } catch {}

        window.removeEventListener("click",   tryAutoplay);
        window.removeEventListener("keydown", tryAutoplay);
        window.removeEventListener("scroll",  tryAutoplay);
        window.removeEventListener("touchstart", tryAutoplay);
    };

    audioRef.current!.play().then(() => setPlaying(true)).catch(() => {
        window.addEventListener("click",      tryAutoplay);
        window.addEventListener("keydown",    tryAutoplay);
        window.addEventListener("scroll",     tryAutoplay);
        window.addEventListener("touchstart", tryAutoplay);
    });

    return () => {
        cancelAnimationFrame(rafRef.current);
        window.removeEventListener("click",      tryAutoplay);
        window.removeEventListener("keydown",    tryAutoplay);
        window.removeEventListener("scroll",     tryAutoplay);
        window.removeEventListener("touchstart", tryAutoplay);
    };
}, [draw]);

    const initAudio = useCallback(() => {
        if (ctxRef.current) return;
        try {
        const audio    = audioRef.current!;
        const actx     = new AudioContext();
        const analyser = actx.createAnalyser();
        analyser.fftSize = 512;
        analyser.smoothingTimeConstant = 0.82;

        const gain = actx.createGain();
        gain.gain.value = 0.01; 

        actx.createMediaElementSource(audio).connect(gain);
        gain.connect(analyser);
        analyser.connect(actx.destination);

        ctxRef.current      = actx;
        analyserRef.current = analyser;
        } catch (e) {
        setError("Audio init failed");
        console.error(e);
        }
    }, []);

    const toggle = async () => {
        setError(null);
        initAudio();
        const audio = audioRef.current!;
        try {
        if (ctxRef.current?.state === "suspended") await ctxRef.current.resume();
        if (playing) {
            audio.pause();
            setPlaying(false);
        } else {
            await audio.play();
            setPlaying(true);
        }
        } catch (e: any) {
        setError(e.message || "Playback failed");
        console.error(e);
        }
    };

    return (
        <div style={{ position: "fixed", bottom: 28, right: 28, zIndex: 200 }}>
        {error && (
            <div style={{
            position: "absolute", bottom: 56, right: 0,
            background: "#1a0a0a", border: "1px solid #ff4444",
            borderRadius: 8, padding: "6px 10px",
            fontSize: "0.6rem", color: "#ff8080",
            whiteSpace: "nowrap", maxWidth: 220,
            }}>
            ⚠ {error}
            </div>
        )}

        <div
            onClick={toggle}
            title={playing ? "Pause" : "Play ambient music"}
            style={{
            width: 48, height: 48,
            borderRadius: "50%",
            background: "rgba(8,12,20,0.82)",
            backdropFilter: "blur(12px)",
            border: `1px solid ${playing ? "rgba(200,245,66,0.4)" : "rgba(255,255,255,0.12)"}`,
            cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "border-color 0.3s, box-shadow 0.3s",
            boxShadow: playing ? "0 0 20px rgba(200,245,66,0.18)" : "none",
            }}
        >
            <audio
            ref={audioRef}
            src={src}
            loop
            preload="auto"
            onError={() => setError(`Can't load: ${src}`)}
            />
            <canvas
            ref={canvasRef}
            style={{ width: 28, height: 24, display: "block" }}
            />
        </div>
        </div>
    );
    }