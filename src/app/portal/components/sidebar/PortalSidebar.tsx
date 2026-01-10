"use client"

import type { WebUser } from "../../../../app/access/roles"
import styles from "./PortalSidebar.module.css"

import SidebarBrand from "./SidebarBrand"
import SidebarNav from "./SidebarNav"
import SidebarFooter from "./SidebarFooter"
import SidebarProfile from "./SidebarProfile"

import { useSidebar } from "./useSidebarState"
import { useAutoMinimizeSidebar } from "./useAutoMinimizeSidebar"

export default function PortalSidebar({ user }: { user: WebUser }) {
  const { minimized } = useSidebar()
  useAutoMinimizeSidebar()

  return (
    <aside
      className={`${styles.sidebar} ${
        minimized ? styles.minimized : ""
      }`}
    >
      <SidebarBrand />

      <div className={styles.scroll}>
        <SidebarNav user={user} />
      </div>

      <div className={styles.bottom}>
        <SidebarFooter user={user} />
        <SidebarProfile user={user} />
      </div>
    </aside>
  )
}
