import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, Calendar, Users, User, Bell, MapPin, Clock, Zap,
  Filter, ChevronRight, X, CheckCircle, Navigation, Star,
  Activity, Shield, Wifi, Battery, Signal, ArrowLeft,
  AlertCircle, Radio, Crosshair, Heart, Thermometer,
  Wind, Eye, Cpu, Scan, ChevronDown, Phone, DollarSign,
  TrendingUp, Award
} from "lucide-react";

// ─── DATA ─────────────────────────────────────────────────────────────────────
const SHIFTS = [
  {
    id: 1, hospital: "City General Hospital", distance: "1.2 km",
    equipment: "X-Ray", time: "ASAP • Now", pay: "₹850/hr",
    rating: 4.9, urgent: true, dept: "Emergency Radiology",
    address: "MG Road, Sector 5", duration: "4–6 hrs", color: "#EF4444"
  },
  {
    id: 2, hospital: "Apollo Diagnostics", distance: "2.5 km",
    equipment: "MRI", time: "Today, 3:00 PM", pay: "₹1,200/hr",
    rating: 4.7, urgent: false, dept: "Neuro Imaging",
    address: "Koregaon Park, Pune", duration: "6 hrs", color: "#8B5CF6"
  },
  {
    id: 3, hospital: "Fortis Healthtech", distance: "3.8 km",
    equipment: "CT Scan", time: "Today, 6:00 PM", pay: "₹980/hr",
    rating: 4.8, urgent: false, dept: "Oncology",
    address: "Baner Road, Pune", duration: "8 hrs", color: "#0D9488"
  },
  {
    id: 4, hospital: "Ruby Hall Clinic", distance: "5.1 km",
    equipment: "Ultrasound", time: "Tomorrow, 9:00 AM", pay: "₹720/hr",
    rating: 4.6, urgent: false, dept: "Obstetrics",
    address: "Sassoon Road, Pune", duration: "4 hrs", color: "#F59E0B"
  },
];

const EQUIPMENT_OPTIONS = [
  { id: "xray", label: "X-Ray", icon: Scan, color: "#EF4444" },
  { id: "mri", label: "MRI", icon: Cpu, color: "#8B5CF6" },
  { id: "ct", label: "CT Scan", icon: Eye, color: "#0D9488" },
  { id: "us", label: "Ultrasound", icon: Activity, color: "#F59E0B" },
  { id: "echo", label: "Echo", icon: Heart, color: "#EC4899" },
  { id: "vent", label: "Ventilator", icon: Wind, color: "#3B82F6" },
];

const FILTERS = ["All", "X-Ray", "MRI", "CT Scan", "Ultrasound", "Echo"];

// ─── COLORS ───────────────────────────────────────────────────────────────────
const C = {
  blue: "#1A365D",
  teal: "#0D9488",
  pearl: "#F8FAFC",
  card: "#FFFFFF",
};

// ─── UTILITY COMPONENTS ───────────────────────────────────────────────────────
const StatusBar = () => (
  <div style={{ background: C.blue }} className="flex items-center justify-between px-5 py-2">
    <span className="text-white text-xs font-semibold tracking-wide" style={{ fontFamily: "'DM Mono', monospace" }}>9:41</span>
    <div className="flex items-center gap-2">
      <Signal size={12} className="text-white" />
      <Wifi size={12} className="text-white" />
      <Battery size={14} className="text-white" />
    </div>
  </div>
);

const EquipmentBadge = ({ type, color }) => (
  <span
    className="text-xs font-bold px-2 py-1 rounded-full"
    style={{ background: `${color}18`, color, fontFamily: "'DM Mono', monospace" }}
  >
    {type}
  </span>
);

