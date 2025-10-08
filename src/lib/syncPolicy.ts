/**
 * 雲端同步權限管理
 *
 * 三層權限架構：
 * 1. Normal User: 只使用 localStorage
 * 2. Certificate User: localStorage + DB 同步
 * 3. Admin: localStorage + DB 同步 + 管理 Certificate User
 */

export enum UserRole {
  NORMAL = 'NORMAL',
  CERTIFICATE = 'CERTIFICATE',
  ADMIN = 'ADMIN',
}

export interface UserPermissions {
  role: UserRole;
  canSyncToCloud: boolean;
  canReadFromCloud: boolean;
  canManageCertificates: boolean;
}

/**
 * 從環境變數讀取授權的 emails
 */
function getAuthorizedEmails(): { admin: string; certificates: string[] } {
  const admin = process.env.NEXT_PUBLIC_ADMIN_EMAIL || '';
  const certificatesStr = process.env.NEXT_PUBLIC_CERTIFICATE_EMAILS || '';
  const certificates = certificatesStr
    .split(',')
    .map(email => email.trim())
    .filter(Boolean);

  return { admin, certificates };
}

/**
 * 檢查是否為 Admin
 */
export function isAdmin(userEmail?: string | null): boolean {
  if (!userEmail) return false;
  const { admin } = getAuthorizedEmails();
  return userEmail === admin;
}

/**
 * 檢查是否有 Certificate
 */
export function hasCertificate(userEmail?: string | null): boolean {
  if (!userEmail) return false;
  const { certificates } = getAuthorizedEmails();
  return certificates.includes(userEmail);
}

/**
 * 根據用戶 email 判斷角色
 */
export function getUserRole(userEmail?: string | null): UserRole {
  if (!userEmail) return UserRole.NORMAL;
  if (isAdmin(userEmail)) return UserRole.ADMIN;
  if (hasCertificate(userEmail)) return UserRole.CERTIFICATE;
  return UserRole.NORMAL;
}

/**
 * 取得用戶完整權限
 */
export function getUserPermissions(userEmail?: string | null): UserPermissions {
  const role = getUserRole(userEmail);

  return {
    role,
    canSyncToCloud: role === UserRole.ADMIN || role === UserRole.CERTIFICATE,
    canReadFromCloud: role === UserRole.ADMIN || role === UserRole.CERTIFICATE,
    canManageCertificates: role === UserRole.ADMIN,
  };
}
