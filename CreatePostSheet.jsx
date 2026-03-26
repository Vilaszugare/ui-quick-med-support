import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Image as ImageIcon } from "lucide-react";
import { C, F } from "./MedShift_Phase12_15";

const CreatePostSheet = ({ open, onClose, onSubmit, currentUser }) => {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (text.trim()) {
      onSubmit(text);
      setText("");
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
            style={{ background: C.card, height: "70vh" }}
            initial={{ y:"100%" }} animate={{ y:0 }} exit={{ y:"100%" }}
            transition={{ type:"spring", stiffness:340, damping:38 }}
          >
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom:"1px solid #F1F5F9" }}>
              <h2 className="font-black text-lg" style={{ color:C.blue, fontFamily:F.head }}>
                Create New Post
              </h2>
              <button onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 transition-colors hover:bg-slate-200">
                <X size={16} color={C.blue}/>
              </button>
            </div>

            <div className="flex-1 p-5 flex flex-col">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center font-black text-white text-sm"
                  style={{ background:`linear-gradient(135deg, ${C.blue}, #0F2744)` }}>
                  {currentUser?.full_name ? currentUser.full_name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2) : "U"}
                </div>
                <div>
                  <p className="font-bold text-sm leading-tight" style={{ color:C.blue, fontFamily:F.head }}>
                    {currentUser?.full_name || "Unknown User"}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">{currentUser?.role === "manager" ? "Hospital Manager" : "Medical Technician"}</p>
                </div>
              </div>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Share a medical update, urgent need, or news..."
                className="w-full flex-1 resize-none outline-none text-base text-slate-700 placeholder:text-slate-300 bg-transparent"
                style={{ fontFamily:F.head }}
                autoFocus
              />
            </div>

            <div className="flex items-center justify-between px-5 py-4" style={{ borderTop:"1px solid #F1F5F9" }}>
              <button className="w-12 h-12 rounded-2xl flex items-center justify-center transition-colors hover:bg-teal-100/50"
                style={{ background: `${C.teal}12` }}>
                <ImageIcon size={20} color={C.teal} />
              </button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleSubmit}
                className="px-6 py-3.5 rounded-2xl font-black text-sm text-white shadow-lg"
                style={{ background: C.teal, boxShadow: `0 4px 14px ${C.teal}40`, opacity: text.trim() ? 1 : 0.6 }}>
                Post to Community
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CreatePostSheet;
