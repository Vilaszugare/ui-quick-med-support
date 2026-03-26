import { useState, useEffect } from "react";

import { motion, AnimatePresence, useAnimationControls } from "framer-motion";
import PullToRefresh from 'react-simple-pull-to-refresh';
import { HospitalProfile, TechnicianProfile } from './MedShift_Phase10_11.jsx';
import CallingScreen from './components/CallingScreen.jsx';
import CreateShiftSheet from './CreateShiftSheet.jsx';
import CreatePostSheet from './CreatePostSheet.jsx';
import QuickInboxModal from './Quick_Inbox.jsx';
import TechQuickInboxModal from './Tech_Quick_Inbox.jsx';
import { App as CapacitorApp } from '@capacitor/app';
import {
  Bell, Home, Calendar, Users, User, ArrowLeft, CheckCircle,
  MapPin, Clock, Star, Shield, Zap, Activity, ChevronRight,
  MoreHorizontal, X, AlertTriangle, CreditCard, Wallet,
  TrendingUp, Navigation, Filter, Heart, MessageCircle,
  Share2, Bookmark, BadgeCheck, Briefcase, Award, Signal,
  Wifi, Battery, Radio, Siren, BanknoteIcon, Megaphone,
  Building2, Stethoscope, ScanLine, ThumbsUp, Send,
  BarChart3, Phone, ExternalLink, Sparkles, DollarSign,
  ArrowUpRight, ArrowDownLeft, RefreshCw, Eye, Hash,
  UploadCloud, FileBadge,
  ChevronDown, Search, Timer, Cpu, Plus, Image as ImageIcon,
  Moon, Sun, LogOut, Edit2, Trash2
} from "lucide-react";
import { Capacitor } from '@capacitor/core';
// PRODUCTION SERVER
// const rawUrl = import.meta.env.VITE_API_URL || "https://medshift-backend-3ktw.onrender.com";

// DuckDNS Domain (Production)
// const rawUrl = import.meta.env.VITE_API_URL || "http://quickmedsupport.duckdns.org";

// LOCAL DEV (Active)
const rawUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";


let processedUrl = rawUrl.endsWith("/") ? rawUrl.slice(0, -1) : rawUrl;

// If running natively on Android emulator, rewrite localhost to the loopback IP
if (Capacitor.isNativePlatform() && processedUrl.includes("localhost")) {
  processedUrl = processedUrl.replace("localhost", "10.0.2.2");
}

const API_BASE = processedUrl;

// ─── PALETTE ─────────────────────────────────────────────────────────────────
export const C = {
  blue:   "var(--c-blue)",
  teal:   "var(--c-teal)",
  amber:  "var(--c-amber)",
  pearl:  "var(--c-pearl)",
  card:   "var(--c-card)",
  green:  "var(--c-green)",
  red:    "var(--c-red)",
};

// ─── FONTS ────────────────────────────────────────────────────────────────────
export const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap');`;

export const F = {
  head: "'Sora', sans-serif",
  mono: "'JetBrains Mono', monospace",
};

// ═══════════════════════════════════════════════════════════════════════════════
// DEMO DATA — PHASE 13 (MANAGER)
// ═══════════════════════════════════════════════════════════════════════════════
// Purged MANAGER object as requested

const MANAGER_SHIFTS = [];

const MANAGER_NOTIFICATIONS = [
  {
    id:      "mn1",
    read:    false,
    icon:    "check",
    color:   C.green,
    bgColor: "#ECFDF5",
    title:   "Shift Accepted",
    body:    "Vilas Z. accepted your urgent MRI shift for tomorrow at 9:00 AM.",
    time:    "2 min ago",
    tag:     "Match",
  },
  {
    id:      "mn2",
    read:    false,
    icon:    "warning",
    color:   C.amber,
    bgColor: "#FFFBEB",
    title:   "Shift Reminder",
    body:    "Your X-Ray technician requirement for today is still unfilled. Boost your post?",
    time:    "45 min ago",
    tag:     "Reminder",
    action:  "Boost Post",
  },
  {
    id:      "mn3",
    read:    true,
    icon:    "invoice",
    color:   C.blue,
    bgColor: C.card,
    title:   "Invoice Generated",
    body:    "Invoice #4092 for last week's temporary staffing has been generated.",
    time:    "Yesterday",
    tag:     "Finance",
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// DEMO DATA — PHASE 14 (TECHNICIAN)
// ═══════════════════════════════════════════════════════════════════════════════
// Purged TECHNICIAN object as requested

const WALLET = {
  balance:       "₹12,450",
  balanceNum:    12450,
  lastPayout:    "₹4,800",
  lastPayoutBank:"HDFC Bank",
  lastPayoutDate:"Mar 14, 2026",
  pending:       "₹2,400",
  transactions: [
    { id:"t1", type:"credit", label:"MRI Shift – Nashik Lifeline",  amount:"+₹6,400", date:"Mar 16", color:C.green  },
    { id:"t2", type:"credit", label:"Payment – MRI Shift",           amount:"+₹2,400", date:"Mar 13", color:C.green  },
    { id:"t3", type:"debit",  label:"Payout to HDFC Bank ••4521",   amount:"−₹4,800", date:"Mar 12", color:C.red    },
    { id:"t4", type:"credit", label:"X-Ray Shift – City Care",       amount:"+₹3,600", date:"Mar 10", color:C.green  },
  ],
};

const TECH_SHIFTS = [];

const TECH_NOTIFICATIONS = [
  {
    id:      "tn1",
    read:    false,
    icon:    "urgent",
    color:   C.red,
    bgColor: "#FEF2F2",
    title:   "🚨 URGENT MATCH",
    body:    "Nashik Lifeline Hospital needs an X-Ray tech 3.2 km away. High demand!",
    time:    "Just now",
    tag:     "Urgent",
    action:  "View Shift",
  },
  {
    id:      "tn2",
    read:    false,
    icon:    "star",
    color:   "#F59E0B",
    bgColor: "#FFFBEB",
    title:   "5-Star Rating Received ⭐",
    body:    "You received a 5-star rating from City Care Medical Center for your shift on Monday.",
    time:    "3 hrs ago",
    tag:     "Rating",
  },
  {
    id:      "tn3",
    read:    true,
    icon:    "payment",
    color:   C.green,
    bgColor: C.card,
    title:   "Payment Received 💰",
    body:    "Payment of ₹2,400 for your MRI shift has been added to your wallet.",
    time:    "Yesterday",
    tag:     "Payment",
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// DEMO DATA — PHASE 15 (COMMUNITY FEED)
// ═══════════════════════════════════════════════════════════════════════════════
const FEED_POSTS = [];

// ═══════════════════════════════════════════════════════════════════════════════
// SHARED MICRO-COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════
const StatusBar = () => (
  <div className="flex items-center justify-between px-5 py-2"
    style={{ background: C.blue }}>
    <span className="text-white text-xs font-semibold" style={{ fontFamily: F.mono }}>9:41</span>
    <div className="flex items-center gap-2">
      <Signal size={12} color="white"/><Wifi size={12} color="white"/><Battery size={14} color="white"/>
    </div>
  </div>
);

const TopHeader = ({ role, onBellClick, unreadCount, isDark, toggleDark, isGuest, isAvailable, toggleAvailability }) => (
  <div className="flex-none z-50 sticky top-0 flex items-center justify-between px-3 py-2 w-full"
    style={{ backdropFilter:"blur(12px)", background:"var(--c-nav-bg)",
      borderBottom:"1px solid var(--c-border)" }}>
    <div className="flex items-center gap-2">
      <div className="w-6 h-6 rounded-lg flex items-center justify-center"
        style={{ background: C.blue }}>
        <Activity size={12} color="white" strokeWidth={2.5}/>
      </div>
      <span className="font-black text-sm" style={{ color: C.blue, fontFamily: F.head }}>
        Quick<span style={{ color: C.teal }}>Med</span> Support
      </span>
      {role === "technician" && !isGuest && (
        <button onClick={toggleAvailability} className="relative w-9 h-5 ml-2 rounded-full flex items-center px-1 transition-colors shadow-inner" style={{ background: isAvailable ? C.teal : "var(--c-slate-300)" }}>
          <motion.div className="w-3.5 h-3.5 rounded-full bg-white shadow-sm" animate={{ x: isAvailable ? 16 : 0 }} transition={{ type: "spring", stiffness: 500, damping: 30 }} />
        </button>
      )}
    </div>
    <div className="flex items-center gap-2">
      <button onClick={toggleDark} className="relative w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "var(--c-slate-100)" }}>
        {isDark ? <Sun size={14} color={C.blue} strokeWidth={1.8}/> : <Moon size={14} color={C.blue} strokeWidth={1.8}/>}
      </button>
      <button onClick={onBellClick} className="relative w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "var(--c-slate-100)" }}>
        <Bell size={14} color={C.blue} strokeWidth={1.8}/>
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale:0 }} animate={{ scale:1 }}
            className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-black text-white"
            style={{ background: C.red }}>
            {unreadCount}
          </motion.span>
        )}
      </button>
    </div>
  </div>
);

const BottomNav = ({ active, setActive, role, onAddClick, isGuest, onRequireAuth }) => {
  const tabsLeft = [
    { id:"home",      label: "Home",       icon: Home      },
    { id:"shifts",    label: "Shifts",     icon: Calendar  },
  ];
  const tabsRight = [
    { id:"community", label: "Community",  icon: Users     },
    { id:"profile",   label: "Profile",    icon: User      },
  ];

  const renderTab = ({ id, label, icon:Icon }) => {
    const on = active === id;
    return (
      <button key={id} onClick={() => setActive(id)}
        className="flex flex-col items-center gap-0.5 relative py-1 px-2 min-w-[40px] min-h-[40px] justify-center flex-1">
        {on && (
          <motion.div layoutId="navPill"
            className="absolute inset-0 rounded-xl"
            style={{ background:`${C.teal}12` }}
            transition={{ type:"spring", stiffness:400, damping:30 }}/>
        )}
        <Icon size={16} color={on ? C.teal : "#94A3B8"} strokeWidth={on ? 2 : 1.5}/>
        <span className="text-[8px] font-bold relative z-10 mt-0.5"
          style={{ color: on ? C.teal : "#94A3B8", fontFamily: F.head }}>
          {label}
        </span>
      </button>
    );
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 w-full z-50 pointer-events-none pb-0 pt-4">
      <div className="mx-4 mb-4 rounded-2xl shadow-lg bg-white/90 backdrop-blur-md pointer-events-auto flex items-center justify-between px-2 py-1.5"
        style={{ border:"1px solid rgba(226,232,240,0.8)" }}>
        
        {tabsLeft.map(renderTab)}

        <div className="flex-1 flex justify-center -mt-8 pointer-events-auto relative z-20">
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              if (isGuest && role === "technician") {
                onRequireAuth();
              } else {
                onAddClick();
              }
            }}
            className="w-14 h-14 rounded-full flex items-center justify-center text-white shadow-teal-500/50"
            style={{ 
              background: C.teal,
              boxShadow: `0 8px 20px ${C.teal}70`
            }}>
            <Plus size={26} strokeWidth={2.5}/>
          </motion.button>
        </div>

        {tabsRight.map(renderTab)}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// PHASE 12 — NOTIFICATION CENTER
// ═══════════════════════════════════════════════════════════════════════════════
const NotifIcon = ({ type, color }) => {
  const map = {
    check:   CheckCircle,
    warning: AlertTriangle,
    invoice: CreditCard,
    urgent:  Siren,
    star:    Star,
    payment: DollarSign,
  };
  const Icon = map[type] || Bell;
  return (
    <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
      style={{ background:`${color}18` }}>
      <Icon size={18} color={color}/>
    </div>
  );
};

