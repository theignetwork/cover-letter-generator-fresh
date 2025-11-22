/**
 * Authentication helper for server-side API routes
 * Verifies JWT tokens and extracts user information
 */

import { jwtVerify } from 'jose';

interface UserPayload {
  user_id: number;
  email: string;
  name: string;
  membership_level: string;
  exp?: number;
  iat?: number;
}

/**
 * Extract and verify user from request
 * Checks Authorization header for Bearer token
 */
export async function getUserFromRequest(request: Request): Promise<UserPayload | null> {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      console.log('[Auth] No token in Authorization header');
      return null;
    }

    // Verify JWT with server-side secret
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('[Auth] JWT_SECRET not configured');
      return null;
    }

    const secretKey = new TextEncoder().encode(secret);
    const { payload } = await jwtVerify(token, secretKey);

    console.log(`[Auth] Verified user ${payload.user_id}`);

    // TypeScript requires casting through unknown because JWTPayload is a generic type
    return payload as unknown as UserPayload;

  } catch (error) {
    console.error('[Auth] Token verification failed:', error);
    return null;
  }
}
