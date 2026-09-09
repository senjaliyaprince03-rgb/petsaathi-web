"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2, User, Mail, Phone, Lock, Heart, ShieldCheck } from "lucide-react";

export default function RegisterForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"PARENT" | "SITTER">("PARENT");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }

    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim() || undefined,
          password,
          role,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to register. Please try again.");
        setIsLoading(false);
        return;
      }

      // Automatically sign in upon registration
      const signInRes = await signIn("credentials", {
        redirect: false,
        email: email.trim().toLowerCase(),
        password,
      });

      if (!signInRes?.error) {
        if (role === "SITTER") {
          router.push("/profile");
        } else {
          router.push("/profile");
        }
      } else {
        // Fallback: registration succeeded, redirect to login
        router.push("/auth/login");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card p-8 sm:p-10 rounded-3xl shadow-2xl border border-white/10"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-3.5 text-sm text-red-400 bg-red-400/10 rounded-xl border border-red-400/20 text-center font-medium">
            {error}
          </div>
        )}

        {/* Role Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">
            I am joining as:
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole("PARENT")}
              className={`p-3.5 rounded-xl border text-sm font-medium flex items-center justify-center gap-2 transition-all ${
                role === "PARENT"
                  ? "border-primary-500 bg-primary-500/20 text-white shadow-[0_0_15px_rgba(37,99,235,0.25)]"
                  : "border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Heart className={`w-4 h-4 ${role === "PARENT" ? "text-primary-400" : ""}`} />
              Pet Parent
            </button>
            <button
              type="button"
              onClick={() => setRole("SITTER")}
              className={`p-3.5 rounded-xl border text-sm font-medium flex items-center justify-center gap-2 transition-all ${
                role === "SITTER"
                  ? "border-primary-500 bg-primary-500/20 text-white shadow-[0_0_15px_rgba(37,99,235,0.25)]"
                  : "border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              <ShieldCheck className={`w-4 h-4 ${role === "SITTER" ? "text-primary-400" : ""}`} />
              Pet Sitter
            </button>
          </div>
        </div>

        {/* Name */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-300" htmlFor="name">
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="name"
              name="name"
              type="text"
              aria-required="true"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm"
              placeholder="e.g. Rahul Sharma"
              required
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-300" htmlFor="email">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="email"
              name="email"
              type="email"
              aria-required="true"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm"
              placeholder="you@example.com"
              required
            />
          </div>
        </div>

        {/* Phone */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-300" htmlFor="phone">
            Phone Number <span className="text-slate-500 text-xs">(Optional)</span>
          </label>
          <div className="relative">
            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="phone"
              name="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm"
              placeholder="+91 98765 43210"
            />
          </div>
        </div>

        {/* Passwords grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-300" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                id="password"
                name="password"
                type="password"
                aria-required="true"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm"
                placeholder="Min 6 chars"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-300" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                aria-required="true"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm"
                placeholder="Re-enter"
                required
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary-600 hover:bg-primary-500 text-white rounded-xl px-4 py-3.5 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-slate-950 flex justify-center items-center disabled:opacity-70 shadow-[0_0_20px_rgba(37,99,235,0.35)] mt-2"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            `Create ${role === "SITTER" ? "Sitter" : "Parent"} Account`
          )}
        </button>

        {/* Link to login */}
        <div className="text-center pt-2">
          <p className="text-sm text-slate-400">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-primary-400 hover:text-primary-300 font-medium transition-colors underline-offset-4 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </motion.div>
  );
}
