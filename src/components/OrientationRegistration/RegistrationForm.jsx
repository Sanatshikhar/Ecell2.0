import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import PocketBase from "pocketbase";
import defaultPb from "../../lib/pocketbase";
import Mascot from "./Mascot";
import CustomSelect from "./CustomSelect";
import {
  Code2,
  Video,
  Calendar,
  Users,
  FileText,
  Palette,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  User,
  Building2,
  GraduationCap
} from "lucide-react";

import bannerImg from "./assets/banner.png";
import logoImg from "./assets/ecell-logo.jpg";
import monogramImg from "./assets/ec-monogram.png";
import bgPatternImg from "./assets/bg-pattern.png";

// Allow orientation-specific PB URL if configured, otherwise fallback to project's configured PB
const pb = process.env.REACT_APP_ORIENTATION_DB_URL
  ? new PocketBase(process.env.REACT_APP_ORIENTATION_DB_URL)
  : defaultPb;

const TEAMS = [
  { id: "Technical", label: "Technical", description: "Web, App & Dev", icon: Code2 },
  { id: "Media", label: "Media", description: "Photography & Reels", icon: Video },
  { id: "Event Management", label: "Event Management", description: "Logistics & Planning", icon: Calendar },
  { id: "Public Relation", label: "Public Relation", description: "Outreach & Corporate", icon: Users },
  { id: "Content", label: "Content", description: "Copywriting & Blogs", icon: FileText },
  { id: "Design", label: "Design", description: "UI/UX & Posters", icon: Palette }
];

const BRANCHES = [
  "Computer Science and Engineering (CSE)",
  "CSE with Artificial Intelligence and Machine Learning (AI & ML)",
  "CSE with Data Science",
  "CSE with Cyber Security",
  "CSE with Internet of Things (IoT)",
  "Computer Science and Information Technology (CSIT)",
  "Electronics and Communication Engineering (ECE)",
  "Electrical and Electronics Engineering (EEE)",
  "Electrical Engineering (EE)",
  "Mechanical Engineering (ME)",
  "Civil Engineering (CE)",
  "Other"
];

const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

