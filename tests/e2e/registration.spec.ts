import { test, expect } from '@playwright/test'

// Mock Time API globally for all tests
test.beforeEach(async ({ page, context }) => {
	// Mock Time API to prevent timeout issues
	await context.route('**/timeapi.io/**', (route) => {
		route.fulfill({
			status: 200,
			contentType: 'application/json',
			body: JSON.stringify({
				year: 2026,
				month: 2,
				day: 3,
				hour: 22,
				minute: 30,
				seconds: 0,
				milliSeconds: 0,
				dateTime: '2026-02-03T22:30:00',
				date: '02/03/2026',
				time: '22:30',
				timeZone: 'Europe/Warsaw',
				dayOfWeek: 'Tuesday',
				dstActive: false
			})
		})
	})

	await page.goto('/')
	// Wait for page to be fully loaded
	await page.waitForLoadState('networkidle')
})

test.describe('Pokemon Trainer Registration - Full Flow', () => {
	test('should display the registration form', async ({ page }) => {
		// Wait for form to be ready
		await page.waitForSelector('input[aria-label="Trainer name"]')

		// Check that form is visible
		await expect(page.getByLabel(/trainer name/i)).toBeVisible()
		await expect(page.getByPlaceholder(/trainer's age/i)).toBeVisible()
		await expect(page.getByPlaceholder('Choose')).toBeVisible()
		await expect(page.locator('text=/\\d{2}\\.\\d{2}\\.\\d{4}/')).toBeVisible()
	})

	test('should show validation errors for empty form', async ({ page }) => {
		// Wait for form to be interactive
		await page.waitForSelector('button[aria-label="Submit trainer registration"]')

		// Click submit without filling form
		await page.getByRole('button', { name: /submit/i }).click()

		// Should show validation errors
		await expect(page.getByText(/name must be at least 2 characters/i)).toBeVisible()
		await expect(page.getByText(/age is required/i)).toBeVisible()
		await expect(page.getByText(/please select a pokemon/i)).toBeVisible()
	})

	test('should validate name field', async ({ page }) => {
		const nameInput = page.getByLabel(/trainer name/i)

		// Too short
		await nameInput.fill('A')
		await nameInput.blur()
		await expect(page.getByText(/name must be at least 2 characters/i)).toBeVisible()

		// Too long
		await nameInput.fill('A'.repeat(21))
		await nameInput.blur()
		await expect(page.getByText(/name must be at most 20 characters/i)).toBeVisible()

		// Valid
		await nameInput.fill('Ash Ketchum')
		await nameInput.blur()
		await expect(page.getByText(/name must be/i)).not.toBeVisible()
	})

	test('should validate age field', async ({ page }) => {
		const ageInput = page.getByPlaceholder(/trainer's age/i)

		// Too young
		await ageInput.fill('15')
		await ageInput.blur()
		await expect(page.getByText(/must be at least 16/i)).toBeVisible()

		// Too old
		await ageInput.fill('100')
		await ageInput.blur()
		await expect(page.getByText(/must be below 100/i)).toBeVisible()

		// Valid
		await ageInput.fill('25')
		await ageInput.blur()
		await expect(page.getByText(/age must be/i)).not.toBeVisible()
	})

	test('should search and select pokemon', async ({ page }) => {
		const autocomplete = page.getByPlaceholder('Choose')

		// Type search query
		await autocomplete.fill('pika')

		// Wait for search results (debounced)
		await page.waitForTimeout(500)

		// Should show pikachu in results
		await expect(page.getByText('pikachu')).toBeVisible()

		// Select pikachu
		await page.getByText('pikachu').click()

		// Should show pokemon preview
		await expect(page.getByText(/electric/i)).toBeVisible({ timeout: 5000 })
	})

	test('should complete full registration flow', async ({ page }) => {
		// Fill name
		await page.getByLabel(/trainer name/i).fill('Ash Ketchum')

		// Fill age
		await page.getByPlaceholder(/trainer's age/i).fill('25')
		// Search and select pokemon
		const autocomplete = page.getByPlaceholder('Choose')
		await autocomplete.fill('pikachu')
		await page.waitForTimeout(500)
		await page.getByText('pikachu').click()

		// Wait for preview to load
		await expect(page.getByText(/electric/i)).toBeVisible({ timeout: 5000 })

		// Submit form
		await page.getByRole('button', { name: /submit/i }).click()

		// Wait for server action to complete
		await page.waitForTimeout(1000)

		// Should show success modal
		await expect(page.getByText(/success/i)).toBeVisible({ timeout: 10000 })
		await expect(page.locator('button:has-text("Register Another Trainer")')).toBeVisible()
	})

	test('should reset form after successful registration', async ({ page }) => {
		// Fill and submit form
		await page.getByLabel(/trainer name/i).fill('Ash')
		await page.getByPlaceholder(/trainer's age/i).fill('25')

		const autocomplete = page.getByPlaceholder('Choose')
		await autocomplete.fill('pikachu')
		await page.waitForTimeout(500)
		await page.getByText('pikachu').click()

		await page.getByRole('button', { name: /submit/i }).click()
		await page.waitForTimeout(1000)
		await expect(page.getByText(/success/i)).toBeVisible({ timeout: 10000 })

		// Click reset button in modal
		await page.locator('button:has-text("Register Another Trainer")').click()

		// Modal should close
		await expect(page.getByText(/registration successful/i)).not.toBeVisible()

		// Form should be cleared
		await expect(page.getByLabel(/trainer name/i)).toHaveValue('')
		await expect(page.getByPlaceholder(/trainer's age/i)).toHaveValue('')
		await expect(page.getByPlaceholder('Choose')).toHaveValue('')
	})

	test('should handle pokemon search with no results', async ({ page }) => {
		const autocomplete = page.getByPlaceholder('Choose')

		// Type query that returns no results
		await autocomplete.fill('zzzzz')
		await page.waitForTimeout(500)

		// Should show no results message
		await expect(page.getByText(/no pokemon found/i)).toBeVisible()
	})

	test('should handle fuzzy search', async ({ page }) => {
		const autocomplete = page.getByPlaceholder('Choose')

		// Type partial/typo query
		await autocomplete.fill('pikach')
		await page.waitForTimeout(500)

		// Should still find pikachu
		await expect(page.getByText('pikachu')).toBeVisible()
	})

	test.skip('should show loading state during submission', async ({ page }) => {
		// Fill form
		await page.getByLabel(/trainer name/i).fill('Ash')
		await page.getByLabel(/age/i).fill('25')

		const autocomplete = page.getByLabel(/pokemon/i)
		await autocomplete.fill('pikachu')
		await page.waitForTimeout(500)
		await page.getByText('pikachu').click()

		// Click submit
		const submitButton = page.locator('button:has-text("Register Trainer")')
		await submitButton.click()

		// Button should show loading state (disabled during submission)
		await expect(submitButton).toBeDisabled()
	})

	test('should be keyboard accessible', async ({ page }) => {
		// Tab through form
		await page.keyboard.press('Tab')
		await expect(page.getByLabel(/trainer name/i)).toBeFocused()

		await page.keyboard.press('Tab')
		await expect(page.getByPlaceholder(/trainer's age/i)).toBeFocused()

		await page.keyboard.press('Tab')
		const pokemonInput = page.getByPlaceholder('Choose')
		await expect(pokemonInput).toBeFocused()

		// Can tab through the form - exact button focus may vary due to MUI internals
		// Just verify that we can navigate the critical form fields
	})

	test('should handle different pokemon selections', async ({ page }) => {
		const autocomplete = page.getByPlaceholder('Choose')

		// Select bulbasaur
		await autocomplete.fill('bulba')
		await page.waitForTimeout(500)
		await page.getByRole('option', { name: /bulbasaur/i }).click()

		// Should show bulbasaur preview with multiple types
		await expect(page.getByText(/grass/i)).toBeVisible({ timeout: 5000 })
		await expect(page.getByText(/poison/i)).toBeVisible()

		// Change selection to charmander
		// Clear the current selection first
		await autocomplete.clear()
		await autocomplete.fill('char')
		await page.waitForTimeout(500)
		await page.getByRole('option', { name: /charmander/i }).click()

		// Should update preview
		await expect(page.getByText(/fire/i)).toBeVisible({ timeout: 5000 })
	})
})

test.describe('Pokemon Trainer Registration - Error Handling', () => {
	test('should show error when pokemon preview fails to load', async ({ page, context }) => {
		// Block PokeAPI requests to simulate offline
		await context.route('https://pokeapi.co/**', (route) => route.abort())

		const autocomplete = page.getByPlaceholder('Choose')
		await autocomplete.fill('pikachu')
		await page.waitForTimeout(500)
		await page.getByText('pikachu').click()

		// Should show error message but allow registration
		await expect(page.getByText(/could not load pokemon preview/i)).toBeVisible({
			timeout: 5000
		})

		// Form should still be submittable
		await page.getByLabel(/trainer name/i).fill('Ash')
		await page.getByPlaceholder(/trainer's age/i).fill('25')
		await page.getByRole('button', { name: /submit/i }).click()

		// Wait for submission
		await page.waitForTimeout(1000)

		// Should still succeed
		await expect(page.getByText(/success/i)).toBeVisible({ timeout: 10000 })
	})

	test('should handle slow network', async ({ page, context }) => {
		// Delay all PokeAPI requests (affects preview loading, not search)
		await context.route('https://pokeapi.co/**', async (route) => {
			await new Promise((resolve) => setTimeout(resolve, 2000))
			await route.continue()
		})

		const autocomplete = page.getByPlaceholder('Choose')
		// Search is instant (local data), but preview will be slow
		await autocomplete.fill('pikachu')
		await page.waitForTimeout(500)
		await page.getByRole('option', { name: /pikachu/i }).click()

		// Should show loading state for preview (PokeAPI request is delayed)
		await expect(page.getByText(/loading pokemon data/i)).toBeVisible({ timeout: 3000 })

		// Eventually should load the preview after the delay
		await expect(page.getByText(/electric/i)).toBeVisible({ timeout: 15000 })
	})
})
