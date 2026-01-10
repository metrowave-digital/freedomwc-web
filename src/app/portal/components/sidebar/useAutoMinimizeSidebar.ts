"use client"

import { useEffect } from "react"
import { useSidebar } from "./useSidebarState"

export function useAutoMinimizeSidebar() {
  const { setMinimized } = useSidebar()

  useEffect(() => {
    const media = window.matchMedia(
      "(max-width: 1024px)",
    )

    const sync = () =>
      setMinimized(media.matches)

    sync()
    media.addEventListener("change", sync)

    return () =>
      media.removeEventListener("change", sync)
  }, [setMinimized])
}
