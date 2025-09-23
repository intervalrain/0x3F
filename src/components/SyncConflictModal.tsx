"use client";

import React, { useState } from "react";
import { TopicProgress } from "@/types";

interface SyncConflictModalProps {
  localData: TopicProgress[];
  cloudData: TopicProgress[];
  onResolve: (strategy: 'local' | 'cloud' | 'merge') => void;
  onCancel: () => void;
}

const SyncConflictModal: React.FC<SyncConflictModalProps> = ({
  localData,
  cloudData,
  onResolve,
  onCancel
}) => {
  const [selectedCard, setSelectedCard] = useState<'local' | 'cloud' | null>(null);

  // 計算完成的題目數量
  const countCompleted = (data: TopicProgress[]) => {
    let count = 0;
    data.forEach(tp => {
      tp.chapters?.forEach(ch => {
        ch.subsections?.forEach(ss => {
          ss.problems?.forEach(p => {
            if (p.completed) count++;
          });
        });
      });
    });
    return count;
  };

  const localCompletedCount = countCompleted(localData);
  const cloudCompletedCount = countCompleted(cloudData);

  // 獲取最後更新時間
  const getLastUpdateTime = (isLocal: boolean) => {
    const date = new Date();
    if (isLocal) {
      return "剛才";
    } else {
      date.setHours(date.getHours() - 1);
      return date.toLocaleTimeString('zh-TW');
    }
  };

  const handleConfirm = () => {
    if (selectedCard) {
      onResolve(selectedCard);
    }
  };

  return (
    <>
      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .card-hover {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .card-hover:hover {
          transform: translateY(-4px);
        }
      `}</style>

      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
        animation: 'fadeIn 0.3s ease-out'
      }}>
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.98)',
          borderRadius: '24px',
          padding: '40px',
          maxWidth: '900px',
          width: '90%',
          boxShadow: '0 25px 80px rgba(0, 0, 0, 0.25)',
          animation: 'slideUp 0.4s ease-out',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          {/* 標題區 */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: '#1f2937',
              marginBottom: '12px'
            }}>
              選擇您要保留的資料
            </h2>
            <p style={{
              fontSize: '16px',
              color: '#6b7280'
            }}>
              檢測到本地和雲端都有進度資料，請選擇要使用哪一份
            </p>
          </div>

          {/* 卡片選擇區 */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '24px',
            marginBottom: '32px'
          }}>
            {/* 本地資料卡片 */}
            <div
              className="card-hover"
              onClick={() => setSelectedCard('local')}
              style={{
                padding: '28px',
                borderRadius: '16px',
                cursor: 'pointer',
                position: 'relative',
                background: selectedCard === 'local'
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  : 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
                border: selectedCard === 'local'
                  ? '3px solid #7c3aed'
                  : '3px solid transparent',
                boxShadow: selectedCard === 'local'
                  ? '0 20px 40px rgba(124, 58, 237, 0.3)'
                  : '0 10px 25px rgba(0, 0, 0, 0.1)'
              }}
            >
              {/* 選中標記 */}
              {selectedCard === 'local' && (
                <div style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  width: '32px',
                  height: '32px',
                  backgroundColor: 'white',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }}>
                  <span style={{ fontSize: '20px' }}>✓</span>
                </div>
              )}

              {/* 圖標 */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '20px'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  backgroundColor: selectedCard === 'local' ? 'rgba(255, 255, 255, 0.2)' : '#ddd6fe',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px'
                }}>
                  💻
                </div>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                  marginLeft: '16px',
                  color: selectedCard === 'local' ? 'white' : '#1f2937'
                }}>
                  本地資料
                </h3>
              </div>

              {/* 資訊 */}
              <div style={{ marginBottom: '16px' }}>
                <p style={{
                  fontSize: '14px',
                  color: selectedCard === 'local' ? 'rgba(255, 255, 255, 0.8)' : '#6b7280',
                  marginBottom: '8px'
                }}>
                  最後更新：{getLastUpdateTime(true)}
                </p>
                <p style={{
                  fontSize: '32px',
                  fontWeight: 'bold',
                  color: selectedCard === 'local' ? 'white' : '#059669'
                }}>
                  {localCompletedCount}
                  <span style={{
                    fontSize: '16px',
                    fontWeight: 'normal',
                    marginLeft: '8px',
                    color: selectedCard === 'local' ? 'rgba(255, 255, 255, 0.9)' : '#6b7280'
                  }}>
                    題已完成
                  </span>
                </p>
              </div>

              {/* 描述 */}
              <p style={{
                fontSize: '13px',
                color: selectedCard === 'local' ? 'rgba(255, 255, 255, 0.7)' : '#9ca3af',
                lineHeight: '1.5'
              }}>
                儲存在此裝置瀏覽器的進度
              </p>
            </div>

            {/* 雲端資料卡片 */}
            <div
              className="card-hover"
              onClick={() => setSelectedCard('cloud')}
              style={{
                padding: '28px',
                borderRadius: '16px',
                cursor: 'pointer',
                position: 'relative',
                background: selectedCard === 'cloud'
                  ? 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)'
                  : 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
                border: selectedCard === 'cloud'
                  ? '3px solid #2563eb'
                  : '3px solid transparent',
                boxShadow: selectedCard === 'cloud'
                  ? '0 20px 40px rgba(37, 99, 235, 0.3)'
                  : '0 10px 25px rgba(0, 0, 0, 0.1)'
              }}
            >
              {/* 選中標記 */}
              {selectedCard === 'cloud' && (
                <div style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  width: '32px',
                  height: '32px',
                  backgroundColor: 'white',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }}>
                  <span style={{ fontSize: '20px' }}>✓</span>
                </div>
              )}

              {/* 圖標 */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '20px'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  backgroundColor: selectedCard === 'cloud' ? 'rgba(255, 255, 255, 0.2)' : '#bfdbfe',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px'
                }}>
                  ☁️
                </div>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                  marginLeft: '16px',
                  color: selectedCard === 'cloud' ? 'white' : '#1f2937'
                }}>
                  雲端資料
                </h3>
              </div>

              {/* 資訊 */}
              <div style={{ marginBottom: '16px' }}>
                <p style={{
                  fontSize: '14px',
                  color: selectedCard === 'cloud' ? 'rgba(255, 255, 255, 0.8)' : '#6b7280',
                  marginBottom: '8px'
                }}>
                  最後更新：{getLastUpdateTime(false)}
                </p>
                <p style={{
                  fontSize: '32px',
                  fontWeight: 'bold',
                  color: selectedCard === 'cloud' ? 'white' : '#059669'
                }}>
                  {cloudCompletedCount}
                  <span style={{
                    fontSize: '16px',
                    fontWeight: 'normal',
                    marginLeft: '8px',
                    color: selectedCard === 'cloud' ? 'rgba(255, 255, 255, 0.9)' : '#6b7280'
                  }}>
                    題已完成
                  </span>
                </p>
              </div>

              {/* 描述 */}
              <p style={{
                fontSize: '13px',
                color: selectedCard === 'cloud' ? 'rgba(255, 255, 255, 0.7)' : '#9ca3af',
                lineHeight: '1.5'
              }}>
                同步在您 Google 帳號的進度
              </p>
            </div>
          </div>

          {/* 智能合併選項 */}
          <div style={{
            padding: '16px',
            backgroundColor: '#f0fdf4',
            borderRadius: '12px',
            border: '1px solid #86efac',
            marginBottom: '24px',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onClick={() => onResolve('merge')}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#dcfce7';
            e.currentTarget.style.transform = 'scale(1.02)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#f0fdf4';
            e.currentTarget.style.transform = 'scale(1)';
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ fontSize: '24px', marginRight: '12px' }}>🔄</span>
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#166534', marginBottom: '4px' }}>
                    智能合併（推薦）
                  </h4>
                  <p style={{ fontSize: '13px', color: '#16a34a' }}>
                    自動保留兩邊所有已完成的題目記錄
                  </p>
                </div>
              </div>
              <div style={{
                padding: '6px 12px',
                backgroundColor: '#22c55e',
                color: 'white',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: '500'
              }}>
                最佳選擇
              </div>
            </div>
          </div>

          {/* 操作按鈕 */}
          <div style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'flex-end'
          }}>
            <button
              onClick={onCancel}
              style={{
                padding: '12px 24px',
                fontSize: '15px',
                fontWeight: '500',
                color: '#6b7280',
                backgroundColor: 'transparent',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#f3f4f6';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              稍後決定
            </button>
            <button
              onClick={handleConfirm}
              disabled={!selectedCard}
              style={{
                padding: '12px 32px',
                fontSize: '15px',
                fontWeight: '600',
                color: 'white',
                backgroundColor: selectedCard
                  ? (selectedCard === 'local' ? '#7c3aed' : '#2563eb')
                  : '#d1d5db',
                border: 'none',
                borderRadius: '12px',
                cursor: selectedCard ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s',
                opacity: selectedCard ? 1 : 0.5
              }}
            >
              確認使用{selectedCard === 'local' ? '本地' : selectedCard === 'cloud' ? '雲端' : ''}資料
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SyncConflictModal;