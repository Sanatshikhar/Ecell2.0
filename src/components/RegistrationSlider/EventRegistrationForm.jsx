import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import pb from "../../lib/pocketbase";

const KEYFRAMES = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500&family=Space+Mono:wght@400;700&display=swap');

  .f-bebas  { font-family: 'Bebas Neue', sans-serif; }
  .f-mono   { font-family: 'Space Mono', monospace; }
  .f-dm     { font-family: 'DM Sans', sans-serif; }

  @keyframes modalSlideIn {
    from { opacity: 0; transform: translateY(20px) scale(0.98); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  .modal-anim {
    animation: modalSlideIn 0.4s cubic-bezier(0.23, 1, 0.32, 1) forwards;
  }
`;

export default function EventRegistrationForm({ isOpen, onClose, event }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    course: "",
    regNo: "",
    iecMember: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpSending, setOtpSending] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [otpExpiresAt, setOtpExpiresAt] = useState(null);
  const [otpSecondsLeft, setOtpSecondsLeft] = useState(0);
  const [otpMessage, setOtpMessage] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpStepActive, setOtpStepActive] = useState(false);

  const formatOtpTime = (seconds) => {
    const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
    const ss = String(seconds % 60).padStart(2, "0");
    return `${mm}:${ss}`;
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!otpExpiresAt) {
      setOtpSecondsLeft(0);
      return;
    }

    const tick = () => {
      const remaining = Math.max(0, Math.ceil((otpExpiresAt - Date.now()) / 1000));
      setOtpSecondsLeft(remaining);
      if (remaining === 0) {
        setOtpCode("");
        setOtpVerified(false);
      }
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [otpExpiresAt]);

  if (!isOpen || !event) return null;

  const validateEmailOnly = () => {
    const email = formData.email.trim();
    const validEmailDomains = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "rediffmail.com", "protonmail.com", "icloud.com", "aol.com"];

    if (!email) {
      return "Email is required";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Invalid email format";
    }

    const emailDomain = email.split("@")[1].toLowerCase();
    if (!validEmailDomains.includes(emailDomain)) {
      return `Email must use one of these domains: ${validEmailDomains.join(", ")}`;
    }

    return "";
  };

  const handleSendOtp = async () => {
    const emailError = validateEmailOnly();
    if (emailError) {
      setErrors((prev) => ({ ...prev, email: emailError }));
      setOtpError("Fix your email and try again.");
      return false;
    }

    setOtpSending(true);
    setOtpError("");
    setOtpMessage("");

    try {
      const backendUrl = (process.env.REACT_APP_BACKEND_URL || "").replace(/\/$/, "");
      if (!backendUrl) {
        throw new Error("REACT_APP_BACKEND_URL is not configured.");
      }

      const nextOtp = String(Math.floor(100000 + Math.random() * 900000));

      const response = await fetch(`${backendUrl}/api/send-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: formData.email.trim(),
          name: formData.name.trim() || "Participant",
          otp: nextOtp,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "Unable to send OTP");
      }

      setOtpCode(nextOtp);
      setOtpVerified(false);
      setOtpInput("");
      setOtpExpiresAt(Date.now() + 5 * 60 * 1000);
      setOtpMessage("OTP sent successfully. Please verify within 5 minutes.");
      return true;
    } catch (err) {
      setOtpError(err.message || "Failed to send OTP.");
      return false;
    } finally {
      setOtpSending(false);
    }
  };

  const handleVerifyOtp = () => {
    setOtpVerifying(true);
    setOtpError("");
    setOtpMessage("");

    const normalized = otpInput.trim();
    if (!normalized || normalized.length !== 6) {
      setOtpError("Enter the 6-digit OTP.");
      setOtpVerifying(false);
      return;
    }

    if (!otpCode || otpSecondsLeft <= 0) {
      setOtpError("OTP expired. Request a new OTP.");
      setOtpVerified(false);
      setOtpVerifying(false);
      return;
    }

    if (normalized !== otpCode) {
      setOtpError("Incorrect OTP. Please try again.");
      setOtpVerified(false);
      setOtpVerifying(false);
      return;
    }

    setOtpVerified(true);
    setOtpMessage("Email verified successfully.");
    setOtpVerifying(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "email") {
      setOtpCode("");
      setOtpInput("");
      setOtpVerified(false);
      setOtpExpiresAt(null);
      setOtpError("");
      setOtpMessage("");
      setOtpStepActive(false);
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const validEmailDomains = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "rediffmail.com", "protonmail.com", "icloud.com", "aol.com"];
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    } else if (!/^[a-zA-Z\s'-]+$/.test(formData.name.trim())) {
      newErrors.name = "Name can only contain letters, spaces, hyphens, and apostrophes";
    }
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "Invalid email format";
      } else {
        const emailDomain = formData.email.split("@")[1].toLowerCase();
        if (!validEmailDomains.includes(emailDomain)) {
          newErrors.email = `Email must use one of these domains: ${validEmailDomains.join(", ")}`;
        }
      }
    }
    
    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else {
      const phoneRegex = /^(\+91|91|0)?[6-9]\d{9}$/;
      if (!phoneRegex.test(formData.phone.replace(/\s|-/g, ""))) {
        newErrors.phone = "Invalid phone number (must be 10 digits starting with 6-9)";
      }
    }
    
    // Course/Branch validation
    if (!formData.course.trim()) {
      newErrors.course = "Course/Branch is required";
    } else if (formData.course.trim().length < 2) {
      newErrors.course = "Course/Branch must be at least 2 characters";
    }
    
    // Registration number validation
    if (!formData.regNo.trim()) {
      newErrors.regNo = "Registration number is required";
    } else if (formData.regNo.trim().length < 3) {
      newErrors.regNo = "Registration number must be at least 3 characters";
    } else if (!/^[a-zA-Z0-9\-/]+$/.test(formData.regNo.trim())) {
      newErrors.regNo = "Registration number contains invalid characters";
    }
    
    // IEC Member validation
    if (!formData.iecMember) {
      newErrors.iecMember = "Please select IEC member status";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    if (!otpStepActive) {
      const sent = await handleSendOtp();
      if (sent) {
        setOtpStepActive(true);
      }
      return;
    }

    if (!otpVerified) {
      setOtpError("Please verify your email with OTP before registering.");
      return;
    }

    setLoading(true);
    
    try {
      const registrationData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        course: formData.course.trim(),
        regNo: formData.regNo.trim(),
        iecMember: formData.iecMember,
      };
      
      // Save to PocketBase workshops collection
      const record = await pb.collection('workshops').create(registrationData);
      
      console.log("Registration saved successfully:", record);
      
      setShowSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        course: "",
        regNo: "",
        iecMember: "",
      });
      setOtpCode("");
      setOtpInput("");
      setOtpVerified(false);
      setOtpExpiresAt(null);
      setOtpMessage("");
      setOtpError("");
      setOtpStepActive(false);
    } catch (err) {
      console.error("Registration error:", err);
      alert(`Error submitting registration: ${err.message || "Please try again."}`);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      course: "",
      regNo: "",
      iecMember: "",
    });
    setErrors({});
    setOtpCode("");
    setOtpInput("");
    setOtpVerified(false);
    setOtpExpiresAt(null);
    setOtpMessage("");
    setOtpError("");
    setOtpStepActive(false);
    onClose();
  };

  return createPortal(
    <>
      <style>{KEYFRAMES}</style>
      
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-[999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
        onClick={handleClose}
      >
        {/* Noise overlay */}
        <div
          className="pointer-events-none fixed inset-0 opacity-30"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")` }}
        />

        {/* Modal Container */}
        <div 
          className="modal-anim f-dm relative w-full max-w-sm sm:max-w-md md:max-w-2xl bg-[#050508] rounded-xl sm:rounded-[20px] border border-white/10 overflow-hidden my-2 sm:my-4 max-h-[95vh] flex flex-col"
          style={{ background: event.bg }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Grid lines */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
              backgroundSize: "30px 30px",
            }}
          />

          {/* Glows */}
          <div
            className="pointer-events-none absolute -right-12 -top-12 h-[250px] w-[250px] rounded-full opacity-40"
            style={{ background: event.glowColor, filter: "blur(80px)" }}
          />
          <div
            className="pointer-events-none absolute bottom-0 left-10 h-[150px] w-[150px] rounded-full opacity-20"
            style={{ background: event.accent + "44", filter: "blur(60px)" }}
          />

          {/* Close button */}
          <button
            className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/10 hover:text-white"
            onClick={handleClose}
            aria-label="Close"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          {/* Content */}
          <div className="relative z-[2] p-3 sm:p-5 md:p-6 overflow-y-auto flex-1">
            {/* Header */}
            <div className="mb-2 sm:mb-4 md:mb-5">
              <span
                className="f-mono inline-block rounded-full border px-2.5 sm:px-3 py-1 sm:py-1.5 text-[8px] sm:text-[10px] uppercase tracking-[2px] sm:tracking-[4px] mb-2 sm:mb-4"
                style={{ color: event.color, borderColor: event.color + "44" }}
              >
                {event.tag}
              </span>
              <h2 className="f-bebas m-0 mb-1 text-2xl sm:text-[32px] md:text-[40px] leading-[0.9] tracking-[1px] text-white">
                {event.title}
              </h2>
              <p className="f-dm text-[11px] sm:text-xs md:text-[13px] text-white/50 mb-2">{event.subtitle}</p>
              
              {/* Event Details (Locked) */}
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div className="rounded-lg border border-white/5 bg-white/[0.02] p-1.5 sm:p-2 backdrop-blur-sm">
                  <span className="f-mono block text-[7px] sm:text-[9px] uppercase tracking-[0.5px] text-white/40 mb-0.5">Date</span>
                  <span className="f-dm text-[10px] sm:text-xs md:text-[12px] font-medium text-white">{event.date}</span>
                </div>
                <div className="rounded-lg border border-white/5 bg-white/[0.02] p-1.5 sm:p-2 backdrop-blur-sm">
                  <span className="f-mono block text-[7px] sm:text-[9px] uppercase tracking-[0.5px] text-white/40 mb-0.5">Time</span>
                  <span className="f-bebas text-sm sm:text-base md:text-[18px] tracking-[0.5px]" style={{ color: event.color }}>{event.time}</span>
                </div>
              </div>

              <div className="h-px opacity-20 mb-2" style={{ background: event.color }} />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-3 md:space-y-4">
              {/* Name */}
              <div>
                <label className="f-mono mb-1.5 sm:mb-2 block text-[10px] sm:text-[11px] uppercase tracking-[1px] text-white/60">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm md:text-base text-white placeholder:text-white/30 backdrop-blur-sm transition-all duration-200 focus:border-white/25 focus:bg-white/[0.06] focus:outline-none"
                />
                {errors.name && (
                  <span className="f-dm mt-1 block text-[11px] sm:text-[12px] text-red-400">{errors.name}</span>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="f-mono mb-1.5 sm:mb-2 block text-[10px] sm:text-[11px] uppercase tracking-[1px] text-white/60">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm md:text-base text-white placeholder:text-white/30 backdrop-blur-sm transition-all duration-200 focus:border-white/25 focus:bg-white/[0.06] focus:outline-none"
                />
                {errors.email && (
                  <span className="f-dm mt-1 block text-[11px] sm:text-[12px] text-red-400">{errors.email}</span>
                )}
              </div>

              {/* OTP Verification */}
              {otpStepActive && (
              <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3 sm:p-4">
                <div className="mb-2 flex items-center justify-between">
                  <label className="f-mono block text-[10px] sm:text-[11px] uppercase tracking-[1px] text-white/70">
                    Email Verification *
                  </label>
                  {otpVerified ? (
                    <span className="f-mono text-[10px] uppercase tracking-[1px]" style={{ color: event.color }}>
                      Verified
                    </span>
                  ) : (
                    <span className="f-mono text-[10px] uppercase tracking-[1px] text-white/45">
                      Required
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-2 sm:flex-row">
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ""))}
                    placeholder="Enter 6-digit OTP"
                    className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm md:text-base text-white placeholder:text-white/30 backdrop-blur-sm transition-all duration-200 focus:border-white/25 focus:bg-white/[0.06] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={otpVerifying || otpVerified || otpSecondsLeft === 0}
                    className="f-mono rounded-lg border px-3 py-2 text-[10px] uppercase tracking-[1px] text-white transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
                    style={{ borderColor: event.color + "66", color: event.color }}
                  >
                    {otpVerified ? "Verified" : otpVerifying ? "Verifying..." : "Verify OTP"}
                  </button>
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={otpSending}
                    className="f-mono rounded-lg border px-3 py-2 text-[10px] uppercase tracking-[1px] text-white transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
                    style={{ borderColor: event.color + "66", color: event.color }}
                  >
                    {otpSending ? "Sending..." : otpSecondsLeft > 0 ? "Resend OTP" : "Send OTP"}
                  </button>
                  {otpSecondsLeft > 0 && !otpVerified && (
                    <span className="f-mono text-[10px] uppercase tracking-[1px] text-white/60">
                      Expires in {formatOtpTime(otpSecondsLeft)}
                    </span>
                  )}
                </div>

                {otpMessage && (
                  <p className="f-dm mt-2 text-[11px] text-green-400">{otpMessage}</p>
                )}
                {otpError && (
                  <p className="f-dm mt-2 text-[11px] text-red-400">{otpError}</p>
                )}
              </div>
              )}

              {/* Phone */}
              <div>
                <label className="f-mono mb-1.5 sm:mb-2 block text-[10px] sm:text-[11px] uppercase tracking-[1px] text-white/60">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 9876543210"
                  className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm md:text-base text-white placeholder:text-white/30 backdrop-blur-sm transition-all duration-200 focus:border-white/25 focus:bg-white/[0.06] focus:outline-none"
                />
                {errors.phone && (
                  <span className="f-dm mt-1 block text-[11px] sm:text-[12px] text-red-400">{errors.phone}</span>
                )}
              </div>

              {/* Course/Branch, IEC member, and Reg No in grid */}
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
                {/* Course/Branch */}
                <div>
                  <label className="f-mono mb-1.5 sm:mb-2 block text-[10px] sm:text-[11px] uppercase tracking-[1px] text-white/60">
                    Course/Branch *
                  </label>
                  <input
                    type="text"
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                    placeholder="e.g., B.Tech CSE"
                    className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm md:text-base text-white placeholder:text-white/30 backdrop-blur-sm transition-all duration-200 focus:border-white/25 focus:bg-white/[0.06] focus:outline-none"
                  />
                  {errors.course && (
                    <span className="f-dm mt-1 block text-[11px] sm:text-[12px] text-red-400">{errors.course}</span>
                  )}
                </div>

                {/* IEC Member */}
                <div>
                  <label className="f-mono mb-1.5 sm:mb-2 block text-[10px] sm:text-[11px] uppercase tracking-[1px] text-white/60">
                    IEC Member *
                  </label>
                  <div className="relative">
                    <select
                      name="iecMember"
                      value={formData.iecMember}
                      onChange={handleChange}
                      className={`w-full appearance-none rounded-lg border bg-white/[0.04] px-3 sm:px-4 py-2 sm:py-3 pr-10 text-xs sm:text-sm md:text-base backdrop-blur-sm transition-all duration-200 focus:bg-white/[0.06] focus:outline-none ${formData.iecMember ? "text-white" : "text-white/30"}`}
                      style={{
                        borderColor: formData.iecMember ? event.color + "66" : "rgba(255,255,255,0.1)",
                        color: formData.iecMember ? event.color : "rgba(255,255,255,0.3)",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = event.color + "cc";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = formData.iecMember ? event.color + "66" : "rgba(255,255,255,0.1)";
                      }}
                    >
                      <option value="" className="bg-gray-900 text-white/50">Select an option</option>
                      <option value="Yes" className="bg-gray-900">Yes</option>
                      <option value="No" className="bg-gray-900">No</option>
                    </select>
                    <svg
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                      style={{ color: formData.iecMember ? event.color : "rgba(255,255,255,0.4)" }}
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </div>
                  {errors.iecMember && (
                    <span className="f-dm mt-1 block text-[11px] sm:text-[12px] text-red-400">{errors.iecMember}</span>
                  )}
                </div>

                {/* Registration Number */}
                <div className="col-span-2 sm:col-span-1 md:col-span-1">
                  <label className="f-mono mb-1.5 sm:mb-2 block text-[10px] sm:text-[11px] uppercase tracking-[1px] text-white/60">
                    Registration No. *
                  </label>
                  <input
                    type="text"
                    name="regNo"
                    value={formData.regNo}
                    onChange={handleChange}
                    placeholder="Your Reg No."
                    className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm md:text-base text-white placeholder:text-white/30 backdrop-blur-sm transition-all duration-200 focus:border-white/25 focus:bg-white/[0.06] focus:outline-none"
                  />
                  {errors.regNo && (
                    <span className="f-dm mt-1 block text-[11px] sm:text-[12px] text-red-400">{errors.regNo}</span>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || (otpStepActive && !otpVerified)}
                className="f-mono mt-2 sm:mt-3 w-full cursor-pointer rounded-lg border px-3 sm:px-4 py-2 sm:py-3 text-[9px] sm:text-[11px] uppercase tracking-[1px] sm:tracking-[1.5px] text-white transition-all duration-300 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
                style={{
                  borderColor: event.color + "44",
                  background: loading ? event.color + "33" : event.color + "22",
                  color: loading ? event.color : "white",
                }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-3 w-3 sm:h-4 sm:w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing...
                  </span>
                ) : (
                  !otpStepActive ? "Continue To Email Verification" : otpVerified ? "Complete Registration" : "Verify Email To Continue"
                )}
              </button>
            </form>
          </div>

        </div>

        {/* Success Modal */}
        {showSuccess && (
          <div 
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4"
            onClick={() => { setShowSuccess(false); handleClose(); }}
          >
            <div 
              className="modal-anim f-dm relative max-w-sm w-full bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Success Icon */}
              <div className="mb-4 sm:mb-6 flex justify-center">
                <div className="rounded-full bg-green-100 p-3 sm:p-4">
                  <svg className="h-8 w-8 sm:h-12 sm:w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>

              <h3 className="f-bebas mb-2 sm:mb-3 text-2xl sm:text-[36px] tracking-[1px] text-gray-900">
                Registration Successful!
              </h3>
              <p className="mb-1 sm:mb-2 text-sm sm:text-base md:text-[16px] text-gray-600">
                You're all set for <span className="font-semibold" style={{ color: event.color }}>{event.title}</span>
              </p>
              <p className="mb-4 sm:mb-6 text-xs sm:text-sm md:text-[14px] text-gray-500">
                Check your email for confirmation and event details.
              </p>

              <button
                className="f-mono w-full rounded-lg py-2 sm:py-3 text-[11px] sm:text-[12px] uppercase tracking-[1.5px] sm:tracking-[2px] text-white transition-all duration-300 hover:scale-105"
                style={{ background: event.color }}
                onClick={() => { setShowSuccess(false); handleClose(); }}
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </div>
    </>,
    document.body
  );
}
