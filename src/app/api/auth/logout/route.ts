import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  try {
    const cookieStore = cookies();
    cookieStore.delete("user_session");
    cookieStore.delete("user_email");

    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {
      // Ignore if Supabase not configured
    }

    return NextResponse.json({ message: "Đã đăng xuất thành công" });
  } catch (error) {
    return NextResponse.json({ error: "Lỗi đăng xuất" }, { status: 500 });
  }
}
