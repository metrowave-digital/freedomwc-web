// src/app/portal/nav/filterNav.ts
import type { NavItem } from "./nav.config"
import type { WebUser } from "../../../access/roles"
import { hasRoleAtLeast } from "../../../access/roles"

/**
 * Recursively filter nav items based on role
 */
export function filterNavByRole(
  items: NavItem[],
  user: WebUser,
): NavItem[] {
  return items
    .filter((item) => {
      if (!item.minRole) return true
      return hasRoleAtLeast(user, item.minRole)
    })
    .map((item) => ({
      ...item,
      children: item.children
        ? filterNavByRole(item.children, user)
        : undefined,
    }))
    .filter(
      (item) =>
        item.href ||
        (item.children && item.children.length > 0),
    )
}
