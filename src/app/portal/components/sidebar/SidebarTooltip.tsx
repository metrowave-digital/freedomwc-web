import styles from "./SidebarTooltip.module.css"

export default function SidebarTooltip({
  label,
}: {
  label: string
}) {
  return (
    <span className={styles.tooltip}>
      {label}
    </span>
  )
}
