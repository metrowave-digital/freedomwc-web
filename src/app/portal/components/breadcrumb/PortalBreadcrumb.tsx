"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import styles from "./PortalBreadcrumb.module.css"

/* ======================================================
   Optional Route Label Overrides
====================================================== */

const LABEL_OVERRIDES: Record<string, string> = {
  portal: "Home",
  pathways: "Pathways",
  journey: "My Journey",
  courses: "Courses",
  mentors: "Mentors",
  profile: "Profile",
  events: "Events",
  media: "Media",
  giving: "Giving",
  community: "Community",
}

/* ======================================================
   Helpers
====================================================== */

function formatLabel(segment: string): string {
  return (
    LABEL_OVERRIDES[segment] ??
    segment
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase())
  )
}

/* ======================================================
   Component
====================================================== */

export default function PortalBreadcrumb() {
  const pathname = usePathname()

  const segments = pathname
    .split("/")
    .filter(Boolean)
    .filter((seg) => seg !== "portal")

  if (!segments.length) return null

  const breadcrumbItems = segments.map((segment, index) => ({
    label: formatLabel(segment),
    href: `/portal/${segments.slice(0, index + 1).join("/")}`,
    isLast: index === segments.length - 1,
  }))

  return (
    <nav
      key={pathname} /* 🔑 Triggers animation on route change */
      className={styles.breadcrumb}
      aria-label="Breadcrumb"
    >
      {/* Home */}
      <Link href="/portal" className={styles.link}>
        Home
      </Link>

      {/* Mobile collapsed */}
      <span className={styles.mobileOnly}>
        <span className={styles.separator}>/</span>
        <span className={styles.ellipsis}>…</span>
        <span className={styles.separator}>/</span>
        <span className={styles.current}>
          {breadcrumbItems[breadcrumbItems.length - 1].label}
        </span>
      </span>

      {/* Desktop full */}
      <span className={styles.desktopOnly}>
        {breadcrumbItems.map((item) => (
          <span key={item.href} className={styles.item}>
            <span className={styles.separator}>/</span>

            {item.isLast ? (
              <span className={styles.current}>
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className={styles.link}
              >
                {item.label}
              </Link>
            )}
          </span>
        ))}
      </span>
    </nav>
  )
}
