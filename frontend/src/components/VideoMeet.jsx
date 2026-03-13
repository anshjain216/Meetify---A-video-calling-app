import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';


const server = "http://localhost:3000";

// ─── WebRTC Config ────────────────────────────────────────────────────────────

const ICE_SERVERS = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
const peerConnections = {};

// ─── Helpers: silent audio + black video tracks ───────────────────────────────

function createSilentAudioTrack() {
  const ctx = new AudioContext();
  const oscillator = ctx.createOscillator();
  const dest = oscillator.connect(ctx.createMediaStreamDestination());
  oscillator.start();
  ctx.resume();
  return Object.assign(dest.stream.getAudioTracks()[0], { enabled: false });
}

function createBlackVideoTrack({ width = 640, height = 480 } = {}) {
  const canvas = Object.assign(document.createElement('canvas'), { width, height });
  canvas.getContext('2d').fillRect(0, 0, width, height);
  return Object.assign(canvas.captureStream().getVideoTracks()[0], { enabled: false });
}

function createBlackSilenceStream() {
  return new MediaStream([createBlackVideoTrack(), createSilentAudioTrack()]);
}

// ─── SVG Icons (replacing MUI icons) ─────────────────────────────────────────

const IconCamera = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M17 10.5V7a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h12a1 1 0 001-1v-3.5l4 4v-11l-4 4z"/>
  </svg>
);

const IconCameraOff = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M21 6.5l-4 4V7a1 1 0 00-1-1H9.82L21 17.18V6.5zM3.27 2L2 3.27 4.73 6H4a1 1 0 00-1 1v10a1 1 0 001 1h12c.21 0 .39-.08.54-.18L19.73 21 21 19.73 3.27 2z"/>
  </svg>
);

const IconMic = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 14a3 3 0 003-3V5a3 3 0 00-6 0v6a3 3 0 003 3zm5-3a5 5 0 01-10 0H5a7 7 0 0014 0h-2z"/>
  </svg>
);

const IconMicOff = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M19 11h-1.7c0 .74-.16 1.43-.43 2.05l1.23 1.23c.56-.98.9-2.09.9-3.28zm-4.02.17c0-.06.02-.11.02-.17V5c0-1.66-1.34-3-3-3S9 3.34 9 5v.18l5.98 5.99zM4.27 3L3 4.27l6.01 6.01V11c0 1.66 1.33 3 2.99 3 .22 0 .44-.03.65-.08l1.66 1.66c-.71.33-1.5.52-2.31.52-2.76 0-5.3-2.1-5.3-5.1H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c.91-.13 1.77-.45 2.54-.9L19.73 21 21 19.73 4.27 3z"/>
  </svg>
);

const IconPhone = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/>
  </svg>
);

const IconScreenShare = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M20 3H4a2 2 0 00-2 2v11a2 2 0 002 2h6v2H8v2h8v-2h-2v-2h6a2 2 0 002-2V5a2 2 0 00-2-2zm0 13H4V5h16v11zm-6-4l-4-4v3H6v2h4v3l4-4z"/>
  </svg>
);

const IconScreenShareOff = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M1.41 1.13L0 2.54l2 2V16c0 1.1.9 2 2 2h3.46L5.46 16H4V4.54l14 14H10v2h4v2h2v-2h4c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2H5.54l-2.8-2.8-1.33 1.93zM22 5v11l-4-4V7H9.54L7.54 5H22z"/>
  </svg>
);

const IconChat = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M20 2H4a2 2 0 00-2 2v18l4-4h14a2 2 0 002-2V4a2 2 0 00-2-2zm0 14H6l-2 2V4h16v12z"/>
  </svg>
);

const IconSend = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
  </svg>
);

// ─── Reusable Control Button ──────────────────────────────────────────────────

