"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      padding: "20px",
      textAlign: "center"
    }}>
      <h1 style={{ color: "#ef4444", marginBottom: "20px" }}>
        認證錯誤
      </h1>

      <div style={{
        backgroundColor: "#fee2e2",
        border: "1px solid #fca5a5",
        borderRadius: "8px",
        padding: "20px",
        maxWidth: "500px",
        marginBottom: "20px"
      }}>
        <p style={{ color: "#991b1b", marginBottom: "10px" }}>
          錯誤類型：{error || "未知錯誤"}
        </p>

        {error === "Configuration" && (
          <p style={{ color: "#7c2d12", fontSize: "14px" }}>
            請檢查 Google OAuth 設置和環境變數配置。
          </p>
        )}

        {error === "AccessDenied" && (
          <p style={{ color: "#7c2d12", fontSize: "14px" }}>
            存取被拒絕。請確認您有權限登入。
          </p>
        )}

        {error === "Verification" && (
          <p style={{ color: "#7c2d12", fontSize: "14px" }}>
            驗證失敗。請重新嘗試登入。
          </p>
        )}
      </div>

      <Link href="/" style={{
        padding: "10px 20px",
        backgroundColor: "#3b82f6",
        color: "white",
        textDecoration: "none",
        borderRadius: "8px"
      }}>
        返回首頁
      </Link>
    </div>
  );
}