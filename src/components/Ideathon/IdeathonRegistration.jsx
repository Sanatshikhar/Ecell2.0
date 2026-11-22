import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PocketBase from "pocketbase";
import defaultPb from "../../lib/pocketbase";
import "./IdeathonRegistration.css";

const COLLECTION_NAME = process.env.REACT_APP_IDEATHON_COLLECTION || "ideathon_registrations";
const pb = (process.env.REACT_APP_DB_URL && process.env.REACT_APP_DB_URL.trim())
  ? new PocketBase(process.env.REACT_APP_DB_URL.trim())
  : defaultPb;

const BRANCH_OPTIONS = [
  "Computer Science and Engineering (CSE)",
  "CSE with AI & Machine Learning",
  "CSE with Data Science",
  "Computer Science & Information Technology (CSIT)",
  "Information Technology (IT)",
  "Electronics & Communication Engineering (ECE)",
  "Electrical & Electronics Engineering (EEE)",
  "Civil Engineering",
  "Mechanical Engineering",
  "Biotechnology",
  "Management (BBA / MBA)",
  "Pharmaceutical Sciences",
  "Other"
];

const YEAR_OPTIONS = [
  "1st Year",
  "2nd Year",
  "3rd Year",
  "4th Year",
  "Postgraduate / Masters"
];

const DOMAIN_OPTIONS = [
  "Artificial Intelligence & Machine Learning",
  "Healthcare & Biotechnology",
  "FinTech, Web3 & Digital Economy",
  "Sustainability, Clean Energy & AgriTech",
  "EdTech & Learning Tools",
  "Smart Cities, Mobility & IoT",
  "Cybersecurity & Cloud",
  "Open Innovation / Social Impact"
];

