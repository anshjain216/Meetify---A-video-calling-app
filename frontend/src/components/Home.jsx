import { useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import link from "../environment";


export default function Home() {
    const [meetingId, setMeetingId] = useState("");
    const [connecting, setConnecting] = useState(false);

    const { user, userAvailable, setUserAvailable, setUser } = useContext(AuthContext);
    const navigate = useNavigate();


    const handleConnect = async () => {
        if (!meetingId.trim()) return;
        setConnecting(true);
        const tk = localStorage.getItem("token");
        if (tk) {
            try {
                await axios.post(`${link}/add_to_activity`, {
                    meetingId
                }, {
                    headers: {
                        Authorization: `Bearer ${tk}`
                    }
                });
            } catch (err) {
                console.error(err);
            }
        }

        setTimeout(() => setConnecting(false), 2000);
        navigate(`/${meetingId}`);
    };

    return (
        <div className="min-h-screen bg-[#fdf6f0] font-sans">

            {/* ── GOOGLE FONTS ── */}
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500&display=swap');
        body { font-family: 'DM Sans', sans-serif; }
        .font-display { font-family: 'Playfair Display', serif; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner { animation: spin 0.7s linear infinite; }
      `}</style>

            {/* ──────────────────────────────────────
          NAVBAR
      ────────────────────────────────────── */}
            <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-12 h-[68px] bg-[#fdf6f0]/80 backdrop-blur-md border-b border-black/[0.06]">

                {/* Logo */}
                <a href="#" className="flex items-center gap-2.5 no-underline">
                    <div className="w-9 h-9 bg-[#e8521a] rounded-[10px] flex items-center justify-center font-display font-black text-white text-base">
                        V
                    </div>
                    <span className="font-display text-[22px] font-bold text-[#1a1a1a] tracking-tight">
                        Voya
                    </span>
                </a>

                {/* Right side */}
                <div className="flex items-center gap-3">



                    {/* User Info */}
                    <div className="flex items-center gap-3 cursor-pointer px-3 py-1.5 pl-1.5 rounded-full transition-colors hover:bg-[#e8521a]/[0.07]">
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
                    {/* History & Logout — only when logged in */}
                    {userAvailable && (
                        <>
                            <button className="flex items-center gap-1.5 text-[13.5px] font-medium text-[#555] px-4 py-2 rounded-full hover:bg-[#e8521a]/[0.07] hover:text-[#e8521a] transition-colors cursor-pointer border-none bg-transparent" onClick={()=>{
          navigate("/history");
        }}>
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
                                    navigate("/");
                                }}
                                className="flex items-center gap-1.5 text-[13.5px] font-medium text-[#e8521a] px-4 py-2 rounded-full border border-[#e8521a]/30 hover:bg-[#e8521a] hover:text-white transition-all cursor-pointer bg-transparent"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M18 12H9m0 0 3-3m-3 3 3 3" />
                                </svg>
                                Logout
                            </button>
                        </>
                    )}

                </div>
            </nav>

            {/* ──────────────────────────────────────
          HERO
      ────────────────────────────────────── */}
            <main className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-16 overflow-hidden">

                {/* Decorative blobs */}
                <div className="absolute top-[-100px] right-[-80px] w-[480px] h-[480px] rounded-full bg-[radial-gradient(circle,_#f4a87a,_transparent_70%)] blur-[80px] opacity-35 pointer-events-none" />
                <div className="absolute bottom-10 left-[-100px] w-[360px] h-[360px] rounded-full bg-[radial-gradient(circle,_#e8521a,_transparent_70%)] blur-[80px] opacity-10 pointer-events-none" />

                <div className="relative z-10 text-center max-w-xl w-full">

                    {/* Eyebrow */}
                    <div className="inline-flex items-center gap-2 text-[11px] font-medium tracking-[2.5px] uppercase text-[#e8521a] mb-6">
                        <span className="w-7 h-[1.5px] bg-[#e8521a]" />
                        The Future of Connection
                    </div>

                    {/* Heading */}
                    <h1 className="font-display text-[clamp(42px,7vw,72px)] font-black leading-[1.05] tracking-[-2px] text-[#1a1a1a] mb-5">
                        Feel{" "}
                        <em className="not-italic text-[#e8521a]">together,</em>
                        <br />
                        wherever
                        <br />
                        you are.
                    </h1>

                    {/* Subheading */}
                    <p className="text-[16px] text-[#666] leading-[1.75] font-light mb-14 max-w-[420px] mx-auto">
                        Jump into a call instantly. Enter a meeting ID or start a new room —
                        crystal-clear, zero-lag, every time.
                    </p>

                    {/* ── JOIN CARD ── */}
                    <div className="bg-white border border-black/[0.07] rounded-3xl px-9 py-10 shadow-[0_4px_6px_rgba(0,0,0,0.04),0_20px_50px_rgba(232,82,26,0.08)] w-full max-w-[440px] mx-auto">

                        <p className="text-left text-[11px] font-medium tracking-[1.8px] uppercase text-[#aaa] mb-2.5">
                            Enter Meeting ID
                        </p>

                        <input
                            type="text"
                            placeholder="e.g. voya-river-sunset-42"
                            value={meetingId}
                            onChange={(e) => setMeetingId(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleConnect()}
                            className="w-full px-5 py-4 mb-4 text-[15px] text-[#1a1a1a] bg-[#fdf6f0] border-[1.5px] border-transparent rounded-[14px] outline-none placeholder-[#c8b8af] transition-all focus:border-[#e8521a] focus:shadow-[0_0_0_4px_rgba(232,82,26,0.1)] focus:bg-white"
                        />

                        <button
                            onClick={handleConnect}
                            disabled={connecting || !meetingId.trim()}
                            className="w-full py-[17px] px-6 bg-[#e8521a] text-white text-[15px] font-medium rounded-[14px] border-none flex items-center justify-center gap-2.5 transition-all hover:bg-[#d44815] hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(232,82,26,0.3)] active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                        >
                            {connecting ? (
                                <>
                                    <span className="spinner w-[17px] h-[17px] rounded-full border-2 border-white/30 border-t-white" />
                                    Connecting…
                                </>
                            ) : (
                                <>
                                    <span className="text-[17px]">📹</span>
                                    Connect to Meeting
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* ── STATS ── */}
                <div className="relative z-10 flex gap-12 justify-center mt-14">
                    {[
                        { num: "4K", label: "Crystal Video" },
                        { num: "180+", label: "Countries" },
                        { num: "2M+", label: "Daily Calls" },
                    ].map((s) => (
                        <div key={s.label} className="text-center">
                            <div className="font-display text-[28px] font-bold text-[#e8521a]">
                                {s.num}
                            </div>
                            <div className="text-[12px] text-[#aaa] mt-0.5 tracking-wide">
                                {s.label}
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}