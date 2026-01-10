import type { WebUser } from "../../access/roles"
import { getSession } from "./session"

/**
 * Resolve the currently authenticated user
 * from the session cookie + Payload CMS
 *
 * SERVER-ONLY
 */
export async function getUser(): Promise<WebUser | null> {
  const session = await getSession()

  if (!session?.id) {
    return null
  }

  try {
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
      return null
    }

    const user = await res.json()

    /**
     * IMPORTANT:
     * Explicitly shape the user object
     * to avoid leaking internal Payload fields
     */
    const sanitizedUser: WebUser = {
      id: user.id,
      email: user.email,
      roles: Array.isArray(user.roles) ? user.roles : [],
      displayName: user.displayName,
    }

    return sanitizedUser
  } catch (error) {
    console.error("getUser() failed:", error)
    return null
  }
}
