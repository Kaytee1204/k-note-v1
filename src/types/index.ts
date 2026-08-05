export type Role = "PM" | "DEV" | "TESTER";
export type TaskStatus = "IN_PROGRESS" | "DONE";
export type WorkStatus = "NOT_YET" | "IN_PROGRESS" | "DONE";

export interface User {
  id: string;
  supabaseId?: string;
  email: string;
  username: string;
  fullName: string;
  role: Role;
  createdAt?: string;
  updatedAt?: string;
}

export interface Board {
  id: string;
  name: string;
  description?: string | null;
  createdById?: string | null;
  createdBy?: User | null;
  entries?: StandupEntry[];
  _count?: {
    entries: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface StandupEntry {
  id: string;
  boardId: string;
  board?: Board;
  userId?: string | null;
  userName: string;
  user?: User | null;
  yesterdayTask: string;
  yesterdayStatus: WorkStatus;
  todayTask: string;
  todayStatus: WorkStatus;
  tomorrowTask?: string | null;
  tomorrowStatus?: WorkStatus | null;
  createdAt: string;
  updatedAt: string;
}
