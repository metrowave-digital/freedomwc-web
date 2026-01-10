"use client"

import { usePathname } from "next/navigation"
import styles from "./PortalPageTitle.module.css"

import {
  getHighestRole,
  hasRoleAtLeast,
} from "../../../../app/access/roles"
import type { WebUser, FWCRole } from "../../../../app/access/roles"

/* ======================================================
   Route → Titles
====================================================== */

const ROUTE_TITLES: Record<string, string> = {
  "/portal/pathways/journey": "My Journey",
  "/portal/pathways/courses": "Courses",
  "/portal/pathways/mentors": "Mentors",
  "/portal/pathways": "Pathways",

  "/portal/events": "Events",
  "/portal/media": "Media",
  "/portal/giving": "Giving",
  "/portal/community": "Community",
  "/portal/profile": "My Profile",

  "/portal": "Dashboard",
}

/* ======================================================
   Dynamic Subtitles (safe placeholders)
====================================================== */

function getSubtitle(
  pathname: string,
  user: WebUser,
): string | null {
  if (pathname.startsWith("/portal/pathways/courses")) {
    if (hasRoleAtLeast(user, "instructor")) {
      return "Courses you teach"
    }
    return "Your active courses"
  }

  if (pathname.startsWith("/portal/pathways/journey")) {
    if (hasRoleAtLeast(user, "mentor")) {
      return "Journeys you oversee"
    }
    return "Your current phase"
  }

  if (pathname === "/portal") {
    if (hasRoleAtLeast(user, "admin")) {
      return "System overview"
    }
    if (hasRoleAtLeast(user, "student")) {
      return "Your next steps"
    }
    return "Welcome back"
  }

  if (pathname.startsWith("/portal/community")) {
    if (hasRoleAtLeast(user, "leader")) {
      return "Groups & care"
    }
    return "Connect & grow"
  }

  return null
}

/* ======================================================
   Role → Badge Labels
====================================================== */

const ROLE_BADGE_LABELS: Partial<Record<FWCRole, string>> = {
  admin: "Admin",
  pastor: "Pastor",
  leader: "Leader",
  instructor: "Instructor",
  mentor: "Mentor",
}

/* ======================================================
   Component
====================================================== */

export default function PortalPageTitle({
  user,
}: {
  user: WebUser
}) {
  const pathname = usePathname()

  // Most specific route match wins
  const matchedRoute =
    Object.keys(ROUTE_TITLES)
      .sort((a, b) => b.length - a.length)
      .find((route) => pathname.startsWith(route)) ?? "/portal"

  const title = ROUTE_TITLES[matchedRoute] ?? "Portal"
  const subtitle = getSubtitle(pathname, user)

  const highestRole = getHighestRole(user)
  const badgeLabel =
    highestRole && ROLE_BADGE_LABELS[highestRole]

  return (
    <header className={styles.header}>
      <div className={styles.titleRow}>
        <h1 className={styles.title}>{title}</h1>

        {badgeLabel && (
          <span className={styles.badge}>
            {badgeLabel}
          </span>
        )}
      </div>

      {subtitle && (
        <p className={styles.subtitle}>{subtitle}</p>
      )}
    </header>
  )
}
