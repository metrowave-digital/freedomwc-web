// app/portal/household/[id]/page.tsx
import Link from 'next/link'
import styles from './HouseholdPage.module.css'
import { payloadFetch } from '../../../../app/lib/payload'

type ProfileListItem = {
  id: string
  displayName?: string
  householdRole?: string
  pathwaysPhase?: string
}

export default async function HouseholdPage({
  params,
}: {
  params: { id: string }
}) {
  const householdId = params.id

  const data = await payloadFetch<{ docs: ProfileListItem[] }>(
    `/api/profiles?where[household][equals]=${encodeURIComponent(
      householdId,
    )}&limit=50&depth=0`,
  )

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <h1>Household</h1>
        <p>Family profiles connected to this household.</p>
      </header>

      <div className={styles.card}>
        {data.docs.length ? (
          <div className={styles.list}>
            {data.docs.map((p) => (
              <div key={p.id} className={styles.item}>
                <div>
                  <div className={styles.name}>{p.displayName || 'Member'}</div>
                  <div className={styles.meta}>
                    {p.householdRole || '—'} • {p.pathwaysPhase || '—'}
                  </div>
                </div>
                <Link className={styles.link} href="/portal/profile">
                  View
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p className={styles.muted}>No profiles found.</p>
        )}
      </div>
    </section>
  )
}
