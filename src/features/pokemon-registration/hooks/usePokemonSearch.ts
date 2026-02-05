import { useQuery } from '@tanstack/react-query'
import { useDebounce } from 'use-debounce'
import { SearchResult } from '../types/pokemon.types'

interface SearchResponse {
	results: SearchResult[]
}

/**
 * Fetches Pokemon search results from the API
 */
async function fetchPokemonSearch(query: string, signal?: AbortSignal): Promise<SearchResult[]> {
	if (!query || query.trim().length < 2) {
		return []
	}

	// Add 500ms fake delay to see the spinner
	await new Promise((resolve) => setTimeout(resolve, 500))

	const response = await fetch(`/api/search?name=${encodeURIComponent(query)}`, { signal })

	if (!response.ok) {
		if (response.status === 429) {
			throw new Error('Too many requests. Please slow down.')
		}
		throw new Error('Failed to search Pokemon')
	}

	const data: SearchResponse = await response.json()
	return data.results
}

/**
 * Hook for searching Pokemon with debouncing and caching
 *
 * @param query - Search query
 * @param debounceMs - Debounce delay in milliseconds
 * @returns Query result with Pokemon list, loading state, and error
 */
export function usePokemonSearch(query: string, debounceMs: number = 300) {
	const [debouncedQuery] = useDebounce(query, debounceMs)

	const { data, isLoading, error, isFetching } = useQuery({
		queryKey: ['pokemon-search', debouncedQuery],
		queryFn: ({ signal }) => fetchPokemonSearch(debouncedQuery, signal),
		enabled: debouncedQuery.trim().length >= 2,
		staleTime: 5 * 60 * 1000 // 5 minutes
	})

	return {
		pokemons: data?.map((r) => r.item) || [],
		isLoading: isLoading || isFetching,
		error: error as Error | null
	}
}
