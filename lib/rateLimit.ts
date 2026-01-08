/**
 * Rate limiting configuration using Upstash Redis
 * Prevents API abuse and protects expensive OpenAI API calls
 *
 * Note: Rate limiting is optional. If Redis is not configured,
 * requests will be allowed through without rate limiting.
 */

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Check if Redis is configured
const isRedisConfigured = !!(
  process.env.UPSTASH_REDIS_REST_URL &&
  process.env.UPSTASH_REDIS_REST_TOKEN
);

if (!isRedisConfigured) {
  console.warn("[Rate Limit] Redis not configured. Rate limiting is disabled.");
}

// Initialize Redis client only if configured
const redis = isRedisConfigured
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  : null;

/**
 * Rate limit for cover letter generation
 * 5 requests per hour per user (GPT-4 is expensive!)
 * Returns null if Redis is not configured
 */
export const generateLimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, "1 h"),
      analytics: true,
      prefix: "ratelimit:generate",
    })
  : null;

/**
 * Helper function to check rate limit and return appropriate response
 * @param limiter - The Ratelimit instance to use (or null if disabled)
 * @param identifier - Unique identifier (usually user_id)
 * @param limitName - Human-readable name for logging
 * @param maxRequests - Maximum requests allowed in the time window
 * @returns Object with success status and optional response
 */
export async function checkRateLimit(
  limiter: Ratelimit | null,
  identifier: string,
  limitName: string,
  maxRequests: number
): Promise<{ success: boolean; response?: Response; remaining?: number }> {
  // If rate limiting is disabled, allow all requests
  if (!limiter) {
    console.log(`[Rate Limit] Disabled - allowing ${limitName} request for ${identifier}`);
    return { success: true };
  }

  try {
    const { success, limit, reset, remaining } = await limiter.limit(identifier);

    if (!success) {
      const resetDate = new Date(reset);
      console.log(
        `[Rate Limit] ${limitName} limit exceeded for ${identifier}. ` +
        `Limit: ${limit}, Remaining: ${remaining}, Resets at: ${resetDate.toISOString()}`
      );

      return {
        success: false,
        response: new Response(
          JSON.stringify({
            error: `Rate limit exceeded. You can make ${maxRequests} ${limitName} requests per hour. Please try again later.`,
            limit,
            remaining,
            reset: resetDate.toISOString(),
          }),
          {
            status: 429,
            headers: {
              "Content-Type": "application/json",
              "X-RateLimit-Limit": limit.toString(),
              "X-RateLimit-Remaining": remaining.toString(),
              "X-RateLimit-Reset": reset.toString(),
            },
          }
        ),
      };
    }

    console.log(
      `[Rate Limit] ${limitName} check passed for ${identifier}. Remaining: ${remaining}/${limit}`
    );

    return { success: true, remaining };
  } catch (error) {
    console.error(`[Rate Limit] Error checking ${limitName}:`, error);
    // On error, allow the request through (fail open)
    return { success: true };
  }
}
