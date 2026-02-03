'use client'

import { useState } from 'react'
import { Box, Typography, Chip, CircularProgress } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { getPokemonPreview } from '../services/pokemon.service'

interface PokemonPreviewProps {
	pokemonName: string
}

/**
 * Pokemon preview component showing detailed information
 * Fetches and displays Pokemon sprite and stats
 */
export function PokemonPreview({ pokemonName }: PokemonPreviewProps) {
	const [isImageLoaded, setIsImageLoaded] = useState(false)

	const { data, isLoading, error } = useQuery({
		queryKey: ['pokemon-preview', pokemonName],
		queryFn: () => getPokemonPreview(pokemonName),
		enabled: !!pokemonName,
		staleTime: 10 * 60 * 1000, // 10 minutes
		retry: 2
	})

	if (!pokemonName) {
		return null
	}

	if (isLoading) {
		return (
			<Box
				sx={{
					width: '100%',
					height: '100%',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					flexDirection: 'column',
					gap: 2
				}}
			>
				<CircularProgress size={32} sx={{ color: 'grey.100' }} />
				<Typography variant='body2' sx={{ color: 'text.secondary' }}>
					Loading Pokemon data...
				</Typography>
			</Box>
		)
	}

	if (error || !data) {
		return (
			<Box
				sx={{
					width: '100%',
					height: '100%',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					p: 2
				}}
			>
				<Typography variant='body2' sx={{ color: 'error.main' }}>
					Could not load Pokemon preview
				</Typography>
			</Box>
		)
	}

	return (
		<Box
			sx={{
				width: '100%',
				height: '100%',
				display: 'grid',
				gridTemplateColumns: '1fr 1fr',
				p: 3,
				gap: 3
			}}
		>
			{/* Left Column - Sprite */}
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center'
				}}
			>
				<Box
					sx={{
						position: 'relative',
						width: '100%',
						maxWidth: 200,
						height: 200,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center'
					}}
				>
					<Box
						component={motion.div}
						initial={{ opacity: 0, scale: 0.97, filter: 'blur(4px)' }}
						animate={
							isImageLoaded
								? { opacity: 1, scale: 1, filter: 'blur(0px)' }
								: { opacity: 0, scale: 0.97, filter: 'blur(4px)' }
						}
						transition={{ duration: 0.3, ease: 'easeOut' }}
						sx={{
							position: 'relative',
							width: '100%',
							height: '100%'
						}}
					>
						<Image
							src={data.sprite}
							alt={data.name}
							fill
							style={{
								objectFit: 'contain',
								imageRendering: 'pixelated'
							}}
							unoptimized
							onLoad={() => setIsImageLoaded(true)}
						/>
					</Box>
				</Box>
			</Box>

			{/* Right Column - Details */}
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					gap: 2
				}}
			>
				{/* Pokemon Name */}
				<Box
					component={motion.div}
					initial={{ opacity: 0, x: -10 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.3, delay: 0.1, ease: 'easeOut' }}
				>
					<Typography variant='body1' component='span' sx={{ mr: 1 }}>
						Name:
					</Typography>
					<Typography variant='h1' component='span' sx={{ textTransform: 'capitalize' }}>
						{data.name}
					</Typography>
				</Box>

				{/* Types */}
				<Box
					component={motion.div}
					initial={{ opacity: 0, x: -10 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.3, delay: 0.15, ease: 'easeOut' }}
					sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}
				>
					<Typography variant='body1' component='span'>
						Type:
					</Typography>
					{data.types.map((type) => (
						<Chip
							key={type}
							label={type}
							sx={{
								borderRadius: '9999px',
								py: 1.5,
								'& .MuiChip-label': {
									color: 'grey.100'
								}
							}}
						/>
					))}
				</Box>

				{/* Base Experience */}
				<Box
					component={motion.div}
					initial={{ opacity: 0, x: -10 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.3, delay: 0.2, ease: 'easeOut' }}
				>
					<Typography variant='body1' component='span' sx={{ mr: 1 }}>
						Base experience:
					</Typography>
					<Typography
						variant='h2'
						component='span'
						sx={{
							fontSize: '1.25rem',
							color: 'text.primary'
						}}
					>
						{data.baseExperience}
					</Typography>
				</Box>

				{/* Id */}
				<Box
					component={motion.div}
					initial={{ opacity: 0, x: -10 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.3, delay: 0.25, ease: 'easeOut' }}
				>
					<Typography variant='body1' component='span' sx={{ mr: 1 }}>
						Id:
					</Typography>
					<Typography
						variant='h2'
						component='span'
						sx={{
							fontSize: '1.25rem',
							color: 'text.primary'
						}}
					>
						{data.id}
					</Typography>
				</Box>
			</Box>
		</Box>
	)
}
