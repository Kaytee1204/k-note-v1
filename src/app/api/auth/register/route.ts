import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, fullName, username, role } = body;

    if (!email || !password || !fullName || !username) {
      return NextResponse.json(
        { error: "Vui lòng nhập đầy đủ các trường thông tin" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Mật khẩu phải có ít nhất 6 ký tự" },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanUsername = username.trim().toLowerCase();

    // Ensure unique username
    const existingUsernameUser = await prisma.user.findUnique({
      where: { username: cleanUsername },
    });

    const finalUsername =
      existingUsernameUser && existingUsernameUser.email !== cleanEmail
        ? `${cleanUsername}_${Math.floor(1000 + Math.random() * 9000)}`
        : cleanUsername;

    let supabaseId: string | undefined = undefined;

    // Supabase Auth Registration (Safe try-catch)
    try {
      const supabase = createClient();
      const { data: authData } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            fullName,
            username: finalUsername,
            role: role || "DEV",
          },
        },
      });

      if (authData?.user) {
        supabaseId = authData.user.id;
      }
    } catch (sbErr) {
      // Ignore if Supabase key not set in local demo
    }

    // Sync / Create user in Prisma Database
    const dbUser = await prisma.user.upsert({
      where: { email: cleanEmail },
      update: {
        supabaseId: supabaseId || undefined,
        fullName,
        username: finalUsername,
        role: role || "DEV",
      },
      create: {
        supabaseId,
        email: cleanEmail,
        username: finalUsername,
        fullName,
        role: role || "DEV",
      },
    });

    // Set Local Session Cookie for instant seamless auth
    const cookieStore = cookies();
    cookieStore.set("user_session", dbUser.id, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
    });

    cookieStore.set("user_email", dbUser.email, {
      path: "/",
      httpOnly: false,
      maxAge: 60 * 60 * 24 * 7,
    });

    return NextResponse.json({
      message: "Đăng ký tài khoản thành công!",
      user: dbUser,
    });
  } catch (error: any) {
    console.error("POST /api/auth/register error:", error);
    return NextResponse.json(
      { error: error.message || "Không thể tạo tài khoản" },
      { status: 500 }
    );
  }
}
