import React from 'react';
import Link from 'next/link';
import { ArticleNavigation as ArticleNavigationType } from '@/lib/articles';

interface ArticleNavigationProps {
  navigation: ArticleNavigationType;
}

const ArticleNavigation: React.FC<ArticleNavigationProps> = ({ navigation }) => {
  if (!navigation.prev && !navigation.next) {
    return null;
  }

  return (
    <nav
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '16px',
        marginTop: '48px',
        paddingTop: '32px',
        borderTop: '2px solid #e5e7eb',
      }}
    >
      {navigation.prev ? (
        <Link
          href={navigation.prev.path}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            padding: '16px 20px',
            backgroundColor: '#f9fafb',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            textDecoration: 'none',
            color: 'inherit',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f3f4f6';
            e.currentTarget.style.borderColor = '#2563eb';
            e.currentTarget.style.transform = 'translateX(-4px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#f9fafb';
            e.currentTarget.style.borderColor = '#e5e7eb';
            e.currentTarget.style.transform = 'translateX(0)';
          }}
        >
          <span style={{
            fontSize: '12px',
            color: '#6b7280',
            marginBottom: '4px',
            fontWeight: 500,
          }}>
            ← 上一篇
          </span>
          <span style={{
            fontSize: '14px',
            color: '#1f2937',
            fontWeight: 600,
          }}>
            {navigation.prev.title}
          </span>
        </Link>
      ) : (
        <div style={{ flex: 1 }} />
      )}

      {navigation.next ? (
        <Link
          href={navigation.next.path}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            padding: '16px 20px',
            backgroundColor: '#f9fafb',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            textDecoration: 'none',
            color: 'inherit',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f3f4f6';
            e.currentTarget.style.borderColor = '#2563eb';
            e.currentTarget.style.transform = 'translateX(4px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#f9fafb';
            e.currentTarget.style.borderColor = '#e5e7eb';
            e.currentTarget.style.transform = 'translateX(0)';
          }}
        >
          <span style={{
            fontSize: '12px',
            color: '#6b7280',
            marginBottom: '4px',
            fontWeight: 500,
          }}>
            下一篇 →
          </span>
          <span style={{
            fontSize: '14px',
            color: '#1f2937',
            fontWeight: 600,
            textAlign: 'right',
          }}>
            {navigation.next.title}
          </span>
        </Link>
      ) : (
        <div style={{ flex: 1 }} />
      )}
    </nav>
  );
};

export default ArticleNavigation;
