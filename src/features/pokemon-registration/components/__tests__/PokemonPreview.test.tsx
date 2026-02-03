import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PokemonPreview } from '../PokemonPreview'
import * as pokemonService from '../../services/pokemon.service'

// Mock the pokemon service module
vi.mock('../../services/pokemon.service')

describe('PokemonPreview', () => {
	let queryClient: QueryClient
	const mockGetPokemonPreview = vi.mocked(pokemonService.getPokemonPreview)

	beforeEach(() => {
		queryClient = new QueryClient({
			defaultOptions: {
				queries: {
					retry: false,
					retryDelay: 0
				}
			}
		})
		vi.clearAllMocks()
	})

	const renderWithProvider = (component: React.ReactElement) => {
		return render(<QueryClientProvider client={queryClient}>{component}</QueryClientProvider>)
	}

	describe('initial state', () => {
		it('should not render when pokemonName is empty', () => {
			const { container } = renderWithProvider(<PokemonPreview pokemonName='' />)
			expect(container.firstChild).toBeNull()
		})

		it('should show loading state when fetching', () => {
			mockGetPokemonPreview.mockImplementation(
				() => new Promise((resolve) => setTimeout(resolve, 1000))
			)

			renderWithProvider(<PokemonPreview pokemonName='pikachu' />)
			expect(screen.getByText(/loading pokemon data/i)).toBeInTheDocument()
		})
	})

	describe('error handling', () => {
		it('should show error message when fetch fails', async () => {
			mockGetPokemonPreview.mockRejectedValueOnce(new Error('Network error'))

			renderWithProvider(<PokemonPreview pokemonName='pikachu' />)

			await waitFor(
				() => {
					expect(screen.getByText(/could not load pokemon preview/i)).toBeInTheDocument()
				},
				{ timeout: 2000 }
			)
		})

		it('should show error when data is null', async () => {
			mockGetPokemonPreview.mockResolvedValue(null!)

			renderWithProvider(<PokemonPreview pokemonName='pikachu' />)

			await waitFor(() => {
				expect(screen.getByText(/could not load pokemon preview/i)).toBeInTheDocument()
			})
		})
	})

	describe('successful data display', () => {
		const mockPokemonData = {
			id: 25,
			name: 'pikachu',
			sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
			types: ['electric'],
			height: 4,
			weight: 60,
			baseExperience: 112
		}

		it('should display pokemon name', async () => {
			mockGetPokemonPreview.mockResolvedValue(mockPokemonData)

			renderWithProvider(<PokemonPreview pokemonName='pikachu' />)

			await waitFor(() => {
				expect(screen.getByText('pikachu')).toBeInTheDocument()
			})
		})

		it('should display pokemon sprite', async () => {
			mockGetPokemonPreview.mockResolvedValue(mockPokemonData)

			renderWithProvider(<PokemonPreview pokemonName='pikachu' />)

			await waitFor(() => {
				const img = screen.getByRole('img', { name: /pikachu/i })
				expect(img).toHaveAttribute('src', mockPokemonData.sprite)
			})
		})

		it('should display pokemon types', async () => {
			mockGetPokemonPreview.mockResolvedValue(mockPokemonData)

			renderWithProvider(<PokemonPreview pokemonName='pikachu' />)

			await waitFor(() => {
				expect(screen.getByText('electric')).toBeInTheDocument()
			})
		})

		it('should display multiple types', async () => {
			mockGetPokemonPreview.mockResolvedValue({
				...mockPokemonData,
				id: 1,
				name: 'bulbasaur',
				types: ['grass', 'poison'],
				height: 7,
				weight: 69
			})

			renderWithProvider(<PokemonPreview pokemonName='bulbasaur' />)

			await waitFor(() => {
				expect(screen.getByText('grass')).toBeInTheDocument()
				expect(screen.getByText('poison')).toBeInTheDocument()
			})
		})

		it('should display base experience and id', async () => {
			mockGetPokemonPreview.mockResolvedValue(mockPokemonData)

			renderWithProvider(<PokemonPreview pokemonName='pikachu' />)

			await waitFor(() => {
				expect(screen.getByText(/base experience/i)).toBeInTheDocument()
				expect(screen.getByText('112')).toBeInTheDocument()
				expect(screen.getByText(/id/i)).toBeInTheDocument()
				expect(screen.getByText('25')).toBeInTheDocument()
			})
		})
	})

	describe('retry behavior', () => {
		it('should retry failed requests', async () => {
			// First two calls fail, third succeeds
			mockGetPokemonPreview
				.mockRejectedValueOnce(new Error('First fail'))
				.mockRejectedValueOnce(new Error('Second fail'))
				.mockResolvedValueOnce({
					id: 25,
					name: 'pikachu',
					sprite: 'sprite.png',
					types: ['electric'],
					height: 4,
					weight: 60,
					baseExperience: 112
				})

			// Create a new query client with retry enabled for this test
			const retryQueryClient = new QueryClient({
				defaultOptions: {
					queries: { retry: 2, retryDelay: 10 }
				}
			})

			render(
				<QueryClientProvider client={retryQueryClient}>
					<PokemonPreview pokemonName='pikachu' />
				</QueryClientProvider>
			)

			// Should eventually succeed after retries
			await waitFor(
				() => {
					expect(screen.getByText('pikachu')).toBeInTheDocument()
				},
				{ timeout: 5000 }
			)

			// Verify it tried multiple times
			expect(mockGetPokemonPreview).toHaveBeenCalledTimes(3)
		})
	})
})
