"use client";

import React, { useEffect, useRef } from "react";
import { Box, Typography, Button, Alert, Paper } from "@mui/material";
import { GitHub as GitHubIcon } from "@mui/icons-material";
import { useSession, signIn } from "next-auth/react";

interface ArticleCommentsProps {
  articleSlug: string;
  articleTitle?: string;
}

interface ExtendedUser {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  hasGitHub?: boolean;
  githubUsername?: string | null;
}

const ArticleComments: React.FC<ArticleCommentsProps> = ({
  articleSlug,
}) => {
  const { data: session, status } = useSession();
  const giscusRef = useRef<HTMLDivElement>(null);
  const user = session?.user as ExtendedUser | undefined;
  const hasGitHub = user?.hasGitHub;

  useEffect(() => {
    // 只有在用戶有 GitHub 帳號時才載入 Giscus
    if (!hasGitHub || !giscusRef.current) return;

    // 清除現有的 giscus
    const existingScript = giscusRef.current.querySelector("script");
    if (existingScript) {
      existingScript.remove();
    }
    const existingIframe = giscusRef.current.querySelector("iframe");
    if (existingIframe) {
      existingIframe.remove();
    }

    // 載入 Giscus
    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.setAttribute("data-repo", "intervalrain/0x3F");
    script.setAttribute("data-repo-id", "R_kgDOPmTklQ");
    script.setAttribute("data-category", "Announcements");
    script.setAttribute("data-category-id", "DIC_kwDOPmTklc4CyTTQ");
    script.setAttribute("data-mapping", "pathname");
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "top");
    script.setAttribute("data-theme", "light");
    script.setAttribute("data-lang", "zh-TW");
    script.setAttribute("data-loading", "lazy");
    script.crossOrigin = "anonymous";
    script.async = true;

    giscusRef.current.appendChild(script);

    return () => {
      if (giscusRef.current) {
        const script = giscusRef.current.querySelector("script");
        if (script) {
          script.remove();
        }
      }
    };
  }, [hasGitHub, articleSlug]);

  // 未登入狀態
  if (status === "unauthenticated") {
    return (
      <Paper
        elevation={0}
        sx={{
          mt: 6,
          p: 4,
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
          textAlign: "center",
        }}
      >
        <Typography variant="h6" gutterBottom>
          留言討論
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          登入後即可參與討論
        </Typography>
        <Button
          variant="contained"
          onClick={() => signIn()}
          startIcon={<GitHubIcon />}
        >
          登入以留言
        </Button>
      </Paper>
    );
  }

  // 已登入但未綁定 GitHub
  if (status === "authenticated" && !hasGitHub) {
    return (
      <Paper
        elevation={0}
        sx={{
          mt: 6,
          p: 4,
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography variant="h6" gutterBottom>
          留言討論
        </Typography>
        <Alert severity="info" sx={{ mb: 2 }}>
          留言功能需要綁定 GitHub 帳號。綁定後，你可以在文章下方留言、編輯和刪除自己的留言。
        </Alert>
        <Button
          variant="contained"
          color="primary"
          startIcon={<GitHubIcon />}
          onClick={() => signIn("github")}
          sx={{ backgroundColor: "#24292e", "&:hover": { backgroundColor: "#1b1f23" } }}
        >
          綁定 GitHub 帳號
        </Button>
      </Paper>
    );
  }

  // 載入中
  if (status === "loading") {
    return (
      <Box sx={{ mt: 6, textAlign: "center" }}>
        <Typography color="text.secondary">載入中...</Typography>
      </Box>
    );
  }

  // 已登入且有 GitHub - 顯示 Giscus
  return (
    <Box sx={{ mt: 6 }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
        留言討論
      </Typography>
      <Box ref={giscusRef} sx={{ minHeight: 200 }} />
    </Box>
  );
};

export default ArticleComments;
