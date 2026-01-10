"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import styles from "./PortalHeader.module.css"

import PortalBreadcrumb from "../breadcrumb/PortalBreadcrumb"
import PortalPageTitle from "../pageTitles/PortalPageTitle"
import PortalQuickActions from "../quickActions/PortalQuickActions"

import type { WebUser } from "../../../../app/access/roles"
import { getUserDisplayName } from "../../../../app/access/roles"

/* ======================================================
   Helpers
====================================================== */

function safeAvatarFilename(avatar: unknown): string | undefined {
  if (!avatar || typeof avatar !== "object") return undefined
  const a = avatar as { filename?: unknown }
  return typeof a.filename === "string" ? a.filename : undefined
}

function safeDisplayName(value: unknown): string | undefined {
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

export default function PortalHeader({ user }: { user: WebUser }) {
  const [avatarFile, setAvatarFile] = useState<string | undefined>()
  const [profileName, setProfileName] = useState<string | undefined>()
  const [imgLoaded, setImgLoaded] = useState(false)

  const displayName =
    profileName ||
    getUserDisplayName(user) ||
    "Member"

  const initials = getInitials(displayName)

  /* ----------------------------------
     Fetch profile (client-safe)
  ---------------------------------- */

  useEffect(() => {
    const controller = new AbortController()

    fetch("/api/portal/profile", { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : null))
      .then((profile) => {
        if (!profile) return

        setAvatarFile(safeAvatarFilename(profile.avatar))
        setProfileName(safeDisplayName(profile.displayName))
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error("Profile fetch failed", err)
        }
      })

    return () => controller.abort()
  }, [])

  const avatarSrc = avatarFile
    ? `/api/image/${avatarFile}`
    : undefined

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
          {/* Desktop quick actions only */}
          <PortalQuickActions user={user} />

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
              {avatarSrc && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={avatarSrc}
                  src={avatarSrc}
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
