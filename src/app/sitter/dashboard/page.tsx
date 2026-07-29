"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, AlertTriangle, ShieldCheck, Video, FileText, UploadCloud, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SitterDashboard() {
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizStep, setQuizStep] = useState(0);

  const quizQuestions = [
    {
      q: "If a dog slips its collar during a walk, what is the first thing you should do?",
      options: ["Run after it", "Drop to the ground or run away to make them chase you", "Yell at the dog"],
      answer: 1
    },
    {
      q: "What human foods are strictly toxic to dogs?",
      options: ["Carrots and Apples", "Rice and Chicken", "Grapes, Chocolate, and Onions"],
      answer: 2
    },
    {
      q: "What should you do if the pet seems lethargic and refuses to eat for 24 hours?",
      options: ["Wait another day", "Force feed them", "Contact PetSaathi emergency support and the parent immediately"],
      answer: 2
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 p-6 md:p-10 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto space-y-8 relative z-10">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-display font-bold text-white tracking-tight">Sitter Portal</h1>
          <p className="text-slate-400 mt-2 text-lg">Manage your application status and assignments.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Verification Status */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="md:col-span-1 space-y-6">
            <div className="bg-slate-900/50 backdrop-blur-xl p-8 rounded-3xl border border-white/10 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <ShieldCheck className="w-8 h-8 text-amber-400" />
                  <h2 className="text-2xl font-bold text-white">L1 Profile</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center text-sm font-medium text-white bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 mr-2" /> Application Submitted
                  </div>
                  <div className={`flex items-center text-sm font-medium p-3 rounded-xl ${quizCompleted ? 'text-white bg-emerald-500/10 border-emerald-500/20 border' : 'text-amber-300 bg-amber-500/10 border border-amber-500/20'}`}>
                    {quizCompleted ? <CheckCircle2 className="w-5 h-5 text-emerald-400 mr-2" /> : <AlertTriangle className="w-5 h-5 mr-2" />} 
                    Safety Quiz {quizCompleted ? 'Passed' : 'Pending'}
                  </div>
                  <div className="flex items-center text-sm font-medium text-slate-500 bg-white/5 border border-white/10 p-3 rounded-xl opacity-50">
                    <Video className="w-5 h-5 mr-2" /> Interview Pending
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Action Center */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="md:col-span-2 space-y-6">
            <div className="bg-slate-900/50 backdrop-blur-xl p-8 rounded-3xl border border-white/10 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <AnimatePresence mode="wait">
              {!showQuiz && !quizCompleted && (
                <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative z-10">
                  <h2 className="text-2xl font-bold text-white mb-2">Required Action</h2>
                  <p className="text-slate-400 mb-6 text-lg">Complete the Pet Safety & Handling Quiz to unlock L2 Verification.</p>
                  <button onClick={() => setShowQuiz(true)} className="bg-primary-600 hover:bg-primary-500 text-white px-8 py-3 rounded-xl font-bold text-lg transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)]">
                    Start Safety Quiz
                  </button>
                </motion.div>
              )}

              {showQuiz && (
                <motion.div key="quiz" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="relative z-10">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-primary-400">Question {quizStep + 1} of {quizQuestions.length}</h3>
                    <span className="text-sm font-bold text-slate-500 bg-white/10 px-3 py-1 rounded-full">{Math.round((quizStep/quizQuestions.length)*100)}% Complete</span>
                  </div>
                  <h4 className="text-2xl font-bold text-white mb-8 leading-snug">{quizQuestions[quizStep].q}</h4>
                  <div className="space-y-4">
                    {quizQuestions[quizStep].options.map((opt, i) => (
                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        key={i}
                        onClick={() => {
                          if (quizStep < quizQuestions.length - 1) {
                            setQuizStep(s => s + 1);
                          } else {
                            setShowQuiz(false);
                            setQuizCompleted(true);
                          }
                        }}
                        className="w-full text-left p-5 rounded-2xl border border-white/10 bg-white/5 hover:border-primary-500/50 hover:bg-primary-500/10 transition-all font-medium text-slate-300 hover:text-white"
                      >
                        {opt}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {quizCompleted && (
                <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative z-10 text-center py-8">
                  <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/30">
                    <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-2">Quiz Passed!</h2>
                  <p className="text-slate-400 text-lg">You have successfully completed the safety assessment.</p>
                </motion.div>
              )}
              </AnimatePresence>
            </div>

            {/* Step 3: ID Verification */}
            <div className={`bg-slate-900/50 backdrop-blur-xl p-8 rounded-3xl border border-white/10 transition-opacity duration-500 ${quizCompleted ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
              <div className="flex items-start gap-5">
                <div className="bg-white/5 border border-white/10 p-3 rounded-2xl">
                  <UploadCloud className="w-8 h-8 text-slate-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-white text-xl">Identity Verification</h3>
                  <p className="text-slate-400 text-sm mt-1 mb-5">Upload a government-issued ID (Aadhaar or PAN) for background checks.</p>
                  <button disabled={!quizCompleted} className={`px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-colors ${quizCompleted ? 'bg-primary-600/20 text-primary-300 border border-primary-500/30 hover:bg-primary-500/30' : 'bg-white/5 text-slate-500'}`}>
                    Upload Document <AlertCircle className="w-4 h-4" />
                  </button>
                  {!quizCompleted && <p className="text-xs text-amber-500 font-bold tracking-wider uppercase mt-3">Available after Safety Quiz</p>}
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
