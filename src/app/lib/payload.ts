/* ======================================================
   Payload REST Client (Server + User Aware)
   Freedom Worship Center
====================================================== */

import { cookies } from 'next/headers'

/* ======================================================
   TYPES
====================================================== */

export type PayloadUser = {
  id: string
  email?: string
  roles: string[]
  auth0Id?: string
}

export type PayloadUpload = {
  id: string
  url?: string
  filename?: string
  mimeType?: string
}

export type PayloadRelation<T> = string | T

export type Profile = {
  id: string
  displayName?: string
  slug?: string
  avatar?: PayloadRelation<PayloadUpload>

  bio?: string
  testimony?: string

  phone?: string
  preferredContactMethod?: 'email' | 'phone' | 'text'
  doNotContact?: boolean

  pathwaysPhase?:
    | 'restore'
    | 'root'
    | 'rise'
    | 'release'
    | 'alumni'
    | 'none'
  pathwaysProgress?: number

  ministryFocus?: string

  volunteerInterests?: (
    | 'hospitality'
    | 'worship'
    | 'creative'
    | 'outreach'
    | 'youth'
    | 'teaching'
    | 'prayer'
    | 'events'
  )[]

  spiritualGifts?: (
    | 'teaching'
    | 'leadership'
    | 'wisdom'
    | 'prophecy'
    | 'healing'
    | 'encouragement'
    | 'service'
    | 'administration'
    | 'evangelism'
    | 'faith'
  )[]

  spiritualGiftAssessment?: string
  skills?: string

  isMentorCandidate?: boolean
  leadershipTrackStatus?: 'none' | 'training' | 'serving' | 'leading'

  accountabilityPartner?: PayloadRelation<Profile>
  pastorOrMinistryLead?: PayloadRelation<Profile>

  accountabilityNotes?: string
  leaderNotes?: string

  household?: PayloadRelation<{ id: string; name?: string }>
  householdRole?: 'head' | 'spouse' | 'adult' | 'youth' | 'child'

  isTither?: 'yes' | 'growing' | 'no' | 'unspecified'
  givingFrequency?:
    | 'weekly'
    | 'biweekly'
    | 'monthly'
    | 'seasonal'
    | 'special'
  preferredGivingFund?: string

  user?: string
}

/* ======================================================
   ENV
====================================================== */

function getPayloadEnv() {
  const API_URL =
    process.env.CMS_INTERNAL_URL ??
    process.env.CMS_URL

  const API_KEY = process.env.PAYLOAD_API_KEY

  if (!API_URL) {
    throw new Error(
      'Missing CMS_INTERNAL_URL or CMS_URL',
    )
  }

  if (!API_KEY) {
    throw new Error('Missing PAYLOAD_API_KEY')
  }

  return { API_URL, API_KEY }
}

/* ======================================================
   SERVER (API KEY) CLIENT
====================================================== */

export async function payloadFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const { API_URL, API_KEY } = getPayloadEnv()

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
      ...options.headers,
    },
    cache: 'no-store',
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(
      `Payload request failed (${res.status}): ${text}`,
    )
  }

  return res.json() as Promise<T>
}

/* ======================================================
   USER (PAYLOAD JWT) CLIENT
====================================================== */

export async function payloadFetchWithUser<T>(
  req: Request,
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const { API_URL } = getPayloadEnv()

  // ✅ Next.js 15 requires await
  const cookieStore = await cookies()
  const payloadToken =
    cookieStore.get('payload-token')?.value

  const headers = new Headers(options.headers)

  headers.set('content-type', 'application/json')

  if (payloadToken) {
    headers.set(
      'Authorization',
      `JWT ${payloadToken}`,
    )
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    cache: 'no-store',
    credentials: 'include',
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(
      `Payload request failed (${res.status}): ${text}`,
    )
  }

  return res.json() as Promise<T>
}


/* ======================================================
   USERS
====================================================== */

export async function findUserByEmail(
  email: string,
): Promise<PayloadUser | null> {
  const data = await payloadFetch<{
    docs: PayloadUser[]
  }>(
    `/api/users?where[email][equals]=${encodeURIComponent(
      email,
    )}&limit=1`,
  )

  return data.docs[0] ?? null
}

export async function createUser(data: {
  email: string
  auth0Id: string
}): Promise<PayloadUser> {
  return payloadFetch<PayloadUser>(`/api/users`, {
    method: 'POST',
    body: JSON.stringify({
      email: data.email,
      auth0Id: data.auth0Id,
      roles: ['viewer'],
    }),
  })
}

/* ======================================================
   PROFILES
====================================================== */

export async function findProfileByUserId(
  userId: string,
): Promise<Profile | null> {
  const result = await payloadFetch<{
    docs: Profile[]
  }>(
    `/api/profiles?where[user][equals]=${encodeURIComponent(
      userId,
    )}&depth=2&limit=1`,
  )

  return result.docs[0] ?? null
}

export async function createProfile(data: {
  userId: string
  displayName: string
}): Promise<Profile> {
  return payloadFetch<Profile>(`/api/profiles`, {
    method: 'POST',
    body: JSON.stringify({
      user: data.userId,
      displayName: data.displayName,
    }),
  })
}

export async function updateProfile(
  req: Request,
  profileId: string,
  data: Partial<Profile>,
): Promise<Profile> {
  return payloadFetchWithUser<Profile>(
    req,
    `/api/profiles/${profileId}`,
    {
      method: 'PATCH',
      body: JSON.stringify(data),
    },
  )
}

export async function getProfileById(
  id: string,
): Promise<Profile | null> {
  try {
    return await payloadFetch<Profile>(
      `/api/profiles/${id}?depth=2`,
    )
  } catch {
    return null
  }
}

export async function getProfileBySlug(
  slug: string,
): Promise<Profile | null> {
  const result = await payloadFetch<{
    docs: Profile[]
  }>(
    `/api/profiles?where[slug][equals]=${encodeURIComponent(
      slug,
    )}&depth=2&limit=1`,
  )

  return result.docs[0] ?? null
}