// app/api/portal/profile/route.ts
import { NextResponse } from 'next/server'
import { getUser } from '../../../../app/lib/auth/getUser'
import { getOrCreateMyProfile } from '../../../../app/lib/profile'

type ProfileUpdateInput = Record<string, unknown>

function isStaff(roles: readonly string[]) {
  return roles.includes('admin') || roles.includes('staff')
}

function isLeader(roles: readonly string[]) {
  return roles.includes('leader') || isStaff(roles)
}

function allowlistByRole(
  input: ProfileUpdateInput,
  roles: readonly string[],
): ProfileUpdateInput {
  const out: ProfileUpdateInput = {}

  const memberFields = new Set([
    'displayName',
    'bio',
    'testimony',
    'phone',
    'address',
    'preferredContactMethod',
    'doNotContact',
    'volunteerInterests',
    'spiritualGifts',
    'skills',
    'discProfile',
    'enneagram',
    'spiritualGiftAssessment',
    'emergencyContacts',
  ])

  const leaderFields = new Set(['ministryFocus'])

  for (const [k, v] of Object.entries(input)) {
    if (memberFields.has(k)) out[k] = v
    if (leaderFields.has(k) && isLeader(roles)) out[k] = v
  }

  return out
}

export async function GET() {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 },
      )
    }

    // Get or create the user's profile
    const profile = await getOrCreateMyProfile()

    return NextResponse.json(profile)
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to load profile' },
      { status: 500 },
    )
  }
}

export async function PATCH(req: Request) {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const profile = await getOrCreateMyProfile()

    const body = await req.json()
    if (typeof body !== 'object' || body === null) {
      return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
    }

    const data = allowlistByRole(body as ProfileUpdateInput, user.roles ?? [])

    if (!Object.keys(data).length) {
      return NextResponse.json(
        { error: 'No allowed fields to update' },
        { status: 400 },
      )
    }

    /* ----------------------------------
       Call SAME internal endpoint
    ---------------------------------- */

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/internal/update-profile`,
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          authorization: `users API-Key ${process.env.PAYLOAD_API_KEY}`,
        },
        body: JSON.stringify({
          profileId: profile.id,
          data,
          actingUserId: user.id,
        }),
      },
    )

    if (!res.ok) {
      const text = await res.text()
      return NextResponse.json({ error: text }, { status: res.status })
    }

    const updated = await res.json()
    return NextResponse.json(updated)
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Update failed' },
      { status: 500 },
    )
  }
}
