import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { fullName: "asc" },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("GET /api/users error:", error);
    return NextResponse.json(
      { error: "Lỗi hệ thống khi lấy danh sách thành viên" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, fullName, email, role } = body;

    if (!username || !fullName) {
      return NextResponse.json(
        { error: "Vui lòng nhập đầy đủ username và fullName" },
        { status: 400 }
      );
    }

    const userEmail = email || `${username.toLowerCase().trim()}@knote.app`;

    const newUser = await prisma.user.create({
      data: {
        username: username.trim(),
        fullName: fullName.trim(),
        email: userEmail,
        role: role || "DEV",
      },
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error("POST /api/users error:", error);
    return NextResponse.json(
      { error: "Không thể tạo user mới" },
      { status: 500 }
    );
  }
}
