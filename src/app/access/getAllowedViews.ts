// src/app/access/getAllowedViews.ts

import type { WebUser, FWCRole } from "./roles"
import type { ViewRole } from "./viewRoles"
import { VIEW_MATRIX } from "./viewMatrix"

export function getAllowedViews(
  user: WebUser,
): ViewRole[] {
  const views = new Set<ViewRole>()

  user.roles.forEach((role: FWCRole) => {
    VIEW_MATRIX[role]?.forEach((view) =>
      views.add(view),
    )
  })

  return Array.from(views)
}
