import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: { boardId: string } }
) {
  try {
    const { boardId } = params;

    const board = await prisma.board.findUnique({
      where: { id: boardId },
      include: {
        createdBy: true,
        entries: {
          include: {
            user: true,
          },
          orderBy: {
            createdAt: "asc", // Sắp xếp người thêm trước ở trên, người thêm sau ở dưới cùng
          },
        },
      },
    });

    if (!board) {
      return NextResponse.json(
        { error: "Bảng không tồn tại" },
        { status: 404 }
      );
    }

    return NextResponse.json(board);
  } catch (error: any) {
    console.error("GET /api/boards/[boardId] error:", error);
    return NextResponse.json(
      { error: "Lỗi hệ thống khi lấy thông tin Bảng" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { boardId: string } }
) {
  try {
    const { boardId } = params;

    await prisma.board.delete({
      where: { id: boardId },
    });

    return NextResponse.json({ message: "Xóa Bảng thành công", id: boardId });
  } catch (error: any) {
    console.error("DELETE /api/boards/[boardId] error:", error);
    return NextResponse.json(
      { error: "Không thể xóa Bảng" },
      { status: 500 }
    );
  }
}
