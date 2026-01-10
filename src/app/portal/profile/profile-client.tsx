'use client'

import { useMemo, useState } from 'react'
import styles from './Profile.module.css'
import {
  Pencil,
  Save,
  X,
  CheckCircle2,
  AlertTriangle,
  Home,
  Award,
  Map,
  Phone,
  Shield,
} from 'lucide-react'

import type { UserIdentity } from '../../../app/lib/types/userIdentity'
import { useEffect } from 'react'
import { createPortal } from 'react-dom'

const CONTACT_METHODS = ['email', 'phone', 'text'] as const
type ContactMethod = (typeof CONTACT_METHODS)[number]

const DISC_VALUES = ['d', 'i', 's', 'c'] as const
type DiscProfile = (typeof DISC_VALUES)[number]

type Roles = string[]

type Address = {
  street1?: string
  street2?: string
  city?: string
  state?: string
  postalCode?: string
  country?: string
}

type PayloadUpload = { id: string; url?: string; filename?: string }
type PayloadRelation<T> = string | T

type Badge = {
  title?: string
  icon?: PayloadRelation<PayloadUpload>
  earnedDate?: string
}

type EmergencyContact = {
  fullName: string
  relationship?: string
  phone: string
  email?: string
  address?: Address
  isPrimary?: boolean
  notes?: string
}

type ProfileViewModel = {
  id: string
  displayName?: string
  slug?: string
  avatar?: PayloadRelation<PayloadUpload>

  bio?: string
  testimony?: string

  userIdentity: UserIdentity

  phone?: string
  address?: Address
  preferredContactMethod?: 'email' | 'phone' | 'text'
  doNotContact?: boolean

  pathwaysPhase?: 'restore' | 'root' | 'rise' | 'release' | 'alumni' | 'none'
  pathwaysProgress?: number

  ministryFocus?: string
  volunteerInterests?: (
    | 'hospitality'
    | 'worship'
    | 'creative'
    | 'outreach'
    | 'youth'
    | 'teaching'
    | 'prayer'
    | 'events'
  )[]

  spiritualGifts?: (
    | 'teaching'
    | 'leadership'
    | 'wisdom'
    | 'prophecy'
    | 'healing'
    | 'encouragement'
    | 'service'
    | 'administration'
    | 'evangelism'
    | 'faith'
  )[]

  skills?: string

  discProfile?: 'd' | 'i' | 's' | 'c'
  enneagram?: string
  spiritualGiftAssessment?: string

  isMentorCandidate?: boolean
  leadershipTrackStatus?: 'none' | 'training' | 'serving' | 'leading'
  leadershipNotes?: string

  accountabilityNotes?: string
  leaderNotes?: string

  household?: PayloadRelation<{ id: string; name?: string }>
  householdRole?: 'head' | 'spouse' | 'adult' | 'youth' | 'child'

  isTither?: 'yes' | 'growing' | 'no' | 'unspecified'
  givingFrequency?: 'weekly' | 'biweekly' | 'monthly' | 'seasonal' | 'special'
  preferredGivingFund?: string

  emergencyContacts?: EmergencyContact[]
  badges?: Badge[]
}

type Props = {
  initialProfile: ProfileViewModel
  roles: Roles
}

type EditSection =
  | 'basic'
  | 'contact'
  | 'emergency'
  | 'skills'
  | 'assessments'
  | 'volunteer'
  | 'leader'
  | null

function hasRole(roles: Roles, r: string) {
  return roles?.includes(r)
}

/**
 * Frontend capability map:
 * - mirrors your collection intent (member vs leader vs staff)
 * - DOES NOT replace backend enforcement (backend still enforces access)
 */
function canEdit(section: EditSection, roles: Roles) {
  const isStaff = hasRole(roles, 'admin') || hasRole(roles, 'staff')
  const isLeader = hasRole(roles, 'leader') || isStaff
  const isMember = hasRole(roles, 'member') || isLeader || isStaff

  switch (section) {
    case 'basic':
    case 'contact':
    case 'emergency':
    case 'skills':
    case 'assessments':
    case 'volunteer':
      return isMember
    case 'leader':
      return isLeader
    default:
      return false
  }
}

function prettyPhase(phase?: ProfileViewModel['pathwaysPhase']) {
  switch (phase) {
    case 'restore':
      return 'Phase 1 — Restore'
    case 'root':
      return 'Phase 2 — Root'
    case 'rise':
      return 'Phase 3 — Rise'
    case 'release':
      return 'Phase 4 — Release'
    case 'alumni':
      return 'Alumni'
    case 'none':
    default:
      return 'Not Enrolled'
  }
}

function resolveImageSrc(
  rel?: PayloadRelation<PayloadUpload>,
): string | undefined {
  if (!rel) return undefined

  // Relationship stored as ID
  if (typeof rel === 'string') {
    return `/api/image/${rel}`
  }

  // Fully populated media object
  if (typeof rel === 'object' && typeof rel.id === 'string') {
    return `/api/image/${rel.id}`
  }

  return undefined
}