export default function RegistrationForm() {
  const [formData, setFormData] = useState({
    name: "",
    registration_number: "",
    email: "",
    branch: "",
    section: "",
    year: "",
    team: []
  });

  const [activeField, setActiveField] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [keyboardOffset, setKeyboardOffset] = useState(12);

  // Refs for GSAP animations
  const containerRef = useRef(null);
  const bannerRef = useRef(null);
  const cardRef = useRef(null);
  const leftColRef = useRef(null);
  const rightColRef = useRef(null);
  const formFieldsRef = useRef([]);
  const teamGridRef = useRef(null);
  const submitRef = useRef(null);
  const footerRef = useRef(null);

  // GSAP entrance animation
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Banner
      if (bannerRef.current) {
        tl.fromTo(
          bannerRef.current,
          { opacity: 0, y: -25, scale: 0.98 },
          { opacity: 1, y: 0, scale: 1, duration: 0.6 }
        );
      }

      // Card container
      tl.fromTo(
        cardRef.current,
        { opacity: 0, y: 40, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.7 },
        "-=0.3"
      );

      // Left column content
      tl.fromTo(
        leftColRef.current,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.5 },
        "-=0.4"
      );

      // Form fields stagger
      const fields = formFieldsRef.current.filter(Boolean);
      if (fields.length > 0) {
        tl.fromTo(
          fields,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.4, stagger: 0.06 },
          "-=0.3"
        );
      }

      // Team grid
      if (teamGridRef.current) {
        const cards = teamGridRef.current.querySelectorAll(".team-card");
        tl.fromTo(
          cards,
          { opacity: 0, scale: 0.9, y: 10 },
          { opacity: 1, scale: 1, y: 0, duration: 0.35, stagger: 0.05 },
          "-=0.2"
        );
      }

      // Submit button
      if (submitRef.current) {
        tl.fromTo(
          submitRef.current,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.4 },
          "-=0.15"
        );
      }

      // Right column (desktop mascot panel)
      if (rightColRef.current) {
        tl.fromTo(
          rightColRef.current,
          { opacity: 0, x: 30 },
          { opacity: 1, x: 0, duration: 0.6 },
          "-=0.5"
        );
      }

      // Footer
      if (footerRef.current) {
        tl.fromTo(
          footerRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.4 },
          "-=0.2"
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Detect virtual keyboard via VisualViewport API
  useEffect(() => {
    const handleViewportChange = () => {
      if (window.visualViewport) {
        const vv = window.visualViewport;
        const overlap = window.innerHeight - vv.height - vv.offsetTop;
        setKeyboardOffset(overlap > 80 ? overlap + 12 : 12);
      }
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", handleViewportChange);
      window.visualViewport.addEventListener("scroll", handleViewportChange);
    }
    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", handleViewportChange);
        window.visualViewport.removeEventListener("scroll", handleViewportChange);
      }
    };
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Full name is required.";
    if (!formData.registration_number.trim()) newErrors.registration_number = "Registration number is required.";
    if (!formData.email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!formData.branch) newErrors.branch = "Please select your branch.";
    if (!formData.section.trim()) newErrors.section = "Section is required.";
    if (!formData.year) newErrors.year = "Please select your academic year.";
    if (!formData.team?.length) newErrors.team = "Please select at least one team.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleToggleTeam = (teamId) => {
    setFormData((prev) => {
      const exists = prev.team.includes(teamId);
      return { ...prev, team: exists ? prev.team.filter((t) => t !== teamId) : [...prev.team, teamId] };
    });
    setActiveField("team");
    if (errors.team) setErrors((prev) => ({ ...prev, team: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage(null);
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await pb.collection("registrations").create({
        name: formData.name.trim(),
        registration_number: formData.registration_number.trim(),
        email: formData.email.trim(),
        branch: formData.branch,
        section: formData.section.trim(),
        year: formData.year,
        team: formData.team.join(", ")
      });

      setStatusMessage({ type: "success", title: "Registration Successful!", text: "Welcome to E-Cell." });
      setFormData({ name: "", registration_number: "", email: "", branch: "", section: "", year: "", team: [] });
      setErrors({});
    } catch (err) {
      console.error("PocketBase registration error:", err);
      setStatusMessage({ type: "error", title: "Registration failed.", text: err?.message || "Could not save registration." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const effectiveBottomPx = keyboardOffset > 12 ? keyboardOffset : activeField && activeField !== "team" ? 260 : 12;

  const addFieldRef = (el, index) => {
    if (el) formFieldsRef.current[index] = el;
  };

  return (
    <div ref={containerRef} className="min-h-screen w-full flex flex-col items-center justify-start sm:justify-center p-3 sm:p-6 md:p-10 overflow-x-hidden relative">

      {/* MOBILE FLOATING MASCOT */}
      <div
        className="lg:hidden fixed right-3 z-50 flex flex-col items-end pointer-events-auto transition-all duration-300 ease-out"
        style={{ bottom: `${effectiveBottomPx}px` }}
      >
        <Mascot activeField={activeField} statusState={statusMessage} selectedTeams={formData.team} isFloating={true} />
      </div>

      {/* Top Hero Banner */}
      <div
        ref={bannerRef}
        className="w-full max-w-5xl mb-4 sm:mb-6 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl shadow-purple-950/40 border border-purple-200/25 bg-purple-950/30 backdrop-blur-sm gsap-hidden"
      >
        <img
          src={bannerImg}
          alt="Innovation & Entrepreneurship Cell Banner"
          className="w-full h-auto object-cover object-center block select-none"
          loading="eager"
        />
      </div>

      {/* Main Card */}
      <div ref={cardRef} className="w-full max-w-5xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl shadow-black/15 flex flex-col lg:flex-row gsap-hidden">

        {/* LEFT: Form */}
        <div ref={leftColRef} className="w-full lg:w-[58%] p-5 sm:p-8 md:p-10 flex flex-col justify-between rounded-t-2xl sm:rounded-t-3xl lg:rounded-t-none lg:rounded-l-2xl lg:sm:rounded-l-3xl">
          <div>
            {/* Logo */}
            <div ref={(el) => addFieldRef(el, 0)} className="flex items-center gap-2.5 mb-5">
              <img
                src={logoImg}
                alt="E-Cell Logo"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover shadow-sm border border-slate-200"
                onError={(e) => { e.target.onerror = null; e.target.src = monogramImg; }}
              />
              <span className="font-bold text-sm sm:text-base text-slate-800 tracking-wide">E-CELL</span>
            </div>

            <h2 ref={(el) => addFieldRef(el, 1)} className="text-xl sm:text-2xl md:text-[28px] font-bold text-slate-900 mb-1">
              Registration Form
            </h2>
            <p ref={(el) => addFieldRef(el, 2)} className="text-xs sm:text-sm text-slate-400 mb-6">
              Fill out your details below to join the E-Cell team.
            </p>

            {/* Notification */}
            {statusMessage && (
              <div
                className={`mb-5 p-3.5 sm:p-4 rounded-xl border flex items-start gap-3 ${
                  statusMessage.type === "success"
                    ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                    : "bg-rose-50 border-rose-200 text-rose-800"
                }`}
              >
                {statusMessage.type === "success" ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                )}
                <div>
                  <h4 className="font-semibold text-sm">{statusMessage.title}</h4>
                  <p className="text-xs opacity-80 mt-0.5">{statusMessage.text}</p>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate className="space-y-4">

              {/* Full Name */}
              <div ref={(el) => addFieldRef(el, 3)}>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-indigo-500" /> Full Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onFocus={() => setActiveField("name")}
                  onBlur={() => setActiveField(null)}
                  placeholder="Enter full name"
                  className={`w-full py-2.5 px-3.5 rounded-xl border text-base sm:text-sm text-slate-800 bg-slate-50/80 focus:outline-none orientation-input-field ${
                    errors.name ? "border-rose-300 bg-rose-50/40" : "border-slate-200"
                  }`}
                />
                {errors.name && <p className="mt-1 text-[11px] text-rose-500 font-medium">{errors.name}</p>}
              </div>

              {/* Reg Number & Email */}
              <div ref={(el) => addFieldRef(el, 4)} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Registration Number <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="registration_number"
                    value={formData.registration_number}
                    onChange={handleChange}
                    onFocus={() => setActiveField("registration_number")}
                    onBlur={() => setActiveField(null)}
                    placeholder="Enter registration number"
                    className={`w-full py-2.5 px-3.5 rounded-xl border text-base sm:text-sm text-slate-800 bg-slate-50/80 focus:outline-none orientation-input-field ${
                      errors.registration_number ? "border-rose-300 bg-rose-50/40" : "border-slate-200"
                    }`}
                  />
                  {errors.registration_number && <p className="mt-1 text-[11px] text-rose-500 font-medium">{errors.registration_number}</p>}
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Email Address <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setActiveField("email")}
                    onBlur={() => setActiveField(null)}
                    placeholder="Enter email address"
                    className={`w-full py-2.5 px-3.5 rounded-xl border text-base sm:text-sm text-slate-800 bg-slate-50/80 focus:outline-none orientation-input-field ${
                      errors.email ? "border-rose-300 bg-rose-50/40" : "border-slate-200"
                    }`}
                  />
                  {errors.email && <p className="mt-1 text-[11px] text-rose-500 font-medium">{errors.email}</p>}
                </div>
              </div>

              {/* Branch, Section, Year */}
              <div ref={(el) => addFieldRef(el, 5)} className="grid grid-cols-1 sm:grid-cols-3 gap-4 relative z-20">
                <CustomSelect
                  label="Branch"
                  name="branch"
                  value={formData.branch}
                  options={BRANCHES}
                  placeholder="Select Branch"
                  onChange={handleChange}
                  onFocus={() => setActiveField("branch")}
                  onBlur={() => setActiveField(null)}
                  error={errors.branch}
                  icon={Building2}
                />

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Section <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="section"
                    value={formData.section}
                    onChange={handleChange}
                    onFocus={() => setActiveField("section")}
                    onBlur={() => setActiveField(null)}
                    placeholder="Enter section"
                    className={`w-full py-2.5 px-3.5 rounded-xl border text-base sm:text-sm text-slate-800 bg-slate-50/80 focus:outline-none orientation-input-field ${
                      errors.section ? "border-rose-300 bg-rose-50/40" : "border-slate-200"
                    }`}
                  />
                  {errors.section && <p className="mt-1 text-[11px] text-rose-500 font-medium">{errors.section}</p>}
                </div>

                <CustomSelect
                  label="Year"
                  name="year"
                  value={formData.year}
                  options={YEARS}
                  placeholder="Select Year"
                  onChange={handleChange}
                  onFocus={() => setActiveField("year")}
                  onBlur={() => setActiveField(null)}
                  error={errors.year}
                  icon={GraduationCap}
                />
              </div>

              {/* Team Selection */}
              <div ref={(el) => addFieldRef(el, 6)}>
                <div className="flex items-center justify-between mb-2.5">
                  <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Team(s) to Join <span className="text-rose-400">*</span>
                  </label>
                  <span className="text-[10px] text-indigo-500 font-semibold bg-indigo-50 px-2 py-0.5 rounded-full">
                    Select one or more
                  </span>
                </div>

                <div ref={teamGridRef} className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {TEAMS.map((t) => {
                    const IconComponent = t.icon;
                    const isSelected = formData.team.includes(t.id);

                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => handleToggleTeam(t.id)}
                        className={`team-card p-3 rounded-xl border text-left cursor-pointer flex flex-col gap-1.5 ${
                          isSelected
                            ? "bg-indigo-50 border-indigo-300 ring-1 ring-indigo-200"
                            : "bg-slate-50/80 border-slate-200 hover:border-indigo-200"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <IconComponent className={`w-4 h-4 transition-colors duration-200 ${isSelected ? "text-indigo-600" : "text-slate-400"}`} />
                          <div className={`w-4 h-4 rounded border-[1.5px] flex items-center justify-center transition-all duration-200 ${
                            isSelected ? "bg-indigo-500 border-indigo-500" : "border-slate-300"
                          }`}>
                            {isSelected && <CheckCircle2 className="w-3 h-3 text-white" />}
                          </div>
                        </div>
                        <span className={`text-xs font-semibold transition-colors duration-200 ${isSelected ? "text-indigo-700" : "text-slate-700"}`}>
                          {t.label}
                        </span>
                        <span className={`text-[10px] leading-tight transition-colors duration-200 ${isSelected ? "text-indigo-400" : "text-slate-400"}`}>
                          {t.description}
                        </span>
                      </button>
                    );
                  })}
                </div>
                {errors.team && <p className="mt-1 text-[11px] text-rose-500 font-medium">{errors.team}</p>}
              </div>

              {/* Submit */}
              <div ref={submitRef} className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full sm:w-auto py-3 px-10 rounded-full font-semibold text-sm text-white flex items-center justify-center gap-2.5 cursor-pointer ${
                    isSubmitting ? "bg-slate-300 cursor-not-allowed" : "btn-submit shadow-lg shadow-indigo-500/20"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Registering...</span>
                    </>
                  ) : (
                    <>
                      <span>Register Now</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* RIGHT: Desktop Mascot Panel */}
        <div
          ref={rightColRef}
          className="hidden lg:flex w-full lg:w-[42%] bg-gradient-to-br from-[#2e1065] via-[#4c1d95] to-[#581c87] p-6 lg:p-10 text-white relative flex-col items-center justify-center overflow-hidden min-h-[400px] lg:min-h-full shrink-0 rounded-b-2xl sm:rounded-b-3xl lg:rounded-b-none lg:rounded-r-2xl lg:sm:rounded-r-3xl gsap-hidden"
        >
          {/* Background pattern */}
          <div
            className="absolute inset-0 bg-repeat bg-[length:260px_auto] opacity-10 mix-blend-overlay pointer-events-none"
            style={{ backgroundImage: `url(${bgPatternImg})` }}
          />

          {/* Mascot */}
          <div className="relative z-10 w-full flex items-center justify-center my-auto">
            <Mascot activeField={activeField} statusState={statusMessage} selectedTeams={formData.team} isFloating={false} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <p ref={footerRef} className="text-xs text-indigo-200/50 mt-5 sm:mt-7 font-medium text-center gsap-hidden">
        Innovation & Entrepreneurship Cell © {new Date().getFullYear()}
      </p>
    </div>
  );
}
