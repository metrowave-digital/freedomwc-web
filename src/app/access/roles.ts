// src/app/access/roles.ts

/* ======================================================
   Role Types
====================================================== */

export type FWCRole =
  | 'admin'
  | 'pastor'
  | 'leader'
  | 'instructor'
  | 'mentor'
  | 'staff'
  | 'volunteer'
  | 'member'
  | 'student'
  | 'viewer'

export const ROLE_LIST: FWCRole[] = [
  'admin',
  'pastor',
  'leader',
  'instructor',
  'mentor',
  'staff',
  'volunteer',
  'member',
  'student',
  'viewer',
]

/**
 * Role hierarchy — LOWER number = HIGHER authority
 */
export const ROLE_RANKING: Record<FWCRole, number> = {
  admin: 0,
  pastor: 1,
  leader: 2,
  instructor: 3,
  mentor: 4,
  staff: 5,
  volunteer: 6,
  member: 7,
  student: 8,
  viewer: 9,
}

/* ======================================================
   Web User Contract (matches /api/me)
====================================================== */

export type WebUser = {
  id: string
  email?: string

  /** Display fields */
  displayName?: string
  firstName?: string
  lastName?: string

  dateOfBirth?: string

  /** Media */
  avatar?: {
    url?: string
  } | null

  /** Auth */
  roles: FWCRole[]

  /** Relationships */
  profile?: string | number | null
}

/* ======================================================
   Role Utilities
====================================================== */

/**
 * Check if user has ANY of the listed roles
 */
export function userHasRole(
  user: WebUser | null | undefined,
  roles: FWCRole[],
): boolean {
  const userRoles = Array.isArray(user?.roles) ? user.roles : []
  return userRoles.some((r) => roles.includes(r))
}

/**
 * Check if user has at least the minimum required role
 * (hierarchy-aware, multi-role safe)
 */
export function hasRoleAtLeast(
  user: WebUser | null | undefined,
  minimum: FWCRole,
): boolean {
  const userRoles = Array.isArray(user?.roles) ? user.roles : []
  return userRoles.some(
    (r) => ROLE_RANKING[r] <= ROLE_RANKING[minimum],
  )
}

/**
 * Get the highest-authority role the user has
 */
export function getHighestRole(
  user: WebUser | null | undefined,
): FWCRole | null {
  const userRoles = Array.isArray(user?.roles) ? user.roles : []
  if (!userRoles.length) return null

  return userRoles.reduce((a, b) =>
    ROLE_RANKING[a] < ROLE_RANKING[b] ? a : b,
  )
}

/**
 * Safe display name helper for UI
 */
export function getUserDisplayName(user: WebUser): string {
  if (user.displayName) return user.displayName
  if (user.firstName) return user.firstName
  return user.email ?? 'User'
}
