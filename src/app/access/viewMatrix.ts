// src/app/access/viewMatrix.ts

import type { FWCRole } from "./roles"
import type { ViewRole } from "./viewRoles"

/**
 * Which VIEW MODES a user may SELECT,
 * based on their ASSIGNED ROLES.
 */
export const VIEW_MATRIX: Record<FWCRole, ViewRole[]> = {
  admin: [
    "admin",
    "pastor",
    "leader",
    "mentor",
    "member",
    "student",
    "viewer",
  ],

  pastor: [
    "pastor",
    "leader",
    "member",
    "student",
    "viewer",
  ],

  leader: [
    "leader",
    "member",
    "student",
    "viewer",
  ],

  instructor: [
    "mentor",
    "student",
    "viewer",
  ],

  mentor: [
    "mentor",
    "student",
    "viewer",
  ],

  staff: [
    "member",
    "viewer",
  ],

  volunteer: [
    "member",
    "viewer",
  ],

  member: [
    "member",
    "viewer",
  ],

  student: [
    "student",
    "viewer",
  ],

  viewer: ["viewer"],
}
