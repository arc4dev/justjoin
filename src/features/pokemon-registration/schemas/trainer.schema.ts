import { z } from 'zod'

const ageSchema = z.coerce
	.number()
	.int('Age must be a whole number')
	.min(16, 'Trainer must be at least 16')
	.max(99, 'Age must be below 100')

/**
 * Single source of truth for trainer validation
 * Used for both client-side forms and server-side validation
 */
export const trainerSchema = z.object({
	name: z
		.string()
		.min(2, 'Name must be at least 2 characters')
		.max(20, 'Name must be at most 20 characters')
		.trim(),
	age: ageSchema,
	pokemonName: z.string().min(1, 'Please select a Pokemon')
})

// Type for form input (age as string from input field)
export type TrainerFormInput = z.input<typeof trainerSchema>
// Type for validated output (age as number)
export type TrainerFormData = z.output<typeof trainerSchema>
