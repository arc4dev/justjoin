/**
 * Simple in-memory rate limiter based on IP address
 * For production with multiple instances, I would choose
 * something like Upstash Redis or Vercel KV.
 */

interface RateLimitEntry {
	count: number
	resetAt: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

/**
 * Rate limiter configuration
 */
export interface RateLimitConfig {
	maxRequests: number
	windowMs: number
}

/**
 * Checks if a request should be rate limited
 * @param identifier - Unique identifier (e.g., IP address)
 * @param config - Rate limit configuration
 * @returns Object with success flag and retry information
 */
export function checkRateLimit(
	identifier: string,
	config: RateLimitConfig = { maxRequests: 60, windowMs: 60000 } // 60 requests per minute
): { success: boolean; limit: number; remaining: number; reset: number } {
	const now = Date.now()
	const entry = rateLimitStore.get(identifier)

	// Clean up expired entries periodically
	if (rateLimitStore.size > 1000) {
		for (const [key, value] of rateLimitStore.entries()) {
			if (value.resetAt < now) {
				rateLimitStore.delete(key)
			}
		}
	}

	if (!entry || entry.resetAt < now) {
		// Create new entry or reset expired one
		const resetAt = now + config.windowMs
		rateLimitStore.set(identifier, { count: 1, resetAt })
		return {
			success: true,
			limit: config.maxRequests,
			remaining: config.maxRequests - 1,
			reset: resetAt
		}
	}

	if (entry.count >= config.maxRequests) {
		// Rate limit exceeded
		return {
			success: false,
			limit: config.maxRequests,
			remaining: 0,
			reset: entry.resetAt
		}
	}

	// Increment count
	entry.count++
	return {
		success: true,
		limit: config.maxRequests,
		remaining: config.maxRequests - entry.count,
		reset: entry.resetAt
	}
}
