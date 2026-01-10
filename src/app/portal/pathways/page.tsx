import styles from './Pathways.module.css'

export default function PortalPathwaysPage() {
  return (
    <div className={styles.page}>
      {/* ================= Header ================= */}
      <header className={styles.header}>
        <h1>Your Pathways Journey</h1>
        <p>
          Pathways is your guided process for spiritual growth,
          discipleship, and leadership formation.
        </p>
      </header>

      {/* ================= Current Phase ================= */}
      <section className={styles.current}>
        <div className={styles.currentInner}>
          <span className={styles.badge}>Current Phase</span>
          <h2>Foundations</h2>
          <p>
            Establishing spiritual disciplines, identity in Christ,
            and the core values of Freedom Worship Center.
          </p>

          <div className={styles.progressWrap}>
            <div className={styles.progressLabel}>
              Progress: 3 of 6 lessons completed
            </div>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} />
            </div>
          </div>

          <a href="/portal/pathways/foundations" className={styles.primaryBtn}>
            Continue Foundations →
          </a>
        </div>
      </section>

      {/* ================= Phases ================= */}
      <section className={styles.phases}>
        <h3>Pathways Phases</h3>

        <div className={styles.grid}>
          <div className={styles.phaseCard}>
            <h4>Foundations</h4>
            <p>Faith, identity, prayer, and scripture.</p>
            <span className={styles.statusActive}>In Progress</span>
          </div>

          <div className={styles.phaseCard}>
            <h4>Formation</h4>
            <p>Spiritual practices, character, healing.</p>
            <span className={styles.statusLocked}>Locked</span>
          </div>

          <div className={styles.phaseCard}>
            <h4>Service</h4>
            <p>Gifts, calling, ministry engagement.</p>
            <span className={styles.statusLocked}>Locked</span>
          </div>

          <div className={styles.phaseCard}>
            <h4>Leadership</h4>
            <p>Leading others with wisdom and humility.</p>
            <span className={styles.statusLocked}>Locked</span>
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className={styles.cta}>
        <h3>Need Help or Direction?</h3>
        <p>
          Your Pathways mentor or leader can help guide you
          through your next steps.
        </p>
        <a href="/portal/support" className={styles.secondaryBtn}>
          Contact Support
        </a>
      </section>
    </div>
  )
}