function ControlBtn({ onClick, active, danger = false, children, badge = 0 }) {
  const base = 'relative flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-200 focus:outline-none';
  const style = danger
    ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-900/40'
    : active
    ? 'bg-white text-gray-800 shadow-md hover:shadow-lg'
    : 'bg-white/10 text-white hover:bg-white/20 border border-white/20';

  return (
    <button onClick={onClick} className={`${base} ${style}`}>
      {children}
      {badge > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </button>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function VideoMeet() {
  const socketRef        = useRef(null);
  const mySocketIdRef    = useRef(null);
  const localVideoRef    = useRef(null);
  const remoteVideoRefs  = useRef([]);
  const messagesEndRef   = useRef(null);

  const [inLobby, setInLobby]                             = useState(true);
  const [username, setUsername]                           = useState('');

  const [hasCameraPermission, setHasCameraPermission]     = useState(false);
  const [hasMicPermission, setHasMicPermission]           = useState(false);
  const [hasScreenShareSupport, setHasScreenShareSupport] = useState(false);

  const [cameraOn, setCameraOn]           = useState(false);
  const [micOn, setMicOn]                 = useState(false);
  const [screenShareOn, setScreenShareOn] = useState(false);

  const [remoteStreams, setRemoteStreams] = useState([]);

  const [chatOpen, setChatOpen]         = useState(false);
  const [messages, setMessages]         = useState([]);
  const [draftMessage, setDraftMessage] = useState('');
  const [unreadCount, setUnreadCount]   = useState(0);

  // ─── 1. Detect media permissions on mount ──────────────────────────────────

  useEffect(() => {
    async function checkPermissions() {
      try { await navigator.mediaDevices.getUserMedia({ video: true }); setHasCameraPermission(true); }
      catch { setHasCameraPermission(false); }

      try { await navigator.mediaDevices.getUserMedia({ audio: true }); setHasMicPermission(true); }
      catch { setHasMicPermission(false); }

      setHasScreenShareSupport(!!navigator.mediaDevices.getDisplayMedia);

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        window.localStream = stream;
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      } catch (e) { console.warn('Local preview unavailable:', e); }
    }
    checkPermissions();
  }, []);

  // ─── 2. Re-broadcast when camera/mic toggles change ────────────────────────

  useEffect(() => {
    async function updateLocalStream() {
      const shouldStream = (cameraOn && hasCameraPermission) || (micOn && hasMicPermission);
      if (shouldStream) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: cameraOn && hasCameraPermission,
            audio: micOn && hasMicPermission,
          });
          applyLocalStream(stream);
        } catch (e) { console.error('getUserMedia failed:', e); }
      } else {
        stopLocalTracks();
      }
    }
    updateLocalStream();
  }, [cameraOn, micOn]);

  // ─── 3. Handle screen share toggle ─────────────────────────────────────────

  useEffect(() => {
    if (screenShareOn) startScreenShare();
  }, [screenShareOn]);

  // Auto-scroll chat to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ─── Local stream helpers ───────────────────────────────────────────────────

  function applyLocalStream(stream) {
    stopLocalTracks();
    window.localStream = stream;
    if (localVideoRef.current) localVideoRef.current.srcObject = stream;

    stream.getTracks().forEach((track) => {
      track.onended = () => {
        setCameraOn(false);
        setMicOn(false);
        const fallback = createBlackSilenceStream();
        window.localStream = fallback;
        if (localVideoRef.current) localVideoRef.current.srcObject = fallback;
        broadcastStreamToPeers(fallback);
      };
    });
    broadcastStreamToPeers(stream);
  }

  function stopLocalTracks() {
    try { localVideoRef.current?.srcObject?.getTracks().forEach((t) => t.stop()); }
    catch (e) { console.warn(e); }
  }

  function broadcastStreamToPeers(stream) {
    for (const peerId in peerConnections) {
      if (peerId === mySocketIdRef.current) continue;
      peerConnections[peerId].addStream(stream);
      peerConnections[peerId]
        .createOffer()
        .then((desc) => peerConnections[peerId].setLocalDescription(desc))
        .then(() => {
          socketRef.current.emit('signal', peerId, JSON.stringify({ sdp: peerConnections[peerId].localDescription }));
        })
        .catch(console.error);
    }
  }

  // ─── Screen share ───────────────────────────────────────────────────────────

  async function startScreenShare() {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
      applyLocalStream(stream);
      stream.getTracks().forEach((track) => {
        track.onended = () => {
          setScreenShareOn(false);
          if (cameraOn || micOn) {
            navigator.mediaDevices.getUserMedia({ video: cameraOn, audio: micOn })
              .then(applyLocalStream).catch(console.error);
          }
        };
      });
    } catch (e) {
      console.error('Screen share failed:', e);
      setScreenShareOn(false);
    }
  }

  // ─── Socket + WebRTC ────────────────────────────────────────────────────────

  function connectToServer() {
    socketRef.current = io.connect(server, { secure: false });

    socketRef.current.on('connect', () => {
      mySocketIdRef.current = socketRef.current.id;
      socketRef.current.emit('join-call', window.location.href);
      socketRef.current.on('chat-message', handleIncomingMessage);
      socketRef.current.on('user-left', handleUserLeft);
      socketRef.current.on('connected-users', handleConnectedUsers);
      socketRef.current.on('user-joined', handleUserJoined);
    });

    socketRef.current.on('signal', handleSignal);
  }

  function handleUserLeft(socketId) {
    setRemoteStreams((prev) => prev.filter((v) => v.socketId !== socketId));
  }

  function handleConnectedUsers(existingClients) {
    existingClients.forEach((clientId) => {
      if (clientId === mySocketIdRef.current) return;
      if (peerConnections[clientId]) return;
      createPeerConnection(clientId);
    });

    for (const peerId in peerConnections) {
      try { peerConnections[peerId].addStream(window.localStream); } catch (_) {}
      peerConnections[peerId]
        .createOffer()
        .then((desc) => peerConnections[peerId].setLocalDescription(desc))
        .then(() => {
          socketRef.current.emit('signal', peerId, JSON.stringify({ sdp: peerConnections[peerId].localDescription }));
        })
        .catch(console.error);
    }
  }

  function handleUserJoined(newUserId) {
    if (peerConnections[newUserId]) return;
    createPeerConnection(newUserId);
  }

  function createPeerConnection(peerId) {
    const pc = new RTCPeerConnection(ICE_SERVERS);
    peerConnections[peerId] = pc;

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socketRef.current.emit('signal', peerId, JSON.stringify({ ice: event.candidate }));
      }
    };

    pc.onaddstream = (event) => {
      setRemoteStreams((prev) => {
        const exists = prev.find((v) => v.socketId === peerId);
        const updated = exists
          ? prev.map((v) => (v.socketId === peerId ? { ...v, stream: event.stream } : v))
          : [...prev, { socketId: peerId, stream: event.stream }];
        remoteVideoRefs.current = updated;
        return updated;
      });
    };

    const streamToSend = window.localStream ?? createBlackSilenceStream();
    window.localStream = streamToSend;
    pc.addStream(streamToSend);
    return pc;
  }

  function handleSignal(fromId, rawMessage) {
    const signal = JSON.parse(rawMessage);
    if (fromId === mySocketIdRef.current) return;

    if (signal.sdp) {
      peerConnections[fromId]
        .setRemoteDescription(new RTCSessionDescription(signal.sdp))
        .then(() => {
          if (signal.sdp.type === 'offer') {
            return peerConnections[fromId].createAnswer()
              .then((desc) => peerConnections[fromId].setLocalDescription(desc))
              .then(() => {
                socketRef.current.emit('signal', fromId, JSON.stringify({ sdp: peerConnections[fromId].localDescription }));
              });
          }
        })
        .catch(console.error);
    }

    if (signal.ice) {
      peerConnections[fromId].addIceCandidate(new RTCIceCandidate(signal.ice)).catch(console.error);
    }
  }

  // ─── Chat ───────────────────────────────────────────────────────────────────

  function handleIncomingMessage(data, sender, senderSocketId) {
    setMessages((prev) => [...prev, { sender, data }]);
    if (senderSocketId !== mySocketIdRef.current) {
      setUnreadCount((n) => n + 1);
    }
  }

  function sendMessage() {
    if (!draftMessage.trim()) return;
    // Backend expects: ('chat-message', roomId, data, sender)
    socketRef.current.emit('chat-message', window.location.href, draftMessage, username);
    setDraftMessage('');
  }

  function handleChatKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  }

  // ─── Join ───────────────────────────────────────────────────────────────────

  function joinMeeting() {
    if (!username.trim()) return;
    setInLobby(false);
    setCameraOn(hasCameraPermission);
    setMicOn(hasMicPermission);
    connectToServer();
  }

  function endCall() {
    stopLocalTracks();
    window.location.href = '/';
  }

  // ─── Render: Lobby ──────────────────────────────────────────────────────────

  if (inLobby) {
    return (
      <div className="min-h-screen bg-[#fdf6ee] flex items-center justify-center px-6">
        <div className="w-full max-w-5xl flex flex-col md:flex-row gap-12 items-center">

          {/* Left: form */}
          <div className="flex-1 space-y-7">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center shadow-md shadow-orange-200">
                <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                  <path d="M17 10.5V7a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h12a1 1 0 001-1v-3.5l4 4v-11l-4 4z"/>
                </svg>
              </div>
              <span className="text-xl font-black text-gray-900 tracking-tight">Voya</span>
            </div>

            {/* Headline */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-px bg-orange-400"></div>
                <p className="text-xs font-bold tracking-widest text-orange-500 uppercase">The Future of Connection</p>
              </div>
              <h1 className="text-5xl font-black text-gray-900 leading-[1.1]">
                Feel{' '}
                <span className="text-orange-500 italic">together,</span>
                <br />
                <span className="font-extralight italic text-gray-600">wherever</span>
                <br />
                you are.
              </h1>
              <p className="mt-4 text-gray-500 text-sm leading-relaxed max-w-sm">
                Voya brings people closer with breathtaking video quality, zero-lag audio, and an experience so seamless it melts the miles between you.
              </p>
            </div>

            {/* Input + button */}
            <div className="space-y-3 max-w-sm">
              <input
                type="text"
                placeholder="Your display name…"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && joinMeeting()}
                className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all text-sm shadow-sm"
              />
              <button
                onClick={joinMeeting}
                disabled={!username.trim()}
                className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 active:scale-95 disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none text-white font-bold rounded-2xl transition-all duration-200 text-sm shadow-lg shadow-orange-200 flex items-center justify-center gap-2"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M17 10.5V7a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h12a1 1 0 001-1v-3.5l4 4v-11l-4 4z"/>
                </svg>
                Get Started Free
              </button>
            </div>

            {/* Stats */}
            <div className="flex gap-10 pt-2">
              {[['4K', 'Crystal Video'], ['180+', 'Countries'], ['2M+', 'Daily Calls']].map(([val, label]) => (
                <div key={label}>
                  <p className="text-2xl font-black text-orange-500">{val}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: video preview card */}
          <div className="flex-1 flex justify-center items-center">
            <div className="relative">

              {/* Main phone card */}
              <div className="w-64 rounded-[2rem] overflow-hidden bg-gray-900 shadow-2xl border-4 border-white" style={{ aspectRatio: '9/16', maxHeight: '420px' }}>
                <video ref={localVideoRef} autoPlay muted className="w-full h-full object-cover" />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 p-4 pointer-events-none">
                  <p className="text-white text-sm font-bold">{username || 'You'}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                    <span className="text-green-400 text-xs font-medium">Connected · HD</span>
                  </div>
                  {/* Mini controls inside card */}
                  <div className="flex items-center gap-2 mt-3">
                    <button className="w-8 h-8 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center text-white border border-white/30">
                      <IconMic />
                    </button>
                    <button className="w-8 h-8 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center text-white border border-white/30">
                      <IconCamera />
                    </button>
                    <button className="w-8 h-8 bg-red-500 rounded-xl flex items-center justify-center text-white shadow-md">
                      <IconPhone />
                    </button>
                  </div>
                </div>
              </div>

              {/* Floating badge: Encrypted */}
              <div className="absolute -top-4 -right-6 bg-white rounded-2xl shadow-xl px-3 py-2.5 flex items-center gap-2.5 border border-gray-100">
                <div className="w-8 h-8 bg-orange-50 rounded-xl flex items-center justify-center text-lg">🔒</div>
                <div>
                  <p className="text-xs font-bold text-gray-800 leading-tight">End-to-End Encrypted</p>
                  <p className="text-xs text-gray-400">All calls secured</p>
                </div>
              </div>

              {/* Floating badge: Latency */}
              <div className="absolute -bottom-4 -left-6 bg-white rounded-2xl shadow-xl px-3 py-2.5 flex items-center gap-2.5 border border-gray-100">
                <div className="w-8 h-8 bg-orange-50 rounded-xl flex items-center justify-center text-lg">⚡</div>
                <div>
                  <p className="text-xs font-bold text-gray-800 leading-tight">Ultra-Low Latency</p>
                  <p className="text-xs text-gray-400">&lt;60ms globally</p>
                </div>
              </div>

              {/* Floating badge: Group calls */}
              <div className="absolute top-16 -right-10 bg-white rounded-2xl shadow-xl px-3 py-2.5 flex items-center gap-2.5 border border-gray-100">
                <div className="w-8 h-8 bg-indigo-50 rounded-xl flex items-center justify-center text-lg">👥</div>
                <div>
                  <p className="text-xs font-bold text-gray-800 leading-tight">Group Calls</p>
                  <p className="text-xs text-gray-400">Up to 50 people</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Render: Meeting Room ───────────────────────────────────────────────────

  const totalParticipants = remoteStreams.length + 1;
  const gridClass =
    totalParticipants === 1 ? 'grid-cols-1' :
    totalParticipants === 2 ? 'grid-cols-2' :
    totalParticipants <= 4 ? 'grid-cols-2' :
    'grid-cols-3';

  return (
    <div className="h-screen bg-gray-950 flex flex-col overflow-hidden font-sans">

      {/* ── Top bar ── */}
      <div className="flex items-center justify-between px-5 py-3 bg-gray-900/90 backdrop-blur border-b border-gray-800/60">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-orange-500 rounded-lg flex items-center justify-center shadow-sm">
            <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
              <path d="M17 10.5V7a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h12a1 1 0 001-1v-3.5l4 4v-11l-4 4z"/>
            </svg>
          </div>
          <span className="text-white font-black text-sm tracking-tight">Voya</span>
        </div>

        <div className="flex items-center gap-2 bg-gray-800/60 px-3 py-1.5 rounded-xl">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
          <span className="text-gray-300 text-xs font-medium">
            {totalParticipants} participant{totalParticipants !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="text-gray-500 text-xs font-mono bg-gray-800/40 px-2.5 py-1 rounded-lg">
          {username}
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Video grid */}
        <div className="flex-1 p-3 overflow-auto">
          <div className={`h-full grid gap-3 ${gridClass}`}>

            {/* Local tile */}
            <div className="relative rounded-2xl overflow-hidden bg-gray-800 border border-gray-700/50 group min-h-0">
              <video ref={localVideoRef} autoPlay muted className="w-full h-full object-cover" />

              {/* Camera-off avatar */}
              {!cameraOn && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                  <div className="w-20 h-20 rounded-full bg-orange-500/20 border-2 border-orange-500/40 flex items-center justify-center">
                    <span className="text-3xl font-black text-orange-400">
                      {username.charAt(0).toUpperCase() || '?'}
                    </span>
                  </div>
                </div>
              )}

              {/* Name + mic badge */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                <span className="bg-black/50 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-xl font-semibold">
                  {username} (You)
                </span>
                {!micOn && (
                  <span className="bg-red-500/90 backdrop-blur-sm text-white p-1.5 rounded-xl">
                    <IconMicOff />
                  </span>
                )}
              </div>
            </div>

            {/* Remote tiles */}
            {remoteStreams.map((remote, i) => (
              <div key={remote.socketId} className="relative rounded-2xl overflow-hidden bg-gray-800 border border-gray-700/50 min-h-0">
                <video
                  data-socket={remote.socketId}
                  ref={(el) => { if (el && remote.stream) el.srcObject = remote.stream; }}
                  autoPlay
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-3 left-3">
                  <span className="bg-black/50 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-xl font-semibold">
                    Participant {i + 1}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Chat panel ── */}
        {chatOpen && (
          <div className="w-72 bg-gray-900 border-l border-gray-800/60 flex flex-col">
            <div className="px-4 py-3.5 border-b border-gray-800/60 flex items-center justify-between">
              <h2 className="text-white font-bold text-sm">Chat</h2>
              <button
                onClick={() => setChatOpen(false)}
                className="w-6 h-6 text-gray-500 hover:text-white hover:bg-gray-700 rounded-lg transition flex items-center justify-center text-lg leading-none"
              >
                ×
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
              {messages.length === 0 ? (
                <div className="text-center py-10">
                  <div className="w-10 h-10 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-2 text-gray-600">
                    <IconChat />
                  </div>
                  <p className="text-gray-600 text-xs">No messages yet</p>
                  <p className="text-gray-700 text-xs mt-1">Say hello 👋</p>
                </div>
              ) : (
                messages.map((msg, i) => {
                  const isMe = msg.sender === username;
                  return (
                    <div key={i} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                      <span className="text-gray-500 text-xs mb-1 px-1">{msg.sender}</span>
                      <div className={`max-w-[85%] px-3 py-2 text-sm leading-relaxed ${
                        isMe
                          ? 'bg-orange-500 text-white rounded-2xl rounded-tr-sm'
                          : 'bg-gray-800 text-gray-100 rounded-2xl rounded-tl-sm'
                      }`}>
                        {msg.data}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="px-3 py-3 border-t border-gray-800/60 flex gap-2">
              <input
                type="text"
                placeholder="Type a message…"
                value={draftMessage}
                onChange={(e) => setDraftMessage(e.target.value)}
                onKeyDown={handleChatKeyDown}
                className="flex-1 bg-gray-800 text-white text-sm placeholder-gray-600 px-3 py-2.5 rounded-xl border border-gray-700/50 focus:outline-none focus:ring-1 focus:ring-orange-500 transition"
              />
              <button
                onClick={sendMessage}
                className="w-10 h-10 bg-orange-500 hover:bg-orange-600 active:scale-95 rounded-xl flex items-center justify-center text-white transition shadow-md shadow-orange-900/30"
              >
                <IconSend />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Control bar ── */}
      <div className="flex items-center justify-center gap-3 py-4 px-6 bg-gray-900/95 backdrop-blur border-t border-gray-800/60">
        <ControlBtn onClick={() => setCameraOn((v) => !v)} active={cameraOn}>
          {cameraOn ? <IconCamera /> : <IconCameraOff />}
        </ControlBtn>

        <ControlBtn onClick={() => setMicOn((v) => !v)} active={micOn}>
          {micOn ? <IconMic /> : <IconMicOff />}
        </ControlBtn>

        {hasScreenShareSupport && (
          <ControlBtn onClick={() => setScreenShareOn((v) => !v)} active={screenShareOn}>
            {screenShareOn ? <IconScreenShare /> : <IconScreenShareOff />}
          </ControlBtn>
        )}

        <ControlBtn
          onClick={() => { setChatOpen((v) => !v); setUnreadCount(0); }}
          active={chatOpen}
          badge={chatOpen ? 0 : unreadCount}
        >
          <IconChat />
        </ControlBtn>

        <div className="w-px h-8 bg-gray-700 mx-1" />

        <ControlBtn onClick={endCall} danger>
          <IconPhone />
        </ControlBtn>
      </div>
    </div>
  );
}
