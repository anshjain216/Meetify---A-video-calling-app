import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

/* ── Google Font injected once ── */
const FontLink = () => {
  useEffect(() => {
    const id = "voya-fonts";
    if (!document.getElementById(id)) {
      const link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      link.href =
        "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Outfit:wght@300;400;500;600&display=swap";
      document.head.appendChild(link);
    }
  }, []);
  return null;
};

/* ── Keyframe styles injected once ── */
const GlobalStyles = () => {
  useEffect(() => {
    const id = "voya-styles";
    if (!document.getElementById(id)) {
      const style = document.createElement("style");
      style.id = id;
      style.textContent = `
        .font-playfair { font-family: 'Playfair Display', serif; }
        .font-outfit    { font-family: 'Outfit', sans-serif; }
        @keyframes riseIn  { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spinRing{ to   { transform:translate(-50%,-50%) rotate(360deg); } }
        @keyframes floatUp { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes blink   { 0%,100%{opacity:1} 50%{opacity:.35} }
        @keyframes pulseGlow { 0%,100%{box-shadow:0 0 0 0 rgba(232,120,58,.45)} 50%{box-shadow:0 0 0 10px rgba(232,120,58,0)} }
        .animate-rise-1  { animation: riseIn .7s  .1s ease both; }
        .animate-rise-2  { animation: riseIn .7s  .22s ease both; }
        .animate-rise-3  { animation: riseIn .7s  .34s ease both; }
        .animate-rise-4  { animation: riseIn .7s  .46s ease both; }
        .animate-rise-5  { animation: riseIn .7s  .58s ease both; }
        .animate-rise-r  { animation: riseIn .9s  .28s ease both; }
        .float-1 { animation: floatUp 4s   0s   ease-in-out infinite; }
        .float-2 { animation: floatUp 4s   1.4s ease-in-out infinite; }
        .float-3 { animation: floatUp 4s   0.7s ease-in-out infinite; }
        .spin-ring{ animation: spinRing 32s linear infinite; }
        .blink-dot{ animation: blink 1.5s ease-in-out infinite; }
        .pulse-btn{ animation: pulseGlow 2.4s ease-in-out infinite; }
        .stroke-text {
          -webkit-text-stroke: 2.5px #1a1108;
          color: transparent;
        }
        .grad-text {
          background: linear-gradient(135deg,#e8783a,#e85d3a);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .stat-grad {
          background: linear-gradient(135deg,#e8783a,#f0a050);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .feat-grad {
          background: linear-gradient(135deg,#e8783a,#f0a050);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .noise-overlay {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E");
          opacity:.028;
        }
        .phone-shadow { box-shadow: 0 40px 80px rgba(26,17,8,.22), 0 8px 20px rgba(26,17,8,.10); }
        .card-shadow  { box-shadow: 0 8px 32px rgba(26,17,8,.10), 0 2px 8px rgba(26,17,8,.05); }
        .nav-shadow   { box-shadow: 0 1px 0 rgba(26,17,8,.07); }
        .btn-glow     { box-shadow: 0 8px 28px rgba(232,120,58,.45); }
        .btn-glow:hover { box-shadow: 0 14px 40px rgba(232,120,58,.55); }
      `;
      document.head.appendChild(style);
    }
  }, []);
  return null;
};

