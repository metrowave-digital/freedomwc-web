"use client"

import { useState, useSyncExternalStore } from "react"
import styles from "./PortalViewSwitcher.module.css"

import type { WebUser } from "../../../../app/access/roles"

import { getAllowedViews } from "../../../../app/access/getAllowedViews"
import {
  setActiveView,
  clearActiveView,
} from "../../../../app/access/viewSession"

import {
  subscribe,
  getSnapshot,
  getServerSnapshot,
  emitChange,
} from "../../../../app/access/viewSessionStore"

export default function PortalViewSwitcher({
  user,
}: {
  user: WebUser
}) {
  const allowedViews = getAllowedViews(user)

  // ✅ Hydration-safe active view
  const activeView = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  )

  const [open, setOpen] = useState(false)

  if (allowedViews.length <= 1) return null

  return (
    <>
      <button
        className={styles.link}
        onClick={() => setOpen(true)}
        type="button"
      >
        Change view
      </button>

      {open && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <h3>Select a view</h3>

            <ul className={styles.list}>
              {allowedViews.map((view) => (
                <li key={view}>
                  <button
                    type="button"
                    className={
                      view === activeView
                        ? styles.active
                        : ""
                    }
                    onClick={() => {
                      setActiveView(view)
                      emitChange() // 🔔 notify subscribers
                      setOpen(false)
                    }}
                  >
                    {view.charAt(0).toUpperCase() +
                      view.slice(1)}
                  </button>
                </li>
              ))}
            </ul>

            {activeView && (
              <button
                type="button"
                className={styles.reset}
                onClick={() => {
                  clearActiveView()
                  emitChange() // 🔔 notify subscribers
                  setOpen(false)
                }}
              >
                Return to my normal view
              </button>
            )}

            <button
              type="button"
              className={styles.close}
              onClick={() => setOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  )
}
