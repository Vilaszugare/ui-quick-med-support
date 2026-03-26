import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, MessageCircle, ArrowLeft, Send, Inbox, Phone
} from "lucide-react";
import { C, F } from "./MedShift_Phase12_15.jsx";
import CallingScreen from "./components/CallingScreen.jsx";
import ChatHeader from "./components/ChatHeader.jsx";
import ProfileOverlay from "./components/ProfileOverlay.jsx";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function timeAgo(iso) {
  if (!iso) return "";
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function formatTime(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// ─── Chat Bubble ──────────────────────────────────────────────────────────────
const Bubble = ({ msg, isMe }) => (
  <div className={`flex ${isMe ? "justify-end" : "justify-start"} mb-2`}>
    <div
      className="max-w-[78%] px-3.5 py-2.5 shadow-sm"
      style={{
        background: isMe ? C.teal : "#F1F5F9",
        color: isMe ? "white" : "#1E293B",
        borderRadius: isMe ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
        fontFamily: F.head,
      }}
    >
      <p className="text-sm leading-relaxed">{msg.content}</p>
      <p
        className="text-[10px] mt-0.5"
        style={{ color: isMe ? "rgba(255,255,255,0.65)" : "#94A3B8", textAlign: "right" }}
      >
        {formatTime(msg.created_at)}
      </p>
    </div>
  </div>
);

// ─── Thread Item (inbox list) ─────────────────────────────────────────────────
const ThreadItem = ({ msg, onSelect }) => (
  <motion.button
    onClick={() => onSelect(msg)}
    whileTap={{ scale: 0.98 }}
    className="w-full flex items-start gap-3 p-4 rounded-2xl mb-2.5 text-left transition-all"
    style={{
      background: msg.is_read ? "var(--c-card)" : `${C.teal}0D`,
      border: `1px solid ${msg.is_read ? "#F1F5F9" : C.teal + "22"}`,
    }}
  >
    {/* Manager avatar */}
    <div
      className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 font-black text-white text-sm"
      style={{ background: C.blue }}
    >
      {msg.manager_name?.[0]?.toUpperCase() || "M"}
    </div>

    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between mb-0.5">
        <span className="font-black text-sm" style={{ color: C.blue, fontFamily: F.head }}>
          {msg.manager_name}
        </span>
        <span className="text-[10px] text-slate-400">{timeAgo(msg.created_at)}</span>
      </div>
      <p className="text-[11px] font-semibold text-slate-500 mb-0.5">{msg.shift_title}</p>
      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{msg.content}</p>
    </div>

    {!msg.is_read && (
      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1" style={{ background: C.teal }} />
    )}
  </motion.button>
);

// ─── Chat View ────────────────────────────────────────────────────────────────
const ChatView = ({ msg, replies, apiBase, techId, onBack }) => {
  const [thread, setThread] = useState([]);
  const [threadLoading, setThreadLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!msg || !techId) return;
    setThreadLoading(true);
    fetch(`${apiBase}/api/messages/thread/${msg.shift_id}/${msg.manager_id}/${techId}`)
      .then((r) => r.json())
      .then((data) => setThread(Array.isArray(data) ? data : []))
      .catch(() => setThread([]))
      .finally(() => setThreadLoading(false));
  }, [msg.id]);

  // ── Dedicated per-thread WebSocket (Live Chat) ────────────────────────────
  useEffect(() => {
    if (!techId || !msg?.shift_id) return;

    const wsProtocol = apiBase.startsWith('https') ? 'wss:' : 'ws:';
    const host = apiBase.replace(/^https?:\/\//, '');
    const wsUrl = `${wsProtocol}//${host}/ws/notifications/${techId}`;

    let socket;
    let destroyed = false;
    let reconnectTimer;

    const connect = () => {
      if (destroyed) return;
      socket = new WebSocket(wsUrl);

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          // For technician: incoming messages have receiver_id === techId
          if (data.type === 'new_message' && data.message) {
            const newMsg = data.message;
            if (
              String(newMsg.shift_id) === String(msg.shift_id) &&
              String(newMsg.receiver_id) === String(techId)
            ) {
              // Functional state update — never overwrites existing messages
              setThread((prev) => {
                if (prev.some((m) => String(m.id) === String(newMsg.id))) return prev;
                return [...prev, newMsg];
              });
            }
          }
        } catch (e) {
          // swallow bad frames
        }
      };

      socket.onclose = () => {
        if (!destroyed) reconnectTimer = setTimeout(connect, 3000);
      };

      socket.onerror = () => socket.close();
    };

    connect();
    return () => {
      destroyed = true;
      clearTimeout(reconnectTimer);
      socket?.close();
    };
  }, [techId, msg?.shift_id, apiBase]);

  // Also catch events fired by App.jsx's push-notification listener
  useEffect(() => {
    const handleLiveMessage = (e) => {
      const payload = e.detail?.payload;
      if (payload?.type === 'new_message') {
        const newMsg = payload.message;
        if (
          newMsg &&
          String(newMsg.shift_id) === String(msg.shift_id) &&
          String(newMsg.receiver_id) === String(techId)
        ) {
          setThread((prev) => {
            if (prev.some((m) => String(m.id) === String(newMsg.id))) return prev;
            return [...prev, newMsg];
          });
        }
      }
    };
    window.addEventListener('medshift-notification-received', handleLiveMessage);
    return () => window.removeEventListener('medshift-notification-received', handleLiveMessage);
  }, [msg.shift_id, techId]);

  // Auto-scroll to bottom whenever thread updates
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [thread]);

  const handleSend = async (reply) => {
    if (sending) return;
    setSending(true);

    // Optimistic bubble with functional updater
    const optimistic = {
      id: `opt-${Date.now()}`,
      shift_id: msg.shift_id,
      sender_id: techId,
      receiver_id: msg.manager_id,
      content: reply.content,
      is_read: false,
      created_at: new Date().toISOString(),
    };
    setThread((prev) => [...prev, optimistic]);

    try {
      await fetch(`${apiBase}/api/messages/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender_id: techId,
          receiver_id: msg.manager_id,
          shift_id: msg.shift_id,
          content: reply.content,
        }),
      });
    } catch {
      // Keep optimistic bubble on error
    } finally {
      setSending(false);
    }
  };



  return (

    <div className="flex flex-col h-full">
      {/* Scrollable chat area */}
      <div className="flex-1 overflow-y-auto px-4 pt-3" style={{ scrollbarWidth: "none" }}>
        {/* Shift context chip */}
        <div className="flex justify-center mb-4">
          <span
            className="text-[10px] font-bold px-3 py-1 rounded-full"
            style={{ background: `${C.teal}12`, color: C.teal, fontFamily: F.mono }}
          >
            {msg.shift_title}
          </span>
        </div>

        {threadLoading ? (
          <div className="flex items-center justify-center py-10">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-7 h-7 rounded-full border-2 border-t-transparent"
              style={{ borderColor: `${C.teal}40`, borderTopColor: C.teal }}
            />
          </div>
        ) : (
          thread.map((m) => (
            <Bubble key={m.id} msg={m} isMe={m.sender_id === techId} />
          ))
        )}
        <div ref={bottomRef} className="h-2" />
      </div>

      {/* Pinned quick-reply chips */}
      <div className="flex-shrink-0 px-4 py-3" style={{ borderTop: "1px solid #F1F5F9" }}>
        <p
          className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2"
          style={{ fontFamily: F.mono }}
        >
          Quick Replies
        </p>
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {replies.map((r) => (
            <motion.button
              key={r.id}
              whileTap={{ scale: 0.94 }}
              onClick={() => handleSend(r)}
              disabled={sending}
              className="flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold transition-all"
              style={{
                background: `${C.teal}0F`,
                border: `1px solid ${C.teal}28`,
                color: C.teal,
                fontFamily: F.head,
                opacity: sending ? 0.6 : 1,
              }}
            >
              {r.content}
              <Send size={10} color={C.teal} />
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Main Modal ───────────────────────────────────────────────────────────────
const TechQuickInboxModal = ({ open, onClose, techId, apiBase }) => {
  const [messages, setMessages] = useState([]);
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [isCalling, setIsCalling] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    if (!open || !techId) return;
    setLoading(true);
    setSelectedMsg(null);

    Promise.all([
      fetch(`${apiBase}/api/messages/technician/${techId}`).then((r) => r.json()),
      fetch(`${apiBase}/api/messages/suggested-replies/technician`).then((r) => r.json()),
    ])
      .then(([msgs, sugg]) => {
        setMessages(Array.isArray(msgs) ? msgs : []);
        setReplies(Array.isArray(sugg) ? sugg : []);
      })
      .catch(() => { setMessages([]); setReplies([]); })
      .finally(() => setLoading(false));
  }, [open, techId]);

  // Live Refresh for Inbox List
  useEffect(() => {
    const refreshInbox = (e) => {
      if (open && techId) {
        fetch(`${apiBase}/api/messages/technician/${techId}`)
          .then((r) => r.json())
          .then((msgs) => setMessages(Array.isArray(msgs) ? msgs : []))
          .catch(() => {});
      }
    };

    window.addEventListener('medshift-notification-received', refreshInbox);
    return () => window.removeEventListener('medshift-notification-received', refreshInbox);
  }, [open, techId]);

  const unreadCount = messages.filter((m) => !m.is_read).length;


  const markAsRead = (msgId) =>
    setMessages((prev) => prev.map((m) => (m.id === msgId ? { ...m, is_read: true } : m)));

  const openThread = (msg) => {
    markAsRead(msg.id);
    if (!msg.is_read) {
      fetch(`${apiBase}/api/messages/${msg.id}/read`, { method: "PUT" }).catch(() => {});
    }
    setSelectedMsg(msg);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="t-inbox-scrim"
          className="absolute inset-0 z-[80] bg-black/35"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
        />
      )}

      {open && (
        <motion.div
          key="t-inbox-sheet"
          className="absolute bottom-0 left-0 right-0 z-[90] flex flex-col rounded-t-3xl overflow-hidden shadow-2xl"
            style={{ background: "var(--c-pearl)", height: "82vh" }}
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 340, damping: 38 }}
          >
            {/* Drag handle */}
            <div className="w-10 h-1 rounded-full bg-slate-200 mx-auto mt-3 mb-1 flex-shrink-0" />

            {/* Header */}
            <ChatHeader
              selectedMsg={selectedMsg}
              onBack={() => {
                setSelectedMsg(null);
                setShowProfile(false);
              }}
              onClose={onClose}
              onCall={() => setIsCalling(true)}
              onTitleClick={() => setShowProfile(true)}
              unreadCount={unreadCount}
              C={C}
              F={F}
              title={selectedMsg ? selectedMsg.manager_name : "My Messages"}
              subtitle={selectedMsg ? selectedMsg.shift_title : (unreadCount > 0 ? `${unreadCount} unread` : null)}
            />

            {/* Body */}
            <div className="flex-1 overflow-hidden">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-8 h-8 rounded-full border-2 border-t-transparent"
                    style={{ borderColor: `${C.teal}40`, borderTopColor: C.teal }}
                  />
                </div>
              ) : selectedMsg ? (
                <ChatView
                  msg={selectedMsg}
                  replies={replies}
                  apiBase={apiBase}
                  techId={techId}
                  onBack={() => setSelectedMsg(null)}
                />
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-3 px-8 text-center">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: `${C.teal}10` }}>
                    <MessageCircle size={28} color={C.teal} />
                  </div>
                  <p className="font-black text-base" style={{ color: C.blue, fontFamily: F.head }}>No messages yet</p>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    When you apply to a shift, your intro message and manager replies will appear here.
                  </p>
                </div>
              ) : (
                <div className="overflow-y-auto px-4 pt-3 pb-6 h-full" style={{ scrollbarWidth: "none" }}>
                  {messages.map((m) => (
                    <ThreadItem key={m.id} msg={m} onSelect={openThread} />
                  ))}
                </div>
              )}
            </div>
          {/* ── Calling Screen Overlay ── */}
          <AnimatePresence>
            {isCalling && (
              <CallingScreen
                callee={selectedMsg?.manager_name || "Unknown"}
                onEnd={() => setIsCalling(false)}
              />
            )}
          </AnimatePresence>

          {/* ── Profile Overlay ── */}
          <ProfileOverlay
            show={showProfile}
            role="technician"
            onBack={() => setShowProfile(false)}
            onCall={() => {
              setShowProfile(false);
              setIsCalling(true);
            }}
          />

          </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TechQuickInboxModal;
