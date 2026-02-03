import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { checkRateLimit } from '../rate-limiter'

describe('checkRateLimit', () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	describe('basic rate limiting', () => {
		it('should allow requests under the limit', () => {
			const ip = `test-ip-${Math.random()}`
			const result1 = checkRateLimit(ip, { maxRequests: 3, windowMs: 1000 })
			expect(result1.success).toBe(true)
			expect(result1.remaining).toBe(2)

			const result2 = checkRateLimit(ip, { maxRequests: 3, windowMs: 1000 })
			expect(result2.success).toBe(true)
			expect(result2.remaining).toBe(1)
		})

		it('should block requests over the limit', () => {
			const ip = `test-ip-${Math.random()}`
			checkRateLimit(ip, { maxRequests: 2, windowMs: 1000 })
			checkRateLimit(ip, { maxRequests: 2, windowMs: 1000 })
			const result = checkRateLimit(ip, { maxRequests: 2, windowMs: 1000 })

			expect(result.success).toBe(false)
			expect(result.remaining).toBe(0)
		})

		it('should include reset time in response', () => {
			const ip = `test-ip-${Math.random()}`
			const now = Date.now()
			const result = checkRateLimit(ip, { maxRequests: 10, windowMs: 60000 })
			expect(result.reset).toBeGreaterThan(now)
		})
	})

	describe('per-IP isolation', () => {
		it('should track different IPs separately', () => {
			const ip1 = `ip-1-${Math.random()}`
			const ip2 = `ip-2-${Math.random()}`
			const result1 = checkRateLimit(ip1, { maxRequests: 1, windowMs: 1000 })
			const result2 = checkRateLimit(ip2, { maxRequests: 1, windowMs: 1000 })

			expect(result1.success).toBe(true)
			expect(result2.success).toBe(true)
		})

		it('should not affect other IPs when one is rate limited', () => {
			const ip1 = `ip-1-${Math.random()}`
			const ip2 = `ip-2-${Math.random()}`
			checkRateLimit(ip1, { maxRequests: 1, windowMs: 1000 })
			checkRateLimit(ip1, { maxRequests: 1, windowMs: 1000 })

			const result1 = checkRateLimit(ip1, { maxRequests: 1, windowMs: 1000 })
			const result2 = checkRateLimit(ip2, { maxRequests: 1, windowMs: 1000 })

			expect(result1.success).toBe(false)
			expect(result2.success).toBe(true)
		})
	})

	describe('window expiration', () => {
		it('should reset count after window expires', () => {
			const ip = `test-ip-${Math.random()}`
			checkRateLimit(ip, { maxRequests: 1, windowMs: 100 })

			// Advance time past window
			vi.advanceTimersByTime(150)

			const result = checkRateLimit(ip, { maxRequests: 1, windowMs: 100 })
			expect(result.success).toBe(true)
			expect(result.remaining).toBe(0) // Used 1 of 1
		})

		it('should not reset count before window expires', () => {
			const ip = `test-ip-${Math.random()}`
			checkRateLimit(ip, { maxRequests: 1, windowMs: 1000 })

			// Advance time but not enough
			vi.advanceTimersByTime(50)

			const result = checkRateLimit(ip, { maxRequests: 1, windowMs: 1000 })
			expect(result.success).toBe(false)
		})
	})

	describe('default configuration', () => {
		it('should use default max requests', () => {
			const ip = `test-ip-${Math.random()}`
			// Default is 60 requests
			for (let i = 0; i < 60; i++) {
				checkRateLimit(ip)
			}
			const result = checkRateLimit(ip)
			expect(result.success).toBe(false)
		})

		it('should use default window of 60 seconds', () => {
			const ip = `test-ip-${Math.random()}`
			const result = checkRateLimit(ip)
			const now = Date.now()
			const expectedReset = now + 60000
			// Allow small tolerance
			expect(result.reset).toBeGreaterThanOrEqual(expectedReset - 10)
			expect(result.reset).toBeLessThanOrEqual(expectedReset + 10)
		})
	})
})
