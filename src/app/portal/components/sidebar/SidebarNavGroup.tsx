"use client"

import { useMemo, useState } from "react"
import { usePathname } from "next/navigation"
import { ChevronDown } from "lucide-react"

import styles from "./SidebarNavGroup.module.css"
import NavLink from "../nav/NavLink.client"

type NavChild = {
  label: string
  href: string
}

type Props = {
  label: string
  href?: string
  icon?: React.ElementType
  children?: NavChild[]
  minimized?: boolean
}

export default function SidebarNavGroup({
  label,
  href,
  icon: Icon,
  children = [],
  minimized = false,
}: Props) {
  const pathname = usePathname()
  const hasChildren = children.length > 0

  /* ----------------------------------
     Active state
  ---------------------------------- */

  const childActive = useMemo(
    () => children.some((c) => pathname === c.href),
    [children, pathname],
  )

  const selfActive = useMemo(() => {
    if (!href) return false
    if (href === "/portal") return pathname === "/portal"
    return pathname === href || pathname.startsWith(href + "/")
  }, [href, pathname])

  const isActive = selfActive || childActive

  /* ----------------------------------
     Accordion logic
  ---------------------------------- */

  const [userOpen, setUserOpen] = useState(false)
  const open = childActive || userOpen

  return (
    <div
      className={styles.group}
      data-minimized={minimized ? "true" : "false"}
      data-child-active={childActive ? "true" : "false"}
    >
      <div
        className={`${styles.trigger} ${
          isActive ? styles.active : ""
        }`}
        onClick={() => {
          if (!hasChildren) return
          if (childActive) return
          setUserOpen((v) => !v)
        }}
        role={hasChildren ? "button" : undefined}
        aria-expanded={hasChildren ? open : undefined}
      >
        <NavLink
          href={href ?? "#"}
          label={label}
          className={styles.link}
        >
          <span className={styles.iconSlot}>
            {Icon && <Icon size={18} />}
          </span>

          {!minimized && (
            <span className={styles.label}>
              {label}
            </span>
          )}
        </NavLink>

        {hasChildren && !minimized && (
          <ChevronDown
            size={14}
            className={`${styles.chevron} ${
              open ? styles.open : ""
            }`}
          />
        )}
      </div>

      {/* Smooth animated panel */}
      {hasChildren && !minimized && (
        <div
          className={`${styles.panelWrap} ${
            open ? styles.panelOpen : ""
          }`}
        >
          <div className={styles.panel}>
            {children.map((c) => (
              <NavLink
                key={c.label}
                href={c.href}
                label={c.label}
                className={`${styles.child} ${
                  pathname === c.href
                    ? styles.childActive
                    : ""
                }`}
              >
                {c.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
