import { TrainerFormData } from '../schemas/trainer.schema'

export interface Trainer extends TrainerFormData {
	id?: string
	createdAt?: Date
}

export interface RegistrationResult {
	success: boolean
	message?: string
	errors?: {
		name?: string[]
		age?: string[]
		pokemonName?: string[]
	}
}
