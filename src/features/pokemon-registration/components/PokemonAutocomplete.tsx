'use client'

import { CircularProgress, Box, Typography } from '@mui/material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { motion, AnimatePresence } from 'framer-motion'
import { Autocomplete } from '@/components/ui/Autocomplete/Autocomplete'
import { Pokemon } from '../types/pokemon.types'
import { usePokemonSearch } from '../hooks/usePokemonSearch'
import { useState } from 'react'

interface PokemonAutocompleteProps {
	value: string
	onChange: (value: string) => void
	onBlur: () => void
	error?: boolean
	helperText?: string
}

/**
 * Pokemon autocomplete with fuzzy search
 * Provides real-time search with debouncing and proper state synchronization
 */
export function PokemonAutocomplete({
	value,
	onChange,
	onBlur,
	error,
	helperText
}: PokemonAutocompleteProps) {
	// Local input state for typing - independent from form value
	const [localInput, setLocalInput] = useState('')
	const { pokemons, isLoading, error: searchError } = usePokemonSearch(localInput)

	const handleBlur = () => {
		setLocalInput('')
		onBlur()
	}

	// Derive display value: show localInput if user is typing, otherwise show form value
	const displayValue = localInput || value

	const handleChange = (_: React.SyntheticEvent, newValue: Pokemon | string | null) => {
		if (newValue && typeof newValue !== 'string') {
			onChange(newValue.name)
			setLocalInput('') // Clear local state after selection
		} else {
			onChange('')
			setLocalInput('')
		}
	}

	const handleInputChange = (_: React.SyntheticEvent, newInputValue: string, reason: string) => {
		if (reason === 'input') {
			setLocalInput(newInputValue)
			// Don't clear form value - let preview stay until new selection
		} else if (reason === 'clear') {
			setLocalInput('')
			onChange('')
		}
		// Ignore 'reset' to let form control the value
	}

	// Find selected Pokemon object from search results
	const selectedValue = value ? pokemons.find((p) => p.name === value) || null : null

	return (
		<Autocomplete<Pokemon>
			options={pokemons}
			getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
			value={selectedValue}
			onChange={handleChange}
			inputValue={displayValue}
			onInputChange={handleInputChange}
			onBlur={handleBlur}
			loading={isLoading}
			clearIcon={null}
			label='Pokemon name'
			placeholder='Choose'
			error={error}
			helperText={searchError ? 'Search temporarily unavailable' : helperText}
			isOptionEqualToValue={(option, value) => option.name === value.name}
			popupIcon={
				<AnimatePresence mode='wait'>
					{isLoading ? (
						<Box
							component={motion.div}
							key='loading'
							initial={{ opacity: 0, scale: 0.9, filter: 'blur(2px)' }}
							animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
							exit={{ opacity: 0, scale: 0.9, filter: 'blur(2px)' }}
							transition={{ duration: 0.15, ease: 'easeOut' }}
						>
							<CircularProgress
								size={20}
								sx={{
									color: 'grey.100'
								}}
							/>
						</Box>
					) : (
						<Box
							component={motion.div}
							key='chevron'
							initial={{ opacity: 0, scale: 0.9, filter: 'blur(2px)' }}
							animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
							exit={{ opacity: 0, scale: 0.9, filter: 'blur(2px)' }}
							transition={{ duration: 0.15, ease: 'easeOut' }}
						>
							<KeyboardArrowDownIcon
								sx={{
									color: 'text.primary',
									transition: 'transform 0.2s ease'
								}}
							/>
						</Box>
					)}
				</AnimatePresence>
			}
			noOptionsText={
				displayValue.length < 2
					? 'Type at least 2 characters'
					: searchError
						? 'Search error - please try again'
						: 'No Pokemon found'
			}
			loadingText={
				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						gap: 1.5,
						py: 1,
						px: 2,
						fontSize: 'body1.fontSize',
						fontFamily: 'fontFamily'
					}}
				>
					<CircularProgress size={16} sx={{ color: 'grey.100' }} />
					<Typography variant='body1' sx={{ color: 'grey.100' }}>
						Loading options...
					</Typography>
				</Box>
			}
			filterOptions={(x) => x} // Server-side filtering via API
		/>
	)
}
