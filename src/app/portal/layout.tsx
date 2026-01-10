import type { ReactNode } from "react"
import styles from "./layout.module.css"

import { getUser } from "../../app/lib/auth/getUser"
import type { WebUser } from "../../app/access/roles"

import PortalSidebar from "./components/sidebar/PortalSidebar"
import PortalHeader from "./components/header/PortalHeader"
import PortalMobileNav from "./components/nav/PortalMobileNav"
import { SidebarProvider } from "./components/sidebar/useSidebarState"

export default async function PortalLayout({
  children,
}: {
  children: ReactNode
}) {
  const user = (await getUser()) as WebUser

  return (
    <SidebarProvider>
      <div className={styles.shell}>
        <PortalSidebar user={user} />

        <main className={styles.main}>
          <PortalHeader user={user} />
          {children}
        </main>

        <PortalMobileNav />
      </div>
    </SidebarProvider>
  )
}