const NotificationCenter = ({ open, onClose, notifications, onMarkAll }) => {
  const [items, setItems] = useState(notifications);
  const unread = items.filter(n => !n.read).length;

  useEffect(() => { setItems(notifications); }, [notifications]);

  const markAll = () => {
    setItems(prev => prev.map(n => ({ ...n, read:true })));
    onMarkAll?.();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Scrim */}
          <motion.div
            className="absolute inset-0 z-50 bg-black/30"
            initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            onClick={onClose}/>

          {/* Panel */}
          <motion.div
            className="absolute top-0 right-0 bottom-0 z-50 flex flex-col"
            style={{ width:"100%", background:C.pearl }}
            initial={{ x:"100%" }} animate={{ x:0 }} exit={{ x:"100%" }}
            transition={{ type:"spring", stiffness:340, damping:38 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4"
              style={{ borderBottom:"1px solid #F1F5F9" }}>
              <div className="flex items-center gap-3">
                <button onClick={onClose}
                  className="w-9 h-9 rounded-2xl flex items-center justify-center"
                  style={{ background:"#F1F5F9" }}>
                  <ArrowLeft size={17} color={C.blue}/>
                </button>
                <div>
                  <h2 className="font-black text-xl" style={{ color:C.blue, fontFamily:F.head }}>
                    Notifications
                  </h2>
                  {unread > 0 && (
                    <p className="text-xs text-slate-400">{unread} unread</p>
                  )}
                </div>
              </div>
              <button onClick={markAll}
                className="text-sm font-bold"
                style={{ color:C.teal, fontFamily:F.head }}>
                Mark all read
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto px-4 py-3" style={{ scrollbarWidth:"none" }}>
              {items.map((n, i) => (
                <motion.div key={n.id}
                  initial={{ opacity:0, y:14 }}
                  animate={{ opacity:1, y:0 }}
                  transition={{ delay: i * 0.07 }}
                  className="flex gap-3 p-3.5 rounded-2xl mb-2.5 relative"
                  style={{
                    background: n.read ? C.card : n.bgColor,
                    border: n.read ? "1px solid #F1F5F9" : `1px solid ${n.color}22`,
                    boxShadow: n.read ? "none" : `0 2px 12px ${n.color}10`,
                  }}>
                  {!n.read && (
                    <span className="absolute top-3.5 right-3.5 w-2 h-2 rounded-full"
                      style={{ background: n.color }}/>
                  )}
                  <NotifIcon type={n.icon} color={n.color}/>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-bold text-sm" style={{ color:C.blue, fontFamily:F.head }}>
                        {n.title}
                      </span>
                      <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full"
                        style={{ background:`${n.color}18`, color:n.color }}>
                        {n.tag}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">{n.body}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[10px] text-slate-400">{n.time}</span>
                      {n.action && (
                        <button className="text-xs font-bold px-2.5 py-1 rounded-xl"
                          style={{ background:`${n.color}12`, color:n.color }}>
                          {n.action}
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Empty spacer */}
              <div className="h-8"/>
              <div className="text-center py-4">
                <p className="text-xs text-slate-300 font-medium">You're all caught up ✓</p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};


const ApplicantsModal = ({ open, onClose, shift, onApplicantAction, onFinalize }) => {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(false);

  const acceptedCount = applicants.filter(a => a.status === "accepted").length;

  useEffect(() => {
    if (open && shift) {
      setLoading(true);
      fetch(`${API_BASE}/api/shifts/${shift.id}/applicants`)
        .then(res => res.json())
        .then(data => {
          setApplicants(data);
          setLoading(false);
        }).catch(() => setLoading(false));
    }
  }, [open, shift]);

  const handleAction = async (techId, action) => {
    try {
      const res = await fetch(`${API_BASE}/api/shifts/${shift.id}/applicants/${techId}/${action}`, {
        method: "PUT"
      });
      if (res.ok) {
        setApplicants(prev => prev.map(a => a.technician_id === techId ? { ...a, status: action === 'accept' ? 'accepted' : 'rejected' } : a));
        if (onApplicantAction) onApplicantAction();
      } else {
        const body = await res.json();
        alert(body.detail || "Failed to update status");
      }
    } catch (e) { console.error(e); }
  };

  if (!open || !shift) return null;

  return (
    <div className="fixed inset-0 z-[999] flex flex-col bg-slate-50 animate-in fade-in zoom-in-95 duration-200" style={{ fontFamily: F.body }}>
      <div className="flex items-center justify-between p-4 bg-white shadow-sm border-b border-slate-100 mt-10">
        <h2 className="font-black text-lg text-slate-800" style={{ fontFamily:F.head }}>Applicants - {shift.title}</h2>
        <button onClick={onClose} className="p-2 rounded-full bg-slate-100"><X size={20} /></button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-20">
        {loading ? <p className="text-center text-slate-400 mt-10">Loading applicants...</p> : 
         applicants.length === 0 ? <p className="text-center text-slate-400 mt-10">No applicants yet.</p> :
         applicants.map(a => (
           <div key={a.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
             <div className="flex justify-between items-start mb-2">
               <div>
                 <h3 className="font-black text-slate-800 text-base">{a.name}</h3>
                 <span className="text-xs text-slate-500 font-medium">Rating: {a.rating}★</span>
               </div>
               <span className={`text-[10px] uppercase font-black px-2 py-1 rounded-full ${a.status === 'accepted' ? 'bg-green-100 text-green-700' : a.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                 {a.status}
               </span>
             </div>
             {a.status === 'pending' && (
               <div className="flex gap-2 mt-3 pt-3 border-t border-slate-50">
                 <button type="button" onClick={() => handleAction(a.technician_id, 'accept')} className="flex-1 flex justify-center items-center bg-teal-600 text-white font-bold py-2.5 rounded-xl text-sm transition-opacity active:opacity-75">Accept</button>
                 <button type="button" onClick={() => handleAction(a.technician_id, 'reject')} className="flex-1 flex justify-center items-center bg-red-100 text-red-600 font-bold py-2.5 rounded-xl text-sm transition-opacity active:opacity-75">Reject</button>
               </div>
             )}
             {a.status === 'accepted' && (
               <div className="flex gap-2 mt-3 pt-3 border-t border-slate-50">
                 <button type="button" onClick={() => handleAction(a.technician_id, 'reject')} className="flex-1 flex justify-center items-center bg-red-50 text-red-600 font-bold py-2.5 rounded-xl text-sm transition-opacity active:opacity-75">Remove</button>
               </div>
             )}
           </div>
         ))
        }
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-100 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
        <button 
          disabled={acceptedCount === 0}
          onClick={() => onFinalize(shift.id)}
          className="w-full py-3.5 rounded-2xl font-black text-white transition-opacity disabled:opacity-50"
          style={{ background: C.teal }}>
          Finalize & Assign ({acceptedCount} Tech{acceptedCount !== 1 ? 's' : ''})
        </button>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// PHASE 13 — MANAGER DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════════
const ManagerDashboard = ({ shifts, onCreateShift, onViewProfileClick, onCompleteShift, onCancelShift, onArchiveShift, currentUser, onViewApplicants, onInboxClick, unreadMessageCount = 0, totalMessageCount = 0 }) => {
  const [boosted, setBoosted] = useState(false);

  return (
    <div className="flex-1 overflow-y-auto pb-28 bg-transparent" style={{ scrollbarWidth:"none" }}>
      {/* Greeting Hero */}
      <div className="px-5 pt-5 pb-4">
        <p className="text-xs text-slate-400 mb-0.5" style={{ fontFamily:F.mono }}>
          Wednesday, 18 Mar 2026
        </p>
        <h1 className="font-black text-2xl mb-1" style={{ color:C.blue, fontFamily:F.head }}>
          Good morning, {currentUser?.full_name ? currentUser.full_name.split(" ")[0] : "..."} 👋
        </h1>
        <p className="text-sm text-slate-400">{currentUser?.hospital || "Hospital"} · {currentUser?.area || ""}</p>

        {/* Stats strip */}
        <div className="grid grid-cols-3 gap-2.5 mt-4">
          {[
            { label:"Active Posts", value:"2",      icon:Radio,          color:C.amber,  onClick: null },
            { label:"Total Hires",  value:"94",     icon:Users,          color:C.teal,   onClick: null },
            {
              label: "Quick Inbox",
              value: unreadMessageCount > 0 ? `${unreadMessageCount} New` : `${totalMessageCount}`,
              icon: MessageCircle,
              color: unreadMessageCount > 0 ? C.amber : C.teal,
              onClick: onInboxClick,
            },
          ].map(({ label, value, icon:Icon, color, onClick }) => {
            const Tag = onClick ? "button" : "div";
            return (
              <Tag key={label} onClick={onClick || undefined}
                className={`rounded-2xl p-3 text-center${onClick ? " active:scale-95 transition-transform" : ""}`}
                style={{ background:`${color}0D`, border:`1px solid ${color}22` }}>
                <Icon size={13} color={color} className="mx-auto mb-1"/>
                <p className="font-black text-sm" style={{ color, fontFamily:F.mono }}>{value}</p>
                <p className="text-[10px] text-slate-400">{label}</p>
              </Tag>
            );
          })}
        </div>
      </div>

      {/* Active Shifts */}
      <div className="px-5 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-black text-base" style={{ color:C.blue, fontFamily:F.head }}>
            Active Shifts
          </h2>
          <button onClick={onCreateShift} className="text-xs font-bold px-3 py-1.5 rounded-xl"
            style={{ background:`${C.teal}10`, color:C.teal }}>
            + New Post
          </button>
        </div>

        {shifts.filter(s => !['archived', 'completed', 'cancelled'].includes(s.status)).map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div key={s.id}
              initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
              transition={{ delay: i*0.1 }}
              className="rounded-3xl mb-3 overflow-hidden"
              style={{ background:C.card, border:`1px solid ${s.color}22`,
                boxShadow:`0 4px 20px ${s.color}10` }}>
              {/* Status bar top */}
              <div className="flex items-center gap-2 px-4 py-2.5"
                style={{ background:`${s.color}0C`, borderBottom:`1px solid ${s.color}15` }}>
                <span className="flex items-center gap-1.5">
                  {s.status === "searching" ? (
                    <motion.span className="w-2 h-2 rounded-full"
                      style={{ background:C.amber }}
                      animate={{ opacity:[1,0.2,1] }}
                      transition={{ duration:1.2, repeat:Infinity }}/>
                  ) : (
                    <span className="w-2 h-2 rounded-full" style={{ background:C.green }}/>
                  )}
                  <span className="text-xs font-black" style={{ color:s.color, fontFamily:F.mono }}>
                    {s.statusLabel}
                  </span>
                </span>
                <div className="ml-auto flex items-center gap-3">
                  {s.status === "matched" && (
                    <span className="flex items-center gap-1 text-xs font-bold"
                      style={{ color:C.green }}>
                      <CheckCircle size={12}/> Confirmed
                    </span>
                  )}
                  {s.status !== "searching" && s.status !== "open" && (
                    <button onClick={(e) => { e.stopPropagation(); onCompleteShift?.(s.id); }} className="p-1 rounded-md transition-colors hover:bg-slate-200" title="Archive/Complete Shift">
                      <Bookmark size={14} color="#64748B"/>
                    </button>
                  )}
                  <button onClick={(e) => { e.stopPropagation(); onCancelShift?.(s.id); }} className="p-1 rounded-md transition-colors hover:bg-red-50" title="Cancel/Delete Shift">
                    <Trash2 size={13} color="#EF4444"/>
                  </button>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ background:`${s.color}12` }}>
                    <Icon size={18} color={s.color}/>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-black text-base leading-tight"
                      style={{ color:C.blue, fontFamily:F.head }}>{s.title}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{s.dept}</p>
                  </div>
                  <p className="font-black text-base flex-shrink-0" style={{ color:C.teal, fontFamily:F.mono }}>
                    {s.pay}
                  </p>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Clock size={12} color="#94A3B8"/>{s.time}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Timer size={12} color="#94A3B8"/>{s.duration}
                  </div>
                </div>

                <div className="flex flex-col mt-4 pt-3" style={{ borderTop:`1px solid ${s.color}15` }}>
                  {(s.accepted_count > 0 || (s.accepted_technicians && s.accepted_technicians.length > 0)) ? (
                    <div className="flex items-center justify-between mb-3 w-full bg-slate-50 p-2.5 rounded-xl border border-slate-100 pb-3">
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Accepted Technicians</span>
                        <div className="text-sm font-black text-left flex items-center gap-1.5 mt-0.5" style={{ color: C.teal, fontFamily:F.head }}>
                          {s.accepted_count} Filled
                        </div>
                      </div>
                      <button onClick={() => onViewApplicants?.(s)} className="px-4 py-2 rounded-full text-xs font-bold shadow-sm" style={{ background: C.teal, color: 'white' }}>
                        Manage
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between mb-3 px-1">
                      {s.pending_count > 0 ? (
                        <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-md">
                          {s.pending_count} New Applicant{s.pending_count > 1 ? 's' : ''}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400 font-medium">
                          {s.accepted_count || 0} Technicians Accepted
                        </span>
                      )}
                      <button onClick={() => onViewApplicants?.(s)} className="text-xs font-black px-3 py-1.5 rounded-xl" style={{ background: `${C.amber}15`, color:C.amber }}>Manage Applicants</button>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-400">Total estimate: </span>
                      <span className="text-xs font-black" style={{ color:C.blue, fontFamily:F.mono }}>
                        {s.totalEst || `₹${s.hourly_rate * (s.duration || 1)}`}
                      </span>
                    </div>
                    {s.status === "searching" || s.status === "open" ? (
                      <motion.button
                        whileTap={{ scale:0.93 }}
                        onClick={() => onCancelShift?.(s.id)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black"
                        style={{ background: "#FEF2F2", color: "#EF4444", border: "1px solid #FECACA" }}>
                        <X size={14}/> Cancel Shift
                      </motion.button>
                    ) : (
                      <motion.button
                        whileTap={{ scale:0.93 }}
                        onClick={() => onCompleteShift?.(s.id)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black shadow-sm"
                        style={{ background: C.green, color: "white" }}>
                        <CheckCircle size={14} color="white" /> Complete Shift
                      </motion.button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Quick actions */}
      <div className="px-5 mb-4">
        <h2 className="font-black text-base" style={{ color:C.blue, fontFamily:F.head }}>
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label:"Browse Techs",   icon:Search,      color:C.teal  },
            { label:"Post Shift",     icon:Megaphone,   color:C.blue, onClick: onCreateShift  },
            { label:"View Invoices",  icon:CreditCard,  color:"#8B5CF6" },
            { label:"Analytics",      icon:BarChart3,   color:C.amber },
          ].map(({ label, icon:Icon, color, onClick }) => (
            <button key={label} onClick={onClick}
              className="flex items-center gap-3 p-3.5 rounded-2xl"
              style={{ background:C.card, border:"1px solid #F1F5F9" }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background:`${color}10` }}>
                <Icon size={16} color={color}/>
              </div>
              <span className="font-semibold text-sm" style={{ color:C.blue }}>{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// PHASE 14 — TECHNICIAN JOB RADAR
// ═══════════════════════════════════════════════════════════════════════════════
const TechRadar = ({ shifts, onHospitalClick, isGuest, onRequireAuth, currentUser, onApplyShift, isAvailable, toggleAvailability, unreadTechCount = 0, totalTechCount = 0, onInboxClick }) => {
  const [accepted, setAccepted] = useState({});

  const firstName = currentUser?.full_name?.split(" ")[0] || "Loading...";

  return (
    <div className="flex-1 overflow-y-auto pb-28 bg-transparent" style={{ scrollbarWidth:"none" }}>

      {/* ── TOP SECTION: Guest sees About Us card; authenticated user sees greeting ── */}
      {isGuest ? (
        <GuestAboutCard />
      ) : (
        <div className="px-5 pt-5 pb-4">
          <p className="text-xs text-slate-400 mb-0.5" style={{ fontFamily:F.mono }}>
            Wednesday, 18 Mar 2026
          </p>
          <h1 className="font-black text-2xl mb-1" style={{ color:C.blue, fontFamily:F.head }}>
            Hi, {firstName} 👋
          </h1>
          <p className="text-sm text-slate-400">{currentUser?.location || "Loading..."} · {currentUser?.rating || "New"}★ · {currentUser?.total_shifts || 0} shifts</p>

          {/* Availability toggle */}
          <motion.button
            whileTap={{ scale:0.97 }}
            onClick={toggleAvailability}
            className="w-full mt-4 rounded-2xl px-5 py-4 flex items-center justify-between"
            style={{
              background: isAvailable
                ? `linear-gradient(135deg, ${C.teal}, #0F766E)`
                : `linear-gradient(135deg, ${C.blue}, #1E4A7A)`,
              boxShadow: isAvailable ? `0 8px 28px ${C.teal}40` : `0 8px 28px ${C.blue}28`
            }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/20">
                {isAvailable
                  ? <Radio size={20} color="white" className="animate-pulse"/>
                  : <Radio size={20} color="rgba(255,255,255,0.5)"/>}
              </div>
              <div className="text-left">
                <p className="text-white font-black text-base" style={{ fontFamily:F.head }}>
                  {isAvailable ? "Available for Emergency Calls" : "Go Available"}
                </p>
                <p className="text-white/65 text-xs">
                  {isAvailable ? "Hospitals can see you nearby" : "Currently off-duty"}
                </p>
              </div>
            </div>
            <div className="w-12 h-6 rounded-full px-1 flex items-center transition-all"
              style={{ background: isAvailable ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.1)" }}>
              <motion.div className="w-4 h-4 rounded-full bg-white"
                animate={{ x: isAvailable ? 24 : 0 }}
                transition={{ type:"spring", stiffness:500, damping:30 }}/>
            </div>
          </motion.button>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2.5 mt-4">
            {[
              { label:"Rating",      value:"4.9★",                                                  icon:Star,          color:"#F59E0B",  onClick: null },
              { label:"Shifts",      value:"42",                                                    icon:Calendar,      color:C.teal,    onClick: null },
              {
                label: "Quick Inbox",
                value: unreadTechCount > 0 ? `${unreadTechCount} New` : `${totalTechCount}`,
                icon: MessageCircle,
                color: unreadTechCount > 0 ? C.amber : C.teal,
                onClick: onInboxClick,
              },
            ].map(({ label, value, icon:Icon, color, onClick }) => {
              const Tag = onClick ? "button" : "div";
              return (
                <Tag key={label} onClick={onClick || undefined}
                  className={`rounded-2xl p-3 text-center${onClick ? " active:scale-95 transition-transform" : ""}`}
                  style={{ background:`${color}0D`, border:`1px solid ${color}22` }}>
                  <Icon size={13} color={color} className="mx-auto mb-1"/>
                  <p className="font-black text-sm" style={{ color, fontFamily:F.mono }}>{value}</p>
                  <p className="text-[10px] text-slate-400">{label}</p>
                </Tag>
              );
            })}
          </div>
        </div>
      )}

      {/* Shift Cards */}
      <div className="px-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-black text-base" style={{ color:C.blue, fontFamily:F.head }}>
            Nearby Shifts
            <span className="ml-2 text-xs font-bold px-2 py-0.5 rounded-full"
              style={{ background:`${C.teal}12`, color:C.teal }}>
              {shifts.length}
            </span>
          </h2>
          <button className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl"
            style={{ background:`${C.blue}08`, color:C.blue }}
            onClick={() => { if (isGuest) onRequireAuth(); }}>
            <Filter size={12}/> Filter
          </button>
        </div>

        {shifts.map((s, i) => (
          <motion.div key={s.id}
            initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }}
            transition={{ delay: i*0.1 }}
            className="rounded-3xl mb-3 overflow-hidden"
            style={{ background:C.card, border:`1px solid ${s.color}20`,
              boxShadow:`0 4px 20px ${s.color}08` }}>
            {/* Urgent banner */}
            {s.urgent && (
              <div className="flex items-center gap-2 px-4 py-2"
                style={{ background:"#FEF2F2", borderBottom:"1px solid #FECACA" }}>
                <motion.span className="w-2 h-2 rounded-full bg-red-500"
                  animate={{ opacity:[1,0.2,1] }} transition={{ duration:1, repeat:Infinity }}/>
                <span className="text-xs font-black text-red-600" style={{ fontFamily:F.mono }}>
                  URGENT · High Demand
                </span>
              </div>
            )}

            <div className="p-4">
              <div className="flex items-start justify-between mb-2.5">
                <div className="flex-1 cursor-pointer" onClick={() => {
                  if (isGuest) { onRequireAuth(); return; }
                  onHospitalClick?.(s.hospital);
                }}>
                  <h3 className="font-black text-base active:opacity-70" style={{ color:C.blue, fontFamily:F.head }}>
                    {s.hospital}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">{s.dept}</p>
                </div>
                <p className="font-black text-base flex-shrink-0"
                  style={{ color:C.teal, fontFamily:F.mono }}>{s.pay}</p>
              </div>

              <div className="flex items-center gap-3 flex-wrap mb-3">
                <span className="flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full"
                  style={{ background:`${s.color}12`, color:s.color }}>
                  {s.equipment}
                </span>
                <span className="flex items-center gap-1 text-xs text-slate-400">
                  <MapPin size={11} color="#94A3B8"/>{s.distance}
                </span>
                <span className="flex items-center gap-1 text-xs text-slate-400">
                  <Clock size={11} color="#94A3B8"/>{s.time}
                </span>
              </div>

              <div className="flex items-center justify-between pt-3"
                style={{ borderTop:`1px solid ${s.color}12` }}>
                <div>
                  <span className="text-xs text-slate-400">Est: </span>
                  <span className="text-xs font-black" style={{ color:C.blue, fontFamily:F.mono }}>
                    {s.totalEst} · {s.duration}
                  </span>
                </div>
                <motion.button
                  whileTap={{ scale:0.93 }}
                  onClick={async () => {
                    if (isGuest) { onRequireAuth(); return; }
                    if (!accepted[s.id]) {
                      const success = await onApplyShift?.(s.id);
                      if (success) setAccepted(a => ({ ...a, [s.id]: true }));
                    }
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-2xl font-black text-sm text-white"
                  style={{
                    background: accepted[s.id]
                      ? `linear-gradient(135deg, ${C.green}, #059669)`
                      : `linear-gradient(135deg, ${C.teal}, #0F766E)`,
                    boxShadow: accepted[s.id]
                      ? "0 4px 16px rgba(16,185,129,0.4)"
                      : `0 4px 16px ${C.teal}40`,
                    minHeight:44,
                  }}>
                  <AnimatePresence mode="wait">
                    {accepted[s.id] ? (
                      <motion.span key="done" className="flex items-center gap-1.5"
                        initial={{ opacity:0, scale:0.8 }} animate={{ opacity:1, scale:1 }}>
                        <CheckCircle size={15}/> Accepted!
                      </motion.span>
                    ) : (
                      <motion.span key="acc" className="flex items-center gap-1.5"
                        initial={{ opacity:0, scale:0.8 }} animate={{ opacity:1, scale:1 }}>
                        <Zap size={15}/> Accept Shift
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// TECHNICIAN WALLET
// ═══════════════════════════════════════════════════════════════════════════════
const TechWallet = () => {
  const [withdrawing, setWithdrawing] = useState(false);
  const [withdrawn, setWithdrawn] = useState(false);

  const doWithdraw = () => {
    setWithdrawing(true);
    setTimeout(() => { setWithdrawing(false); setWithdrawn(true); }, 1500);
    setTimeout(() => setWithdrawn(false), 4000);
  };

  return (
    <div className="pb-32 bg-transparent">
      {/* Balance Hero Card */}
      <div className="px-5 pt-5 pb-2">
        <motion.div
          initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
          className="rounded-3xl p-6 relative overflow-hidden"
          style={{ background:`linear-gradient(135deg, ${C.blue} 0%, #0F2744 100%)`,
            boxShadow:`0 16px 48px ${C.blue}40` }}>
          {/* Decorative circles */}
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-10"
            style={{ background:C.teal }}/>
          <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full opacity-10"
            style={{ background:C.amber }}/>

          <p className="text-white/60 text-xs mb-1 relative z-10" style={{ fontFamily:F.mono }}>
            Available Balance
          </p>
          <p className="text-white font-black text-4xl mb-1 relative z-10" style={{ fontFamily:F.mono }}>
            {WALLET.balance}
          </p>
          <div className="flex items-center gap-1.5 relative z-10">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"/>
            <p className="text-emerald-400 text-xs font-semibold">
              +₹2,400 pending · MRI Shift
            </p>
          </div>

          <div className="flex gap-3 mt-5 relative z-10">
            <motion.button whileTap={{ scale:0.95 }}
              onClick={doWithdraw}
              className="flex-1 py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2"
              style={{ background: withdrawn ? C.green : C.teal,
                color:"white", fontFamily:F.head }}>
              {withdrawing ? (
                <><RefreshCw size={15} className="animate-spin"/> Processing…</>
              ) : withdrawn ? (
                <><CheckCircle size={15}/> Withdrawn!</>
              ) : (
                <><ArrowUpRight size={15}/> Withdraw</>
              )}
            </motion.button>
            <button className="flex-1 py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2"
              style={{ background:"rgba(255,255,255,0.12)", color:"white" }}>
              <ArrowDownLeft size={15}/> Add Money
            </button>
          </div>
        </motion.div>
      </div>

      {/* Last Payout Banner */}
      <div className="px-5 mt-4 mb-5">
        <div className="flex items-center gap-3 p-3.5 rounded-2xl"
          style={{ background:"#ECFDF5", border:"1px solid #A7F3D0" }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background:`${C.green}20` }}>
            <CheckCircle size={17} color={C.green}/>
          </div>
          <div>
            <p className="font-bold text-sm" style={{ color:"#065F46" }}>
              Last Payout: {WALLET.lastPayout} ✓
            </p>
            <p className="text-xs" style={{ color:"#6EE7B7" }}>
              Successfully transferred to {WALLET.lastPayoutBank} · {WALLET.lastPayoutDate}
            </p>
          </div>
        </div>
      </div>

      {/* Transactions */}
      <div className="px-5">
        <h2 className="font-black text-base mb-3" style={{ color:C.blue, fontFamily:F.head }}>
          Transaction History
        </h2>
        {WALLET.transactions.map((t, i) => (
          <motion.div key={t.id}
            initial={{ opacity:0, x:-12 }} animate={{ opacity:1, x:0 }}
            transition={{ delay: i*0.07 }}
            className="flex items-center gap-3 py-3.5"
            style={{ borderBottom:"1px solid #F8FAFC" }}>
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background:`${t.color}12` }}>
              {t.type==="credit"
                ? <ArrowDownLeft size={17} color={t.color}/>
                : <ArrowUpRight  size={17} color={t.color}/>}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate" style={{ color:C.blue }}>{t.label}</p>
              <p className="text-xs text-slate-400">{t.date}</p>
            </div>
            <p className="font-black text-sm flex-shrink-0"
              style={{ color:t.color, fontFamily:F.mono }}>{t.amount}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MANAGER FINANCE TAB
// ═══════════════════════════════════════════════════════════════════════════════
const ManagerFinance = ({ hospital }) => (
  <div className="px-5 pt-5 pb-32 bg-transparent">
    <h1 className="font-black text-2xl mb-1" style={{ color:C.blue, fontFamily:F.head }}>Finance</h1>
    <p className="text-sm text-slate-400 mb-5">{hospital}</p>

    {/* Invoice card */}
    <div className="rounded-3xl p-5 mb-4"
      style={{ background:C.card, border:"1px solid #F1F5F9",
        boxShadow:"0 4px 20px rgba(26,54,93,0.06)" }}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-black text-base" style={{ color:C.blue, fontFamily:F.head }}>
          Invoice #4092
        </h3>
        <span className="text-xs font-black px-2.5 py-1 rounded-full"
          style={{ background:`${C.teal}12`, color:C.teal }}>Generated</span>
      </div>
      <p className="text-xs text-slate-400 mb-3">Last week's temporary staffing · Mar 10–16, 2026</p>
      <div className="flex items-center justify-between py-2.5"
        style={{ borderTop:"1px dashed #E2E8F0" }}>
        <span className="text-sm text-slate-500">Total Amount</span>
        <span className="font-black text-xl" style={{ color:C.blue, fontFamily:F.mono }}>₹24,000</span>
      </div>
      <button className="w-full mt-3 py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2"
        style={{ background:`${C.blue}08`, color:C.blue }}>
        <CreditCard size={15}/> Download Invoice PDF
      </button>
    </div>

    {[
      { label:"MRI Shift – Vilas Z.",  date:"Mar 17",amount:"₹6,400", status:"Paid" },
      { label:"X-Ray Shift – Pending", date:"Mar 18",amount:"₹3,600", status:"Pending" },
    ].map((r, i) => (
      <div key={i} className="flex items-center gap-3 py-3.5"
        style={{ borderBottom:"1px solid #F8FAFC" }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background:`${C.teal}10` }}>
          <CreditCard size={15} color={C.teal}/>
        </div>
        <div className="flex-1">
          <p className="font-semibold text-sm" style={{ color:C.blue }}>{r.label}</p>
          <p className="text-xs text-slate-400">{r.date}</p>
        </div>
        <div className="text-right">
          <p className="font-black text-sm" style={{ color:C.blue, fontFamily:F.mono }}>{r.amount}</p>
          <span className="text-[10px] font-bold"
            style={{ color: r.status==="Paid" ? C.green : C.amber }}>{r.status}</span>
        </div>
      </div>
    ))}
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// PROFILE SCREENS
// ═══════════════════════════════════════════════════════════════════════════════
const EditManagerProfileSheet = ({ open, onClose, currentUser, onSubmit }) => {
  const [formData, setFormData] = useState({
    fullName: currentUser?.full_name || "",
    mobile: currentUser?.mobile_number || "",
    role: currentUser?.job_title || (currentUser?.role === "manager" ? "Hospital Manager" : ""),
    hospitalName: currentUser?.hospital || "",
    hospitalLocation: currentUser?.area || "",
    facilities: currentUser?.facilities || "",
    certifications: currentUser?.certifications || ""
  });

  useEffect(() => {
    if (open) {
      setFormData({
        fullName: currentUser?.full_name || "",
        mobile: currentUser?.mobile_number || "",
        role: currentUser?.job_title || (currentUser?.role === "manager" ? "Hospital Manager" : ""),
        hospitalName: currentUser?.hospital || "",
        hospitalLocation: currentUser?.area || "",
        facilities: currentUser?.facilities || "",
        certifications: currentUser?.certifications || ""
      });
    }
  }, [open, currentUser]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity:0, y:"100%" }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:"100%" }}
          transition={{ type:"spring", damping:25, stiffness:300 }}
          className="fixed inset-0 z-[99999] flex flex-col" style={{ background:C.pearl, fontFamily:F.head }}>
          <div className="flex items-center justify-between px-5 py-4 bg-white/80 backdrop-blur-md relative z-10" style={{ borderBottom:"1px solid #F1F5F9" }}>
            <h2 className="text-xl font-black" style={{ color:C.blue }}>Edit Profile</h2>
            <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white shadow-sm text-slate-400 active:scale-95 transition-transform">
              <X size={20} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-6">
            <div className="flex flex-col gap-4">
              {[
                { label: "Full Name", name: "fullName", placeholder: "e.g. John Doe" },
                { label: "Mobile Number", name: "mobile", placeholder: "+91 99999 99999" },
                { label: "Role in Hospital", name: "role", placeholder: "e.g., CMO, Assistant Manager" },
                { label: "Hospital Name", name: "hospitalName", placeholder: "e.g., City Care Medical Center" },
                { label: "Hospital Location/Address", name: "hospitalLocation", placeholder: "e.g., Pune, India" },
                { label: "Facilities", name: "facilities", placeholder: "e.g., Radiology, Oncology" },
                { label: "Certifications", name: "certifications", placeholder: "e.g., NABH Accredited" }
              ].map(field => (
                <div key={field.name}>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wide ml-1">{field.label}</label>
                  <input type="text" name={field.name} value={formData[field.name]} onChange={handleChange}
                    className="w-full mt-1 px-4 py-3.5 rounded-2xl text-sm font-semibold outline-none focus:ring-2 transition-all shadow-sm"
                    style={{ background:"#fff", border:"1px solid #E2E8F0", color:C.blue }} placeholder={field.placeholder} />
                </div>
              ))}
            </div>
            <motion.button whileTap={{ scale:0.95 }} onClick={() => onSubmit(formData)}
              className="w-full mt-8 py-4 rounded-2xl text-white font-black text-base shadow-lg mb-8"
              style={{ background:C.teal, boxShadow:`0 8px 24px ${C.teal}40`, fontFamily:F.head }}>
              Save Changes
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
const ManagerProfile = ({ onLogout, currentUser, onEditClick }) => {
  const getCompletion = () => {
    if (!currentUser) return 0;
    const required = [
      currentUser.full_name,
      currentUser.mobile_number,
      currentUser.job_title,
      currentUser.hospital,
      currentUser.area,
      currentUser.facilities,
      currentUser.certifications
    ];
    const filled = required.filter(f => f && f.trim() !== "").length;
    return Math.round((filled / required.length) * 100);
  };
  
  const completion = getCompletion();
  const radius = 38; 
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (completion / 100) * circumference;

  return (
    <div className="bg-transparent">
      <div className="relative h-44" style={{ background:`linear-gradient(135deg, ${C.blue}, #0F2744)` }}>
        <svg viewBox="0 0 430 176" className="absolute inset-0 w-full h-full opacity-20">
          <circle cx="350" cy="40"  r="70"  fill={C.teal}/>
          <circle cx="80"  cy="140" r="50"  fill={C.amber}/>
          <circle cx="220" cy="88"  r="90"  fill="rgba(255,255,255,0.05)"/>
        </svg>
        
        <button onClick={onEditClick} className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white active:scale-95 transition-transform" style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
          <Edit2 size={16} />
        </button>

        <div className="absolute bottom-0 left-5 translate-y-1/2 w-24 h-24">
          <svg className="absolute inset-0 w-full h-full -rotate-90 transform" viewBox="0 0 88 88">
            <circle cx="44" cy="44" r={radius} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="6" />
            <circle cx="44" cy="44" r={radius} fill="none" stroke={C.teal} strokeWidth="6"
              strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" 
              style={{ transition: "stroke-dashoffset 1s ease-in-out" }} />
          </svg>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[84px] h-[84px] rounded-full border-4 border-white flex items-center justify-center font-black text-3xl text-white shadow-xl"
            style={{ background:`linear-gradient(135deg, ${C.teal}, #0F766E)` }}>
            {currentUser?.full_name ? currentUser.full_name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2) : "..."}
          </div>
        </div>
      </div>
      
      <div className="px-5 pt-16 pb-5">
        {completion < 100 && (
          <div className="mb-6 p-4 rounded-2xl flex items-center justify-between shadow-sm" style={{ background: `${C.amber}10`, border: `1px solid ${C.amber}30` }}>
            <div>
              <h3 className="font-black text-sm" style={{ color: "#d97706", fontFamily: F.head }}>Finish Your Profile</h3>
              <p className="text-xs text-amber-700/70 font-medium">It's {completion}% complete.</p>
            </div>
            <button onClick={onEditClick} className="px-4 py-2 rounded-xl text-xs font-bold text-white shadow" style={{ background: C.amber, fontFamily: F.head }}>
              Complete Now
            </button>
          </div>
        )}
        <div className="flex items-start justify-between mb-1">
          <div>
            <h1 className="font-black text-2xl" style={{ color:C.blue, fontFamily:F.head }}>
              {currentUser?.full_name || "Loading..."}
            </h1>
            <p className="text-sm text-slate-400">{currentUser?.job_title || (currentUser?.role === "manager" ? "Hospital Manager" : "...")}</p>
          </div>
          <span className="flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full mt-1"
            style={{ background:`${C.teal}10`, color:C.teal }}>
            <BadgeCheck size={11}/> Verified
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-slate-500 mt-2 mb-4">
          <Building2 size={14} color="#94A3B8"/>{currentUser?.hospital || "Hospital"}
          <span className="text-slate-300">·</span>
          <MapPin size={14} color="#94A3B8"/>{currentUser?.area || ""}
        </div>
        {[
          { label:"Hospital", value: currentUser?.hospital || "Hospital" },
          { label:"Location", value: currentUser?.area || "Not provided" },
          { label:"Facilities", value: currentUser?.facilities || "Not provided" },
          { label:"Certifications", value: currentUser?.certifications || "None" },
        ].map(({ label, value }) => (
          <div key={label} className="flex justify-between py-3"
            style={{ borderBottom:"1px solid #F1F5F9" }}>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide"
              style={{ fontFamily:F.mono }}>{label}</span>
            <span className="text-sm font-semibold text-right max-w-[60%]" style={{ color:C.blue }}>{value}</span>
          </div>
        ))}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onLogout}
          className="w-full mt-6 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm"
          style={{ background: "#FEF2F2", color: "#EF4444", border: "1px solid #FECACA" }}>
          <LogOut size={16} /> Log Out
        </motion.button>
      </div>
    </div>
  );
};

const EditTechProfileSheet = ({ open, onClose, currentUser, onSubmit }) => {
  const [formData, setFormData] = useState({
    fullName: currentUser?.full_name || "",
    email: currentUser?.email || "",
    mobile: currentUser?.mobile_number || "",
    bio: currentUser?.bio || "",
    specialty: currentUser?.specialty || "",
    machineSkills: currentUser?.machine_skills || "",
    certifications: currentUser?.certifications_list || "",
    experience: currentUser?.experience_years != null ? currentUser.experience_years.toString() : "",
    country: currentUser?.country || "India",
    state: currentUser?.state || "Maharashtra",
    district: currentUser?.district || "Nashik",
    area: currentUser?.area || "",
    address: currentUser?.home_address || ""
  });

  useEffect(() => {
    if (open) {
      setFormData({
        fullName: currentUser?.full_name || "",
        email: currentUser?.email || "",
        mobile: currentUser?.mobile_number || "",
        bio: currentUser?.bio || "",
        specialty: currentUser?.specialty || "",
        machineSkills: currentUser?.machine_skills || "",
        certifications: currentUser?.certifications_list || "",
        experience: currentUser?.experience_years != null ? currentUser.experience_years.toString() : "",
        country: currentUser?.country || "India",
        state: currentUser?.state || "Maharashtra",
        district: currentUser?.district || "Nashik",
        area: currentUser?.area || "",
        address: currentUser?.home_address || ""
      });
    }
  }, [open, currentUser]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleDetectLocation = () => {
    if (navigator && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          alert("Location detected! (Mocking reverse geocode to 'Panchavati'...)");
          setFormData(prev => ({ ...prev, area: "Panchavati" }));
        },
        (err) => {
          alert("Please turn on location services to detect your area.");
          setFormData(prev => ({ ...prev, area: "Panchavati" }));
        }
      );
    } else {
      alert("Please turn on location services to detect your area.");
      setFormData(prev => ({ ...prev, area: "Panchavati" }));
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity:0, y:"100%" }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:"100%" }}
          transition={{ type:"spring", damping:25, stiffness:300 }}
          className="fixed inset-0 z-[99999] flex flex-col" style={{ background:C.pearl, fontFamily:F.head }}>
          <div className="flex items-center justify-between px-5 py-4 bg-white/80 backdrop-blur-md relative z-10" style={{ borderBottom:"1px solid #F1F5F9" }}>
            <h2 className="text-xl font-black" style={{ color:C.blue }}>Edit Profile</h2>
            <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white shadow-sm text-slate-400 active:scale-95 transition-transform">
              <X size={20} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-6">
            
            <h3 className="text-xs font-black text-teal-600 uppercase tracking-widest mb-3">Basic Info</h3>
            <div className="flex flex-col gap-4 mb-6">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide ml-1">Full Name</label>
                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange}
                  className="w-full mt-1 px-4 py-3 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-teal-500/30 transition-all"
                  style={{ background:"#fff", border:"1px solid #E2E8F0", color:C.blue }} placeholder="e.g. Sarah Connor" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide ml-1">Email Address</label>
                <input type="email" name="email" value={formData.email} disabled
                  className="w-full mt-1 px-4 py-3 rounded-xl text-sm font-semibold outline-none transition-all cursor-not-allowed"
                  style={{ background:"#F8FAFC", border:"1px solid #E2E8F0", color:"#94A3B8" }} placeholder="sarah@example.com" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide ml-1">Mobile Number</label>
                <input type="text" name="mobile" value={formData.mobile} disabled
                  className="w-full mt-1 px-4 py-3 rounded-xl text-sm font-semibold outline-none transition-all cursor-not-allowed"
                  style={{ background:"#F8FAFC", border:"1px solid #E2E8F0", color:"#94A3B8" }} placeholder="+91 99999 99999" />
              </div>
            </div>

            <h3 className="text-xs font-black text-teal-600 uppercase tracking-widest mb-3">Professional</h3>
            <div className="flex flex-col gap-4 mb-6">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide ml-1">Bio / Description</label>
                <textarea name="bio" value={formData.bio} onChange={handleChange} rows="3"
                  className="w-full mt-1 px-4 py-3 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-teal-500/30 transition-all resize-none"
                  style={{ background:"#fff", border:"1px solid #E2E8F0", color:C.blue }} placeholder="Describe your experience and goals..." />
              </div>
              {[
                { label: "Specialty", name: "specialty", placeholder: "e.g., Radiology" },
                { label: "Specific Machine Skills", name: "machineSkills", placeholder: "e.g., GE MRI, Siemens CT" },
                { label: "Certifications", name: "certifications", placeholder: "e.g., BLS, ARRT" },
              ].map(field => (
                <div key={field.name}>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide ml-1">{field.label}</label>
                  <input type="text" name={field.name} value={formData[field.name]} onChange={handleChange}
                    className="w-full mt-1 px-4 py-3 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-teal-500/30 transition-all"
                    style={{ background:"#fff", border:"1px solid #E2E8F0", color:C.blue }} placeholder={field.placeholder} />
                </div>
              ))}
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide ml-1">Experience (Years)</label>
                <input type="number" name="experience" value={formData.experience} onChange={handleChange}
                  className="w-full mt-1 px-4 py-3 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-teal-500/30 transition-all"
                  style={{ background:"#fff", border:"1px solid #E2E8F0", color:C.blue }} placeholder="e.g., 5" />
              </div>
            </div>

            <h3 className="text-xs font-black text-teal-600 uppercase tracking-widest mb-3">Location</h3>
            <div className="flex flex-col gap-4 mb-6">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide ml-1">Country</label>
                <input type="text" disabled value="India"
                  className="w-full mt-1 px-4 py-3 rounded-xl text-sm font-semibold outline-none transition-all cursor-not-allowed"
                  style={{ background:"#F8FAFC", border:"1px solid #E2E8F0", color:"#94A3B8" }} />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide ml-1">State</label>
                <input type="text" disabled value="Maharashtra"
                  className="w-full mt-1 px-4 py-3 rounded-xl text-sm font-semibold outline-none transition-all cursor-not-allowed"
                  style={{ background:"#F8FAFC", border:"1px solid #E2E8F0", color:"#94A3B8" }} />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide ml-1">District</label>
                <input type="text" disabled value="Nashik"
                  className="w-full mt-1 px-4 py-3 rounded-xl text-sm font-semibold outline-none transition-all cursor-not-allowed"
                  style={{ background:"#F8FAFC", border:"1px solid #E2E8F0", color:"#94A3B8" }} />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide ml-1">Area</label>
                <div className="w-full mt-1 flex items-center bg-white rounded-xl focus-within:ring-2 focus-within:ring-teal-500/30 transition-all overflow-hidden"
                     style={{ border:"1px solid #E2E8F0" }}>
                  <input type="text" name="area" value={formData.area} readOnly
                    className="flex-1 px-4 py-3 text-sm font-semibold outline-none bg-transparent"
                    style={{ color:C.blue }} placeholder="Detecting area..." />
                  <button onClick={handleDetectLocation} className="px-4 py-3 h-full flex items-center justify-center font-bold text-sm"
                    style={{ background: `${C.teal}10`, color: C.teal, borderLeft: "1px solid #E2E8F0" }}>
                     <MapPin size={16} className="mr-1.5" /> Detect
                  </button>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide ml-1">Home Address</label>
                <textarea name="address" value={formData.address} onChange={handleChange} rows="2"
                  className="w-full mt-1 px-4 py-3 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-teal-500/30 transition-all resize-none"
                  style={{ background:"#fff", border:"1px solid #E2E8F0", color:C.blue }} placeholder="Full address..." />
              </div>
            </div>

            <motion.button whileTap={{ scale:0.95 }} onClick={() => onSubmit(formData)}
              className="w-full mt-2 py-4 rounded-2xl text-white font-black text-base shadow-lg mb-8"
              style={{ background:C.teal, boxShadow:`0 8px 24px ${C.teal}40`, fontFamily:F.head }}>
              Save Profile
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const TechProfile = ({ onLogout, isGuest, onRequireAuth, currentUser, onEditClick }) => {
  if (isGuest) {
    return (
      <div className="px-5 pt-16 pb-28 flex flex-col items-center bg-transparent">
        <div className="w-24 h-24 rounded-3xl flex items-center justify-center shadow-xl mb-6 border-4"
          style={{ background: `linear-gradient(135deg, ${C.teal}, #0F766E)`, borderColor: "rgba(255,255,255,0.4)" }}>
          <User size={40} color="white" strokeWidth={2.5}/>
        </div>
        <h1 className="text-2xl font-black text-center mb-3" style={{ color: C.blue, fontFamily: F.head }}>
          Your Quick Med Support Profile
        </h1>
        <p className="text-center text-sm font-medium mb-10 px-4 leading-relaxed text-slate-500">
          Track earnings, accept shifts instantly, and build your reputation. Register for free to unlock all features.
        </p>
        <motion.button whileTap={{ scale: 0.95 }} onClick={() => onRequireAuth("register")}
          className="w-full py-4 rounded-2xl text-white font-black text-base shadow-lg mb-4"
          style={{ background: C.teal, boxShadow: `0 8px 24px ${C.teal}40`, fontFamily: F.head }}>
          Register as Technician
        </motion.button>
        <motion.button whileTap={{ scale: 0.95 }} onClick={() => onRequireAuth("login")}
          className="w-full py-4 rounded-2xl font-bold text-sm transition-colors hover:bg-slate-100"
          style={{ background: `${C.blue}0A`, color: C.blue, fontFamily: F.head }}>
          Log In
        </motion.button>
      </div>
    );
  }

  const getInitials = () => {
    if (!currentUser?.full_name) return "GT";
    const parts = currentUser.full_name.split(' ');
    if (parts.length > 1) return (parts[0][0] + parts[1][0]).toUpperCase();
    return parts[0].substring(0, 2).toUpperCase();
  };

  const getCompletion = () => {
    if (!currentUser) return 0;
    const required = [
      currentUser.full_name,
      currentUser.mobile_number,
      currentUser.specialty,
      currentUser.machine_skills,
      currentUser.experience_years,
      currentUser.city,
      currentUser.state
    ];
    const filled = required.filter(f => f != null && f.toString().trim() !== "").length;
    return Math.round((filled / required.length) * 100);
  };
  
  const completion = getCompletion();
  const radius = 54; 
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (completion / 100) * circumference;

  return (
  <div className="bg-transparent">
    <div className="px-5 pt-5 pb-6 relative"
      style={{ background:`linear-gradient(160deg, ${C.blue}, #0F2744)` }}>
      
      <button onClick={onEditClick} className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white active:scale-95 transition-transform" style={{ zIndex: 10, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
        <Edit2 size={16} />
      </button>

      <div className="flex flex-col items-center relative mt-4">
        <div className="relative w-32 h-32 mb-3">
          <svg className="absolute inset-0 w-full h-full -rotate-90 transform" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r={radius} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
            <circle cx="60" cy="60" r={radius} fill="none" stroke={C.teal} strokeWidth="6"
              strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" 
              style={{ transition: "stroke-dashoffset 1s ease-in-out" }} />
          </svg>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100px] h-[100px] rounded-3xl border-4 flex items-center justify-center font-black text-4xl text-white shadow-2xl"
            style={{ background:`linear-gradient(135deg, ${C.teal}, #0F766E)`, borderColor:"rgba(255,255,255,0.2)" }}>
            {getInitials()}
          </div>
        </div>

        <h1 className="font-black text-2xl text-white" style={{ fontFamily:F.head }}>
          {currentUser?.full_name || "Loading..."}
        </h1>
        <p className="text-white/65 text-sm text-center mt-0.5 px-6">
          {currentUser?.specialty || "Certified Medical Professional"}
        </p>
        <div className="flex items-center gap-3 mt-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
            style={{ background:"rgba(255,255,255,0.12)" }}>
            <Star size={12} fill="#F59E0B" color="#F59E0B"/>
            <span className="text-white font-black text-sm">{currentUser?.rating || "New"} / 5.0</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
            style={{ background:"rgba(255,255,255,0.12)" }}>
            <Hash size={12} color="rgba(255,255,255,0.7)"/>
            <span className="text-white font-black text-sm">{currentUser?.total_shifts || 0} shifts</span>
          </div>
        </div>
      </div>
    </div>
    
    <div className="px-5 pt-6">
      {completion < 100 && (
        <div className="mb-6 p-4 rounded-2xl flex items-center justify-between shadow-sm" style={{ background: `${C.amber}10`, border: `1px solid ${C.amber}30` }}>
          <div>
            <h3 className="font-black text-sm" style={{ color: "#d97706", fontFamily: F.head }}>Profile Incomplete</h3>
            <p className="text-xs text-amber-700/70 font-medium">Complete to get hired faster ({completion}%).</p>
          </div>
          <button onClick={onEditClick} className="px-4 py-2 rounded-xl text-xs font-bold text-white shadow min-w-[max-content]" style={{ background: C.amber, fontFamily: F.head }}>
            Finish Now
          </button>
        </div>
      )}

      {[
        { label:"Location",  value: (currentUser?.city && currentUser?.state) ? `${currentUser.city}, ${currentUser.state}` : (currentUser?.city || "Not provided") },
        { label:"Experience", value: currentUser?.experience_years ? `${currentUser.experience_years} Years` : "Not provided" },
        { label:"Machine Skills", value: currentUser?.machine_skills || "Not provided" },
        { label:"Status",    value:"Available Now ✓" },
      ].map(({ label, value }) => (
        <div key={label} className="flex justify-between py-3"
          style={{ borderBottom:"1px solid #F1F5F9" }}>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wide"
            style={{ fontFamily:F.mono }}>{label}</span>
          <span className="text-sm font-semibold text-right max-w-[65%]" style={{ color:C.blue }}>{value}</span>
        </div>
      ))}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={onLogout}
        className="w-full mt-6 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm"
        style={{ background: "#FEF2F2", color: "#EF4444", border: "1px solid #FECACA" }}>
        <LogOut size={16} /> Log Out
      </motion.button>
    </div>
  </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// PHASE 15 — COMMUNITY FEED
// ═══════════════════════════════════════════════════════════════════════════════

// MRI Machine SVG illustration
const MRIMachineIllustration = () => (
  <svg viewBox="0 0 340 180" xmlns="http://www.w3.org/2000/svg"
    className="w-full rounded-2xl" style={{ background:"linear-gradient(135deg,#EEF2FF 0%,#E0F2FE 100%)" }}>
    <defs>
      <radialGradient id="mriGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#0D9488" stopOpacity="0.3"/>
        <stop offset="100%" stopColor="#0D9488" stopOpacity="0"/>
      </radialGradient>
    </defs>
    {/* Glow */}
    <ellipse cx="170" cy="90" rx="110" ry="80" fill="url(#mriGlow)"/>
    {/* MRI bore (outer ring) */}
    <ellipse cx="170" cy="90" rx="78" ry="78" fill="none" stroke="#CBD5E1" strokeWidth="28" />
    <ellipse cx="170" cy="90" rx="78" ry="78" fill="none" stroke="white" strokeWidth="26" />
    {/* Inner bore */}
    <ellipse cx="170" cy="90" rx="52" ry="52" fill="#DBEAFE" stroke="#93C5FD" strokeWidth="2"/>
    {/* Tunnel gradient */}
    <ellipse cx="170" cy="90" rx="40" ry="40" fill="#BFDBFE" stroke="#60A5FA" strokeWidth="1"/>
    {/* Patient table */}
    <rect x="82" y="106" width="176" height="12" rx="6" fill="#94A3B8"/>
    <rect x="100" y="96" width="140" height="12" rx="4" fill="#CBD5E1"/>
    {/* Control panel */}
    <rect x="270" y="55" width="50" height="70" rx="8" fill="#E2E8F0"/>
    <rect x="276" y="63" width="38" height="24" rx="4" fill="#0D9488" opacity="0.8"/>
    {[0,1,2].map(i => (
      <circle key={i} cx={285 + i*10} cy={100} r="4" fill={i===0?"#10B981":i===1?"#F59E0B":"#94A3B8"}/>
    ))}
    {/* Label */}
    <text x="170" y="162" textAnchor="middle" fill="#64748B" fontSize="11"
      fontFamily="monospace" fontWeight="600">GE Healthcare · SIGNA™ 1.5T MRI</text>
    {/* Signal arcs */}
    {[1,2,3].map(i => (
      <path key={i} d={`M ${170-30*i} ${90} A ${30*i} ${30*i} 0 0 1 ${170+30*i} ${90}`}
        fill="none" stroke="#0D9488" strokeWidth="1" opacity={0.4 - i*0.1}
        strokeDasharray="4 4"/>
    ))}
  </svg>
);

const FeedPost = ({ post, onAuthorClick }) => {
  const [liked,    setLiked]    = useState(post.liked || false);
  const [saved,    setSaved]    = useState(false);
  const [likeCount,setLikeCount]= useState(post.likes || 0);

  const handleLike = () => {
    setLiked(l => !l);
    setLikeCount(c => liked ? c - 1 : c + 1);
  };

  if (post.type === "ad") {
    return (
      <motion.div
        initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
        className="rounded-3xl overflow-hidden mb-4"
        style={{ background:"linear-gradient(135deg,#4C1D95,#5B21B6)",
          boxShadow:"0 8px 32px rgba(91,33,182,0.25)" }}>
        <div className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center font-black text-white text-sm"
              style={{ background:"rgba(255,255,255,0.2)" }}>NM</div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-bold text-sm text-white">{post.author}</p>
                <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full"
                  style={{ background:"rgba(255,255,255,0.2)", color:"rgba(255,255,255,0.8)" }}>
                  AD
                </span>
              </div>
              <p className="text-xs" style={{ color:"rgba(255,255,255,0.55)" }}>{post.role}</p>
            </div>
          </div>
          <p className="text-white/90 text-sm leading-relaxed mb-4">{post.body}</p>
          <div className="flex items-center gap-3">
            <motion.button whileTap={{ scale:0.95 }}
              className="flex-1 py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2"
              style={{ background:"rgba(255,255,255,0.2)", color:"white" }}>
              <ExternalLink size={14}/> {post.cta}
            </motion.button>
            <button className="w-10 h-10 rounded-2xl flex items-center justify-center"
              style={{ background:"rgba(255,255,255,0.1)" }}>
              <X size={14} color="rgba(255,255,255,0.6)"/>
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
      className="rounded-3xl mb-4 overflow-hidden"
      style={{ background:C.card, border:"1px solid #F1F5F9",
        boxShadow:"0 4px 20px rgba(26,54,93,0.06)" }}>
      {/* Author header */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-3">
        <div className="w-11 h-11 rounded-2xl flex items-center justify-center font-black text-white text-sm"
          style={{ background:`linear-gradient(135deg, ${post.avatarColor}, ${post.avatarColor}BB)` }}>
          {post.initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 cursor-pointer active:opacity-70" onClick={() => onAuthorClick?.(post.author)}>
            <p className="font-bold text-sm truncate" style={{ color: C.blue, fontFamily: F.head }}>
              {post.author}
            </p>
            {post.verified && <BadgeCheck size={13} color={C.teal}/>}
          </div>
          <p className="text-xs truncate" style={{ color: "var(--c-text-main)", opacity: 0.6 }}>{post.role}</p>
          <p className="text-[10px]" style={{ color: "var(--c-text-main)", opacity: 0.6 }}>{post.time}</p>
        </div>
        <button className="w-8 h-8 rounded-xl flex items-center justify-center dark:bg-slate-700"
          style={{ background:"#F8FAFC" }}>
          <MoreHorizontal size={15} color="#94A3B8" className="dark:text-slate-400"/>
        </button>
      </div>

      {/* Body text */}
      <p className="px-4 pb-3 text-base leading-relaxed" style={{ color: "var(--c-text-main)" }}>{post.body}</p>

      {/* Image if any */}
      {post.hasImage && post.imageType === "mri" && (
        <div className="px-4 pb-3">
          <MRIMachineIllustration/>
        </div>
      )}

      {/* Engagement bar */}
      <div className="px-4 pb-3 pt-1 flex items-center justify-between"
        style={{ borderTop:"1px solid #F8FAFC" }}>
        <div className="flex items-center gap-4">
          <motion.button whileTap={{ scale:0.85 }}
            onClick={handleLike}
            className="flex items-center gap-1.5">
            <motion.div
              animate={{ scale: liked ? [1, 1.3, 1] : 1 }}
              transition={{ duration:0.3 }}>
              <ThumbsUp size={17}
                color={liked ? C.teal : "#94A3B8"}
                fill={liked ? C.teal : "none"}
                strokeWidth={liked ? 2.5 : 1.8}/>
            </motion.div>
            <span className="text-xs font-semibold dark:text-slate-300"
              style={{ color: liked ? C.teal : "#94A3B8" }}>{likeCount}</span>
          </motion.button>

          <button className="flex items-center gap-1.5">
            <MessageCircle size={17} color="#94A3B8" strokeWidth={1.8}/>
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-300">{post.comments}</span>
          </button>

          <button className="flex items-center gap-1.5">
            <Send size={16} color="#94A3B8" strokeWidth={1.8}/>
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-300">{post.shares}</span>
          </button>
        </div>

        <motion.button whileTap={{ scale:0.85 }} onClick={() => setSaved(s => !s)}>
          <Bookmark size={17}
            color={saved ? C.blue : "#94A3B8"}
            fill={saved ? C.blue : "none"}
            strokeWidth={saved ? 2.5 : 1.8}/>
        </motion.button>
      </div>
    </motion.div>
  );
};

const CommunityFeed = ({ posts, onAuthorClick }) => (
  <div className="flex-1 overflow-y-auto pb-28 px-4 pt-4 bg-transparent" style={{ scrollbarWidth:"none" }}>
    {/* Search */}
    <div className="flex items-center gap-2 mb-4">
      <div className="flex-1 flex items-center gap-2 px-3.5 py-2.5 rounded-2xl"
        style={{ background:C.card, border:"1px solid #F1F5F9" }}>
        <Search size={15} color="#94A3B8"/>
        <span className="text-sm text-slate-300" style={{ fontFamily:F.head }}>Search community…</span>
      </div>
      <button className="w-11 h-11 rounded-2xl flex items-center justify-center"
        style={{ background:C.card, border:"1px solid #F1F5F9" }}>
        <Filter size={16} color={C.blue}/>
      </button>
    </div>

    {/* Pills */}
    <div className="flex gap-2 mb-5 overflow-x-auto" style={{ scrollbarWidth:"none" }}>
      {["For You","Hospitals","Technicians","Tips & Safety","Jobs"].map((t, i) => (
        <span key={t}
          className="px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap flex-shrink-0 cursor-pointer"
          style={{ background: i===0 ? C.blue : C.card,
            color: i===0 ? "white" : "#94A3B8",
            border: i===0 ? "none" : "1px solid #F1F5F9",
            fontFamily:F.head }}>
          {t}
        </span>
      ))}
    </div>

    {/* Posts */}
    {posts.map((post, i) => (
      <motion.div key={post.id}
        initial={{ opacity:0, y:24 }}
        animate={{ opacity:1, y:0 }}
        transition={{ delay: i * 0.12 }}>
        <FeedPost post={post} onAuthorClick={onAuthorClick} />
      </motion.div>
    ))}
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// SHIFTS TAB (shared)
// ═══════════════════════════════════════════════════════════════════════════════
const ShiftsTab = ({ role, managerShifts, techShifts, isGuest, onRequireAuth, currentUser }) => {
  const [activeFilter, setActiveFilter] = useState("Active/Upcoming");

  if (role === "technician" && isGuest) {
    return (
      <div className="flex-1 overflow-y-auto pb-28 px-5 pt-16 flex flex-col items-center bg-transparent" style={{ scrollbarWidth:"none" }}>
        <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6"
          style={{ background: `${C.blue}10` }}>
          <Calendar size={32} color={C.blue}/>
        </div>
        <h1 className="text-xl font-black text-center mb-3" style={{ color: C.blue, fontFamily: F.head }}>
          Manage Your Schedule
        </h1>
        <p className="text-center text-sm font-medium mb-10 px-2 text-slate-500">
          Log in to view your applied, upcoming, and completed shifts.
        </p>
        <motion.button whileTap={{ scale: 0.95 }} onClick={onRequireAuth}
          className="w-full py-4 rounded-2xl font-black text-base text-white shadow-lg mb-4"
          style={{ background: C.blue, boxShadow: `0 8px 24px ${C.blue}40`, fontFamily: F.head }}>
          Log In to View Shifts
        </motion.button>
      </div>
    );
  }

  const baseShifts = role === "manager" ? managerShifts : techShifts;
  const shifts = baseShifts.filter(s => {
      const st = s.status?.toLowerCase();
      if (activeFilter === "Active/Upcoming") return ["open", "searching", "filled", "matched"].includes(st);
      if (activeFilter === "Completed") return st === "completed" || st === "archived";
      if (activeFilter === "Cancelled") return st === "cancelled";
      return true;
  });

  return (
    <div className="flex-1 overflow-y-auto pb-28 px-5 pt-5 bg-transparent" style={{ scrollbarWidth:"none" }}>
      <h1 className="font-black text-2xl mb-1" style={{ color:C.blue, fontFamily:F.head }}>
        {role === "manager" ? "Posted Shifts" : "My Shifts"}
      </h1>
      <p className="text-sm text-slate-400 mb-5">
        {role === "manager" ? (currentUser?.hospital || "Hospital") : "Upcoming & past work"}
      </p>
      <div className="flex gap-2 mb-5 overflow-x-auto" style={{ scrollbarWidth:"none" }}>
        {["Active/Upcoming","Completed","Cancelled"].map((t) => (
          <button key={t}
            onClick={() => setActiveFilter(t)}
            className="px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap flex-shrink-0 transition-colors"
            style={{ background: activeFilter === t ? C.blue : "#F1F5F9",
              color: activeFilter === t ? "white" : "#94A3B8", fontFamily:F.head }}>
            {t}
          </button>
        ))}
      </div>
      {shifts.length === 0 && (
        <div className="text-center mt-12">
          <p className="text-sm text-slate-400 font-medium tracking-wide">No shifts found</p>
        </div>
      )}
      {shifts.map((s, i) => {
        const Icon = s.icon || ScanLine;
        return (
          <motion.div key={s.id}
            initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
            transition={{ delay:i*0.1 }}
            className="rounded-3xl mb-3 overflow-hidden"
            style={{ background:C.card, border:`1px solid ${s.color}22`,
              boxShadow:`0 4px 20px ${s.color}08` }}>
            <div className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ background:`${s.color}12` }}>
                  <Icon size={18} color={s.color}/>
                </div>
                <div className="flex-1">
                  <h3 className="font-black text-base" style={{ color:C.blue, fontFamily:F.head }}>
                    {s.title || s.equipment}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">{s.time}</p>
                </div>
                <p className="font-black text-sm" style={{ color:C.teal, fontFamily:F.mono }}>{s.pay}</p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// TECHNICIAN AUTH SCREEN (GUEST MODE)
// ═══════════════════════════════════════════════════════════════════════════════
const TechAuthScreen = ({ onClose, onSuccess, initialMode = "login" }) => {
  const [isRegistering, setIsRegistering] = useState(initialMode === "register");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsRegistering(initialMode === "register");
  }, [initialMode]);
  
  // Dummy form state
  const [formData, setFormData] = useState({
    fullName: "", mobile: "", email: "", password: "", idFile: null, certificateFile: null
  });

  const handleRegisterSubmit = async () => {
    if (!formData.email || !formData.password || !formData.fullName || !formData.mobile) {
      alert("Please fill in all required fields.");
      return;
    }
    
    try {
      setIsLoading(true);
      const res = await fetch(`${API_BASE}/api/auth/register/technician`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: formData.fullName,
          mobile_number: formData.mobile,
          email: formData.email,
          password: formData.password
        })
      });
      
      const data = await res.json();
      if (res.ok) {
        onSuccess(data);
      } else {
        alert(data.detail || "Registration failed. Please try again.");
      }
    } catch (err) {
      alert("Network error: Could not reach the server.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSubmit = async () => {
    if (!formData.email || !formData.password) {
      alert("Please fill in both Email and Password.");
      return;
    }
    
    try {
      setIsLoading(true);
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          role: "technician"
        })
      });
      
      const data = await res.json();
      if (res.ok) {
        onSuccess(data.user);
      } else {
        alert(data.detail || "Invalid Email or Password. Please try again.");
      }
    } catch (err) {
      alert("Network error: Could not reach the server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: "100%" }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className="fixed inset-0 z-[999999] flex flex-col"
      style={{ fontFamily: F.head, background: C.pearl }}
    >
      <div className="flex items-center justify-between px-5 py-4 bg-white/80 backdrop-blur-md relative z-10" style={{ borderBottom: "1px solid #F1F5F9" }}>
        <h2 className="text-xl font-black" style={{ color: C.blue }}>
          {isRegistering ? "Apply to Join" : "Welcome Back"}
        </h2>
        <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white shadow-sm text-slate-400 active:scale-95 transition-transform">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 p-6 overflow-y-auto w-full relative" style={{ scrollbarWidth: "none" }}>
        <div className="max-w-md mx-auto flex flex-col items-center">
            
          {!isRegistering && (
             <div className="w-20 h-20 rounded-3xl flex items-center justify-center shadow-2xl mb-8 mt-4"
                style={{ background: `linear-gradient(135deg, ${C.teal}, #0F766E)` }}>
                <Shield size={36} color="white" strokeWidth={2.5}/>
             </div>
          )}

          <h1 className="text-2xl font-black text-center mb-2" style={{ color: C.blue, marginTop: isRegistering ? "1rem" : "0" }}>
            {isRegistering ? "Apply to Join Quick Med Support" : "Join Quick Med Support to Accept Shifts"}
          </h1>
          <p className="text-center text-slate-500 text-sm mb-8 px-2 leading-relaxed">
            {isRegistering 
              ? "Submit your credentials. Our verification team will review your application within 24 hours." 
              : "Get verified, find high-paying local shifts, and manage your schedule effortlessly."}
          </p>

          <div className="w-full flex flex-col gap-4 mb-8">
            {isRegistering && (
              <>
                <input type="text" placeholder="Full Legal Name" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})}
                  className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 outline-none focus:border-teal-500 transition-colors font-semibold text-slate-800" />
                <input type="tel" placeholder="Mobile Number" value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})}
                  className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 outline-none focus:border-teal-500 transition-colors font-semibold text-slate-800" />
              </>
            )}
            
            <input type="email" placeholder="Email Address" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
              className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 outline-none focus:border-teal-500 transition-colors font-semibold text-slate-800" />
            <input type="password" placeholder="Password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})}
              className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 outline-none focus:border-teal-500 transition-colors font-semibold text-slate-800" />

            {isRegistering && (
              <div className="flex flex-col gap-3 mt-2">
                <div className="w-full border-2 border-dashed border-slate-300 bg-white rounded-2xl p-5 flex flex-col items-center justify-center cursor-pointer hover:border-teal-400 hover:bg-teal-50 transition-colors shadow-sm">
                  <UploadCloud size={28} color={C.teal} className="mb-2"/>
                  <span className="font-bold text-sm" style={{ color: C.blue }}>Upload Government ID (Aadhar/PAN)</span>
                  <span className="text-xs text-slate-400 mt-1">Images only (JPG, PNG)</span>
                </div>
                
                <div className="w-full border-2 border-dashed border-slate-300 bg-white rounded-2xl p-5 flex flex-col items-center justify-center cursor-pointer hover:border-teal-400 hover:bg-teal-50 transition-colors shadow-sm">
                  <FileBadge size={28} color={C.teal} className="mb-2"/>
                  <span className="font-bold text-sm" style={{ color: C.blue }}>Upload Course Certificate</span>
                  <span className="text-xs text-slate-400 mt-1">Images or PDFs (Max 5MB)</span>
                </div>
              </div>
            )}
          </div>

          <motion.button whileTap={{ scale: 0.95 }} 
            onClick={isRegistering ? handleRegisterSubmit : handleLoginSubmit}
            disabled={isLoading}
            className="w-full py-4 rounded-2xl text-white font-black text-base shadow-lg mb-6 flex items-center justify-center gap-2"
            style={{ 
              background: `linear-gradient(135deg, ${C.teal}, #0F766E)`, 
              boxShadow: `0 8px 24px ${C.teal}40`,
              opacity: isLoading ? 0.7 : 1
            }}>
            {isRegistering ? (isLoading ? "Submitting..." : "Submit Application") : (isLoading ? "Authenticating..." : "Log In")}
          </motion.button>

          <p className="text-center text-sm font-bold text-slate-500 hover:text-slate-800 cursor-pointer transition-colors"
             onClick={() => setIsRegistering(!isRegistering)}>
            {isRegistering ? "Already have an account? Log In" : "New to Quick Med Support? Apply as a Technician"}
          </p>
          
          {isRegistering && <div className="h-10 w-full flex-shrink-0" />}
        </div>
      </div>
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// DEMO ENTRY SCREEN
// ═══════════════════════════════════════════════════════════════════════════════
const DemoLoginScreen = ({ onLogin }) => (
  <div className="flex flex-col items-center justify-center min-h-screen w-full relative overflow-hidden shadow-2xl"
    style={{ background: "#060D1A" }}>
    
    {/* Background Shapes */}
    <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-10"
      style={{ background: `radial-gradient(circle, ${C.teal} 0%, transparent 70%)` }}/>
    <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full opacity-10"
      style={{ background: `radial-gradient(circle, ${C.amber} 0%, transparent 70%)` }}/>
    
    <div className="relative z-10 flex flex-col items-center w-full px-8">
      {/* Logo Area */}
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mb-10 flex flex-col items-center">
        <div className="w-20 h-20 rounded-[1.75rem] flex items-center justify-center shadow-2xl mb-6 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, white, #E2E8F0)" }}>
          <div className="absolute bottom-0 left-0 right-0 h-4" style={{ background: C.teal }}></div>
          <svg width="34" height="34" viewBox="0 0 16 16" fill="none" className="relative z-10">
            <path d="M8 2v12M2 8h12" stroke={C.blue} strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        </div>
        <h1 className="text-4xl font-black text-white tracking-tight" style={{ fontFamily: F.head }}>
          Quick Med Support
        </h1>
        <p className="text-slate-400 mt-2 text-center text-sm font-medium leading-relaxed max-w-[260px]">
          The emergency staffing platform for healthcare.
        </p>
      </motion.div>

      {/* Buttons */}
      <div className="w-full flex flex-col gap-4 mt-8">
        <motion.button 
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          onClick={() => window.location.hash = "#phase16"}
          className="w-full rounded-[1.25rem] p-5 text-left relative overflow-hidden border border-white/10"
          style={{ background: `linear-gradient(135deg, ${C.blue}, #0F2744)`, boxShadow: `0 12px 32px ${C.blue}40` }}>
          <div className="absolute right-0 top-0 bottom-0 w-24 opacity-10 bg-gradient-to-l from-white to-transparent pointer-events-none"/>
          <div className="flex items-center justify-between mb-2">
            <span className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-md text-red-500 bg-red-500/10" style={{ fontFamily: F.mono }}>
              Urgent Request
            </span>
            <ArrowUpRight size={18} color="rgba(255,255,255,0.4)" />
          </div>
          <h2 className="text-white text-xl font-black tracking-tight" style={{ fontFamily: F.head }}>
            I Need a Technician
          </h2>
          <p className="text-white/60 text-xs mt-1">Login as Hospital Manager</p>
        </motion.button>

        <motion.button 
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          onClick={() => {
            localStorage.setItem('medshift_role', 'technician');
            onLogin("technician", true); // Pass 'true' for isGuest
          }}
          className="w-full rounded-[1.25rem] p-5 text-left relative overflow-hidden border border-white/10 mt-1"
          style={{ background: `linear-gradient(135deg, ${C.teal}, #0B736A)`, boxShadow: `0 12px 32px ${C.teal}40` }}>
          <div className="absolute right-0 top-0 bottom-0 w-24 opacity-10 bg-gradient-to-l from-white to-transparent pointer-events-none"/>
          <div className="flex justify-end mb-2">
            <ArrowUpRight size={18} color="rgba(255,255,255,0.4)" />
          </div>
          <h2 className="text-white text-xl font-black tracking-tight -mt-4 lg:mt-0" style={{ fontFamily: F.head }}>
            I'm a Technician
          </h2>
          <p className="text-white/60 text-xs mt-1">Find high-paying shifts</p>
        </motion.button>
      </div>

      <motion.p 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
        className="text-slate-500 text-[10px] font-medium mt-12 mb-6" style={{ fontFamily: F.mono }}>
        © 2026 MedShift Technologies
      </motion.p>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// CREATE MENU BOTTOM SHEET (Dual-Action)
// ═══════════════════════════════════════════════════════════════════════════════
const CreateMenuSheet = ({ open, onClose, onSelectCommunity, onSelectShift }) => (
  <AnimatePresence>
    {open && (
      <>
        <motion.div
          className="absolute inset-0 z-[60] bg-black/40 backdrop-blur-sm"
          initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
          onClick={onClose}/>

        <motion.div
          className="absolute bottom-0 left-0 right-0 z-[70] flex flex-col rounded-t-3xl overflow-hidden shadow-2xl p-6"
          style={{ background: C.card }}
          initial={{ y:"100%" }} animate={{ y:0 }} exit={{ y:"100%" }}
          transition={{ type:"spring", stiffness:340, damping:38 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-black text-xl" style={{ color:C.blue, fontFamily:F.head }}>
              Create New...
            </h2>
            <button onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 transition-colors hover:bg-slate-200">
              <X size={16} color={C.blue}/>
            </button>
          </div>

          <div className="flex flex-col gap-4 mb-4">
            <motion.button 
              whileTap={{ scale: 0.96 }}
              onClick={() => { onClose(); onSelectShift(); }}
              className="w-full rounded-[1.25rem] p-5 text-left relative overflow-hidden border border-amber-100"
              style={{ background: `linear-gradient(135deg, ${C.amber}, #D97706)`, boxShadow: `0 12px 24px ${C.amber}40` }}>
              <div className="absolute right-0 top-0 bottom-0 w-24 opacity-10 bg-gradient-to-l from-white to-transparent pointer-events-none"/>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-md text-amber-600 bg-white/90 shadow-sm" style={{ fontFamily: F.mono }}>
                  Instant Hire
                </span>
                <ArrowUpRight size={18} color="rgba(255,255,255,0.6)" />
              </div>
              <h3 className="text-white text-xl font-black tracking-tight" style={{ fontFamily: F.head }}>
                Post a Shift
              </h3>
              <p className="text-white/80 text-xs mt-1">Hire a technician immediately</p>
            </motion.button>

            <motion.button 
              whileTap={{ scale: 0.96 }}
              onClick={() => { onClose(); onSelectCommunity(); }}
              className="w-full rounded-[1.25rem] p-5 text-left relative overflow-hidden border border-teal-100"
              style={{ background: `linear-gradient(135deg, ${C.teal}, #0F766E)`, boxShadow: `0 12px 24px ${C.teal}30` }}>
              <div className="absolute right-0 top-0 bottom-0 w-24 opacity-10 bg-gradient-to-l from-white to-transparent pointer-events-none"/>
              <div className="flex justify-end mb-2">
                <ArrowUpRight size={18} color="rgba(255,255,255,0.6)" />
              </div>
              <h3 className="text-white text-xl font-black tracking-tight -mt-4 lg:mt-0" style={{ fontFamily: F.head }}>
                Community Post
              </h3>
              <p className="text-white/80 text-xs mt-1">Share news, updates, or articles</p>
            </motion.button>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

// ROOT APP
// ═══════════════════════════════════════════════════════════════════════════════
const GuestAboutCard = () => {

  return (
    <div style={{ padding: '16px 16px 8px', fontFamily: '"DM Sans", sans-serif' }}>
      <style>{`
        .guest-glass-card {
          position: relative; border-radius: 20px; background: rgba(7, 25, 55, 0.94);
          backdrop-filter: blur(20px) saturate(1.6); -webkit-backdrop-filter: blur(20px) saturate(1.6);
          border: 1px solid rgba(255, 255, 255, 0.13); padding: 16px;
          box-shadow: 0 10px 24px rgba(0,0,0,0.35), 0 0 0 0.5px rgba(255,255,255,0.06) inset;
        }
        .guest-glass-card::before {
          content: ''; position: absolute; top: 0; left: 10%; right: 10%; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.32), transparent);
        }
        .guest-badge { display: flex; align-items: center; gap: 6px; font-family: 'Syne', sans-serif; font-size: 8.5px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: #5eead4; margin-bottom: 10px; }
        .guest-badge-dot { width: 4px; height: 4px; border-radius: 50%; background: #0d9488; box-shadow: 0 0 6px 2px #0d9488; animation: pulse 2s infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        .guest-logo-row { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
        .guest-logo-icon { width: 28px; height: 28px; border-radius: 8px; background: linear-gradient(135deg, #0d9488, #0891b2); display: flex; align-items: center; justify-content: center; }
        .guest-logo-name { font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 800; color: #fff; }
        .guest-logo-name span { color: #2dd4bf; }
        .guest-body-text { font-size: 11.5px; line-height: 1.45; color: rgba(255,255,255,0.85); margin-bottom: 12px; font-weight: 300; }
        .guest-stats-row { display: flex; justify-content: space-between; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.08); margin-bottom: 16px; }
        .guest-stat-num { font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 800; color: #fff; }
        .guest-stat-label { font-size: 7.5px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(255,255,255,0.45); }
        .guest-bottom-row { display: flex; justify-content: space-between; align-items: center; }
        .guest-btn-read { padding: 8px 16px; border-radius: 50px; background: linear-gradient(135deg, #0d9488, #0891b2); color: #fff; font-size: 11px; font-weight: 600; text-decoration: none; border: none; }
        .guest-founder-wrap { display: flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.05); padding: 4px 10px 4px 4px; border-radius: 40px; border: 1px solid rgba(255,255,255,0.08); }
        .guest-founder-avatar { width: 28px; height: 28px; border-radius: 50%; overflow: hidden; }
        .guest-founder-avatar img { width: 100%; height: 100%; object-fit: cover; }
        .guest-founder-text { display: flex; flex-direction: column; gap: 1px; }
        .guest-founder-role { font-size: 6.5px; font-weight: 700; color: #2dd4bf; text-transform: uppercase; }
        .guest-founder-name { font-family: 'Syne', sans-serif; font-size: 10.5px; font-weight: 700; color: #fff; }
      `}</style>

      {/* Outer Wrapper: Handles ONLY the entry pop-up */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        style={{ willChange: "transform, opacity" }} // Hardware acceleration
      >
        {/* Inner Wrapper: Handles ONLY the infinite float */}
        <motion.div
          className="guest-glass-card"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
          style={{ willChange: "transform" }} // Hardware acceleration for the heavy blur
        >
        <div className="guest-badge"><span className="guest-badge-dot" />About Us</div>
        <div className="guest-logo-row">
          <div className="guest-logo-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
          </div>
          <div className="guest-logo-name">Quick<span>Med</span> Support</div>
        </div>
        <p className="guest-body-text"><strong>Quick Med Support</strong> is an on-demand, real-time staffing platform designed exclusively for healthcare facilities. It solves the <strong>critical problem of sudden staffing shortages</strong> by instantly bridging the gap between hospitals and qualified healthcare professionals.</p>
        <div className="guest-stats-row">
          <div><div className="guest-stat-num">2.4<span style={{color:'#2dd4bf'}}>K+</span></div><div className="guest-stat-label">Professionals</div></div>
          <div><div className="guest-stat-num">98<span style={{color:'#2dd4bf'}}>%</span></div><div className="guest-stat-label">Match Rate</div></div>
          <div><div className="guest-stat-num">&lt;15<span style={{color:'#2dd4bf'}}>m</span></div><div className="guest-stat-label">Avg. Fill Time</div></div>
        </div>
        <div className="guest-bottom-row">
          <motion.a href="#" className="guest-btn-read" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} animate={{ y: [0, -2, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }} style={{ willChange: "transform" }}>Read More</motion.a>
          <motion.div className="guest-founder-wrap" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0, y: [0, -3, 0] }} transition={{ y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }, opacity: { duration: 0.5 }, x: { type: "spring", stiffness: 200, damping: 22, delay: 0.2 } }} style={{ willChange: "transform" }}>
            <div className="guest-founder-avatar"><img src="/assets/lakhan.jpeg" alt="Dr. Lakhan Thakare" /></div>
            <div className="guest-founder-text">
              <div className="guest-founder-role">Founder & CEO</div>
              <div className="guest-founder-name">Dr. Lakhan Thakare</div>
              <div style={{fontSize: '8px', color: 'rgba(255,255,255,0.45)'}}>X-Ray Specialist</div>
            </div>
          </motion.div>
        </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default function MedShiftFull() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [showTechAuth, setShowTechAuth] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [editTechProfileOpen, setEditTechProfileOpen] = useState(false);
  const [techAuthMode, setTechAuthMode] = useState("login");
  const [isDark, setIsDark] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const handleRequireAuth = (mode = "login") => {
    setTechAuthMode(mode);
    setShowTechAuth(true);
  };

  const toggleAvailability = async () => {
    if (isGuest || !currentUser?.id) { handleRequireAuth(); return; }
    const newState = !isAvailable;
    setIsAvailable(newState); // Optimistic UI update
    try {
      const res = await fetch(`${API_BASE}/api/technician/${currentUser.id}/availability`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_available: newState })
      });
      if (!res.ok) throw new Error("Failed to update status");
      // Update local context
      const updatedUser = { ...currentUser, is_available: newState };
      setCurrentUser(updatedUser);
      localStorage.setItem("medshift_user", JSON.stringify(updatedUser));
    } catch (e) {
      console.error(e);
      setIsAvailable(!newState); // Revert on failure
      alert("Network error: Could not update availability.");
    }
  };

  const handleUpdateTechProfile = async (formData) => {
    try {
      const res = await fetch(`${API_BASE}/api/technician/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: formData.fullName,
          mobile_number: formData.mobile,
          bio: formData.bio,
          specialty: formData.specialty,
          machine_skills: formData.machineSkills,
          certifications_list: formData.certifications,
          experience_years: formData.experience ? parseInt(formData.experience) : null,
          country: formData.country,
          state: formData.state,
          district: formData.district,
          city: formData.city,
          home_address: formData.address
        })
      });
      if (res.ok) {
        const data = await res.json();
        const updatedUser = {
          ...currentUser,
          ...data.profile,
        };
        setCurrentUser(updatedUser);
        localStorage.setItem("medshift_user", JSON.stringify(updatedUser));
        setEditTechProfileOpen(false);
      } else {
        alert("Failed to update profile.");
      }
    } catch (e) {
      console.error("Update error:", e);
      alert("Network error updating profile.");
    }
  };

  const handleUpdateManagerProfile = async (formData) => {
    try {
      const res = await fetch(`${API_BASE}/api/dashboard/manager/profile?manager_id=${currentUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: formData.fullName,
          mobile_number: formData.mobile,
          job_title: formData.role,
          hospital_name: formData.hospitalName,
          hospital_address: formData.hospitalLocation,
          facilities: formData.facilities,
          certifications: formData.certifications
        })
      });
      if (res.ok) {
        const data = await res.json();
        const updatedUser = {
          ...currentUser,
          full_name: data.profile.name,
          hospital: data.profile.hospital_name,
          area: data.profile.hospital_area,
          job_title: data.profile.role,
          mobile_number: formData.mobile,
          facilities: formData.facilities,
          certifications: formData.certifications
        };
        setCurrentUser(updatedUser);
        localStorage.setItem("medshift_user", JSON.stringify(updatedUser));
        setEditProfileOpen(false);
      } else {
        alert("Failed to update profile.");
      }
    } catch (e) {
      console.error("Update error:", e);
      alert("Network error updating profile.");
    }
  };
  
  const [role,       setRole]       = useState(null);
  const [activeTab,  setActiveTab]  = useState("home");
  const [notifOpen,  setNotifOpen]  = useState(false);
  const [unread,     setUnread]     = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [selectedShiftForApplicants, setSelectedShiftForApplicants] = useState(null);

  useEffect(() => {
    const savedRole = localStorage.getItem('medshift_role');
    const savedUser = localStorage.getItem('medshift_user');
    
    if (savedRole && savedUser) {
      setRole(savedRole);
      try {
        const parsedUser = JSON.parse(savedUser);
        setCurrentUser(parsedUser);
        setIsAvailable(parsedUser.is_available || false);
      } catch(e) {}
      setIsAuthenticated(true);
      setActiveTab("home");
    } else {
      setIsAuthenticated(false);
      setCurrentUser(null);
      setRole(savedRole || "technician");
      setActiveTab("home");
    }
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);
  
  // Phase 6 addition
  const [posts, setPosts] = useState([]);
  const [managerShifts, setManagerShifts] = useState([]);
  const [techShifts, setTechShifts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInboxOpen, setIsInboxOpen] = useState(false);
  const [inboxMessages, setInboxMessages] = useState([]);
  const [isTechInboxOpen, setIsTechInboxOpen] = useState(false);
  const [techInboxMessages, setTechInboxMessages] = useState([]);

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return "Just now";
  };

  const fetchCommunityPosts = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/community/posts`);
      if (res.ok) {
        const data = await res.json();
        const mappedPosts = data.map(post => ({
          id: post.id,
          type: "post",
          author: post.author,
          initials: post.initials,
          role: post.role,
          avatarColor: C.blue,
          time: timeAgo(post.created_at),
          verified: true,
          body: post.content,
          hasImage: !!post.image_url,
          imageType: post.image_url === "mri" ? "mri" : null,
          likes: 0,
          comments: 0,
          shares: 0,
          liked: false,
        }));
        setPosts(mappedPosts);
      }
    } catch (err) {
      console.error("Failed to fetch community posts", err);
    }
  };

  const fetchAvailableShifts = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/shifts/available`);
      if (res.ok) {
        const data = await res.json();
        const mappedShifts = data.map(s => ({
          id: s.id,
          title: s.title,
          time: new Date(s.start_time).toLocaleString(undefined, {
            month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit'
          }),
          pay: "₹" + s.hourly_rate + "/hr",
          status: s.status,
          statusLabel: s.status === 'searching' ? 'Searching…' : s.status,
          color: s.is_urgent ? C.amber : C.teal,
          icon: ScanLine,
          dept: s.department,
          duration: s.duration + " hrs",
          totalEst: "₹" + (s.hourly_rate * s.duration),
          hospital: s.hospital,
          distance: "2.5 km",
          equipment: s.title,
          urgent: s.is_urgent
        }));
        setTechShifts(mappedShifts);
        setManagerShifts(mappedShifts);
      }
    } catch (err) {
      console.error("Failed to fetch shifts", err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchCommunityPosts();
      fetchAvailableShifts();
    }
  }, [isAuthenticated]);

  const fetchManagerData = async () => {
    if (!currentUser?.id) return;
    setIsLoading(true);
    // Fetch shifts and inbox messages in parallel
    const [shiftsRes, msgRes] = await Promise.allSettled([
      fetch(`${API_BASE}/api/dashboard/manager?manager_id=${currentUser.id}`),
      fetch(`${API_BASE}/api/messages/manager/${currentUser.id}`),
    ]);

    if (shiftsRes.status === "fulfilled" && shiftsRes.value.ok) {
      const data = await shiftsRes.value.json();
      if (data.posted_shifts) {
        const formattedShifts = data.posted_shifts.map(s => ({
          ...s,
          id: s.id,
          title: s.title,
          time: new Date(s.start_time).toLocaleString(undefined, {
            month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit'
          }),
          pay: "₹" + s.hourly_rate + "/hr",
          status: s.status,
          statusLabel: s.status === 'searching' ? 'Searching…' : s.status,
          color: C.amber,
          icon: ScanLine,
          dept: s.department,
          duration: s.duration + " hrs",
          totalEst: "₹" + (s.hourly_rate * s.duration)
        }));
        setManagerShifts(formattedShifts);
      }
    }

    if (msgRes.status === "fulfilled" && msgRes.value.ok) {
      const msgs = await msgRes.value.json();
      setInboxMessages(Array.isArray(msgs) ? msgs : []);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    if (role === "manager" && isAuthenticated && currentUser?.id) {
      fetchManagerData();
    } else if (role === "technician" && isAuthenticated && currentUser?.id) {
      // Fetch tech inbox messages in background
      fetch(`${API_BASE}/api/messages/technician/${currentUser.id}`)
        .then((r) => r.json())
        .then((msgs) => setTechInboxMessages(Array.isArray(msgs) ? msgs : []))
        .catch(() => {});
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [role, isAuthenticated]);

  // Real-time Notifications & History
  useEffect(() => {
    if (!isAuthenticated || !currentUser?.id) return;

    // Step A: HTTP Fallback (Fetch History)
    const fetchHistory = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/notifications/${currentUser.id}`);
        if (res.ok) {
          const data = await res.json();
          // Map to frontend format if needed (Backend returns: id, title, body, icon, color, is_read, created_at)
          const mapped = data.map(n => ({
            ...n,
            read: n.is_read,
            time: timeAgo(n.created_at),
            tag: n.tag || "Notif"
          }));
          setNotifications(mapped);
          setUnread(mapped.filter(n => !n.read).length);
        }
      } catch (err) {
        console.error("Failed to fetch notification history", err);
      }
    };
    fetchHistory();

    const handleInAppNotif = () => fetchHistory();
    window.addEventListener('medshift-notification-received', handleInAppNotif);

    // Step B: WebSocket
    let socket;
    let reconnectTimeout;
    let destroyed = false; // guard against reconnect after unmount

    const connectWS = () => {
      if (destroyed) return; // don't reconnect if component unmounted

      const wsProtocol = API_BASE.startsWith("https") ? "wss:" : "ws:";
      // Support both local and prod URL logic
      const host = API_BASE.replace(/^https?:\/\//, "");
      const wsUrl = `${wsProtocol}//${host}/ws/notifications/${currentUser.id}`;
      
      socket = new WebSocket(wsUrl);

      socket.onmessage = (event) => {
        try {
          const newNotif = JSON.parse(event.data);
          const frontendNotif = {
            ...newNotif,
            read: false,
            time: "Just now",
            tag: newNotif.tag || "New"
          };
          setNotifications(prev => [frontendNotif, ...prev]);
          setUnread(prev => prev + 1);
        } catch (e) {
          console.error("Error parsing WS message — skipping:", e);
          // Single bad message is swallowed; listener stays alive
        }
      };

      socket.onclose = () => {
        if (!destroyed) {
          reconnectTimeout = setTimeout(connectWS, 3000); // Auto-Reconnect only when alive
        }
      };

      socket.onerror = (err) => {
        console.error("WebSocket error:", err);
        socket.close(); // triggers onclose → reconnect (if not destroyed)
      };
    };

    connectWS();

    return () => {
      destroyed = true; // stop reconnect loop on unmount
      if (socket) socket.close();
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      window.removeEventListener('medshift-notification-received', handleInAppNotif);
    };

  }, [isAuthenticated, currentUser?.id]);
  const [createMenuOpen, setCreateMenuOpen] = useState(false);
  const [createPostOpen, setCreatePostOpen] = useState(false);
  const [createShiftOpen, setCreateShiftOpen] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [selectedTechnician, setSelectedTechnician] = useState(null);
  const [callingUser, setCallingUser] = useState(null);

  const handleRefresh = async () => {
    // 1. Fire off the actual data fetches in the background (DO NOT await them here)
    if (isAuthenticated) {
      fetchCommunityPosts();
      fetchAvailableShifts();
      if (role === "manager" && currentUser?.id) {
        fetchManagerData();
      }
    }

    // 2. Force the UI spinner to hide after exactly 1.5 seconds
    await new Promise(resolve => setTimeout(resolve, 1500));
  };

  const handleLogout = () => {
    localStorage.removeItem("medshift_role");
    localStorage.removeItem("medshift_user");
    setIsAuthenticated(false);
    setActiveTab("home");
    setRole("technician");
    setCurrentUser(null);
  };

  const handleCompleteShift = async (shiftId) => {
    try {
      const res = await fetch(`${API_BASE}/api/shifts/${shiftId}/complete`, { method: "PUT" });
      if (res.ok) {
        setManagerShifts(prev => prev.map(s => s.id === shiftId ? { ...s, status: "completed", statusLabel: "Completed", color: C.green } : s));
      }
    } catch(err) { console.error("Error completing shift", err); }
  };

  const handleArchiveShift = async (shiftId) => {
    if (!window.confirm("Archive this shift? It will be removed from your active dashboard view.")) return;
    try {
      const res = await fetch(`${API_BASE}/api/shifts/${shiftId}/archive`, { method: "PUT" });
      if (res.ok) {
        setManagerShifts(prev => prev.map(s => s.id === shiftId ? { ...s, status: "archived", statusLabel: "Archived" } : s));
      }
    } catch(err) { console.error("Error archiving shift", err); }
  };

  const handleCancelShift = async (shiftId) => {
    if (!window.confirm("Are you sure you want to cancel this shift?")) return;
    if (!window.confirm("WARNING: This action cannot be undone. Permanently cancel this shift?")) return;
    try {
      const res = await fetch(`${API_BASE}/api/shifts/${shiftId}/cancel`, { method: "PUT" });
      if (res.ok) {
        setManagerShifts(prev => prev.map(s => s.id === shiftId ? { ...s, status: "cancelled", statusLabel: "Cancelled", color: "#94A3B8" } : s));
      }
    } catch(err) { console.error("Error cancelling shift", err); }
  };

  // Phase 2 Hardware Back Button
  useEffect(() => {
    const handleBackButton = () => {
      if (createPostOpen) {
        setCreatePostOpen(false);
      } else if (createShiftOpen) {
        setCreateShiftOpen(false);
      } else if (createMenuOpen) {
        setCreateMenuOpen(false);
      } else if (notifOpen) {
        setNotifOpen(false);
      } else if (activeTab !== "home") {
        setActiveTab("home");
      } else {
        CapacitorApp.exitApp();
      }
    };
    
    CapacitorApp.addListener('backButton', handleBackButton);
    return () => {
      CapacitorApp.removeAllListeners();
    };
  }, [createPostOpen, createShiftOpen, createMenuOpen, notifOpen, activeTab]);

  const handleCreatePost = async (text) => {
    if (!currentUser || !currentUser.id) {
      alert("Session error: User ID missing. Please log in again.");
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/api/community/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text, author_id: currentUser.id })
      });
      if (!res.ok) throw new Error("Failed to create post");
      
      const data = await res.json();
      
      const newPost = {
        id: data.id,
        type: "post",
        author: currentUser?.full_name || "Unknown User",
        initials: currentUser?.full_name ? currentUser.full_name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2) : "U",
        role: currentUser?.role === "manager" ? "Hospital Manager" : "Medical Technician",
        avatarColor: role === "manager" ? C.blue : C.teal,
        time: "Just now",
        verified: true,
        body: data.content,
        hasImage: false,
        likes: 0,
        comments: 0,
        shares: 0,
        liked: false,
      };
      setPosts([newPost, ...posts]);
      setCreatePostOpen(false);
      setActiveTab("community");
    } catch (err) {
      console.error(err);
      // Fallback local update if backend fails
      alert("Backend unreachable. Reverting to local state.");
    }
  };

  const handleCreateShift = async ({ title, roleType, payAmount, payPeriod, dateSelection, customDate, time, urgent }) => {
    if (!currentUser?.id) return alert("Please log in again to create a shift.");
    try {
      // Build start_time from the form's date + time fields
      const today = new Date();
      let baseDate = new Date(today);
      if (dateSelection === "Tomorrow") {
        baseDate.setDate(baseDate.getDate() + 1);
      } else if (dateSelection === "Custom" && customDate) {
        baseDate = new Date(customDate);
      }
      const [hours, minutes] = (time || "16:00").split(":").map(Number);
      baseDate.setHours(hours, minutes, 0, 0);
      const startTime = baseDate;
      const endTime = new Date(startTime.getTime() + 8 * 60 * 60 * 1000); // 8 hours later

      const res = await fetch(`${API_BASE}/api/shifts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          manager_id: currentUser.id,
          title,
          hourly_rate: Number(payAmount) || 0,
          is_urgent: urgent,
          start_time: startTime.toISOString(),
          end_time: endTime.toISOString(),
          department: roleType || "General"
        })
      });
      if (!res.ok) throw new Error("Failed to create shift");
      
      const s = await res.json();
      
      const newManagerShift = {
        id: s.id,
        title: s.title,
        time: "Today, Just Now",
        pay: "₹" + s.hourly_rate,
        status: s.status,
        statusLabel: "Searching…",
        color: C.amber,
        icon: ScanLine,
        dept: s.department,
        duration: s.duration + " hrs",
        totalEst: "₹" + (s.hourly_rate * s.duration),
      };
      
      setManagerShifts([newManagerShift, ...managerShifts]);
      
      const newTechShift = { ...newManagerShift, hospital: currentUser?.hospital || "Hospital", distance: "2.5 km", equipment: title };
      setTechShifts([newTechShift, ...techShifts]);
      
      setCreateShiftOpen(false);
      setActiveTab("home");
    } catch (err) {
      console.error(err);
      alert("Backend unreachable. Reverting to local state.");
    }
  };

  const handleApplyShift = async (shiftId) => {
    if (!currentUser || !currentUser.id) { alert("Please log in again."); return false; }
    try {
      const res = await fetch(`${API_BASE}/api/technician/shifts/${shiftId}/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ technician_id: currentUser.id })
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.detail || "Failed to apply");
      }
      alert("Applied successfully! The manager will review your application.");
      return true;
    } catch (err) {
      alert(err.message || "Failed to apply.");
      return false;
    }
  };

  // Dynamic notifications state used here

  // Demo Login Gateway
  if (!isAuthenticated) {
    return (
      <div className="h-[100dvh] w-full flex flex-col justify-center" style={{ background:"#000" }}>
        <style>{FONTS}{`
          *{-webkit-tap-highlight-color:transparent;box-sizing:border-box;}
          body { background: #000; margin: 0; }
        `}</style>
        <div className="relative shadow-2xl overflow-y-auto" style={{ width: "100%", flex: 1 }}>
          <DemoLoginScreen onLogin={(r, guest = false) => {
            setRole(r);
            setActiveTab("home");
            setUnread(3);
            setIsGuest(guest);
            setIsAuthenticated(true);
          }} />
        </div>
      </div>
    );
  }

  const renderTab = () => {
    switch (activeTab) {
      case "home": {
        const unreadMessageCount = inboxMessages.filter(m => !m.is_read).length;
        const totalMessageCount = inboxMessages.length;
        const unreadTechCount = techInboxMessages.filter(m => !m.is_read).length;
        const totalTechCount = techInboxMessages.length;
        return role === "manager"
          ? <ManagerDashboard shifts={managerShifts} onCreateShift={() => setCreateShiftOpen(true)} onViewProfileClick={(tech) => role === 'manager' && setSelectedTechnician(tech || true)} onCompleteShift={handleCompleteShift} onCancelShift={handleCancelShift} onArchiveShift={handleArchiveShift} currentUser={currentUser} onViewApplicants={(shift) => setSelectedShiftForApplicants(shift)} onInboxClick={() => setIsInboxOpen(true)} unreadMessageCount={unreadMessageCount} totalMessageCount={totalMessageCount} />
          : <TechRadar shifts={techShifts} onHospitalClick={(name) => role === 'technician' && setSelectedHospital(name)} isGuest={isGuest} onRequireAuth={handleRequireAuth} currentUser={currentUser} onApplyShift={handleApplyShift} isAvailable={isAvailable} toggleAvailability={toggleAvailability} unreadTechCount={unreadTechCount} totalTechCount={totalTechCount} onInboxClick={() => setIsTechInboxOpen(true)} />;
      }
      case "shifts":    return <ShiftsTab role={role} managerShifts={managerShifts} techShifts={techShifts} isGuest={isGuest} onRequireAuth={handleRequireAuth} currentUser={currentUser}/>;
      case "community": return <CommunityFeed posts={posts} onAuthorClick={(name) => role === 'technician' && setSelectedHospital(name)} />;
      case "profile":
        return role === "manager" ? (
          <div className="flex flex-col flex-1 h-full gap-6 w-full">
            <ManagerProfile onLogout={handleLogout} currentUser={currentUser} onEditClick={() => setEditProfileOpen(true)} />
            <div className="mx-1 mt-2 pt-6 border-t border-slate-200">
              <h3 className="text-xs font-black mb-3 px-4 uppercase tracking-widest" style={{ fontFamily:F.head, color:"#0D9488" }}>Finance & Payments</h3>
              <ManagerFinance hospital={currentUser?.hospital || "Hospital"}/>
            </div>
          </div>
        ) : (
          <div className="flex flex-col flex-1 h-full gap-6 w-full">
            <TechProfile onLogout={handleLogout} isGuest={isGuest} onRequireAuth={handleRequireAuth} currentUser={currentUser} onEditClick={() => setEditTechProfileOpen(true)} />
            {!isGuest && (
              <div className="mx-1 mt-2 pt-6 border-t border-slate-200">
                <h3 className="text-xs font-black mb-3 px-4 uppercase tracking-widest" style={{ fontFamily:F.head, color:"#0D9488" }}>Wallet & Earnings</h3>
                <TechWallet/>
              </div>
            )}
          </div>
        );
      default:          return null;
    }
  };

  return (
    <div className="flex flex-col h-[100dvh] overflow-hidden overscroll-y-contain max-w-[480px] mx-auto w-full relative"
      style={{ fontFamily:F.head, background: "var(--c-pearl)", color: "var(--c-text-main)" }}>
      <style>{FONTS}{`
        *{-webkit-tap-highlight-color:transparent;box-sizing:border-box;}
        body { background: var(--c-pearl); color: var(--c-text-main); margin: 0; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <TopHeader
        role={role}
        onBellClick={() => setNotifOpen(true)}
        unreadCount={unread}
        isDark={isDark}
        toggleDark={() => setIsDark(!isDark)}
        isGuest={isGuest}
        isAvailable={isAvailable}
        toggleAvailability={toggleAvailability}
      />

      {/* Main content area */}
      <main className="flex-1 overflow-y-auto pt-0 pb-0 overscroll-y-contain scrollbar-hide px-3 w-full bg-transparent">
          <PullToRefresh onRefresh={handleRefresh}>
            <AnimatePresence mode="wait">
              <motion.div key={activeTab + role}
                className="flex flex-col flex-1 w-full min-h-[calc(100vh-100px)] bg-transparent scrollbar-hide"
                initial={{ opacity:0, x:16 }}
                animate={{ opacity:1, x:0 }}
                exit={{ opacity:0, x:-16 }}
                transition={{ duration:0.2 }}>
                {renderTab()}
              </motion.div>
            </AnimatePresence>
          </PullToRefresh>
        </main>

        <BottomNav active={activeTab} setActive={setActiveTab} role={role} onAddClick={() => role === "manager" ? setCreateMenuOpen(true) : setCreatePostOpen(true)} isGuest={isGuest} onRequireAuth={handleRequireAuth}/>

        {/* Notification Panel — Phase 12 */}
        <NotificationCenter
          open={notifOpen}
          onClose={() => setNotifOpen(false)}
          notifications={notifications}
          onMarkAll={() => setUnread(0)}
        />

        {/* Manager Quick Inbox Modal */}
        <QuickInboxModal
          open={isInboxOpen}
          onClose={() => setIsInboxOpen(false)}
          managerId={currentUser?.id}
          apiBase={API_BASE}
        />

        {/* Technician Quick Inbox Modal */}
        <TechQuickInboxModal
          open={isTechInboxOpen}
          onClose={() => setIsTechInboxOpen(false)}
          techId={currentUser?.id}
          apiBase={API_BASE}
        />

        {/* Create Menu Sheet (Manager Dual Option) */}
        <CreateMenuSheet
          open={createMenuOpen}
          onClose={() => setCreateMenuOpen(false)}
          onSelectCommunity={() => setCreatePostOpen(true)}
          onSelectShift={() => setCreateShiftOpen(true)}
        />

        {/* Create Shift Sheet */}
        <CreateShiftSheet
          open={createShiftOpen}
          onClose={() => setCreateShiftOpen(false)}
          onSubmit={handleCreateShift}
        />

        <CreatePostSheet
          open={createPostOpen}
          onClose={() => setCreatePostOpen(false)}
          onSubmit={handleCreatePost}
          currentUser={currentUser}
        />

        <AnimatePresence>
          {selectedHospital && role === 'technician' && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[99999]" style={{ width: '100%', height: '100%' }}>
              <HospitalProfile onBack={() => setSelectedHospital(null)} onCall={() => setCallingUser(selectedHospital)} />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {selectedTechnician && role === 'manager' && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[99999]" style={{ width: '100%', height: '100%' }}>
              <TechnicianProfile onBack={() => setSelectedTechnician(null)} onCall={() => setCallingUser(selectedTechnician)} />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {callingUser && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[999999]" style={{ width: '100%', height: '100%' }}>
              <CallingScreen 
                callee={typeof callingUser === 'string' && callingUser !== true ? callingUser : "Quick Med Support Contact"} 
                onEnd={() => setCallingUser(null)} 
              />
            </motion.div>
          )}
        </AnimatePresence>

        <EditManagerProfileSheet 
          open={editProfileOpen} 
          onClose={() => setEditProfileOpen(false)} 
          currentUser={currentUser} 
          onSubmit={handleUpdateManagerProfile} 
        />

        <EditTechProfileSheet 
          open={editTechProfileOpen} 
          onClose={() => setEditTechProfileOpen(false)} 
          currentUser={currentUser} 
          onSubmit={handleUpdateTechProfile} 
        />

        <AnimatePresence>
          {showTechAuth && (
            <TechAuthScreen 
              initialMode={techAuthMode}
              onClose={() => setShowTechAuth(false)}
              onSuccess={(data) => {
                setShowTechAuth(false);
                setIsGuest(false);
                
                // Handle both `data` and `data.user` depending on login vs register payloads
                const userObj = data.user ? data.user : data;

                if (userObj && userObj.id) {
                  const newUserState = { 
                    id: userObj.id, 
                    full_name: userObj.full_name, 
                    role: userObj.role,
                    email: userObj.email,
                    is_available: userObj.is_available || false
                  };
                  setCurrentUser(newUserState);
                  setIsAvailable(newUserState.is_available);
                  localStorage.setItem("medshift_user", JSON.stringify(newUserState));
                  localStorage.setItem("medshift_role", userObj.role);
                } else {
                  setCurrentUser({ full_name: "Verified Technician" });
                }
              }}
            />
          )}
        </AnimatePresence>

        <ApplicantsModal 
          open={!!selectedShiftForApplicants} 
          shift={selectedShiftForApplicants} 
          onClose={() => setSelectedShiftForApplicants(null)} 
          onApplicantAction={() => {
            if (role === "manager" && currentUser?.id) {
              fetchManagerData();
            }
          }}
          onFinalize={async (shiftId) => {
            try {
              const res = await fetch(`${API_BASE}/api/shifts/${shiftId}/finalize`, { method: "PUT" });
              if (res.ok) {
                setSelectedShiftForApplicants(null);
                if (role === "manager" && currentUser?.id) {
                  fetchManagerData();
                }
              }
            } catch (e) { console.error(e); }
          }}
        />
    </div>
  );
}