export default function ProfileClient({ initialProfile, roles }: Props) {
const [profile, setProfile] = useState<ProfileViewModel>({
  ...initialProfile,
  userIdentity: initialProfile.userIdentity ?? {
    firstName: '',
    lastName: '',
    dateOfBirth: undefined,
  },
})
  const [editing, setEditing] = useState<EditSection>(null)
  const [draft, setDraft] = useState<Partial<ProfileViewModel>>({})
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ kind: 'ok' | 'err'; msg: string } | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  const isStaff = useMemo(
  () => hasRole(roles, 'admin') || hasRole(roles, 'staff'),
  [roles],
)
  const isLeader = useMemo(() => hasRole(roles, 'leader') || isStaff, [roles, isStaff])

  const avatarUrl = useMemo(
  () =>
    avatarPreview ??
    resolveImageSrc(profile.avatar),
  [avatarPreview, profile.avatar],
)


  useEffect(() => {
  if (!editing) return

  const body = document.body
  const html = document.documentElement

  const prevBodyOverflow = body.style.overflow
  const prevHtmlOverflow = html.style.overflow
  const prevBodyPosition = body.style.position
  const prevBodyWidth = body.style.width

  body.style.overflow = 'hidden'
  html.style.overflow = 'hidden'

  // iOS Safari fix
  body.style.position = 'fixed'
  body.style.width = '100%'

  return () => {
    body.style.overflow = prevBodyOverflow
    html.style.overflow = prevHtmlOverflow
    body.style.position = prevBodyPosition
    body.style.width = prevBodyWidth
  }
}, [editing])


  function open(section: EditSection) {
    if (!section) return
    if (!canEdit(section, roles)) return
    setDraft(makeDraft(section, profile))
    setEditing(section)
    setToast(null)
  }

  function close() {
  setEditing(null)
  setDraft({})
  setAvatarPreview(null)
}

  async function save() {
    if (!editing) return
    setSaving(true)
    setToast(null)

    try {
      const payload = sanitizePayload(editing, draft, roles)

      const res = await fetch('/api/portal/profile', {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || 'Update failed')
      }

      const updated = (await res.json()) as ProfileViewModel
      setProfile(updated)
setAvatarPreview(null)
setToast({ kind: 'ok', msg: 'Profile updated.' })
close()
    } catch (e: unknown) {
  const message =
    e instanceof Error ? e.message : 'Something went wrong.'

  setToast({
    kind: 'err',
    msg: message.slice(0, 180),
  })
} finally {
      setSaving(false)
    }
  }

  const progress = Math.max(0, Math.min(100, profile.pathwaysProgress ?? 0))
  const phase = profile.pathwaysPhase ?? 'none'

  const identity = profile.userIdentity

  return (
    <>
{/* Identity / Hero */}
<div className={styles.hero}>
  <div className={styles.heroLeft}>
    {/* Avatar */}
    <button
  type="button"
  className={styles.avatarButton}
  onClick={() => canEdit('basic', roles) && open('basic')}
  aria-label="Change profile photo"
>
  <div className={styles.avatarLg}>
    {avatarUrl ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={avatarUrl}
        alt={profile.displayName ?? 'Profile avatar'}
        className={styles.avatarImg}
      />
    ) : (
      <span>
        {(profile.displayName ?? 'Member')
          .split(' ')
          .slice(0, 2)
          .map((w) => w[0]?.toUpperCase())
          .join('')}
      </span>
    )}

    {/* Hover overlay */}
    {canEdit('basic', roles) && (
      <div className={styles.avatarOverlay}>
        <Pencil size={16} />
        <span>Change photo</span>
      </div>
    )}
  </div>
</button>

    {/* Identity */}
    <div className={styles.identity}>
      <div className={styles.heroTitleRow}>
        <h2 className={styles.heroTitle}>
          {profile.displayName ?? 'Member'}
        </h2>

        {/* Role badge */}
        <span
          className={`${styles.rolePill} ${
            isStaff
              ? styles.roleStaff
              : isLeader
              ? styles.roleLeader
              : styles.roleMember
          }`}
        >
          {isStaff ? 'Staff' : isLeader ? 'Leader' : 'Member'}
        </span>
      </div>

      <p className={styles.heroSub}>
        {profile.slug
          ? `@${profile.slug}`
          : 'Your member record & formation journey'}
      </p>

      {/* Pathways phase pill */}
      <div className={styles.phasePill}>
        {prettyPhase(phase)}
      </div>
    </div>
  </div>

  {/* Stats */}
  <div className={styles.heroRight}>
    <div className={styles.stat}>
      <span className={styles.statLabel}>Progress</span>
      <span className={styles.statValue}>{progress}%</span>

      {/* Mini progress bar */}
      <div className={styles.miniProgress}>
        <div
          className={styles.miniProgressFill}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  </div>
