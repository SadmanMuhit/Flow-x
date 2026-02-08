// app/api/verify-email/route.ts (Next.js 13+ app router)
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    // Get the token from query params
    const url = new URL(req.url);
    const token = url.searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { error: "Missing token in request" },
        { status: 400 }
      );
    }

    // Call the auth library to verify email
    // Adjust this according to your library's API
    const result = await auth.api.verifyEmail({ token });

    // If verification failed for some reason
    if (!result || !result.user) {
      return NextResponse.json(
        { error: "Failed to verify email" },
        { status: 400 }
      );
    }

    // Success response
    return NextResponse.json(
      {
        message: "Email verified successfully",
        user: result.user,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Email verification error:", error);

    return NextResponse.json(
      {
        error: error?.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}