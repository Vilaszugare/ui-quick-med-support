import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown, Zap } from "lucide-react";
import { C, F } from "./MedShift_Phase12_15";

const ROLE_OPTIONS = [
  "",
  "Radiologic Technician (X-Ray Tech)",
  "MRI Technician",
  "CT (Computed Tomography) Technician",
  "Diagnostic Medical Sonographer (Ultrasound Technician)",
  "Cardiovascular Technician",
  "EKG/ECG Technician",
  "Neurodiagnostic Technician (EEG Tech)",
  "Medical Laboratory Technician (MLT)",
  "Phlebotomy Technician (Phlebotomist)",
  "Histotechnician",
  "Surgical Technician (Operating Room Tech)",
  "Anesthesia Technician",
  "Dialysis Technician",
  "Emergency Medical Technician (EMT)",
  "Respiratory Technician",
  "Pharmacy Technician",
  "Central Sterile Processing Technician",
  "Ophthalmic Technician",
  "Dental Technician",
  "Health Information Technician (Medical Records Tech)"
];

const CreateShiftSheet = ({ open, onClose, onSubmit }) => {
  const [title, setTitle] = useState("");
  const [roleType, setRoleType] = useState("");
  const [dateSelection, setDateSelection] = useState("Today");
  const [customDate, setCustomDate] = useState("");
  const [time, setTime] = useState("16:00");
  const [payAmount, setPayAmount] = useState("800");
  const [payPeriod, setPayPeriod] = useState("/hr");
  const [urgent, setUrgent] = useState(true);

  const handleSubmit = () => {
    if (title.trim()) {
      onSubmit({ 
        title, 
        roleType, 
        dateSelection, 
        customDate, 
        time, 
        payAmount, 
        payPeriod, 
        urgent 
      });
      setTitle("");
      setRoleType("");
      setDateSelection("Today");
      setCustomDate("");
      setTime("16:00");
      setPayAmount("800");
      setPayPeriod("/hr");
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="absolute inset-0 z-[60] bg-black/40 backdrop-blur-sm"
            initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            onClick={onClose}/>

          <motion.div
            className="absolute bottom-0 left-0 right-0 z-[70] flex flex-col rounded-t-3xl overflow-hidden shadow-2xl"
            style={{ background: C.card, height: "75vh" }}
            initial={{ y:"100%" }} animate={{ y:0 }} exit={{ y:"100%" }}
            transition={{ type:"spring", stiffness:340, damping:38 }}
          >
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom:"1px solid #F1F5F9" }}>
              <h2 className="font-black text-lg" style={{ color:C.blue, fontFamily:F.head }}>
                Post a Shift
              </h2>
              <button onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 transition-colors hover:bg-slate-200">
                <X size={16} color={C.blue}/>
              </button>
            </div>

            <div className="flex-1 p-5 flex flex-col gap-4 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block" style={{ fontFamily:F.mono }}>Equipment / Role Required</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Urgent X-Ray Technician"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none text-sm font-semibold text-slate-800 focus:border-teal-500 focus:bg-white transition-colors"
                  style={{ fontFamily:F.head }}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block" style={{ fontFamily:F.mono }}>Type of Role</label>
                <div className="relative">
                  <select
                    value={roleType}
                    onChange={(e) => setRoleType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none text-sm font-semibold text-slate-800 focus:border-teal-500 focus:bg-white transition-colors appearance-none pr-10"
                    style={{ fontFamily:F.head }}
                  >
                    {ROLE_OPTIONS.map((opt, i) => (
                      <option key={i} value={opt}>{opt || "Select Role Type..."}</option>
                    ))}
                  </select>
                  <div className="absolute top-1/2 right-4 -translate-y-1/2 pointer-events-none">
                    <ChevronDown size={16} color="#94A3B8"/>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block" style={{ fontFamily:F.mono }}>Date</label>
                <div className="flex gap-2">
                  {["Today", "Tomorrow", "Custom"].map(opt => (
                    <button key={opt} onClick={() => setDateSelection(opt)}
                      className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-colors border ${dateSelection === opt ? "bg-teal-50 border-teal-500 text-teal-700 shadow-sm" : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100"}`}>
                      {opt}
                    </button>
                  ))}
                </div>
                {dateSelection === "Custom" && (
                  <input
                    type="date"
                    value={customDate}
                    onChange={(e) => setCustomDate(e.target.value)}
                    className="w-full mt-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none text-sm font-semibold text-slate-800 focus:border-teal-500 focus:bg-white transition-colors"
                  />
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block" style={{ fontFamily:F.mono }}>Time</label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none text-sm font-semibold text-slate-800 focus:border-teal-500 focus:bg-white transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block" style={{ fontFamily:F.mono }}>Pay Rate</label>
                  <div className="flex items-center w-full bg-slate-50 border border-slate-200 rounded-xl overflow-hidden focus-within:border-teal-500 focus-within:bg-white transition-colors">
                    <span className="pl-3 pr-1 text-slate-500 font-bold">₹</span>
                    <input
                      type="number"
                      value={payAmount}
                      onChange={(e) => setPayAmount(e.target.value)}
                      className="w-1/2 bg-transparent py-3 outline-none text-sm font-semibold text-teal-700"
                      style={{ fontFamily:F.head }}
                    />
                    <select
                      value={payPeriod}
                      onChange={(e) => setPayPeriod(e.target.value)}
                      className="w-1/2 bg-transparent py-3 pr-2 outline-none text-xs font-bold text-slate-500 cursor-pointer text-right"
                    >
                      {["/hr", "/day", "/half day", "/full day"].map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl border border-amber-200 bg-amber-50 mt-2">
                <div>
                  <p className="font-bold text-sm text-amber-900 mb-0.5">High Urgency</p>
                  <p className="text-xs text-amber-700">Notifies all available technicians instantly</p>
                </div>
                <button onClick={() => setUrgent(!urgent)} className="w-12 h-6 rounded-full px-1 flex items-center transition-all bg-amber-400">
                  <motion.div className="w-4 h-4 rounded-full bg-white shadow-sm"
                    animate={{ x: urgent ? 24 : 0 }}
                    transition={{ type:"spring", stiffness:500, damping:30 }}/>
                </button>
              </div>
            </div>

            <div className="p-5" style={{ borderTop:"1px solid #F1F5F9" }}>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleSubmit}
                className="w-full py-3.5 rounded-2xl font-black text-sm text-white shadow-lg flex items-center justify-center gap-2"
                style={{ background: C.teal, boxShadow: `0 4px 14px ${C.teal}40`, opacity: title.trim() ? 1 : 0.6 }}>
                <Zap size={16} fill="white"/> Post Urgent Shift
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CreateShiftSheet;
