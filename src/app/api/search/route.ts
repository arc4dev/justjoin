import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { searchPokemon } from '@/features/pokemon-registration/services/search.service'
import { Pokemon } from '@/features/pokemon-registration/types/pokemon.types'
import { checkRateLimit } from '@/lib/utils/rate-limiter'

let cachedPokemons: Pokemon[] | null = null

/**
 * Loads Pokemon data from JSON file with caching
 */
async function loadPokemons(): Promise<Pokemon[]> {
	if (cachedPokemons) {
		return cachedPokemons
	}

	const filePath = join(
		process.cwd(),
		'src',
		'features',
		'pokemon-registration',
		'data',
		'pokemons.json'
	)
	const fileContent = await readFile(filePath, 'utf-8')
	const jsonData = JSON.parse(fileContent)
	cachedPokemons = jsonData.data // Extract data array from wrapper object
	return cachedPokemons!
}

/**
 * GET /api/search?name=<query>
 * Fuzzy search Pokemon names with rate limiting
 */
export async function GET(request: NextRequest) {
	try {
		// Get client IP for rate limiting
		const ip =
			request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'

		// Check rate limit
		const rateLimitResult = checkRateLimit(ip, {
			maxRequests: 60,
			windowMs: 60000 // 60 requests per minute
		})

		// Add rate limit headers
		const headers = {
			'X-RateLimit-Limit': rateLimitResult.limit.toString(),
			'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
			'X-RateLimit-Reset': new Date(rateLimitResult.reset).toISOString()
		}

		if (!rateLimitResult.success) {
			return NextResponse.json(
				{ error: 'Too many requests. Please try again later.' },
				{
					status: 429,
					headers
				}
			)
		}

		// Get search query
		const searchParams = request.nextUrl.searchParams
		const query = searchParams.get('name')

		if (!query || query.trim().length < 2) {
			return NextResponse.json(
				{ error: 'Query must be at least 2 characters' },
				{ status: 400, headers }
			)
		}

		// Load Pokemon data
		const pokemons = await loadPokemons()

		// Perform fuzzy search
		const results = searchPokemon(query, pokemons, 10)

		return NextResponse.json({ results }, { headers })
	} catch (error) {
		console.error('Search API error:', error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}
