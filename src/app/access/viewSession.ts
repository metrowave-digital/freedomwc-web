import type { ViewRole } from "./viewRoles"

const VIEW_KEY = "fwc:view"

/**
 * Returns null if no override is active
 */
export function getActiveView(): ViewRole | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(VIEW_KEY) as ViewRole | null
}

export function setActiveView(view: ViewRole) {
  localStorage.setItem(VIEW_KEY, view)
}

export function clearActiveView() {
  localStorage.removeItem(VIEW_KEY)
}
