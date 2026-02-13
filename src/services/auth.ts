import type { UserInfo } from '../types';

export async function getUserInfo(): Promise<UserInfo | null> {
  if (import.meta.env.DEV) {
    return {
      userId: 'dev-user',
      userDetails: 'Developer',
      identityProvider: 'dev',
      userRoles: ['authenticated'],
    };
  }
  try {
    const res = await fetch('/.auth/me');
    const data = await res.json();
    const clientPrincipal = data.clientPrincipal;
    if (!clientPrincipal) return null;
    return {
      userId: clientPrincipal.userId,
      userDetails: clientPrincipal.userDetails,
      identityProvider: clientPrincipal.identityProvider,
      userRoles: clientPrincipal.userRoles,
    };
  } catch {
    return null;
  }
}

export function loginUrl(): string {
  return '/.auth/login/aad';
}

export function logoutUrl(): string {
  return '/.auth/logout';
}