// ─── BOTTOM TAB BAR ──────────────────────────────────────────────────────────
const BottomNav = ({ active, setActive, setView }) => {
  const tabs = [
    { id: "home", label: "Home", icon: Home },
    { id: "shifts", label: "Shifts", icon: Calendar },
    { id: "community", label: "Community", icon: Users },
    { id: "profile", label: "Profile", icon: User },
  ];
  return (
    <div
      className="absolute bottom-0 left-0 right-0 z-50 flex items-center justify-around px-2 pt-3 pb-5"
      style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(20px)", borderTop: "1px solid #E2E8F0" }}
    >
      {tabs.map(({ id, label, icon: Icon }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            onClick={() => { setActive(id); setView("home"); }}
            className="flex flex-col items-center gap-1 min-w-[44px] min-h-[44px] justify-center relative"
          >
            {isActive && (
              <motion.div
                layoutId="tabPill"
                className="absolute inset-0 rounded-2xl"
                style={{ background: `${C.teal}14` }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <Icon size={20} color={isActive ? C.teal : "#94A3B8"} strokeWidth={isActive ? 2.5 : 1.8} />
            <span className="text-[10px] font-semibold relative z-10"
              style={{ color: isActive ? C.teal : "#94A3B8", fontFamily: "'DM Sans', sans-serif" }}>
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

// ─── TOP HEADER ───────────────────────────────────────────────────────────────
const TopHeader = ({ notifCount = 3 }) => (
  <div
    className="sticky top-0 z-40 flex items-center justify-between px-5 py-3"
    style={{ backdropFilter: "blur(16px)", background: "rgba(255,255,255,0.82)", borderBottom: "1px solid rgba(226,232,240,0.6)" }}
  >
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: C.blue }}>
        <Activity size={16} color="white" strokeWidth={2.5} />
      </div>
      <div>
        <span className="font-black text-base tracking-tight" style={{ color: C.blue, fontFamily: "'DM Sans', sans-serif" }}>
          Med<span style={{ color: C.teal }}>Shift</span>
        </span>
      </div>
    </div>
    <div className="relative">
      <button className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: "#F1F5F9" }}>
        <Bell size={18} color={C.blue} strokeWidth={1.8} />
        {notifCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black text-white"
            style={{ background: "#EF4444" }}>
            {notifCount}
          </span>
        )}
      </button>
    </div>
  </div>
);

// ─── SHIFT CARD ───────────────────────────────────────────────────────────────
const ShiftCard = ({ shift, onClick }) => (
  <motion.div
    whileTap={{ scale: 0.97 }}
    onClick={() => onClick(shift)}
    className="mx-auto rounded-3xl overflow-hidden cursor-pointer"
    style={{ width: "90%", background: C.card, boxShadow: "0 4px 24px rgba(26,54,93,0.08)", border: "1px solid #EEF2F7" }}
  >
    {shift.urgent && (
      <div className="flex items-center gap-1.5 px-4 py-2" style={{ background: "#FEF2F2", borderBottom: "1px solid #FECACA" }}>
        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        <span className="text-xs font-bold text-red-600" style={{ fontFamily: "'DM Mono', monospace" }}>URGENT REQUEST</span>
      </div>
    )}
    <div className="p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-bold text-base mb-0.5" style={{ color: C.blue, fontFamily: "'DM Sans', sans-serif" }}>
            {shift.hospital}
          </h3>
          <p className="text-xs text-slate-400 font-medium">{shift.dept}</p>
        </div>
        <div className="text-right">
          <p className="font-black text-base" style={{ color: C.teal }}>{shift.pay}</p>
          <div className="flex items-center gap-1 justify-end mt-0.5">
            <Star size={10} fill="#F59E0B" color="#F59E0B" />
            <span className="text-xs text-slate-400">{shift.rating}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <EquipmentBadge type={shift.equipment} color={shift.color} />
        <div className="flex items-center gap-1">
          <MapPin size={12} color="#94A3B8" />
          <span className="text-xs text-slate-400">{shift.distance}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock size={12} color="#94A3B8" />
          <span className="text-xs text-slate-400">{shift.time}</span>
        </div>
      </div>
    </div>

    <div className="px-4 pb-4 flex items-center justify-between">
      <div className="flex items-center gap-1.5">
        <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: `${shift.color}18` }}>
          <Shield size={12} color={shift.color} />
        </div>
        <span className="text-xs text-slate-400">{shift.duration}</span>
      </div>
      <div className="flex items-center gap-1 text-xs font-semibold" style={{ color: C.teal }}>
        View Details <ChevronRight size={14} />
      </div>
    </div>
  </motion.div>
);

// ─── FILTER BOTTOM SHEET ──────────────────────────────────────────────────────
const FilterSheet = ({ open, onClose, activeFilter, setActiveFilter }) => (
  <AnimatePresence>
    {open && (
      <>
        <motion.div className="absolute inset-0 z-50 bg-black/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
        <motion.div
          className="absolute bottom-0 left-0 right-0 z-50 rounded-t-3xl px-5 pt-4 pb-10"
          style={{ background: C.card }}
          initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
          transition={{ type: "spring", stiffness: 350, damping: 35 }}
        >
          <div className="w-10 h-1 rounded-full bg-slate-200 mx-auto mb-5" />
          <h3 className="font-black text-lg mb-4" style={{ color: C.blue, fontFamily: "'DM Sans', sans-serif" }}>Filter by Equipment</h3>
          <div className="grid grid-cols-3 gap-3">
            {FILTERS.map(f => (
              <button
                key={f}
                onClick={() => { setActiveFilter(f); onClose(); }}
                className="py-3 px-2 rounded-2xl text-sm font-bold transition-all"
                style={{
                  background: activeFilter === f ? C.teal : "#F1F5F9",
                  color: activeFilter === f ? "white" : C.blue,
                  minHeight: "44px", fontFamily: "'DM Sans', sans-serif"
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

// ─── PHASE 2: HOME / JOB RADAR ────────────────────────────────────────────────
const HomeScreen = ({ setView, setSelectedShift }) => {
  const [available, setAvailable] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered = activeFilter === "All" ? SHIFTS : SHIFTS.filter(s => s.equipment === activeFilter);

  return (
    <div className="flex-1 overflow-y-auto pb-28" style={{ scrollbarWidth: "none" }}>
      <style>{`div::-webkit-scrollbar{display:none}`}</style>

      {/* Greeting + Toggle */}
      <div className="px-5 pt-4 pb-5">
        <p className="text-sm text-slate-400 mb-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          Wednesday, 18 Mar
        </p>
        <h1 className="font-black text-2xl mb-5" style={{ color: C.blue, fontFamily: "'DM Sans', sans-serif" }}>
          Hi, Vilas 👋
        </h1>

        {/* Available Toggle */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => setAvailable(!available)}
          className="w-full rounded-2xl px-5 py-4 flex items-center justify-between"
          style={{
            background: available
              ? `linear-gradient(135deg, ${C.teal}, #0F766E)`
              : `linear-gradient(135deg, ${C.blue}, #1E4A7A)`,
            boxShadow: available ? `0 8px 32px ${C.teal}40` : `0 8px 32px ${C.blue}30`
          }}
          animate={{ background: available ? [C.teal, "#0F766E"] : [C.blue, "#1E4A7A"] }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/20">
              {available ? <Radio size={20} color="white" className="animate-pulse" /> : <Wifi size={20} color="white/60" />}
            </div>
            <div className="text-left">
              <p className="text-white font-black text-base" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {available ? "Available for Calls" : "Tap to Go Available"}
              </p>
              <p className="text-white/70 text-xs">{available ? "You're visible to hospitals" : "Currently off-duty"}</p>
            </div>
          </div>
          <div className={`w-12 h-6 rounded-full transition-all flex items-center px-1 ${available ? "bg-white/30" : "bg-white/10"}`}>
            <motion.div
              className="w-4 h-4 rounded-full bg-white"
              animate={{ x: available ? 24 : 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </div>
        </motion.button>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          {[
            { label: "Shifts Done", value: "24", icon: CheckCircle, color: C.teal },
            { label: "Avg Rating", value: "4.9", icon: Star, color: "#F59E0B" },
            { label: "This Month", value: "₹42k", icon: TrendingUp, color: "#8B5CF6" }
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="rounded-2xl p-3 text-center" style={{ background: `${color}0F`, border: `1px solid ${color}20` }}>
              <Icon size={14} color={color} className="mx-auto mb-1" />
              <p className="font-black text-base" style={{ color, fontFamily: "'DM Mono', monospace" }}>{value}</p>
              <p className="text-[10px] text-slate-400">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Section Header */}
      <div className="px-5 flex items-center justify-between mb-3">
        <h2 className="font-black text-base" style={{ color: C.blue, fontFamily: "'DM Sans', sans-serif" }}>
          Nearby Shifts
          <span className="ml-2 text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: `${C.teal}15`, color: C.teal }}>
            {filtered.length}
          </span>
        </h2>
        <span className="text-xs font-semibold" style={{ color: C.teal }}>See All</span>
      </div>

      {/* Shift Cards */}
      <div className="flex flex-col gap-3 pb-4">
        {filtered.map((shift, i) => (
          <motion.div
            key={shift.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
          >
            <ShiftCard shift={shift} onClick={(s) => { setSelectedShift(s); setView("detail"); }} />
          </motion.div>
        ))}
      </div>

      {/* Floating Filter FAB */}
      <motion.button
        whileTap={{ scale: 0.93 }}
        onClick={() => setFilterOpen(true)}
        className="fixed bottom-24 right-6 z-40 flex items-center gap-2 px-5 py-3 rounded-full"
        style={{
          background: C.blue, boxShadow: `0 8px 24px ${C.blue}40`,
          fontFamily: "'DM Sans', sans-serif"
        }}
      >
        <Filter size={14} color="white" />
        <span className="text-white text-sm font-bold">{activeFilter}</span>
      </motion.button>

      <FilterSheet open={filterOpen} onClose={() => setFilterOpen(false)} activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
    </div>
  );
};

// ─── PHASE 3: MANAGER VIEW ────────────────────────────────────────────────────
const ManagerScreen = () => {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedEquip, setSelectedEquip] = useState(null);
  const [timeMode, setTimeMode] = useState("asap");
  const [broadcasted, setBroadcasted] = useState(false);

  const handleBroadcast = () => {
    setBroadcasted(true);
    setTimeout(() => { setBroadcasted(false); setSheetOpen(false); setSelectedEquip(null); setTimeMode("asap"); }, 2500);
  };

  return (
    <div className="flex-1 pb-28 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
      {/* Hero Button */}
      <div className="px-5 pt-5 pb-4">
        <div className="mb-4">
          <p className="text-sm text-slate-400" style={{ fontFamily: "'DM Sans', sans-serif" }}>Manager Portal</p>
          <h1 className="font-black text-2xl" style={{ color: C.blue, fontFamily: "'DM Sans', sans-serif" }}>Emergency Dispatch</h1>
        </div>

        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => setSheetOpen(true)}
          className="w-full rounded-3xl flex flex-col items-center justify-center py-12 relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, #EF4444 0%, #DC2626 50%, #B91C1C 100%)`,
            boxShadow: "0 16px 48px rgba(239,68,68,0.45)"
          }}
        >
          {/* Animated rings */}
          <div className="absolute inset-0 flex items-center justify-center">
            {[1, 2, 3].map(i => (
              <motion.div key={i} className="absolute rounded-full border border-white/10"
                animate={{ scale: [1, 2.5], opacity: [0.4, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                style={{ width: 80, height: 80 }}
              />
            ))}
          </div>
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-4 relative z-10">
            <AlertCircle size={32} color="white" strokeWidth={2} />
          </div>
          <p className="text-white font-black text-xl relative z-10" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Request Emergency
          </p>
          <p className="text-white font-black text-xl relative z-10" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Technician
          </p>
          <p className="text-white/70 text-sm mt-2 relative z-10">Tap to broadcast to all nearby techs</p>
        </motion.button>
      </div>

      {/* Recent Requests */}
      <div className="px-5">
        <h2 className="font-black text-base mb-3" style={{ color: C.blue, fontFamily: "'DM Sans', sans-serif" }}>Recent Requests</h2>
        {[
          { equip: "CT Scan", tech: "Rahul M.", status: "Accepted", time: "2h ago", color: C.teal },
          { equip: "X-Ray", tech: "Priya S.", status: "Pending", time: "4h ago", color: "#F59E0B" },
          { equip: "MRI", tech: "Amit K.", status: "Completed", time: "Yesterday", color: "#94A3B8" },
        ].map((r, i) => (
          <div key={i} className="flex items-center justify-between py-3" style={{ borderBottom: "1px solid #F1F5F9" }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${r.color}18` }}>
                <Scan size={16} color={r.color} />
              </div>
              <div>
                <p className="font-bold text-sm" style={{ color: C.blue }}>{r.equip}</p>
                <p className="text-xs text-slate-400">{r.tech} • {r.time}</p>
              </div>
            </div>
            <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ background: `${r.color}15`, color: r.color }}>
              {r.status}
            </span>
          </div>
        ))}
      </div>

      {/* Request Bottom Sheet */}
      <AnimatePresence>
        {sheetOpen && (
          <>
            <motion.div className="absolute inset-0 z-50 bg-black/50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSheetOpen(false)} />
            <motion.div
              className="absolute bottom-0 left-0 right-0 z-50 rounded-t-3xl"
              style={{ background: C.card, maxHeight: "88vh", overflow: "hidden" }}
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 350, damping: 35 }}
            >
              {/* Sheet drag handle + header */}
              <div className="px-5 pt-4 pb-4 sticky top-0 bg-white z-10" style={{ borderBottom: "1px solid #F1F5F9" }}>
                <div className="w-10 h-1 rounded-full bg-slate-200 mx-auto mb-4" />
                <div className="flex items-center justify-between">
                  <h2 className="font-black text-xl" style={{ color: C.blue, fontFamily: "'DM Sans', sans-serif" }}>
                    New Request
                  </h2>
                  <button onClick={() => setSheetOpen(false)} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "#F1F5F9" }}>
                    <X size={16} color="#94A3B8" />
                  </button>
                </div>
              </div>

              <div className="overflow-y-auto px-5 pb-32" style={{ maxHeight: "calc(88vh - 100px)", scrollbarWidth: "none" }}>
                {/* Step 1: Equipment */}
                <div className="py-5">
                  <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: "#94A3B8", fontFamily: "'DM Mono', monospace" }}>
                    01 — Select Equipment
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    {EQUIPMENT_OPTIONS.map(({ id, label, icon: Icon, color }) => (
                      <motion.button
                        key={id}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedEquip(id)}
                        className="rounded-2xl py-4 flex flex-col items-center gap-2"
                        style={{
                          background: selectedEquip === id ? color : `${color}10`,
                          border: `2px solid ${selectedEquip === id ? color : "transparent"}`,
                          minHeight: "80px"
                        }}
                      >
                        <Icon size={22} color={selectedEquip === id ? "white" : color} />
                        <span className="text-xs font-bold" style={{ color: selectedEquip === id ? "white" : color, fontFamily: "'DM Sans', sans-serif" }}>
                          {label}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Step 2: Time */}
                <div className="py-4" style={{ borderTop: "1px solid #F1F5F9" }}>
                  <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: "#94A3B8", fontFamily: "'DM Mono', monospace" }}>
                    02 — Time Needed
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: "asap", label: "ASAP", sub: "Immediately", icon: Zap },
                      { id: "scheduled", label: "Schedule", sub: "Pick a time", icon: Calendar },
                    ].map(({ id, label, sub, icon: Icon }) => (
                      <motion.button
                        key={id}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setTimeMode(id)}
                        className="rounded-2xl p-4 flex items-center gap-3"
                        style={{
                          background: timeMode === id ? `${C.teal}12` : "#F8FAFC",
                          border: `2px solid ${timeMode === id ? C.teal : "#E2E8F0"}`,
                          minHeight: "68px"
                        }}
                      >
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: timeMode === id ? C.teal : "#E2E8F0" }}>
                          <Icon size={16} color={timeMode === id ? "white" : "#94A3B8"} />
                        </div>
                        <div className="text-left">
                          <p className="font-bold text-sm" style={{ color: C.blue }}>{label}</p>
                          <p className="text-xs text-slate-400">{sub}</p>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                  {timeMode === "scheduled" && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                      className="mt-3 rounded-2xl p-4 flex items-center gap-3"
                      style={{ background: "#F8FAFC", border: "1px solid #E2E8F0" }}
                    >
                      <Clock size={18} color={C.teal} />
                      <span className="text-sm font-semibold text-slate-400">Today, 3:00 PM</span>
                      <ChevronDown size={16} color="#94A3B8" className="ml-auto" />
                    </motion.div>
                  )}
                </div>

                {/* Step 3: Notes */}
                <div className="py-4" style={{ borderTop: "1px solid #F1F5F9" }}>
                  <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: "#94A3B8", fontFamily: "'DM Mono', monospace" }}>
                    03 — Additional Notes
                  </p>
                  <textarea
                    placeholder="e.g. Portable X-ray preferred, access via Emergency entrance..."
                    className="w-full rounded-2xl p-4 text-sm resize-none outline-none"
                    rows={3}
                    style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", color: C.blue, fontFamily: "'DM Sans', sans-serif" }}
                  />
                </div>
              </div>

              {/* Sticky Broadcast Button */}
              <div className="absolute bottom-0 left-0 right-0 px-5 pb-8 pt-4 bg-white" style={{ borderTop: "1px solid #F1F5F9" }}>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleBroadcast}
                  className="w-full py-4 rounded-2xl font-black text-lg text-white flex items-center justify-center gap-2 relative overflow-hidden"
                  style={{
                    background: broadcasted ? "#10B981" : `linear-gradient(135deg, ${C.teal}, #0F766E)`,
                    boxShadow: `0 8px 32px ${C.teal}50`,
                    fontFamily: "'DM Sans', sans-serif"
                  }}
                  animate={{ background: broadcasted ? "#10B981" : C.teal }}
                >
                  {broadcasted ? (
                    <><CheckCircle size={22} /> Broadcasted! Techs notified</>
                  ) : (
                    <><Radio size={22} className="animate-pulse" /> Broadcast to Technicians</>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── PHASE 4: SHIFT DETAIL ────────────────────────────────────────────────────
const DetailScreen = ({ shift, onBack }) => {
  const [accepted, setAccepted] = useState(false);

  if (!shift) return null;

  return (
    <motion.div
      className="absolute inset-0 z-30 flex flex-col"
      style={{ background: C.pearl }}
      initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
      transition={{ type: "spring", stiffness: 350, damping: 38 }}
    >
      {/* Map Hero */}
      <div className="relative flex-shrink-0" style={{ height: "45%" }}>
        {/* Simulated Map */}
        <div className="absolute inset-0 overflow-hidden"
          style={{ background: "linear-gradient(160deg, #E8F4F8 0%, #D1E9F0 30%, #C8E6C9 60%, #DCEDC8 100%)" }}>
          {/* Grid lines simulating map */}
          <svg className="absolute inset-0 w-full h-full" opacity="0.3">
            {Array.from({ length: 8 }).map((_, i) => (
              <line key={`h${i}`} x1="0" y1={`${i * 14}%`} x2="100%" y2={`${i * 14}%`} stroke="#94A3B8" strokeWidth="0.8" />
            ))}
            {Array.from({ length: 8 }).map((_, i) => (
              <line key={`v${i}`} x1={`${i * 14}%`} y1="0" x2={`${i * 14}%`} y2="100%" stroke="#94A3B8" strokeWidth="0.8" />
            ))}
            {/* Route line */}
            <polyline
              points="60,200 120,160 180,130 240,100 300,75 340,55"
              stroke={C.teal} strokeWidth="3" fill="none" strokeDasharray="6,4"
              strokeLinecap="round"
            />
            {/* Road blocks */}
            <rect x="80" y="130" width="60" height="12" rx="4" fill="#B0BEC5" opacity="0.6" />
            <rect x="200" y="90" width="80" height="12" rx="4" fill="#B0BEC5" opacity="0.6" />
            <rect x="140" y="155" width="12" height="50" rx="4" fill="#B0BEC5" opacity="0.5" />
          </svg>

          {/* Start pin */}
          <div className="absolute bottom-12 left-12 flex flex-col items-center">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: C.blue, boxShadow: `0 4px 12px ${C.blue}60` }}>
              <Crosshair size={14} color="white" />
            </div>
            <div className="w-1 h-3 rounded-b-full" style={{ background: C.blue }} />
            <p className="text-[9px] font-bold text-center mt-1" style={{ color: C.blue }}>You</p>
          </div>

          {/* Hospital pin */}
          <div className="absolute top-8 right-10 flex flex-col items-center">
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: "#EF4444", boxShadow: "0 4px 20px rgba(239,68,68,0.5)" }}>
              <Heart size={16} color="white" />
            </motion.div>
            <div className="w-1 h-3 rounded-b-full bg-red-500" />
            <p className="text-[9px] font-bold text-center mt-1 text-red-600">Hospital</p>
          </div>

          {/* Distance badge */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="px-3 py-1.5 rounded-full flex items-center gap-1.5"
              style={{ background: "white", boxShadow: "0 4px 16px rgba(0,0,0,0.15)" }}>
              <Navigation size={12} color={C.teal} />
              <span className="text-xs font-black" style={{ color: C.blue }}>{shift.distance}</span>
            </div>
          </div>
        </div>

        {/* Back button overlay */}
        <button
          onClick={onBack}
          className="absolute top-4 left-4 z-10 w-10 h-10 rounded-2xl flex items-center justify-center"
          style={{ background: "rgba(255,255,255,0.9)", backdropFilter: "blur(10px)", boxShadow: "0 2px 12px rgba(0,0,0,0.12)" }}
        >
          <ArrowLeft size={18} color={C.blue} />
        </button>

        {/* Urgent badge */}
        {shift.urgent && (
          <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full"
            style={{ background: "#EF4444", boxShadow: "0 4px 12px rgba(239,68,68,0.4)" }}>
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span className="text-white text-xs font-black">URGENT</span>
          </div>
        )}
      </div>

      {/* Details Card - bottom half */}
      <div className="flex-1 -mt-5 rounded-t-3xl overflow-y-auto pb-28" style={{ background: C.card, scrollbarWidth: "none" }}>
        <div className="px-5 pt-6">
          {/* Hospital Header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="font-black text-xl" style={{ color: C.blue, fontFamily: "'DM Sans', sans-serif" }}>
                {shift.hospital}
              </h2>
              <p className="text-sm text-slate-400 mt-0.5">{shift.address}</p>
            </div>
            <div className="text-right">
              <p className="font-black text-2xl" style={{ color: C.teal, fontFamily: "'DM Mono', monospace" }}>
                {shift.pay}
              </p>
              <div className="flex items-center gap-1 justify-end">
                <Star size={12} fill="#F59E0B" color="#F59E0B" />
                <span className="text-xs text-slate-400">{shift.rating} rating</span>
              </div>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            {[
              { label: "Equipment", value: shift.equipment, icon: Scan, color: shift.color },
              { label: "Duration", value: shift.duration, icon: Clock, color: C.teal },
              { label: "Department", value: shift.dept, icon: Activity, color: "#8B5CF6" },
              { label: "Distance", value: shift.distance, icon: MapPin, color: "#F59E0B" },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="rounded-2xl p-3" style={{ background: "#F8FAFC" }}>
                <div className="flex items-center gap-2 mb-1">
                  <Icon size={14} color={color} />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{label}</span>
                </div>
                <p className="font-bold text-sm" style={{ color: C.blue }}>{value}</p>
              </div>
            ))}
          </div>

          {/* Requirements */}
          <div className="rounded-2xl p-4 mb-4" style={{ background: `${C.blue}06`, border: `1px solid ${C.blue}12` }}>
            <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: "#94A3B8", fontFamily: "'DM Mono', monospace" }}>
              Requirements
            </p>
            {["Valid RT/MRI certification", "AERB licensed", "Min. 2 years experience", "Portable equipment preferred"].map((r) => (
              <div key={r} className="flex items-center gap-2 py-1.5">
                <CheckCircle size={14} color={C.teal} />
                <span className="text-sm text-slate-600">{r}</span>
              </div>
            ))}
          </div>

          {/* Earning Breakdown */}
          <div className="rounded-2xl p-4 mb-4" style={{ background: `${C.teal}08`, border: `1px solid ${C.teal}20` }}>
            <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: C.teal, fontFamily: "'DM Mono', monospace" }}>
              Earnings Estimate
            </p>
            <div className="flex justify-between items-center">
              <div className="text-center">
                <p className="text-xs text-slate-400">Base Pay</p>
                <p className="font-black" style={{ color: C.blue, fontFamily: "'DM Mono', monospace" }}>{shift.pay}</p>
              </div>
              <div className="text-slate-300">×</div>
              <div className="text-center">
                <p className="text-xs text-slate-400">Duration</p>
                <p className="font-black" style={{ color: C.blue, fontFamily: "'DM Mono', monospace" }}>{shift.duration.split("–")[0]}h</p>
              </div>
              <div className="text-slate-300">=</div>
              <div className="text-center">
                <p className="text-xs text-slate-400">Total Est.</p>
                <p className="font-black text-lg" style={{ color: C.teal, fontFamily: "'DM Mono', monospace" }}>
                  ₹{(parseInt(shift.pay.replace(/\D/g, "")) * parseInt(shift.duration)).toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="flex items-center gap-3 py-4" style={{ borderTop: "1px solid #F1F5F9" }}>
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: `${C.blue}10` }}>
              <Phone size={16} color={C.blue} />
            </div>
            <div>
              <p className="font-bold text-sm" style={{ color: C.blue }}>Dr. Meena Sharma</p>
              <p className="text-xs text-slate-400">Dept. Head · +91 98765 43210</p>
            </div>
            <button className="ml-auto px-4 py-2 rounded-xl text-xs font-bold" style={{ background: `${C.teal}12`, color: C.teal }}>
              Call
            </button>
          </div>
        </div>
      </div>

      {/* Sticky Accept Button */}
      <div className="absolute bottom-0 left-0 right-0 px-5 pb-8 pt-4"
        style={{ background: "rgba(255,255,255,0.96)", backdropFilter: "blur(16px)", borderTop: "1px solid #F1F5F9" }}>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => setAccepted(!accepted)}
          className="w-full py-4 rounded-2xl font-black text-xl text-white flex items-center justify-center gap-3"
          style={{
            background: accepted
              ? "linear-gradient(135deg, #10B981, #059669)"
              : `linear-gradient(135deg, ${C.teal}, #0F766E)`,
            boxShadow: accepted ? "0 8px 32px rgba(16,185,129,0.4)" : `0 8px 32px ${C.teal}45`,
            fontFamily: "'DM Sans', sans-serif"
          }}
          animate={{ scale: accepted ? [1, 1.02, 1] : 1 }}
        >
          {accepted ? (
            <><CheckCircle size={24} /> Shift Accepted!</>
          ) : (
            <><Award size={24} /> Accept Shift</>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

// ─── SHIFTS TAB (Placeholder) ─────────────────────────────────────────────────
const ShiftsTab = ({ setView, setSelectedShift }) => (
  <div className="flex-1 overflow-y-auto pb-28" style={{ scrollbarWidth: "none" }}>
    <div className="px-5 pt-5 pb-4">
      <h1 className="font-black text-2xl mb-1" style={{ color: C.blue, fontFamily: "'DM Sans', sans-serif" }}>My Shifts</h1>
      <p className="text-sm text-slate-400 mb-5">Track your upcoming & past work</p>
      <div className="flex gap-2 mb-5 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
        {["Upcoming", "Active", "Completed", "Cancelled"].map((t, i) => (
          <button key={t} className="px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap flex-shrink-0"
            style={{ background: i === 0 ? C.blue : "#F1F5F9", color: i === 0 ? "white" : "#94A3B8" }}>
            {t}
          </button>
        ))}
      </div>
    </div>
    <div className="flex flex-col gap-3">
      {SHIFTS.slice(0, 2).map((s, i) => (
        <motion.div key={s.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
          <ShiftCard shift={s} onClick={(sh) => { setSelectedShift(sh); setView("detail"); }} />
        </motion.div>
      ))}
    </div>
  </div>
);

// ─── COMMUNITY TAB ─────────────────────────────────────────────────────────────
const CommunityTab = () => (
  <div className="flex-1 overflow-y-auto pb-28 px-5 pt-5" style={{ scrollbarWidth: "none" }}>
    <h1 className="font-black text-2xl mb-1" style={{ color: C.blue, fontFamily: "'DM Sans', sans-serif" }}>Community</h1>
    <p className="text-sm text-slate-400 mb-5">Connect with fellow technicians</p>
    {[
      { name: "Priya Kulkarni", role: "MRI Specialist", badge: "Top Rated", shifts: 89, color: "#8B5CF6" },
      { name: "Rahul Menon", role: "CT / X-Ray", badge: "Active", shifts: 54, color: C.teal },
      { name: "Deepa Nair", role: "Ultrasound Tech", badge: "New", shifts: 12, color: "#F59E0B" },
      { name: "Arjun Patel", role: "Radiology", badge: "Top Rated", shifts: 120, color: "#EF4444" },
    ].map((p, i) => (
      <motion.div key={p.name} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
        className="flex items-center gap-3 py-3" style={{ borderBottom: "1px solid #F1F5F9" }}>
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-white text-lg"
          style={{ background: `linear-gradient(135deg, ${p.color}, ${p.color}99)` }}>
          {p.name[0]}
        </div>
        <div className="flex-1">
          <p className="font-bold text-sm" style={{ color: C.blue }}>{p.name}</p>
          <p className="text-xs text-slate-400">{p.role} · {p.shifts} shifts</p>
        </div>
        <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ background: `${p.color}15`, color: p.color }}>
          {p.badge}
        </span>
      </motion.div>
    ))}
  </div>
);

// ─── PROFILE TAB ──────────────────────────────────────────────────────────────
const ProfileTab = () => (
  <div className="flex-1 overflow-y-auto pb-28" style={{ scrollbarWidth: "none" }}>
    {/* Profile Hero */}
    <div className="px-5 pt-6 pb-5" style={{ background: `linear-gradient(160deg, ${C.blue} 0%, #1E4A7A 100%)` }}>
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center font-black text-3xl text-white"
          style={{ background: "rgba(255,255,255,0.2)" }}>V</div>
        <div>
          <h2 className="font-black text-xl text-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>Vilas Kadam</h2>
          <p className="text-white/70 text-sm">MRI & CT Specialist</p>
          <div className="flex items-center gap-1 mt-1">
            <Star size={12} fill="#F59E0B" color="#F59E0B" />
            <span className="text-white text-xs font-bold">4.9 · 24 shifts completed</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[{ l: "Earnings", v: "₹42k" }, { l: "Hours", v: "186h" }, { l: "Hospitals", v: "12" }].map(({ l, v }) => (
          <div key={l} className="text-center py-3 rounded-xl" style={{ background: "rgba(255,255,255,0.12)" }}>
            <p className="text-white font-black" style={{ fontFamily: "'DM Mono', monospace" }}>{v}</p>
            <p className="text-white/60 text-xs">{l}</p>
          </div>
        ))}
      </div>
    </div>

    <div className="px-5 pt-5">
      {[
        { label: "Certifications", icon: Award, color: C.teal },
        { label: "Payment Settings", icon: DollarSign, color: "#F59E0B" },
        { label: "Availability Schedule", icon: Calendar, color: "#8B5CF6" },
        { label: "Notifications", icon: Bell, color: C.blue },
        { label: "Help & Support", icon: Shield, color: "#94A3B8" },
      ].map(({ label, icon: Icon, color }) => (
        <div key={label} className="flex items-center gap-3 py-4" style={{ borderBottom: "1px solid #F1F5F9" }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}12` }}>
            <Icon size={18} color={color} />
          </div>
          <span className="font-semibold text-sm flex-1" style={{ color: C.blue }}>{label}</span>
          <ChevronRight size={16} color="#CBD5E1" />
        </div>
      ))}
    </div>
  </div>
);

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function MedShift() {
  const [activeTab, setActiveTab] = useState("home");
  const [view, setView] = useState("home"); // "home" | "manager" | "detail"
  const [selectedShift, setSelectedShift] = useState(null);
  const [isManager, setIsManager] = useState(false);

  const renderMain = () => {
    if (activeTab === "shifts")
      return <ShiftsTab setView={setView} setSelectedShift={setSelectedShift} />;
    if (activeTab === "community") return <CommunityTab />;
    if (activeTab === "profile") return <ProfileTab />;
    // home tab
    if (isManager) return <ManagerScreen />;
    return <HomeScreen setView={setView} setSelectedShift={setSelectedShift} />;
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#0F172A" }}>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&family=DM+Mono:wght@400;500;600&display=swap');
        * { -webkit-tap-highlight-color: transparent; }
        ::-webkit-scrollbar { display: none; }
      `}</style>

      <div
        className="relative overflow-hidden shadow-2xl"
        style={{ width: "100%", maxWidth: 430, minHeight: "100vh", background: C.pearl, fontFamily: "'DM Sans', sans-serif" }}
      >
        <StatusBar />

        {/* Mode toggle */}
        <div className="flex items-center gap-2 px-5 py-2" style={{ background: "#F1F5F9" }}>
          <span className="text-xs text-slate-400 font-medium flex-1">View as:</span>
          <button onClick={() => setIsManager(false)}
            className="px-3 py-1.5 rounded-full text-xs font-bold transition-all"
            style={{ background: !isManager ? C.blue : "transparent", color: !isManager ? "white" : "#94A3B8" }}>
            Technician
          </button>
          <button onClick={() => setIsManager(true)}
            className="px-3 py-1.5 rounded-full text-xs font-bold transition-all"
            style={{ background: isManager ? C.teal : "transparent", color: isManager ? "white" : "#94A3B8" }}>
            Manager
          </button>
        </div>

        <TopHeader />

        <div className="relative flex flex-col" style={{ minHeight: "calc(100vh - 120px)" }}>
          {renderMain()}
          <BottomNav active={activeTab} setActive={setActiveTab} setView={setView} />
        </div>

        {/* Detail Screen slides over everything */}
        <AnimatePresence>
          {view === "detail" && (
            <DetailScreen
              shift={selectedShift}
              onBack={() => setView("home")}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
