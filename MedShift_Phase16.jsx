import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Shield, Activity, ArrowRight, CheckCircle } from 'lucide-react';
import { Capacitor } from '@capacitor/core';

const C = {
  blue: "#1E3A8A",
  teal: "#0D9488",
  green: "#10B981",
  bg: "#F8FAFC",
  card: "#FFFFFF",
  text: "#1E293B",
  subtext: "#64748B",
  border: "#E2E8F0"
};

const F = {
  head: "system-ui, -apple-system, sans-serif",
  body: "system-ui, -apple-system, sans-serif",
};
// DuckDNS Domain (Production)
// let rawUrl = import.meta.env.VITE_API_URL || "http://quickmedsupport.duckdns.org";

// LOCAL DEV (Active)
let rawUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";


if (rawUrl.endsWith("/")) rawUrl = rawUrl.slice(0, -1);
if (Capacitor.isNativePlatform() && rawUrl.includes("localhost")) {
  rawUrl = rawUrl.replace("localhost", "10.0.2.2");
}
const API_BASE = rawUrl;

export default function ManagerLoginScreen({ onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [focused, setFocused] = useState(null);
  const [loggingIn, setLoggingIn] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoggingIn(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role: "manager" })
      });
      
      if (res.status === 401) {
        setError("Unauthorized Manager Account");
        setLoggingIn(false);
        return;
      }
      
      if (!res.ok) throw new Error("Login failed");
      
      const data = await res.json();
      
      localStorage.setItem('medshift_role', 'manager');
      localStorage.setItem('medshift_user', JSON.stringify(data.user));
      
      if (onSuccess) onSuccess(data.user);
      
      window.location.hash = "#phase12-15";
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred. Please try again.");
    }
    setLoggingIn(false);
  };

  return (
    <div className="flex flex-col min-h-screen relative items-center justify-center p-6" 
      style={{ background: "#F1F5F9", fontFamily: F.body, overflow: 'hidden' }}>
      
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full opacity-30 mix-blend-multiply blur-3xl pointer-events-none" style={{ background: C.teal }} />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full opacity-20 mix-blend-multiply blur-3xl pointer-events-none" style={{ background: C.blue }} />

      <motion.div 
        initial={{ opacity: 0, y: 30 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-sm relative z-10"
      >
        {/* Logo Header */}
        <div className="flex flex-col items-center mb-8">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
            style={{ 
              background: `linear-gradient(135deg, ${C.blue}, #3B82F6)`,
              boxShadow: `0 12px 24px -8px ${C.blue}60`
            }}>
            <Activity size={32} color="white" />
          </motion.div>
          <h1 className="text-3xl font-black text-center tracking-tight" style={{ color: C.blue, fontFamily: F.head }}>
            MedShift
          </h1>
          <p className="text-sm font-medium mt-1 uppercase tracking-widest" style={{ color: C.teal }}>
            Hospital Platform
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-3xl p-8" style={{ background: C.card, boxShadow: '0 20px 40px -15px rgba(0,0,0,0.05), 0 0 0 1px rgba(0,0,0,0.02)' }}>
          <div className="flex items-center justify-center gap-2 mb-8 pb-4 border-b border-slate-100">
            <Shield size={16} color={C.teal} />
            <h2 className="text-sm font-bold tracking-wide text-slate-700 uppercase">Manager Secure Login</h2>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            {error && (
              <div className="text-center font-bold text-sm text-red-500 mb-2 p-3 bg-red-50 rounded-xl" style={{ fontFamily: F.head }}>
                {error}
              </div>
            )}
            {/* Email Field */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail size={18} color={focused === 'email' ? C.teal : "#94A3B8"} className="transition-colors duration-300" />
              </div>
              <input
                type="email"
                required
                placeholder="Manager Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocused('email')}
                onBlur={() => setFocused(null)}
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl text-sm font-medium outline-none transition-all duration-300 bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:bg-white"
                style={{ 
                  boxShadow: focused === 'email' ? `0 0 0 4px ${C.teal}15` : 'none',
                  borderColor: focused === 'email' ? C.teal : C.border
                }}
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock size={18} color={focused === 'password' ? C.teal : "#94A3B8"} className="transition-colors duration-300" />
              </div>
              <input
                type="password"
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocused('password')}
                onBlur={() => setFocused(null)}
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl text-sm font-medium outline-none transition-all duration-300 bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:bg-white"
                style={{ 
                  boxShadow: focused === 'password' ? `0 0 0 4px ${C.teal}15` : 'none',
                  borderColor: focused === 'password' ? C.teal : C.border
                }}
              />
            </div>

            {/* Submit Button */}
            <motion.button
              whileTap={!loggingIn ? { scale: 0.98 } : {}}
              type="submit"
              disabled={loggingIn || !email || !password}
              className="w-full mt-2 rounded-2xl py-4 flex items-center justify-center font-bold text-white text-sm transition-all relative overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed"
              style={{
                background: `linear-gradient(135deg, ${C.blue}, #2563EB)`,
                boxShadow: `0 8px 20px -6px ${C.blue}50`
              }}
            >
              {loggingIn ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Authenticating...
                </motion.div>
              ) : (
                <span className="flex items-center gap-2">
                  Secure Login <ArrowRight size={16} />
                </span>
              )}
            </motion.button>
          </form>

          {/* Forgot Password */}
          <div className="mt-8 text-center">
            <button className="text-xs font-semibold hover:underline" style={{ color: C.subtext }}>
              Forgot Password?
            </button>
          </div>
        </div>

        {/* Security Badge */}
        <div className="mt-8 flex items-center justify-center gap-2 text-xs font-medium text-slate-400">
          <CheckCircle size={14} color={C.green} />
          <span>256-bit Encrypted Connection</span>
        </div>
      </motion.div>
    </div>
  );
}
