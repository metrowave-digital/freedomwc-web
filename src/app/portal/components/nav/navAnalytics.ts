// app/portal/navAnalytics.ts
export function trackNavClick(label: string, href?: string) {
  if (typeof window === "undefined") return

  window.dispatchEvent(
    new CustomEvent("portal:navigate", {
      detail: { label, href },
    }),
  )

  // Example future hook:
  // window.analytics?.track("Portal Navigation", { label, href })
}
