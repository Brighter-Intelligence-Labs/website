import { writable } from 'svelte/store'
import { browser } from '$app/environment'

type Theme = 'light' | 'dark' | 'auto'

const STORAGE_KEY = 'bi-labs-theme'

function createTheme() {
	const saved = browser ? (localStorage.getItem(STORAGE_KEY) as Theme | null) : null
	const { subscribe, set } = writable<Theme>(saved ?? 'auto')

	return {
		subscribe,
		set: (value: Theme) => {
			set(value)
			if (browser) {
				localStorage.setItem(STORAGE_KEY, value)
				applyTheme(value)
			}
		},
		init: () => {
			const saved = browser ? (localStorage.getItem(STORAGE_KEY) as Theme | null) : null
			const initial = saved ?? 'auto'
			set(initial)
			if (browser) applyTheme(initial)
		}
	}
}

function applyTheme(theme: Theme) {
	const root = document.documentElement
	if (theme === 'dark') {
		root.setAttribute('data-theme', 'dark')
	} else if (theme === 'light') {
		root.setAttribute('data-theme', 'light')
	} else {
		root.removeAttribute('data-theme')
	}
}

export const theme = createTheme()
