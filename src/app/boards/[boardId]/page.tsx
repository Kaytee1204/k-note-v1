"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { BoardTable } from "@/components/board-table";
import { Board, StandupEntry } from "@/types";
import {
  ArrowLeft,
  Trash2,
  Loader2,
  AlertCircle,
  Layers,
  Calendar,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function BoardDetailPage() {
  const params = useParams();
  const boardId = params.boardId as string;
  const router = useRouter();

  const [board, setBoard] = useState<Board | null>(null);
  const [entries, setEntries] = useState<StandupEntry[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Check auth status
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        setIsLoggedIn(!!data.isLoggedIn);
      })
      .catch(() => setIsLoggedIn(false));
  }, []);

  // Fetch Board Detail & Entries
  const fetchBoardDetail = useCallback(async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch(`/api/boards/${boardId}`);
      if (!res.ok) throw new Error("Bảng không tồn tại hoặc đã bị xóa");

      const data = await res.json();
      setBoard(data);
      setEntries(data.entries || []);
    } catch (err: any) {
      console.error("Lỗi tải Bảng:", err);
      setErrorMsg(err.message || "Đã xảy ra lỗi khi lấy dữ liệu Bảng");
    } finally {
      setIsLoading(false);
    }
  }, [boardId]);

  useEffect(() => {
    fetchBoardDetail();
  }, [fetchBoardDetail]);

  // Add new row to Board directly - Append to bottom of entries array
  const handleAddEntryRow = async (userName?: string) => {
    if (!isLoggedIn) {
      alert("Bạn cần Đăng nhập để thêm dòng công việc!");
      return;
    }

    try {
      const res = await fetch(`/api/boards/${boardId}/entries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName: userName || "Thành viên Mới",
          yesterdayTask: "",
          yesterdayStatus: "DONE",
          todayTask: "",
          todayStatus: "IN_PROGRESS",
        }),
      });

      if (res.ok) {
        const newEntry = await res.json();
        setEntries((prev) => [...prev, newEntry]);
      }
    } catch (err) {
      console.error("Lỗi chèn dòng mới:", err);
    }
  };

  // Inline update entry
  const handleUpdateEntry = async (id: string, updatedFields: Partial<StandupEntry>) => {
    if (!isLoggedIn) return;

    // Optimistic UI update
    setEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updatedFields } : e))
    );

    try {
      await fetch(`/api/entries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFields),
      });
    } catch (err) {
      console.error("Lỗi cập nhật entry:", err);
    }
  };

  // Delete entry row
  const handleDeleteEntry = async (id: string) => {
    if (!isLoggedIn) return;
    if (!confirm("Bạn có chắc chắn muốn xóa dòng công việc này khỏi Bảng?")) return;

    // Optimistic delete
    setEntries((prev) => prev.filter((e) => e.id !== id));

    try {
      await fetch(`/api/entries/${id}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.error("Lỗi xóa dòng:", err);
    }
  };

  // Delete Board
  const handleDeleteBoard = async () => {
    if (!board || !isLoggedIn) return;
    if (
      !confirm(
        `Bạn có chắc chắn muốn XÓA BẢNG "${board.name}" không? Tất cả các dòng trong Bảng sẽ bị xóa vĩnh viễn.`
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`/api/boards/${boardId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.push("/boards");
      }
    } catch (err) {
      console.error("Lỗi xóa Bảng:", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 flex flex-col transition-colors duration-300">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-4 sm:space-y-6">
        {/* Top Control Bar & Board Info */}
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between">
            <Link
              href="/boards"
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-500 hover:text-neonPink-500 dark:text-zinc-400 dark:hover:text-neonPink-400 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Danh sách Bảng</span>
            </Link>

            <span className="text-[11px] sm:text-xs font-mono text-slate-400 dark:text-zinc-500">
              #{boardId.substring(0, 8)}
            </span>
          </div>

          {/* Board Main Title Banner */}
          {board && (
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-900/90 shadow-sm backdrop-blur-md">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <div className="p-2 rounded-xl bg-neonPink-500/10 text-neonPink-500 border border-neonPink-500/30 shrink-0">
                    <Layers className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-zinc-100">
                    {board.name}
                  </h1>
                </div>
                {board.description && (
                  <p className="text-xs text-slate-500 dark:text-zinc-400 pl-1">
                    {board.description}
                  </p>
                )}
                <div className="flex items-center space-x-2 pt-1 text-[11px] text-slate-400 dark:text-zinc-500">
                  <Calendar className="w-3.5 h-3.5 text-neonPink-500" />
                  <span>Tạo: {formatDate(board.createdAt)}</span>
                  <span>•</span>
                  <span>{entries.length} dòng</span>
                </div>
              </div>

              {/* Action: Delete Board - ONLY for Logged In users */}
              {isLoggedIn && (
                <div className="flex items-center space-x-2 self-start md:self-auto">
                  <button
                    type="button"
                    onClick={handleDeleteBoard}
                    className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-bold text-rose-500 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition-all"
                    title="Xóa Bảng này"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Xóa Bảng</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Error Notice */}
        {errorMsg && (
          <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-500 flex items-center space-x-3 text-sm font-medium">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Loading Spinner or Board Interactive Table */}
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 text-neonPink-500 animate-spin" />
            <p className="text-sm font-medium text-slate-500 dark:text-zinc-400">
              Đang tải bảng K-Note...
            </p>
          </div>
        ) : (
          <BoardTable
            entries={entries}
            isReadOnly={!isLoggedIn}
            onUpdateEntry={handleUpdateEntry}
            onAddEntryRow={handleAddEntryRow}
            onDeleteEntry={handleDeleteEntry}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-zinc-800/80 py-6 text-center text-xs text-slate-400 dark:text-zinc-500">
        <p>© 2026 K-Note Software Team • Mobile Responsive Workspace</p>
      </footer>
    </div>
  );
}
