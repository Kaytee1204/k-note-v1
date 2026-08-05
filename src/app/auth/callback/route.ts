import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      const { id: supabaseId, email, user_metadata } = data.user;

      if (email) {
        const username =
          user_metadata?.username || email.split("@")[0] || `user_${Date.now()}`;
        const fullName =
          user_metadata?.fullName || user_metadata?.full_name || username;
        const role = user_metadata?.role || "DEV";

        // Sync or create user in Prisma DB
        await prisma.user.upsert({
          where: { email },
          update: {
            supabaseId,
            fullName,
            role,
          },
          create: {
            supabaseId,
            email,
            username,
            fullName,
            role,
          },
        });
      }

      return NextResponse.redirect(`${origin}/dashboard`);
    }
  }

  // Return to login on failure
  return NextResponse.redirect(`${origin}/login?error=InvalidConfirmationCode`);
}
