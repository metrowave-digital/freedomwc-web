import { NextResponse } from 'next/server'
import { getSession } from '../../../lib/auth/session'

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params

  /* ----------------------------------
     Web session
  ---------------------------------- */

  const session = await getSession()
  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 },
    )
  }

  /* ----------------------------------
     Parse body
  ---------------------------------- */

  const data = await req.json()

  /* ----------------------------------
     Call CMS internal endpoint
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
        profileId: id,
        data,
        actingUserId: session.id,
      }),
    },
  )

  if (!res.ok) {
    const text = await res.text()
    return NextResponse.json(
      { error: text },
      { status: res.status },
    )
  }

  const updated = await res.json()
  return NextResponse.json(updated)
}
