import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const boards = await prisma.board.findMany({
      include: {
        createdBy: true,
        _count: {
          select: { entries: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(boards);
  } catch (error: any) {
    console.error("GET /api/boards error:", error);
    return NextResponse.json([]);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, description, createdById } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "Tên Bảng không được để trống" },
        { status: 400 }
      );
    }

    let validCreatorId: string | null = null;
    if (createdById) {
      const existingUser = await prisma.user.findUnique({
        where: { id: createdById },
      });
      if (existingUser) validCreatorId = existingUser.id;
    }

    if (!validCreatorId) {
      const firstUser = await prisma.user.findFirst();
      if (firstUser) validCreatorId = firstUser.id;
    }

    const newBoard = await prisma.board.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        createdById: validCreatorId,
      },
    });

    return NextResponse.json(newBoard, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/boards error:", error?.message || error);
    return NextResponse.json(
      { error: error?.message || "Không thể tạo Bảng mới" },
      { status: 500 }
    );
  }
}
