"use client";

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import 'highlight.js/styles/vs.css';
import './ArticleContent.css';
import { ArticleMetadata, ArticleNavigation } from '@/lib/articles';
import ArticleNavigationComponent from './ArticleNavigation';

interface ArticleContentProps {
  metadata: ArticleMetadata;
  content: string;
  navigation?: ArticleNavigation;
}

const ArticleContent: React.FC<ArticleContentProps> = ({ metadata, content, navigation }) => {
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
            h1: ({ children }) => (
              <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginTop: '48px', marginBottom: '24px' }}>
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginTop: '40px', marginBottom: '20px' }}>
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginTop: '32px', marginBottom: '16px' }}>
                {children}
              </h3>
            ),
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
            pre: ({ children }) => (
              <pre style={{
                backgroundColor: '#b0b0b0',
                border: '1px solid #d0d0d0',
                padding: '2px',
                borderRadius: '8px',
                overflowX: 'auto',
                marginBottom: '24px',
                fontSize: '0.875rem',
                lineHeight: '1.6',
                fontFamily: 'Consolas, Monaco, "Courier New", monospace'
              }}>
                {children}
              </pre>
            ),
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
