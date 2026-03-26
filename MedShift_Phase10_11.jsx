import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, CheckCircle, MapPin, Star, Shield, Clock,
  MessageCircle, Phone, Video, VideoOff, Mic, MicOff,
  Volume2, X, ChevronRight, Zap, Award, Activity,
  Calendar, Users, AlertCircle, Briefcase, Signal,
  Wifi, Battery, MoreVertical, Heart, TrendingUp,
  Hash, PhoneOff, Cpu, Timer, Navigation, BadgeCheck
} from "lucide-react";
import CallingScreen from "./components/CallingScreen.jsx";

// âââ PALETTE ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
const C = {
  blue: "#1A365D",
  teal: "#0D9488",
  pearl: "#F8FAFC",
  card: "#FFFFFF",
};

// âââ DEMO DATA ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
const HOSPITAL = {
  name: "City Care Hospital",
  manager: "Dr. A. Sharma",
  managerRole: "Chief Medical Officer",
  address: "14, Sassoon Road, Pune â 411001",
  tagline: "NABH Accredited Â· ISO 9001:2015",
  verified: true,
  rating: 4.8,
  totalHires: 312,
  responseTime: "< 3 min",
  founded: "Est. 1984",
  departments: ["Radiology", "Oncology", "Neurology", "Cardiology"],
  activeRequirements: [
    { id: 1, equip: "MRI Technician", urgency: "URGENT", shift: "Today, 2:00 PM", pay: "â¹1,200/hr", color: "#EF4444" },
    { id: 2, equip: "CT Scan Tech", urgency: "SOON", shift: "Today, 6:00 PM", pay: "â¹980/hr", color: "#F59E0B" },
    { id: 3, equip: "X-Ray Tech", urgency: "OPEN", shift: "Tomorrow, 9 AM", pay: "â¹750/hr", color: C.teal },
  ],
  reviews: [
    { name: "Priya K.", text: "Very professional environment, quick onboarding.", stars: 5 },
    { name: "Rahul M.", text: "Paid on time, great staff support on-site.", stars: 5 },
  ],
};

const TECHNICIAN = {
  name: "Rahul V.",
  fullName: "Rahul Vijaykumar",
  title: "Senior MRI Technician",
  rating: 4.9,
  totalShifts: 120,
  experience: "5 Years",
  equipment: "Siemens 1.5T",
  responseTime: "< 5 mins",
  distance: "3 km away",
  available: true,
  certifications: ["AERB Licensed", "BLS Certified", "Siemens Pro"],
  completionRate: "98%",
  lastActive: "Active now",
  specialties: ["Brain MRI", "Spine", "Cardiac", "Vascular"],
  recentShifts: [
    { hospital: "Apollo Diagnostics", date: "Mar 15", pay: "â¹4,800", rating: 5 },
    { hospital: "Fortis Healthtech", date: "Mar 12", pay: "â¹7,200", rating: 5 },
    { hospital: "Ruby Hall Clinic", date: "Mar 10", pay: "â¹3,600", rating: 4 },
  ],
};

// âââ STATUS BAR âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
const StatusBar = ({ dark = false }) => (
  <div className="flex items-center justify-between px-5 py-2"
    style={{ background: dark ? "transparent" : C.blue }}>
    <span className="text-xs font-semibold tracking-wide"
      style={{ color: dark ? "white" : "white", fontFamily: "'DM Mono', monospace" }}>9:41</span>
    <div className="flex items-center gap-2">
      <Signal size={12} className="text-white" />
      <Wifi size={12} className="text-white" />
      <Battery size={14} className="text-white" />
    </div>
  </div>
);

// âââ VERIFIED BADGE âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
const VerifiedBadge = ({ label = "Verified" }) => (
  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold"
    style={{ background: `${C.teal}18`, color: C.teal, fontFamily: "'DM Mono', monospace" }}>
    <BadgeCheck size={11} /> {label}
  </span>
);

// âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
// PHASE 10-A  Â·  HOSPITAL MANAGER PROFILE  (viewed by a Technician)
// âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
export const HospitalProfile = ({ onCall, onBack }) => {
  return (
    <motion.div
      className="absolute inset-0 z-20 overflow-y-auto"
      style={{ background: C.pearl, scrollbarWidth: "none" }}
      initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
      transition={{ type: "spring", stiffness: 340, damping: 38 }}
    >
      <style>{`::-webkit-scrollbar{display:none}`}</style>
      <StatusBar />

      {/* ââ Cover Image ââ */}
      <div className="relative" style={{ height: 200 }}>
        {/* Illustrated hospital facade using SVG */}
        <svg viewBox="0 0 430 200" className="w-full h-full" preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg">
          {/* Sky gradient */}
          <defs>
            <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#BFDBFE" />
              <stop offset="100%" stopColor="#DBEAFE" />
            </linearGradient>
            <linearGradient id="bldg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F8FAFC" />
              <stop offset="100%" stopColor="#E2E8F0" />
            </linearGradient>
          </defs>
          <rect width="430" height="200" fill="url(#sky)" />
          {/* Background buildings */}
          <rect x="0" y="80" width="60" height="120" rx="2" fill="#CBD5E1" opacity="0.6" />
          <rect x="360" y="70" width="70" height="130" rx="2" fill="#CBD5E1" opacity="0.5" />
          {/* Main hospital building */}
          <rect x="80" y="40" width="270" height="160" rx="4" fill="url(#bldg)" />
          {/* Cross sign */}
          <rect x="195" y="50" width="40" height="12" rx="3" fill="#EF4444" opacity="0.9" />
          <rect x="209" y="42" width="12" height="28" rx="3" fill="#EF4444" opacity="0.9" />
          {/* Windows */}
          {[110, 155, 200, 245, 290, 335].map((x, i) => (
            <g key={i}>
              <rect x={x} y="75" width="22" height="26" rx="2" fill="#93C5FD" opacity="0.8" />
              <rect x={x} y="115" width="22" height="26" rx="2" fill="#93C5FD" opacity="0.8" />
              <rect x={x} y="155" width="22" height="26" rx="2" fill="#BAE6FD" opacity="0.7" />
            </g>
          ))}
          {/* Entrance */}
          <rect x="175" y="148" width="80" height="52" rx="3" fill="#1A365D" opacity="0.15" />
          <rect x="195" y="148" width="40" height="52" rx="3" fill="#1A365D" opacity="0.2" />
          {/* Ground */}
          <rect x="0" y="192" width="430" height="8" fill="#94A3B8" opacity="0.3" />
          {/* NABH banner */}
          <rect x="85" y="42" width="72" height="16" rx="3" fill={C.teal} opacity="0.9" />
          <text x="121" y="54" textAnchor="middle" fill="white" fontSize="8" fontFamily="monospace" fontWeight="bold">NABH â</text>
        </svg>

        {/* Nav buttons */}
        <button onClick={onBack}
          className="absolute top-3 left-4 z-10 w-9 h-9 rounded-2xl flex items-center justify-center"
          style={{ background: "rgba(255,255,255,0.88)", backdropFilter: "blur(10px)" }}>
          <ArrowLeft size={17} color={C.blue} />
        </button>
        <button className="absolute top-3 right-4 z-10 w-9 h-9 rounded-2xl flex items-center justify-center"
          style={{ background: "rgba(255,255,255,0.88)", backdropFilter: "blur(10px)" }}>
          <MoreVertical size={17} color={C.blue} />
        </button>

        {/* Circular logo avatar â overlapping the cover */}
        <div className="absolute -bottom-10 left-5 z-10">
          <div className="w-20 h-20 rounded-3xl border-4 border-white flex items-center justify-center shadow-xl"
            style={{ background: `linear-gradient(135deg, ${C.blue}, #1E4A7A)` }}>
            <Activity size={30} color="white" strokeWidth={2} />
          </div>
        </div>
      </div>

      {/* ââ Main Content ââ */}
      <div className="px-5 pt-14 pb-32">

        {/* Hospital Name & Badges */}
        <div className="flex items-start justify-between mb-1">
          <div className="flex-1">
            <h1 className="font-black text-2xl leading-tight" style={{ color: C.blue, fontFamily: "'DM Sans', sans-serif" }}>
              {HOSPITAL.name}
            </h1>
            <p className="text-sm text-slate-400 mt-0.5">{HOSPITAL.tagline}</p>
          </div>
          <div className="flex flex-col items-end gap-1.5 mt-1">
            <VerifiedBadge label="NABH Verified" />
            <VerifiedBadge label="ISO Certified" />
          </div>
        </div>

        {/* Manager info */}
        <div className="flex items-center gap-2 mt-3 mb-4">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-white text-sm"
            style={{ background: C.teal }}>A</div>
          <div>
            <p className="font-bold text-sm" style={{ color: C.blue }}>{HOSPITAL.manager}</p>
            <p className="text-xs text-slate-400">{HOSPITAL.managerRole}</p>
          </div>
          <span className="ml-auto flex items-center gap-1 text-xs font-bold"
            style={{ color: "#10B981" }}>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Online
          </span>
        </div>

        {/* Address */}
        <div className="flex items-center gap-2 mb-5 px-3 py-2.5 rounded-2xl"
          style={{ background: "#F1F5F9" }}>
          <MapPin size={15} color={C.teal} />
          <span className="text-sm text-slate-500">{HOSPITAL.address}</span>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: "Rating", value: HOSPITAL.rating, icon: Star, color: "#F59E0B", suffix: "★" },
            { label: "Hires", value: HOSPITAL.totalHires, icon: Users, color: C.teal, suffix: "+" },
            { label: "Response", value: HOSPITAL.responseTime, icon: Timer, color: C.blue, suffix: "" },
          ].map(({ label, value, icon: Icon, color, suffix }) => (
            <div key={label} className="rounded-2xl p-3 text-center"
              style={{ background: `${color}0D`, border: `1px solid ${color}22` }}>
              <Icon size={13} color={color} className="mx-auto mb-1" />
              <p className="font-black text-sm" style={{ color, fontFamily: "'DM Mono', monospace" }}>
                {value}{suffix}
              </p>
              <p className="text-[10px] text-slate-400">{label}</p>
            </div>
          ))}
        </div>

        {/* Departments */}
        <div className="mb-6">
          <h3 className="text-xs font-black uppercase tracking-widest mb-3"
            style={{ color: "#94A3B8", fontFamily: "'DM Mono', monospace" }}>Departments</h3>
          <div className="flex flex-wrap gap-2">
            {HOSPITAL.departments.map(d => (
              <span key={d} className="px-3 py-1.5 rounded-full text-xs font-bold"
                style={{ background: `${C.blue}0C`, color: C.blue }}>
                {d}
              </span>
            ))}
          </div>
        </div>

        {/* ââ Active Urgent Requirements ââ */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-black uppercase tracking-widest"
              style={{ color: "#94A3B8", fontFamily: "'DM Mono', monospace" }}>
              Active Requirements
            </h3>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full"
              style={{ background: "#FEF2F2", color: "#EF4444" }}>
              {HOSPITAL.activeRequirements.length} Open
            </span>
          </div>
          <div className="flex flex-col gap-3">
            {HOSPITAL.activeRequirements.map((req, i) => (
              <motion.div key={req.id}
                initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-3 rounded-2xl px-4 py-3"
                style={{
                  background: C.card, border: `1px solid ${req.color}22`,
                  boxShadow: `0 2px 12px ${req.color}10`
                }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${req.color}12` }}>
                  <Zap size={15} color={req.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm truncate" style={{ color: C.blue }}>{req.equip}</p>
                  <p className="text-xs text-slate-400">{req.shift}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-black text-sm" style={{ color: C.teal }}>{req.pay}</p>
                  <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full"
                    style={{ background: `${req.color}15`, color: req.color }}>
                    {req.urgency}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Reviews */}
        <div className="mb-6">
          <h3 className="text-xs font-black uppercase tracking-widest mb-3"
            style={{ color: "#94A3B8", fontFamily: "'DM Mono', monospace" }}>Technician Reviews</h3>
          {HOSPITAL.reviews.map((r, i) => (
            <div key={i} className="mb-3 p-4 rounded-2xl" style={{ background: C.card, border: "1px solid #F1F5F9" }}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-sm" style={{ color: C.blue }}>{r.name}</span>
                <div className="flex gap-0.5">
                  {Array.from({ length: r.stars }).map((_, j) => (
                    <Star key={j} size={11} fill="#F59E0B" color="#F59E0B" />
                  ))}
                </div>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">{r.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ââ Sticky Action Buttons ââ */}
      <div className="fixed bottom-0 left-0 right-0 z-30 px-5 pb-8 pt-4"
        style={{
          background: "rgba(248,250,252,0.96)", backdropFilter: "blur(16px)",
          borderTop: "1px solid #E2E8F0", maxWidth: 430, margin: "0 auto"
        }}>
        <div className="flex gap-3">
          {/* Message button â primary */}
          <motion.button whileTap={{ scale: 0.96 }}
            className="flex-1 py-4 rounded-2xl font-black text-base text-white flex items-center justify-center gap-2.5"
            style={{
              background: `linear-gradient(135deg, ${C.teal}, #0F766E)`,
              boxShadow: `0 8px 24px ${C.teal}40`, fontFamily: "'DM Sans', sans-serif"
            }}>
            <MessageCircle size={20} /> Message Manager
          </motion.button>
          {/* WhatsApp-style call button */}
          <motion.button whileTap={{ scale: 0.94 }} onClick={onCall}
            className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: "#25D366", boxShadow: "0 8px 24px rgba(37,211,102,0.4)" }}>
            <Phone size={22} color="white" />
          </motion.button>
        </div>
        <p className="text-center text-xs text-slate-400 mt-2.5">
          <span className="font-bold text-emerald-500">â</span> Typically replies in under 3 minutes
        </p>
      </div>
    </motion.div>
  );
};

// âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
// PHASE 10-B  ·  TECHNICIAN PROFILE  (viewed by a Manager)
// âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
export const TechnicianProfile = ({ onCall, onBack }) => {
  const [hired, setHired] = useState(false);

  return (
    <motion.div
      className="absolute inset-0 z-20 overflow-y-auto"
      style={{ background: C.pearl, scrollbarWidth: "none" }}
      initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
      transition={{ type: "spring", stiffness: 340, damping: 38 }}
    >
      <style>{`::-webkit-scrollbar{display:none}`}</style>
      <StatusBar />

      {/* ââ Hero Header â Deep Blue gradient ââ */}
      <div className="relative px-5 pt-4 pb-8"
        style={{ background: `linear-gradient(160deg, ${C.blue} 0%, #0F2744 100%)` }}>
        <div className="flex items-center justify-between mb-5">
          <button onClick={onBack}
            className="w-9 h-9 rounded-2xl flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.12)" }}>
            <ArrowLeft size={17} color="white" />
          </button>
          <button className="w-9 h-9 rounded-2xl flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.12)" }}>
            <MoreVertical size={17} color="white" />
          </button>
        </div>

        {/* Avatar */}
        <div className="flex flex-col items-center">
          <div className="relative mb-3">
            <div className="w-24 h-24 rounded-3xl border-4 flex items-center justify-center font-black text-4xl text-white shadow-2xl"
              style={{
                background: `linear-gradient(135deg, ${C.teal}, #0F766E)`,
                borderColor: "rgba(255,255,255,0.2)"
              }}>
              R
            </div>
            {/* Online dot */}
            <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center"
              style={{ background: "#10B981" }}>
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            </span>
          </div>
          <h1 className="font-black text-2xl text-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            {TECHNICIAN.fullName}
          </h1>
          <p className="text-white/70 text-sm mt-0.5">{TECHNICIAN.title}</p>

          {/* Rating row */}
          <div className="flex items-center gap-3 mt-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
              style={{ background: "rgba(255,255,255,0.12)" }}>
              <Star size={13} fill="#F59E0B" color="#F59E0B" />
              <span className="text-white font-black text-sm">{TECHNICIAN.rating}</span>
              <span className="text-white/50 text-xs">/ 5.0</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
              style={{ background: "rgba(255,255,255,0.12)" }}>
              <Hash size={13} color="rgba(255,255,255,0.7)" />
              <span className="text-white font-black text-sm">{TECHNICIAN.totalShifts}</span>
              <span className="text-white/50 text-xs">shifts</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
              style={{ background: "rgba(13,148,136,0.35)" }}>
              <Activity size={13} color={C.teal} />
              <span className="text-white text-xs font-bold">{TECHNICIAN.lastActive}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ââ Main Content ââ */}
      <div className="px-5 pt-5 pb-36">

        {/* ââ 2Ã2 Details Grid ââ */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {[
            { label: "Experience", value: TECHNICIAN.experience, icon: Briefcase, color: C.blue, bg: `${C.blue}0C` },
            { label: "Equipment", value: TECHNICIAN.equipment, icon: Cpu, color: "#8B5CF6", bg: "#8B5CF60C" },
            { label: "Response", value: TECHNICIAN.responseTime, icon: Timer, color: C.teal, bg: `${C.teal}0C` },
            { label: "Distance", value: TECHNICIAN.distance, icon: Navigation, color: "#F59E0B", bg: "#F59E0B0C" },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <motion.div key={label}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="rounded-2xl p-4"
              style={{
                background: C.card, border: `1px solid ${color}18`,
                boxShadow: `0 2px 12px ${color}08`
              }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-2"
                style={{ background: bg }}>
                <Icon size={17} color={color} />
              </div>
              <p className="font-black text-base leading-tight" style={{ color, fontFamily: "'DM Mono', monospace" }}>
                {value}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">{label}</p>
            </motion.div>
          ))}
        </div>

        {/* Certifications */}
        <div className="mb-6">
          <h3 className="text-xs font-black uppercase tracking-widest mb-3"
            style={{ color: "#94A3B8", fontFamily: "'DM Mono', monospace" }}>Certifications</h3>
          <div className="flex flex-wrap gap-2">
            {TECHNICIAN.certifications.map(cert => (
              <span key={cert} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
                style={{ background: `${C.teal}10`, color: C.teal }}>
                <Shield size={11} /> {cert}
              </span>
            ))}
          </div>
        </div>

        {/* Specialties */}
        <div className="mb-6">
          <h3 className="text-xs font-black uppercase tracking-widest mb-3"
            style={{ color: "#94A3B8", fontFamily: "'DM Mono', monospace" }}>MRI Specialties</h3>
          <div className="flex flex-wrap gap-2">
            {TECHNICIAN.specialties.map(s => (
              <span key={s} className="px-3 py-1.5 rounded-full text-xs font-bold"
                style={{ background: `${C.blue}08`, color: C.blue }}>
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Performance Bar */}
        <div className="rounded-2xl p-4 mb-6"
          style={{ background: C.card, border: `1px solid ${C.teal}20` }}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black uppercase tracking-widest"
              style={{ color: "#94A3B8", fontFamily: "'DM Mono', monospace" }}>Shift Completion</span>
            <span className="font-black text-base" style={{ color: C.teal, fontFamily: "'DM Mono', monospace" }}>
              {TECHNICIAN.completionRate}
            </span>
          </div>
          <div className="h-2.5 rounded-full overflow-hidden" style={{ background: "#F1F5F9" }}>
            <motion.div className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, ${C.teal}, #0F766E)` }}
              initial={{ width: 0 }} animate={{ width: "98%" }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }} />
          </div>
        </div>

        {/* Recent Shifts */}
        <div className="mb-6">
          <h3 className="text-xs font-black uppercase tracking-widest mb-3"
            style={{ color: "#94A3B8", fontFamily: "'DM Mono', monospace" }}>Recent Shifts</h3>
          {TECHNICIAN.recentShifts.map((s, i) => (
            <div key={i} className="flex items-center gap-3 py-3"
              style={{ borderBottom: "1px solid #F1F5F9" }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: `${C.blue}08` }}>
                <Activity size={15} color={C.blue} />
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm" style={{ color: C.blue }}>{s.hospital}</p>
                <p className="text-xs text-slate-400">{s.date}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-sm" style={{ color: C.teal }}>{s.pay}</p>
                <div className="flex items-center gap-0.5 justify-end">
                  {Array.from({ length: s.rating }).map((_, j) => (
                    <Star key={j} size={9} fill="#F59E0B" color="#F59E0B" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ââ Sticky Bottom â Hire Instantly + Call/Text ââ */}
      <div className="fixed bottom-0 left-0 right-0 z-30 px-5 pb-8 pt-4"
        style={{
          background: "rgba(248,250,252,0.96)", backdropFilter: "blur(16px)",
          borderTop: "1px solid #E2E8F0", maxWidth: 430, margin: "0 auto"
        }}>
        <div className="flex gap-3 mb-2.5">
          {/* Text icon */}
          <motion.button whileTap={{ scale: 0.92 }}
            className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: `${C.blue}0C`, border: `1px solid ${C.blue}20` }}>
            <MessageCircle size={22} color={C.blue} />
          </motion.button>

          {/* Hire button */}
          <motion.button whileTap={{ scale: 0.96 }}
            onClick={() => setHired(h => !h)}
            className="flex-1 py-4 rounded-2xl font-black text-lg text-white flex items-center justify-center gap-2"
            style={{
              background: hired
                ? "linear-gradient(135deg,#10B981,#059669)"
                : `linear-gradient(135deg, ${C.teal}, #0F766E)`,
              boxShadow: hired ? "0 8px 24px rgba(16,185,129,0.4)" : `0 8px 24px ${C.teal}40`,

              fontFamily: "'DM Sans', sans-serif"

            }}>

            {hired ? <CheckCircle size={20} /> : <Zap size={20} />}

            {hired ? "Hired!" : "Hire Instantly"}

          </motion.button>



          {/* Call button */}

          <motion.button whileTap={{ scale: 0.94 }} onClick={onCall}

            className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"

            style={{ background: "#25D366", boxShadow: "0 8px 24px rgba(37,211,102,0.4)" }}>

            <Phone size={22} color="white" />

          </motion.button>

        </div>
      </div>
    </motion.div>
  );
};

// Small control button helper
const ControlBtn = ({ icon: Icon, label, active, activeColor, onClick }) => (
  <motion.button whileTap={{ scale: 0.88 }} onClick={onClick}
    className="flex flex-col items-center gap-1.5">
    <div className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all"
      style={{
        background: active ? `${activeColor}28` : "rgba(255,255,255,0.10)",
        border: active ? `1.5px solid ${activeColor}60` : "1.5px solid rgba(255,255,255,0.08)"
      }}>
      <Icon size={20} color={active ? activeColor : "rgba(255,255,255,0.80)"} strokeWidth={1.8} />
    </div>
    <span className="text-[10px] font-bold" style={{ color: active ? activeColor : "rgba(255,255,255,0.55)" }}>
      {label}
    </span>
  </motion.button>
);

// âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
// ROOT â DEMO NAVIGATION
// âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
export default function MedShiftProfiles() {
  const [screen, setScreen] = useState("hospital"); // menu | hospital | technician | calling
  const [callCallee, setCallCallee] = useState("");

  const openCall = (name) => {
    setCallCallee(name);
    setScreen("calling");
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#0A0F1C" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&family=DM+Mono:wght@400;500;600&display=swap');
        *{-webkit-tap-highlight-color:transparent;box-sizing:border-box;}
        ::-webkit-scrollbar{display:none;}
      `}</style>

      <div className="relative overflow-hidden shadow-2xl"
        style={{ width: "100%", maxWidth: 430, minHeight: "100vh", background: C.pearl, fontFamily: "'DM Sans', sans-serif" }}>

        {/* ââ Menu / Landing ââ */}

        {/* ââ Screens ââ */}
        <AnimatePresence>
          {screen === "hospital" && (
            <HospitalProfile key="hosp"
              onCall={() => openCall("Dr. A. Sharma")}
              onBack={() => setScreen("menu")} />
          )}
          {screen === "technician" && (
            <TechnicianProfile key="tech"
              onCall={() => openCall("Rahul V.")}
              onBack={() => setScreen("menu")} />
          )}
          {screen === "calling" && (
            <CallingScreen key="call"
              callee={callCallee || "Rahul V."}
              onEnd={() => setScreen(callCallee === "Dr. A. Sharma" ? "hospital" : "technician")} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
