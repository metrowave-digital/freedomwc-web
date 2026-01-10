"use client"

import { usePathname } from "next/navigation"
import { useMemo, useState } from "react"
import { ChevronDown } from "lucide-react"

import styles from "./SidebarNav.module.css"
import NavLink from "../nav/NavLink.client"
import { useSidebar } from "./useSidebarState"

import {
  hasRoleAtLeast,
  type WebUser,
} from "../../../../app/access/roles"

import { MAIN_NAV, type NavItem } from "../nav/nav.config"

/* ======================================================
   Helpers
====================================================== */

function isActive(pathname: string, href?: string) {
  if (!href) return false
  if (href === "/portal") return pathname === "/portal"
  return pathname === href || pathname.startsWith(href + "/")
}

/* ======================================================
   Sidebar Nav
====================================================== */

export default function SidebarNav({ user }: { user: WebUser }) {
  const pathname = usePathname()
  const { minimized } = useSidebar()

  // 🔒 one top-level section open at a time
  const [openTop, setOpenTop] = useState<string | null>(null)

  const nav = useMemo(
    () =>
      MAIN_NAV.filter(
        (item) =>
          !item.minRole || hasRoleAtLeast(user, item.minRole),
      ),
    [user],
  )

  return (
    <nav className={styles.nav}>
      {nav.map((item) => (
        <NavNode
          key={item.label}
          item={item}
          pathname={pathname}
          user={user}
          minimized={minimized}
          depth={0}
          openTop={openTop}
          setOpenTop={setOpenTop}
        />
      ))}
    </nav>
  )
}

/* ======================================================
   Recursive Node
====================================================== */

function NavNode({
  item,
  pathname,
  user,
  minimized,
  depth,
  openTop,
  setOpenTop,
}: {
  item: NavItem
  pathname: string
  user: WebUser
  minimized: boolean
  depth: number
  openTop: string | null
  setOpenTop: (v: string | null) => void
}) {
  const Icon = item.icon

  const children =
    item.children?.filter(
      (c) => !c.minRole || hasRoleAtLeast(user, c.minRole),
    ) ?? []

  const hasChildren = children.length > 0
  const isTop = depth === 0
  const isHeader = !item.href

  const selfActive = isActive(pathname, item.href)
  const childActive = children.some((c) =>
    isActive(pathname, c.href),
  )

  // 🔒 exclusive child accordion (Overview / Learning / etc.)
  const [openChild, setOpenChild] = useState<string | null>(null)

  // 👇 derived open state (NO effects)
  const open =
    depth === 0
      ? openTop === item.label || childActive
      : isHeader
      ? openChild === item.label || childActive
      : false

  /* ======================================================
     SECTION HEADER (NO LINK)
  ====================================================== */

  if (isHeader) {
    return (
      <div className={styles.group} data-depth={depth}>
        <button
          type="button"
          className={styles.sectionHeader}
          onClick={() => {
            if (!hasChildren) return

            if (isTop) {
              setOpenTop(
                openTop === item.label ? null : item.label,
              )
            } else {
              setOpenChild(
                openChild === item.label ? null : item.label,
              )
            }
          }}
        >
          <span>{item.label}</span>

          {hasChildren && (
            <ChevronDown
              size={16}
              className={`${styles.chevron} ${
                open ? styles.chevronOpen : ""
              } ${isTop ? styles.chevronStrong : ""}`}
            />
          )}
        </button>

        {!minimized && hasChildren && open && (
          <div className={styles.children}>
            {children.map((child) => (
              <NavNode
                key={child.label}
                item={child}
                pathname={pathname}
                user={user}
                minimized={minimized}
                depth={depth + 1}
                openTop={openTop}
                setOpenTop={setOpenTop}
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  /* ======================================================
     LINK ITEM
  ====================================================== */

  return (
    <div className={styles.group} data-depth={depth}>
      <div className={styles.itemRow}>
        <NavLink
          href={item.href}
          label={item.label}
          className={`${styles.item} ${
            selfActive ? styles.active : ""
          }`}
        >
          {Icon && <Icon size={18} />}
          {!minimized && <span>{item.label}</span>}
        </NavLink>

        {!minimized && hasChildren && (
          <button
            type="button"
            className={styles.chevronBtn}
            onClick={() => {
              if (isTop) {
                setOpenTop(
                  openTop === item.label ? null : item.label,
                )
              } else {
                setOpenChild(
                  openChild === item.label ? null : item.label,
                )
              }
            }}
            aria-label={`Toggle ${item.label}`}
          >
            <ChevronDown
              size={16}
              className={`${styles.chevron} ${
                open ? styles.chevronOpen : ""
              } ${isTop ? styles.chevronStrong : ""}`}
            />
          </button>
        )}
      </div>

      {!minimized && hasChildren && open && (
        <div className={styles.children}>
          {children.map((child) => (
            <NavNode
              key={child.label}
              item={child}
              pathname={pathname}
              user={user}
              minimized={minimized}
              depth={depth + 1}
              openTop={openTop}
              setOpenTop={setOpenTop}
            />
          ))}
        </div>
      )}
    </div>
  )
}
