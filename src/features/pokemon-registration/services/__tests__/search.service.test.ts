import { describe, it, expect } from 'vitest'
import { searchPokemon } from '../search.service'
import mockData from '../../data/pokemons.json'

const mockPokemons = mockData.data

describe('searchPokemon', () => {
	describe('exact matches', () => {
		it('should find exact match for pikachu', () => {
			const results = searchPokemon('pikachu', mockPokemons)
			expect(results).toHaveLength(1)
			expect(results[0].item.name).toBe('pikachu')
		})

		it('should find exact match for bulbasaur', () => {
			const results = searchPokemon('bulbasaur', mockPokemons)
			expect(results).toHaveLength(1)
			expect(results[0].item.name).toBe('bulbasaur')
		})
	})

	describe('partial matches', () => {
		it('should find pokemons starting with "char"', () => {
			const results = searchPokemon('char', mockPokemons)
			expect(results.length).toBeGreaterThan(0)
			const names = results.map((r) => r.item.name)
			expect(names).toContain('charmander')
			// Note: Only charmander exists in mock data, not charmeleon/charizard
		})

		it('should find pokemons starting with "pika"', () => {
			const results = searchPokemon('pika', mockPokemons)
			expect(results.length).toBeGreaterThan(0)
			expect(results[0].item.name).toBe('pikachu')
		})
	})

	describe('fuzzy matching', () => {
		it('should handle typos in pokemon name', () => {
			const results = searchPokemon('pikach', mockPokemons)
			expect(results.length).toBeGreaterThan(0)
			expect(results[0].item.name).toBe('pikachu')
		})

		it('should handle partial typos', () => {
			const results = searchPokemon('bulba', mockPokemons)
			expect(results.length).toBeGreaterThan(0)
			expect(results[0].item.name).toBe('bulbasaur')
		})
	})

	describe('no results', () => {
		it('should return empty array for non-existent pokemon', () => {
			const results = searchPokemon('zzzzzzz', mockPokemons)
			expect(results).toHaveLength(0)
		})

		it('should return empty array for very short query', () => {
			const results = searchPokemon('z', mockPokemons)
			expect(results).toHaveLength(0)
		})
	})

	describe('query requirements', () => {
		it('should require minimum 2 characters', () => {
			const results = searchPokemon('p', mockPokemons)
			expect(results).toHaveLength(0)
		})

		it('should work with exactly 2 characters', () => {
			const results = searchPokemon('pi', mockPokemons)
			expect(results.length).toBeGreaterThan(0)
		})

		it('should handle empty query', () => {
			const results = searchPokemon('', mockPokemons)
			expect(results).toHaveLength(0)
		})

		it('should handle whitespace-only query', () => {
			const results = searchPokemon('   ', mockPokemons)
			expect(results).toHaveLength(0)
		})
	})

	describe('case insensitivity', () => {
		it('should find pokemon regardless of case', () => {
			const lowerResults = searchPokemon('pikachu', mockPokemons)
			const upperResults = searchPokemon('PIKACHU', mockPokemons)
			const mixedResults = searchPokemon('PiKaChU', mockPokemons)

			expect(lowerResults).toHaveLength(1)
			expect(upperResults).toHaveLength(1)
			expect(mixedResults).toHaveLength(1)
		})
	})

	describe('result structure', () => {
		it('should return results with correct structure', () => {
			const results = searchPokemon('pikachu', mockPokemons)
			expect(results[0]).toHaveProperty('item')
			expect(results[0].item).toHaveProperty('id')
			expect(results[0].item).toHaveProperty('name')
		})

		it('should include score in results', () => {
			const results = searchPokemon('pikachu', mockPokemons)
			expect(results[0]).toHaveProperty('score')
			expect(typeof results[0].score).toBe('number')
		})
	})
})
