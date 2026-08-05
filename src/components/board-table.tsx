"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Check, Trash2, Plus, Lock, LogIn } from "lucide-react";
import { StandupEntry, WorkStatus } from "@/types";
import { formatDateTime } from "@/lib/utils";

interface BoardTableProps {
  entries: StandupEntry[];
  currentUserId?: string;
  isReadOnly?: boolean;
  onUpdateEntry: (id: string, updatedFields: Partial<StandupEntry>) => Promise<void>;
  onAddEntryRow: (userName?: string) => Promise<void>;
  onDeleteEntry: (id: string) => Promise<void>;
}

export function BoardTable({
  entries,
  currentUserId,
  isReadOnly = false,
  onUpdateEntry,
  onAddEntryRow,
  onDeleteEntry,
}: BoardTableProps) {
  const [localLogs, setLocalLogs] = useState<
    Record<string, { yesterdayTask: string; todayTask: string; userName: string }>
  >({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [savedStatusId, setSavedStatusId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // Sync localLogs state whenever entries array is updated
  useEffect(() => {
    const map: Record<
      string,
      { yesterdayTask: string; todayTask: string; userName: string }
    > = {};
    entries.forEach((e) => {
      map[e.id] = {
        yesterdayTask: e.yesterdayTask ?? "",
        todayTask: e.todayTask ?? "",
        userName: e.userName ?? "Thành viên Mới",
      };
    });
    setLocalLogs(map);
  }, [entries]);

  const handleTextChange = (
    id: string,
    field: "yesterdayTask" | "todayTask" | "userName",
    value: string
  ) => {
    if (isReadOnly) return;
    setLocalLogs((prev) => ({
      ...prev,
      [id]: {
        ...prev[id] || { yesterdayTask: "", todayTask: "", userName: "Thành viên Mới" },
        [field]: value,
      },
    }));
  };

  const handleBlurSave = async (
    id: string,
    field: "yesterdayTask" | "todayTask" | "userName"
  ) => {
    if (isReadOnly) return;
    const currentVal = localLogs[id]?.[field] ?? "";
    setSavingId(id);
    await onUpdateEntry(id, { [field]: currentVal });
    setSavingId(null);
    setSavedStatusId(id);
    setTimeout(() => setSavedStatusId(null), 2000);
  };

  const handleStatusChange = async (
    id: string,
    field: "yesterdayStatus" | "todayStatus",
    newStatus: WorkStatus
  ) => {
    if (isReadOnly) return;
    setSavingId(id);
    await onUpdateEntry(id, { [field]: newStatus });
    setSavingId(null);
    setSavedStatusId(id);
    setTimeout(() => setSavedStatusId(null), 2000);
  };

  const handleQuickAddRow = async () => {
    if (isReadOnly) return;
    setIsAdding(true);
    await onAddEntryRow();
    setIsAdding(false);
  };

  const getStatusBadge = (
    status: WorkStatus,
    fieldName: "yesterdayStatus" | "todayStatus",
    entryId: string
  ) => {
    const isDone = status === "DONE";
    const isInProgress = status === "IN_PROGRESS";

    return (
      <select
        disabled={isReadOnly}
        value={status || "NOT_YET"}
        onChange={(e) =>
          handleStatusChange(entryId, fieldName, e.target.value as WorkStatus)
        }
        className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border outline-none ${
          isReadOnly ? "cursor-not-allowed opacity-90" : "cursor-pointer"
        } transition-all duration-200 ${
          isDone
            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
            : isInProgress
            ? "bg-neonPink-500/10 text-neonPink-500 border-neonPink-500/40 shadow-glowSm hover:bg-neonPink-500/20"
            : "bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-zinc-700 hover:bg-slate-200 dark:hover:bg-zinc-700"
        }`}
      >
        <option
          value="NOT_YET"
          className="bg-white dark:bg-zinc-900 text-slate-800 dark:text-zinc-200"
        >
          ⏳ Chưa làm
        </option>
        <option
          value="IN_PROGRESS"
          className="bg-white dark:bg-zinc-900 text-neonPink-500 font-bold"
        >
          🔄 Đang làm
        </option>
        <option
          value="DONE"
          className="bg-white dark:bg-zinc-900 text-emerald-500 font-bold"
        >
          ✅ Đã xong
        </option>
      </select>
    );
  };

  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-slate-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 shadow-sm transition-all duration-300">
      <table className="w-full text-left border-collapse min-w-[980px]">
        {/* Table Header */}
        <thead>
          <tr className="border-b border-slate-200 dark:border-zinc-800/80 bg-slate-100/90 dark:bg-zinc-950/80 text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-zinc-400">
            <th className="py-3.5 px-3 w-[50px] text-center">STT</th>
            <th className="py-3.5 px-4 min-w-[180px]">Thành viên (User / PIC)</th>
            <th className="py-3.5 px-4 min-w-[260px]">Mục đã làm hôm qua</th>
            <th className="py-3.5 px-4 w-[125px]">Tiến độ</th>
            <th className="py-3.5 px-4 min-w-[260px]">Việc sẽ làm hôm nay</th>
            <th className="py-3.5 px-4 w-[125px]">Tiến độ</th>
            <th className="py-3.5 px-4 w-[100px] text-right">
              {isReadOnly ? "Thời gian" : "Thao tác"}
            </th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/60 text-xs">
          {/* TOP INLINE ADD BUTTON OR GUEST PROMPT */}
          <tr className="bg-slate-50/70 dark:bg-zinc-950/40 border-b border-slate-200/80 dark:border-zinc-800/80">
            <td colSpan={7} className="py-2.5 px-4">
              {!isReadOnly ? (
                <button
                  type="button"
                  disabled={isAdding}
                  onClick={handleQuickAddRow}
                  className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-xl font-bold text-xs text-neonPink-500 hover:text-white bg-neonPink-500/10 hover:bg-neonPink-500 border border-neonPink-500/30 transition-all duration-200 shadow-glowSm group cursor-pointer"
                >
                  <Plus className="w-4 h-4 stroke-[2.5] group-hover:rotate-90 transition-transform duration-200" />
                  <span>+ Thêm dòng công việc mới (Click để chèn nhanh)</span>
                </button>
              ) : (
                <div className="flex items-center justify-between py-0.5">
                  <span className="inline-flex items-center space-x-1.5 text-xs text-slate-500 dark:text-zinc-400 font-medium">
                    <Lock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>Bạn đang ở Chế độ Khách (Chỉ xem). Đăng nhập để thêm/sửa công việc!</span>
                  </span>
                  <Link
                    href="/login"
                    className="inline-flex items-center space-x-1 px-3 py-1 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-neonPink-500 to-pink-600 shadow-glowSm"
                  >
                    <LogIn className="w-3 h-3" />
                    <span>Đăng Nhập</span>
                  </Link>
                </div>
              )}
            </td>
          </tr>

          {entries.length === 0 ? (
            <tr>
              <td colSpan={7} className="py-12 text-center text-slate-400 dark:text-zinc-500 font-medium">
                Bảng chưa có dòng công việc nào.
              </td>
            </tr>
          ) : (
            entries.map((entry, index) => {
              const isOwner = currentUserId ? entry.userId === currentUserId : false;
              const isSaving = savingId === entry.id;
              const isJustSaved = savedStatusId === entry.id;

              return (
                <tr
                  key={entry.id}
                  className="hover:bg-slate-50/90 dark:hover:bg-zinc-950/50 transition-colors group"
                >
                  {/* STT (Số Thứ Tự) */}
                  <td className="py-3 px-3 align-top text-center font-bold text-slate-400 dark:text-zinc-500 font-mono text-xs">
                    {index + 1}
                  </td>

                  {/* User / Member Name */}
                  <td className="py-3 px-4 align-top">
                    <div className="flex items-center space-x-2">
                      <div className="w-7 h-7 rounded-xl bg-neonPink-500/10 border border-neonPink-500/30 flex items-center justify-center font-bold text-xs text-neonPink-500 shrink-0">
                        {(localLogs[entry.id]?.userName || entry.userName || "U").charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <input
                          type="text"
                          readOnly={isReadOnly}
                          value={localLogs[entry.id]?.userName ?? entry.userName ?? ""}
                          onChange={(e) => handleTextChange(entry.id, "userName", e.target.value)}
                          onBlur={() => handleBlurSave(entry.id, "userName")}
                          className={`w-full font-bold text-slate-900 dark:text-zinc-100 bg-transparent focus:outline-none ${
                            !isReadOnly && "focus:border-b focus:border-neonPink-500"
                          }`}
                        />
                        {isOwner && (
                          <span className="inline-block text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-neonPink-500/10 text-neonPink-500 border border-neonPink-500/20 mt-0.5">
                            BẠN
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Yesterday Task Inline */}
                  <td className="py-2.5 px-4 align-top">
                    <textarea
                      rows={2}
                      readOnly={isReadOnly}
                      value={localLogs[entry.id]?.yesterdayTask ?? entry.yesterdayTask ?? ""}
                      onChange={(e) => handleTextChange(entry.id, "yesterdayTask", e.target.value)}
                      onBlur={() => handleBlurSave(entry.id, "yesterdayTask")}
                      placeholder={isReadOnly ? "(Trống)" : "Gõ công việc đã làm hôm qua..."}
                      className={`w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-zinc-800 ${
                        isReadOnly
                          ? "bg-slate-100/50 dark:bg-zinc-950/30 text-slate-700 dark:text-zinc-300 resize-none"
                          : "bg-slate-50/50 dark:bg-zinc-950/60 text-slate-900 dark:text-zinc-100 focus:outline-none focus:border-neonPink-500 focus:ring-1 focus:ring-neonPink-500 resize-y"
                      } font-mono transition-all min-h-[50px]`}
                    />
                  </td>

                  {/* Yesterday Status Inline Badge */}
                  <td className="py-3 px-4 align-top">
                    {getStatusBadge(entry.yesterdayStatus, "yesterdayStatus", entry.id)}
                  </td>

                  {/* Today Task Inline */}
                  <td className="py-2.5 px-4 align-top">
                    <textarea
                      rows={2}
                      readOnly={isReadOnly}
                      value={localLogs[entry.id]?.todayTask ?? entry.todayTask ?? ""}
                      onChange={(e) => handleTextChange(entry.id, "todayTask", e.target.value)}
                      onBlur={() => handleBlurSave(entry.id, "todayTask")}
                      placeholder={isReadOnly ? "(Trống)" : "Gõ việc sẽ làm hôm nay..."}
                      className={`w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-zinc-800 ${
                        isReadOnly
                          ? "bg-slate-100/50 dark:bg-zinc-950/30 text-slate-700 dark:text-zinc-300 resize-none"
                          : "bg-slate-50/50 dark:bg-zinc-950/60 text-slate-900 dark:text-zinc-100 focus:outline-none focus:border-neonPink-500 focus:ring-1 focus:ring-neonPink-500 resize-y"
                      } font-mono transition-all min-h-[50px]`}
                    />
                  </td>

                  {/* Today Status Inline Badge */}
                  <td className="py-3 px-4 align-top">
                    {getStatusBadge(entry.todayStatus, "todayStatus", entry.id)}
                  </td>

                  {/* Action & Saved status feedback */}
                  <td className="py-3 px-4 align-top text-right space-y-1">
                    {!isReadOnly && (
                      <div className="flex items-center justify-end space-x-1">
                        {isSaving ? (
                          <span className="text-[10px] text-neonPink-500 font-semibold animate-pulse">
                            Lưu...
                          </span>
                        ) : isJustSaved ? (
                          <span className="inline-flex items-center space-x-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                            <Check className="w-3 h-3" />
                            <span>Đã lưu</span>
                          </span>
                        ) : null}

                        <button
                          type="button"
                          onClick={() => onDeleteEntry(entry.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          title="Xóa dòng này"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    <div className="text-[10px] text-slate-400 dark:text-zinc-500 font-mono">
                      {formatDateTime(entry.updatedAt || entry.createdAt)}
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
