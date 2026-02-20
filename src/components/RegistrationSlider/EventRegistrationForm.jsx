import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

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
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

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

  if (!isOpen || !event) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^(\+91|91|0)?[6-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = "Invalid phone number";
    }
    if (!formData.course.trim()) newErrors.course = "Course/Branch is required";
    if (!formData.regNo.trim()) newErrors.regNo = "Registration number is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    
    try {
      // Simulate API call - replace with actual backend integration
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      const registrationData = {
        ...formData,
        eventId: event.id,
        eventTitle: event.title,
        eventDate: event.date,
        eventTime: event.time,
        eventTag: event.tag,
      };
      
      console.log("Registration data:", registrationData);
      
      // TODO: Replace with actual API call to PocketBase or your backend
      // await pb.collection('eventRegistrations').create(registrationData);
      
      setShowSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        course: "",
        regNo: "",
      });
    } catch (err) {
      console.error("Registration error:", err);
      alert("Error submitting registration. Please try again.");
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
    });
    setErrors({});
    onClose();
  };

  return createPortal(
    <>
      <style>{KEYFRAMES}</style>
      
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-[999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
        onClick={handleClose}
      >
        {/* Noise overlay */}
        <div
          className="pointer-events-none fixed inset-0 opacity-30"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")` }}
        />

        {/* Modal Container */}
        <div 
          className="modal-anim f-dm relative w-full max-w-2xl bg-[#050508] rounded-[20px] border border-white/10 overflow-hidden my-8"
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
          <div className="relative z-[2] p-8">
            {/* Header */}
            <div className="mb-8">
              <span
                className="f-mono inline-block rounded-full border px-3.5 py-1.5 text-[10px] uppercase tracking-[4px] mb-4"
                style={{ color: event.color, borderColor: event.color + "44" }}
              >
                {event.tag}
              </span>
              <h2 className="f-bebas m-0 mb-2 text-[48px] leading-[0.9] tracking-[1px] text-white">
                {event.title}
              </h2>
              <p className="f-dm text-[14px] text-white/50 mb-4">{event.subtitle}</p>
              
              {/* Event Details (Locked) */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3 backdrop-blur-sm">
                  <span className="f-mono block text-[10px] uppercase tracking-[1px] text-white/40 mb-1">Date</span>
                  <span className="f-dm text-[14px] font-medium text-white">{event.date}</span>
                </div>
                <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3 backdrop-blur-sm">
                  <span className="f-mono block text-[10px] uppercase tracking-[1px] text-white/40 mb-1">Time</span>
                  <span className="f-bebas text-[20px] tracking-[0.5px]" style={{ color: event.color }}>{event.time}</span>
                </div>
              </div>

              <div className="h-px opacity-20 mb-6" style={{ background: event.color }} />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label className="f-mono mb-2 block text-[11px] uppercase tracking-[1px] text-white/60">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-white placeholder:text-white/30 backdrop-blur-sm transition-all duration-200 focus:border-white/25 focus:bg-white/[0.06] focus:outline-none"
                />
                {errors.name && (
                  <span className="f-dm mt-1 block text-[12px] text-red-400">{errors.name}</span>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="f-mono mb-2 block text-[11px] uppercase tracking-[1px] text-white/60">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-white placeholder:text-white/30 backdrop-blur-sm transition-all duration-200 focus:border-white/25 focus:bg-white/[0.06] focus:outline-none"
                />
                {errors.email && (
                  <span className="f-dm mt-1 block text-[12px] text-red-400">{errors.email}</span>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="f-mono mb-2 block text-[11px] uppercase tracking-[1px] text-white/60">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 9876543210"
                  className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-white placeholder:text-white/30 backdrop-blur-sm transition-all duration-200 focus:border-white/25 focus:bg-white/[0.06] focus:outline-none"
                />
                {errors.phone && (
                  <span className="f-dm mt-1 block text-[12px] text-red-400">{errors.phone}</span>
                )}
              </div>

              {/* Course/Branch and Reg No in grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Course/Branch */}
                <div>
                  <label className="f-mono mb-2 block text-[11px] uppercase tracking-[1px] text-white/60">
                    Course/Branch *
                  </label>
                  <input
                    type="text"
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                    placeholder="e.g., B.Tech CSE"
                    className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-white placeholder:text-white/30 backdrop-blur-sm transition-all duration-200 focus:border-white/25 focus:bg-white/[0.06] focus:outline-none"
                  />
                  {errors.course && (
                    <span className="f-dm mt-1 block text-[12px] text-red-400">{errors.course}</span>
                  )}
                </div>

                {/* Registration Number */}
                <div>
                  <label className="f-mono mb-2 block text-[11px] uppercase tracking-[1px] text-white/60">
                    Registration No. *
                  </label>
                  <input
                    type="text"
                    name="regNo"
                    value={formData.regNo}
                    onChange={handleChange}
                    placeholder="Your Reg/App No."
                    className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-white placeholder:text-white/30 backdrop-blur-sm transition-all duration-200 focus:border-white/25 focus:bg-white/[0.06] focus:outline-none"
                  />
                  {errors.regNo && (
                    <span className="f-dm mt-1 block text-[12px] text-red-400">{errors.regNo}</span>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="f-mono mt-6 w-full cursor-pointer rounded-lg border px-6 py-4 text-[12px] uppercase tracking-[2px] text-white transition-all duration-300 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
                style={{
                  borderColor: event.color + "44",
                  background: loading ? event.color + "33" : event.color + "22",
                  color: loading ? event.color : "white",
                }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing...
                  </span>
                ) : (
                  "Complete Registration"
                )}
              </button>
            </form>
          </div>

          {/* Progress indicator at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ background: event.color + "33" }}>
            <div className="h-full w-1/3" style={{ background: event.color }} />
          </div>
        </div>

        {/* Success Modal */}
        {showSuccess && (
          <div 
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => { setShowSuccess(false); handleClose(); }}
          >
            <div 
              className="modal-anim f-dm relative max-w-md w-full bg-white rounded-2xl p-8 text-center shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Success Icon */}
              <div className="mb-6 flex justify-center">
                <div className="rounded-full bg-green-100 p-4">
                  <svg className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>

              <h3 className="f-bebas mb-3 text-[36px] tracking-[1px] text-gray-900">
                Registration Successful!
              </h3>
              <p className="mb-2 text-[16px] text-gray-600">
                You're all set for <span className="font-semibold" style={{ color: event.color }}>{event.title}</span>
              </p>
              <p className="mb-6 text-[14px] text-gray-500">
                Check your email for confirmation and event details.
              </p>

              <button
                className="f-mono w-full rounded-lg py-3 text-[12px] uppercase tracking-[2px] text-white transition-all duration-300 hover:scale-105"
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
