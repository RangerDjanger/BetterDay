import type { UserInfo } from '../types';

export async function getUserInfo(): Promise<UserInfo | null> {
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
