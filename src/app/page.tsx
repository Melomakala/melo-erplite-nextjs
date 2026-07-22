import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  Clock,
  Settings,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { LogoutButton } from "@/components/logout-button";
import { modules } from "@/constants/modules";

export default function Home() {
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? "Good Morning" : currentHour < 18 ? "Good Afternoon" : "Good Evening";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-6 font-sans">
      <div className="max-w-4xl w-full">

        {/* Header */}
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary rounded-md flex items-center justify-center shadow-lg">
                <span className="text-primary-foreground font-bold text-xl">M</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">Melo ERP Lite</h1>
                <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Enterprise Resource Planning</p>
              </div>
            </div>
            <h2 className="text-4xl font-bold text-foreground">
              {greeting}, Admin
            </h2>
            <p className="text-muted-foreground mt-2 text-lg">
              Select a workspace module to begin your operations.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-card p-4 rounded-lg border border-border shadow-sm self-start md:self-auto">
            <div className="p-2 bg-muted rounded-lg">
              <Clock className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-foreground leading-none">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </p>
              <p className="text-xs text-muted-foreground mt-1 uppercase tracking-tighter">System Status: Online</p>
            </div>
          </div>
        </header>

        {/* Module Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 transition-all duration-500">
          {modules.map((module) => {
            const Icon = module.icon;
            return (
              <Link key={module.title} href={module.href}>
                <div className="group relative bg-card p-8 rounded-lg border border-border shadow-sm hover:shadow-xl hover:border-accent transition-all duration-300 overflow-hidden cursor-pointer">
                  <div className="relative z-10">
                    <div className={`w-14 h-14 rounded-lg ${module.color} border flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-1">{module.title}</h3>
                    <p className="text-muted-foreground">{module.description}</p>
                  </div>
                  <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                    <Icon className="w-24 h-24" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Action Bar */}
        <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-6 p-6 rounded-lg border border-slate-200 dark:border-slate-800 shadow-md dark:shadow-xl bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white transition-colors duration-300">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-500/10 dark:bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-md">
              <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="font-bold text-lg leading-tight text-slate-900 dark:text-white">Full Access Granted</p>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Verified Administrative Session</p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <ThemeToggle className="h-12 w-12 bg-slate-200/70 dark:bg-white/10 border-slate-300 dark:border-white/20 text-slate-700 dark:text-white hover:bg-slate-300/70 dark:hover:bg-white/20 hover:text-slate-900 dark:hover:text-white" />
            <LogoutButton className="h-12 px-6 text-slate-700 dark:text-white hover:bg-slate-200/70 dark:hover:bg-white/10 rounded-md font-bold flex gap-2" />
            <Link href="/settings">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold h-12 w-12 p-0 rounded-md transition-all">
                <Settings className="w-6 h-6" />
              </Button>
            </Link>
          </div>
        </div>

        <footer className="mt-12 text-center text-slate-400 text-sm">
          <p>© {new Date().getFullYear()} Melo ERP Lite v1.0.0 • Internal Administrative System</p>
        </footer>
      </div>
    </div>
  );
}
