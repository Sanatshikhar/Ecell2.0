import React, { useEffect } from "react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,400&family=JetBrains+Mono:wght@300;400;500&display=swap');

  :root{
    --bg:#05080f;--bg2:#080d1a;--bg3:#0d1424;
    --gold:#c9a84c;--gold2:#e8c97a;
    --text:#ddd8cc;--text2:#9a9080;
    --border:#1e2840;--borderg:rgba(201,168,76,.3);
    --error:#c0392b;
  }
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  body{background:var(--bg);color:var(--text);font-family:'Crimson Pro',serif;min-height:100vh;overflow-x:hidden;position:relative;}
  body::before{content:'';position:fixed;top:-10%;left:50%;transform:translateX(-50%);width:900px;height:600px;background:radial-gradient(ellipse at center,rgba(201,168,76,.06) 0%,transparent 70%);pointer-events:none;z-index:0;}
  body::after{content:'';position:fixed;inset:0;background-image:radial-gradient(circle,rgba(201,168,76,.07) 1px,transparent 1px);background-size:28px 28px;pointer-events:none;z-index:0;mask-image:radial-gradient(ellipse 80% 80% at 50% 50%,black 30%,transparent 100%);}

  .page-wrapper{position:relative;z-index:1;max-width:800px;margin:0 auto;padding:48px 20px 100px;}

  .header{text-align:center;margin-bottom:56px;opacity:0;animation:riseIn 1s cubic-bezier(.16,1,.3,1) .1s forwards;}
  .tribunal-emblem{margin:0 auto 24px;width:72px;height:72px;position:relative;display:flex;align-items:center;justify-content:center;}
  .emblem-ring{position:absolute;border-radius:50%;border:1px solid var(--borderg);animation:rotateSlow 20s linear infinite;}
  .emblem-ring:nth-child(1){inset:0;}
  .emblem-ring:nth-child(2){inset:8px;border-style:dashed;animation-direction:reverse;animation-duration:12s;}
  .emblem-icon{font-size:28px;position:relative;z-index:1;filter:drop-shadow(0 0 10px rgba(201,168,76,.5));animation:glowPulse 3s ease-in-out infinite;}
  .event-eyebrow{font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:6px;text-transform:uppercase;color:var(--gold);margin-bottom:16px;opacity:.8;}
  h1.event-title{font-family:'Cinzel',serif;font-size:clamp(36px,7vw,64px);font-weight:900;letter-spacing:4px;line-height:1;background:linear-gradient(180deg,var(--gold2) 0%,var(--gold) 50%,#8a6520 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin-bottom:8px;}
  .title-sub{font-family:'Cinzel',serif;font-size:clamp(12px,2.5vw,18px);font-weight:400;letter-spacing:6px;color:var(--text2);text-transform:uppercase;margin-bottom:20px;}
  .gold-line{width:200px;height:1px;background:linear-gradient(90deg,transparent,var(--gold),transparent);margin:0 auto 20px;}
  .header-desc{font-family:'Crimson Pro',serif;font-size:15px;font-style:italic;color:var(--text2);max-width:520px;margin:0 auto;line-height:1.8;letter-spacing:.3px;}

  .progress-wrap{margin-bottom:40px;opacity:0;animation:fadeIn .5s ease .6s forwards;}
  .progress-steps{display:flex;align-items:center;}
  .step-item{display:flex;flex-direction:column;align-items:center;gap:8px;flex:1;position:relative;z-index:1;}
  .step-circle{width:36px;height:36px;border:1px solid var(--border);background:var(--bg2);display:flex;align-items:center;justify-content:center;font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:500;color:var(--text2);transition:all .45s cubic-bezier(.16,1,.3,1);position:relative;}
  .step-circle::before,.step-circle::after{content:'';position:absolute;background:var(--gold);transition:all .45s cubic-bezier(.16,1,.3,1);opacity:0;}
  .step-circle::before{top:0;left:0;width:6px;height:1px;}
  .step-circle::after{bottom:0;right:0;width:6px;height:1px;}
  .step-item.active .step-circle{border-color:var(--gold);color:var(--gold2);background:rgba(201,168,76,.06);box-shadow:0 0 18px rgba(201,168,76,.15);}
  .step-item.active .step-circle::before,.step-item.active .step-circle::after{opacity:1;}
  .step-item.done .step-circle{border-color:rgba(201,168,76,.4);color:var(--gold);background:rgba(201,168,76,.04);}
  .step-label{font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:1px;text-transform:uppercase;color:var(--text2);text-align:center;transition:color .3s;white-space:nowrap;}
  .step-item.active .step-label{color:var(--gold);}
  .step-item.done .step-label{color:rgba(201,168,76,.6);}
  .step-conn{flex:1;height:1px;background:var(--border);margin-bottom:28px;transition:background .4s;}
  .step-conn.filled{background:rgba(201,168,76,.4);}

  .form-card{background:var(--bg2);border:1px solid var(--border);position:relative;opacity:0;animation:riseIn .9s cubic-bezier(.16,1,.3,1) .5s forwards;}
  .form-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,var(--gold),var(--gold2),var(--gold),transparent);}
  .corner{position:absolute;width:20px;height:20px;border-style:solid;border-width:0;border-color:var(--gold);}
  .corner.tl{top:-1px;left:-1px;border-top-width:1px;border-left-width:1px;}
  .corner.tr{top:-1px;right:-1px;border-top-width:1px;border-right-width:1px;}
  .corner.bl{bottom:-1px;left:-1px;border-bottom-width:1px;border-left-width:1px;}
  .corner.br{bottom:-1px;right:-1px;border-bottom-width:1px;border-right-width:1px;}

  .steps-container{position:relative;min-height:340px;}
  .step-panel{display:none;padding:48px 44px 32px;}
  @media(max-width:560px){.step-panel{padding:32px 20px 24px;}}
  .step-panel.active{display:block;}
  .panel-enter-right{animation:panelInRight .48s cubic-bezier(.16,1,.3,1) forwards;}
  .panel-enter-left{animation:panelInLeft .48s cubic-bezier(.16,1,.3,1) forwards;}
  .panel-exit-left{animation:panelOutLeft .35s cubic-bezier(.4,0,1,1) forwards;}
  .panel-exit-right{animation:panelOutRight .35s cubic-bezier(.4,0,1,1) forwards;}
  @keyframes panelInRight{from{opacity:0;transform:translateX(48px)} to{opacity:1;transform:translateX(0)}}
  @keyframes panelInLeft{from{opacity:0;transform:translateX(-48px)} to{opacity:1;transform:translateX(0)}}
  @keyframes panelOutLeft{from{opacity:1;transform:translateX(0)} to{opacity:0;transform:translateX(-48px)}}
  @keyframes panelOutRight{from{opacity:1;transform:translateX(0)} to{opacity:0;transform:translateX(48px)}}

  .section-header{display:flex;align-items:center;gap:16px;margin-bottom:32px;}
  .ornament{display:flex;flex-direction:column;align-items:center;gap:3px;flex-shrink:0;}
  .orn-line{width:1px;height:18px;background:var(--borderg);}
  .orn-diamond{width:7px;height:7px;background:var(--gold);transform:rotate(45deg);box-shadow:0 0 6px rgba(201,168,76,.4);}
  .section-num{font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:3px;color:var(--gold);opacity:.7;text-transform:uppercase;margin-bottom:2px;}
  .section-title{font-family:'Cinzel',serif;font-size:17px;font-weight:600;letter-spacing:3px;text-transform:uppercase;}
  .section-rule{flex:1;height:1px;background:linear-gradient(90deg,var(--borderg),transparent);}

  .field-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;}
  .field-grid.single{grid-template-columns:1fr;}
  @media(max-width:560px){.field-grid{grid-template-columns:1fr;}}
  .field{position:relative;}
  label{display:block;font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:var(--text2);margin-bottom:8px;transition:color .25s;}
  .field:focus-within label{color:var(--gold);}
  input[type=text],input[type=email],input[type=tel],select,textarea{width:100%;background:var(--bg3);border:1px solid var(--border);color:var(--text);font-family:'Crimson Pro',serif;font-size:16px;padding:12px 16px;outline:none;transition:all .3s;-webkit-appearance:none;appearance:none;border-radius:0;}
  input:focus,select:focus,textarea:focus{border-color:var(--gold);background:rgba(201,168,76,.03);box-shadow:0 0 0 1px rgba(201,168,76,.12);}
  .field-err{border-color:var(--error)!important;}
  input::placeholder{color:#222d44;font-style:italic;}
  select option{background:#0d1424;color:var(--text);}
  select:disabled{opacity:.4;cursor:not-allowed;}
  .select-wrap{position:relative;}
  .select-wrap::after{content:'◆';position:absolute;right:14px;top:50%;transform:translateY(-50%);font-size:8px;color:var(--gold);pointer-events:none;opacity:.7;}
  textarea{resize:vertical;min-height:90px;}

  .role-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;}
  @media(max-width:440px){.role-grid{grid-template-columns:1fr;}}
  .role-card{position:relative;cursor:pointer;}
  .role-card input[type=radio]{position:absolute;opacity:0;width:0;height:0;}
  .role-label{display:flex;flex-direction:column;align-items:center;text-align:center;gap:10px;padding:22px 14px;background:var(--bg3);border:1px solid var(--border);cursor:pointer;transition:all .3s;position:relative;overflow:hidden;}
  .role-label::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,transparent 60%,rgba(201,168,76,.04) 100%);opacity:0;transition:opacity .3s;}
  .role-icon{font-size:26px;}
  .role-name{font-family:'Cinzel',serif;font-size:11px;letter-spacing:2px;font-weight:600;text-transform:uppercase;color:var(--text2);transition:color .3s;}
  .role-desc{font-family:'Crimson Pro',serif;font-style:italic;font-size:12px;color:#3a4060;transition:color .3s;line-height:1.4;}
  .role-card input:checked+.role-label{border-color:var(--gold);background:rgba(201,168,76,.05);box-shadow:0 0 20px rgba(201,168,76,.1);}
  .role-card input:checked+.role-label::before{opacity:1;}
  .role-card input:checked+.role-label .role-name{color:var(--gold);}
  .role-card input:checked+.role-label .role-desc{color:var(--text2);}
  .role-card input:checked+.role-label::after{content:'✦';position:absolute;top:8px;right:10px;font-size:10px;color:var(--gold);animation:fadeIn .3s ease;}

  .pref-section{display:none;margin-top:28px;padding-top:28px;border-top:1px solid var(--border);}
  .pref-section.visible{display:block;animation:fadeSlide .5s ease forwards;}
  .pref-note{font-family:'Crimson Pro',serif;font-style:italic;font-size:14px;color:var(--text2);margin-bottom:20px;padding:12px 16px;border-left:2px solid var(--borderg);background:rgba(201,168,76,.03);line-height:1.6;}
  .pref-note strong{color:var(--gold);font-style:normal;font-family:'Cinzel',serif;font-size:11px;letter-spacing:1px;}
  .pref-row{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;}
  @media(max-width:560px){.pref-row{grid-template-columns:1fr;}}
  .pref-badge{font-family:'JetBrains Mono',monospace;font-size:9px;color:var(--gold);letter-spacing:2px;margin-bottom:6px;text-transform:uppercase;opacity:.7;}

  .exp-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
  @media(max-width:460px){.exp-grid{grid-template-columns:1fr;}}
  .exp-card{position:relative;cursor:pointer;}
  .exp-card input[type=checkbox]{position:absolute;opacity:0;width:0;height:0;}
  .exp-label{display:flex;align-items:center;gap:12px;padding:12px 16px;background:var(--bg3);border:1px solid var(--border);cursor:pointer;transition:all .25s;font-size:15px;letter-spacing:.5px;}
  .exp-box{width:16px;height:16px;border:1px solid var(--borderg);flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:10px;color:transparent;transition:all .25s;transform:rotate(45deg);}
  .exp-card input:checked~.exp-label{border-color:var(--borderg);background:rgba(201,168,76,.05);color:var(--gold);}
  .exp-card input:checked~.exp-label .exp-box{background:var(--gold);border-color:var(--gold);color:#000;box-shadow:0 0 8px rgba(201,168,76,.4);}

  .gold-div{display:flex;align-items:center;gap:16px;margin:32px 0;}
  .gold-div-line{flex:1;height:1px;background:linear-gradient(90deg,transparent,var(--border));}
  .gold-div-line.r{background:linear-gradient(90deg,var(--border),transparent);}
  .gold-div-icon{font-size:11px;color:var(--gold);opacity:.4;letter-spacing:5px;}

  .step-nav{display:flex;align-items:center;justify-content:space-between;padding:28px 44px;border-top:1px solid var(--border);}
  @media(max-width:560px){.step-nav{padding:20px;}}
  .btn-back{background:transparent;color:var(--text2);font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:3px;padding:10px 20px;border:1px solid var(--border);cursor:pointer;transition:all .25s;text-transform:uppercase;}
  .btn-back:hover{color:var(--text);border-color:var(--borderg);}
  .btn-back:disabled{opacity:0;pointer-events:none;}
  .btn-next{background:transparent;color:var(--gold);font-family:'Cinzel',serif;font-size:13px;font-weight:600;letter-spacing:5px;padding:14px 40px;border:1px solid var(--borderg);cursor:pointer;transition:all .3s;overflow:hidden;position:relative;}
  .btn-next::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(201,168,76,.06) 0%,rgba(201,168,76,.12) 100%);transform:scaleX(0);transform-origin:left;transition:transform .3s;}
  .btn-next:hover::before{transform:scaleX(1);}
  .btn-next:hover{border-color:var(--gold);color:var(--gold2);box-shadow:0 0 24px rgba(201,168,76,.12);}
  .btn-submit-final{background:transparent;color:var(--gold);font-family:'Cinzel',serif;font-size:13px;font-weight:600;letter-spacing:5px;padding:14px 40px;border:1px solid var(--gold);cursor:pointer;transition:all .3s;position:relative;overflow:hidden;}
  .btn-submit-final::before{content:'';position:absolute;inset:0;background:rgba(201,168,76,.08);transform:scaleX(0);transform-origin:left;transition:transform .35s;}
  .btn-submit-final:hover::before{transform:scaleX(1);}
  .btn-submit-final:hover{box-shadow:0 0 28px rgba(201,168,76,.2);color:var(--gold2);}
  .step-counter{font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--text2);letter-spacing:2px;}
  .step-counter span{color:var(--gold);}

  @keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-5px)}75%{transform:translateX(5px)}}
  .shake{animation:shake .3s ease;}

  .success-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.95);z-index:200;align-items:center;justify-content:center;}
  .success-overlay.show{display:flex;animation:fadeIn .5s ease;}
  .success-box{background:var(--bg2);border:1px solid var(--borderg);padding:56px 48px;text-align:center;max-width:420px;width:90%;position:relative;}
  .success-box::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,var(--gold),transparent);}
  .success-icon{font-size:44px;margin-bottom:20px;display:block;animation:glowPulse 2s infinite;}
  .success-title{font-family:'Cinzel',serif;font-size:22px;font-weight:700;letter-spacing:6px;color:var(--gold);text-transform:uppercase;margin-bottom:12px;}
  .success-msg{font-family:'Crimson Pro',serif;font-size:16px;font-style:italic;color:var(--text2);line-height:1.8;}

  @keyframes riseIn{from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)}}
  @keyframes fadeSlide{from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)}}
  @keyframes fadeIn{from{opacity:0} to{opacity:1}}
  @keyframes rotateSlow{to{transform:rotate(360deg)}}
  @keyframes glowPulse{0%,100%{filter:drop-shadow(0 0 6px rgba(201,168,76,.4))} 50%{filter:drop-shadow(0 0 18px rgba(201,168,76,.8))}}
  .particle{position:fixed;width:2px;height:2px;background:var(--gold);border-radius:50%;pointer-events:none;z-index:0;animation:floatUp linear infinite;opacity:0;}
  @keyframes floatUp{0%{opacity:0;transform:translateY(0) scale(1)} 10%{opacity:.6} 90%{opacity:.2} 100%{opacity:0;transform:translateY(-100vh) scale(.5)}}
