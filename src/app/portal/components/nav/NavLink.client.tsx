"use client"

import Link from "next/link"
import type { ReactNode } from "react"
import { trackNavClick } from "./navAnalytics"

/* ======================================================
   Client Nav Link (Analytics-safe)
====================================================== */

type NavLinkProps = {
  href?: string
  label: string
  className?: string
  children: ReactNode
}

export default function NavLink({
  href = "#",
  label,
  className,
  children,
}: NavLinkProps) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() => trackNavClick(label, href)}
    >
      {children}
    </Link>
  )
}
