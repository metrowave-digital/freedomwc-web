import styles from "./RoleBadge.module.css"
import type { WebUser } from "../../../../app/access/roles"

export default function RoleBadge({
  user,
}: {
  user: WebUser
}) {
  const primaryRole = user.roles?.[0]

  if (!primaryRole) return null

  return (
    <span
      className={`${styles.badge} ${styles[primaryRole]}`}
    >
      {primaryRole}
    </span>
  )
}
