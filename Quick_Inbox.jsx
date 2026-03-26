import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, MessageCircle, ArrowLeft, Send, Inbox, Loader2, Phone
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

// ─── Message Bubble ───────────────────────────────────────────────────────────
const Bubble = ({ msg, isMe }) => (
  <div className={`flex ${isMe ? "justify-end" : "justify-start"} mb-2`}>
    <div
      className="max-w-[78%] px-3.5 py-2.5 shadow-sm"
      style={{
        background: isMe ? C.teal : "#F1F5F9",
        color: isMe ? "white" : "#1E293B",
        borderRadius: isMe
          ? "18px 18px 4px 18px"   // right bubble — flat bottom-right
          : "18px 18px 18px 4px",  // left bubble  — flat bottom-left
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

// ─── Message List Item ────────────────────────────────────────────────────────
const MessageItem = ({ msg, onSelect }) => (
  <motion.button
    onClick={() => onSelect(msg)}
    whileTap={{ scale: 0.98 }}
    className="w-full flex items-start gap-3 p-4 rounded-2xl mb-2.5 text-left transition-all"
    style={{
      background: msg.is_read ? "var(--c-card)" : `${C.teal}0D`,
      border: `1px solid ${msg.is_read ? "#F1F5F9" : C.teal + "22"}`,
    }}
  >
    {/* Avatar */}
    <div
      className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 font-black text-white text-sm"
      style={{ background: C.teal }}
    >
      {msg.sender_name?.[0]?.toUpperCase() || "T"}
    </div>

    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between mb-0.5">
        <span className="font-black text-sm" style={{ color: C.blue, fontFamily: F.head }}>
          {msg.sender_name}
        </span>
        <span className="text-[10px] text-slate-400">{timeAgo(msg.created_at)}</span>
      </div>
      <p className="text-[11px] font-semibold text-slate-500 mb-0.5">{msg.shift_title}</p>
      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{msg.content}</p>
    </div>

    {!msg.is_read && (
      <span
        className="w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1"
        style={{ background: C.teal }}
      />
    )}
  </motion.button>
);

// ─── Chat View ────────────────────────────────────────────────────────────────
const ChatView = ({ msg, replies, apiBase, managerId, onBack }) => {
  const [thread, setThread] = useState([]);
  const [threadLoading, setThreadLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  // Fetch the full thread on mount
  useEffect(() => {
    if (!msg || !managerId) return;
    setThreadLoading(true);
    fetch(`${apiBase}/api/messages/thread/${msg.shift_id}/${managerId}/${msg.sender_id}`)
      .then((r) => r.json())
      .then((data) => setThread(Array.isArray(data) ? data : []))
      .catch(() => setThread([{ ...msg, sender_id: msg.sender_id }]))
      .finally(() => setThreadLoading(false));
  }, [msg.id]);

  // ── Dedicated per-thread WebSocket (Live Chat) ────────────────────────────
  useEffect(() => {
    if (!managerId || !msg?.shift_id) return;

    const wsProtocol = apiBase.startsWith('https') ? 'wss:' : 'ws:';
    const host = apiBase.replace(/^https?:\/\//, '');
    const wsUrl = `${wsProtocol}//${host}/ws/notifications/${managerId}`;

    let socket;
    let destroyed = false;
    let reconnectTimer;

    const connect = () => {
      if (destroyed) return;
      socket = new WebSocket(wsUrl);

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          // Only handle new_message events for THIS thread
          if (data.type === 'new_message' && data.message) {
            const newMsg = data.message;
            if (String(newMsg.shift_id) === String(msg.shift_id)) {
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
        // Auto-reconnect every 3s unless unmounted
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
  }, [managerId, msg?.shift_id, apiBase]);

  // Also catch events fired by App.jsx's push-notification listener
  useEffect(() => {
    const handleLiveMessage = (e) => {
      const payload = e.detail?.payload;
      if (payload?.type === 'new_message') {
        const newMsg = payload.message;
        if (newMsg && String(newMsg.shift_id) === String(msg.shift_id)) {
          setThread((prev) => {
            if (prev.some((m) => String(m.id) === String(newMsg.id))) return prev;
            return [...prev, newMsg];
          });
        }
      }
    };
    window.addEventListener('medshift-notification-received', handleLiveMessage);
    return () => window.removeEventListener('medshift-notification-received', handleLiveMessage);
  }, [msg.shift_id]);

  // Auto-scroll to bottom whenever thread updates
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [thread]);

  const handleSend = async (reply) => {
    if (sending) return;
    setSending(true);

    // Optimistic append with functional updater
    const optimistic = {
      id: `optimistic-${Date.now()}`,
      shift_id: msg.shift_id,
      sender_id: managerId,
      receiver_id: msg.sender_id,
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
          sender_id: managerId,
          receiver_id: msg.sender_id,
          shift_id: msg.shift_id,
          content: reply.content,
        }),
      });
    } catch {
      // Keep optimistic bubble on network error
    } finally {
      setSending(false);
    }
  };



  return (

    <div className="flex flex-col h-full">

      {/* ── Scrollable chat area ─────────────────────────────────── */}
      <div
        className="flex-1 overflow-y-auto px-4 pt-3"
        style={{ scrollbarWidth: "none" }}
      >
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
            <Bubble key={m.id} msg={m} isMe={m.sender_id === managerId} />
          ))
        )}
        {/* Sentinel — chat scrolls here on new message */}
        <div ref={bottomRef} className="h-2" />
      </div>

      {/* ── Suggested reply chips (pinned bottom) ───────────────── */}
      <div
        className="flex-shrink-0 px-4 py-3"
        style={{ borderTop: "1px solid #F1F5F9" }}
      >
        <p
          className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2"
          style={{ fontFamily: F.mono }}
        >
          Quick Replies
        </p>
        <div
          className="flex gap-2 overflow-x-auto pb-1"
          style={{ scrollbarWidth: "none" }}
        >
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

// ─── In-module cache (survives re-renders, resets on page refresh) ────────────
let _managerInboxCache = null; // { managerId, messages, replies }

// ─── Main Modal ───────────────────────────────────────────────────────────────
const QuickInboxModal = ({ open, onClose, managerId, apiBase }) => {
  const [messages, setMessages] = useState(() =>
    (_managerInboxCache !== null && managerId && _managerInboxCache.managerId === managerId) ? _managerInboxCache.messages : []
  );
  const [replies, setReplies] = useState(() =>
    (_managerInboxCache !== null && managerId && _managerInboxCache.managerId === managerId) ? _managerInboxCache.replies : []
  );
  const [loading, setLoading] = useState(
    // Show spinner only if cache is empty
    !(_managerInboxCache !== null && managerId && _managerInboxCache.managerId === managerId && _managerInboxCache.messages.length > 0)
  );
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [isCalling, setIsCalling] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // ── Fetch inbox (uses cache — shows instantly, refreshes in background) ────
  const fetchInbox = (showSpinner = false) => {
    if (!managerId) return;
    if (showSpinner) setLoading(true);

    Promise.all([
      fetch(`${apiBase}/api/messages/manager/${managerId}`).then((r) => r.json()),
      replies.length === 0
        ? fetch(`${apiBase}/api/messages/suggested-replies/manager`).then((r) => r.json())
        : Promise.resolve(replies),
    ])
      .then(([msgs, sugg]) => {
        const m = Array.isArray(msgs) ? msgs : [];
        const s = Array.isArray(sugg) ? sugg : [];
        setMessages(m);
        setReplies(s);
        // Update module-level cache
        _managerInboxCache = { managerId, messages: m, replies: s };
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  // Fetch on open (show spinner only on first open with empty cache)
  useEffect(() => {
    if (!open || !managerId) return;
    setSelectedMsg(null);
    fetchInbox(messages.length === 0);
  }, [open, managerId]);

  // ── Real-time: targeted state update (no re-fetch needed) ─────────────────
  useEffect(() => {
    const handleRealtime = (e) => {
      const payload = e.detail?.payload;
      if (!payload) return;

      if (payload.type === 'new_message' && payload.message) {
        const incoming = payload.message;

        setMessages((prev) => {
          // Check if this shift_id already has a thread in the list
          const existingIdx = prev.findIndex(
            (m) => String(m.shift_id) === String(incoming.shift_id)
          );

          if (existingIdx !== -1) {
            // Update the existing thread: new preview + unread + move to top
            const updated = {
              ...prev[existingIdx],
              content: incoming.content,
              is_read: false,
              created_at: incoming.created_at,
            };
            const rest = prev.filter((_, i) => i !== existingIdx);
            return [updated, ...rest];
          } else {
            // Brand-new thread — add to top with whatever data the WS gave us
            const newThread = {
              id: incoming.id,
              shift_id: incoming.shift_id,
              shift_title: incoming.shift_title || 'New Shift',
              sender_id: incoming.sender_id,
              sender_name: incoming.sender_name || 'Technician',
              receiver_id: incoming.receiver_id,
              content: incoming.content,
              is_read: false,
              created_at: incoming.created_at,
            };
            return [newThread, ...prev];
          }
        });
      }

      // For notifications (not new_message), do a silent background refresh
      if (payload.type === 'notification' && open && managerId) {
        fetchInbox(false);
      }
    };

    window.addEventListener('medshift-notification-received', handleRealtime);
    return () => window.removeEventListener('medshift-notification-received', handleRealtime);
  }, [open, managerId]);

  const unreadCount = messages.filter((m) => !m.is_read).length;

  const markAsRead = (msgId) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === msgId ? { ...m, is_read: true } : m))
    );
  };

  const openMessage = (msg) => {
    markAsRead(msg.id);
    if (!msg.is_read) {
      fetch(`${apiBase}/api/messages/${msg.id}/read`, { method: 'PUT' }).catch(() => {});
    }
    setSelectedMsg(msg);
  };

  // Optimistic send — updates inbox preview immediately when manager sends
  const handleOptimisticSend = (content) => {
    if (!selectedMsg) return;
    setMessages((prev) => {
      const existingIdx = prev.findIndex((m) => m.id === selectedMsg.id);
      if (existingIdx === -1) return prev;
      const updated = { ...prev[existingIdx], content, created_at: new Date().toISOString() };
      const rest = prev.filter((_, i) => i !== existingIdx);
      return [updated, ...rest];
    });
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="q-inbox-scrim"
          className="absolute inset-0 z-[80] bg-black/35"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />
      )}

      {open && (
        <motion.div
          key="q-inbox-sheet"
          className="absolute bottom-0 left-0 right-0 z-[90] flex flex-col rounded-t-3xl overflow-hidden shadow-2xl"
            style={{ background: 'var(--c-pearl)', height: '82vh' }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 340, damping: 38 }}
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
              title={selectedMsg ? selectedMsg.sender_name : 'Quick Inbox'}
              subtitle={
                selectedMsg
                  ? selectedMsg.shift_title
                  : unreadCount > 0
                  ? `${unreadCount} unread`
                  : null
              }
            />

            {/* Body */}
            <div className="flex-1 overflow-hidden">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-8 h-8 rounded-full border-2 border-t-transparent"
                    style={{ borderColor: `${C.teal}40`, borderTopColor: C.teal }}
                  />
                </div>
              ) : selectedMsg ? (
                <ChatView
                  msg={selectedMsg}
                  replies={replies}
                  apiBase={apiBase}
                  managerId={managerId}
                  onBack={() => setSelectedMsg(null)}
                  onSend={handleOptimisticSend}
                />
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-3 px-8 text-center">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center"
                    style={{ background: `${C.teal}10` }}
                  >
                    <MessageCircle size={28} color={C.teal} />
                  </div>
                  <p className="font-black text-base" style={{ color: C.blue, fontFamily: F.head }}>
                    No messages yet
                  </p>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    When technicians apply to your shifts, their intro messages will appear here.
                  </p>
                </div>
              ) : (
                <div
                  className="overflow-y-auto px-4 pt-3 pb-6 h-full"
                  style={{ scrollbarWidth: 'none' }}
                >
                  {messages.map((m) => (
                    <MessageItem key={m.id} msg={m} onSelect={openMessage} />
                  ))}
                </div>
              )}
            </div>

            {/* ── Calling Screen Overlay ── */}
            <AnimatePresence>
              {isCalling && (
                <CallingScreen
                  callee={selectedMsg?.sender_name || 'Unknown'}
                  onEnd={() => setIsCalling(false)}
                />
              )}
            </AnimatePresence>

            {/* ── Profile Overlay ── */}
            <ProfileOverlay
              show={showProfile}
              role="manager"
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

export default QuickInboxModal;

