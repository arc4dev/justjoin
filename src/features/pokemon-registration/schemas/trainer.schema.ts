import { z } from 'zod'

/**
 * Form input schema - accepts age as string from input field
 */
export const trainerFormSchema = z.object({
	name: z
		.string()
		.min(2, 'Name must be at least 2 characters')
		.max(20, 'Name must be at most 20 characters')
		.trim(),
	age: z
		.string()
		.min(1, 'Age is required')
		.refine((val) => !isNaN(Number(val)), 'Age must be a number')
		.refine((val) => Number.isInteger(Number(val)), 'Age must be a whole number')
		.refine((val) => Number(val) >= 16, 'Trainer must be at least 16')
		.refine((val) => Number(val) <= 99, 'Age must be below 100'),
	pokemonName: z.string().min(1, 'Please select a Pokemon')
})

/**
 * Server validation schema - expects age as number
 */
export const trainerSchema = z.object({
	name: z
		.string()
		.min(2, 'Name must be at least 2 characters')
		.max(20, 'Name must be at most 20 characters')
		.trim(),
	age: z
		.number()
		.int('Age must be a whole number')
		.min(16, 'Trainer must be at least 16')
		.max(99, 'Age must be below 100'),
	pokemonName: z.string().min(1, 'Please select a Pokemon')
})

export type TrainerFormInput = z.infer<typeof trainerFormSchema>
export type TrainerFormData = z.infer<typeof trainerSchema>
