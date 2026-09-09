import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { getMemberById } from "../services/memberService";
import logoImg from "./logo.png";
import "./MemberIdCard.css";
import {
  Mail,
  Linkedin,
  MessageCircle,
  GraduationCap,
  Hash,
  Sparkles,
  CheckCircle2,
  ArrowLeft,
  UserX,
  ExternalLink,
  Maximize,
  Minimize,
  ShieldCheck,
  Award,
} from "lucide-react";
import SanatPhoto from "./Assets/Team 2026/Sanat.jpg";
import BibhuPhoto from "./Assets/Team 2026/Bibhu.jpeg";
import EshanPhoto from "./Assets/Team 2026/Eshan.jpeg";
import AbhinavPhoto from "./Assets/Team 2026/Abhinav.png";

function getLocalPhoto(member) {
  if (!member) return null;
  const id = String(member.id || "").trim();
  // Only Secretariat members (101-104) who do not have form uploads
  if (id === "101") return SanatPhoto;
  if (id === "102") return BibhuPhoto;
  if (id === "103") return EshanPhoto;
  if (id === "104") return AbhinavPhoto;
  return null;
}

export default function MemberIdCard() {
  const { id } = useParams();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const cardRef = useRef(null);

  // 3D Tilt state
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  useEffect(() => {
    let isMounted = true;
    async function loadMember() {
      setLoading(true);
      try {
        const found = await getMemberById(id);
        if (isMounted) {
          setMember(found);
        }
      } catch (err) {
        console.error("Failed to load member:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadMember();

    return () => {
      isMounted = false;
    };
  }, [id]);

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFsChange);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.warn("Fullscreen request error:", err);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rX = ((y - centerY) / centerY) * -5;
    const rY = ((x - centerX) / centerX) * 5;

    setRotateX(rX);
    setRotateY(rY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  const getInitials = (name) => {
    if (!name) return "M";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div className={`side-idcard-viewport ${isFullscreen ? "is-fullscreen" : ""}`}>
      {/* Ambient background glows */}
      <div className="side-glow-orb-top" />
      <div className="side-glow-orb-bottom" />

      {/* Top Floating Navigation */}
      <header className="side-top-nav">
        <Link to="/" className="side-nav-back">
          <ArrowLeft size={16} />
          <span>E-Cell Portal</span>
        </Link>
        <div className="side-nav-actions">
          <div className="side-credential-tag">
            <ShieldCheck size={14} className="text-purple-600 inline mr-1" />
            Official Member Credential
          </div>
          <button
            type="button"
            onClick={toggleFullscreen}
            className="side-nav-btn"
            title={isFullscreen ? "Exit Fullscreen" : "Toggle Fullscreen"}
          >
            {isFullscreen ? <Minimize size={15} /> : <Maximize size={15} />}
            <span className="max-sm:hidden">{isFullscreen ? "Exit" : "Full Screen"}</span>
          </button>
        </div>
      </header>

      {/* Main Stage */}
      <main className="side-main-stage">
        {loading ? (
          <div className="side-state-box">
            <div className="side-state-spinner" />
            <p className="side-state-text">Loading Member #{id}...</p>
          </div>
        ) : !member ? (
          <div className="side-state-box">
            <div className="side-state-error-icon">
              <UserX size={32} />
            </div>
            <h2 className="side-state-title">Member Not Found</h2>
            <p className="side-state-desc">
              No member profile registered under ID{" "}
              <span className="font-mono text-purple-700 font-bold">"{id}"</span>.
            </p>
            <Link to="/" className="side-back-btn">
              <ArrowLeft size={15} /> Return to Home
            </Link>
          </div>
        ) : (
          <div className="side-card-perspective">
            <article
              ref={cardRef}
              className="side-badge-card"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{
                transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
              }}
            >
              {/* Lanyard Slot at the top center */}
              <div className="side-lanyard-hanger">
                <div className="side-lanyard-slot" />
              </div>

              {/* ==================================================== */}
              {/* LEFT SIDE: PICTURE & CORE IDENTITY */}
              {/* ==================================================== */}
              <section className="side-panel-picture">
                {/* Profile Photo */}
                <div className="side-photo-container">
                  <div className="side-photo-frame">
                    {member.photo || getLocalPhoto(member) ? (
                      <img
                        src={member.photo || getLocalPhoto(member)}
                        alt={member.name}
                        className="side-photo-img"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          // Try alternative Google thumbnail if lh3 fails
                          if (member.photo && !e.target.dataset.triedFallback) {
                            e.target.dataset.triedFallback = "true";
                            const match =
                              member.photo.match(/\/d\/([a-zA-Z0-9_-]+)/) ||
                              member.photo.match(/[?&]id=([a-zA-Z0-9_-]+)/);
                            if (match && match[1]) {
                              e.target.src = `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1000`;
                              return;
                            }
                          }
                          const local = getLocalPhoto(member);
                          if (local && !e.target.dataset.triedLocal) {
                            e.target.dataset.triedLocal = "true";
                            e.target.src = local;
                            return;
                          }
                          e.target.style.display = "none";
                          if (e.target.nextSibling) {
                            e.target.nextSibling.style.display = "flex";
                          }
                        }}
                      />
                    ) : null}
                    <div
                      className="side-photo-fallback"
                      style={{
                        display:
                          member.photo || getLocalPhoto(member) ? "none" : "flex",
                      }}
                    >
                      {getInitials(member.name)}
                    </div>
                    {/* Verified Status Checkmark */}
                    <div className="side-verified-badge" title="Verified E-Cell Member">
                      <CheckCircle2 size={20} />
                    </div>
                  </div>
                </div>

                {/* Name, Designation & Team underneath the photo */}
                <div className="side-identity-block">
                  <h1 className="side-member-name">{member.name}</h1>
                  <div className="side-member-designation">{member.designation || "Executive Member"}</div>
                  {member.team && (
                    <div className="side-team-badge">
                      <Sparkles size={12} />
                      <span>{member.team}</span>
                    </div>
                  )}
                </div>

                {/* Left Bottom Status */}
                <div className="side-picture-footer">
                  <div className="side-verified-chip">
                    <span className="side-pulse-dot" />
                    <span>Official Member</span>
                  </div>
                  <span className="side-id-pill">#{member.id}</span>
                </div>
              </section>

              {/* ==================================================== */}
              {/* RIGHT SIDE: ALL CREDENTIAL DETAILS */}
              {/* ==================================================== */}
              <section className="side-panel-details">
                {/* Header: Logo, Title & Academic Session */}
                <div className="side-header-block">
                  <div className="side-brand-group">
                    <img src={logoImg} alt="E-Cell Logo" className="side-brand-logo" />
                    <div className="side-brand-text">
                      <h4>INNOVATION & ENTREPRENEURSHIP CELL</h4>
                      <span>OFFICIAL IDENTITY CREDENTIAL</span>
                    </div>
                  </div>
                  <div className="side-session-badge">
                    <Award size={13} className="text-purple-600 inline mr-1" />
                    <span>2025 – 2026</span>
                  </div>
                </div>

                {/* The Details Grid */}
                <div className="side-details-grid">
                  {/* Row 1: Regd No & Phone */}
                  <div className="side-detail-tile">
                    <div className="side-tile-icon">
                      <Hash size={16} />
                    </div>
                    <div className="side-tile-text">
                      <span className="side-tile-label">REGD. NO</span>
                      <span className="side-tile-val font-mono">{member.regNo || "—"}</span>
                    </div>
                  </div>

                  <div className="side-detail-tile">
                    <div className="side-tile-icon">
                      <MessageCircle size={16} />
                    </div>
                    <div className="side-tile-text">
                      <span className="side-tile-label">WHATSAPP / PHONE</span>
                      {member.phone ? (
                        <a
                          href={`https://wa.me/${member.phone.replace(/[^0-9]/g, "").length === 10 ? `91${member.phone.replace(/[^0-9]/g, "")}` : member.phone.replace(/[^0-9]/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="side-tile-link"
                          title="Chat on WhatsApp"
                        >
                          {member.phone}
                        </a>
                      ) : (
                        <span className="side-tile-val">—</span>
                      )}
                    </div>
                  </div>

                  {/* Row 2: Branch (Full Width - Always 100% Fully Visible) */}
                  <div className="side-detail-tile side-detail-full">
                    <div className="side-tile-icon">
                      <GraduationCap size={16} />
                    </div>
                    <div className="side-tile-text">
                      <span className="side-tile-label">
                        BRANCH {member.year ? `• ${member.year.toUpperCase()}` : ""}
                      </span>
                      <span className="side-tile-val">{member.branch || "—"}</span>
                    </div>
                  </div>

                  {/* Row 3: Email ID (Full Width) */}
                  <div className="side-detail-tile side-detail-full">
                    <div className="side-tile-icon">
                      <Mail size={16} />
                    </div>
                    <div className="side-tile-text">
                      <span className="side-tile-label">EMAIL ID</span>
                      {member.email ? (
                        <a
                          href={`mailto:${member.email}`}
                          className="side-tile-link"
                          title={member.email}
                        >
                          {member.email}
                        </a>
                      ) : (
                        <span className="side-tile-val">—</span>
                      )}
                    </div>
                  </div>

                  {/* Row 4: LinkedIn Connect Bar */}
                  {member.linkedin &&
                    !["na", "none", "-", ""].includes(
                      member.linkedin.trim().toLowerCase()
                    ) && (
                      <div className="side-linkedin-tile">
                        <div className="side-linkedin-icon">
                          <Linkedin size={16} />
                        </div>
                        <div className="side-linkedin-info">
                          <span className="side-tile-label">LINKEDIN PROFILE</span>
                          <div className="side-linkedin-desc">Verified Member Profile</div>
                        </div>
                        <a
                          href={
                            member.linkedin.startsWith("http")
                              ? member.linkedin
                              : `https://${member.linkedin}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="side-linkedin-btn"
                        >
                          <span>Connect on LinkedIn</span>
                          <ExternalLink size={13} />
                        </a>
                      </div>
                    )}
                </div>

                {/* Details Footer: Authenticity Bar */}
                <div className="side-footer-block">
                  <div className="side-footer-security">
                    <ShieldCheck size={14} className="text-emerald-600 inline mr-1" />
                    <span>AUTHENTICATED BY E-CELL EXECUTIVE BOARD</span>
                  </div>
                  <div className="side-id-number-tag">MEMBER ID: #{member.id}</div>
                </div>
              </section>
            </article>
          </div>
        )}
      </main>
    </div>
  );
}
