import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { WorkStatus } from "@prisma/client";

export async function POST(
  req: Request,
  { params }: { params: { boardId: string } }
) {
  try {
    const { boardId } = params;
    const body = await req.json();
    const {
      userId,
      userName,
      yesterdayTask,
      yesterdayStatus,
      todayTask,
      todayStatus,
      tomorrowTask,
      tomorrowStatus,
    } = body;

    // Check if board exists
    const existingBoard = await prisma.board.findUnique({
      where: { id: boardId },
    });

    if (!existingBoard) {
      return NextResponse.json(
        { error: "Bảng không tồn tại hoặc đã bị xóa" },
        { status: 404 }
      );
    }

    let validUserId: string | null = null;
    if (userId) {
      const existingUser = await prisma.user.findUnique({ where: { id: userId } });
      if (existingUser) validUserId = existingUser.id;
    }

    const nameToUse = userName || "Thành viên Mới";

    const newEntry = await prisma.standupEntry.create({
      data: {
        boardId,
        userId: validUserId,
        userName: nameToUse,
        yesterdayTask: yesterdayTask || "",
        yesterdayStatus: (yesterdayStatus as WorkStatus) || WorkStatus.DONE,
        todayTask: todayTask || "",
        todayStatus: (todayStatus as WorkStatus) || WorkStatus.IN_PROGRESS,
        tomorrowTask: tomorrowTask || "",
        tomorrowStatus: (tomorrowStatus as WorkStatus) || WorkStatus.NOT_YET,
      },
    });

    return NextResponse.json(newEntry, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/boards/[boardId]/entries error:", error);
    return NextResponse.json(
      { error: error?.message || "Không thể thêm dòng mới vào Bảng" },
      { status: 500 }
    );
  }
}
