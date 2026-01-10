"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import styles from "./PortalQuickActions.module.css"
import { hasRoleAtLeast } from "../../../access/roles"
import type { WebUser, FWCRole } from "../../../access/roles"

/* ======================================================
   Quick Action Type
====================================================== */

type QuickAction = {
  label: string
  href: string
  minRole: FWCRole
}

/* ======================================================
   Page → Quick Actions Map
====================================================== */

const QUICK_ACTIONS: Record<string, QuickAction[]> = {
  "/portal": [
    { label: "My Journey", href: "/portal/pathways/journey", minRole: "student" },
    { label: "Give", href: "/portal/giving", minRole: "member" },
    { label: "Admin Panel", href: "/admin", minRole: "admin" },
  ],

  "/portal/pathways": [
    { label: "My Journey", href: "/portal/pathways/journey", minRole: "student" },
    { label: "Courses", href: "/portal/pathways/courses", minRole: "student" },
    { label: "Mentor Tools", href: "/portal/pathways/mentors", minRole: "mentor" },
  ],

  "/portal/pathways/courses": [
    { label: "My Courses", href: "/portal/pathways/courses", minRole: "student" },
    { label: "Manage Courses", href: "/portal/pathways/courses/manage", minRole: "instructor" },
    { label: "Assignments", href: "/portal/pathways/assignments", minRole: "instructor" },
  ],

  "/portal/community": [
    { label: "Groups", href: "/portal/groups", minRole: "leader" },
    { label: "Care Requests", href: "/portal/care", minRole: "leader" },
    { label: "Prayer Requests", href: "/portal/prayer", minRole: "pastor" },
  ],

  "/portal/profile": [
    { label: "Edit Profile", href: "/portal/profile/edit", minRole: "viewer" },
    { label: "Privacy Settings", href: "/portal/profile/privacy", minRole: "member" },
  ],
}

/* ======================================================
   Component
====================================================== */

export default function PortalQuickActions({
  user,
}: {
  user: WebUser
}) {
  const pathname = usePathname()

  /**
   * Find the most specific matching route
   * (supports nested routes like /portal/pathways/xyz)
   */
  const matchedKey =
    Object.keys(QUICK_ACTIONS)
      .sort((a, b) => b.length - a.length)
      .find((key) => pathname.startsWith(key)) ?? null

  if (!matchedKey) return null

  const actions = QUICK_ACTIONS[matchedKey]
    .filter((action) => hasRoleAtLeast(user, action.minRole))
    .slice(0, 3) // 🔒 HARD CAP

  if (!actions.length) return null

  return (
    <div className={styles.actions}>
      {actions.map((action) => (
        <Link key={action.href} href={action.href}>
          {action.label}
        </Link>
      ))}
    </div>
  )
}