`;

function AITribunalRegistration() {
  useEffect(() => {
    document.title = "AI Tribunal — Registration";

    let current = 1;
    const TOTAL = 4;
    let animating = false;

    function syncSelects(cls) {
      const sels = Array.from(document.querySelectorAll("." + cls));
      sels.forEach((sel) => {
        Array.from(sel.options).forEach((opt) => {
          if (!opt.value) return;
          const blockedByOther = sels.filter((s) => s !== sel).some((s) => s.value === opt.value);
          opt.disabled = blockedByOther;
          opt.style.color = blockedByOther ? "#2a3050" : "";
        });
      });
    }

    const roleListeners = [];
    document.querySelectorAll('input[name="role"]').forEach((r) => {
      const handler = function handler() {
        const pmSection = document.getElementById("pmSection");
        const afSection = document.getElementById("afSection");
        if (pmSection) pmSection.classList.remove("visible");
        if (afSection) afSection.classList.remove("visible");
        document.querySelectorAll(".country-pref,.org-pref").forEach((s) => {
          s.value = "";
        });
        syncSelects("country-pref");
        syncSelects("org-pref");
        if (this.value === "policy_maker" && pmSection) pmSection.classList.add("visible");
        else if (this.value === "ai_founder" && afSection) afSection.classList.add("visible");
      };
      r.addEventListener("change", handler);
      roleListeners.push({ el: r, handler });
    });

    const countryListeners = [];
    document.querySelectorAll(".country-pref").forEach((s) => {
      const handler = () => syncSelects("country-pref");
      s.addEventListener("change", handler);
      countryListeners.push({ el: s, handler });
    });

    const orgListeners = [];
    document.querySelectorAll(".org-pref").forEach((s) => {
      const handler = () => syncSelects("org-pref");
      s.addEventListener("change", handler);
      orgListeners.push({ el: s, handler });
    });

    const expListeners = [];
    document.querySelectorAll('.exp-card input[type="checkbox"]').forEach((cb) => {
      const handler = function handler() {
        const box = this.closest(".exp-card")?.querySelector(".exp-box");
        if (box) box.textContent = this.checked ? "✦" : "";
      };
      cb.addEventListener("change", handler);
      expListeners.push({ el: cb, handler });
    });

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
          btn.textContent = "Enter the Tribunal";
          btn.classList.remove("btn-next");
          btn.classList.add("btn-submit-final");
        } else {
          btn.textContent = "PROCEED →";
          btn.classList.add("btn-next");
          btn.classList.remove("btn-submit-final");
        }
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
      const exitCls = dir === "forward" ? "panel-exit-left" : "panel-exit-right";
      const enterCls = dir === "forward" ? "panel-enter-right" : "panel-enter-left";
      from.classList.add(exitCls);
      window.setTimeout(() => {
        from.classList.remove("active", exitCls);
        to.classList.add("active", enterCls);
        window.setTimeout(() => {
          to.classList.remove(enterCls);
          animating = false;
        }, 490);
      }, 360);
      current = next;
      updateProgress(next);
    }

    function markErr(id) {
      const el = document.getElementById(id);
      if (el) {
        el.classList.add("field-err");
        el.addEventListener(
          "input",
          () => el.classList.remove("field-err"),
          { once: true }
        );
      }
    }

    function validate(n) {
      let ok = true;
      if (n === 1) {
        ["fullName", "regNum", "branch", "contact", "email"].forEach((id) => {
          const e = document.getElementById(id);
          if (e && !e.value.trim()) {
            markErr(id);
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
        if (!document.querySelector('input[name="role"]:checked')) ok = false;
      }
      if (n === 3) {
        const st = document.getElementById("stance");
        if (st && !st.value.trim()) {
          st.classList.add("field-err");
          ok = false;
        }
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

    const btnNext = document.getElementById("btnNext");
    const btnBack = document.getElementById("btnBack");

    const handleNext = () => {
      if (!validate(current)) return;
      if (current < TOTAL) goTo(current + 1, "forward");
      else {
        const successOverlay = document.getElementById("successOverlay");
        if (successOverlay) {
          successOverlay.classList.add("show");
          window.setTimeout(() => successOverlay.classList.remove("show"), 4500);
        }
      }
    };

    const handleBack = () => {
      if (current > 1) goTo(current - 1, "back");
    };

    if (btnNext) btnNext.addEventListener("click", handleNext);
    if (btnBack) btnBack.addEventListener("click", handleBack);

    return () => {
      roleListeners.forEach(({ el, handler }) => el.removeEventListener("change", handler));
      countryListeners.forEach(({ el, handler }) => el.removeEventListener("change", handler));
      orgListeners.forEach(({ el, handler }) => el.removeEventListener("change", handler));
      expListeners.forEach(({ el, handler }) => el.removeEventListener("change", handler));
      if (btnNext) btnNext.removeEventListener("click", handleNext);
      if (btnBack) btnBack.removeEventListener("click", handleBack);
    };
  }, []);

  return (
    <>
      <style>{STYLES}</style>

      <div className="particle" style={{ left: "10%", top: "90%", animationDuration: "12s", animationDelay: "0s" }} />
      <div className="particle" style={{ left: "30%", top: "85%", animationDuration: "9s", animationDelay: "3s", width: "3px", height: "3px" }} />
      <div className="particle" style={{ left: "65%", top: "95%", animationDuration: "14s", animationDelay: "5s" }} />
      <div className="particle" style={{ left: "82%", top: "88%", animationDuration: "10s", animationDelay: "1s" }} />

      <div className="page-wrapper">
        <div className="header">
          <div className="tribunal-emblem">
            <div className="emblem-ring" />
            <div className="emblem-ring" />
            <div className="emblem-icon">⚖</div>
          </div>
          <div className="event-eyebrow">The Trial of Artificial Intelligence</div>
          <h1 className="event-title">AI TRIBUNAL</h1>
          <div className="title-sub">Courtroom Simulation</div>
          <div className="gold-line" />
          <p className="header-desc">
            Step into a high-stakes courtroom where the future of AI is on trial.
            <br />
            Assume your role. State your position. Shape the verdict.
          </p>
        </div>

        <div className="progress-wrap">
          <div className="progress-steps">
            <div className="step-item active" id="si-1"><div className="step-circle">I</div><div className="step-label">General</div></div>
            <div className="step-conn" id="sc-1" />
            <div className="step-item" id="si-2"><div className="step-circle">II</div><div className="step-label">Role</div></div>
            <div className="step-conn" id="sc-2" />
            <div className="step-item" id="si-3"><div className="step-circle">III</div><div className="step-label">Statement</div></div>
            <div className="step-conn" id="sc-3" />
            <div className="step-item" id="si-4"><div className="step-circle">IV</div><div className="step-label">Experience</div></div>
          </div>
        </div>

        <div className="form-card">
          <div className="corner tl" /><div className="corner tr" />
          <div className="corner bl" /><div className="corner br" />

          <div className="steps-container">
            <div className="step-panel active" id="step-1">
              <div className="section-header">
                <div className="ornament"><div className="orn-line" /><div className="orn-diamond" /><div className="orn-line" /></div>
                <div><div className="section-num">Section I</div><div className="section-title">General Details</div></div>
                <div className="section-rule" />
              </div>
              <div className="field-grid">
                <div className="field"><label>Full Name</label><input type="text" id="fullName" placeholder="Counsel's full name" /></div>
                <div className="field"><label>Registration Number</label><input type="text" id="regNum" placeholder="e.g. 22BCS1234" /></div>
                <div className="field"><label>Year of Study</label><div className="select-wrap"><select id="year" defaultValue=""><option value="" disabled>— Select Year —</option><option>1st Year</option><option>2nd Year</option><option>3rd Year</option><option>4th Year</option></select></div></div>
                <div className="field"><label>Branch / Department</label><input type="text" id="branch" placeholder="e.g. CSE, ECE, Law..." /></div>
                <div className="field"><label>Contact Number</label><input type="tel" id="contact" placeholder="+91 XXXXX XXXXX" /></div>
                <div className="field"><label>Email Address</label><input type="email" id="email" placeholder="counsel@institution.edu" /></div>
              </div>
            </div>

            <div className="step-panel" id="step-2">
              <div className="section-header">
                <div className="ornament"><div className="orn-line" /><div className="orn-diamond" /><div className="orn-line" /></div>
                <div><div className="section-num">Section II</div><div className="section-title">Role Preference</div></div>
                <div className="section-rule" />
              </div>

              <div className="field">
                <label>Preferred Role — Select One</label>
                <div className="role-grid">
                  <label className="role-card">
                    <input type="radio" name="role" value="policy_maker" />
                    <div className="role-label">
                      <div className="role-icon">🏛️</div>
                      <div className="role-name">Policy Maker</div>
                      <div className="role-desc">Government / Judiciary</div>
                    </div>
                  </label>
                  <label className="role-card">
                    <input type="radio" name="role" value="ai_founder" />
                    <div className="role-label">
                      <div className="role-icon">🧠</div>
                      <div className="role-name">AI Founder</div>
                      <div className="role-desc">Defence</div>
                    </div>
                  </label>
                </div>
              </div>

              <div className="pref-section" id="pmSection">
                <div className="pref-note"><strong>Country Preference</strong><br />Select your top 3 country choices in order of priority. Each country may only appear once across all preferences.</div>
                <div className="pref-row">
                  <div className="pref-field"><div className="pref-badge">Preference 1</div><div className="select-wrap"><select id="cp1" className="country-pref" defaultValue=""><option value="">— Select Country —</option><option value="United States">🇺🇸 United States</option><option value="European Union">🇪🇺 European Union</option><option value="India">🇮🇳 India</option><option value="China">🇨🇳 China</option></select></div></div>
                  <div className="pref-field"><div className="pref-badge">Preference 2</div><div className="select-wrap"><select id="cp2" className="country-pref" defaultValue=""><option value="">— Select Country —</option><option value="United States">🇺🇸 United States</option><option value="European Union">🇪🇺 European Union</option><option value="India">🇮🇳 India</option><option value="China">🇨🇳 China</option></select></div></div>
                  <div className="pref-field"><div className="pref-badge">Preference 3</div><div className="select-wrap"><select id="cp3" className="country-pref" defaultValue=""><option value="">— Select Country —</option><option value="United States">🇺🇸 United States</option><option value="European Union">🇪🇺 European Union</option><option value="India">🇮🇳 India</option><option value="China">🇨🇳 China</option></select></div></div>
                </div>
              </div>

              <div className="pref-section" id="afSection">
                <div className="pref-note"><strong>Organisation / Founder Preference</strong><br />Select your top 3 organisation choices in order of priority. Each organisation may only appear once across all preferences.</div>
                <div className="pref-row">
                  <div className="pref-field"><div className="pref-badge">Preference 1</div><div className="select-wrap"><select id="op1" className="org-pref" defaultValue=""><option value="">— Select Organisation —</option><option value="OpenAI">OpenAI — Sam Altman</option><option value="Anthropic">Anthropic — Dario Amodei</option><option value="Google DeepMind">Google DeepMind — Demis Hassabis</option><option value="Meta AI">Meta AI — Yann LeCun</option></select></div></div>
                  <div className="pref-field"><div className="pref-badge">Preference 2</div><div className="select-wrap"><select id="op2" className="org-pref" defaultValue=""><option value="">— Select Organisation —</option><option value="OpenAI">OpenAI — Sam Altman</option><option value="Anthropic">Anthropic — Dario Amodei</option><option value="Google DeepMind">Google DeepMind — Demis Hassabis</option><option value="Meta AI">Meta AI — Yann LeCun</option></select></div></div>
                  <div className="pref-field"><div className="pref-badge">Preference 3</div><div className="select-wrap"><select id="op3" className="org-pref" defaultValue=""><option value="">— Select Organisation —</option><option value="OpenAI">OpenAI — Sam Altman</option><option value="Anthropic">Anthropic — Dario Amodei</option><option value="Google DeepMind">Google DeepMind — Demis Hassabis</option><option value="Meta AI">Meta AI — Yann LeCun</option></select></div></div>
                </div>
              </div>
            </div>

            <div className="step-panel" id="step-3">
              <div className="section-header">
                <div className="ornament"><div className="orn-line" /><div className="orn-diamond" /><div className="orn-line" /></div>
                <div><div className="section-num">Section III</div><div className="section-title">Position Statement</div></div>
                <div className="section-rule" />
              </div>
              <div className="field-grid single">
                <div className="field">
                  <label>Your Stance on AI — 1 to 2 Lines</label>
                  <textarea id="stance" placeholder="State your position on Artificial Intelligence and its impact on the world..." rows="4" />
                </div>
              </div>
            </div>

            <div className="step-panel" id="step-4">
              <div className="section-header">
                <div className="ornament"><div className="orn-line" /><div className="orn-diamond" /><div className="orn-line" /></div>
                <div><div className="section-num">Section IV</div><div className="section-title">Prior Experience</div></div>
                <div className="section-rule" />
              </div>
              <div className="field">
                <label>Select All That Apply</label>
                <div className="exp-grid">
                  <label className="exp-card"><input type="checkbox" name="exp" value="Debate" /><div className="exp-label"><div className="exp-box" />🎙️ Debate</div></label>
                  <label className="exp-card"><input type="checkbox" name="exp" value="MUN" /><div className="exp-label"><div className="exp-box" />🌐 MUN / Committee Simulations</div></label>
                  <label className="exp-card"><input type="checkbox" name="exp" value="Public Speaking" /><div className="exp-label"><div className="exp-box" />📢 Public Speaking</div></label>
                  <label className="exp-card"><input type="checkbox" name="exp" value="Technical AI" /><div className="exp-label"><div className="exp-box" />🤖 Technical / AI Knowledge</div></label>
                  <label className="exp-card" style={{ gridColumn: "1/-1" }}><input type="checkbox" name="exp" value="None" /><div className="exp-label"><div className="exp-box" />— None of the Above</div></label>
                </div>
              </div>
            </div>
          </div>

          <div className="step-nav">
            <button className="btn-back" id="btnBack" disabled>← Back</button>
            <div className="step-counter">STEP <span id="stepNum">1</span> / 4</div>
            <button className="btn-next" id="btnNext">PROCEED →</button>
          </div>
        </div>
      </div>

      <div className="success-overlay" id="successOverlay">
        <div className="success-box">
          <span className="success-icon">⚖️</span>
          <div className="success-title">The Court Accepts</div>
          <p className="success-msg">Your registration has been received.<br />The tribunal convenes. Your role awaits.<br /><br /><em>May reason and evidence prevail.</em></p>
        </div>
      </div>
    </>
  );
}

export default AITribunalRegistration;
