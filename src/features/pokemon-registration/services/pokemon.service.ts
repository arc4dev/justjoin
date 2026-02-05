import { PokemonDetail, PokemonPreview } from '../types/pokemon.types'

/**
 * Fetches detailed Pokemon information from PokeAPI
 * @param nameOrId - Pokemon name or ID
 * @returns Pokemon detail data
 */
export async function fetchPokemonDetail(nameOrId: string | number): Promise<PokemonDetail> {
	const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${nameOrId}`, {
		next: {
			revalidate: 86400, // Once every 24 hours
			tags: ['pokemon-detail'] // Invalidate all cached details when a new Pokemon is added (not really needed but good practice)
		}
	})

	if (!response.ok) {
		throw new Error(`Failed to fetch Pokemon: ${response.statusText}`)
	}

	return response.json()
}

/**
 * Maps PokeAPI response to simplified preview format
 * @param detail - Full Pokemon detail from API
 * @returns Simplified preview data
 */
export function mapToPokemonPreview(detail: PokemonDetail): PokemonPreview {
	return {
		id: detail.id,
		name: detail.name,
		sprite:
			detail.sprites.other?.['official-artwork']?.front_default || detail.sprites.front_default,
		types: detail.types.map((t) => t.type.name),
		height: detail.height,
		weight: detail.weight,
		baseExperience: detail.base_experience || 0
	}
}

/**
 * Fetches and transforms Pokemon data for preview
 * @param name - Pokemon name
 * @returns Pokemon preview data
 */
export async function getPokemonPreview(name: string): Promise<PokemonPreview> {
	const detail = await fetchPokemonDetail(name.toLowerCase())
	return mapToPokemonPreview(detail)
}
