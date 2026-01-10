// app/portal/pathways/journey/page.tsx

import styles from './Journey.module.css'
import { ArrowRight, CheckCircle } from 'lucide-react'

/* ======================================================
   TEMP DATA (replace with Payload fetch later)
====================================================== */

const program = {
  title: 'Pathways Discipleship Journey',
  description:
    'A guided spiritual formation journey designed to restore identity, root believers in truth, and release leaders into calling.',
  estimatedDurationWeeks: 36,
}

const phases = [
  {
    id: 'restore',
    order: 1,
    title: 'Phase 1 – Restore',
    theme: 'Healing & Identity',
    description:
      'This phase focuses on inner healing, restoring spiritual identity, and establishing healthy rhythms with God.',
    completed: true,
  },
  {
    id: 'root',
    order: 2,
    title: 'Phase 2 – Root',
    theme: 'Foundation & Formation',
    description:
      'Participants grow deeper in Scripture, spiritual disciplines, and community belonging.',
    completed: false,
    current: true,
  },
  {
    id: 'rise',
    order: 3,
    title: 'Phase 3 – Rise',
    theme: 'Calling & Gifts',
    description:
      'This phase helps individuals discern calling, spiritual gifts, and leadership capacity.',
    completed: false,
  },
  {
    id: 'release',
    order: 4,
    title: 'Phase 4 – Release',
    theme: 'Mission & Service',
    description:
      'Leaders are commissioned into ministry, service, and multiplication.',
    completed: false,
  },
]

const progressPercent = 42

/* ======================================================
   PAGE
====================================================== */

export default function PathwaysJourneyPage() {
  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <h1>Your Pathways Journey</h1>
        <p>{program.description}</p>
      </header>

      {/* Progress Card */}
      <section className={styles.progressCard}>
        <div className={styles.progressMeta}>
          <span className={styles.progressLabel}>Overall Progress</span>
          <strong>{progressPercent}%</strong>
        </div>

        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <p className={styles.progressHint}>
          Estimated duration: {program.estimatedDurationWeeks} weeks
        </p>
      </section>

      {/* Phases */}
      <section className={styles.phases}>
        {phases.map((phase) => (
          <div
            key={phase.id}
            className={[
              styles.phaseCard,
              phase.completed && styles.completed,
              phase.current && styles.current,
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <div className={styles.phaseHeader}>
              <span className={styles.phaseOrder}>
                Phase {phase.order}
              </span>

              {phase.completed && (
                <CheckCircle size={18} className={styles.checkIcon} />
              )}
            </div>

            <h3>{phase.title}</h3>
            <span className={styles.phaseTheme}>{phase.theme}</span>

            <p className={styles.phaseDescription}>
              {phase.description}
            </p>

            {phase.current && (
              <button className={styles.currentAction}>
                Continue this phase
                <ArrowRight size={16} />
              </button>
            )}
          </div>
        ))}
      </section>
    </div>
  )
}
