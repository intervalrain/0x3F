import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    env: {
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET: !!process.env.GOOGLE_CLIENT_SECRET,
      DATABASE_URL: process.env.DATABASE_URL?.substring(0, 20) + "...",
    },
    status: "OK"
  });
}