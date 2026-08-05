import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Role, TaskStatus, WorkStatus } from "@prisma/client";

export async function POST() {
  try {
    const pm = await prisma.user.upsert({
      where: { username: "alex_pm" },
      update: { email: "alex.pm@example.com" },
      create: {
        username: "alex_pm",
        fullName: "Alex Rivera (PM)",
        email: "alex.pm@example.com",
        role: Role.PM,
      },
    });

    const dev1 = await prisma.user.upsert({
      where: { username: "jennie_dev" },
      update: { email: "jennie.dev@example.com" },
      create: {
        username: "jennie_dev",
        fullName: "Jennie Kim (DEV)",
        email: "jennie.dev@example.com",
        role: Role.DEV,
      },
    });

    const tester = await prisma.user.upsert({
      where: { username: "lisa_qc" },
      update: { email: "lisa.qc@example.com" },
      create: {
        username: "lisa_qc",
        fullName: "Lisa Manoban (TESTER)",
        email: "lisa.qc@example.com",
        role: Role.TESTER,
      },
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const worklogCount = await prisma.worklog.count();
    if (worklogCount === 0) {
      await prisma.worklog.create({
        data: {
          userId: dev1.id,
          todayTask: "Phát triển giao diện Bảng theo dõi công việc chung Notion/Excel style.",
          todayStatus: WorkStatus.IN_PROGRESS,
          tomorrowTask: "Kiểm thử tương tác Inline Editing & tự động lưu CSDL Supabase.",
          tomorrowStatus: WorkStatus.NOT_YET,
          logDate: today,
        },
      });

      await prisma.worklog.create({
        data: {
          userId: pm.id,
          todayTask: "Review kế hoạch Sprint 15 & Phân công nhiệm vụ cho Team Software.",
          todayStatus: WorkStatus.DONE,
          tomorrowTask: "Họp tổng kết tiến độ cuối tuần với Khách hàng.",
          tomorrowStatus: WorkStatus.IN_PROGRESS,
          logDate: today,
        },
      });

      await prisma.worklog.create({
        data: {
          userId: tester.id,
          todayTask: "Viết Test Case cho hệ thống Đăng ký & Đăng nhập Auth tức thì.",
          todayStatus: WorkStatus.DONE,
          tomorrowTask: "Chạy kiểm thử tự động API Worklogs và lọc theo ngày.",
          tomorrowStatus: WorkStatus.NOT_YET,
          logDate: today,
        },
      });
    }

    return NextResponse.json({ message: "Seeded worklogs successfully!" });
  } catch (error) {
    console.error("POST /api/seed error:", error);
    return NextResponse.json({ error: "Seed failure" }, { status: 500 });
  }
}
