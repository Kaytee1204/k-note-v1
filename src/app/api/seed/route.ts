import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Role, WorkStatus } from "@prisma/client";

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

    const boardCount = await prisma.board.count();
    if (boardCount === 0) {
      await prisma.board.create({
        data: {
          id: "sample-board-1",
          name: "Daily Standup Sprint 15 - Core Team",
          description: "Bảng theo dõi tiến độ công việc hàng ngày của nhóm Software.",
          createdById: pm.id,
          entries: {
            create: [
              {
                userId: dev1.id,
                userName: dev1.fullName,
                yesterdayTask: "Cấu hình hệ thống K-Note Workspace.",
                yesterdayStatus: WorkStatus.DONE,
                todayTask: "Phát triển giao diện Notion Inline Table.",
                todayStatus: WorkStatus.IN_PROGRESS,
                tomorrowTask: "Tối ưu tương tác chèn dòng mới.",
                tomorrowStatus: WorkStatus.NOT_YET,
              },
              {
                userId: pm.id,
                userName: pm.fullName,
                yesterdayTask: "Chuẩn bị tài liệu Sprint 15.",
                yesterdayStatus: WorkStatus.DONE,
                todayTask: "Review kiến trúc database Prisma.",
                todayStatus: WorkStatus.DONE,
                tomorrowTask: "Họp nghiệm thu các tính năng mới.",
                tomorrowStatus: WorkStatus.IN_PROGRESS,
              },
              {
                userId: tester.id,
                userName: tester.fullName,
                yesterdayTask: "Tạo danh sách Test Case.",
                yesterdayStatus: WorkStatus.DONE,
                todayTask: "Viết Test Case cho K-Note Board.",
                todayStatus: WorkStatus.DONE,
                tomorrowTask: "Chạy kiểm thử tự động API.",
                tomorrowStatus: WorkStatus.NOT_YET,
              },
            ],
          },
        },
      });
    }

    return NextResponse.json({ message: "Seeded K-Note boards successfully!" });
  } catch (error) {
    console.error("POST /api/seed error:", error);
    return NextResponse.json({ error: "Seed failure" }, { status: 500 });
  }
}
