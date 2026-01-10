// src/app/access/control.ts

import {
  ROLE_LIST,
  type FWCRole,
  type WebUser,
  hasRoleAtLeast as baseHasRoleAtLeast,
} from './roles'

/* ============================================================
   CONTEXT TYPES (WEB)
============================================================ */

/**
 * Minimal request-like context for web app usage
 * (App Router, server components, client components)
 */
export type WebRequestContext = {
  user?: WebUser | null
  pathname?: string
}

/* ============================================================
   BASIC HELPERS
============================================================ */

export function isLoggedIn(ctx: WebRequestContext): boolean {
  return Boolean(ctx.user)
}

/**
 * Get all valid roles from user
 */
export function getUserRoles(ctx: WebRequestContext): FWCRole[] {
  const roles = Array.isArray(ctx.user?.roles) ? ctx.user!.roles : []
  return roles.filter((r): r is FWCRole =>
    ROLE_LIST.includes(r),
  )
}

/**
 * Role hierarchy check (multi-role safe)
 */
export function hasRoleAtLeast(
  ctx: WebRequestContext,
  minimum: FWCRole,
): boolean {
  return baseHasRoleAtLeast(ctx.user ?? null, minimum)
}

/**
 * Detect admin-only routes in the WEB app
 */
export function isAdminRoute(ctx: WebRequestContext): boolean {
  return Boolean(ctx.pathname?.startsWith('/portal/admin'))
}

/* ============================================================
   GENERIC ACCESS HELPERS
============================================================ */

export function publicRead(): boolean {
  return true
}

export function loggedInOnly(ctx: WebRequestContext): boolean {
  return isLoggedIn(ctx)
}

export function adminOnly(ctx: WebRequestContext): boolean {
  return (
    hasRoleAtLeast(ctx, 'admin') ||
    isAdminRoute(ctx)
  )
}

/**
 * Staff and above
 */
export function staffOnly(ctx: WebRequestContext): boolean {
  return (
    hasRoleAtLeast(ctx, 'staff') ||
    isAdminRoute(ctx)
  )
}

/**
 * Instructor and above
 */
export function instructorsOnly(ctx: WebRequestContext): boolean {
  return (
    hasRoleAtLeast(ctx, 'instructor') ||
    isAdminRoute(ctx)
  )
}

/**
 * Mentor and above
 */
export function mentorsOnly(ctx: WebRequestContext): boolean {
  return (
    hasRoleAtLeast(ctx, 'mentor') ||
    isAdminRoute(ctx)
  )
}

/**
 * Allow only specific roles
 */
export function allowRoles(
  ctx: WebRequestContext,
  roles: FWCRole[],
): boolean {
  if (!ctx.user) return false
  if (isAdminRoute(ctx)) return true

  const userRoles = getUserRoles(ctx)
  return userRoles.some((r) => roles.includes(r))
}

/**
 * Self or admin/staff
 */
export function allowIfSelfOrAdmin(
  ctx: WebRequestContext,
  resourceOwnerId?: string | number,
): boolean {
  if (!ctx.user) return false

  if (hasRoleAtLeast(ctx, 'staff') || isAdminRoute(ctx)) {
    return true
  }

  if (!resourceOwnerId) return false

  return String(ctx.user.id) === String(resourceOwnerId)
}

/* ============================================================
   LMS / PATHWAYS ACCESS (WEB)
============================================================ */

/**
 * LMS read:
 * - Students and above
 */
export function lmsReadAccess(ctx: WebRequestContext): boolean {
  if (!ctx.user) return false
  return (
    hasRoleAtLeast(ctx, 'student') ||
    isAdminRoute(ctx)
  )
}

/**
 * LMS write:
 * - Instructors and above
 */
export function lmsWriteAccess(ctx: WebRequestContext): boolean {
  return (
    hasRoleAtLeast(ctx, 'instructor') ||
    isAdminRoute(ctx)
  )
}
