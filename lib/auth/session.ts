import { cookies, headers } from 'next/headers';
import { NextRequest } from 'next/server';
import { verifyToken, TokenPayload } from './jwt';

export const AUTH_COOKIE_NAME = 'ai_lifedesk_session';

export async function getCurrentUser(): Promise<TokenPayload | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

    if (token) {
      return await verifyToken(token);
    }

    const headersList = headers();
    const authHeader = headersList.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const bearerToken = authHeader.substring(7);
      return await verifyToken(bearerToken);
    }

    return null;
  } catch (error) {
    return null;
  }
}

export async function getSessionFromRequest(request: NextRequest): Promise<TokenPayload | null> {
  const cookieToken = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (cookieToken) {
    const user = await verifyToken(cookieToken);
    if (user) return user;
  }

  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    return await verifyToken(token);
  }

  return null;
}
