"use client";

import React from 'react';
import Link from 'next/link';
import { Article } from '@/lib/articles';

interface ArticleListContentProps {
  folderTitle: string;
  folderDescription: string;
  articles: Article[];
  folder: string;
}

const ArticleListContent: React.FC<ArticleListContentProps> = ({
  folderTitle,
  folderDescription,
  articles,
  folder
}) => {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      overflowY: 'auto',
      padding: '40px',
      background: 'white'
    }}>
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          marginBottom: '16px',
          color: '#1f2937'
        }}>
          {folderTitle}
        </h1>

        {folderDescription && (
          <p style={{
            fontSize: '1.125rem',
            color: '#6b7280'
          }}>
            {folderDescription}
          </p>
        )}
      </header>

      {articles.length === 0 ? (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px 20px',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '4rem',
            marginBottom: '20px',
            opacity: 0.3
          }}>
            📝
          </div>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            color: '#6b7280',
            marginBottom: '12px'
          }}>
            目前還沒有文章
          </h2>
          <p style={{
            fontSize: '1rem',
            color: '#9ca3af',
            maxWidth: '400px'
          }}>
            這個分類暫時沒有內容，請稍後再來查看。
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {articles.map(article => (
            <Link
              key={article.slug}
              href={`/articles/${folder}/${article.slug}`}
              style={{
                display: 'block',
                padding: '24px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                textDecoration: 'none',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                e.currentTarget.style.borderColor = '#3b82f6';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = '#e5e7eb';
              }}
            >
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                marginBottom: '12px',
                color: '#1f2937'
              }}>
                {article.metadata.title}
              </h2>

              {article.metadata.description && (
                <p style={{
                  fontSize: '1rem',
                  color: '#6b7280',
                  marginBottom: '12px'
                }}>
                  {article.metadata.description}
                </p>
              )}

              {article.metadata.tags && article.metadata.tags.length > 0 && (
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {article.metadata.tags.map(tag => (
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
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ArticleListContent;
