'use server'

import {
	trainerSchema,
	TrainerFormData
} from '@/features/pokemon-registration/schemas/trainer.schema'
import { RegistrationResult } from '@/features/pokemon-registration/types/trainer.types'

/**
 * Server Action for registering a new Pokemon trainer
 * Validates form data and simulates registration
 *
 * @param formData - Form data from the client
 * @returns Registration result with success status and errors
 */
export async function registerTrainerAction(data: TrainerFormData): Promise<RegistrationResult> {
	try {
		const validationResult = trainerSchema.safeParse(data)

		if (!validationResult.success) {
			const errors: RegistrationResult['errors'] = {}

			validationResult.error.issues.forEach((issue) => {
				const field = issue.path[0] as keyof typeof errors
				if (!errors[field]) {
					errors[field] = []
				}
				errors[field]?.push(issue.message)
			})

			return {
				success: false,
				errors
			}
		}

		// Simulate async operation (e.g., database save)
		await new Promise((resolve) => setTimeout(resolve, 500))

		// In a real application, we would perform actions like:
		// 1. Save to database
		// 2. Send confirmation email
		// 3. Generate unique trainer ID
		// 4. Log the registration

		console.log('Trainer registered successfully:', {
			name: validationResult.data.name,
			age: validationResult.data.age,
			pokemonName: validationResult.data.pokemonName,
			timestamp: new Date().toISOString()
		})

		return {
			success: true,
			message: `Welcome, Trainer ${validationResult.data.name}! You and ${validationResult.data.pokemonName} are now registered.`
		}
	} catch (error) {
		console.error('Registration error:', error)
		return {
			success: false,
			message: 'An unexpected error occurred. Please try again.'
		}
	}
}
