import { useState, useEffect, useRef } from "react";
import EventRegistrationForm from "./EventRegistrationForm";

const events = [
  {
    id: 1,
    tag: "TECH",
    title: "Zero to MVP",
    subtitle: "Building Your First Project",
    date: "MAR 14, 2025",
    time: "10:00 AM",
    speaker: "Sanat Sinha",
    role: "Tech Lead, Innovation and Entrepreneurship Cell, ITER Bhubaneswar",
    color: "#00f5d4",
    accent: "#ff6b35",
    bg: "linear-gradient(135deg, #0a0a1a 0%, #0d1b2a 50%, #0a1628 100%)",
    glowColor: "rgba(0, 245, 212, 0.3)",
    number: "01",
  },
  {
    id: 2,
    tag: "WORKSHOP",
    title: "Build to Scale",
    subtitle: "From Startup to Unicorn",
    date: "MAR 16, 2025",
    time: "2:00 PM",
    speaker: "Priya Sharma",
    role: "Partner, Sequoia India",
    color: "#f72585",
    accent: "#7209b7",
    bg: "linear-gradient(135deg, #0d0014 0%, #1a0026 50%, #0d001a 100%)",
    glowColor: "rgba(247, 37, 133, 0.3)",
    number: "02",
  },
  {
    id: 3,
    tag: "PANEL",
    title: "Capital Flows",
    subtitle: "Navigating the VC Landscape",
    date: "MAR 17, 2025",
    time: "11:30 AM",
    speaker: "Vikram Nair",
    role: "MD, Tiger Global",
    color: "#ffd60a",
    accent: "#ff9500",
    bg: "linear-gradient(135deg, #0d0a00 0%, #1a1400 50%, #0d0a00 100%)",
    glowColor: "rgba(255, 214, 10, 0.25)",
    number: "03",
  },
  {
    id: 4,
    tag: "FIRESIDE",
    title: "Zero to One",
    subtitle: "Bootstrapping vs Funding",
    date: "MAR 18, 2025",
    time: "4:00 PM",
    speaker: "Neha Kapoor",
    role: "Founder, CraftOS",
    color: "#06ffa5",
    accent: "#00b4d8",
    bg: "linear-gradient(135deg, #000d0a 0%, #001a14 50%, #000d0a 100%)",
    glowColor: "rgba(6, 255, 165, 0.25)",
    number: "04",
  },
];

// Only keyframes + font import stay here — everything else is Tailwind
const KEYFRAMES = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500&family=Space+Mono:wght@400;700&display=swap');

  .f-bebas  { font-family: 'Bebas Neue', sans-serif; }
  .f-mono   { font-family: 'Space Mono', monospace; }
  .f-dm     { font-family: 'DM Sans', sans-serif; }

  @keyframes progressFill {
    from { width: 0% }
    to   { width: 100% }
  }
  @keyframes tickerScroll {
    from { transform: translateX(0) }
    to   { transform: translateX(-50%) }
  }
  @keyframes slideInUp {
    from { opacity: 0; transform: translateY(20px) }
    to   { opacity: 1; transform: translateY(0) }
  }
  @keyframes hintPulse {
    0%, 100% { opacity: 0.2; }
    50%       { opacity: 0.55; }
  }

  .progress-running {
    animation: progressFill 4s linear forwards;
  }
  .ticker-scroll {
    animation: tickerScroll 7s linear infinite;
  }
  .title-anim {
    animation: slideInUp 0.5s cubic-bezier(0.23, 1, 0.32, 1) forwards;
  }
  .hint-anim {
    animation: hintPulse 2s ease-in-out infinite;
  }

  /* show swipe hints only on real touch screens */
  .swipe-hint { display: none; }
  @media (hover: none) and (pointer: coarse) {
    .swipe-hint  { display: flex; }
    .desktop-btn { display: none; }
  }
