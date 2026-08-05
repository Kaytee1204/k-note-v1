import { PrismaClient, Role, WorkStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database with Board Workspace data...");

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

  // Seed initial Board
  const sampleBoard = await prisma.board.upsert({
    where: { id: "sample-board-1" },
    update: {},
    create: {
      id: "sample-board-1",
      name: "Daily Standup Sprint 15 - Core Team",
      description: "Bảng theo dõi tiến độ công việc hàng ngày của nhóm Software.",
      createdById: pm.id,
      entries: {
        create: [
          {
            userId: dev1.id,
            userName: dev1.fullName,
            todayTask: "Phát triển hệ thống Đa Bảng (Board Workspace) và Notion Inline Table.",
            todayStatus: WorkStatus.IN_PROGRESS,
            tomorrowTask: "Tối ưu tương tác chèn dòng mới & đồng bộ dữ liệu CSDL.",
            tomorrowStatus: WorkStatus.NOT_YET,
          },
          {
            userId: pm.id,
            userName: pm.fullName,
            todayTask: "Review kiến trúc database Prisma & Giao task Sprint 15.",
            todayStatus: WorkStatus.DONE,
            tomorrowTask: "Họp nghiệm thu các tính năng mới với khách hàng.",
            tomorrowStatus: WorkStatus.IN_PROGRESS,
          },
          {
            userId: tester.id,
            userName: tester.fullName,
            todayTask: "Viết Test Case cho luồng Tạo Bảng & Inline Editing trên Board.",
            todayStatus: WorkStatus.DONE,
            tomorrowTask: "Chạy kiểm thử tự động API Boards và StandupEntry.",
            tomorrowStatus: WorkStatus.NOT_YET,
          },
        ],
      },
    },
  });

  console.log("Seeding Boards completed successfully! Sample Board ID:", sampleBoard.id);
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
