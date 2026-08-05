"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Terminal, LogOut, Layers } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    // Read email safely from cookie
    const match = document.cookie.match(new RegExp("(^| )user_email=([^;]+)"));
    if (match) {
      setUserEmail(decodeURIComponent(match[2]));
    }
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // Ignore
    }
    router.push("/login");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-zinc-800/80 bg-white/90 dark:bg-zinc-950/80 backdrop-blur-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        {/* App Logo: K-Note */}
        <div className="flex items-center space-x-3 sm:space-x-8">
          <Link href="/boards" className="flex items-center space-x-2.5 sm:space-x-3 group">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-neonPink-500 to-pink-600 flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform duration-300 shrink-0">
              <Terminal className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight bg-gradient-to-r from-neonPink-500 via-pink-400 to-rose-400 bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(255,45,117,0.4)]">
                  K-Note
                </h1>
                <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold bg-neonPink-500/10 text-neonPink-500 border border-neonPink-500/30 uppercase tracking-widest">
                  PRO
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400 font-medium hidden sm:block">
                Quản lý Bảng Công việc & Standup Team
              </p>
            </div>
          </Link>

          {/* Nav Link */}
          <nav className="hidden sm:flex items-center space-x-1">
            <Link
              href="/boards"
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all bg-neonPink-500/10 text-neonPink-500 border border-neonPink-500/30 shadow-glowSm"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Bảng Công Việc</span>
            </Link>
          </nav>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          <ThemeToggle />

          {/* User Email & Logout */}
          <div className="flex items-center space-x-2 pl-2 border-l border-slate-200 dark:border-zinc-800">
            {userEmail && (
              <span className="hidden md:inline-block text-xs font-mono text-slate-500 dark:text-zinc-400 max-w-[120px] truncate" title={userEmail}>
                {userEmail}
              </span>
            )}

            <button
              onClick={handleLogout}
              type="button"
              title="Đăng xuất khỏi K-Note"
              className="p-2 sm:p-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:border-rose-500/30 transition-all duration-300"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
