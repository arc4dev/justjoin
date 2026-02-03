'use client'

import { useState } from 'react'
import { useForm, Controller, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Paper, Alert, Typography } from '@mui/material'
import { TextField } from '@/components/ui/TextField/TextField'
import { Button } from '@/components/ui/Button/Button'
import { trainerFormSchema, TrainerFormInput } from '../schemas/trainer.schema'
import { PokemonAutocomplete } from './PokemonAutocomplete'
import { PokemonPreview } from './PokemonPreview'
import { SuccessModal } from './SuccessModal'
import { registerTrainerAction } from '@/app/actions'

/**
 * Main trainer registration form component
 * Handles form validation, submission, and state management
 */
export function TrainerForm() {
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [serverError, setServerError] = useState<string | null>(null)
	const [successMessage, setSuccessMessage] = useState<string | null>(null)
	const [showSuccessModal, setShowSuccessModal] = useState(false)

	const {
		control,
		register,
		handleSubmit,
		formState: { errors },
		watch,
		reset
	} = useForm<TrainerFormInput>({
		resolver: zodResolver(trainerFormSchema),
		mode: 'onBlur',
		defaultValues: {
			name: '',
			age: '',
			pokemonName: ''
		}
	})

	const selectedPokemon = watch('pokemonName')

	const onSubmit: SubmitHandler<TrainerFormInput> = async (formData) => {
		setIsSubmitting(true)
		setServerError(null)

		try {
			const data = {
				...formData,
				age: Number(formData.age)
			}
			const result = await registerTrainerAction(data)

			if (result.success) {
				setSuccessMessage(result.message || 'Registration successful!')
				setShowSuccessModal(true)
			} else {
				if (result.errors) {
					// Handle field-specific errors
					setServerError('Please check the form for errors.')
				} else {
					setServerError(result.message || 'Registration failed. Please try again.')
				}
			}
		} catch (error) {
			console.error('Form submission error:', error)
			setServerError('An unexpected error occurred. Please try again.')
		} finally {
			setIsSubmitting(false)
		}
	}

	const handleReset = () => {
		reset()
		setServerError(null)
		setSuccessMessage(null)
	}

	return (
		<>
			<Paper sx={{ p: 4, mb: 4, bgcolor: 'background.paper', width: '100%', maxWidth: '720px' }}>
				<Box component='form' onSubmit={handleSubmit(onSubmit)} noValidate>
					{serverError && (
						<Alert severity='error' sx={{ mb: 3 }}>
							{serverError}
						</Alert>
					)}

					<Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
						{/* Two-column grid for Name and Age */}
						<Box
							sx={{
								display: 'grid',
								gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
								gap: 3
							}}
						>
							{/* Name Field */}
							<TextField
								{...register('name')}
								label="Trainer's name"
								placeholder="Trainer's name"
								error={!!errors.name}
								helperText={errors.name?.message}
								autoComplete='name'
								inputProps={{
									'aria-label': 'Trainer name',
									'aria-required': 'true'
								}}
							/>

							{/* Age Field */}
							<TextField
								{...register('age', { setValueAs: (v) => String(v) })}
								type='number'
								label="Trainer's age"
								placeholder="Trainer's age"
								error={!!errors.age}
								helperText={errors.age?.message}
							/>
						</Box>

						{/* Pokemon Autocomplete - Full Width */}
						<Controller
							name='pokemonName'
							control={control}
							render={({ field }) => (
								<PokemonAutocomplete
									value={field.value}
									onChange={field.onChange}
									onBlur={field.onBlur}
									error={!!errors.pokemonName}
									helperText={errors.pokemonName?.message}
								/>
							)}
						/>

						{/* Pokemon Preview Placeholder */}
						<Box
							sx={{
								width: '100%',
								height: '280px',
								border: '1px solid',
								borderColor: 'divider',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								bgcolor: 'var(--surface-subtle)',
								borderRadius: 0.5
							}}
						>
							{selectedPokemon ? (
								<Box sx={{ width: '100%', height: '100%' }}>
									<PokemonPreview pokemonName={selectedPokemon} />
								</Box>
							) : (
								<Typography
									variant='caption'
									sx={{
										color: 'grey.300'
									}}
								>
									Your pokemon
								</Typography>
							)}
						</Box>

						{/* Action Buttons */}
						<Box
							sx={{
								display: 'flex',
								gap: 2,
								justifyContent: 'flex-end',
								mt: 2
							}}
						>
							<Button
								type='button'
								variant='contained'
								color='secondary'
								onClick={handleReset}
								disabled={isSubmitting}
								aria-label='Reset form'
							>
								Reset
							</Button>
							<Button
								type='submit'
								variant='contained'
								color='primary'
								disabled={isSubmitting}
								aria-label='Submit trainer registration'
							>
								{isSubmitting ? 'Registering...' : 'Submit'}
							</Button>
						</Box>
					</Box>
				</Box>
			</Paper>

			{/* Success Modal */}
			<SuccessModal
				open={showSuccessModal}
				onClose={() => setShowSuccessModal(false)}
				onReset={handleReset}
				message={successMessage || undefined}
			/>
		</>
	)
}
