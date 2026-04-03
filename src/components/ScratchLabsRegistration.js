import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import pb from "../lib/pocketbase";

const REGISTRATION_OPEN = false;

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Rajdhani:wght@300;400;600;700&display=swap');

  :root {
    --bg:#0a0a0a; --bg2:#111111; --bg3:#1a1a1a;
    --accent:#c8ff00; --accent2:#ff6b00;
    --text:#e8e8e8; --muted:#5a5a5a;
    --border:#2a2a2a; --error:#ff3b3b;
  }
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  body{background:var(--bg);color:var(--text);font-family:'Rajdhani',sans-serif;min-height:100vh;overflow-x:hidden;position:relative;}
  body::before{content:'';position:fixed;inset:0;background-image:linear-gradient(rgba(200,255,0,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(200,255,0,.025) 1px,transparent 1px);background-size:40px 40px;pointer-events:none;z-index:0;}

  .page-wrapper{position:relative;z-index:1;max-width:780px;margin:0 auto;padding:40px 20px 80px;}

  .header{margin-bottom:44px;opacity:0;transform:translateY(-24px);animation:slideDown .7s cubic-bezier(.16,1,.3,1) .1s forwards;}
  .scratch-tag{font-family:'Space Mono',monospace;font-size:10px;color:var(--accent);background:rgba(200,255,0,.08);border:1px solid rgba(200,255,0,.3);padding:4px 10px;letter-spacing:3px;text-transform:uppercase;display:inline-block;margin-bottom:12px;position:relative;overflow:hidden;}
  .scratch-tag::after{content:'';position:absolute;top:0;left:-100%;width:100%;height:100%;background:linear-gradient(90deg,transparent,rgba(200,255,0,.2),transparent);animation:shimmer 3s infinite 1s;}
  h1.event-title{font-family:'Bebas Neue',sans-serif;font-size:clamp(42px,8vw,72px);line-height:.9;letter-spacing:2px;}
  h1.event-title span{color:var(--accent);display:block;}
  .header-desc{font-family:'Space Mono',monospace;font-size:11px;color:var(--muted);line-height:1.8;margin-top:14px;border-left:2px solid var(--accent);padding-left:16px;letter-spacing:.5px;}

  .progress-wrap{margin-bottom:36px;opacity:0;animation:fadeIn .5s ease .5s forwards;}
  .progress-wrap.embedded-progress{
    margin:0;
    padding:18px 24px 12px;
    border-bottom:1px solid var(--border);
    background:linear-gradient(180deg,rgba(200,255,0,.08),rgba(17,17,17,.45));
    opacity:1;
    animation:none;
    transition:all .3s ease;
  }
  .progress-wrap.embedded-progress .step-conn{margin-bottom:22px;}
  .progress-steps{display:flex;align-items:center;}
  .step-item{display:flex;flex-direction:column;align-items:center;gap:8px;flex:1;position:relative;z-index:1;}
  .step-circle{width:36px;height:36px;border:2px solid var(--border);background:var(--bg2);display:flex;align-items:center;justify-content:center;font-family:'Space Mono',monospace;font-size:11px;font-weight:700;color:var(--muted);transition:all .4s cubic-bezier(.16,1,.3,1);clip-path:polygon(6px 0%,100% 0%,calc(100% - 6px) 100%,0% 100%);}
  .step-item.active .step-circle{border-color:var(--accent);color:#000;background:var(--accent);box-shadow:0 0 18px rgba(200,255,0,.4);}
  .step-item.done .step-circle{border-color:var(--accent2);color:#000;background:var(--accent2);}
  .step-label{font-family:'Space Mono',monospace;font-size:9px;letter-spacing:1px;text-transform:uppercase;color:var(--muted);text-align:center;transition:color .3s;white-space:nowrap;}
  .step-item.active .step-label{color:var(--accent);}
  .step-item.done .step-label{color:var(--accent2);}
  .step-conn{flex:1;height:2px;background:var(--border);margin-bottom:28px;transition:background .4s;}
  .step-conn.filled{background:var(--accent2);}

  .form-card{background:var(--bg2);border:1px solid var(--border);position:relative;overflow:hidden;opacity:0;transform:translateY(32px);animation:slideUp .7s cubic-bezier(.16,1,.3,1) .4s forwards;}
  .form-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,var(--accent),var(--accent2),transparent);}
  .form-card::after{content:'';position:absolute;bottom:0;right:0;width:20px;height:20px;border-right:2px solid var(--accent);border-bottom:2px solid var(--accent);}

  .steps-container{position:relative;min-height:320px;}
  .step-panel{display:none;padding:40px 40px 32px;}
  @media(max-width:560px){.step-panel{padding:28px 20px 24px;}}
  .step-panel.active{display:block;}

  .panel-enter-right{animation:panelInRight .45s cubic-bezier(.16,1,.3,1) forwards;}
  .panel-enter-left {animation:panelInLeft  .45s cubic-bezier(.16,1,.3,1) forwards;}
  .panel-exit-left  {animation:panelOutLeft .35s cubic-bezier(.4,0,1,1) forwards;}
  .panel-exit-right {animation:panelOutRight .35s cubic-bezier(.4,0,1,1) forwards;}

  @keyframes panelInRight {from{opacity:0;transform:translateX(48px)} to{opacity:1;transform:translateX(0)}}
  @keyframes panelInLeft  {from{opacity:0;transform:translateX(-48px)} to{opacity:1;transform:translateX(0)}}
  @keyframes panelOutLeft {from{opacity:1;transform:translateX(0)} to{opacity:0;transform:translateX(-48px)}}
  @keyframes panelOutRight{from{opacity:1;transform:translateX(0)} to{opacity:0;transform:translateX(48px)}}

  .section-header{display:flex;align-items:center;gap:12px;margin-bottom:28px;padding-bottom:12px;border-bottom:1px solid var(--border);}
  .section-num{font-family:'Space Mono',monospace;font-size:11px;color:var(--accent);background:rgba(200,255,0,.08);border:1px solid rgba(200,255,0,.2);width:32px;height:32px;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-weight:700;}
  .section-title{font-family:'Bebas Neue',sans-serif;font-size:22px;letter-spacing:2px;}
  .section-sub{font-family:'Space Mono',monospace;font-size:10px;color:var(--muted);letter-spacing:1px;margin-left:auto;text-transform:uppercase;}

  .field-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;}
  .field-grid.single{grid-template-columns:1fr;}
  @media(max-width:560px){.field-grid{grid-template-columns:1fr;}}
  .field{position:relative;}
  label{display:block;font-family:'Space Mono',monospace;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:var(--muted);margin-bottom:8px;transition:color .2s;}
  .field:focus-within label{color:var(--accent);}
  input[type=text],input[type=email],input[type=tel],select{width:100%;background:var(--bg3);border:1px solid var(--border);color:var(--text);font-family:'Rajdhani',sans-serif;font-size:16px;font-weight:600;padding:12px 16px;outline:none;transition:border-color .2s,background .2s,box-shadow .2s;-webkit-appearance:none;appearance:none;border-radius:0;}
  input:focus,select:focus{border-color:var(--accent);background:rgba(200,255,0,.03);box-shadow:0 0 0 1px rgba(200,255,0,.15);}
  .field-err{border-color:var(--error)!important;}
  input::placeholder{color:#3a3a3a;font-weight:400;}
  select option{background:#1a1a1a;color:var(--text);}
  .select-wrap{position:relative;}
  .select-wrap::after{content:'▼';position:absolute;right:16px;top:50%;transform:translateY(-50%);font-size:10px;color:var(--accent);pointer-events:none;}

  .radio-group{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
  @media(max-width:400px){.radio-group{grid-template-columns:1fr;}}
  .radio-card{position:relative;cursor:pointer;}
  .radio-card input[type=radio]{position:absolute;opacity:0;width:0;height:0;}
  .radio-label{display:flex;align-items:center;gap:12px;padding:16px 20px;background:var(--bg3);border:1px solid var(--border);cursor:pointer;transition:all .2s;font-size:15px;font-weight:600;letter-spacing:1px;}
  .radio-label::before{content:'';width:16px;height:16px;border:2px solid var(--muted);flex-shrink:0;transition:all .2s;}
  .radio-card input:checked+.radio-label{border-color:var(--accent);background:rgba(200,255,0,.05);color:var(--accent);}
  .radio-card input:checked+.radio-label::before{border-color:var(--accent);background:var(--accent);box-shadow:0 0 8px rgba(200,255,0,.4);}

  .team-badge{display:flex;align-items:center;gap:10px;padding:12px 16px;background:rgba(255,107,0,.07);border:1px solid rgba(255,107,0,.25);margin-bottom:24px;font-family:'Space Mono',monospace;font-size:11px;color:var(--accent2);letter-spacing:1px;}
  .team-badge::before{content:'▶';font-size:9px;}
  .info-box{padding:20px;background:rgba(200,255,0,.04);border:1px solid rgba(200,255,0,.15);font-family:'Space Mono',monospace;font-size:11px;color:var(--muted);line-height:1.8;letter-spacing:.5px;}

  .step-nav{display:flex;align-items:center;justify-content:space-between;padding:24px 40px;border-top:1px solid var(--border);}
  @media(max-width:560px){.step-nav{padding:20px;}}
  .btn-back{background:transparent;color:var(--muted);font-family:'Space Mono',monospace;font-size:11px;letter-spacing:2px;padding:10px 20px;border:1px solid var(--border);cursor:pointer;transition:all .2s;text-transform:uppercase;}
  .btn-back:hover{color:var(--text);border-color:var(--muted);}
  .btn-back:disabled{opacity:0;pointer-events:none;}
  .btn-next{background:var(--accent);color:#000;font-family:'Bebas Neue',sans-serif;font-size:20px;letter-spacing:3px;padding:12px 36px;border:none;cursor:pointer;transition:all .2s;position:relative;overflow:hidden;clip-path:polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%);}
  .btn-next::before{content:'';position:absolute;inset:0;background:rgba(0,0,0,.15);transform:scaleX(0);transform-origin:left;transition:transform .3s;}
  .btn-next:hover::before{transform:scaleX(1);}
  .btn-next:hover{box-shadow:0 0 24px rgba(200,255,0,.4);transform:translateY(-1px);}
  .btn-submit-final{background:var(--accent2);color:#fff;font-family:'Bebas Neue',sans-serif;font-size:20px;letter-spacing:3px;padding:12px 36px;border:none;cursor:pointer;transition:all .2s;clip-path:polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%);}
  .btn-submit-final:hover{box-shadow:0 0 24px rgba(255,107,0,.4);transform:translateY(-1px);}
  .step-counter{font-family:'Space Mono',monospace;font-size:10px;color:var(--muted);letter-spacing:2px;}
  .step-counter span{color:var(--accent);}

  @keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}
  .shake{animation:shake .3s ease;}

  .success-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.92);z-index:100;align-items:center;justify-content:center;}
  .success-overlay.show{display:flex;animation:fadeIn .4s ease;}
  .success-box{background:var(--bg2);border:1px solid var(--accent);padding:48px;text-align:center;max-width:400px;width:90%;position:relative;}
  .success-box::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,var(--accent),var(--accent2));}
  .success-icon{font-size:48px;color:var(--accent);margin-bottom:16px;display:block;animation:pulse 2s infinite;}
  .success-title{font-family:'Bebas Neue',sans-serif;font-size:32px;letter-spacing:3px;color:var(--accent);margin-bottom:8px;}
  .success-msg{font-family:'Space Mono',monospace;font-size:11px;color:var(--muted);line-height:1.8;letter-spacing:.5px;}
  .success-action{margin-top:24px;background:transparent;color:var(--accent);border:1px solid rgba(200,255,0,.45);padding:10px 18px;font-family:'Space Mono',monospace;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;cursor:pointer;transition:all .2s ease;}
  .success-action:hover{background:rgba(200,255,0,.12);border-color:var(--accent);color:#fff;}

  @keyframes slideDown{to{opacity:1;transform:translateY(0)}}
  @keyframes slideUp{to{opacity:1;transform:translateY(0)}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes shimmer{to{left:200%}}
  @keyframes pulse{0%,100%{text-shadow:0 0 10px rgba(200,255,0,.5)}50%{text-shadow:0 0 30px rgba(200,255,0,.9)}}
  .dot{position:fixed;border-radius:50%;pointer-events:none;z-index:0;animation:floatDot 8s ease-in-out infinite;}
  @keyframes floatDot{0%,100%{transform:translateY(0);opacity:.4}50%{transform:translateY(-20px);opacity:.8}}
`;

function ScratchLabsRegistration() {
  useEffect(() => {
    document.title = "ScratchLabs — Registration";
    if (!REGISTRATION_OPEN) return;

    const collectionName = process.env.REACT_APP_PB_SCRATCHLABS_COLLECTION || "scratchlabsRegistrations";

    let current = 1;
    const TOTAL = 4;
    let animating = false;
    let isSubmitting = false;

    function getValue(id) {
      return document.getElementById(id)?.value?.trim() || "";
    }

    function buildPayload() {
      const registrationType = document.querySelector('input[name="regType"]:checked')?.value || "";
      const experience = document.querySelector('input[name="experience"]:checked')?.value || "";

      return {
        fullName: getValue("fullName"),
        regNum: getValue("regNum"),
        year: document.getElementById("year")?.value || "",
        branch: getValue("branch"),
        contact: getValue("contact"),
        email: getValue("email"),
        registrationType,
        experience,
        teammateName: getValue("tm_name"),
        teammateRegNum: getValue("tm_reg"),
        teammateYear: document.getElementById("tm_year")?.value || "",
        teammateBranch: getValue("tm_branch"),
        teammateContact: getValue("tm_contact"),
        teammateEmail: getValue("tm_email"),
        source: "scratchlabs",
      };
    }

    async function submitRegistration() {
      const payload = buildPayload();
      await pb.collection(collectionName).create(payload);
      return payload;
    }

    function updateProgress(to) {
      for (let i = 1; i <= TOTAL; i += 1) {
        const si = document.getElementById("si-" + i);
        if (!si) continue;
        si.classList.remove("active", "done");
        if (i < to) si.classList.add("done");
        else if (i === to) si.classList.add("active");
      }
      for (let i = 1; i < TOTAL; i += 1) {
        const sc = document.getElementById("sc-" + i);
        if (sc) sc.classList.toggle("filled", i < to);
      }
      const stepNum = document.getElementById("stepNum");
      const btnBack = document.getElementById("btnBack");
      const btn = document.getElementById("btnNext");
      if (stepNum) stepNum.textContent = String(to);
      if (btnBack) btnBack.disabled = to === 1;
      if (btn) {
        if (to === TOTAL) {
          btn.textContent = "REGISTER ✓";
          btn.classList.remove("btn-next");
          btn.classList.add("btn-submit-final");
        } else {
          btn.textContent = "NEXT →";
          btn.classList.add("btn-next");
          btn.classList.remove("btn-submit-final");
        }
      }
    }

    function prepareStep(n) {
      if (n === 3) {
        const isTeam = document.querySelector('input[name="regType"]:checked')?.value === "Team";
        const s3Individual = document.getElementById("s3-individual");
        const s3Team = document.getElementById("s3-team");
        if (s3Individual) s3Individual.style.display = isTeam ? "none" : "block";
        if (s3Team) s3Team.style.display = isTeam ? "block" : "none";
      }
    }

    function goTo(next, dir) {
      if (animating || next < 1 || next > TOTAL) return;
      animating = true;
      const from = document.getElementById("step-" + current);
      const to = document.getElementById("step-" + next);
      if (!from || !to) {
        animating = false;
        return;
      }

      const exitClass = dir === "forward" ? "panel-exit-left" : "panel-exit-right";
      const enterClass = dir === "forward" ? "panel-enter-right" : "panel-enter-left";

      from.classList.add(exitClass);
      window.setTimeout(() => {
        from.classList.remove("active", exitClass);
        to.classList.add("active", enterClass);
        window.setTimeout(() => {
          to.classList.remove(enterClass);
          animating = false;
        }, 460);
      }, 360);

      current = next;
      updateProgress(next);
      prepareStep(next);
    }

    function markError(id) {
      const el = document.getElementById(id);
      if (el) {
        el.classList.add("field-err");
        el.addEventListener(
          "input",
          () => {
            el.classList.remove("field-err");
          },
          { once: true }
        );
      }
    }
    
    async function validate(n) {
  let ok = true;
  if (n === 1) {
    // Check email first (async operation)
    const emailField = document.getElementById("email");
    if (emailField && emailField.value.trim()) {
      try {
        const existing = await pb.collection(collectionName).getList(1, 1, { 
          filter: `email="${emailField.value}"` 
        });
        if (existing.items.length > 0) {
          markError("email");
          window.alert("⚠️ This email is already registered. Please use a different email address.");
          ok = false;
        }
      } catch (err) {
        console.error("Email check error:", err);
      }
    }

    // Check other required fields
    ["fullName", "regNum", "branch", "contact", "email"].forEach((id) => {
      const e = document.getElementById(id);
      if (e && !e.value.trim()) {
        markError(id);
        ok = false;
      }
    });

    const yr = document.getElementById("year");
    if (yr && !yr.value) {
      yr.classList.add("field-err");
      ok = false;
    }
  }
  if (n === 2) {
    if (!document.querySelector('input[name="regType"]:checked')) ok = false;
  }
  if (n === 3) {
    const isTeam = document.querySelector('input[name="regType"]:checked')?.value === "Team";
    if (isTeam) {
      ["tm_name", "tm_reg", "tm_branch", "tm_contact", "tm_email"].forEach((id) => {
        const e = document.getElementById(id);
        if (e && !e.value.trim()) {
          markError(id);
          ok = false;
        }
      });
    }
  }
  if (n === 4) {
    if (!document.querySelector('input[name="experience"]:checked')) ok = false;
  }
  if (!ok) {
    const formCard = document.querySelector(".form-card");
    if (formCard) {
      formCard.classList.add("shake");
      window.setTimeout(() => formCard.classList.remove("shake"), 350);
    }
  }
  return ok;
}

    function resetFormState() {
      const formCard = document.querySelector(".form-card");
      if (!formCard) return;

      formCard.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"]').forEach((el) => {
        el.value = "";
        el.classList.remove("field-err");
      });

      formCard.querySelectorAll('input[type="radio"]').forEach((el) => {
        el.checked = false;
      });

      formCard.querySelectorAll("select").forEach((sel) => {
        sel.value = "";
        sel.classList.remove("field-err");
      });

      const s3Individual = document.getElementById("s3-individual");
      const s3Team = document.getElementById("s3-team");
      if (s3Individual) s3Individual.style.display = "none";
      if (s3Team) s3Team.style.display = "block";

      document.querySelectorAll(".step-panel").forEach((panel, index) => {
        panel.classList.remove("active", "panel-enter-right", "panel-enter-left", "panel-exit-left", "panel-exit-right");
        if (index === 0) panel.classList.add("active");
      });

      current = 1;
      updateProgress(1);
    }

    const closeSuccessOverlay = () => {
      const successOverlay = document.getElementById("successOverlay");
      if (successOverlay) {
        successOverlay.classList.remove("show");
      }
    };

    const btnNext = document.getElementById("btnNext");
    const btnBack = document.getElementById("btnBack");
    const successCloseBtn = document.getElementById("successCloseBtn");

    const isIndividualSelected = () =>
      document.querySelector('input[name="regType"]:checked')?.value === "Individual";

    const handleNext = async () => {
  if (!(await validate(current))) return;
  if (current < TOTAL) {
    if (current === 2 && isIndividualSelected()) {
      goTo(4, "forward");
    } else {
      goTo(current + 1, "forward");
    }
  } else {
    if (isSubmitting) return;
    isSubmitting = true;
    try {
      const payload = await submitRegistration();
      resetFormState();

      // Set dynamic success message based on registration type
      const successMsg = document.getElementById("successMsg");
      if (successMsg) {
        const isIndividual = payload.registrationType === "Individual";
        successMsg.innerHTML = isIndividual
          ? `Registration received for ScratchLabs.<br /><br />Worry not... We have a surprise waiting for you...`
          : `Registration received for ScratchLabs.<br /><br />Get ready to build it all from scratch`;
      }

      const successOverlay = document.getElementById("successOverlay");
      if (successOverlay) {
        successOverlay.classList.add("show");
      }
    } catch (error) {
      console.error("ScratchLabs registration submission failed:", error);
      window.alert("Could not submit registration. Please try again.");
    } finally {
      isSubmitting = false;
    }
  }
};

    const handleBack = () => {
      if (current > 1) {
        if (current === 4 && isIndividualSelected()) {
          goTo(2, "back");
        } else {
          goTo(current - 1, "back");
        }
      }
    };

    if (btnNext) btnNext.addEventListener("click", handleNext);
    if (btnBack) btnBack.addEventListener("click", handleBack);
    if (successCloseBtn) successCloseBtn.addEventListener("click", closeSuccessOverlay);

    return () => {
      if (btnNext) btnNext.removeEventListener("click", handleNext);
      if (btnBack) btnBack.removeEventListener("click", handleBack);
      if (successCloseBtn) successCloseBtn.removeEventListener("click", closeSuccessOverlay);
    };
  }, []);

  return (
    <>
      <style>{STYLES}</style>

      <div className="dot" style={{ width: "6px", height: "6px", background: "#c8ff00", top: "15%", left: "5%", animationDelay: "0s" }} />
      <div className="dot" style={{ width: "4px", height: "4px", background: "#ff6b00", top: "40%", right: "6%", animationDelay: "2s" }} />
      <div className="dot" style={{ width: "5px", height: "5px", background: "#c8ff00", top: "70%", left: "8%", animationDelay: "4s" }} />

      <div className="page-wrapper">
        <div className="header">
          <div className="scratch-tag">{REGISTRATION_OPEN ? "REGISTRATION OPEN" : "REGISTRATION CLOSED"}</div>
          <h1 className="event-title">
            THE SCRATCH<span>LABS</span>
          </h1>
          <p className="header-desc">
            {REGISTRATION_OPEN ? (
              <>
                Building From The Scratch — A 2-day startup simulation.
                <br />
                Ideate · Validate · Execute · Present
              </>
            ) : (
              <>
                Sorry, registrations are now closed.
                <br />
                Thank you for the incredible response.
              </>
            )}
          </p>
        </div>

        {REGISTRATION_OPEN ? (
          <div className="form-card">
          <div className="progress-wrap embedded-progress">
            <div className="progress-steps">
              <div className="step-item active" id="si-1"><div className="step-circle">01</div><div className="step-label">General</div></div>
              <div className="step-conn" id="sc-1" />
              <div className="step-item" id="si-2"><div className="step-circle">02</div><div className="step-label">Participation</div></div>
              <div className="step-conn" id="sc-2" />
              <div className="step-item" id="si-3"><div className="step-circle">03</div><div className="step-label">Team Details</div></div>
              <div className="step-conn" id="sc-3" />
              <div className="step-item" id="si-4"><div className="step-circle">04</div><div className="step-label">Experience</div></div>
            </div>
          </div>

          <div className="steps-container">
            <div className="step-panel active" id="step-1">
              <div className="section-header">
                <div className="section-num">01</div>
                <div className="section-title">General Details</div>
                <div className="section-sub">Mandatory</div>
              </div>
              <div className="field-grid">
                <div className="field"><label>Full Name</label><input type="text" id="fullName" placeholder="Your full name" /></div>
                <div className="field"><label>Registration Number</label><input type="text" id="regNum" placeholder="e.g. 22BCS1234" /></div>
                <div className="field"><label>Year of Study</label><div className="select-wrap"><select id="year" defaultValue=""><option value="" disabled>— Select Year —</option><option>1st Year</option><option>2nd Year</option><option>3rd Year</option><option>4th Year</option></select></div></div>
                <div className="field"><label>Branch / Department</label><input type="text" id="branch" placeholder="e.g. CSE, ECE, MBA..." /></div>
                <div className="field"><label>Contact Number</label><input type="tel" id="contact" placeholder="+91 XXXXX XXXXX" /></div>
                <div className="field"><label>Email Address</label><input type="email" id="email" placeholder="you@college.edu" /></div>
              </div>
            </div>

            <div className="step-panel" id="step-2">
              <div className="section-header">
                <div className="section-num">02</div>
                <div className="section-title">Participation Type</div>
              </div>
              <div className="field">
                <label>Registration Type</label>
                <div className="radio-group">
                  <label className="radio-card"><input type="radio" name="regType" value="Individual" id="typeIndividual" /><span className="radio-label">⚡ Individual</span></label>
                  <label className="radio-card"><input type="radio" name="regType" value="Team" id="typeTeam" /><span className="radio-label">🤝 Team (2 Members)</span></label>
                </div>
              </div>
            </div>

            <div className="step-panel" id="step-3">
              <div className="section-header">
                <div className="section-num">03</div>
                <div className="section-title">Team Details</div>
              </div>
              <div id="s3-individual" className="info-box" style={{ display: "none" }}>
                ⚡ You selected <strong style={{ color: "var(--accent)" }}>Individual</strong> participation.
                <br />
                No additional team details required. Proceed to the next step.
              </div>
              <div id="s3-team">
                <div className="team-badge">TEAMMATE — MEMBER 2 DETAILS</div>
                <div className="field-grid">
                  <div className="field"><label>Teammate Full Name</label><input type="text" id="tm_name" placeholder="Teammate's full name" /></div>
                  <div className="field"><label>Teammate Registration Number</label><input type="text" id="tm_reg" placeholder="e.g. 22BCS5678" /></div>
                  <div className="field"><label>Teammate Year of Study</label><div className="select-wrap"><select id="tm_year" defaultValue=""><option value="" disabled>— Select Year —</option><option>1st Year</option><option>2nd Year</option><option>3rd Year</option><option>4th Year</option></select></div></div>
                  <div className="field"><label>Teammate Branch / Department</label><input type="text" id="tm_branch" placeholder="e.g. CSE, ECE..." /></div>
                  <div className="field"><label>Teammate Contact Number</label><input type="tel" id="tm_contact" placeholder="+91 XXXXX XXXXX" /></div>
                  <div className="field"><label>Teammate Email Address</label><input type="email" id="tm_email" placeholder="teammate@college.edu" /></div>
                </div>
              </div>
            </div>

            <div className="step-panel" id="step-4">
              <div className="section-header">
                <div className="section-num">04</div>
                <div className="section-title">Prior Experience</div>
              </div>
              <div className="field">
                <label>Participated in startup / hackathon events before?</label>
                <div className="radio-group">
                  <label className="radio-card"><input type="radio" name="experience" value="Yes" /><span className="radio-label">✅ Yes</span></label>
                  <label className="radio-card"><input type="radio" name="experience" value="No" /><span className="radio-label">✗ No</span></label>
                </div>
              </div>
            </div>
          </div>

          <div className="step-nav">
            <button className="btn-back" id="btnBack" disabled>← BACK</button>
            <div className="step-counter">STEP <span id="stepNum">1</span> / 4</div>
            <button className="btn-next" id="btnNext">NEXT →</button>
          </div>
          </div>
        ) : (
          <div className="form-card" style={{ padding: "40px 32px", textAlign: "center" }}>
            <div className="section-header" style={{ justifyContent: "center", borderBottom: "none", marginBottom: "12px" }}>
              <div className="section-num">!</div>
              <div className="section-title">Registrations Closed</div>
            </div>
            <div className="info-box" style={{ maxWidth: "620px", margin: "0 auto", background: "rgba(255,107,0,.08)", border: "1px solid rgba(255,107,0,.3)", color: "#e8e8e8" }}>
              Sorry, registrations are now closed for ScratchLabs.
              <br />
              We appreciate your interest and support.
            </div>
            <div style={{ marginTop: "20px" }}>
              <Link
                to="/audience-poll"
                className="btn-next"
                style={{ display: "inline-block", textDecoration: "none" }}
              >
                GO TO VOTING PAGE →
              </Link>
            </div>
          </div>
        )}
      </div>

      {REGISTRATION_OPEN && (
        <div className="success-overlay" id="successOverlay">
          <div className="success-box">
            <span className="success-icon">◆</span>
            <div className="success-title">You're In!</div>
            <p className="success-msg" id="successMsg">
              Registration received for ScratchLabs.
            </p>
            <button className="success-action" id="successCloseBtn">LET'S GO →</button>
          </div>
        </div>
      )}
    </>
  );
}

export default ScratchLabsRegistration;