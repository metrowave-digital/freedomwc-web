"use client"

import styles from "./SidebarFooterCondensed.module.css"
import PortalViewSwitcher from "../viewSwitcher/PortalViewSwitcher"
import type { WebUser } from "../../../../app/access/roles"

export default function SidebarFooterCondensed({
  user,
}: {
  user: WebUser
}) {
  return (
    <div className={styles.footer}>
      <PortalViewSwitcher user={user} />
      <span className={styles.hint}>
        Portal view locked on tablet
      </span>
    </div>
  )
}