/* ── Phone Mockup ── */
function PhoneMockup({ rotate, translateX, zIndex, faceGradient, emoji, name, status, showDuration, controls }) {
  const [hovered, setHovered] = useState(false);
  const baseTransform = `translate(${translateX}, -50%) rotate(${rotate}deg)`;
  const hoverTransform = `translate(${translateX}, -54%) rotate(${rotate / 2}deg) scale(1.04)`;

  return (
    <div
      className="absolute phone-shadow"
      style={{
        width: 200,
        height: rotate < 0 ? 430 : 395,
        top: "50%",
        left: "50%",
        transform: hovered ? hoverTransform : baseTransform,
        transition: "transform .45s cubic-bezier(.34,1.56,.64,1)",
        zIndex: hovered ? 10 : zIndex,
        borderRadius: 36,
        border: "8px solid white",
        background: "white",
        overflow: "hidden",
        cursor: "default",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Face */}
      <div className="relative flex-1 flex items-center justify-center overflow-hidden"
        style={{ flex: 1, background: faceGradient, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 56, position: "relative" }}>
        {showDuration && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10 text-white text-xs font-semibold tracking-wider px-2 py-1 rounded-full"
            style={{ background: "rgba(0,0,0,.28)", backdropFilter: "blur(6px)" }}>
            12:47
          </div>
        )}
        <span style={{ position: "relative", zIndex: 1 }}>{emoji}</span>
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(15,8,0,.62) 0%, transparent 55%)" }} />
        <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
          <p className="font-playfair font-bold text-white" style={{ fontSize: 15 }}>{name}</p>
          <p className="flex items-center gap-1 text-white/80 mt-1" style={{ fontSize: 11 }}>
            <span className="blink-dot inline-block w-1.5 h-1.5 rounded-full bg-green-400" style={{ boxShadow: "0 0 6px #4ade80" }} />
            {status}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white flex items-center justify-center gap-2 py-3">
        {controls.map((c, i) => (
          <button key={i} className="flex items-center justify-center rounded-full transition-transform hover:scale-110"
            style={{ width: 35, height: 35, background: c.bg, border: "none", cursor: "pointer", fontSize: 14, color: c.color || "#333" }}>
            {c.icon}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Float Card ── */
function FloatCard({ icon, iconBg, label, sub, posClass, floatClass }) {
  return (
    <div className={`absolute bg-white rounded-2xl flex items-center gap-3 z-20 card-shadow ${posClass} ${floatClass}`}
      style={{ padding: "10px 14px", whiteSpace: "nowrap" }}>
      <div className="flex items-center justify-center rounded-xl text-lg flex-shrink-0"
        style={{ width: 34, height: 34, background: iconBg }}>{icon}</div>
      <div>
        <p className="font-outfit font-medium text-stone-800" style={{ fontSize: 13 }}>{label}</p>
        <p className="font-outfit text-stone-400" style={{ fontSize: 11, marginTop: 2 }}>{sub}</p>
      </div>
    </div>
  );
}

/* ── Main Component ── */
export default function Landing() {
  const { user, userAvailable, setUserAvailable, setUser } = useContext(AuthContext);
  return (
    <div className="font-outfit min-h-screen overflow-x-hidden" style={{ background: "#fdf8f2", color: "#1a1108" }}>
      <FontLink />
      <GlobalStyles />

      {/* Background radial glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute" style={{ top: "-10%", right: "-5%", width: "65vw", height: "65vw", borderRadius: "50%", background: "radial-gradient(circle, rgba(232,120,58,.13) 0%, transparent 60%)" }} />
        <div className="absolute" style={{ bottom: "-10%", left: "-5%", width: "50vw", height: "50vw", borderRadius: "50%", background: "radial-gradient(circle, rgba(240,160,80,.1) 0%, transparent 55%)" }} />
        <div className="noise-overlay absolute inset-0" />
      </div>

      {/* ── NAV ── */}
      <nav className="relative z-50 flex items-center justify-between px-20 py-6 nav-shadow" style={{ background: "rgba(253,248,242,.85)", backdropFilter: "blur(12px)" }}>
        <div className="font-playfair font-black flex items-center gap-2" style={{ fontSize: 26, letterSpacing: "-0.02em" }}>
          <span className="flex items-center justify-center rounded-xl text-white font-outfit font-bold"
            style={{ width: 30, height: 30, fontSize: 14, background: "linear-gradient(135deg,#e8783a,#e85d3a)", boxShadow: "0 4px 14px rgba(232,120,58,.4)" }}>
            V
          </span>
          Voya
        </div>
        <div className="flex items-center gap-1">

          {/* Join as Guest */}
          {!userAvailable ? (<><Link to="/home" className="font-outfit font-medium rounded-full transition-all hover:bg-stone-100"
            style={{
              color: "#9b8060",
              fontSize: 14,
              padding: "8px 16px",
              textDecoration: "none"
            }}
          >Join as Guest</Link>

  {/* Register */}
          <Link
            to="/signup"
            className="font-outfit font-medium rounded-full transition-all hover:bg-stone-100"
            style={{
              color: "#9b8060",
              fontSize: 14,
              padding: "8px 16px",
              textDecoration: "none"
            }}
          >
            Register
          </Link>

          {/* Login Button */}
          <Link to="/login">
            <div
              className="font-outfit font-semibold rounded-full transition-all hover:-translate-y-0.5"
              style={{
                background: "#1a1108",
                color: "#fdf8f2",
                fontSize: 14,
                padding: "9px 18px",
                textDecoration: "none",
                boxShadow: "0 4px 16px rgba(26,17,8,.2)"
              }}
            >
              Login
            </div>
          </Link></>):
          (<><div className="flex items-center gap-3 cursor-pointer px-3 py-1.5 pl-1.5 rounded-full transition-colors hover:bg-[#e8521a]/[0.07]">
            <div className="w-[38px] h-[38px] rounded-full bg-gradient-to-br from-[#e8521a] to-[#f0844a] flex items-center justify-center text-white font-bold text-sm tracking-wide flex-shrink-0">
              {user.avatar}
            </div>
            <div className="flex flex-col">
              <span className="text-[13.5px] font-medium text-[#1a1a1a] leading-tight">
                {user.name}
              </span>
              <span className="flex items-center gap-1 text-[11.5px] text-[#888]">
                <span className="w-[7px] h-[7px] rounded-full bg-emerald-400 shadow-[0_0_0_2px_rgba(52,211,153,0.25)]" />
                {user.status}
              </span>
            </div>
          </div>
        <button className="flex items-center gap-1.5 text-[13.5px] font-medium text-[#555] px-4 py-2 rounded-full hover:bg-[#e8521a]/[0.07] hover:text-[#e8521a] transition-colors cursor-pointer border-none bg-transparent">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 1 1-20 0 10 10 0 0 1 20 0z" />
                    </svg>
                    History
                </button>

                <button
                    onClick={() => {
                        localStorage.removeItem("token");
                        setUserAvailable(false);
                        setUser({ name: "Guest", avatar: "G", status: "Online" });
                    }}
                    className="flex items-center gap-1.5 text-[13.5px] font-medium text-[#e8521a] px-4 py-2 rounded-full border border-[#e8521a]/30 hover:bg-[#e8521a] hover:text-white transition-all cursor-pointer bg-transparent"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M18 12H9m0 0 3-3m-3 3 3 3" />
                    </svg>
                    Logout
                </button></>)}


        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative z-10 grid items-center px-20 pb-16"
        style={{ gridTemplateColumns: "1fr 1fr", minHeight: "calc(100vh - 80px)", gap: "2rem" }}>

        {/* LEFT */}
        <div style={{ maxWidth: 560 }}>
          {/* Eyebrow */}
          <div className="animate-rise-1 inline-flex items-center gap-3 mb-8"
            style={{ opacity: 0 }}>
            <div className="rounded" style={{ width: 32, height: 2, background: "#e8783a" }} />
            <span className="font-outfit font-semibold tracking-widest uppercase"
              style={{ fontSize: 12, color: "#e8783a" }}>The Future of Connection</span>
          </div>

          {/* Headline */}
          <h1 className="font-playfair animate-rise-2 mb-6"
            style={{ fontSize: "clamp(2.8rem,5.5vw,4.8rem)", fontWeight: 900, lineHeight: 1.03, letterSpacing: "-0.03em", opacity: 0 }}>
            Feel{" "}
            <em className="grad-text not-italic">together,</em>
            <br />
            <span className="stroke-text">wherever</span>
            <br />
            you are.
          </h1>

          {/* Description */}
          <p className="animate-rise-3 mb-10"
            style={{ color: "#5c3d1e", fontSize: 17, lineHeight: 1.75, maxWidth: 440, opacity: 0 }}>
            Voya brings people closer with breathtaking video quality, zero-lag audio, and an experience so seamless it melts the miles between you.
          </p>

          {/* CTA Row */}
          <div className="animate-rise-4 flex items-center gap-4" style={{ opacity: 0 }}>
            <Link to="/login" className="btn-glow inline-flex items-center gap-2 font-outfit font-semibold rounded-2xl transition-all hover:-translate-y-1"
              style={{ background: "linear-gradient(135deg,#e8783a,#e85d3a)", color: "white", fontSize: 16, padding: "14px 28px", textDecoration: "none" }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 10l4.553-2.277A1 1 0 0121 8.723v6.554a1 1 0 01-1.447.894L15 14v-4z" />
                <rect x="1" y="6" width="15" height="12" rx="2" />
              </svg>
              Get Started Free
            </Link>
          </div>

          {/* Trust Stats */}
          <div className="animate-rise-5 flex items-center gap-8 mt-12 pt-8"
            style={{ borderTop: "1px solid rgba(26,17,8,.08)", opacity: 0 }}>
            {[["4K", "Crystal Video"], ["180+", "Countries"], ["2M+", "Daily Calls"]].map(([num, label], i) => (
              <div key={i} className="flex items-center gap-8">
                {i > 0 && <div style={{ width: 1, height: 38, background: "rgba(26,17,8,.1)" }} />}
                <div>
                  <p className="font-playfair font-bold stat-grad" style={{ fontSize: 30, letterSpacing: "-0.02em" }}>{num}</p>
                  <p className="font-outfit" style={{ fontSize: 12, color: "#9b8060", marginTop: 2 }}>{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — Phone Mockups */}
        <div className="animate-rise-r relative flex items-center justify-center" style={{ height: 600, opacity: 0 }}>
          {/* Deco circles */}
          <div className="absolute rounded-full" style={{ width: 460, height: 460, top: "50%", left: "50%", transform: "translate(-50%,-50%)", background: "linear-gradient(145deg,rgba(232,120,58,.11),rgba(240,160,80,.05))", border: "1px solid rgba(232,120,58,.14)" }} />
          <div className="spin-ring absolute rounded-full" style={{ width: 340, height: 340, top: "50%", left: "50%", border: "1px dashed rgba(232,120,58,.22)" }} />

          {/* Phone A */}
          <PhoneMockup
            rotate={-7}
            translateX="-82%"
            zIndex={3}
            faceGradient="linear-gradient(160deg,#fde8d2 0%,#f5c498 40%,#e8a070 100%)"
            emoji="🧑‍💼"
            name="Rohan Mehta"
            status="Connected · HD"
            showDuration={false}
            controls={[
              { icon: "🎙️", bg: "#f4f4f4" },
              { icon: "📷", bg: "#f4f4f4" },
              { icon: "✕", bg: "linear-gradient(135deg,#ef4444,#dc2626)", color: "white" },
              { icon: "🔊", bg: "rgba(232,120,58,.12)", color: "#e8783a" },
            ]}
          />

          {/* Phone B */}
          <PhoneMockup
            rotate={6}
            translateX="8%"
            zIndex={2}
            faceGradient="linear-gradient(160deg,#d4e8e0 0%,#a0d0bc 40%,#70b8a0 100%)"
            emoji="👩‍🦱"
            name="Aisha Khan"
            status="Active"
            showDuration={true}
            controls={[
              { icon: "🔇", bg: "#f4f4f4" },
              { icon: "✕", bg: "linear-gradient(135deg,#ef4444,#dc2626)", color: "white" },
              { icon: "🔈", bg: "rgba(232,120,58,.12)", color: "#e8783a" },
            ]}
          />

          {/* Floating Cards */}
          <FloatCard icon="🔒" iconBg="rgba(232,120,58,.12)" label="End-to-End Encrypted" sub="All calls secured"
            posClass="top-[5%] right-0" floatClass="float-1" />
          <FloatCard icon="⚡" iconBg="rgba(74,222,128,.15)" label="Ultra-Low Latency" sub="<60ms globally"
            posClass="bottom-[18%] left-[-2%]" floatClass="float-2" />
          <FloatCard icon="👥" iconBg="rgba(96,165,250,.15)" label="Group Calls" sub="Up to 50 people"
            posClass="top-[38%] right-[-6%]" floatClass="float-3" />
        </div>
      </section>

      {/* ── FEATURES BAND ── */}
      <div className="relative z-10 grid" style={{ background: "#1a1108", gridTemplateColumns: "repeat(3,1fr)" }}>
        {[
          { num: "4K", title: "Cinema-Grade Video", desc: "Adaptive streaming delivers the best resolution your connection can handle — always." },
          { num: "256-bit", title: "Military Encryption", desc: "Every call is wrapped end-to-end. Zero logs. Your conversations belong only to you." },
          { num: "50+", title: "Group Calling", desc: "Bring everyone together — family, friends, or your whole team — with crystal-clear audio." },
        ].map((f, i) => (
          <div key={i} className="group transition-colors hover:bg-white/[.03] px-10 py-14"
            style={{ borderRight: i < 2 ? "1px solid rgba(255,255,255,.07)" : "none" }}>
            <p className="font-playfair font-bold feat-grad mb-3" style={{ fontSize: 42 }}>{f.num}</p>
            <p className="font-outfit font-semibold text-white mb-2" style={{ fontSize: 16 }}>{f.title}</p>
            <p className="font-outfit" style={{ fontSize: 14, color: "rgba(255,255,255,.38)", lineHeight: 1.7 }}>{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
