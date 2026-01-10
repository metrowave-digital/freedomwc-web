import { NextResponse } from "next/server"
import { getSession } from "../../lib/auth/session"

type PayloadUser = {
  id: string
  email: string
  roles?: string[]
  displayName?: string
}

export async function GET() {
  /* ----------------------------------
     Session check
  ---------------------------------- */
  const session = await getSession()

  if (!session?.id) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 },
    )
  }

  /* ----------------------------------
     Fetch user from Payload
  ---------------------------------- */
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/users/${session.id}`,
    {
      method: "GET",
      headers: {
        Authorization: `users API-Key ${process.env.PAYLOAD_API_KEY}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    },
  )

  if (!res.ok) {
    return NextResponse.json(
      { error: "User not found" },
      { status: 401 },
    )
  }

  const user = (await res.json()) as PayloadUser

  /* ----------------------------------
     Sanitize response
  ---------------------------------- */
  return NextResponse.json({
    id: user.id,
    email: user.email,
    roles: user.roles ?? [],
    displayName: user.displayName,
  })
}
