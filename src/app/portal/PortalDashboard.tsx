"use client"

import styles from "./portal.module.css"
import {
  ArrowUpRight,
  Calendar,
  Heart,
  MessageSquare,
  Play,
} from "lucide-react"

/* ======================================================
   Helpers
====================================================== */

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return "Good Morning"
  if (hour < 18) return "Good Afternoon"
  return "Good Evening"
}

/* ======================================================
   Component
====================================================== */

export default function PortalDashboard({
  displayName,
  roleLabel,
}: {
  displayName: string
  roleLabel: string
}) {
  return (
    <section>
      <header className={styles.header}>
        <h1>
          {getGreeting()}, {displayName}
        </h1>
        <p>
          {new Date().toLocaleDateString(undefined, {
            weekday: "long",
          })}{" "}
          • {roleLabel} Portal
        </p>
      </header>

      {/* Bento Grid */}
      <div className={styles.grid}>
        <div className={`${styles.card} ${styles.feature}`}>
          <span className={styles.badge}>Devotional</span>
          <h2>
            “Your word is a lamp to my feet and a light to my
            path.”
          </h2>
          <p className={styles.scripture}>
            Psalm 119:105
          </p>
          <button className={styles.primaryAction}>
            Read Reflection <ArrowUpRight size={16} />
          </button>
        </div>

        <div className={`${styles.card} ${styles.vertical}`}>
          <h3>Pathways</h3>
          <p>Foundations • 65% complete</p>
          <button className={styles.secondaryAction}>
            Resume Journey
          </button>
        </div>

        <div className={styles.card}>
          <Heart />
          <h3>Giving</h3>
          <p>Make a donation</p>
        </div>

        <div className={styles.card}>
          <MessageSquare />
          <h3>Prayer Wall</h3>
          <p>Submit a request</p>
        </div>

        <div className={`${styles.card} ${styles.media}`}>
          <Play />
          <h3>Latest Sermon</h3>
          <p>Walking in Purpose</p>
        </div>

        <div className={`${styles.card} ${styles.events}`}>
          <Calendar />
          <h3>Upcoming Events</h3>
          <p>Sunday Worship • 10:30 AM</p>
        </div>
      </div>
    </section>
  )
}
