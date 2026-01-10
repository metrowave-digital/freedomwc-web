"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import styles from "./PortalHeader.module.css"

import PortalBreadcrumb from "../breadcrumb/PortalBreadcrumb"
import PortalPageTitle from "../pageTitles/PortalPageTitle"
import PortalQuickActions from "../quickActions/PortalQuickActions"
import PortalQuickActionsMobile from "../quickActions/PortalQuickActions.mobile"

import type { WebUser } from "../../../../app/access/roles"
import { getUserDisplayName } from "../../../../app/access/roles"

/* ======================================================
   Helpers (same logic as SidebarProfile)
====================================================== */

function safeAvatarUrl(
  avatar: unknown,
): string | undefined {
  if (!avatar || typeof avatar !== "object") return undefined
  const a = avatar as { url?: unknown }
  return typeof a.url === "string" ? a.url : undefined
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

/* ======================================================
   Component
====================================================== */

export default function PortalHeader({
  user,
}: {
  user: WebUser
}) {
  const [avatarUrl, setAvatarUrl] = useState<
    string | undefined
  >(undefined)
  const [profileName, setProfileName] = useState<
    string | undefined
  >(undefined)
  const [imgLoaded, setImgLoaded] = useState(false)

  /* ----------------------------------
     Resolve display name (same rule)
  ---------------------------------- */

  const displayName =
    profileName ||
    getUserDisplayName(user) ||
    "Member"

  const initials = getInitials(displayName)

  /* ----------------------------------
     Fetch profile once (client)
  ---------------------------------- */

  useEffect(() => {
    let mounted = true

    fetch("/api/portal/profile")
      .then((res) => (res.ok ? res.json() : null))
      .then((profile) => {
        if (!mounted || !profile) return

        setAvatarUrl(safeAvatarUrl(profile.avatar))
        setProfileName(
          safeDisplayName(profile.displayName),
        )
      })
      .catch(() => {})

    return () => {
      mounted = false
    }
  }, [])

  return (
    <header className={styles.header}>
      {/* Top row */}
      <div className={styles.topRow}>
        <PortalBreadcrumb />
      </div>

      {/* Title + actions */}
      <div className={styles.bottomRow}>
        <PortalPageTitle user={user} />

        <div className={styles.actions}>
          {/* Desktop actions */}
          <PortalQuickActions user={user} />

          {/* Mobile actions */}
          <PortalQuickActionsMobile user={user} />

          {/* Profile avatar */}
          <Link
            href="/portal/profile"
            className={styles.profileLink}
          >
            <div className={styles.avatar}>
              {/* Initials fallback */}
              <span
                className={`${styles.initials} ${
                  imgLoaded ? styles.hidden : ""
                }`}
              >
                {initials}
              </span>

              {/* Avatar image */}
              {avatarUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarUrl}
                  alt={displayName}
                  onLoad={() => setImgLoaded(true)}
                  onError={() => setImgLoaded(false)}
                />
              )}
            </div>

            <span className={styles.profileLabel}>
              My Profile
            </span>
          </Link>
        </div>
      </div>
    </header>
  )
}
