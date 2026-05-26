import { LoginForm } from "./_components/login-form";

import { ThemeToggle } from "@/components/theme-toggle";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6 font-sans relative">
      {/* Theme Toggle in top right */}
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-[400px] space-y-6">
        {/* Simple Brand Header */}
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center shadow-sm mb-4">
            <span className="text-primary-foreground font-bold text-2xl">M</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Melo ERP Lite</h1>
          <p className="text-muted-foreground text-sm font-medium mt-1">Administrative Portal</p>
        </div>

        {/* Simplified Login Card */}
        <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
          <LoginForm />
        </div>

        {/* Simple Footer info */}
        <p className="text-center text-xs text-muted-foreground opacity-50">
          © 2024 Melo Technologies
        </p>
      </div>
    </div>
  );
}




