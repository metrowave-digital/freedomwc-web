"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import styles from "./PortalMobileNav.module.css"
import {
  BookOpen,
  Calendar,
  Map,
  Play,
  Heart,
  MessageSquare,
  ChevronUp,
} from "lucide-react"

type NavItem = {
  label: string
  href: string
  icon: React.ElementType
  submenu?: { label: string; href: string }[]
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/portal", icon: BookOpen },
  { label: "Events", href: "/portal/events", icon: Calendar },
  {
    label: "Pathways",
    href: "/portal/pathways",
    icon: Map,
    submenu: [
      { label: "My Journey", href: "/portal/pathways/journey" },
      { label: "Courses", href: "/portal/pathways/courses" },
      { label: "Mentors", href: "/portal/pathways/mentors" },
    ],
  },
  { label: "Media", href: "/portal/media", icon: Play },
  { label: "Giving", href: "/portal/giving", icon: Heart },
  { label: "Community", href: "/portal/community", icon: MessageSquare },
]

export default function PortalMobileNav() {
  const pathname = usePathname()
  const [openSub, setOpenSub] = useState(false)

  return (
    <>


      {/* Submenu */}
      {openSub && (
        <div className={styles.subMenu}>
          {NAV_ITEMS.find((i) => i.submenu)?.submenu?.map((sub) => (
            <Link key={sub.href} href={sub.href}>
              {sub.label}
            </Link>
          ))}
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className={styles.mobileNav}>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive =
            pathname === item.href ||
            (item.submenu &&
              pathname.startsWith("/portal/pathways"))

          if (item.submenu) {
            return (
              <button
                key={item.label}
                type="button"
                className={`${styles.navItem} ${
                  isActive ? styles.active : ""
                }`}
                onClick={() => setOpenSub((prev) => !prev)}
              >
                <Icon size={20} />
                <span>{item.label}</span>
                <ChevronUp
                  size={14}
                  className={`${styles.chevron} ${
                    openSub ? styles.open : ""
                  }`}
                />
              </button>
            )
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`${styles.navItem} ${
                isActive ? styles.active : ""
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Brand Bar */}
      <div className={styles.brandBar}>
        <span className={styles.brandSection}>THE COMMONS</span>
        <span className={styles.separator}>|</span>
        <Link href="/" className={styles.brandLink}>
          Freedom Worship Center
        </Link>
      </div>
    </>
  )
}
