"use client"

import Link from "next/link"
import { MoreHorizontal } from "lucide-react"
import { useEffect, useState } from "react"

import styles from "./SidebarProfile.module.css"

import {
  getUserDisplayName,
  type WebUser,
} from "../../../../app/access/roles"

import { useSidebar } from "./useSidebarState"

/* ======================================================
   Local helpers
====================================================== */

function getPrimaryRoleLabel(
  roles: readonly string[] | undefined,
): string {
  if (!roles || roles.length === 0) return "Member"

  // Priority order (highest → lowest)
  const priority: Record<string, string> = {
    admin: "Administrator",
    pastor: "Pastor",
    leader: "Leader",
    mentor: "Mentor",
    instructor: "Instructor",
    staff: "Staff",
    volunteer: "Volunteer",
    member: "Member",
    student: "Student",
    viewer: "Viewer",
  }

  for (const key of Object.keys(priority)) {
    if (roles.includes(key)) {
      return priority[key]
    }
  }

  return "Member"
}

function safeDisplayName(
  value: unknown,
): string | undefined {
  return typeof value === "string" && value.trim()
    ? value.trim()
    : undefined
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("")
}

/**
 * Extract filename from Payload media object
 * "/api/media/file/75-1.jpeg" → "75-1.jpeg"
 */
function getAvatarFileId(
  avatar: unknown,
): string | undefined {
  if (!avatar || typeof avatar !== "object") return undefined

  const a = avatar as { url?: unknown }
  if (typeof a.url !== "string") return undefined

  return a.url.split("/").pop()
}

/* ======================================================
   Component
====================================================== */

export default function SidebarProfile({
  user,
}: {
  user: WebUser
}) {
  const { minimized } = useSidebar()

  const [imgLoaded, setImgLoaded] = useState(false)
  const [avatarSrc, setAvatarSrc] = useState<
    string | undefined
  >(undefined)
  const [profileName, setProfileName] = useState<
    string | undefined
  >(undefined)

  const roleLabel = getPrimaryRoleLabel(user.roles)

  /* ======================================================
     Display name resolution (stable)
  ====================================================== */

  const displayName =
    profileName ||
    getUserDisplayName(user) ||
    "Member"

  const initials = getInitials(displayName)

  /* ======================================================
     Fetch profile (client-side, once)
  ====================================================== */

  useEffect(() => {
    let mounted = true

    fetch("/api/portal/profile")
      .then((res) => (res.ok ? res.json() : null))
      .then((profile) => {
        if (!mounted || !profile) return

        const fileId = getAvatarFileId(profile.avatar)

        setAvatarSrc(
          fileId ? `/api/image/${fileId}` : undefined,
        )

        setProfileName(
          safeDisplayName(profile.displayName),
        )
      })
      .catch(() => {})

    return () => {
      mounted = false
    }
  }, [])

  /* ======================================================
     Render
  ====================================================== */

  return (
    <Link
      href="/portal/profile"
      className={`${styles.profile} ${
        minimized ? styles.minimized : ""
      }`}
    >
      {/* Avatar */}
      <div className={styles.avatar}>
        {/* Initials fallback */}
        <span
          className={`${styles.initials} ${
            imgLoaded ? styles.hidden : ""
          }`}
        >
          {initials}
        </span>

        {/* Avatar image (proxied) */}
        {avatarSrc && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatarSrc}
            alt={displayName}
            className={styles.avatarImg}
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgLoaded(false)}
          />
        )}
      </div>

      {!minimized && (
        <>
          <div className={styles.meta}>
            <span className={styles.name}>
              {displayName}
            </span>
            <span className={styles.role}>
              {roleLabel}
            </span>
          </div>

          <MoreHorizontal size={18} />
        </>
      )}
    </Link>
  )
}
