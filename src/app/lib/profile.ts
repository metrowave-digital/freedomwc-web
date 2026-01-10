// src/app/lib/profile.ts
import { getUser } from '../lib/auth/getUser'
import {
  findProfileByUserId,
  createProfile,
  type Profile,
} from '../lib/payload'

/* ======================================================
   GET CURRENT PROFILE (STRICT)
====================================================== */

export async function getMyProfile(): Promise<Profile> {
  const user = await getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  const profile = await findProfileByUserId(user.id)

  if (!profile) {
    throw new Error('Profile not found')
  }

  return profile
}

/* ======================================================
   GET OR CREATE PROFILE (FIRST LOGIN SAFE)
====================================================== */

export async function getOrCreateMyProfile(): Promise<Profile> {
  const user = await getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  const existing = await findProfileByUserId(user.id)

  if (existing) {
    return existing
  }

  /**
   * Display name fallback order:
   * 1. Email prefix (if available)
   * 2. Auth0 user id
   * 3. Generic placeholder
   */
  const displayName =
    user.email?.split('@')[0] ??
    `Member-${user.id.slice(0, 6)}`

  return await createProfile({
    userId: user.id,
    displayName,
  })
}

