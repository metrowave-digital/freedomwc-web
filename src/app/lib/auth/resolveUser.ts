import type { WebUser } from '../../../app/access/roles'

type ResolveUserInput = {
  sub: string
  email: string
}

export async function resolvePayloadUser(
  input: ResolveUserInput,
): Promise<WebUser> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/auth/resolve-user`,
    {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `users API-Key ${process.env.PAYLOAD_API_KEY}`,
      },
      body: JSON.stringify(input),
      cache: 'no-store',
    },
  )

  if (!res.ok) {
  const status = res.status
  const text = await res.text()
  throw new Error(
    `Payload resolve failed (${status}): ${text}`,
  )
}

  return res.json()
}
