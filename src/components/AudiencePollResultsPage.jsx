import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import pb from "../lib/pocketbase";
import ambientAudioFile from "./Assets/Ask the Audience Poll.mp3";

const BAR_MAX_H = 280;
const AMBIENT_AUDIO_SOURCE = ambientAudioFile;

const MEDAL_COLORS = {
  1: { fill: "linear-gradient(180deg,#ecff99 0%,#c8ff00 45%,#8ab700 100%)", text: "#deff72", glow: "rgba(200,255,0,0.48)" },
  2: { fill: "linear-gradient(180deg,#dcffb6 0%,#afff4d 45%,#6fb700 100%)", text: "#ccff8d", glow: "rgba(175,255,77,0.4)" },
  3: { fill: "linear-gradient(180deg,#d5ff9f 0%,#91e63a 45%,#4f8c00 100%)", text: "#bcff7d", glow: "rgba(145,230,58,0.34)" },
};

const getBarStyle = (rank) =>
  MEDAL_COLORS[rank]?.fill ??
  (rank <= 7
    ? "linear-gradient(180deg,#c8ff66 0%,#84db25 60%,#4d8b00 100%)"
    : "linear-gradient(180deg,#9be24a 0%,#5eb91e 60%,#356f12 100%)");

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .pr-root {
    min-height: 100vh; background: #060a08;
    color: #fff; font-family: 'Inter', sans-serif;
    overflow: hidden; position: relative;
  }
  html, body, #root {
    background: #060a08;
    overflow-x: hidden;
  }
  .pr-star {
    position: fixed; border-radius: 50%; background: #d8ff7a; pointer-events: none;
    animation: twinkle var(--d) ease-in-out infinite; animation-delay: var(--dl);
  }
  @keyframes twinkle { 0%,100%{opacity:.06;transform:scale(1)} 50%{opacity:.7;transform:scale(1.4)} }
  @keyframes fadeUp  { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
  @keyframes scaleIn { from{opacity:0;transform:scale(.4)} to{opacity:1;transform:scale(1)} }
  @keyframes numPop  { 0%{opacity:0;transform:translateY(-50px) scale(.7)} 65%{opacity:1;transform:translateY(6px) scale(1.05)} 100%{opacity:1;transform:translateY(0) scale(1)} }
  @keyframes pulseG  { 0%,100%{opacity:1} 50%{opacity:.5} }
  @keyframes breathe { 0%,100%{letter-spacing:6px} 50%{letter-spacing:12px} }
  @keyframes barRise { from{height:0;opacity:.3} to{opacity:1} }
  @keyframes colPop  { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }

  .pr-tag {
    display: inline-block; font-size: 10px; font-weight: 500; letter-spacing: 4px;
    text-transform: uppercase; color: #c8ff00;
    border: 1px solid rgba(200,255,0,.35); border-radius: 4px; padding: 4px 12px;
  }
  .pr-center {
    min-height: 100vh; display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    text-align: center; padding: 32px; position: relative; z-index: 2;
  }
  .hero-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(64px,11vw,110px); line-height: 1; letter-spacing: 3px; margin-top: 20px;
    background: linear-gradient(140deg,#fff 35%,#c8ff00 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    animation: fadeUp 1s .4s ease both;
  }
  .count-num {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(70px,14vw,120px); color: #c8ff00;
    line-height: 1; margin-top: 8px; animation: pulseG 1s ease infinite;
  }
  .cd-num {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(120px,22vw,200px); line-height: 1; color: #c8ff00;
    text-shadow: 0 0 60px rgba(200,255,0,.3); display: block;
  }
  .reveal-txt {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(28px,5vw,52px); letter-spacing: 8px; color: #c8ff00;
    text-shadow: 0 0 40px rgba(200,255,0,.45);
    animation: scaleIn .6s cubic-bezier(.34,1.56,.64,1) both, breathe 1.4s ease infinite .6s;
  }
  .dot { width: 8px; height: 8px; border-radius: 50%; background: #c8ff00; animation: pulseG 1s ease infinite; }

  .res-outer {
    position: relative; z-index: 2; height: 100vh; min-height: 100vh;
    display: flex; flex-direction: column; padding: 28px 8px 20px;
    animation: fadeUp .7s ease both;
    overflow: hidden;
  }
  .res-header { text-align: center; margin-bottom: 28px; }
  .res-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(32px,5vw,52px); letter-spacing: 4px; margin-top: 8px;
    background: linear-gradient(140deg,#fff 45%,#c8ff00);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }

  .chart-scroll {
    overflow: hidden; flex: 1; min-height: 0; padding: 0 12px 8px;
    scrollbar-width: thin; scrollbar-color: rgba(200,255,0,.25) transparent;
  }
  .chart-scroll::-webkit-scrollbar { height: 0; width: 0; }
  .chart-scroll::-webkit-scrollbar-thumb { background: rgba(200,255,0,.25); border-radius: 4px; }

  .chart-inner {
    display: flex; align-items: flex-end; justify-content: center; gap: 10px;
    width: 100%; min-width: 0; margin: 0 auto; padding: 0 12px;
    position: relative;
  }

  .chart-grid-line {
    position: absolute; left: 0; right: 0;
    border-top: 1px dashed rgba(255,255,255,.06);
    pointer-events: none;
  }
  .grid-label {
    position: absolute; right: calc(100% + 4px); bottom: -6px;
    font-size: 9px; color: #2c3b33; letter-spacing: 1px; white-space: nowrap;
  }

  .bar-col {
    display: flex; flex-direction: column; align-items: center; gap: 0;
    width: 76px; max-width: 76px; min-width: 0; flex: 1 1 0;
    animation: colPop .5s ease both;
  }
  .bar-vote-label {
    font-size: 13px; font-weight: 700; text-align: center;
    line-height: 1; margin-bottom: 5px; min-height: 26px;
  }
  .bar-pct-label { font-size: 10px; color: #49604f; display: block; margin-top: 2px; }

  .bar-track {
    width: min(60px, 100%); border-radius: 6px 6px 0 0;
    background: rgba(255,255,255,.05); position: relative;
    overflow: hidden; align-self: center;
  }
  .bar-fill {
    position: absolute; bottom: 0; left: 0; right: 0;
    border-radius: 6px 6px 0 0;
    animation: barRise var(--dur) cubic-bezier(.25,1,.5,1) both;
    animation-delay: var(--delay);
  }
  .bar-fill::after {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 35%;
    border-radius: 6px 6px 0 0; background: rgba(255,255,255,.13);
  }

  .bar-baseline { width: min(60px, 100%); height: 2px; background: rgba(255,255,255,.12); }

  .bar-name {
    font-size: 12px; font-weight: 600; text-align: center; color: #9ec4ad;
    line-height: 1.35; margin-top: 6px; word-break: break-word; max-width: 76px;
  }

  .pr-footer {
    text-align: center; margin-top: 14px;
    font-size: 10px; letter-spacing: 3px; color: #2d3d35; text-transform: uppercase;
  }
`;

function StarField() {
  const stars = useMemo(() =>
    Array.from({ length: 90 }, (_, i) => ({
      id: i,
      left: `${(i * 37.3 + 11) % 100}%`,
      top: `${(i * 53.7 + 7) % 100}%`,
      size: ((i * 7 + 1) % 2) + 1,
      d: `${((i * 1.3) % 3) + 2}s`,
      dl: `${((i * 0.7) % 3)}s`,
    })), []);

  return (
    <div aria-hidden="true">
      {stars.map((s) => (
        <div
          key={s.id}
          className="pr-star"
          style={{ left: s.left, top: s.top, width: s.size, height: s.size, "--d": s.d, "--dl": s.dl }}
        />
      ))}
    </div>
  );
}

function PhaseIntro({ eventName, totalVotes, productsCount }) {
  return (
    <div className="pr-center">
      <span className="pr-tag" style={{ animation: "fadeUp .9s ease both" }}>{eventName}</span>
      <h1 className="hero-title">The Votes<br />Are In</h1>
      <p style={{ fontSize: 15, color: "#5A6080", marginTop: 16, letterSpacing: 1, animation: "fadeUp 1s .7s ease both" }}>
        Preparing the live tally board...
      </p>
    </div>
  );
}

function PhaseCounting({ count }) {
  return (
    <div className="pr-center">
      <span className="pr-tag" style={{ animation: "fadeUp .9s ease both" }}>Counting Votes</span>
      <p style={{ fontSize: 12, letterSpacing: 4, color: "#5A6080", marginTop: 24, textTransform: "uppercase" }}>Tallying</p>
      <div className="count-num">{count.toLocaleString()}</div>
      <div style={{ fontSize: 11, letterSpacing: 4, color: "#3A4060", marginTop: 4 }}>VOTES COUNTED</div>
      <div style={{ display: "flex", gap: 10, marginTop: 36, justifyContent: "center" }}>
        {[0, 1, 2].map((i) => <div key={i} className="dot" style={{ animationDelay: `${i * 0.25}s` }} />)}
      </div>
    </div>
  );
}

function PhaseCountdown({ num }) {
  return (
    <div className="pr-center">
      <span className="pr-tag" style={{ animation: "fadeUp .9s ease both" }}>Results Incoming</span>
      <p style={{ fontSize: 12, letterSpacing: 5, color: "#5A6080", marginTop: 28, textTransform: "uppercase" }}>Revealing In</p>
      <span key={num} className="cd-num" style={{ animation: "numPop .5s cubic-bezier(.34,1.56,.64,1) both" }}>{num}</span>
    </div>
  );
}

function PhaseReveal() {
  return (
    <div className="pr-center">
      <div className="reveal-txt">And The Results Are...</div>
    </div>
  );
}

function PhaseReady({ eventName, onStart }) {
  return (
    <div className="pr-center">
      <span className="pr-tag" style={{ animation: "fadeUp .9s ease both" }}>{eventName}</span>
      <h1 className="hero-title">Results<br />Locked</h1>
      <p style={{ fontSize: 14, color: "#73806f", marginTop: 14, letterSpacing: 1 }}>
        Start the reveal when you are ready.
      </p>
      <button
        type="button"
        onClick={onStart}
        style={{
          marginTop: 28,
          border: "1px solid rgba(200,255,0,.55)",
          background: "linear-gradient(180deg,#c8ff00,#9fce00)",
          color: "#102000",
          fontSize: 14,
          fontWeight: 800,
          letterSpacing: 2,
          textTransform: "uppercase",
          padding: "12px 22px",
          cursor: "pointer",
          boxShadow: "0 0 28px rgba(200,255,0,.3)",
        }}
      >
        Start Result Reveal
      </button>
    </div>
  );
}

function PhaseResults({ revealedCount, sorted, maxVotes, totalVotes, eventName, isRankSorted, onRankThem }) {
  const gridPcts = [0.25, 0.5, 0.75, 1.0];

  return (
    <div className="res-outer">
      <div className="res-header">
        <span className="pr-tag">Final Standings</span>
        <h2 className="res-title">{eventName}</h2>
        <p style={{ fontSize: 11, color: "#3A4060", letterSpacing: 3, marginTop: 4 }}>
          {totalVotes.toLocaleString()} TOTAL VOTES · {sorted.length} PRODUCTS
        </p>
        <button
          type="button"
          onClick={onRankThem}
          disabled={isRankSorted}
          style={{
            marginTop: 14,
            border: "1px solid rgba(200,255,0,.45)",
            background: isRankSorted ? "rgba(200,255,0,.18)" : "linear-gradient(180deg,#c8ff00,#9fce00)",
            color: isRankSorted ? "#c8ff00" : "#102000",
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: 2,
            textTransform: "uppercase",
            padding: "9px 14px",
            cursor: isRankSorted ? "default" : "pointer",
            opacity: isRankSorted ? 0.78 : 1,
          }}
        >
          {isRankSorted ? "Ranked" : "Rank Them"}
        </button>
      </div>

      <div className="chart-scroll">
        <div className="chart-inner" style={{ height: BAR_MAX_H + 120 }}>
          {gridPcts.map((f) => {
            const bottomPx = Math.round(f * BAR_MAX_H) + 68;
            const labelVotes = Math.round(maxVotes * f);
            return (
              <div key={f} className="chart-grid-line" style={{ bottom: bottomPx }}>
                <span className="grid-label">{labelVotes.toLocaleString()}</span>
              </div>
            );
          })}

          {sorted.map((product, idx) => {
            const rank = idx + 1;
            const medal = MEDAL_COLORS[rank];
            const barH = maxVotes > 0 ? Math.round((product.votes / maxVotes) * BAR_MAX_H) : 0;
            const vpct = totalVotes > 0 ? ((product.votes / totalVotes) * 100).toFixed(1) : "0.0";
            const shown = idx < revealedCount;
            const textCol = medal?.text ?? (rank <= 7 ? "#a7ff4b" : "#7ccc3f");
            const delay = `${idx * 0.07}s`;

            return (
              <div
                key={product.id || product.name}
                className="bar-col"
                style={{
                  opacity: shown ? 1 : 0,
                  transition: "opacity 0.3s ease",
                  animationDelay: delay,
                  height: BAR_MAX_H + 120,
                  justifyContent: "flex-end",
                }}
              >
                <div className="bar-vote-label" style={{ color: textCol }}>
                  {shown ? product.votes.toLocaleString() : ""}
                  <span className="bar-pct-label">{shown ? `${vpct}%` : ""}</span>
                </div>

                <div className="bar-track" style={{ height: BAR_MAX_H }}>
                  {shown && (
                    <div
                      className="bar-fill"
                      style={{
                        height: barH,
                        background: getBarStyle(rank),
                        "--dur": "0.9s",
                        "--delay": delay,
                        boxShadow: medal ? `0 -6px 18px ${medal.glow}` : "none",
                      }}
                    />
                  )}
                </div>

                <div className="bar-baseline" />

                <div className="bar-name" title={product.name}>{product.name}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="pr-footer">
        Poll closed · {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
      </div>
    </div>
  );
}

export default function AudiencePollResultsPage() {
  const [hasStartedReveal, setHasStartedReveal] = useState(false);
  const [phase, setPhase] = useState(0);
  const [countdownNum, setCountdownNum] = useState(3);
  const [countingNum, setCountingNum] = useState(0);
  const [revealedCount, setRevealedCount] = useState(0);
  const [isRankSorted, setIsRankSorted] = useState(false);

  const [products, setProducts] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [dataError, setDataError] = useState("");
  const audioCtxRef = useRef(null);
  const ambientNodesRef = useRef([]);
  const ambientAudioElRef = useRef(null);

  const eventName = "ScratchLabs Voting Result";

  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = GLOBAL_CSS;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);

  const stopAmbientSound = useCallback(async () => {
    if (ambientAudioElRef.current) {
      ambientAudioElRef.current.pause();
      ambientAudioElRef.current.currentTime = 0;
      ambientAudioElRef.current = null;
    }

    ambientNodesRef.current.forEach((entry) => {
      try {
        if (entry?.node?.stop) entry.node.stop();
      } catch (err) {
        // Ignore if node already stopped.
      }
    });
    ambientNodesRef.current = [];

    if (audioCtxRef.current) {
      try {
        await audioCtxRef.current.close();
      } catch (err) {
        // Ignore close failures from browser context state.
      }
      audioCtxRef.current = null;
    }
  }, []);

  const startAmbientSound = useCallback(async () => {
    if (ambientAudioElRef.current || audioCtxRef.current) return;

    if (AMBIENT_AUDIO_SOURCE) {
      try {
        const audio = new Audio(AMBIENT_AUDIO_SOURCE);
        audio.loop = false;
        audio.preload = "auto";
        audio.volume = 0.35;
        await audio.play();
        ambientAudioElRef.current = audio;
        return;
      } catch (err) {
        // Keep silent if configured file audio fails instead of switching to synth.
        return;
      }
    }

    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;

      const ctx = new AudioContextClass();
      const master = ctx.createGain();
      master.gain.value = 0.035;
      master.connect(ctx.destination);

      const droneA = ctx.createOscillator();
      droneA.type = "sine";
      droneA.frequency.value = 196;

      const droneB = ctx.createOscillator();
      droneB.type = "triangle";
      droneB.frequency.value = 261.63;

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 620;

      const pulse = ctx.createOscillator();
      pulse.type = "sine";
      pulse.frequency.value = 0.15;

      const pulseGain = ctx.createGain();
      pulseGain.gain.value = 0.01;

      pulse.connect(pulseGain);
      pulseGain.connect(master.gain);

      droneA.connect(filter);
      droneB.connect(filter);
      filter.connect(master);

      const now = ctx.currentTime;
      droneA.start(now);
      droneB.start(now);
      pulse.start(now);

      audioCtxRef.current = ctx;
      ambientNodesRef.current = [
        { node: droneA },
        { node: droneB },
        { node: pulse },
      ];
    } catch (err) {
      // If audio fails in the browser environment, continue reveal without sound.
    }
  }, []);

  useEffect(() => {
    return () => {
      stopAmbientSound();
    };
  }, [stopAmbientSound]);

  useEffect(() => {
    let disposed = false;

    const loadProducts = async () => {
      try {
        setIsLoadingData(true);
        setDataError("");

        const records = await pb.collection("products").getFullList(200, {
          sort: "-count,name",
          requestKey: null,
        });

        const mapped = records.map((record) => ({
          id: record.id,
          name: String(record.name || "Unnamed Product"),
          votes: Number(record.count || 0),
        }));

        if (!disposed) {
          setProducts(mapped);
        }
      } catch (error) {
        if (!disposed) {
          setDataError(error.message || "Unable to load poll data from PocketBase.");
        }
      } finally {
        if (!disposed) {
          setIsLoadingData(false);
        }
      }
    };

    loadProducts();

    return () => {
      disposed = true;
    };
  }, []);

  const sorted = useMemo(
    () => {
      if (isRankSorted) {
        return [...products].sort(
          (a, b) => b.votes - a.votes || a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
        );
      }
      return [...products].sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));
    },
    [products, isRankSorted]
  );

  const maxVotes = useMemo(
    () => products.reduce((max, p) => Math.max(max, Number(p.votes || 0)), 0),
    [products]
  );
  const totalVotes = useMemo(
    () => products.reduce((sum, p) => sum + Number(p.votes || 0), 0),
    [products]
  );

  useEffect(() => {
    if (isLoadingData || dataError || sorted.length === 0 || !hasStartedReveal) {
      return undefined;
    }

    setPhase(0);
    setCountdownNum(3);
    setCountingNum(0);
    setRevealedCount(0);
    setIsRankSorted(false);

    const t = [
      setTimeout(() => setPhase(1), 2_000),
      setTimeout(() => setPhase(2), 7_600),
      setTimeout(() => setCountdownNum(2), 8_600),
      setTimeout(() => setCountdownNum(1), 9_600),
      setTimeout(() => setPhase(3), 10_600),
      setTimeout(() => setPhase(4), 11_600),
    ];

    return () => t.forEach(clearTimeout);
  }, [isLoadingData, dataError, sorted.length, hasStartedReveal]);

  const handleStartReveal = async () => {
    await startAmbientSound();
    setHasStartedReveal(true);
  };

  const handleRankThem = () => {
    setIsRankSorted(true);
  };

  useEffect(() => {
    if (phase !== 1) return undefined;

    const tickMs = 140;
    const countDurationMs = 4200;
    const estimatedTicks = Math.max(1, Math.floor(countDurationMs / tickMs));
    const baseStep = Math.max(1, Math.ceil(totalVotes / estimatedTicks));

    let n = 0;
    const iv = setInterval(() => {
      const jitter = Math.floor(Math.random() * Math.max(2, Math.floor(baseStep * 0.35)));
      n = Math.min(n + baseStep + jitter, totalVotes);
      setCountingNum(n);
      if (n >= totalVotes) clearInterval(iv);
    }, tickMs);
    return () => clearInterval(iv);
  }, [phase, totalVotes]);

  useEffect(() => {
    if (phase !== 4) return undefined;
    let i = 0;
    const iv = setInterval(() => {
      i += 1;
      setRevealedCount(i);
      if (i >= sorted.length) clearInterval(iv);
    }, 120);
    return () => clearInterval(iv);
  }, [phase, sorted.length]);

  if (isLoadingData) {
    return (
      <div className="pr-root">
        <StarField />
        <PhaseIntro eventName={eventName} totalVotes={0} productsCount={0} />
      </div>
    );
  }

  if (dataError) {
    return (
      <div className="pr-root">
        <StarField />
        <div className="pr-center">
          <span className="pr-tag" style={{ animation: "fadeUp .9s ease both" }}>Error</span>
          <h1 className="hero-title">Unable To<br />Load Results</h1>
          <p style={{ fontSize: 14, color: "#9aa3be", marginTop: 12 }}>{dataError}</p>
        </div>
      </div>
    );
  }

  if (!sorted.length) {
    return (
      <div className="pr-root">
        <StarField />
        <div className="pr-center">
          <span className="pr-tag" style={{ animation: "fadeUp .9s ease both" }}>No Data</span>
          <h1 className="hero-title">No Votes<br />Available</h1>
          <p style={{ fontSize: 14, color: "#9aa3be", marginTop: 12 }}>Products collection is empty.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pr-root">
      <StarField />
      {!hasStartedReveal && <PhaseReady eventName={eventName} onStart={handleStartReveal} />}
      {hasStartedReveal && phase === 0 && <PhaseIntro eventName={eventName} totalVotes={totalVotes} productsCount={sorted.length} />}
      {hasStartedReveal && phase === 1 && <PhaseCounting count={countingNum} />}
      {hasStartedReveal && phase === 2 && <PhaseCountdown num={countdownNum} />}
      {hasStartedReveal && phase === 3 && <PhaseReveal />}
      {hasStartedReveal && phase === 4 && (
        <PhaseResults
          revealedCount={revealedCount}
          sorted={sorted}
          maxVotes={maxVotes}
          totalVotes={totalVotes}
          eventName={eventName}
          isRankSorted={isRankSorted}
          onRankThem={handleRankThem}
        />
      )}
    </div>
  );
}
