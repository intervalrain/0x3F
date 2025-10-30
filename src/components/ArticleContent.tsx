"use client";

import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import 'highlight.js/styles/vs.css';
import './ArticleContent.css';
import { ArticleMetadata, ArticleNavigation } from '@/lib/articles';
import ArticleNavigationComponent from './ArticleNavigation';
import TableOfContents from './TableOfContents';
import CopyButton from './CopyButton';

interface ArticleContentProps {
  metadata: ArticleMetadata;
  content: string;
  navigation?: ArticleNavigation;
}

const ArticleContent: React.FC<ArticleContentProps> = ({ metadata, content, navigation }) => {
  // Helper function to strip markdown formatting from text
  const stripMarkdown = (text: string): string => {
    return text
      // Remove bold/italic: ***text*** -> text, **text** -> text, *text* -> text
      .replace(/\*\*\*(.+?)\*\*\*/g, '$1')
      .replace(/\*\*(.+?)\*\*/g, '$1')
      .replace(/\*(.+?)\*/g, '$1')
      // Remove underline bold/italic: ___text___ -> text, __text__ -> text, _text_ -> text
      .replace(/___(.+?)___/g, '$1')
      .replace(/__(.+?)__/g, '$1')
      .replace(/_(.+?)_/g, '$1')
      // Remove inline code: `code` -> code
      .replace(/`(.+?)`/g, '$1')
      // Remove strikethrough: ~~text~~ -> text
      .replace(/~~(.+?)~~/g, '$1')
      // Remove links: [text](url) -> text
      .replace(/\[(.+?)\]\(.+?\)/g, '$1')
      // Remove images: ![alt](url) -> alt
      .replace(/!\[(.+?)\]\(.+?\)/g, '$1');
  };

  // Pre-generate heading IDs from content to avoid hydration mismatch
  const headingIds = useMemo(() => {
    const ids = new Map<string, string>();
    const lines = content.split('\n');
    let counter = 0;

    lines.forEach((line) => {
      const match = line.match(/^(#{1,6})\s+(.+)$/);
      if (match) {
        const rawText = match[2].trim();
        const cleanText = stripMarkdown(rawText);
        const id = `heading-${counter}-${cleanText.toLowerCase().replace(/[^\w\u4e00-\u9fa5]+/g, '-')}`;
        // Store both raw and clean text mappings
        ids.set(rawText, id);
        ids.set(cleanText, id);
        counter++;
      }
    });

    return ids;
  }, [content]);

  const getHeadingId = (text: string | React.ReactNode): string => {
    const textStr = typeof text === 'string' ? text : String(text);
    // Try to find by exact match first, then by stripped version
    return headingIds.get(textStr) || headingIds.get(stripMarkdown(textStr)) ||
           `heading-${textStr.toLowerCase().replace(/[^\w\u4e00-\u9fa5]+/g, '-')}`;
  };

  return (
    <div className="article-page" style={{
      width: '100%',
      height: '100%',
      overflowY: 'auto',
      padding: '40px',
      background: 'white'
    }}>
      {/* Article Header */}
      <header style={{ marginBottom: '40px', borderBottom: '1px solid #e5e7eb', paddingBottom: '20px' }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          marginBottom: '16px',
          color: '#1f2937'
        }}>
          {metadata.title}
        </h1>

        {metadata.description && (
          <p style={{
            fontSize: '1.125rem',
            color: '#6b7280',
            marginBottom: '16px'
          }}>
            {metadata.description}
          </p>
        )}

        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', fontSize: '0.875rem', color: '#9ca3af' }}>
          {metadata.author && (
            <span>作者: {metadata.author}</span>
          )}
          {metadata.date && (
            <span>日期: {metadata.date}</span>
          )}
        </div>

        {metadata.tags && metadata.tags.length > 0 && (
          <div style={{ marginTop: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {metadata.tags.map(tag => (
              <span
                key={tag}
                style={{
                  backgroundColor: '#f3f4f6',
                  color: '#4b5563',
                  padding: '4px 12px',
                  borderRadius: '9999px',
                  fontSize: '0.875rem'
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* Table of Contents */}
      <TableOfContents content={content} />

      {/* Article Content */}
      <article className="prose prose-lg" style={{
        fontSize: '1rem',
        lineHeight: '1.75',
        color: '#374151',
        maxWidth: '100%'
      }}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight, rehypeRaw]}
          components={{
            h1: ({ children }) => {
              const id = getHeadingId(children);
              return (
                <h1 id={id} style={{ fontSize: '2rem', fontWeight: 'bold', marginTop: '48px', marginBottom: '24px', scrollMarginTop: '20px' }}>
                  {children}
                </h1>
              );
            },
            h2: ({ children }) => {
              const id = getHeadingId(children);
              return (
                <h2 id={id} style={{ fontSize: '1.5rem', fontWeight: 'bold', marginTop: '40px', marginBottom: '20px', scrollMarginTop: '20px' }}>
                  {children}
                </h2>
              );
            },
            h3: ({ children }) => {
              const id = getHeadingId(children);
              return (
                <h3 id={id} style={{ fontSize: '1.25rem', fontWeight: 'bold', marginTop: '32px', marginBottom: '16px', scrollMarginTop: '20px' }}>
                  {children}
                </h3>
              );
            },
            h4: ({ children }) => {
              const id = getHeadingId(children);
              return (
                <h4 id={id} style={{ fontSize: '1.125rem', fontWeight: 'bold', marginTop: '24px', marginBottom: '12px', scrollMarginTop: '20px' }}>
                  {children}
                </h4>
              );
            },
            h5: ({ children }) => {
              const id = getHeadingId(children);
              return (
                <h5 id={id} style={{ fontSize: '1rem', fontWeight: 'bold', marginTop: '20px', marginBottom: '10px', scrollMarginTop: '20px' }}>
                  {children}
                </h5>
              );
            },
            h6: ({ children }) => {
              const id = getHeadingId(children);
              return (
                <h6 id={id} style={{ fontSize: '0.875rem', fontWeight: 'bold', marginTop: '16px', marginBottom: '8px', scrollMarginTop: '20px' }}>
                  {children}
                </h6>
              );
            },
            p: ({ children }) => (
              <p style={{ marginBottom: '16px' }}>{children}</p>
            ),
            ul: ({ children }) => (
              <ul style={{ marginBottom: '16px', paddingLeft: '24px', listStyleType: 'disc' }}>
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol style={{ marginBottom: '16px', paddingLeft: '24px', listStyleType: 'decimal' }}>
                {children}
              </ol>
            ),
            li: ({ children }) => (
              <li style={{ marginBottom: '8px' }}>{children}</li>
            ),
            code: ({ className, children, ...props }) => {
              const isInline = !className;
              return isInline ? (
                <code
                  style={{
                    backgroundColor: '#e8e8e8',
                    color: '#dc2626',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '0.875em',
                    fontFamily: 'Consolas, Monaco, "Courier New", monospace'
                  }}
                  {...props}
                >
                  {children}
                </code>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
            pre: ({ children }) => {
              // Extract plain text content from code element recursively
              const extractTextContent = (node: React.ReactNode): string => {
                if (typeof node === 'string') {
                  return node;
                }
                if (typeof node === 'number') {
                  return String(node);
                }
                if (Array.isArray(node)) {
                  return node.map(extractTextContent).join('');
                }
                if (React.isValidElement(node)) {
                  const props = node.props as { children?: React.ReactNode };
                  if (props.children) {
                    return extractTextContent(props.children);
                  }
                }
                return '';
              };

              // Find the code element
              const codeElement = React.Children.toArray(children).find(
                (child): child is React.ReactElement<{ children?: React.ReactNode }> =>
                  React.isValidElement(child) && child.type === 'code'
              );

              // Extract all text content from the code element
              const codeContent = codeElement
                ? extractTextContent(codeElement.props.children)
                : extractTextContent(children);

              return (
                <div style={{ position: 'relative', marginBottom: '24px' }}>
                  <pre style={{
                    backgroundColor: '#b0b0b0',
                    border: '1px solid #d0d0d0',
                    padding: '20px',
                    paddingTop: '48px',
                    borderRadius: '8px',
                    overflowX: 'auto',
                    fontSize: '0.875rem',
                    lineHeight: '1.6',
                    fontFamily: 'Consolas, Monaco, "Courier New", monospace'
                  }}>
                    {children}
                  </pre>
                  <div style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    zIndex: 10
                  }}>
                    <CopyButton code={codeContent} />
                  </div>
                </div>
              );
            },
            blockquote: ({ children }) => (
              <blockquote style={{
                borderLeft: '4px solid #e5e7eb',
                paddingLeft: '20px',
                marginBottom: '16px',
                color: '#6b7280',
                fontStyle: 'italic'
              }}>
                {children}
              </blockquote>
            ),
            a: ({ href, children }) => (
              <a
                href={href}
                style={{ color: '#3b82f6', textDecoration: 'underline' }}
                target={href?.startsWith('http') ? '_blank' : undefined}
                rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
              >
                {children}
              </a>
            ),
            table: ({ children }) => (
              <div style={{ overflowX: 'auto', marginBottom: '24px' }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  border: '1px solid #e5e7eb',
                  fontSize: '0.875rem'
                }}>
                  {children}
                </table>
              </div>
            ),
            thead: ({ children }) => (
              <thead style={{
                backgroundColor: '#f9fafb',
                borderBottom: '2px solid #d1d5db'
              }}>
                {children}
              </thead>
            ),
            tbody: ({ children }) => (
              <tbody>
                {children}
              </tbody>
            ),
            tr: ({ children }) => (
              <tr style={{
                borderBottom: '1px solid #e5e7eb'
              }}>
                {children}
              </tr>
            ),
            th: ({ children }) => (
              <th style={{
                padding: '12px 16px',
                textAlign: 'left',
                fontWeight: '600',
                color: '#374151',
                borderRight: '1px solid #e5e7eb'
              }}>
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td style={{
                padding: '12px 16px',
                color: '#4b5563',
                borderRight: '1px solid #e5e7eb'
              }}>
                {children}
              </td>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </article>

      {/* Article Navigation */}
      {navigation && <ArticleNavigationComponent navigation={navigation} />}
    </div>
  );
};

export default ArticleContent;
