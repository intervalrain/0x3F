import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    let userProgress = null;
    if (session?.user?.id) {
      userProgress = await prisma.userProgress.findMany({
        where: {
          userId: session.user.id,
        },
      });
    }

    return NextResponse.json({
      session: session ? {
        user: {
          id: session.user.id,
          email: session.user.email,
          name: session.user.name
        }
      } : null,
      progressCount: userProgress?.length || 0,
      progress: userProgress,
    });
  } catch (error) {
    return NextResponse.json({
      error: "Debug endpoint error",
      details: error instanceof Error ? error.message : error
    }, { status: 500 });
  }
}