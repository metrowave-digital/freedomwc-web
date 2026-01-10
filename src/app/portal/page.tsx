// app/portal/page.tsx
import { redirect } from "next/navigation"
import PortalDashboard from "./PortalDashboard"
import { getUser } from "../lib/auth/getUser"
import { getUserDisplayName } from "../access/roles"

/* ======================================================
   Helpers
====================================================== */

function safeDisplayName(
  value: unknown,
): string | undefined {
  return typeof value === "string" && value.trim()
    ? value.trim()
    : undefined
}

function getRoleLabel(
  roles: readonly string[] | undefined,
): string {
  if (!roles || roles.length === 0) return "Member"

  return (
    roles[0].charAt(0).toUpperCase() +
    roles[0].slice(1)
  )
}

/* ======================================================
   Page
====================================================== */

export default async function PortalPage() {
  /* ----------------------------------
     Authenticated user
  ---------------------------------- */
  const user = await getUser()

  if (!user) {
    redirect("/login")
  }

  /* ----------------------------------
     Fetch profile (server-side)
  ---------------------------------- */
  const profileRes = await fetch(
    `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/profiles?where[user][equals]=${user.id}&limit=1`,
    {
      headers: {
        Authorization: `users API-Key ${process.env.PAYLOAD_API_KEY}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    },
  )

  const profileJson = profileRes.ok
    ? await profileRes.json()
    : null

  const profile = profileJson?.docs?.[0]

  /* ----------------------------------
     Resolve identity (AUTHORITATIVE)
  ---------------------------------- */
  const displayName =
    safeDisplayName(profile?.displayName) ||
    getUserDisplayName(user) ||
    "Member"

  const roleLabel = getRoleLabel(user.roles)

  /* ----------------------------------
     Render
  ---------------------------------- */
  return (
    <PortalDashboard
      displayName={displayName}
      roleLabel={roleLabel}
    />
  )
}
