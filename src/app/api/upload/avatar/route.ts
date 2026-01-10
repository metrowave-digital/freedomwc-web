import { NextResponse } from 'next/server'
import { getUser } from '../../../../app/lib/auth/getUser'
import { getOrCreateMyProfile } from '../../../../app/lib/profile'

export async function POST(req: Request) {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 },
      )
    }

    const profile = await getOrCreateMyProfile()

    const formData = await req.formData()
    const file = formData.get('file')

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 },
      )
    }

    /* ----------------------------------
       Forward to Payload internal endpoint
    ---------------------------------- */

    const payloadForm = new FormData()
    payloadForm.append('file', file)
    payloadForm.append('profileId', profile.id)
    payloadForm.append('actingUserId', user.id)
    payloadForm.append('alt', 'Profile avatar')

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/internal/upload-avatar`,
      {
        method: 'POST',
        headers: {
          authorization: `users API-Key ${process.env.PAYLOAD_API_KEY}`,
        },
        body: payloadForm,
      },
    )

    if (!res.ok) {
      const text = await res.text()
      return NextResponse.json(
        { error: text },
        { status: res.status },
      )
    }

    const result = await res.json()
    return NextResponse.json(result)
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : 'Avatar upload failed',
      },
      { status: 500 },
    )
  }
}
