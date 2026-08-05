import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();
    const {
      yesterdayTask,
      yesterdayStatus,
      todayTask,
      todayStatus,
      tomorrowTask,
      tomorrowStatus,
      userName,
    } = body;

    const existing = await prisma.standupEntry.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Dòng công việc không tồn tại" },
        { status: 404 }
      );
    }

    const dataToUpdate: any = {};
    if (yesterdayTask !== undefined) dataToUpdate.yesterdayTask = yesterdayTask;
    if (yesterdayStatus !== undefined) dataToUpdate.yesterdayStatus = yesterdayStatus;
    if (todayTask !== undefined) dataToUpdate.todayTask = todayTask;
    if (todayStatus !== undefined) dataToUpdate.todayStatus = todayStatus;
    if (tomorrowTask !== undefined) dataToUpdate.tomorrowTask = tomorrowTask;
    if (tomorrowStatus !== undefined) dataToUpdate.tomorrowStatus = tomorrowStatus;
    if (userName !== undefined) dataToUpdate.userName = userName;

    const updatedEntry = await prisma.standupEntry.update({
      where: { id },
      data: dataToUpdate,
    });

    return NextResponse.json(updatedEntry);
  } catch (error: any) {
    console.error("PATCH /api/entries/[id] error:", error);
    return NextResponse.json(
      { error: "Lỗi cập nhật dòng công việc" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const existing = await prisma.standupEntry.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Dòng công việc không tồn tại" },
        { status: 404 }
      );
    }

    await prisma.standupEntry.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Xóa thành công", id });
  } catch (error: any) {
    console.error("DELETE /api/entries/[id] error:", error);
    return NextResponse.json(
      { error: "Không thể xóa dòng công việc" },
      { status: 500 }
    );
  }
}
