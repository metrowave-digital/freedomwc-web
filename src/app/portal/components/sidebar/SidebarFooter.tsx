"use client"

import Link from "next/link"
import { useSyncExternalStore } from "react"

import styles from "./SidebarFooter.module.css"

import NavLink from "../nav/NavLink.client"
import PortalViewSwitcher from "../viewSwitcher/PortalViewSwitcher"

import type { WebUser } from "../../../../app/access/roles"
import { FOOTER_NAV } from "../nav/nav.config"

import {
  subscribe,
  getSnapshot,
  getServerSnapshot,
} from "../../../../app/access/viewSessionStore"

import { useSidebar } from "./useSidebarState"

export default function SidebarFooter({
  user,
}: {
  user: WebUser
}) {
  const { minimized } = useSidebar()

  const activeView = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  )

  if (minimized) return null

  return (
    <footer className={styles.footer}>
      <Link href="/" className={styles.return}>
        ← Return to Freedom Worship Center
      </Link>

      <nav className={styles.footerNav}>
        {FOOTER_NAV.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.label}
              href={item.href}
              label={item.label}
              className={styles.footerItem}
            >
              {Icon && <Icon size={14} />}
              {item.label}
            </NavLink>
          )
        })}

        <PortalViewSwitcher user={user} />
      </nav>

      {activeView && (
        <div className={styles.viewStatus}>
          Viewing as <span>{activeView}</span>
        </div>
      )}
    </footer>
  )
}
