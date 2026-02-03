import Fuse, { type IFuseOptions } from 'fuse.js'
import { Pokemon, SearchResult } from '../types/pokemon.types'

/**
 * Fuse.js configuration for fuzzy Pokemon search
 */
const fuseOptions: IFuseOptions<Pokemon> = {
	keys: ['name'],
	threshold: 0.3, // Lower = more strict matching
	includeScore: true,
	minMatchCharLength: 2
}

let fuseInstance: Fuse<Pokemon> | null = null

/**
 * Initializes or returns cached Fuse instance
 * @param pokemons - List of Pokemon to search
 */
function getFuseInstance(pokemons: Pokemon[]): Fuse<Pokemon> {
	if (!fuseInstance) {
		fuseInstance = new Fuse(pokemons, fuseOptions)
	}
	return fuseInstance
}

/**
 * Performs fuzzy search on Pokemon names
 * @param query - Search query
 * @param pokemons - List of Pokemon to search
 * @param limit - Maximum number of results
 * @returns Array of matching Pokemon
 */
export function searchPokemon(
	query: string,
	pokemons: Pokemon[],
	limit: number = 10
): SearchResult[] {
	if (!query || query.trim().length < 2) {
		return []
	}

	const fuse = getFuseInstance(pokemons)
	const results = fuse.search(query.trim(), { limit })

	return results.map((result) => ({
		item: result.item,
		score: result.score
	}))
}
