import React, { useState, useEffect, useRef } from "react";

export default function Mascot({ activeField, statusState, selectedTeams = [], isFloating = false }) {
  const [pupilOffset, setPupilOffset] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(true);
  const mascotRef = useRef(null);

  // Auto-hide popup message after 2 seconds on interaction change
  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [activeField, statusState, selectedTeams]);

  // Track mouse/touch position for pupil offset
  useEffect(() => {
    const handleMove = (clientX, clientY) => {
      if (mascotRef.current) {
        const rect = mascotRef.current.getBoundingClientRect();
        const mascotCenterX = rect.left + rect.width / 2;
        const mascotCenterY = rect.top + rect.height / 3;
        const deltaX = clientX - mascotCenterX;
        const deltaY = clientY - mascotCenterY;
        const angle = Math.atan2(deltaY, deltaX);
        const distance = Math.hypot(deltaX, deltaY);
        const maxDist = 12;
        const offsetDist = Math.min(distance / 25, maxDist);
        setPupilOffset({
          x: Math.cos(angle) * offsetDist,
          y: Math.sin(angle) * offsetDist
        });
      }
    };

    const onMouseMove = (e) => handleMove(e.clientX, e.clientY);
    const onTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchstart", onTouchMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchstart", onTouchMove);
    };
  }, []);

  const getGuidanceMessage = () => {
    if (statusState?.type === "success") {
      return "Registration Successful! 🎉 Welcome to the E-Cell team!";
    }
    if (statusState?.type === "error") {
      return "Oops! Please double check your details and try again.";
    }

    switch (activeField) {
      case "name":
        return "Hi there! 👋 Enter your full name first.";
      case "registration_number":
        return "Great! Now type in your college Registration Number.";
      case "email":
        return "Enter your valid email so we can contact you!";
      case "branch":
        return "Which academic branch are you studying in?";
      case "section":
        return "Specify your section.";
      case "year":
        return "Select your current year of study!";
      case "team":
        if (Array.isArray(selectedTeams) && selectedTeams.length > 0) {
          if (selectedTeams.length === 1) {
            return `Awesome! You selected ${selectedTeams[0]}! You can pick more teams if interested! ✨`;
          }
          return `Awesome! You selected ${selectedTeams.length} teams (${selectedTeams.join(", ")})! 🎉`;
        }
        return "Pick your favorite team(s)! You can select multiple teams (Technical, Media, Design...)!";
      default:
        return "Hey Innovator! I'm Sparky. Select one or more teams to join E-Cell! 🚀";
    }
  };

  const isSuccess = statusState?.type === "success";
  const isError = statusState?.type === "error";

  return (
    <div className={`relative flex flex-col ${isFloating ? "items-end my-0" : "items-center my-1 sm:my-4"} w-full`}>
      {/* Dynamic Speech Bubble */}
      <div
        className={`relative ${
          isFloating
            ? "mb-4 max-w-[210px] sm:max-w-[240px] px-3 py-2 bg-white text-slate-800 text-[11px] border-2 border-purple-400 shadow-2xl rounded-2xl text-center"
            : "mb-6 sm:mb-8 max-w-[250px] xs:max-w-[280px] sm:max-w-sm px-3.5 py-2.5 sm:px-4 sm:py-3 bg-white text-slate-800 text-[11px] xs:text-xs sm:text-sm border-2 border-purple-300 shadow-xl rounded-2xl text-center"
        } font-semibold transition-all duration-300 transform ${
          isVisible
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 -translate-y-2 scale-95 pointer-events-none"
        }`}
      >
        <p className="leading-snug">{getGuidanceMessage()}</p>
        <div
          className={`absolute -bottom-2.5 ${
            isFloating ? "right-6" : "left-1/2 -translate-x-1/2"
          } w-0 h-0 border-l-[8px] sm:border-l-[10px] border-l-transparent border-r-[8px] sm:border-r-[10px] border-r-transparent border-t-[8px] sm:border-t-[10px] border-t-white drop-shadow-sm`}
        />
      </div>

      {/* Interactive Mascot SVG */}
      <div
        ref={mascotRef}
        className={`relative ${
          isFloating
            ? "w-20 h-24 sm:w-24 sm:h-28 mr-2"
            : "w-28 h-32 xs:w-32 xs:h-36 sm:w-44 sm:h-48 md:w-48 md:h-52"
        } flex items-center justify-center filter drop-shadow-[0_10px_18px_rgba(147,51,234,0.4)]`}
      >
        <svg
          viewBox="0 0 200 220"
          className="w-full h-full overflow-visible transition-transform duration-300 hover:scale-105"
        >
          <defs>
            <linearGradient id="mascotBody" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="50%" stopColor="#7e22ce" />
              <stop offset="100%" stopColor="#581c87" />
            </linearGradient>

            <linearGradient id="screenGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1e1b4b" />
              <stop offset="100%" stopColor="#311b92" />
            </linearGradient>

            <linearGradient id="chestGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>

            <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Floating Shadow */}
          <ellipse cx="100" cy="205" rx="55" ry="10" fill="#000" opacity="0.25" className="animate-pulse" />

          {/* Antennas */}
          <path d="M 100 45 L 100 20" stroke="#c084fc" strokeWidth="4" strokeLinecap="round" />
          <circle cx="100" cy="16" r="8" fill="#fbbf24" filter="url(#glowEffect)" className="animate-bounce" />

          {/* Ears */}
          <rect x="25" y="65" width="12" height="25" rx="6" fill="#6b21a8" />
          <rect x="163" y="65" width="12" height="25" rx="6" fill="#6b21a8" />

          {/* Head Outer Frame */}
          <rect
            x="34"
            y="35"
            width="132"
            height="100"
            rx="32"
            fill="url(#mascotBody)"
            stroke="#e9d5ff"
            strokeWidth="3"
          />

          {/* Face Screen */}
          <rect x="46" y="47" width="108" height="76" rx="22" fill="url(#screenGrad)" />

          {/* Eyes */}
          {isSuccess ? (
            <g fill="#fbbf24">
              <text x="62" y="96" fontSize="28" textAnchor="middle">⭐</text>
              <text x="138" y="96" fontSize="28" textAnchor="middle">⭐</text>
            </g>
          ) : (
            <g>
              <circle cx="75" cy="85" r="20" fill="#ffffff" stroke="#c084fc" strokeWidth="2" />
              <circle
                cx={75 + pupilOffset.x}
                cy={85 + pupilOffset.y}
                r="10"
                fill="#0f172a"
              />
              <circle
                cx={72 + pupilOffset.x}
                cy={81 + pupilOffset.y}
                r="3.5"
                fill="#ffffff"
              />

              <circle cx="125" cy="85" r="20" fill="#ffffff" stroke="#c084fc" strokeWidth="2" />
              <circle
                cx={125 + pupilOffset.x}
                cy={85 + pupilOffset.y}
                r="10"
                fill="#0f172a"
              />
              <circle
                cx={122 + pupilOffset.x}
                cy={81 + pupilOffset.y}
                r="3.5"
                fill="#ffffff"
              />
            </g>
          )}

          {/* Smile */}
          <path
            d={isError ? "M 90 112 Q 100 104 110 112" : "M 86 108 Q 100 120 114 108"}
            fill="none"
            stroke="#fbbf24"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Rosy Cheeks */}
          <ellipse cx="58" cy="98" rx="6" ry="4" fill="#f43f5e" opacity="0.6" />
          <ellipse cx="142" cy="98" rx="6" ry="4" fill="#f43f5e" opacity="0.6" />

          {/* Body / Torso */}
          <path
            d="M 55 132 L 145 132 L 155 190 Q 100 200 45 190 Z"
            fill="url(#mascotBody)"
            stroke="#e9d5ff"
            strokeWidth="2.5"
          />

          {/* Chest E-Cell Emblem */}
          <circle cx="100" cy="162" r="16" fill="url(#chestGlow)" filter="url(#glowEffect)" />
          <text
            x="100"
            y="167"
            fontSize="13"
            fontWeight="bold"
            fill="#581c87"
            textAnchor="middle"
            fontFamily="sans-serif"
          >
            EC
          </text>

          {/* Arms */}
          <path d="M 46 142 Q 25 160 38 175" fill="none" stroke="#a855f7" strokeWidth="10" strokeLinecap="round" />
          <path d="M 154 142 Q 175 160 162 175" fill="none" stroke="#a855f7" strokeWidth="10" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
}
