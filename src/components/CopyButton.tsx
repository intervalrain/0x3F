'use client';

import React, { useState, useEffect } from 'react';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';

interface CopyButtonProps {
  code: string;
}

export default function CopyButton({ code }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCopy = async () => {
    try {
      // Check if clipboard API is available
      if (!navigator.clipboard) {
        console.error('Clipboard API not available');
        // Fallback method
        const textArea = document.createElement('textarea');
        textArea.value = code;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand('copy');
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch (err) {
          console.error('Fallback copy failed:', err);
        } finally {
          document.body.removeChild(textArea);
        }
        return;
      }

      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err, 'Code length:', code.length);
    }
  };

  // Don't render anything until mounted on client
  if (!mounted) {
    return null;
  }

  return (
    <button
      onClick={handleCopy}
      className="copy-button"
      aria-label="Copy code"
      title={copied ? 'Copied!' : 'Copy code'}
    >
      {copied ? (
        <CheckIcon style={{ fontSize: 18 }} />
      ) : (
        <ContentCopyIcon style={{ fontSize: 18 }} />
      )}
    </button>
  );
}
