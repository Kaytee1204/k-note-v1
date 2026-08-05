import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = cookies();
  const hasSession = cookieStore.has("user_session");
  const emailCookie = cookieStore.get("user_email");

  return NextResponse.json({
    isLoggedIn: hasSession,
    email: emailCookie?.value || null,
  });
}
