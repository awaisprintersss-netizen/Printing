"use client"

import { useSyncExternalStore } from "react"

type Theme = "light" | "dark"
const mediaQuery = "(prefers-color-scheme: dark)"
const listeners = new Set<() => void>()
let sessionTheme: Theme | undefined
let systemQuery: MediaQueryList | undefined

function systemTheme() {
  return systemQuery ??= window.matchMedia(mediaQuery)
}

function readTheme(): Theme {
  if (sessionTheme) return sessionTheme
  try {
    const saved = localStorage.getItem("theme")
    if (saved === "light" || saved === "dark") return saved
  } catch {
    // Storage can be unavailable; the theme still works for this session.
  }
  return systemTheme().matches ? "dark" : "light"
}

function syncTheme() {
  const theme = readTheme()
  const root = document.documentElement
  root.dataset.theme = theme
  root.classList.toggle("dark", theme === "dark")
  listeners.forEach(listener => listener())
}

function handleStorage(event: StorageEvent) {
  if (event.key !== "theme" && event.key !== null) return
  sessionTheme = undefined
  syncTheme()
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  const media = systemTheme()
  if (listeners.size === 1) {
    window.addEventListener("storage", handleStorage)
    media.addEventListener("change", syncTheme)
  }
  return () => {
    listeners.delete(listener)
    if (listeners.size === 0) {
      window.removeEventListener("storage", handleStorage)
      media.removeEventListener("change", syncTheme)
    }
  }
}

function serverTheme(): Theme {
  return "light"
}

function toggleTheme() {
  const theme = readTheme() === "dark" ? "light" : "dark"
  try {
    localStorage.setItem("theme", theme)
    sessionTheme = undefined
  } catch {
    sessionTheme = theme
  }
  syncTheme()
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, readTheme, serverTheme)
  return { theme, toggleTheme }
}
