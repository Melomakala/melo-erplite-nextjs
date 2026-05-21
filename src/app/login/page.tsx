import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Lock, User, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-[400px]">
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center shadow-lg mb-4">
            <span className="text-white font-bold text-2xl">M</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Melo ERP Lite</h1>
          <p className="text-slate-500 text-sm font-medium mt-1 uppercase tracking-widest">Administrative Portal</p>
        </div>

        {/* Login Card */}
        <div className="bg-white p-10 rounded-[32px] border border-slate-200 shadow-sm">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-900">Sign In</h2>
            <p className="text-slate-400 text-sm mt-1">Please enter your workspace details.</p>
          </div>

          <form className="space-y-6">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1" htmlFor="email">
                Email Address
              </label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-slate-900 transition-colors" />
                <input 
                  id="email"
                  type="email" 
                  placeholder="name@company.com"
                  className="w-full h-12 pl-11 pr-4 bg-slate-50/50 border border-slate-200 rounded-2xl focus:outline-none focus:border-slate-900 focus:bg-white transition-all text-slate-900 placeholder:text-slate-300"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]" htmlFor="password">
                  Password
                </label>
                <Link href="#" className="text-[10px] font-bold text-slate-300 hover:text-slate-900 transition-colors uppercase tracking-widest">
                  Forgot?
                </Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-slate-900 transition-colors" />
                <input 
                  id="password"
                  type="password" 
                  placeholder="••••••••"
                  className="w-full h-12 pl-11 pr-4 bg-slate-50/50 border border-slate-200 rounded-2xl focus:outline-none focus:border-slate-900 focus:bg-white transition-all text-slate-900 placeholder:text-slate-300"
                />
              </div>
            </div>

            <div className="pt-2">
              <Link href="/dashboard">
                <Button className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-base font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  Access System
                </Button>
              </Link>
            </div>
          </form>
        </div>

        {/* Footer info */}
        <div className="mt-8 flex flex-col items-center gap-4">
          <p className="text-slate-400 text-xs">
            Don&apos;t have an account? <Link href="/register" className="text-slate-900 font-bold hover:underline decoration-2 underline-offset-4">Register</Link>
          </p>
          <div className="flex gap-4 text-[10px] text-slate-300 font-bold uppercase tracking-widest">
            <Link href="#" className="hover:text-slate-400">Status</Link>
            <span>•</span>
            <Link href="#" className="hover:text-slate-400">Privacy</Link>
            <span>•</span>
            <Link href="#" className="hover:text-slate-400">Legal</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
