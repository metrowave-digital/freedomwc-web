"use client"

import Image from "next/image"
import { PanelLeft } from "lucide-react"
import styles from "./SidebarBrand.module.css"
import { useSidebar } from "./useSidebarState"

export default function SidebarBrand() {
  const { toggle, minimized } = useSidebar()

  return (
    <div
      className={`${styles.brand} ${
        minimized ? styles.minimized : ""
      }`}
    >
      <div className={styles.logoWrap}>
        <Image
          src="/fwc-logo.svg"
          alt="Freedom Worship Center"
          width={minimized ? 28 : 40}
          height={minimized ? 28 : 40}
          priority
        />
      </div>

      {!minimized && (
        <div className={styles.text}>
          <span className={styles.name}>
            THE COMMONS
          </span>
          <span className={styles.sub}>
            Freedom Worship Center
          </span>
        </div>
      )}

      <button
        type="button"
        onClick={toggle}
        className={styles.collapse}
      >
        <PanelLeft size={16} />
      </button>
    </div>
  )
}
