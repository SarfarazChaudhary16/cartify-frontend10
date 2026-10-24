import { AnimatePresence, motion } from 'framer-motion'
import { Moon, Sun } from 'lucide-react'
import { IconButton } from '@/components/ui/IconButton'
import { Tooltip } from '@/components/ui/Tooltip'
import { useThemeStore } from '@/store/useThemeStore'

/** Light/dark toggle with a cross-fade + rotate icon swap. */
export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore()

  return (
    <Tooltip content={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
      <IconButton
        icon={
          <span className="relative inline-flex h-5 w-5 items-center justify-center">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={theme}
                initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 flex items-center justify-center"
              >
                {theme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              </motion.span>
            </AnimatePresence>
          </span>
        }
        aria-label="Toggle dark mode"
        onClick={toggleTheme}
      />
    </Tooltip>
  )
}