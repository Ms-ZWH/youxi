import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const currentTheme = ref(null)
  const isTransitioning = ref(false)

  function applyTheme(theme) {
    if (!theme) {
      clearTheme()
      return
    }
    isTransitioning.value = true
    const root = document.documentElement
    root.style.setProperty('--color-primary', theme.primary)
    root.style.setProperty('--color-secondary', theme.secondary)
    root.style.setProperty('--color-accent', theme.accent)
    root.style.setProperty('--color-bg', theme.bg)
    root.style.setProperty('--color-card-bg', theme.cardBg)
    root.style.setProperty('--color-text', theme.textColor)
    root.style.setProperty('--theme-gradient', theme.gradient)

    currentTheme.value = theme
    setTimeout(() => { isTransitioning.value = false }, 400)
  }

  function clearTheme() {
    const root = document.documentElement
    root.style.setProperty('--color-primary', '#c084fc')
    root.style.setProperty('--color-secondary', '#f472b6')
    root.style.setProperty('--color-accent', '#818cf8')
    root.style.setProperty('--color-bg', '#0a0a0f')
    root.style.setProperty('--color-card-bg', 'rgba(255,255,255,0.05)')
    root.style.setProperty('--color-text', '#e2e8f0')
    root.style.setProperty('--theme-gradient', 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0a0a0f 100%)')
    currentTheme.value = null
    isTransitioning.value = false
  }

  return { currentTheme, isTransitioning, applyTheme, clearTheme }
})
