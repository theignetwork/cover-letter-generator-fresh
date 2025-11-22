/**
 * Rate limiting configuration using Upstash Redis
 * Prevents API abuse and protects expensive OpenAI API calls
 */

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Initialize Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

/**
 * Rate limit for cover letter generation
 * 5 requests per hour per user (GPT-4 is expensive!)
 */
export const generateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "1 h"),
  analytics: true,
  prefix: "ratelimit:generate",
});

/**
 * Helper function to check rate limit and return appropriate response
 * @param limiter - The Ratelimit instance to use
 * @param identifier - Unique identifier (usually user_id)
 * @param limitName - Human-readable name for logging
 * @param maxRequests - Maximum requests allowed in the time window
 * @returns Object with success status and optional response
 */
export async function checkRateLimit(
  limiter: Ratelimit,
  identifier: string,
  limitName: string,
  maxRequests: number
): Promise<{ success: boolean; response?: Response; remaining?: number }> {
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
