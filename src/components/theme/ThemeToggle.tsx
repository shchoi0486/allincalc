'use client'

import * as React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

import { Button } from '@/components/ui/button'
import { useI18n } from '@/i18n/I18nProvider'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const { dict } = useI18n()

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  const label = dict?.common?.theme ?? 'Toggle theme'

  return (
    <Button
      variant="outline"
      size="icon"
      aria-label={label}
      onClick={toggleTheme}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">{label}</span>
    </Button>
  )
}
