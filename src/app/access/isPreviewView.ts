import type { WebUser, FWCRole } from "./roles"
import type { ViewRole } from "./viewRoles"
import { ROLE_RANKING } from "./roles"

/**
 * Preview mode ONLY when an override exists
 * AND the override is lower than highest role
 */
export function isPreviewView(
  user: WebUser,
  activeView: ViewRole | null,
): boolean {
  if (!activeView) return false

  const highestRole = user.roles.reduce((a, b) =>
    ROLE_RANKING[a] < ROLE_RANKING[b] ? a : b,
  )

  return (
    ROLE_RANKING[activeView as FWCRole] >
    ROLE_RANKING[highestRole]
  )
}
