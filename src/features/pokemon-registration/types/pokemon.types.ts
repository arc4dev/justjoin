export interface Pokemon {
	id: number
	name: string
}

export interface PokemonDetail {
	id: number
	name: string
	sprites: {
		front_default: string
		other?: {
			'official-artwork'?: {
				front_default: string
			}
		}
	}
	types: Array<{
		type: {
			name: string
		}
	}>
	height: number
	weight: number
	base_experience: number
}

// Search result from Fuse.js
export interface SearchResult {
	item: Pokemon
	score?: number
}

// Simplified Pokemon preview data
export interface PokemonPreview {
	id: number
	name: string
	sprite: string
	types: string[]
	height: number
	weight: number
	baseExperience: number
}
