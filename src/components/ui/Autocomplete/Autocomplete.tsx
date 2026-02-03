import MuiAutocomplete, {
	AutocompleteProps as MuiAutocompleteProps
} from '@mui/material/Autocomplete'
import { TextField } from '../TextField/TextField'

export type AutocompleteProps<T> = Omit<
	MuiAutocompleteProps<T, false, boolean | undefined, false>,
	'renderInput'
> & {
	label?: string
	error?: boolean
	helperText?: string
	placeholder?: string
}

export function Autocomplete<T>({
	label,
	error,
	helperText,
	placeholder,
	...props
}: AutocompleteProps<T>) {
	return (
		<MuiAutocomplete
			{...props}
			renderInput={(params) => (
				<TextField
					{...params}
					label={label}
					error={error}
					helperText={helperText}
					placeholder={placeholder}
				/>
			)}
		/>
	)
}
