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
  GraduationCap,
  Phone,
  Mail,
  Hash,
  Upload,
  X,
  Sparkles,
  RotateCcw,
  Instagram,
  PartyPopper
} from "lucide-react";

import bannerImg from "./assets/banner.png";
import logoImg from "./assets/ecell-logo.jpg";
import monogramImg from "./assets/ec-monogram.png";
import bgPatternImg from "./assets/bg-pattern.png";

// Configurable collection name (defaults to "registrations")
const COLLECTION_NAME = process.env.REACT_APP_ORIENTATION_COLLECTION || "registrations";

// Allow orientation-specific PB URL if configured, otherwise fallback to project's configured PB (REACT_APP_DB_URL)
const pb = (process.env.REACT_APP_ORIENTATION_DB_URL && process.env.REACT_APP_ORIENTATION_DB_URL.trim())
  ? new PocketBase(process.env.REACT_APP_ORIENTATION_DB_URL.trim())
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

const normalizePhone = (value) => {
  const digits = String(value || "").replace(/\D/g, "");
  if (!digits) return "";

  // Accept +91/91 or 0 prefixed Indian numbers and normalize to 10 digits
  let normalized = digits;
  if (normalized.length === 12 && normalized.startsWith("91")) {
    normalized = normalized.slice(2);
  } else if (normalized.length === 11 && normalized.startsWith("0")) {
    normalized = normalized.slice(1);
  }

  return normalized;
};

const formatFileSize = (bytes) => {
  if (!bytes) return "0 B";
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
};

function ConfettiCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.offsetWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.offsetHeight || 650);

    const colors = ["#a855f7", "#6366f1", "#ec4899", "#10b981", "#f59e0b", "#3b82f6", "#06b6d4"];
    const count = 75;
    const pieces = Array.from({ length: count }).map(() => ({
      x: width * (0.15 + Math.random() * 0.7),
      y: height * 0.12 + Math.random() * 40,
      vx: (Math.random() - 0.5) * 12,
      vy: -Math.random() * 9 - 4,
      size: Math.random() * 8 + 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rSpeed: (Math.random() - 0.5) * 9,
      opacity: 1,
      gravity: 0.22 + Math.random() * 0.14,
      shape: Math.random() > 0.4 ? "rect" : "circle"
    }));

    let animId;
    const startTime = Date.now();

    const render = () => {
      const elapsed = Date.now() - startTime;
      ctx.clearRect(0, 0, width, height);

      let alive = false;
      for (const p of pieces) {
        p.x += p.vx;
        p.vy += p.gravity;
        p.y += p.vy;
        p.vx *= 0.98;
        p.rotation += p.rSpeed;

        if (elapsed > 2000) {
          p.opacity = Math.max(0, 1 - (elapsed - 2000) / 1500);
        }

        if (p.opacity > 0 && p.y < height + 30) {
          alive = true;
          ctx.save();
          ctx.globalAlpha = p.opacity;
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;

          if (p.shape === "rect") {
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
          } else {
            ctx.beginPath();
            ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        }
      }

      if (alive && elapsed < 4000) {
        animId = requestAnimationFrame(render);
      }
    };

    animId = requestAnimationFrame(render);

    const handleResize = () => {
      if (canvas && canvas.parentElement) {
        width = canvas.width = canvas.parentElement.offsetWidth;
        height = canvas.height = canvas.parentElement.offsetHeight;
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-30 w-full h-full rounded-2xl sm:rounded-3xl"
    />
  );
}

export default function RegistrationForm() {
  const [formData, setFormData] = useState({
    name: "",
    registration_number: "",
    email: "",
    phone: "",
    branch: "",
    other_branch: "",
    section: "",
    year: "",
    team: [],
    idProof: null
  });

  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const [activeField, setActiveField] = useState(null);
  const [errors, setErrors] = useState({});
  const [lastSubmittedError, setLastSubmittedError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [keyboardOffset, setKeyboardOffset] = useState(0);
  const [submittedRecord, setSubmittedRecord] = useState(null);

  // Clean up object URL when previewUrl changes or component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

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

  // Genuinely track mobile virtual keyboard height via VisualViewport
  // Ensures mascot moves up ONLY when virtual keyboard actually opens on a phone,
  // resting right above the keyboard, with zero fake/hardcoded bluffing on field focus.
  useEffect(() => {
    const handleViewportChange = () => {
      // 1. Check if an editable input/textarea is actually focused
      const activeEl = document.activeElement;
      const isInputActive =
        activeEl &&
        (["INPUT", "TEXTAREA"].includes(activeEl.tagName) || Boolean(activeEl.isContentEditable));

      // If no input is focused, the virtual keyboard cannot be open
      if (!isInputActive) {
        setKeyboardOffset(0);
        return;
      }

      let offset = 0;

      // 2. Measure layout vs visual viewport overlap (standard across iOS Safari & Android Chrome)
      if (window.visualViewport) {
        const vv = window.visualViewport;
        const layoutHeight = window.innerHeight;
        const visualBottom = vv.offsetTop + vv.height;
        const overlap = layoutHeight - visualBottom;

        // Mobile keyboards are always > 70px. Address bar toggles are < 60px.
        if (overlap > 70) {
          offset = overlap;
        }
      } else if (
        navigator.virtualKeyboard?.overlaysContent &&
        navigator.virtualKeyboard.boundingRect?.height > 70
      ) {
        offset = navigator.virtualKeyboard.boundingRect.height;
      }

      // If on desktop or no virtual keyboard is open, offset will be 0
      setKeyboardOffset(offset > 0 ? Math.round(offset) : 0);
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", handleViewportChange);
      window.visualViewport.addEventListener("scroll", handleViewportChange);
    }
    window.addEventListener("resize", handleViewportChange);

    if (navigator.virtualKeyboard) {
      navigator.virtualKeyboard.addEventListener("geometrychange", handleViewportChange);
    }

    // When an input is focused, track during the slide-up animation
    const handleFocusIn = (e) => {
      const target = e.target;
      const isInput =
        target &&
        (["INPUT", "TEXTAREA"].includes(target.tagName) || Boolean(target.isContentEditable));

      if (isInput) {
        handleViewportChange();
        setTimeout(handleViewportChange, 100);
        setTimeout(handleViewportChange, 250);
        setTimeout(handleViewportChange, 400);
        setTimeout(handleViewportChange, 600);
      }
    };

    // When focus leaves, dismiss if not moving to another input
    const handleFocusOut = () => {
      setTimeout(() => {
        const activeEl = document.activeElement;
        const isInputActive =
          activeEl &&
          (["INPUT", "TEXTAREA"].includes(activeEl.tagName) || Boolean(activeEl.isContentEditable));

        if (!isInputActive) {
          setKeyboardOffset(0);
        } else {
          handleViewportChange();
        }
      }, 60);
    };

    window.addEventListener("focusin", handleFocusIn);
    window.addEventListener("focusout", handleFocusOut);

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", handleViewportChange);
        window.visualViewport.removeEventListener("scroll", handleViewportChange);
      }
      window.removeEventListener("resize", handleViewportChange);
      if (navigator.virtualKeyboard) {
        navigator.virtualKeyboard.removeEventListener("geometrychange", handleViewportChange);
      }
      window.removeEventListener("focusin", handleFocusIn);
      window.removeEventListener("focusout", handleFocusOut);
    };
  }, []);

  const validateField = (name, value, allData = formData) => {
    let error = "";
    switch (name) {
      case "name": {
        const trimmed = String(value || "").trim();
        if (!trimmed) {
          error = "Please enter your full name.";
        } else if (trimmed.length < 2) {
          error = "Name must be at least 2 characters.";
        } else if (trimmed.length > 70) {
          error = "Name cannot exceed 70 characters.";
        } else if (!/^[a-zA-Z\s.'-]+$/.test(trimmed)) {
          error = "Please enter a valid name (letters and spaces only).";
        }
        break;
      }
      case "registration_number": {
        const trimmed = String(value || "").trim().toUpperCase();
        const digitsCount = trimmed.replace(/\D/g, "").length;
        if (!trimmed) {
          error = "Please enter your registration number.";
        } else if (!/^[A-Z0-9]+$/.test(trimmed)) {
          error = "Registration number can only contain letters and numbers.";
        } else if (trimmed.length < 6 || trimmed.length > 15) {
          error = "Registration number must be between 6 and 15 characters.";
        } else if (digitsCount < 3) {
          error = "Please enter a valid college registration number.";
        }
        break;
      }
      case "email": {
        const trimmed = String(value || "").trim().toLowerCase();
        if (!trimmed) {
          error = "Email address is required.";
        } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(trimmed)) {
          error = "Please enter a valid email address.";
        } else if (trimmed.length > 100) {
          error = "Email address cannot exceed 100 characters.";
        }
        break;
      }
      case "phone": {
        const trimmed = String(value || "").trim();
        const normalized = normalizePhone(trimmed);
        if (!trimmed) {
          error = "Phone number is required.";
        } else if (!/^[\d\s+\-()]+$/.test(trimmed)) {
          error = "Phone number contains invalid characters.";
        } else if (!/^[6-9]\d{9}$/.test(normalized)) {
          error = "Please enter a valid 10-digit Indian phone number.";
        }
        break;
      }
      case "branch":
        if (!value) {
          error = "Please select your branch from the list.";
        } else if (!BRANCHES.includes(value)) {
          error = "Please select a valid branch.";
        }
        break;
      case "other_branch":
        if (allData.branch === "Other") {
          const trimmed = String(value || "").trim();
          if (!trimmed) {
            error = "Please specify your branch or course name.";
          } else if (trimmed.length < 2) {
            error = "Branch name must be at least 2 characters.";
          } else if (trimmed.length > 60) {
            error = "Branch name cannot exceed 60 characters.";
          }
        }
        break;
      case "section": {
        const trimmed = String(value || "").trim();
        if (!trimmed) {
          error = "Please enter your section.";
        } else if (!/^[a-zA-Z0-9\s-]+$/.test(trimmed)) {
          error = "Section contains invalid characters.";
        } else if (trimmed.length > 10) {
          error = "Section cannot exceed 10 characters.";
        }
        break;
      }
      case "year":
        if (!value) {
          error = "Please select your academic year.";
        } else if (!YEARS.includes(value)) {
          error = "Please select a valid academic year.";
        }
        break;
      case "idProof":
        if (!value) {
          error = "Please upload your College ID or Admission document.";
        } else if (value.size > 5 * 1024 * 1024) {
          error = "File size must be under 5MB.";
        } else {
          const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/jpg",
            "application/pdf"
          ];
          const isAllowed = allowedTypes.includes(value.type) || Boolean(value.name?.match(/\.(jpg|jpeg|png|webp|pdf)$/i));
          if (!isAllowed) {
            error = "Please upload an image (JPG, PNG, WEBP) or PDF file.";
          }
        }
        break;
      case "team":
        if (!value || value.length === 0) {
          error = "Please select at least one team to join.";
        }
        break;
      default:
        break;
    }
    return error;
  };

  const handleFileSelect = (file) => {
    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/jpg",
      "application/pdf"
    ];
    const isAllowed = allowedTypes.includes(file.type) || file.name.match(/\.(jpg|jpeg|png|webp|pdf)$/i);

    if (!isAllowed) {
      const errMsg = "Please upload an image (JPG, PNG, WEBP) or PDF file.";
      setErrors((prev) => ({ ...prev, idProof: errMsg }));
      setLastSubmittedError(errMsg);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      const errMsg = "File size must be under 5MB.";
      setErrors((prev) => ({ ...prev, idProof: errMsg }));
      setLastSubmittedError(errMsg);
      return;
    }

    if (file.type.startsWith("image/")) {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
    }

    setFormData((prev) => ({ ...prev, idProof: file }));
    setErrors((prev) => ({ ...prev, idProof: "" }));
    if (lastSubmittedError === errors.idProof) {
      setLastSubmittedError(null);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleRemoveFile = (e) => {
    e?.stopPropagation?.();
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setFormData((prev) => ({ ...prev, idProof: null }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleBlur = (fieldName) => {
    setActiveField(null);
    const val = fieldName === "team" ? formData.team : formData[fieldName] || "";
    if (val || errors[fieldName]) {
      const error = validateField(fieldName, val);
      setErrors((prev) => ({ ...prev, [fieldName]: error }));
      if (error) {
        setLastSubmittedError(error);
      } else if (lastSubmittedError === errors[fieldName]) {
        setLastSubmittedError(null);
      }
    }
  };

  const handleChange = (e) => {
    let { name, value } = e.target;

    if (name === "registration_number") {
      value = value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    } else if (name === "section") {
      value = value.toUpperCase();
    }

    setFormData((prev) => {
      const next = { ...prev, [name]: value };
      if (name === "branch" && value !== "Other") {
        next.other_branch = "";
      }
      return next;
    });

    if (name === "branch" && value !== "Other") {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.other_branch;
        return next;
      });
      if (lastSubmittedError && errors.other_branch === lastSubmittedError) {
        setLastSubmittedError(null);
      }
    }

    if (errors[name]) {
      const updatedError = validateField(name, value, { ...formData, [name]: value });
      setErrors((prev) => ({ ...prev, [name]: updatedError }));
      if (!updatedError && (lastSubmittedError === errors[name] || lastSubmittedError === updatedError)) {
        setLastSubmittedError(null);
      }
    }
  };

  const handleToggleTeam = (teamId) => {
    setFormData((prev) => {
      const exists = prev.team.includes(teamId);
      const newTeam = exists ? prev.team.filter((t) => t !== teamId) : [...prev.team, teamId];
      if (errors.team && newTeam.length > 0) {
        setErrors((errs) => ({ ...errs, team: "" }));
        if (lastSubmittedError === errors.team) {
          setLastSubmittedError(null);
        }
      }
      return { ...prev, team: newTeam };
    });
    setActiveField("team");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage(null);

    const fieldsToValidate = [
      "name",
      "registration_number",
      "email",
      "phone",
      "branch",
      ...(formData.branch === "Other" ? ["other_branch"] : []),
      "section",
      "year",
      "team",
      "idProof"
    ];

    const newErrors = {};
    for (const f of fieldsToValidate) {
      const val = f === "team" ? formData.team : f === "idProof" ? formData.idProof : formData[f] || "";
      const err = validateField(f, val);
      if (err) newErrors[f] = err;
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      const firstErrorField = fieldsToValidate.find((f) => newErrors[f]);
      const firstErrorMessage = newErrors[firstErrorField];
      setLastSubmittedError(firstErrorMessage);
      setActiveField(firstErrorField);

      // Focus on the first field with an error
      const inputEl = document.querySelector(`[name="${firstErrorField}"]`);
      if (inputEl) {
        inputEl.focus();
      }
      return;
    }

    setLastSubmittedError(null);
    setIsSubmitting(true);
    const normalizedName = formData.name.trim();
    const normalizedRegNo = formData.registration_number.trim().toUpperCase();
    const normalizedEmail = formData.email.trim().toLowerCase();
    const normalizedPhone = normalizePhone(formData.phone.trim());
    const normalizedSection = formData.section.trim().toUpperCase();
    const finalBranch = formData.branch === "Other"
      ? formData.other_branch.trim()
      : formData.branch;

    // Build FormData to send both text fields and binary file to PocketBase
    const data = new FormData();
    data.append("name", normalizedName);
    data.append("registration_number", normalizedRegNo);
    data.append("email", normalizedEmail);
    data.append("phone", normalizedPhone);
    data.append("branch", finalBranch);
    data.append("section", normalizedSection);
    data.append("year", formData.year);
    data.append("team", formData.team.join(", "));
    if (formData.idProof) {
      data.append("idProof", formData.idProof);
    }

    try {
      let createdRecord = null;
      try {
        createdRecord = await pb.collection(COLLECTION_NAME).create(data);
      } catch (err) {
        // Fallback for PB schema variances (e.g. if PB doesn't yet have 'phone', custom branch, or 'idProof')
        const phoneError = err?.data?.data?.phone || err?.response?.data?.phone;
        const branchError = err?.data?.data?.branch || err?.response?.data?.branch;
        const idProofError = err?.data?.data?.idProof || err?.response?.data?.idProof;

        if (phoneError || branchError || idProofError) {
          const fallbackData = new FormData();
          fallbackData.append("name", normalizedName);
          fallbackData.append("registration_number", normalizedRegNo);
          fallbackData.append("email", normalizedEmail);
          if (!phoneError) {
            fallbackData.append("phone", normalizedPhone);
          }
          fallbackData.append("branch", branchError && formData.branch === "Other" ? "Other" : finalBranch);
          fallbackData.append("section", phoneError ? `${normalizedSection} | Ph: ${normalizedPhone}` : normalizedSection);
          fallbackData.append("year", formData.year);
          fallbackData.append("team", formData.team.join(", "));
          if (formData.idProof && !idProofError) {
            fallbackData.append("idProof", formData.idProof);
          }
          createdRecord = await pb.collection(COLLECTION_NAME).create(fallbackData);
        } else {
          throw err;
        }
      }

      const firstName = normalizedName.split(" ")[0] || "Innovator";
      const summary = {
        id: createdRecord?.id || ("SOA-" + Math.random().toString(36).substring(2, 8).toUpperCase()),
        name: normalizedName,
        registration_number: normalizedRegNo,
        email: normalizedEmail,
        phone: normalizedPhone,
        branch: finalBranch,
        section: normalizedSection,
        year: formData.year,
        team: [...formData.team],
        hasIdProof: Boolean(formData.idProof),
        fileName: formData.idProof?.name || null,
        submittedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })
      };

      setSubmittedRecord(summary);
      setStatusMessage({
        type: "success",
        title: "Registration Submitted!",
        text: `Your registration details have been received, ${firstName}.`
      });

      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
      setErrors({});
      setLastSubmittedError(null);

      // Smooth scroll back to card top so user sees the confirmation immediately
      if (cardRef.current) {
        cardRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } catch (err) {
      console.error("PocketBase registration error:", err);
      let userFriendlyMsg = "Could not save registration. Please try again.";

      // Extract specific validation errors from PocketBase
      const fieldData = err?.data?.data || err?.response?.data;
      if (fieldData && typeof fieldData === "object") {
        const backendErrors = {};
        let firstFieldToFocus = null;

        if (fieldData.registration_number) {
          const msg = "This registration number is already registered.";
          backendErrors.registration_number = msg;
          userFriendlyMsg = msg;
          if (!firstFieldToFocus) firstFieldToFocus = "registration_number";
        }
        if (fieldData.email) {
          const msg = "This email address is already registered.";
          backendErrors.email = msg;
          if (!userFriendlyMsg || userFriendlyMsg === "Could not save registration. Please try again.") {
            userFriendlyMsg = msg;
          }
          if (!firstFieldToFocus) firstFieldToFocus = "email";
        }
        if (fieldData.phone) {
          const msg = fieldData.phone?.message || "Please enter a valid phone number.";
          backendErrors.phone = msg;
          if (!userFriendlyMsg || userFriendlyMsg === "Could not save registration. Please try again.") {
            userFriendlyMsg = msg;
          }
          if (!firstFieldToFocus) firstFieldToFocus = "phone";
        }
        if (fieldData.idProof) {
          const msg = fieldData.idProof?.message || "Error with uploaded ID file.";
          backendErrors.idProof = msg;
          if (!userFriendlyMsg || userFriendlyMsg === "Could not save registration. Please try again.") {
            userFriendlyMsg = msg;
          }
          if (!firstFieldToFocus) firstFieldToFocus = "idProof";
        }

        // Map any remaining field errors
        for (const key of Object.keys(fieldData)) {
          if (!backendErrors[key]) {
            backendErrors[key] = fieldData[key]?.message || `Validation error in ${key}.`;
            if (!firstFieldToFocus) firstFieldToFocus = key;
          }
        }

        setErrors((prev) => ({ ...prev, ...backendErrors }));
        if (firstFieldToFocus) {
          setActiveField(firstFieldToFocus);
          const el = document.querySelector(`[name="${firstFieldToFocus}"]`);
          if (el) el.focus();
        }
      } else if (err?.status === 404) {
        userFriendlyMsg = `Collection '${COLLECTION_NAME}' not found in database. Please verify PocketBase setup.`;
      } else if (err?.status === 403) {
        userFriendlyMsg = "Permission denied: Ensure the collection's Create Rule is set to Public in PocketBase.";
      } else if (err?.message) {
        userFriendlyMsg = err.message;
      }

      setStatusMessage({ type: "error", title: "Registration failed.", text: userFriendlyMsg });
      setLastSubmittedError(userFriendlyMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterAnother = () => {
    setSubmittedRecord(null);
    setStatusMessage(null);
    setErrors({});
    setLastSubmittedError(null);
    setActiveField(null);
    setFormData({
      name: "",
      registration_number: "",
      email: "",
      phone: "",
      branch: "",
      other_branch: "",
      section: "",
      year: "",
      team: [],
      idProof: null
    });
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const effectiveBottomStyle = keyboardOffset > 0
    ? `${keyboardOffset + 14}px`
    : "calc(14px + env(safe-area-inset-bottom, 0px))";

  const addFieldRef = (el, index) => {
    if (el) formFieldsRef.current[index] = el;
  };

  return (
    <div ref={containerRef} className="min-h-screen w-full flex flex-col items-center justify-start sm:justify-center p-3 sm:p-6 md:p-10 overflow-x-hidden relative">

      {/* MOBILE FLOATING MASCOT */}
      <div
        className="lg:hidden fixed right-3 z-50 flex flex-col items-end pointer-events-auto transition-all duration-300 ease-out"
        style={{ bottom: effectiveBottomStyle }}
      >
        <Mascot
          activeField={activeField}
          statusState={statusMessage}
          selectedTeams={submittedRecord ? submittedRecord.team : formData.team}
          errors={errors}
          lastSubmittedError={lastSubmittedError}
          isFloating={true}
        />
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

        {/* LEFT: Form / Success View */}
        <div ref={leftColRef} className="w-full lg:w-[58%] p-5 sm:p-8 md:p-10 flex flex-col justify-between rounded-t-2xl sm:rounded-t-3xl lg:rounded-t-none lg:rounded-l-2xl lg:sm:rounded-l-3xl relative">
          {/* If submitted, show celebratory Confetti */}
          {submittedRecord && <ConfettiCanvas />}

          <div>
            {/* Logo */}
            <div ref={(el) => addFieldRef(el, 0)} className="flex items-center gap-2.5 mb-5">
              <img
                src={logoImg}
                alt="IEC Logo"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover shadow-sm border border-slate-200"
                onError={(e) => { e.target.onerror = null; e.target.src = monogramImg; }}
              />
              <span className="font-bold text-sm sm:text-base text-slate-800 tracking-wide">IEC</span>
            </div>

            {submittedRecord ? (
              /* DEDICATED CONFIRMATION & SUCCESS SCREEN */
              <div className="animate-success-in space-y-5">
                {/* Celebration Header */}
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/25 shrink-0 animate-bounce">
                    <PartyPopper className="w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Registration Submitted
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {submittedRecord.submittedAt}
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl md:text-[26px] font-extrabold text-slate-900 leading-tight">
                      Registration Received, {submittedRecord.name.split(" ")[0]}! 🎉
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                      Your registration has been successfully submitted.
                    </p>
                  </div>
                </div>

                {/* Verified Registration Details Card */}
                <div className="bg-slate-50/90 rounded-2xl border border-purple-100 p-4 sm:p-5 shadow-sm space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                    <div>
                      <span className="text-[11px] font-medium text-slate-400 block">Candidate Name</span>
                      <span className="font-bold text-slate-800 text-sm block mt-0.5">{submittedRecord.name}</span>
                    </div>
                    <div>
                      <span className="text-[11px] font-medium text-slate-400 block">Registration Number</span>
                      <span className="font-bold text-slate-800 text-sm block mt-0.5">{submittedRecord.registration_number}</span>
                    </div>
                    <div>
                      <span className="text-[11px] font-medium text-slate-400 block">Registered Email</span>
                      <span className="font-semibold text-slate-700 truncate block mt-0.5">{submittedRecord.email}</span>
                    </div>
                    <div>
                      <span className="text-[11px] font-medium text-slate-400 block">Contact Phone</span>
                      <span className="font-semibold text-slate-700 block mt-0.5">{submittedRecord.phone}</span>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-[11px] font-medium text-slate-400 block">Academic Details</span>
                      <span className="font-semibold text-slate-800 block mt-0.5">
                        {submittedRecord.branch} • {submittedRecord.year} (Section {submittedRecord.section})
                      </span>
                    </div>
                  </div>

                  {/* Applied Teams */}
                  <div className="pt-2.5 border-t border-slate-200/80">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                      Applied Teams ({submittedRecord.team.length})
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {submittedRecord.team.map((teamId) => {
                        const teamObj = TEAMS.find((t) => t.id === teamId);
                        const Icon = teamObj?.icon || Sparkles;
                        return (
                          <span
                            key={teamId}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/80 shadow-xs"
                          >
                            <Icon className="w-3.5 h-3.5 text-indigo-600" />
                            {teamId}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* College ID Status */}
                  {submittedRecord.hasIdProof && (
                    <div className="pt-2.5 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-600">
                      <span className="flex items-center gap-1.5 font-medium">
                        <FileText className="w-3.5 h-3.5 text-indigo-500" />
                        College ID / Admission Slip:
                      </span>
                      <span className="font-semibold text-emerald-600 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Attached & Uploaded
                      </span>
                    </div>
                  )}
                </div>

                {/* Next Steps Card */}
                <div className="bg-gradient-to-r from-purple-50/80 to-indigo-50/80 rounded-2xl p-4 border border-purple-100 space-y-2.5">
                  <div className="flex items-center gap-2 text-indigo-950 font-bold text-xs uppercase tracking-wider">
                    <Calendar className="w-4 h-4 text-indigo-600" />
                    <span>What Happens Next?</span>
                  </div>
                  <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
                    <div className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        1
                      </span>
                      <p>
                        <strong className="text-slate-800">Check Email:</strong> Schedule details and interview slots will be communicated shortly.
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        2
                      </span>
                      <p>
                        <strong className="text-slate-800">Stay Connected:</strong> Follow our official Instagram handle for instant shortlisted candidates lists and announcements.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                  <a
                    href="https://www.instagram.com/ecellsoau/?hl=en"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 px-5 rounded-full font-semibold text-xs sm:text-sm text-white bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:opacity-95 shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2.5 transition-all hover:scale-[1.01] active:scale-[0.98]"
                  >
                    <Instagram className="w-4 h-4" />
                    <span>Follow @ecellsoau on Instagram</span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-80" />
                  </a>

                  <button
                    type="button"
                    onClick={handleRegisterAnother}
                    className="py-3 px-5 rounded-full font-semibold text-xs sm:text-sm text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300/80 flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                    <span>Register Another Candidate</span>
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h2 ref={(el) => addFieldRef(el, 1)} className="text-xl sm:text-2xl md:text-[28px] font-bold text-slate-900 mb-1">
                  Registration Form
                </h2>
                <p ref={(el) => addFieldRef(el, 2)} className="text-xs sm:text-sm text-slate-400 mb-6">
                  Fill out your details below to join the E-Cell team.
                </p>

                {/* Error Notification */}
                {statusMessage && statusMessage.type === "error" && (
                  <div className="mb-5 p-3.5 sm:p-4 rounded-xl border flex items-start gap-3 bg-rose-50 border-rose-200 text-rose-800">
                    <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-sm">{statusMessage.title}</h4>
                      <p className="text-xs opacity-80 mt-0.5">{statusMessage.text}</p>
                    </div>
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} noValidate className="space-y-4">

              {/* Full Name & Registration Number */}
              <div ref={(el) => addFieldRef(el, 3)} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-indigo-500" /> Full Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onFocus={() => {
                      setActiveField("name");
                      if (errors.name) setLastSubmittedError(errors.name);
                    }}
                    onBlur={() => handleBlur("name")}
                    placeholder="Enter full name"
                    maxLength={70}
                    autoComplete="name"
                    className={`w-full py-2.5 px-3.5 rounded-xl border text-base sm:text-sm text-slate-800 bg-slate-50/80 focus:outline-none orientation-input-field ${
                      errors.name ? "border-rose-300 bg-rose-50/40" : "border-slate-200"
                    }`}
                  />
                  {errors.name && <p className="mt-1 text-[11px] text-rose-500 font-medium">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Hash className="w-3.5 h-3.5 text-indigo-500" /> Registration Number <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="registration_number"
                    value={formData.registration_number}
                    onChange={handleChange}
                    onFocus={() => {
                      setActiveField("registration_number");
                      if (errors.registration_number) setLastSubmittedError(errors.registration_number);
                    }}
                    onBlur={() => handleBlur("registration_number")}
                    placeholder="Enter registration number"
                    maxLength={20}
                    autoComplete="off"
                    spellCheck="false"
                    className={`w-full py-2.5 px-3.5 rounded-xl border text-base sm:text-sm text-slate-800 bg-slate-50/80 focus:outline-none orientation-input-field ${
                      errors.registration_number ? "border-rose-300 bg-rose-50/40" : "border-slate-200"
                    }`}
                  />
                  {errors.registration_number && <p className="mt-1 text-[11px] text-rose-500 font-medium">{errors.registration_number}</p>}
                </div>
              </div>

              {/* Email Address & Phone Number */}
              <div ref={(el) => addFieldRef(el, 4)} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-indigo-500" /> Email Address <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => {
                      setActiveField("email");
                      if (errors.email) setLastSubmittedError(errors.email);
                    }}
                    onBlur={() => handleBlur("email")}
                    placeholder="Enter email address"
                    maxLength={100}
                    autoComplete="email"
                    className={`w-full py-2.5 px-3.5 rounded-xl border text-base sm:text-sm text-slate-800 bg-slate-50/80 focus:outline-none orientation-input-field ${
                      errors.email ? "border-rose-300 bg-rose-50/40" : "border-slate-200"
                    }`}
                  />
                  {errors.email && <p className="mt-1 text-[11px] text-rose-500 font-medium">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-indigo-500" /> Phone Number <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    onFocus={() => {
                      setActiveField("phone");
                      if (errors.phone) setLastSubmittedError(errors.phone);
                    }}
                    onBlur={() => handleBlur("phone")}
                    placeholder="Enter 10-digit phone number"
                    maxLength={15}
                    autoComplete="tel"
                    className={`w-full py-2.5 px-3.5 rounded-xl border text-base sm:text-sm text-slate-800 bg-slate-50/80 focus:outline-none orientation-input-field ${
                      errors.phone ? "border-rose-300 bg-rose-50/40" : "border-slate-200"
                    }`}
                  />
                  {errors.phone && <p className="mt-1 text-[11px] text-rose-500 font-medium">{errors.phone}</p>}
                </div>
              </div>

              {/* Branch, Section, Year */}
              <div ref={(el) => addFieldRef(el, 5)} className="grid grid-cols-1 sm:grid-cols-3 gap-4 relative z-20">
                <div className="order-1 sm:order-1 relative z-30">
                  <CustomSelect
                    label="Branch"
                    name="branch"
                    value={formData.branch}
                    options={BRANCHES}
                    placeholder="Select Branch"
                    onChange={(e) => {
                      handleChange(e);
                      if (e.target.value) {
                        setErrors((prev) => ({ ...prev, branch: "" }));
                        if (lastSubmittedError === errors.branch) setLastSubmittedError(null);
                      }
                    }}
                    onFocus={() => {
                      setActiveField("branch");
                      if (errors.branch) setLastSubmittedError(errors.branch);
                    }}
                    onBlur={() => handleBlur("branch")}
                    error={errors.branch}
                    icon={Building2}
                  />
                </div>

                {/* In phone view, comes just under branch selector (order-2), on desktop spans row 2 (sm:order-4 sm:col-span-3) */}
                {formData.branch === "Other" && (
                  <div className="order-2 sm:order-4 sm:col-span-3 animate-field-in relative z-10">
                    <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-indigo-500" /> Specify Branch Name <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="other_branch"
                      value={formData.other_branch}
                      onChange={handleChange}
                      onFocus={() => {
                        setActiveField("other_branch");
                        if (errors.other_branch) setLastSubmittedError(errors.other_branch);
                      }}
                      onBlur={() => handleBlur("other_branch")}
                      placeholder="Enter your branch or course name"
                      maxLength={60}
                      className={`w-full py-2.5 px-3.5 rounded-xl border text-base sm:text-sm text-slate-800 bg-slate-50/80 focus:outline-none orientation-input-field ${
                        errors.other_branch ? "border-rose-300 bg-rose-50/40" : "border-slate-200"
                      }`}
                    />
                    {errors.other_branch && (
                      <p className="mt-1 text-[11px] text-rose-500 font-medium">{errors.other_branch}</p>
                    )}
                  </div>
                )}

                <div className="order-3 sm:order-2 relative z-10">
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Section <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="section"
                    value={formData.section}
                    onChange={handleChange}
                    onFocus={() => {
                      setActiveField("section");
                      if (errors.section) setLastSubmittedError(errors.section);
                    }}
                    onBlur={() => handleBlur("section")}
                    placeholder="Enter section"
                    maxLength={10}
                    className={`w-full py-2.5 px-3.5 rounded-xl border text-base sm:text-sm text-slate-800 bg-slate-50/80 focus:outline-none orientation-input-field ${
                      errors.section ? "border-rose-300 bg-rose-50/40" : "border-slate-200"
                    }`}
                  />
                  {errors.section && <p className="mt-1 text-[11px] text-rose-500 font-medium">{errors.section}</p>}
                </div>

                <div className="order-4 sm:order-3 relative z-20">
                  <CustomSelect
                    label="Year"
                    name="year"
                    value={formData.year}
                    options={YEARS}
                    placeholder="Select Year"
                    onChange={(e) => {
                      handleChange(e);
                      if (e.target.value) {
                        setErrors((prev) => ({ ...prev, year: "" }));
                        if (lastSubmittedError === errors.year) setLastSubmittedError(null);
                      }
                    }}
                    onFocus={() => {
                      setActiveField("year");
                      if (errors.year) setLastSubmittedError(errors.year);
                    }}
                    onBlur={() => handleBlur("year")}
                    error={errors.year}
                    icon={GraduationCap}
                  />
                </div>
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

              {/* College ID / ID Proof Upload */}
              <div ref={(el) => addFieldRef(el, 7)} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5 text-indigo-500" /> College ID / Admission Slip <span className="text-rose-400">*</span>
                  </label>
                  <span className="text-[10px] text-slate-400 font-medium">
                    JPG, PNG, PDF (Max 5MB)
                  </span>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  name="idProof"
                  accept="image/jpeg,image/png,image/webp,image/jpg,application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {!formData.idProof ? (
                  <div
                    onClick={() => {
                      setActiveField("idProof");
                      fileInputRef.current?.click();
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-xl p-3.5 sm:p-4 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-2 group ${
                      isDragging
                        ? "border-indigo-500 bg-indigo-50/80 scale-[1.01]"
                        : errors.idProof
                        ? "border-rose-300 bg-rose-50/40 hover:border-rose-400"
                        : "border-slate-200 bg-slate-50/70 hover:border-indigo-300 hover:bg-slate-50/90"
                    }`}
                  >
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                      <Upload className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-700">
                        <span className="text-indigo-600 underline underline-offset-2">Click to browse</span> or drag & drop
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Student ID Card, Library Card, or Admission Letter
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="border border-indigo-200 bg-indigo-50/60 rounded-xl p-3 flex items-center justify-between transition-all">
                    <div className="flex items-center gap-3 min-w-0">
                      {previewUrl ? (
                        <img
                          src={previewUrl}
                          alt="ID Preview"
                          className="w-11 h-11 object-cover rounded-lg border border-indigo-200 shrink-0 bg-white"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-800 truncate max-w-[180px] sm:max-w-xs">
                          {formData.idProof.name}
                        </p>
                        <p className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1.5">
                          <span>{formatFileSize(formData.idProof.size)}</span>
                          <span>•</span>
                          <span className="text-emerald-600 font-medium flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 inline" /> Ready
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 px-2.5 py-1 rounded-md hover:bg-indigo-100/60 transition-colors"
                      >
                        Change
                      </button>
                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="p-1.5 rounded-md text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                        title="Remove file"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
                {errors.idProof && (
                  <p className="mt-1 text-[11px] text-rose-500 font-medium">{errors.idProof}</p>
                )}
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
          </>
        )}
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
            <Mascot
              activeField={activeField}
              statusState={statusMessage}
              selectedTeams={submittedRecord ? submittedRecord.team : formData.team}
              errors={errors}
              lastSubmittedError={lastSubmittedError}
              isFloating={false}
            />
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
