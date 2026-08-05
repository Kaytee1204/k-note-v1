import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Vui lòng nhập Email và Mật khẩu" },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. Try Supabase Auth Login if configured
    let supabaseUser = null;
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (!error && data.user) {
        supabaseUser = data.user;
      }
    } catch (err) {
      // Supabase Auth not active or key placeholder
    }

    // 2. Check user in Prisma Database
    let dbUser = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (!dbUser && supabaseUser) {
      const username = cleanEmail.split("@")[0];
      dbUser = await prisma.user.create({
        data: {
          supabaseId: supabaseUser.id,
          email: cleanEmail,
          username,
          fullName: username,
          role: "DEV",
        },
      });
    }

    if (!dbUser) {
      return NextResponse.json(
        { error: "Tài khoản chưa tồn tại. Vui lòng bấm Đăng ký tài khoản." },
        { status: 404 }
      );
    }

    // 3. Set Local Session Cookie for instant seamless auth
    const cookieStore = cookies();
    cookieStore.set("user_session", dbUser.id, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    cookieStore.set("user_email", dbUser.email, {
      path: "/",
      httpOnly: false,
      maxAge: 60 * 60 * 24 * 7,
    });

    return NextResponse.json({
      message: "Đăng nhập thành công!",
      user: dbUser,
    });
  } catch (error: any) {
    console.error("POST /api/auth/login error:", error);
    return NextResponse.json(
      { error: "Lỗi đăng nhập hệ thống" },
      { status: 500 }
    );
  }
}