`;

// card transform per state
const cardStyle = (state) => {
  const base = { transition: "all 0.7s cubic-bezier(0.23, 1, 0.32, 1)" };
  if (state === "active") return { ...base, transform: "translateX(0) scale(1) rotateY(0deg)", opacity: 1, zIndex: 5 };
  if (state === "prev")   return { ...base, transform: "translateX(-80px) scale(0.92) rotateY(8deg)", opacity: 0, zIndex: 1, pointerEvents: "none" };
  if (state === "next")   return { ...base, transform: "translateX(80px) scale(0.92) rotateY(-8deg)", opacity: 0, zIndex: 1, pointerEvents: "none" };
  return { ...base, transform: "translateX(0) scale(0.8)", opacity: 0, zIndex: 0, pointerEvents: "none" };
};

export default function RegistrationSlider() {
  const [current, setCurrent]         = useState(0);
  const [animating, setAnimating]     = useState(false);
  const [progressKey, setProgressKey] = useState(0);
  const [paused, setPaused]           = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const intervalRef = useRef(null);
  const pausedRef   = useRef(false);
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);

  useEffect(() => { pausedRef.current = paused; }, [paused]);

  const startInterval = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (pausedRef.current) return;
      setCurrent((c) => (c + 1) % events.length);
      setProgressKey((k) => k + 1);
    }, 4000);
  };

  useEffect(() => {
    startInterval();
    return () => clearInterval(intervalRef.current);
  }, []);

  const go = (idx) => {
    if (animating) return;
    setAnimating(true);
    setCurrent(idx);
    setProgressKey((k) => k + 1);
    startInterval();
    setTimeout(() => setAnimating(false), 700);
  };

  const next = () => go((current + 1) % events.length);
  const prev = () => go((current - 1 + events.length) % events.length);

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      dx < 0 ? next() : prev();
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  const getState = (i) => {
    if (i === current) return "active";
    const diff = (i - current + events.length) % events.length;
    if (diff === 1)               return "next";
    if (diff === events.length-1) return "prev";
    return "far";
  };

  const tickerItems = Array(2).fill([
    "Workshop 2025","Entrepreneurship","Innovation","Startups","Pitch Competition",
    "Networking","Keynotes","Workshops","VC Meetings",
  ]).flat();

  const ArrowLeft = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
  const ArrowRight = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );

  return (
    <>
      <style>{KEYFRAMES}</style>

      {/* Root */}
      <div className="f-dm relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#050508] py-5">

        {/* Noise overlay */}
        <div
          className="pointer-events-none fixed inset-0 z-[100] opacity-40"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")` }}
        />

        {/* Header */}
        <div className="relative z-10 mb-8 text-center flex flex-col items-center">
          <p className="f-mono mb-2.5 text-[11px] uppercase tracking-[6px] text-white/30">
            ◆ ITER Bhubaneswar ◆ March 2025
          </p>
          <h1 className="f-bebas m-0 text-[clamp(48px,8vw,96px)] leading-[0.9] tracking-[4px] text-white">
            WORK<span style={{ WebkitTextStroke: "1px rgba(255,255,255,0.15)", color: "transparent" }}>SHOP</span>
          </h1>
          <button
            className="mt-4 f-mono rounded-full border border-white/20 bg-white/10 px-6 py-2 text-[12px] uppercase tracking-[2px] text-white hover:bg-white/20 transition-all duration-200"
            onClick={() => {
              // Scroll to workshop section or navigate to workshop page
              const el = document.getElementById('workshop-section');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
              } else {
                window.location.href = '/#workshop';
              }
            }}
          >
            Go to Workshop
          </button>
        </div>

        {/* Slider wrapper */}
        <div className="relative w-full max-w-[900px] px-6">

          {/* Floating badge */}
          <div className="f-mono absolute left-10 top-[-16px] z-10 rounded-[10px] border border-white/10 bg-[rgba(5,5,8,0.9)] px-4 py-2 text-[10px] uppercase tracking-[2px] text-white/50 backdrop-blur-md">
            Events Calendar
          </div>

          {/* Swipe hint arrows — CSS shows these only on touch devices */}
          <div className="swipe-hint hint-anim pointer-events-none absolute left-7 top-1/2 z-20 -translate-y-1/2 items-center text-white/25">
            <ArrowLeft />
          </div>
          <div className="swipe-hint hint-anim pointer-events-none absolute right-7 top-1/2 z-20 -translate-y-1/2 items-center text-white/25">
            <ArrowRight />
          </div>

          {/* Slider track */}
          <div className="relative h-[440px] rounded-[20px]" style={{ perspective: "1200px" }}>
            {events.map((ev, i) => {
              const state = getState(i);
              const isActive = state === "active";
              return (
                <div
                  key={ev.id}
                  className="absolute inset-0 overflow-hidden rounded-[20px] select-none"
                  style={{ ...cardStyle(state), transformStyle: "preserve-3d", touchAction: "pan-y" }}
                  onMouseEnter={() => isActive && setPaused(true)}
                  onMouseLeave={() => setPaused(false)}
                  onTouchStart={onTouchStart}
                  onTouchEnd={onTouchEnd}
                >
                  {/* BG */}
                  <div className="absolute inset-0" style={{ background: ev.bg }} />

                  {/* Grid lines */}
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
                      backgroundSize: "40px 40px",
                    }}
                  />

                  {/* Glows */}
                  <div
                    className="pointer-events-none absolute -right-12 -top-12 h-[300px] w-[300px] rounded-full opacity-60"
                    style={{ background: ev.glowColor, filter: "blur(80px)" }}
                  />
                  <div
                    className="pointer-events-none absolute bottom-0 left-10 h-[200px] w-[200px] rounded-full opacity-30"
                    style={{ background: ev.accent + "44", filter: "blur(60px)" }}
                  />

                  {/* Border */}
                  <div className="pointer-events-none absolute inset-0 rounded-[20px] border border-white/[0.08]" />

                  {/* Big number watermark */}
                  <div
                    className="f-bebas pointer-events-none absolute right-9 top-7 text-[72px] leading-none tracking-[-2px] opacity-[0.12]"
                    style={{ color: ev.color }}
                  >
                    {ev.number}
                  </div>

                  {/* Card content */}
                  <div className="relative z-[2] grid h-full grid-rows-[auto_1fr_auto] px-10 py-9">

                    {/* Top */}
                    <div className="mb-3 flex items-center justify-between">
                      <span
                        className="f-mono rounded-full border px-3.5 py-1.5 text-[10px] uppercase tracking-[4px]"
                        style={{ color: ev.color, borderColor: ev.color + "44" }}
                      >
                        {ev.tag}
                      </span>
                    </div>

                    {/* Middle */}
                    <div className="flex flex-col justify-center">
                      <h2
                        className={`f-bebas m-0 mb-2.5 text-[clamp(52px,8vw,76px)] leading-[0.92] tracking-[1px] text-white ${isActive ? "title-anim" : ""}`}
                      >
                        {ev.title}
                      </h2>
                      <p className="f-dm m-0 text-[15px] font-light tracking-[0.5px] text-white/50">
                        {ev.subtitle}
                      </p>

                      {/* Divider */}
                      <div className="my-6 h-px opacity-20" style={{ background: ev.color }} />

                      {/* Register btn */}
                      <button
                        className="f-mono inline-flex w-fit cursor-pointer items-center gap-2 rounded-full border bg-transparent px-7 py-3 text-[11px] uppercase tracking-[2px] text-white transition-transform duration-300 hover:scale-105"
                        style={{ borderColor: ev.color + "44", color: ev.color }}
                        onClick={() => {
                          setSelectedEvent(ev);
                          setIsModalOpen(true);
                        }}
                      >
                        Register Now
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>

                    {/* Bottom */}
                    <div className="grid grid-cols-[1fr_auto] items-end gap-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[16px] font-medium tracking-[0.3px] text-white">{ev.speaker}</span>
                        <span className="f-mono text-[10px] tracking-[1px] text-white/35">{ev.role}</span>
                      </div>
                      <div className="text-right">
                        <span className="f-mono mb-0.5 block text-[11px] tracking-[1px] text-white/40">{ev.date}</span>
                        <span className="f-bebas text-[28px] tracking-[1px]" style={{ color: ev.color }}>{ev.time}</span>
                      </div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  {isActive && (
                    <div
                      key={progressKey}
                      className="progress-running absolute bottom-0 left-0 h-[2px] rounded-r-sm"
                      style={{
                        background: ev.color,
                        animationPlayState: paused ? "paused" : "running",
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Controls: arrows + dots */}
        <div className="relative z-10 mt-7 flex items-center justify-center gap-5">
          <button
            className="desktop-btn flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-white/[0.12] bg-white/[0.04] text-white backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-white/25 hover:bg-white/10"
            onClick={prev}
            aria-label="Previous"
          >
            <ArrowLeft />
          </button>

          <div className="flex items-center gap-2">
            {events.map((_, i) => (
              <div
                key={i}
                role="button"
                aria-label={`Slide ${i + 1}`}
                onClick={() => go(i)}
                className="h-1.5 cursor-pointer rounded-full transition-all duration-[400ms]"
                style={{
                  width: i === current ? "28px" : "6px",
                  background: i === current ? "white" : "rgba(255,255,255,0.2)",
                }}
              />
            ))}
          </div>

          <button
            className="desktop-btn flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-white/[0.12] bg-white/[0.04] text-white backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-white/25 hover:bg-white/10"
            onClick={next}
            aria-label="Next"
          >
            <ArrowRight />
          </button>
        </div>

        {/* Ticker */}
        <div className="relative z-10 mt-6 w-full overflow-hidden border-b border-t border-white/[0.05] py-3">
          <div className="ticker-scroll flex gap-12 whitespace-nowrap">
            {tickerItems.map((item, i) => (
              <span
                key={i}
                className="f-mono flex items-center gap-12 text-[10px] uppercase tracking-[3px] text-white/20 after:text-[6px] after:text-white/10 after:content-['◆']"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Registration Modal */}
      <EventRegistrationForm
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedEvent(null);
        }}
        event={selectedEvent}
      />
    </>
  );
}