export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { cookies } from 'next/headers'

/* ======================================================
   Cookie Utilities
====================================================== */

async function getCookieHeader(): Promise<string> {
  const cookieStore = await cookies()

  // ✅ Guard for runtime compatibility
  if (typeof cookieStore.getAll !== 'function') {
    return ''
  }

  return cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ')
}

/* ======================================================
   Enrollment Types (WEB CONTRACT)
====================================================== */

export type EnrollmentStatus =
  | 'enrolled'
  | 'in-progress'
  | 'completed'
  | 'withdrawn'
  | 'incomplete'

export type RelationshipRef =
  | string
  | {
      id: string
      title?: string
      name?: string
      slug?: string
    }

export type Enrollment = {
  id: string
  course: RelationshipRef
  courseTitle: string

  profile: RelationshipRef
  learnerProfile?: RelationshipRef | null

  instructor?: RelationshipRef | null
  mentor?: RelationshipRef | null

  cohort?: RelationshipRef | null
  pathwaysProgram?: RelationshipRef | null
  pathwaysPhase?: RelationshipRef | null

  status: EnrollmentStatus
  progress: number
  certificateIssued: boolean

  startDate: string
  endDate?: string | null

  notes?: string | null
  createdAt?: string
  updatedAt?: string
}

/* ======================================================
   Fetch Helpers
====================================================== */

export async function getMyEnrollments(): Promise<Enrollment[]> {
  const cookieHeader = await getCookieHeader()

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/enrollments/me`,
    {
      headers: cookieHeader
        ? { Cookie: cookieHeader }
        : undefined,
      cache: 'no-store',
    },
  )

  if (!res.ok) return []

  return res.json()
}

export async function getEnrollmentById(
  enrollmentId: string,
): Promise<Enrollment | null> {
  const cookieHeader = await getCookieHeader()

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/enrollments/${enrollmentId}`,
    {
      headers: cookieHeader
        ? { Cookie: cookieHeader }
        : undefined,
      cache: 'no-store',
    },
  )

  if (!res.ok) return null

  return res.json()
}

export async function getEnrollmentsByProfile(
  profileId: string,
): Promise<Enrollment[]> {
  const cookieHeader = await getCookieHeader()

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/enrollments/profile/${profileId}`,
    {
      headers: cookieHeader
        ? { Cookie: cookieHeader }
        : undefined,
      cache: 'no-store',
    },
  )

  if (!res.ok) return []

  return res.json()
}

/* ======================================================
   Derived Helpers
====================================================== */

export function isEnrollmentActive(enrollment: Enrollment): boolean {
  return (
    enrollment.status === 'enrolled' ||
    enrollment.status === 'in-progress'
  )
}

export function isEnrollmentCompleted(enrollment: Enrollment): boolean {
  return enrollment.status === 'completed'
}

export function canContinueEnrollment(enrollment: Enrollment): boolean {
  return isEnrollmentActive(enrollment) && enrollment.progress < 100
}

export function canAccessCertificate(enrollment: Enrollment): boolean {
  return (
    enrollment.status === 'completed' &&
    enrollment.certificateIssued === true
  )
}
