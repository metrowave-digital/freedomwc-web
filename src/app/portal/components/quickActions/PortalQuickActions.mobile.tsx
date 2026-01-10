"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useCallback } from "react"
import styles from "./PortalQuickActions.mobile.module.css"

import { hasRoleAtLeast } from "../../../../app/access/roles"
import type { WebUser, FWCRole } from "../../../../app/access/roles"

import {
  Compass,
  BookOpen,
  Heart,
  Users,
  Settings,
  Shield,
} from "lucide-react"

/* ======================================================
   Types
====================================================== */

type MobileQuickAction = {
  label: string
  href: string
  icon: React.ElementType
  minRole: FWCRole
}

/* ======================================================
   Page → Mobile Quick Actions
====================================================== */

const MOBILE_QUICK_ACTIONS: Record<string, MobileQuickAction[]> = {
  "/portal": [
    {
      label: "Journey",
      href: "/portal/pathways/journey",
      icon: Compass,
      minRole: "student",
    },
    {
      label: "Give",
      href: "/portal/giving",
      icon: Heart,
      minRole: "member",
    },
    {
      label: "Admin",
      href: "/admin",
      icon: Shield,
      minRole: "admin",
    },
  ],

  "/portal/pathways": [
    {
      label: "Journey",
      href: "/portal/pathways/journey",
      icon: Compass,
      minRole: "student",
    },
    {
      label: "Courses",
      href: "/portal/pathways/courses",
      icon: BookOpen,
      minRole: "student",
    },
    {
      label: "Mentors",
      href: "/portal/pathways/mentors",
      icon: Users,
      minRole: "mentor",
    },
  ],

  "/portal/profile": [
    {
      label: "Settings",
      href: "/portal/profile/edit",
      icon: Settings,
      minRole: "viewer",
    },
  ],
}

/* ======================================================
   Component
====================================================== */

export default function PortalQuickActionsMobile({
  user,
}: {
  user: WebUser
}) {
  const pathname = usePathname()

  const handleTap = useCallback(() => {
    // Light haptic feedback (Android / supported browsers)
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(10)
    }
  }, [])

  // Find most specific route match
  const matchedKey =
    Object.keys(MOBILE_QUICK_ACTIONS)
      .sort((a, b) => b.length - a.length)
      .find((key) => pathname.startsWith(key)) ?? null

  if (!matchedKey) return null

  const actions = MOBILE_QUICK_ACTIONS[matchedKey]
    .filter((action) => hasRoleAtLeast(user, action.minRole))
    .slice(0, 3) // 🔒 Hard cap

  if (!actions.length) return null

  return (
    <div className={styles.mobileActions}>
      {actions.map(({ href, icon: Icon, label }) => (
        <Link
          key={href}
          href={href}
          className={styles.action}
          aria-label={label}
          onTouchStart={handleTap}
        >
          <Icon size={20} />
          <span>{label}</span>
        </Link>
      ))}
    </div>
  )
}
