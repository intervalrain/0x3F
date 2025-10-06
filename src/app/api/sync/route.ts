/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TopicProgress } from "@/types";
import { getUserPermissions } from "@/lib/syncPolicy";

// GET: 獲取用戶的雲端進度
export async function GET() {
  try {
    const session = await getServerSession(authOptions) as any;

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 權限檢查
    const permissions = getUserPermissions(session.user.email);
    if (!permissions.canReadFromCloud) {
      return NextResponse.json(
        { error: "Cloud sync is only available for certificate users and admin" },
        { status: 403 }
      );
    }

    const userProgress = await prisma.userProgress.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    const progress = userProgress.map(p => ({
      topicId: p.topicId, // 這已經是字串，保持原樣
      data: p.progressData as unknown as TopicProgress,
      lastSyncAt: p.lastSyncAt.toISOString(),
      version: p.version
    }));

    return NextResponse.json({ progress });
  } catch (error) {
    console.error("Sync GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch progress" },
      { status: 500 }
    );
  }
}

// POST: 同步本地進度到雲端
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as any;

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 權限檢查
    const permissions = getUserPermissions(session.user.email);
    if (!permissions.canSyncToCloud) {
      return NextResponse.json(
        { error: "Cloud sync is only available for certificate users and admin" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { topicProgress, forceOverwrite = false } = body;

    if (!topicProgress || !Array.isArray(topicProgress)) {
      return NextResponse.json(
        { error: "Invalid progress data" },
        { status: 400 }
      );
    }

    // 計算進度資料的指紋（用於快速比對）
    const getProgressFingerprint = (data: any): string => {
      const completed: string[] = [];
      data.chapters?.forEach((ch: any) => {
        ch.subsections?.forEach((ss: any) => {
          ss.problems?.forEach((p: any) => {
            if (p.completed) {
              completed.push(`${data.topicId}-${p.number}`);
            }
          });
        });
      });
      return completed.sort().join(',');
    };

    const results = [];

    for (const progress of topicProgress) {
      try {
        // 檢查是否存在衝突
        const existing = await prisma.userProgress.findUnique({
          where: {
            userId_topicId: {
              userId: session.user.id,
              topicId: String(progress.topicId), // 確保 topicId 是字串
            }
          }
        });

        if (existing) {
          // 計算指紋來快速比對資料是否相同
          const existingFingerprint = getProgressFingerprint(existing.progressData);
          const newFingerprint = getProgressFingerprint(progress);

          if (existingFingerprint === newFingerprint && !forceOverwrite) {
            // 資料完全相同，跳過寫入
            results.push({
              topicId: progress.topicId,
              status: 'success',
              updatedAt: existing.updatedAt.toISOString(),
              skipped: true
            });
            continue;
          }

          if (!forceOverwrite) {
            // 資料不同，返回衝突資訊
            results.push({
              topicId: progress.topicId,
              status: 'conflict',
              cloudData: existing.progressData,
              cloudUpdatedAt: existing.updatedAt.toISOString()
            });
            continue;
          }
        }

        // 更新或創建進度
        {
          // 更新或創建進度
          const updated = await prisma.userProgress.upsert({
            where: {
              userId_topicId: {
                userId: session.user.id,
                topicId: String(progress.topicId), // 確保 topicId 是字串
              }
            },
            update: {
              progressData: progress,
              lastSyncAt: new Date(),
              version: progress.version || "3.1.0"
            },
            create: {
              userId: session.user.id,
              topicId: String(progress.topicId), // 確保 topicId 是字串
              progressData: progress,
              version: progress.version || "3.1.0"
            }
          });

          results.push({
            topicId: progress.topicId,
            status: 'success',
            updatedAt: updated.updatedAt.toISOString()
          });
        }
      } catch (error) {
        console.error(`Error syncing topic ${progress.topicId}:`, error);
        results.push({
          topicId: progress.topicId,
          status: 'error',
          error: 'Failed to sync'
        });
      }
    }

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Sync POST error:", error);
    return NextResponse.json(
      { error: "Failed to sync progress" },
      { status: 500 }
    );
  }
}

// DELETE: 刪除用戶的雲端進度（可選）
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as any;

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const topicId = searchParams.get('topicId');

    if (topicId) {
      // 刪除特定主題的進度
      await prisma.userProgress.delete({
        where: {
          userId_topicId: {
            userId: session.user.id,
            topicId: topicId, // topicId 已經是字串
          }
        }
      });
    } else {
      // 刪除所有進度
      await prisma.userProgress.deleteMany({
        where: {
          userId: session.user.id,
        }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Sync DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to delete progress" },
      { status: 500 }
    );
  }
}