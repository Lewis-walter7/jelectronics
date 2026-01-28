"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
    const { setTheme, theme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    // Avoid hydration mismatch
    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return null
    }

    return (
        <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.5rem',
                borderRadius: '0.375rem',
                transition: 'background-color 0.2s',
                color: 'inherit'
            }}
            className="hover:bg-zinc-100 dark:hover:bg-zinc-800" // These might not work without Tailwind, but we can rely on global button styles or add inline hover if needed. keeping it simple for now.
            aria-label="Toggle theme"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
            {theme === 'light' ? (
                <Sun size={20} />
            ) : (
                <Moon size={20} />
            )}
            <span className="sr-only">Toggle theme</span>
        </button>
    )
}
