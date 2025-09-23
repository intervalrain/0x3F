"use client";

import { useAuth } from "@/hooks/useAuth";

export default function AuthButton() {
  const { user, isAuthenticated, isLoading, login, logout, isSyncing } = useAuth();

  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px' }}>
        <div style={{
          width: '8px',
          height: '8px',
          backgroundColor: '#6b7280',
          borderRadius: '50%',
          animation: 'pulse 2s infinite'
        }} />
        <span style={{ fontSize: '14px', color: '#6b7280' }}>載入中...</span>
      </div>
    );
  }

  if (isAuthenticated && user) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {isSyncing && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '8px',
              height: '8px',
              backgroundColor: '#10b981',
              borderRadius: '50%',
              animation: 'pulse 2s infinite'
            }} />
            <span style={{ fontSize: '12px', color: '#6b7280' }}>同步中</span>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {user.image && (
            <img
              src={user.image}
              alt={user.name || "User"}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                border: '1px solid #e5e7eb'
              }}
            />
          )}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
              {user.name}
            </span>
            <span style={{ fontSize: '12px', color: '#6b7280' }}>
              {user.email}
            </span>
          </div>
        </div>

        <button
          onClick={() => logout()}
          style={{
            padding: '8px 16px',
            fontSize: '14px',
            fontWeight: '500',
            color: '#374151',
            backgroundColor: 'white',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
        >
          登出
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => login()}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 16px',
        fontSize: '14px',
        fontWeight: '500',
        color: 'white',
        backgroundColor: '#2563eb',
        borderRadius: '8px',
        border: 'none',
        cursor: 'pointer',
        transition: 'background-color 0.2s'
      }}
      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
      onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
    >
      <svg
        style={{ width: '16px', height: '16px' }}
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
      使用 Google 登入
    </button>
  );
}