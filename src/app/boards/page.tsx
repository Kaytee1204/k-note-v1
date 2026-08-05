"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import {
  Layers,
  Plus,
  X,
  Loader2,
  Calendar,
  Sparkles,
  ArrowRight,
  FileQuestion,
  Trash2,
  Lock,
  LogIn,
} from "lucide-react";
import { Board } from "@/types";
import { formatDate, getVietnamISODate } from "@/lib/utils";

export default function BoardsListPage() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [filteredBoards, setFilteredBoards] = useState<Board[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Selected Date state (initialized to today's Vietnam date 2026-08-06)
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [boardName, setBoardName] = useState("");
  const [boardDesc, setBoardDesc] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  // Check auth status
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        setIsLoggedIn(!!data.isLoggedIn);
      })
      .catch(() => setIsLoggedIn(false));
  }, []);

  // Initialize selectedDate on Client Mount (Read from sessionStorage if present, else Vietnam Today)
  useEffect(() => {
    const today = getVietnamISODate();
    const savedDate = typeof window !== "undefined" ? sessionStorage.getItem("knote_selected_date") : null;
    setSelectedDate(savedDate || today);
  }, []);

  const fetchBoards = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/boards");
      if (res.ok) {
        const data: Board[] = await res.json();
        setBoards(data);
      }
    } catch (err) {
      console.error("Lỗi tải danh sách Bảng:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBoards();
  }, [fetchBoards]);

  // Automatic filter by selectedDate & Save to sessionStorage to preserve across navigations
  useEffect(() => {
    if (!selectedDate) return;

    if (typeof window !== "undefined") {
      sessionStorage.setItem("knote_selected_date", selectedDate);
    }

    const filtered = boards.filter((b) => {
      const boardDate = getVietnamISODate(b.createdAt);
      return boardDate === selectedDate;
    });
    setFilteredBoards(filtered);
  }, [selectedDate, boards]);

  // Handle Create Board & Auto-redirect to /boards/[boardId]
  const handleCreateBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!boardName.trim()) return;

    if (!isLoggedIn) {
      alert("Bạn cần Đăng nhập để tạo Bảng mới!");
      router.push("/login");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/boards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: boardName,
          description: boardDesc,
        }),
      });

      const data = await res.json();

      if (res.ok && data.id) {
        setIsModalOpen(false);
        setBoardName("");
        setBoardDesc("");
        // Auto redirect to detail page /boards/[boardId]
        router.push(`/boards/${data.id}`);
      } else {
        alert(data.error || "Không thể tạo Bảng mới");
      }
    } catch (err) {
      console.error("Lỗi tạo bảng:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete Board
  const handleDeleteBoard = async (e: React.MouseEvent, boardId: string, boardName: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn) {
      alert("Bạn cần Đăng nhập để xóa Bảng!");
      return;
    }

    if (!confirm(`Bạn có chắc chắn muốn xóa Bảng "${boardName}" không? Tất cả dữ liệu của Bảng này sẽ bị xóa.`)) {
      return;
    }

    // Optimistic Delete
    setBoards((prev) => prev.filter((b) => b.id !== boardId));

    try {
      const res = await fetch(`/api/boards/${boardId}`, {
        method: "DELETE",
      });

      if (!res.ok) fetchBoards();
    } catch (err) {
      console.error("Lỗi xóa bảng:", err);
      fetchBoards();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 flex flex-col transition-colors duration-300">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-6 sm:space-y-8">
        {/* Banner & Controls Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-900/90 shadow-sm backdrop-blur-md">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Layers className="w-5 h-5 sm:w-6 sm:h-6 text-neonPink-500 shrink-0" />
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-zinc-100">
                K-Note Workspace
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Hôm nay: <span className="font-bold text-neonPink-500">{formatDate(new Date())}</span>
              {!isLoggedIn && (
                <span className="ml-2 font-medium text-amber-600 dark:text-amber-400">
                  (Chế độ Khách: Chỉ xem Bảng)
                </span>
              )}
            </p>
          </div>

          {/* Date Selector & Create Board Button */}
          <div className="flex flex-wrap items-center justify-between sm:justify-start gap-2.5">
            {/* Date Selector */}
            <div className="flex items-center space-x-2 bg-slate-100 dark:bg-zinc-950 px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 flex-1 sm:flex-none">
              <Calendar className="w-4 h-4 text-neonPink-500 shrink-0" />
              <span className="text-xs font-bold text-slate-600 dark:text-zinc-400 whitespace-nowrap">Ngày:</span>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-900 dark:text-zinc-100 outline-none cursor-pointer w-full"
              />
            </div>

            {/* "+ Tạo Bảng Mới" Button - Show for Logged In users, or link to Login for Guests */}
            {isLoggedIn ? (
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center justify-center space-x-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-neonPink-500 to-pink-600 shadow-glow hover:shadow-glowLg transition-all active:scale-95 shrink-0"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>+ Tạo Bảng Mới</span>
              </button>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center justify-center space-x-1.5 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm text-slate-700 dark:text-zinc-200 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 transition-all shrink-0"
                title="Đăng nhập để tạo Bảng mới"
              >
                <Lock className="w-3.5 h-3.5 text-amber-500" />
                <span>Đăng Nhập Để Tạo Bảng</span>
              </Link>
            )}
          </div>
        </div>

        {/* Guest Banner Prompt */}
        {!isLoggedIn && (
          <div className="p-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-300 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm font-medium">
            <div className="flex items-center space-x-2">
              <Lock className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Bạn đang xem Bảng K-Note ở chế độ <strong>Khách (Guest)</strong>. Bạn chỉ có thể xem dữ liệu. Đăng nhập để tạo Bảng và ghi chú!</span>
            </div>
            <Link
              href="/login"
              className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl font-bold text-xs text-white bg-amber-600 hover:bg-amber-700 transition-colors shrink-0"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Đăng Nhập Ngay</span>
            </Link>
          </div>
        )}

        {/* Board Cards Grid or Empty State */}
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 text-neonPink-500 animate-spin" />
            <p className="text-sm text-slate-500 dark:text-zinc-400">Đang tải danh sách Bảng...</p>
          </div>
        ) : filteredBoards.length === 0 ? (
          /* Empty State */
          <div className="py-12 sm:py-16 px-4 text-center rounded-2xl border border-dashed border-slate-300 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 space-y-4">
            <div className="w-12 h-12 rounded-full bg-neonPink-500/10 text-neonPink-500 mx-auto flex items-center justify-center">
              <FileQuestion className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-zinc-200">
                {selectedDate ? `Chưa có Bảng nào được tạo trong ngày ${selectedDate}` : "Chưa có Bảng công việc nào"}
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-sm mx-auto mt-1">
                {isLoggedIn
                  ? 'Hãy nhấn nút "+ Tạo Bảng Mới" để khởi tạo Bảng Standup cho hôm nay!'
                  : "Đăng nhập ngay để bắt đầu tạo Bảng Standup cho nhóm của bạn!"}
              </p>
            </div>
            {isLoggedIn ? (
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-neonPink-500 to-pink-600 shadow-glow hover:shadow-glowLg transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>+ Tạo Bảng Mới Ngay</span>
              </button>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-neonPink-500 to-pink-600 shadow-glow hover:shadow-glowLg transition-all"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Đăng Nhập Để Tạo Bảng</span>
              </Link>
            )}
          </div>
        ) : (
          /* Boards Grid - Responsive grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredBoards.map((board) => (
              <Link
                key={board.id}
                href={`/boards/${board.id}`}
                className="group relative flex flex-col justify-between p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-glowSm hover:border-neonPink-500/40 transition-all duration-300"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-neonPink-500/10 text-neonPink-500 border border-neonPink-500/30 uppercase">
                      STANDUP BOARD
                    </span>

                    {/* Delete Board Action - ONLY for Logged In Users */}
                    {isLoggedIn && (
                      <button
                        onClick={(e) => handleDeleteBoard(e, board.id, board.name)}
                        type="button"
                        title="Xóa Bảng này"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors z-10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-zinc-100 group-hover:text-neonPink-500 transition-colors">
                    {board.name}
                  </h3>

                  {board.description && (
                    <p className="text-xs text-slate-500 dark:text-zinc-400 line-clamp-2">
                      {board.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100 dark:border-zinc-800/80 text-xs font-medium text-slate-400 dark:text-zinc-500">
                  <div className="flex items-center space-x-1.5">
                    <Calendar className="w-3.5 h-3.5 text-neonPink-500" />
                    <span>{formatDate(board.createdAt)}</span>
                  </div>
                  <span className="inline-flex items-center space-x-1 text-neonPink-500 font-bold group-hover:translate-x-1 transition-transform">
                    <span>Mở Bảng</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* Modal: Create Board */}
      {isModalOpen && isLoggedIn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-glowLg p-5 sm:p-6 space-y-4 sm:space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-neonPink-500" />
                <h3 className="text-base sm:text-lg font-bold">Tạo Bảng Công Việc Mới</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200" />
              </button>
            </div>

            <form onSubmit={handleCreateBoard} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-zinc-400 mb-1.5">
                  Tên Bảng (Ví dụ: Daily Standup Sprint 1)
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: Worklog Nhóm Frontend Sprint 15"
                  value={boardName}
                  onChange={(e) => setBoardName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 focus:outline-none focus:border-neonPink-500 focus:ring-1 focus:ring-neonPink-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-zinc-400 mb-1.5">
                  Mô tả Bảng (Tùy chọn)
                </label>
                <textarea
                  rows={3}
                  placeholder="Mô tả mục tiêu của Bảng..."
                  value={boardDesc}
                  onChange={(e) => setBoardDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 focus:outline-none focus:border-neonPink-500 focus:ring-1 focus:ring-neonPink-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-neonPink-500 to-pink-600 shadow-glow disabled:opacity-50"
                >
                  {isSubmitting ? "Đang tạo..." : "Tạo & Mở Bảng"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-zinc-800/80 py-6 text-center text-xs text-slate-400 dark:text-zinc-500">
        <p>© 2026 K-Note Software Team • Mobile Responsive Workspace</p>
      </footer>
    </div>
  );
}
