import { useState } from "react";
import EventRegistrationForm from "./EventRegistrationForm";

// Only keyframes + font import stay here — everything else is Tailwind
const KEYFRAMES = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500&family=Space+Mono:wght@400;700&display=swap');

  .f-bebas  { font-family: 'Bebas Neue', sans-serif; }
  .f-mono   { font-family: 'Space Mono', monospace; }
  .f-dm     { font-family: 'DM Sans', sans-serif; }

  @keyframes tickerScroll {
    from { transform: translateX(0) }
    to   { transform: translateX(-50%) }
  }
  @keyframes slideInUp {
    from { opacity: 0; transform: translateY(20px) }
    to   { opacity: 1; transform: translateY(0) }
  }

  .ticker-scroll {
    animation: tickerScroll 7s linear infinite;
  }
  .title-anim {
    animation: slideInUp 0.5s cubic-bezier(0.23, 1, 0.32, 1) forwards;
  }
`;

export default function RegistrationSlider() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const workshop = {
    id: 1,
    title: "Foundation Series",
    subtitle: "The ultimate master class",
    date: "MAR 23-24, 2026",
    time: "4:30 PM",
    color: "#f72585",
    accent: "#7209b7",
    bg: "linear-gradient(135deg, #0d0014 0%, #1a0026 50%, #0d001a 100%)",
    glowColor: "rgba(247, 37, 133, 0.3)",
    number: "IEC",
  };

  const tickerItems = Array(2).fill([
    "Workshop 2026","Entrepreneurship","Innovation","Startups",
    "Networking","Keynotes","Workshops","VC Meetings",
  ]).flat();

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
            ◆ ITER Bhubaneswar ◆ March 2026
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
                window.location.href = '/';
              }
            }}
          >
            Go to Homepage
          </button>
        </div>

        {/* Slider wrapper */}
        <div className="relative w-full max-w-[900px] px-6">

          {/* Floating badge */}
          <div className="f-mono absolute left-10 top-[-16px] z-10 rounded-[10px] border border-white/10 bg-[rgba(5,5,8,0.9)] px-4 py-2 text-[10px] uppercase tracking-[2px] text-white/50 backdrop-blur-md">
            Innovation Sprint 2026
          </div>

          {/* Slider track */}
          <div className="relative h-[440px] rounded-[20px]" style={{ perspective: "1200px" }}>
            <div
              key={workshop.id}
              className="absolute inset-0 overflow-hidden rounded-[20px] select-none"
              style={{ transformStyle: "preserve-3d", touchAction: "pan-y" }}
            >
                  {/* BG */}
                  <div className="absolute inset-0" style={{ background: workshop.bg }} />

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
                    style={{ background: workshop.glowColor, filter: "blur(80px)" }}
                  />
                  <div
                    className="pointer-events-none absolute bottom-0 left-10 h-[200px] w-[200px] rounded-full opacity-30"
                    style={{ background: workshop.accent + "44", filter: "blur(60px)" }}
                  />

                  {/* Border */}
                  <div className="pointer-events-none absolute inset-0 rounded-[20px] border border-white/[0.08]" />

                  {/* Big number watermark */}
                  <div
                    className="f-bebas pointer-events-none absolute right-9 top-7 text-[72px] leading-none tracking-[-2px] opacity-[0.12]"
                    style={{ color: workshop.color }}
                  >
                    {workshop.number}
                  </div>

                  {/* Card content */}
                  <div className="relative z-[2] grid h-full grid-rows-[auto_1fr_auto] px-10 py-9">

                    {/* Top */}
                    <div className="mb-3 flex items-center justify-between">
                      <span
                        className="f-mono rounded-full border px-3.5 py-1.5 text-[10px] uppercase tracking-[4px]"
                        style={{ color: workshop.color, borderColor: workshop.color + "44" }}
                      >
                        LIVE
                      </span>
                    </div>

                    {/* Middle */}
                    <div className="flex flex-col justify-center">
                      <h2
                        className="f-bebas title-anim m-0 mb-2.5 text-[clamp(52px,8vw,76px)] leading-[0.92] tracking-[1px] text-white"
                      >
                        {workshop.title}
                      </h2>
                      <p className="f-dm m-0 text-[15px] font-light tracking-[0.5px] text-white/50">
                        {workshop.subtitle}
                      </p>

                      {/* Divider */}
                      <div className="my-6 h-px opacity-20" style={{ background: workshop.color }} />

                      {/* Register btn */}
                      <button
                        className="f-mono inline-flex w-fit cursor-pointer items-center gap-2 rounded-full border bg-transparent px-7 py-3 text-[11px] uppercase tracking-[2px] text-white transition-transform duration-300 hover:scale-105"
                        style={{ borderColor: workshop.color + "44", color: workshop.color }}
                        onClick={() => {
                          setSelectedEvent(workshop);
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
                        <span className="f-mono text-[16px] font-medium tracking-[0.8px] text-white/35">Innovation and Entrepreneurship Cell, SOA</span>
                      </div>
                      <div className="text-right">
                        <span className="f-mono mb-0.5 block text-[11px] tracking-[1px] text-white/40">{workshop.date}</span>
                        <span className="f-bebas text-[28px] tracking-[1px]" style={{ color: workshop.color }}>{workshop.time}</span>
                      </div>
                    </div>
                  </div>
                </div>
          </div>
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