</div>


      {/* Toast */}
      {toast && (
        <div className={`${styles.toast} ${toast.kind === 'ok' ? styles.toastOk : styles.toastErr}`}>
          {toast.kind === 'ok' ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Grid */}
      <div className={styles.grid}>
     {/* Pathways progress visualization */}
<section className={`${styles.card} ${styles.cardWide}`}>
  <div className={styles.cardHead}>
    <div className={styles.cardTitle}>
      <Map size={18} />
      <h3>Pathways Formation Journey</h3>
    </div>

    <span className={styles.meta}>{prettyPhase(phase)}</span>
  </div>

  {/* Phase context */}
  <div className={styles.phaseContext}>
    <p className={styles.phaseDescription}>
      {phaseDescription(phase)}
    </p>

    {isStaff ? (
      <span className={styles.staffPill}>Staff-managed</span>
    ) : (
      <span className={styles.readonlyPill}>Formation-led</span>
    )}
  </div>

  {/* Progress */}
  <div className={styles.progressWrap}>
    <div className={styles.progressTop}>
      <span className={styles.progressLabel}>
        {progress}% complete
      </span>

      <span className={styles.progressHint}>
        {progress < 100
          ? 'Growing in this phase'
          : 'Phase completed'}
      </span>
    </div>

    <div className={styles.progressBar}>
  <div
    className={styles.progressFill}
    style={{ width: `${progress}%` }}
  />
</div>

    {/* Timeline */}
    <div className={styles.timeline}>
      {[
        { key: 'restore', label: 'Restore' },
        { key: 'root', label: 'Root' },
        { key: 'rise', label: 'Rise' },
        { key: 'release', label: 'Release' },
      ].map((s) => {
        const active = phase === s.key

        const phaseOrder: Record<
          NonNullable<ProfileViewModel['pathwaysPhase']>,
          number
        > = {
          restore: 0,
          root: 1,
          rise: 2,
          release: 3,
          alumni: 4,
          none: -1,
        }

        const done =
          (phaseOrder[phase] ?? -1) >
          phaseOrder[s.key as keyof typeof phaseOrder]

        return (
          <div key={s.key} className={styles.step}>
            <div
              className={`${styles.dot} ${
                done
                  ? styles.dotDone
                  : active
                  ? styles.dotActive
                  : ''
              }`}
            />
            <span
              className={`${styles.stepLabel} ${
                active ? styles.stepLabelActive : ''
              }`}
            >
              {s.label}
            </span>
          </div>
        )
      })}
    </div>
  </div>

  {/* Gentle next-step guidance */}
  {!isStaff && (
    <div className={styles.nextStepBox}>
      <strong>Next step:</strong>{' '}
      {nextStepHint(phase)}
    </div>
  )}
</section>

        {/* Basic Info */}
<section className={styles.card}>
  <div className={styles.cardHead}>
    <div className={styles.cardTitle}>
      <Shield size={18} />
      <h3>Basic Info</h3>
      
    </div>

    {canEdit('basic', roles) && (
      <button
        className={styles.editBtn}
        onClick={() => open('basic')}
      >
        <Pencil size={16} /> Edit
      </button>
    )}
  </div>

  <p className={styles.sectionHint}>
    Information that helps identify and share your story within the community.
  </p>

  <dl className={styles.dl}>
    <div className={styles.row}>
      <dt>Display name</dt>
      <dd>{profile.displayName ?? '—'}</dd>
    </div>

    {/* Legal identity (system-managed) */}
    <div className={styles.row}>
      <dt>
        Legal name
        <span className={styles.readOnlyTag}>System</span>
      </dt>
      <dd>
        {identity?.firstName || identity?.lastName
          ? `${identity?.firstName ?? ''} ${identity?.lastName ?? ''}`.trim()
          : '—'}
      </dd>
    </div>

    <div className={styles.row}>
      <dt>
        Date of birth
        <span className={styles.readOnlyTag}>Private</span>
      </dt>
      <dd>
        {identity?.dateOfBirth
          ? new Date(identity.dateOfBirth).toLocaleDateString()
          : '—'}
      </dd>
    </div>

    <div className={styles.row}>
      <dt>Bio</dt>
      <dd className={styles.muted}>
        {profile.bio || 'No bio added yet.'}
      </dd>
    </div>

    <div className={styles.row}>
      <dt>Testimony</dt>
      <dd className={styles.muted}>
        {profile.testimony || 'Not shared yet.'}
      </dd>
    </div>
  </dl>
</section>


       {/* Contact & Address */}
<section className={styles.card}>
  <div className={styles.cardHead}>
    <div className={styles.cardTitle}>
      <Phone size={18} />
      <h3>Contact</h3>
    </div>

    {canEdit('contact', roles) && (
      <button
        className={styles.editBtn}
        onClick={() => open('contact')}
      >
        <Pencil size={16} /> Edit
      </button>
    )}
  </div>

  <p className={styles.sectionHint}>
    How leaders and ministry teams may contact you.
  </p>

  <dl className={styles.dl}>
    <div className={styles.row}>
      <dt>Phone</dt>
      <dd>
        {profile.phone || (
          <span className={styles.muted}>Not provided</span>
        )}
      </dd>
    </div>

    <div className={styles.row}>
      <dt>Preferred contact method</dt>
      <dd>
        {profile.preferredContactMethod
          ? profile.preferredContactMethod
          : <span className={styles.muted}>Not specified</span>}
      </dd>
    </div>

    <div className={styles.row}>
      <dt>
        Contact permission
        <span className={styles.readOnlyTag}>Preference</span>
      </dt>
      <dd>
        {profile.doNotContact
          ? 'Do not contact'
          : 'Contact allowed'}
      </dd>
    </div>

    <div className={styles.row}>
      <dt>Address</dt>
      <dd className={styles.muted}>
        {formatAddress(profile.address) ||
          'No address on file.'}
      </dd>
    </div>
  </dl>
</section>

       {/* Volunteer Interests */}
<section className={styles.card}>
  <div className={styles.cardHead}>
    <div className={styles.cardTitle}>
      <Map size={18} />
      <h3>Volunteer Interests</h3>
    </div>

    {canEdit('volunteer', roles) && (
      <button
        className={styles.editBtn}
        onClick={() => open('volunteer')}
      >
        <Pencil size={16} /> Edit
      </button>
    )}
  </div>

  {/* Interest summary */}
  <p className={styles.sectionHint}>
    Areas where you feel led to serve.
  </p>

  {/* Chips */}
  {profile.volunteerInterests?.length ? (
    <div className={styles.chips}>
      {profile.volunteerInterests.map((v) => (
        <span
          key={v}
          className={`${styles.chip} ${styles.chipActive}`}
        >
          {v}
        </span>
      ))}
    </div>
  ) : (
    <div className={styles.emptyState}>
      <p>No volunteer interests selected yet.</p>

      {canEdit('volunteer', roles) && (
        <button
          className={styles.inlineBtn}
          onClick={() => open('volunteer')}
        >
          Add interests
        </button>
      )}
    </div>
  )}

  {/* Divider for leaders */}
  {isLeader && <div className={styles.hr} />}

  {/* Ministry Focus (Leader-managed) */}
  {isLeader && (
    <div className={styles.leaderBox}>
      <div className={styles.leaderHead}>
        <span className={styles.leaderLabel}>
          Ministry Focus
        </span>

        {canEdit('leader', roles) && (
          <button
            className={styles.editBtn}
            onClick={() => open('leader')}
          >
            <Pencil size={16} /> Edit
          </button>
        )}
      </div>

      <p className={styles.muted}>
        {profile.ministryFocus
          ? profile.ministryFocus
          : 'Leader-discerned calling or placement.'}
      </p>
    </div>
  )}
</section>


       {/* Skills & Gifts */}
<section className={styles.card}>
  <div className={styles.cardHead}>
    <div className={styles.cardTitle}>
      <Shield size={18} />
      <h3>Skills & Gifts</h3>
    </div>

    {canEdit('skills', roles) && (
      <button
        className={styles.editBtn}
        onClick={() => open('skills')}
      >
        <Pencil size={16} /> Edit
      </button>
    )}
  </div>

  {/* Spiritual Gifts */}
  <div className={styles.subBlock}>
    <span className={styles.subLabel}>Spiritual Gifts</span>

    {profile.spiritualGifts?.length ? (
      <div className={styles.chips}>
        {profile.spiritualGifts.map((g) => (
          <span
            key={g}
            className={`${styles.chip} ${styles.chipActive}`}
          >
            {g}
          </span>
        ))}
      </div>
    ) : (
      <p className={styles.emptyHint}>
        Not assessed yet.
        {canEdit('skills', roles) && ' You may update this when ready.'}
      </p>
    )}
  </div>

  {/* Skills */}
  <div className={styles.subBlock}>
    <span className={styles.subLabel}>Skills & Experience</span>

    {profile.skills ? (
      <p className={styles.muted}>{profile.skills}</p>
    ) : (
      <p className={styles.emptyHint}>
        No skills listed.
        {canEdit('skills', roles) && ' Consider adding areas you feel confident serving in.'}
      </p>
    )}
  </div>
</section>

        {/* Assessments */}
<section className={styles.card}>
  <div className={styles.cardHead}>
    <div className={styles.cardTitle}>
      <Shield size={18} />
      <h3>Assessments</h3>
    </div>

    {canEdit('assessments', roles) && (
      <button
        className={styles.editBtn}
        onClick={() => open('assessments')}
      >
        <Pencil size={16} /> Edit
      </button>
    )}
  </div>

  <p className={styles.sectionHint}>
    Self-awareness tools that support spiritual formation and leadership development.
  </p>

  <dl className={styles.dl}>
    <div className={styles.row}>
      <dt>DISC Profile</dt>
      <dd>
        {profile.discProfile
          ? profile.discProfile.toUpperCase()
          : <span className={styles.muted}>Not assessed</span>}
      </dd>
    </div>

    <div className={styles.row}>
      <dt>Enneagram</dt>
      <dd>
        {profile.enneagram
          ? profile.enneagram
          : <span className={styles.muted}>Not assessed</span>}
      </dd>
    </div>

    <div className={styles.row}>
      <dt>Reflection Notes</dt>
      <dd className={styles.muted}>
        {profile.spiritualGiftAssessment || 'No notes recorded.'}
      </dd>
    </div>
  </dl>
</section>

        {/* Household */}
<section className={styles.card}>
  <div className={styles.cardHead}>
    <div className={styles.cardTitle}>
      <Home size={18} />
      <h3>Household</h3>
    </div>
  </div>

  {profile.household ? (
    <div className={styles.household}>
      <p className={styles.householdName}>
        {typeof profile.household === 'string'
          ? 'Household'
          : profile.household.name || 'Household'}
      </p>

      <p className={styles.householdRole}>
        Role in household:{' '}
        <strong>
          {profile.householdRole || 'Not specified'}
        </strong>
      </p>

      <p className={styles.householdHint}>
        Your household represents shared formation, care, and connection.
      </p>

      <a
        className={styles.linkBtn}
        href={`/portal/household/${
          typeof profile.household === 'string'
            ? profile.household
            : profile.household.id
        }`}
      >
        View household details
      </a>
    </div>
  ) : (
    <div className={styles.emptyState}>
      <p>
        No household is linked to your profile yet.
      </p>

      <p className={styles.emptyHint}>
        Households help leaders support families and shared spiritual journeys.
      </p>
    </div>
  )}
</section>

       {/* Badges & Achievements */}
<section className={`${styles.card} ${styles.cardWide}`}>
  <div className={styles.cardHead}>
    <div className={styles.cardTitle}>
      <Award size={18} />
      <h3>Badges & Achievements</h3>
    </div>
  </div>

  <p className={styles.sectionHint}>
    Milestones that reflect growth, service, and faithfulness.
  </p>

  {profile.badges?.length ? (
    <div className={styles.badgeGrid}>
      {profile.badges.map((b, idx) => {
        const url = resolveImageSrc(b.icon)

        return (
          <div key={idx} className={styles.badge}>
            <div className={styles.badgeIcon}>
              {url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={url} alt={b.title || 'Badge'} />
              ) : (
                <Award size={18} />
              )}
            </div>

            <div className={styles.badgeMeta}>
              <span className={styles.badgeTitle}>
                {b.title || 'Badge'}
              </span>

              <span className={styles.badgeDate}>
                {b.earnedDate
                  ? `Earned ${new Date(
                      b.earnedDate,
                    ).toLocaleDateString()}`
                  : 'Achievement unlocked'}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  ) : (
    <div className={styles.emptyState}>
      <p>No badges earned yet.</p>
      <p className={styles.emptyHint}>
        Badges are awarded as you progress through Pathways and serve in community.
      </p>
    </div>
  )}
</section>

      </div>

      {/* EDIT MODAL */}
{editing &&
  createPortal(
    <div
      className={styles.modalOverlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) close()
      }}
    >
      <div
        className={styles.modal}
        tabIndex={-1}
        onKeyDown={(e) => {
          if (e.key === 'Escape') close()
        }}
      >
        <div className={styles.modalHead}>
          <h4 id="edit-modal-title">
            {modalTitle(editing)}
          </h4>

          <button
            className={styles.iconBtn}
            onClick={close}
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        <div className={styles.modalBody}>
          {renderForm(editing, draft, setDraft, setAvatarPreview, roles)}
          <p className={styles.modalHint}>
            Changes are saved to your member record.
          </p>
        </div>

        <div className={styles.modalFoot}>
          <button
            className={styles.ghostBtn}
            onClick={close}
            disabled={saving}
          >
            Cancel
          </button>

          <button
            className={styles.saveBtn}
            onClick={save}
            disabled={saving}
          >
            <Save size={16} />
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )}
    </>
  )
}

/* =======================
   Draft + Sanitization
======================= */

function makeDraft(section: EditSection, p: ProfileViewModel): Partial<ProfileViewModel> {
  switch (section) {
    case 'basic':
  return {
    displayName: p.displayName ?? '',
    bio: p.bio ?? '',
    testimony: p.testimony ?? '',
    avatar: p.avatar,
  }
    case 'contact':
      return {
        phone: p.phone ?? '',
        preferredContactMethod: p.preferredContactMethod ?? 'email',
        doNotContact: !!p.doNotContact,
        address: {
          street1: p.address?.street1 ?? '',
          street2: p.address?.street2 ?? '',
          city: p.address?.city ?? '',
          state: p.address?.state ?? '',
          postalCode: p.address?.postalCode ?? '',
          country: p.address?.country ?? 'United States',
        },
      }
    case 'emergency':
      return { emergencyContacts: p.emergencyContacts ?? [] }
    case 'skills':
      return { spiritualGifts: p.spiritualGifts ?? [], skills: p.skills ?? '' }
    case 'assessments':
      return {
        discProfile: p.discProfile,
        enneagram: p.enneagram ?? '',
        spiritualGiftAssessment: p.spiritualGiftAssessment ?? '',
      }
    case 'volunteer':
      return { volunteerInterests: p.volunteerInterests ?? [] }
    case 'leader':
      return { ministryFocus: p.ministryFocus ?? '' }
    default:
      return {}
  }
}

function sanitizePayload(section: EditSection, d: Partial<ProfileViewModel>, roles: Roles) {
  // IMPORTANT: backend still enforces access; this prevents accidental UI overreach
  const isStaff = roles.includes('admin') || roles.includes('staff')
  const isLeader = roles.includes('leader') || isStaff
  const isMember = roles.includes('member') || isLeader || isStaff

  const out: Record<string, unknown> = {}

  if (section === 'basic' && isMember) {
    out.displayName = (d.displayName ?? '').toString().slice(0, 80)
    out.bio = (d.bio ?? '').toString().slice(0, 2000)
    out.testimony = (d.testimony ?? '').toString().slice(0, 4000)

    if (d.avatar) {
        out.avatar = d.avatar
    }
  }

  if (section === 'contact' && isMember) {
    out.phone = (d.phone ?? '').toString().slice(0, 40)
    out.preferredContactMethod = d.preferredContactMethod ?? 'email'
    out.doNotContact = !!d.doNotContact
    out.address = {
      street1: d.address?.street1 ?? '',
      street2: d.address?.street2 ?? '',
      city: d.address?.city ?? '',
      state: d.address?.state ?? '',
      postalCode: d.address?.postalCode ?? '',
      country: d.address?.country ?? 'United States',
    }
  }

  if (section === 'volunteer' && isMember) {
    out.volunteerInterests = Array.isArray(d.volunteerInterests) ? d.volunteerInterests : []
  }

  if (section === 'skills' && isMember) {
    out.spiritualGifts = Array.isArray(d.spiritualGifts) ? d.spiritualGifts : []
    out.skills = (d.skills ?? '').toString().slice(0, 120)
  }

  if (section === 'assessments' && isMember) {
    out.discProfile = d.discProfile
    out.enneagram = (d.enneagram ?? '').toString().slice(0, 2)
    out.spiritualGiftAssessment = (d.spiritualGiftAssessment ?? '').toString().slice(0, 5000)
  }

  if (section === 'emergency' && isMember) {
    out.emergencyContacts = Array.isArray(d.emergencyContacts) ? d.emergencyContacts : []
  }

  if (section === 'leader' && isLeader) {
    out.ministryFocus = (d.ministryFocus ?? '').toString().slice(0, 120)
  }

  return out
}

/* =======================
   Modal content
======================= */

function modalTitle(section: EditSection) {
  switch (section) {
    case 'basic':
      return 'Edit Basic Info'
    case 'contact':
      return 'Edit Contact & Address'
    case 'emergency':
      return 'Edit Emergency Contacts'
    case 'skills':
      return 'Edit Skills & Gifts'
    case 'assessments':
      return 'Edit Assessments'
    case 'volunteer':
      return 'Edit Volunteer Interests'
    case 'leader':
      return 'Edit Ministry Focus'
    default:
      return 'Edit'
  }
}

function renderForm(
  section: EditSection,
  draft: Partial<ProfileViewModel>,
  setDraft: React.Dispatch<React.SetStateAction<Partial<ProfileViewModel>>>,
  setAvatarPreview: React.Dispatch<React.SetStateAction<string | null>>,
  roles: Roles,
) {
  const isLeader = roles.includes('leader') || roles.includes('staff') || roles.includes('admin')

  if (section === 'basic') {
    return (
      <div className={styles.formGrid}>
        <Field label="Profile photo">
        <p className={styles.hint}>
  Upload a square image for best results. This photo is visible to leaders and ministry teams.
</p>
  <input
    type="file"
    accept="image/*"
    onChange={async (e) => {
      const original = e.target.files?.[0]
      if (!original) return

      if (original.size > 5_000_000) {
        alert('Image must be under 5MB')
        return
      }

      const cropped = await cropToSquare(original)

      const uploadData = new FormData()
      uploadData.append('file', cropped)

      const uploadRes = await fetch('/api/upload/avatar', {
        method: 'POST',
        body: uploadData,
      })

      if (!uploadRes.ok) {
        alert('Avatar upload failed')
        return
      }

      const uploadedMedia = await uploadRes.json()

      setAvatarPreview(`/api/image/${uploadedMedia.id}`)


      setDraft((prev) => ({
        ...prev,
        avatar: uploadedMedia.id,
      }))
    }}
  />
</Field>

        <Field label="Display name">
          <input
            className={styles.input}
            value={draft.displayName ?? ''}
            onChange={(e) => setDraft({ ...draft, displayName: e.target.value })}
          />
        </Field>

        <Field label="Bio">
          <textarea
            className={styles.textarea}
            rows={5}
            value={draft.bio ?? ''}
            onChange={(e) => setDraft({ ...draft, bio: e.target.value })}
          />
        </Field>

        <Field label="Testimony / Faith Story">
          <textarea
            className={styles.textarea}
            rows={7}
            value={draft.testimony ?? ''}
            onChange={(e) => setDraft({ ...draft, testimony: e.target.value })}
          />
        </Field>
      </div>
    )
  }

  if (section === 'contact') {
    const addr = draft.address ?? {}
    return (
      <div className={styles.formGrid}>
        <Field label="Phone">
          <input
            className={styles.input}
            value={draft.phone ?? ''}
            onChange={(e) => setDraft({ ...draft, phone: e.target.value })}
          />
        </Field>

        <Field label="Preferred Contact Method">
          <select
  className={styles.select}
  value={draft.preferredContactMethod ?? 'email'}
  onChange={(e) => {
    const value = e.target.value
    if (CONTACT_METHODS.includes(value as ContactMethod)) {
      setDraft({ ...draft, preferredContactMethod: value as ContactMethod })
    }
  }}
>
            <option value="email">Email</option>
            <option value="phone">Phone</option>
            <option value="text">Text</option>
          </select>
        </Field>

        <Field label="Do Not Contact">
          <label className={styles.checkRow}>
            <input
              type="checkbox"
              checked={!!draft.doNotContact}
              onChange={(e) => setDraft({ ...draft, doNotContact: e.target.checked })}
            />
            <span>Enable do-not-contact preference</span>
          </label>
        </Field>

        <div className={styles.hr} />

        <Field label="Street 1">
          <input
            className={styles.input}
            value={addr.street1 ?? ''}
            onChange={(e) => setDraft({ ...draft, address: { ...addr, street1: e.target.value } })}
          />
        </Field>

        <Field label="Street 2">
          <input
            className={styles.input}
            value={addr.street2 ?? ''}
            onChange={(e) => setDraft({ ...draft, address: { ...addr, street2: e.target.value } })}
          />
        </Field>

        <div className={styles.cols2}>
          <Field label="City">
            <input
              className={styles.input}
              value={addr.city ?? ''}
              onChange={(e) => setDraft({ ...draft, address: { ...addr, city: e.target.value } })}
            />
          </Field>

          <Field label="State">
            <input
              className={styles.input}
              value={addr.state ?? ''}
              onChange={(e) => setDraft({ ...draft, address: { ...addr, state: e.target.value } })}
            />
          </Field>
        </div>

        <div className={styles.cols2}>
          <Field label="Postal Code">
            <input
              className={styles.input}
              value={addr.postalCode ?? ''}
              onChange={(e) =>
                setDraft({ ...draft, address: { ...addr, postalCode: e.target.value } })
              }
            />
          </Field>

          <Field label="Country">
            <input
              className={styles.input}
              value={addr.country ?? 'United States'}
              onChange={(e) =>
                setDraft({ ...draft, address: { ...addr, country: e.target.value } })
              }
            />
          </Field>
        </div>
      </div>
    )
  }

if (section === 'volunteer') {
  const options = [
    'hospitality',
    'worship',
    'creative',
    'outreach',
    'youth',
    'teaching',
    'prayer',
    'events',
  ] as const

  type VolunteerInterest = (typeof options)[number]

  const selected: VolunteerInterest[] = Array.isArray(draft.volunteerInterests)
  ? draft.volunteerInterests.filter(
      (v): v is VolunteerInterest =>
        options.includes(v as VolunteerInterest),
    )
  : []

  return (
    <div className={styles.formGrid}>
      <p className={styles.hint}>Select all that apply.</p>

      <div className={styles.chipPicker}>
        {options.map((opt) => {
          const on = selected.includes(opt)

          return (
            <button
              key={opt}
              type="button"
              className={`${styles.pickChip} ${on ? styles.pickChipOn : ''}`}
              onClick={() => {
  setDraft((prev) => {
    const current = Array.isArray(prev.volunteerInterests)
      ? prev.volunteerInterests
      : []

    const next = current.includes(opt)
      ? current.filter((v) => v !== opt)
      : [...current, opt]

    return { ...prev, volunteerInterests: next }
  })
}}
            >
              {opt}
            </button>
          )
        })}
      </div>

      {isLeader && (
        <p className={styles.modalHint}>
          Leaders may also set Ministry Focus in the “Ministry Focus” section.
        </p>
      )}
    </div>
  )
}

  if (section === 'skills') {
  const giftOptions = [
    'teaching',
    'leadership',
    'wisdom',
    'prophecy',
    'healing',
    'encouragement',
    'service',
    'administration',
    'evangelism',
    'faith',
  ] as const

  type SpiritualGift = (typeof giftOptions)[number]

  const selected: SpiritualGift[] = Array.isArray(draft.spiritualGifts)
    ? draft.spiritualGifts.filter(
        (g): g is SpiritualGift =>
          giftOptions.includes(g as SpiritualGift),
      )
    : []

  return (
    <div className={styles.formGrid}>
      <Field label="Spiritual Gifts">
        <div className={styles.chipPicker}>
          {giftOptions.map((opt) => {
            const on = selected.includes(opt)

            return (
              <button
                key={opt}
                type="button"
                className={`${styles.pickChip} ${on ? styles.pickChipOn : ''}`}
                onClick={() => {
  setDraft((prev) => {
    const current = Array.isArray(prev.spiritualGifts)
      ? prev.spiritualGifts
      : []

    const next = current.includes(opt)
      ? current.filter((g) => g !== opt)
      : [...current, opt]

    return { ...prev, spiritualGifts: next }
  })
}}

              >
                {opt}
              </button>
            )
          })}
        </div>
      </Field>

      <Field label="Skills (free text)">
        <input
          className={styles.input}
          value={draft.skills ?? ''}
          onChange={(e) =>
            setDraft({ ...draft, skills: e.target.value })
          }
          placeholder="e.g. music, hospitality, media production…"
        />
      </Field>
    </div>
  )
}

  if (section === 'assessments') {
    return (
      <div className={styles.formGrid}>
        <div className={styles.cols2}>
          <Field label="DISC">
            <select
  className={styles.select}
  value={draft.discProfile ?? ''}
  onChange={(e) => {
    const value = e.target.value
    setDraft({
      ...draft,
      discProfile: DISC_VALUES.includes(value as DiscProfile)
        ? (value as DiscProfile)
        : undefined,
    })
  }}
>
              <option value="">—</option>
              <option value="d">D</option>
              <option value="i">I</option>
              <option value="s">S</option>
              <option value="c">C</option>
            </select>
          </Field>

          <Field label="Enneagram">
            <select
              className={styles.select}
              value={draft.enneagram ?? ''}
              onChange={(e) => setDraft({ ...draft, enneagram: e.target.value })}
            >
              <option value="">—</option>
              {Array.from({ length: 9 }).map((_, i) => (
                <option key={i} value={String(i + 1)}>
                  {i + 1}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Assessment Notes">
          <textarea
            className={styles.textarea}
            rows={7}
            value={draft.spiritualGiftAssessment ?? ''}
            onChange={(e) => setDraft({ ...draft, spiritualGiftAssessment: e.target.value })}
          />
        </Field>
      </div>
    )
  }

  if (section === 'leader') {
    return (
      <div className={styles.formGrid}>
        <Field label="Ministry Focus">
          <input
            className={styles.input}
            value={draft.ministryFocus ?? ''}
            onChange={(e) => setDraft({ ...draft, ministryFocus: e.target.value })}
            placeholder="Calling or area of passion…"
          />
        </Field>

        <p className={styles.hint}>
          This field is leader-only per your access rules.
        </p>
      </div>
    )
  }

  if (section === 'emergency') {
    const contacts: EmergencyContact[] = Array.isArray(draft.emergencyContacts)
      ? draft.emergencyContacts
      : []

    return (
      <div className={styles.formGrid}>
        <p className={styles.hint}>Add one or more emergency contacts.</p>

        <div className={styles.stack}>
          {contacts.map((c, idx) => (
            <div key={idx} className={styles.box}>
              <div className={styles.cols2}>
                <Field label="Full name">
                  <input
                    className={styles.input}
                    value={c.fullName ?? ''}
                    onChange={(e) => {
                      const next = [...contacts]
                      next[idx] = { ...c, fullName: e.target.value }
                      setDraft({ ...draft, emergencyContacts: next })
                    }}
                  />
                </Field>

                <Field label="Relationship">
                  <input
                    className={styles.input}
                    value={c.relationship ?? ''}
                    onChange={(e) => {
                      const next = [...contacts]
                      next[idx] = { ...c, relationship: e.target.value }
                      setDraft({ ...draft, emergencyContacts: next })
                    }}
                  />
                </Field>
              </div>

              <div className={styles.cols2}>
                <Field label="Phone">
                  <input
                    className={styles.input}
                    value={c.phone ?? ''}
                    onChange={(e) => {
                      const next = [...contacts]
                      next[idx] = { ...c, phone: e.target.value }
                      setDraft({ ...draft, emergencyContacts: next })
                    }}
                  />
                </Field>

                <Field label="Email">
                  <input
                    className={styles.input}
                    value={c.email ?? ''}
                    onChange={(e) => {
                      const next = [...contacts]
                      next[idx] = { ...c, email: e.target.value }
                      setDraft({ ...draft, emergencyContacts: next })
                    }}
                  />
                </Field>
              </div>

              <Field label="Notes">
                <textarea
                  className={styles.textarea}
                  rows={3}
                  value={c.notes ?? ''}
                  onChange={(e) => {
                    const next = [...contacts]
                    next[idx] = { ...c, notes: e.target.value }
                    setDraft({ ...draft, emergencyContacts: next })
                  }}
                />
              </Field>

              <div className={styles.rowBtns}>
                <button
                  type="button"
                  className={styles.dangerBtn}
                  onClick={() => {
                    const next = contacts.filter((_, i) => i !== idx)
                    setDraft({ ...draft, emergencyContacts: next })
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          className={styles.addBtn}
          onClick={() => {
            const next = [
              ...contacts,
              { fullName: '', phone: '', relationship: '', email: '', notes: '' },
            ]
            setDraft({ ...draft, emergencyContacts: next })
          }}
        >
          Add contact
        </button>
      </div>
    )
  }

  return null
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <label className={styles.field}>
      <span className={styles.fieldLabel}>{label}</span>
      {children}
    </label>
  )
}

function formatAddress(a?: Address) {
  if (!a) return ''
  const parts = [
    a.street1,
    a.street2,
    [a.city, a.state].filter(Boolean).join(', '),
    a.postalCode,
    a.country,
  ].filter(Boolean)
  return parts.join(' • ')
}

async function cropToSquare(file: File): Promise<File> {
  const img = document.createElement('img')
  const url = URL.createObjectURL(file)

  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve()
    img.onerror = reject
    img.src = url
  })

  const size = Math.min(img.width, img.height)
  const sx = (img.width - size) / 2
  const sy = (img.height - size) / 2

  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 512

  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas not supported')

  ctx.drawImage(
    img,
    sx,
    sy,
    size,
    size,
    0,
    0,
    512,
    512,
  )

  return new Promise<File>((resolve) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) throw new Error('Image processing failed')

        resolve(
          new File([blob], file.name, {
            type: 'image/png',
          }),
        )
      },
      'image/png',
      0.95,
    )
  })
}


function phaseDescription(
  phase?: ProfileViewModel['pathwaysPhase'],
) {
  switch (phase) {
    case 'restore':
      return 'A season of healing, grounding, and re-centering your walk.'
    case 'root':
      return 'Building spiritual habits, biblical foundations, and identity.'
    case 'rise':
      return 'Stepping into purpose, service, and leadership development.'
    case 'release':
      return 'Living sent — mentoring others and walking in calling.'
    case 'alumni':
      return 'Continuing growth while supporting the Pathways community.'
    default:
      return 'Begin your Pathways formation journey.'
  }
}

function nextStepHint(
  phase?: ProfileViewModel['pathwaysPhase'],
) {
  switch (phase) {
    case 'restore':
      return 'Focus on consistency, reflection, and healing practices.'
    case 'root':
      return 'Engage deeply with teaching, prayer, and community.'
    case 'rise':
      return 'Step into service opportunities and leadership formation.'
    case 'release':
      return 'Mentor others and model discipleship in community.'
    default:
      return 'Connect with a leader to begin Pathways.'
  }
}
