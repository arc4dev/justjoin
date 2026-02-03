import { describe, it, expect } from 'vitest'
import { trainerFormSchema, trainerSchema } from '../trainer.schema'

describe('trainerFormSchema (Form Input Validation)', () => {
	describe('name field', () => {
		it('should accept valid name', () => {
			const result = trainerFormSchema.safeParse({
				name: 'Ash Ketchum',
				age: '25',
				pokemonName: 'pikachu'
			})
			expect(result.success).toBe(true)
		})

		it('should reject name shorter than 2 characters', () => {
			const result = trainerFormSchema.safeParse({
				name: 'A',
				age: '25',
				pokemonName: 'pikachu'
			})
			expect(result.success).toBe(false)
			if (!result.success) {
				expect(result.error.issues[0].message).toContain('at least 2 characters')
			}
		})

		it('should reject name longer than 20 characters', () => {
			const result = trainerFormSchema.safeParse({
				name: 'A'.repeat(21),
				age: '25',
				pokemonName: 'pikachu'
			})
			expect(result.success).toBe(false)
			if (!result.success) {
				expect(result.error.issues[0].message).toContain('at most 20 characters')
			}
		})

		it('should trim whitespace from name', () => {
			const result = trainerFormSchema.safeParse({
				name: '  Ash  ',
				age: '25',
				pokemonName: 'pikachu'
			})
			expect(result.success).toBe(true)
			if (result.success) {
				expect(result.data.name).toBe('Ash')
			}
		})
	})

	describe('age field', () => {
		it('should accept valid string age', () => {
			const result = trainerFormSchema.safeParse({
				name: 'Ash',
				age: '25',
				pokemonName: 'pikachu'
			})
			expect(result.success).toBe(true)
		})

		it('should reject age below 16', () => {
			const result = trainerFormSchema.safeParse({
				name: 'Ash',
				age: '15',
				pokemonName: 'pikachu'
			})
			expect(result.success).toBe(false)
			if (!result.success) {
				expect(result.error.issues[0].message).toContain('at least 16')
			}
		})

		it('should reject age above 99', () => {
			const result = trainerFormSchema.safeParse({
				name: 'Ash',
				age: '100',
				pokemonName: 'pikachu'
			})
			expect(result.success).toBe(false)
			if (!result.success) {
				expect(result.error.issues[0].message).toContain('below 100')
			}
		})

		it('should reject non-numeric age', () => {
			const result = trainerFormSchema.safeParse({
				name: 'Ash',
				age: 'abc',
				pokemonName: 'pikachu'
			})
			expect(result.success).toBe(false)
			if (!result.success) {
				expect(result.error.issues[0].message).toContain('must be a number')
			}
		})

		it('should reject decimal age', () => {
			const result = trainerFormSchema.safeParse({
				name: 'Ash',
				age: '25.5',
				pokemonName: 'pikachu'
			})
			expect(result.success).toBe(false)
			if (!result.success) {
				expect(result.error.issues[0].message).toContain('whole number')
			}
		})

		it('should reject empty age', () => {
			const result = trainerFormSchema.safeParse({
				name: 'Ash',
				age: '',
				pokemonName: 'pikachu'
			})
			expect(result.success).toBe(false)
		})
	})

	describe('pokemonName field', () => {
		it('should accept valid pokemon name', () => {
			const result = trainerFormSchema.safeParse({
				name: 'Ash',
				age: '25',
				pokemonName: 'pikachu'
			})
			expect(result.success).toBe(true)
		})

		it('should reject empty pokemon name', () => {
			const result = trainerFormSchema.safeParse({
				name: 'Ash',
				age: '25',
				pokemonName: ''
			})
			expect(result.success).toBe(false)
			if (!result.success) {
				expect(result.error.issues[0].message).toContain('select a Pokemon')
			}
		})
	})
})

describe('trainerSchema (Server Validation)', () => {
	it('should accept valid data with number age', () => {
		const result = trainerSchema.safeParse({
			name: 'Ash',
			age: 25,
			pokemonName: 'pikachu'
		})
		expect(result.success).toBe(true)
	})

	it('should reject string age', () => {
		const result = trainerSchema.safeParse({
			name: 'Ash',
			age: '25',
			pokemonName: 'pikachu'
		})
		expect(result.success).toBe(false)
	})

	it('should validate age is number type', () => {
		const result = trainerSchema.safeParse({
			name: 'Ash',
			age: 25,
			pokemonName: 'pikachu'
		})
		expect(result.success).toBe(true)
		if (result.success) {
			expect(typeof result.data.age).toBe('number')
		}
	})
})
