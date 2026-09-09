import type { Metadata } from "next";
import { Suspense } from "react";
import RegisterForm from "./RegisterForm";

export const metadata: Metadata = {
  title: "Create an Account | PetSaathi",
  description: "Join PetSaathi as a pet parent or verified pet sitter in Ahmedabad.",
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center relative overflow-hidden py-12">
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-600/30 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="z-10 w-full max-w-lg px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-display font-bold text-white mb-2 tracking-tight">PetSaathi</h1>
          <p className="text-slate-400">Join our trusted pet care community in Ahmedabad</p>
        </div>

        <Suspense fallback={<div className="text-white text-center py-10">Loading registration form...</div>}>
          <RegisterForm />
        </Suspense>
      </div>
    </div>
  );
}
