import type { Metadata } from "next";
import ApplicationForm from "./ApplicationForm";

export const metadata: Metadata = {
  title: "Apply to be a PetSaathi | Premium Pet Care Jobs",
  description: "Join the most trusted network of pet care professionals in India.",
};

export default function ApplyPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center py-20 px-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary-600/20 blur-[150px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="z-10 w-full max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4 tracking-tight">Become a PetSaathi</h1>
          <p className="text-lg text-slate-400 max-w-lg mx-auto">
            Join our elite network of trusted pet sitters and walkers. Set your own schedule, build relationships with pets, and earn reliably.
          </p>
        </div>
        
        <ApplicationForm />
      </div>
    </div>
  );
}