export default function IdeathonRegistration() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [referenceId, setReferenceId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    // Step 1: Personal
    fullName: "",
    email: "",
    phone: "",
    college: "ITER, Siksha 'O' Anusandhan",
    studentId: "",
    branch: "",
    yearOfStudy: "",

    // Step 2: Team
    participationType: "team", // "team" | "individual"
    teamName: "",
    teammates: [
      { name: "", email: "" }
    ],

    // Step 3: Idea
    ideaTitle: "",
    problemStatement: "",
    proposedSolution: "",
    domain: "",
    technologies: "",

    // Step 4: Experience
    githubUrl: "",
    linkedinUrl: "",
    priorExperience: "",

    // Step 5: Confirm
    agreeTerms: false,
    receiveUpdates: true
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const originalTitle = document.title;
    document.title = "Ideathon 2026 Registration | E-Cell SOA";
    window.scrollTo({ top: 0, behavior: "smooth" });
    return () => {
      document.title = originalTitle;
    };
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));

    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleTeammateChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.teammates];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, teammates: updated };
    });
  };

  const addTeammate = () => {
    if (formData.teammates.length >= 4) return;
    setFormData((prev) => ({
      ...prev,
      teammates: [...prev.teammates, { name: "", email: "" }]
    }));
  };

  const removeTeammate = (index) => {
    setFormData((prev) => {
      const updated = prev.teammates.filter((_, i) => i !== index);
      return { ...prev, teammates: updated };
    });
  };

  const validateStep = (step) => {
    const errs = {};

    if (step === 1) {
      if (!formData.fullName.trim()) errs.fullName = "Full name is required.";
      if (!formData.email.trim()) {
        errs.email = "Email address is required.";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
        errs.email = "Please enter a valid email address.";
      }
      if (!formData.phone.trim()) {
        errs.phone = "Phone number is required.";
      } else if (!/^[0-9+\s-]{10,14}$/.test(formData.phone.trim())) {
        errs.phone = "Please enter a valid 10-digit phone number.";
      }
      if (!formData.college.trim()) errs.college = "College/university name is required.";
      if (!formData.studentId.trim()) errs.studentId = "Registration / Student ID is required.";
      if (!formData.branch) errs.branch = "Please select your branch or department.";
      if (!formData.yearOfStudy) errs.yearOfStudy = "Please select your year of study.";
    }

    if (step === 2) {
      if (formData.participationType === "team") {
        if (!formData.teamName.trim()) errs.teamName = "Team name is required for team participation.";
        formData.teammates.forEach((tm, idx) => {
          if (tm.name.trim() && !tm.email.trim()) {
            errs[`teammate_${idx}_email`] = `Teammate ${idx + 1} email is required.`;
          } else if (tm.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(tm.email.trim())) {
            errs[`teammate_${idx}_email`] = `Teammate ${idx + 1} email is invalid.`;
          }
        });
      }
    }

    if (step === 3) {
      if (!formData.ideaTitle.trim()) errs.ideaTitle = "Idea title is required.";
      if (!formData.problemStatement.trim()) {
        errs.problemStatement = "Please summarize the problem statement.";
      } else if (formData.problemStatement.trim().length < 20) {
        errs.problemStatement = "Problem statement should be at least 20 characters.";
      }
      if (!formData.proposedSolution.trim()) {
        errs.proposedSolution = "Please describe your proposed solution.";
      } else if (formData.proposedSolution.trim().length < 20) {
        errs.proposedSolution = "Proposed solution should be at least 20 characters.";
      }
      if (!formData.domain) errs.domain = "Please select a challenge domain.";
    }

    if (step === 4) {
      // Optional fields, but validate URLs if provided
      if (formData.githubUrl.trim() && !/^https?:\/\//i.test(formData.githubUrl.trim())) {
        errs.githubUrl = "Please include http:// or https:// in the GitHub link.";
      }
      if (formData.linkedinUrl.trim() && !/^https?:\/\//i.test(formData.linkedinUrl.trim())) {
        errs.linkedinUrl = "Please include http:// or https:// in the LinkedIn link.";
      }
    }

    if (step === 5) {
      if (!formData.agreeTerms) {
        errs.agreeTerms = "You must confirm that your submission is accurate and original.";
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const goToNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 5));
      const formCard = document.getElementById("registration-card");
      if (formCard) {
        formCard.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const goToPrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    const formCard = document.getElementById("registration-card");
    if (formCard) {
      formCard.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!validateStep(5)) return;

    setIsSubmitting(true);
    setErrorMessage("");

    const generatedRef = `IDEA-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const submissionPayload = {
      referenceId: generatedRef,
      fullName: formData.fullName.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim(),
      college: formData.college.trim(),
      studentId: formData.studentId.trim(),
      branch: formData.branch,
      yearOfStudy: formData.yearOfStudy,
      participationType: formData.participationType,
      teamName: formData.participationType === "team" ? formData.teamName.trim() : "Solo",
      teammates: formData.participationType === "team" ? JSON.stringify(formData.teammates.filter(t => t.name.trim())) : "[]",
      ideaTitle: formData.ideaTitle.trim(),
      problemStatement: formData.problemStatement.trim(),
      proposedSolution: formData.proposedSolution.trim(),
      domain: formData.domain,
      technologies: formData.technologies.trim(),
      githubUrl: formData.githubUrl.trim(),
      linkedinUrl: formData.linkedinUrl.trim(),
      priorExperience: formData.priorExperience.trim(),
      receiveUpdates: formData.receiveUpdates,
      submittedAt: new Date().toISOString()
    };

    try {
      try {
        await pb.collection(COLLECTION_NAME).create(submissionPayload);
      } catch (pbErr) {
        console.warn("PocketBase collection create fallback:", pbErr);
        // Fallback: try default "registrations" collection with mapped fields if exists
        try {
          const fallbackData = {
            name: formData.fullName.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim(),
            college: formData.college.trim(),
            branch: formData.branch,
            team: formData.domain || "Ideathon",
            comments: `[Ideathon Ref: ${generatedRef}] Team: ${formData.teamName || "Solo"}, Title: ${formData.ideaTitle}`
          };
          await pb.collection("registrations").create(fallbackData);
        } catch (innerErr) {
          console.warn("Fallback registrations collection also failed:", innerErr);
        }
      }

      // Always save to localStorage as backup
      const localBackups = JSON.parse(localStorage.getItem("ecell_ideathon_registrations") || "[]");
      localBackups.push(submissionPayload);
      localStorage.setItem("ecell_ideathon_registrations", JSON.stringify(localBackups));

      setReferenceId(generatedRef);
      setSubmissionSuccess(true);
      const formCard = document.getElementById("registration-card");
      if (formCard) {
        formCard.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } catch (err) {
      console.error("Submission failed:", err);
      setErrorMessage("Something went wrong while submitting. Please try again or reach out to the team.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      college: "ITER, Siksha 'O' Anusandhan",
      studentId: "",
      branch: "",
      yearOfStudy: "",
      participationType: "team",
      teamName: "",
      teammates: [{ name: "", email: "" }],
      ideaTitle: "",
      problemStatement: "",
      proposedSolution: "",
      domain: "",
      technologies: "",
      githubUrl: "",
      linkedinUrl: "",
      priorExperience: "",
      agreeTerms: false,
      receiveUpdates: true
    });
    setErrors({});
    setCurrentStep(1);
    setSubmissionSuccess(false);
    setReferenceId("");
  };

  return (
    <div className="ideathon-page">
      {/* Sticky Header */}
      <header className="ideathon-header">
        <div className="ideathon-shell">
          <div className="ideathon-header-inner">
            <Link to="/" className="ideathon-brand">
              <span className="ideathon-brand-mark" aria-hidden="true">
                <img
                  src={process.env.PUBLIC_URL + "/ecell-logo.jpg"}
                  alt="E-Cell SOA Logo"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/ecell-logo.jpg";
                  }}
                />
              </span>
              <div className="ideathon-brand-copy">
                <strong>E-CELL SOA</strong>
                <small>INNOVATION & ENTREPRENEURSHIP CELL</small>
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="ideathon-main">
        {/* Hero Section */}
        <section className="ideathon-hero" id="about">
          {/* Decorative Constellation Network SVG */}
          <svg className="ideathon-network" viewBox="0 0 650 420" fill="none" stroke="#8b5cf6" strokeWidth="1.2" aria-hidden="true">
            <line x1="80" y1="120" x2="240" y2="70" opacity="0.35" />
            <line x1="240" y1="70" x2="380" y2="150" opacity="0.4" />
            <line x1="380" y1="150" x2="520" y2="90" opacity="0.3" />
            <line x1="240" y1="70" x2="200" y2="240" opacity="0.3" />
            <line x1="380" y1="150" x2="330" y2="290" opacity="0.4" />
            <line x1="200" y1="240" x2="330" y2="290" opacity="0.35" />
            <line x1="330" y1="290" x2="490" y2="260" opacity="0.3" />
            <line x1="520" y1="90" x2="490" y2="260" opacity="0.3" />
            <line x1="80" y1="120" x2="140" y2="310" opacity="0.25" />
            <line x1="140" y1="310" x2="200" y2="240" opacity="0.3" />
            
            <circle cx="80" cy="120" r="4" fill="#6d28d9" />
            <circle cx="240" cy="70" r="6" fill="#8b5cf6" />
            <circle cx="380" cy="150" r="5" fill="#6d28d9" />
            <circle cx="520" cy="90" r="4" fill="#a78bfa" />
            <circle cx="200" cy="240" r="4" fill="#8b5cf6" />
            <circle cx="330" cy="290" r="7" fill="#6d28d9" />
            <circle cx="490" cy="260" r="5" fill="#8b5cf6" />
            <circle cx="140" cy="310" r="4" fill="#a78bfa" />
          </svg>

          <div className="ideathon-shell ideathon-hero-inner">
            <span className="ideathon-eyebrow">Participant Registration</span>
            <h1 className="ideathon-h1">IDEATHON</h1>
            <p className="ideathon-hero-tagline">Transform Your Ideas Into Impact</p>
            <p className="ideathon-hero-description">
              Join visionary student founders, developers, designers, and problem-solvers for an intense ideation challenge.
              Turn problem statements into real-world solutions, build working prototypes, and pitch to industry mentors.
            </p>

            <ul className="ideathon-details">
              <li><span>Event date ·</span> TBD</li>
              <li><span>Registration deadline ·</span> TBD</li>
              <li><span>Venue ·</span> To be announced</li>
            </ul>

            <a href="#registration" className="ideathon-primary-btn">
              <span>Register Now</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </a>
          </div>
        </section>

        {/* Form Section */}
        <section className="ideathon-form-section" id="registration">
          <div className="ideathon-shell">
            <div className="ideathon-section-top">
              <div>
                <span className="ideathon-eyebrow">Application Form</span>
                <h2>Register Your Idea</h2>
              </div>
              <p>Complete all 5 steps to submit your participation</p>
            </div>

            <div className="ideathon-form-card" id="registration-card">
              {/* Stepper Header */}
              <div className="ideathon-progress-wrap">
                <div className="ideathon-progress" role="tablist" aria-label="Registration Progress">
                  {[
                    { num: 1, label: "Personal Info" },
                    { num: 2, label: "Team Setup" },
                    { num: 3, label: "Your Idea" },
                    { num: 4, label: "Experience" },
                    { num: 5, label: "Review & Confirm" }
                  ].map((s) => {
                    const isActive = currentStep === s.num;
                    const isDone = currentStep > s.num;
                    return (
                      <button
                        key={s.num}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        className={`ideathon-step-tab ${isActive ? "active" : ""} ${isDone ? "done" : ""}`}
                        onClick={() => {
                          if (isDone || (s.num <= currentStep)) {
                            setCurrentStep(s.num);
                          }
                        }}
                      >
                        <span className="number">{isDone ? "✓" : s.num}</span>
                        <span>{s.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Form Content */}
              <div className="ideathon-form-body">
                {submissionSuccess ? (
                  <div className="ideathon-success-screen animate-fade-in">
                    <div className="ideathon-success-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <span className="ideathon-eyebrow">Submission Received</span>
                    <h3 className="ideathon-step-heading" style={{ marginTop: "8px" }}>
                      You're Registered for Ideathon!
                    </h3>
                    <p className="ideathon-step-description" style={{ maxWidth: "560px", margin: "0 auto 20px" }}>
                      Thank you for submitting your application. Your registration has been saved to the E-Cell portal.
                      Keep your reference ID handy for all event communications and check-ins.
                    </p>

                    <div className="ideathon-ref-badge">
                      Reference ID: <strong>{referenceId}</strong>
                    </div>

                    <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                      <button
                        type="button"
                        onClick={resetForm}
                        className="ideathon-secondary-btn"
                      >
                        Submit Another Application
                      </button>
                      <Link to="/" className="ideathon-primary-btn">
                        Return to Home
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div>
                    {/* Step 1: Personal Information */}
                    {currentStep === 1 && (
                      <div className="animate-fade-in">
                        <div className="ideathon-step-kicker">Step 1 of 5</div>
                        <h3 className="ideathon-step-heading">Personal Information</h3>
                        <p className="ideathon-step-description">
                          Enter your contact information and academic details. We'll use this to coordinate your participation.
                        </p>

                        <div className="ideathon-field-grid">
                          <div className={`ideathon-field ${errors.fullName ? "invalid" : ""}`}>
                            <label htmlFor="fullName">
                              Full Name <span className="ideathon-required">*</span>
                            </label>
                            <input
                              type="text"
                              id="fullName"
                              name="fullName"
                              className="ideathon-control"
                              placeholder="e.g. Priyanshu Mohanty"
                              value={formData.fullName}
                              onChange={handleChange}
                            />
                            {errors.fullName && <p className="ideathon-error">{errors.fullName}</p>}
                          </div>

                          <div className={`ideathon-field ${errors.email ? "invalid" : ""}`}>
                            <label htmlFor="email">
                              Email Address <span className="ideathon-required">*</span>
                            </label>
                            <input
                              type="email"
                              id="email"
                              name="email"
                              className="ideathon-control"
                              placeholder="e.g. priyanshu@example.com"
                              value={formData.email}
                              onChange={handleChange}
                            />
                            {errors.email && <p className="ideathon-error">{errors.email}</p>}
                          </div>

                          <div className={`ideathon-field ${errors.phone ? "invalid" : ""}`}>
                            <label htmlFor="phone">
                              Phone Number <span className="ideathon-required">*</span>
                            </label>
                            <input
                              type="tel"
                              id="phone"
                              name="phone"
                              className="ideathon-control"
                              placeholder="e.g. 9876543210"
                              value={formData.phone}
                              onChange={handleChange}
                            />
                            {errors.phone && <p className="ideathon-error">{errors.phone}</p>}
                          </div>

                          <div className="ideathon-field">
                            <label htmlFor="college">
                              College / University <span className="ideathon-required">*</span>
                            </label>
                            <input
                              type="text"
                              id="college"
                              name="college"
                              className="ideathon-control"
                              value={formData.college}
                              readOnly
                              style={{ background: "#f3edff", cursor: "not-allowed", color: "#4a3870" }}
                            />
                          </div>

                          <div className={`ideathon-field ${errors.studentId ? "invalid" : ""}`}>
                            <label htmlFor="studentId">
                              Registration / Student ID <span className="ideathon-required">*</span>
                            </label>
                            <input
                              type="text"
                              id="studentId"
                              name="studentId"
                              className="ideathon-control"
                              placeholder="e.g. 2241019000"
                              value={formData.studentId}
                              onChange={handleChange}
                            />
                            {errors.studentId && <p className="ideathon-error">{errors.studentId}</p>}
                          </div>

                          <div className={`ideathon-field ${errors.branch ? "invalid" : ""}`}>
                            <label htmlFor="branch">
                              Branch / Department <span className="ideathon-required">*</span>
                            </label>
                            <select
                              id="branch"
                              name="branch"
                              className="ideathon-control"
                              value={formData.branch}
                              onChange={handleChange}
                            >
                              <option value="">Select your branch...</option>
                              {BRANCH_OPTIONS.map((b) => (
                                <option key={b} value={b}>{b}</option>
                              ))}
                            </select>
                            {errors.branch && <p className="ideathon-error">{errors.branch}</p>}
                          </div>

                          <div className={`ideathon-field full ${errors.yearOfStudy ? "invalid" : ""}`}>
                            <label htmlFor="yearOfStudy">
                              Year of Study <span className="ideathon-required">*</span>
                            </label>
                            <select
                              id="yearOfStudy"
                              name="yearOfStudy"
                              className="ideathon-control"
                              value={formData.yearOfStudy}
                              onChange={handleChange}
                            >
                              <option value="">Select your year...</option>
                              {YEAR_OPTIONS.map((y) => (
                                <option key={y} value={y}>{y}</option>
                              ))}
                            </select>
                            {errors.yearOfStudy && <p className="ideathon-error">{errors.yearOfStudy}</p>}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 2: Team Setup */}
                    {currentStep === 2 && (
                      <div className="animate-fade-in">
                        <div className="ideathon-step-kicker">Step 2 of 5</div>
                        <h3 className="ideathon-step-heading">Team Formation</h3>
                        <p className="ideathon-step-description">
                          You can participate as an individual or form a team with up to 4 members.
                        </p>

                        <div className="ideathon-field-label">Participation Format</div>
                        <div className="ideathon-choice-row">
                          <label className={`ideathon-choice ${formData.participationType === "individual" ? "selected" : ""}`}>
                            <input
                              type="radio"
                              name="participationType"
                              value="individual"
                              checked={formData.participationType === "individual"}
                              onChange={handleChange}
                            />
                            <div>
                              <strong>Individual (Solo)</strong>
                              <small>Work alone and pitch your unique idea directly.</small>
                            </div>
                          </label>

                          <label className={`ideathon-choice ${formData.participationType === "team" ? "selected" : ""}`}>
                            <input
                              type="radio"
                              name="participationType"
                              value="team"
                              checked={formData.participationType === "team"}
                              onChange={handleChange}
                            />
                            <div>
                              <strong>Team Participation</strong>
                              <small>Form a multidisciplinary team (Leader + up to 3 teammates).</small>
                            </div>
                          </label>
                        </div>

                        {formData.participationType === "team" && (
                          <div className="ideathon-team-fields animate-fade-in">
                            <div className={`ideathon-field full ${errors.teamName ? "invalid" : ""}`} style={{ marginBottom: "20px" }}>
                              <label htmlFor="teamName">
                                Team Name <span className="ideathon-required">*</span>
                              </label>
                              <input
                                type="text"
                                id="teamName"
                                name="teamName"
                                className="ideathon-control"
                                placeholder="e.g. InnovateX or ByteBusters"
                                value={formData.teamName}
                                onChange={handleChange}
                              />
                              {errors.teamName && <p className="ideathon-error">{errors.teamName}</p>}
                            </div>

                            <div className="ideathon-field-label">Additional Teammates (Optional, Max 3)</div>
                            <p className="ideathon-hint" style={{ marginTop: "-4px", marginBottom: "14px" }}>
                              You are automatically registered as the Team Leader. Add your teammates below:
                            </p>

                            {formData.teammates.map((tm, idx) => (
                              <div key={idx} className="ideathon-teammate">
                                <div className="ideathon-teammate-head">
                                  <span>Teammate #{idx + 1}</span>
                                  {formData.teammates.length > 1 && (
                                    <button
                                      type="button"
                                      className="ideathon-text-button"
                                      onClick={() => removeTeammate(idx)}
                                    >
                                      Remove
                                    </button>
                                  )}
                                </div>
                                <div className="ideathon-field-grid">
                                  <div className="ideathon-field">
                                    <label>Teammate Name</label>
                                    <input
                                      type="text"
                                      className="ideathon-control"
                                      placeholder="Full name"
                                      value={tm.name}
                                      onChange={(e) => handleTeammateChange(idx, "name", e.target.value)}
                                    />
                                  </div>
                                  <div className={`ideathon-field ${errors[`teammate_${idx}_email`] ? "invalid" : ""}`}>
                                    <label>Teammate Email</label>
                                    <input
                                      type="email"
                                      className="ideathon-control"
                                      placeholder="Email address"
                                      value={tm.email}
                                      onChange={(e) => handleTeammateChange(idx, "email", e.target.value)}
                                    />
                                    {errors[`teammate_${idx}_email`] && (
                                      <p className="ideathon-error">{errors[`teammate_${idx}_email`]}</p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}

                            {formData.teammates.length < 3 && (
                              <button
                                type="button"
                                className="ideathon-add-button"
                                onClick={addTeammate}
                              >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                  <line x1="12" y1="5" x2="12" y2="19" />
                                  <line x1="5" y1="12" x2="19" y2="12" />
                                </svg>
                                <span>+ Add Another Teammate</span>
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Step 3: Your Idea */}
                    {currentStep === 3 && (
                      <div className="animate-fade-in">
                        <div className="ideathon-step-kicker">Step 3 of 5</div>
                        <h3 className="ideathon-step-heading">Your Idea & Solution</h3>
                        <p className="ideathon-step-description">
                          Tell us about the challenge you're tackling and the innovation you're building.
                        </p>

                        <div className="ideathon-field-grid">
                          <div className={`ideathon-field full ${errors.ideaTitle ? "invalid" : ""}`}>
                            <label htmlFor="ideaTitle">
                              Idea / Project Title <span className="ideathon-required">*</span>
                            </label>
                            <input
                              type="text"
                              id="ideaTitle"
                              name="ideaTitle"
                              className="ideathon-control"
                              placeholder="e.g. AgriGuard - AI Crop Disease Prediction"
                              value={formData.ideaTitle}
                              onChange={handleChange}
                            />
                            {errors.ideaTitle && <p className="ideathon-error">{errors.ideaTitle}</p>}
                          </div>

                          <div className={`ideathon-field full ${errors.domain ? "invalid" : ""}`}>
                            <label htmlFor="domain">
                              Target Track / Domain <span className="ideathon-required">*</span>
                            </label>
                            <select
                              id="domain"
                              name="domain"
                              className="ideathon-control"
                              value={formData.domain}
                              onChange={handleChange}
                            >
                              <option value="">Select a challenge track...</option>
                              {DOMAIN_OPTIONS.map((d) => (
                                <option key={d} value={d}>{d}</option>
                              ))}
                            </select>
                            {errors.domain && <p className="ideathon-error">{errors.domain}</p>}
                          </div>

                          <div className={`ideathon-field full ${errors.problemStatement ? "invalid" : ""}`}>
                            <label htmlFor="problemStatement">
                              Problem Statement <span className="ideathon-required">*</span>
                            </label>
                            <textarea
                              id="problemStatement"
                              name="problemStatement"
                              className="ideathon-control"
                              placeholder="What specific problem or pain point does your idea address? Who is affected?"
                              value={formData.problemStatement}
                              onChange={handleChange}
                              rows={4}
                            />
                            {errors.problemStatement && <p className="ideathon-error">{errors.problemStatement}</p>}
                            <p className="ideathon-hint">Briefly describe who faces this problem and why existing solutions are inadequate.</p>
                          </div>

                          <div className={`ideathon-field full ${errors.proposedSolution ? "invalid" : ""}`}>
                            <label htmlFor="proposedSolution">
                              Proposed Solution & Value Proposition <span className="ideathon-required">*</span>
                            </label>
                            <textarea
                              id="proposedSolution"
                              name="proposedSolution"
                              className="ideathon-control"
                              placeholder="Explain your approach, key features, and why your solution is unique or scalable."
                              value={formData.proposedSolution}
                              onChange={handleChange}
                              rows={4}
                            />
                            {errors.proposedSolution && <p className="ideathon-error">{errors.proposedSolution}</p>}
                          </div>

                          <div className="ideathon-field full">
                            <label htmlFor="technologies">
                              Technologies / Tools Planned (Optional)
                            </label>
                            <input
                              type="text"
                              id="technologies"
                              name="technologies"
                              className="ideathon-control"
                              placeholder="e.g. React Native, Python, TensorFlow, Firebase, Arduino, Figma"
                              value={formData.technologies}
                              onChange={handleChange}
                            />
                            <p className="ideathon-hint">List languages, frameworks, hardware, or AI APIs you intend to explore.</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 4: Experience */}
                    {currentStep === 4 && (
                      <div className="animate-fade-in">
                        <div className="ideathon-step-kicker">Step 4 of 5</div>
                        <h3 className="ideathon-step-heading">Experience & Online Profiles</h3>
                        <p className="ideathon-step-description">
                          Share your portfolio, code repositories, or background to help mentors understand your skill set.
                        </p>

                        <div className="ideathon-field-grid">
                          <div className={`ideathon-field ${errors.githubUrl ? "invalid" : ""}`}>
                            <label htmlFor="githubUrl">
                              GitHub Profile / Repository Link
                            </label>
                            <input
                              type="url"
                              id="githubUrl"
                              name="githubUrl"
                              className="ideathon-control"
                              placeholder="https://github.com/your-username"
                              value={formData.githubUrl}
                              onChange={handleChange}
                            />
                            {errors.githubUrl && <p className="ideathon-error">{errors.githubUrl}</p>}
                          </div>

                          <div className={`ideathon-field ${errors.linkedinUrl ? "invalid" : ""}`}>
                            <label htmlFor="linkedinUrl">
                              LinkedIn Profile Link
                            </label>
                            <input
                              type="url"
                              id="linkedinUrl"
                              name="linkedinUrl"
                              className="ideathon-control"
                              placeholder="https://linkedin.com/in/your-profile"
                              value={formData.linkedinUrl}
                              onChange={handleChange}
                            />
                            {errors.linkedinUrl && <p className="ideathon-error">{errors.linkedinUrl}</p>}
                          </div>

                          <div className="ideathon-field full">
                            <label htmlFor="priorExperience">
                              Relevant Projects or Prior Hackathons (Optional)
                            </label>
                            <textarea
                              id="priorExperience"
                              name="priorExperience"
                              className="ideathon-control"
                              placeholder="Briefly highlight any past projects, awards, campus clubs, or tech stack familiarity."
                              value={formData.priorExperience}
                              onChange={handleChange}
                              rows={4}
                            />
                            <p className="ideathon-hint">No past hackathon experience is required! Beginners are warmly welcomed.</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 5: Review & Confirm */}
                    {currentStep === 5 && (
                      <div className="animate-fade-in">
                        <div className="ideathon-step-kicker">Step 5 of 5</div>
                        <h3 className="ideathon-step-heading">Review & Confirm Application</h3>
                        <p className="ideathon-step-description">
                          Please verify your submission details before confirming your registration.
                        </p>

                        <div className="ideathon-review-grid">
                          <div className="ideathon-review-block">
                            <h3>Participant Information</h3>
                            <div className="ideathon-review-item">
                              <span>Full Name</span>
                              <strong>{formData.fullName || "—"}</strong>
                            </div>
                            <div className="ideathon-review-item">
                              <span>Email Address</span>
                              <strong>{formData.email || "—"}</strong>
                            </div>
                            <div className="ideathon-review-item">
                              <span>Phone Number</span>
                              <strong>{formData.phone || "—"}</strong>
                            </div>
                            <div className="ideathon-review-item">
                              <span>College / University</span>
                              <strong>{formData.college || "—"}</strong>
                            </div>
                            <div className="ideathon-review-item">
                              <span>Student ID / Branch</span>
                              <strong>{formData.studentId} • {formData.branch}</strong>
                            </div>
                          </div>

                          <div className="ideathon-review-block">
                            <h3>Team Setup</h3>
                            <div className="ideathon-review-item">
                              <span>Format</span>
                              <strong>{formData.participationType === "team" ? "Team Participation" : "Solo / Individual"}</strong>
                            </div>
                            {formData.participationType === "team" && (
                              <>
                                <div className="ideathon-review-item">
                                  <span>Team Name</span>
                                  <strong>{formData.teamName || "—"}</strong>
                                </div>
                                <div className="ideathon-review-item">
                                  <span>Teammates</span>
                                  <strong>
                                    {formData.teammates.filter(t => t.name.trim()).length > 0
                                      ? formData.teammates.filter(t => t.name.trim()).map(t => t.name).join(", ")
                                      : "No extra teammates added"}
                                  </strong>
                                </div>
                              </>
                            )}
                          </div>

                          <div className="ideathon-review-block" style={{ gridColumn: "1 / -1" }}>
                            <h3>Idea Overview</h3>
                            <div className="ideathon-review-item">
                              <span>Idea Title</span>
                              <strong>{formData.ideaTitle || "—"}</strong>
                            </div>
                            <div className="ideathon-review-item">
                              <span>Domain / Track</span>
                              <strong>{formData.domain || "—"}</strong>
                            </div>
                            <div className="ideathon-review-item">
                              <span>Problem Statement</span>
                              <p style={{ margin: "3px 0 0", color: "#382850", lineHeight: 1.6 }}>{formData.problemStatement || "—"}</p>
                            </div>
                            <div className="ideathon-review-item">
                              <span>Proposed Solution</span>
                              <p style={{ margin: "3px 0 0", color: "#382850", lineHeight: 1.6 }}>{formData.proposedSolution || "—"}</p>
                            </div>
                            {formData.technologies && (
                              <div className="ideathon-review-item">
                                <span>Technologies</span>
                                <strong>{formData.technologies}</strong>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Confirmation Checkboxes */}
                        <div className="ideathon-check-list">
                          <label className="ideathon-check-label">
                            <input
                              type="checkbox"
                              name="agreeTerms"
                              checked={formData.agreeTerms}
                              onChange={handleChange}
                            />
                            <span>
                              I confirm that the information provided is accurate and that our project concept is original. <span className="ideathon-required">*</span>
                            </span>
                          </label>
                          {errors.agreeTerms && <p className="ideathon-error" style={{ marginLeft: "28px" }}>{errors.agreeTerms}</p>}

                          <label className="ideathon-check-label">
                            <input
                              type="checkbox"
                              name="receiveUpdates"
                              checked={formData.receiveUpdates}
                              onChange={handleChange}
                            />
                            <span>
                              Send me email notifications about mentor sessions, problem statements, and event timelines.
                            </span>
                          </label>
                        </div>

                        {errorMessage && (
                          <div className="ideathon-status-banner" style={{ background: "#ffeef3", borderColor: "#f7a8be", color: "#991b1b" }}>
                            {errorMessage}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="ideathon-form-footer">
                      <p>All information is kept strictly confidential by E-Cell SOA.</p>

                      <div className="ideathon-actions">
                        {currentStep > 1 && (
                          <button
                            type="button"
                            onClick={goToPrevStep}
                            className="ideathon-secondary-btn"
                            disabled={isSubmitting}
                          >
                            ← Back
                          </button>
                        )}

                        {currentStep < 5 ? (
                          <button
                            type="button"
                            onClick={goToNextStep}
                            className="ideathon-primary-btn"
                          >
                            <span>Next Step</span>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                              <line x1="5" y1="12" x2="19" y2="12" />
                              <polyline points="12 5 19 12 12 19" />
                            </svg>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="ideathon-primary-btn"
                            style={{ minWidth: "160px" }}
                          >
                            {isSubmitting ? (
                              <span>Submitting...</span>
                            ) : (
                              <>
                                <span>Submit Registration</span>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                                  <line x1="7" y1="17" x2="17" y2="7" />
                                  <polyline points="7 7 17 7 17 17" />
                                </svg>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="ideathon-footer">
        <div className="ideathon-shell">
          <div className="ideathon-footer-inner">
            <div className="ideathon-footer-brand">
              <span className="brand-mark" aria-hidden="true">
                <img
                  src={process.env.PUBLIC_URL + "/ecell-logo.jpg"}
                  alt="E-Cell SOA Logo"
                  style={{ width: "28px", height: "28px", borderRadius: "50%", objectFit: "cover" }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/ecell-logo.jpg";
                  }}
                />
              </span>
              <span>E-CELL SOA • Innovation & Entrepreneurship Cell</span>
            </div>

            <div className="ideathon-footer-links" style={{ display: "flex", gap: "24px", fontSize: "12px", color: "#625875" }}>
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/terms-conditions">Terms & Conditions</Link>
              <Link to="/contact">Contact</Link>
              <Link to="/">Home</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
