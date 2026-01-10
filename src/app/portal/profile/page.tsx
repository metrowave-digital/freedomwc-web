// app/portal/profile/page.tsx

import styles from './Profile.module.css'
import ProfileClient from './profile-client'

import { getUser } from '../../../app/lib/auth/getUser'
import { getOrCreateMyProfile } from '../../../app/lib/profile'

import type {
  Profile,
  PayloadRelation,
  PayloadUpload,
} from '../../../app/lib/payload'

import type { UserIdentity } from '../../../app/lib/types/userIdentity'

/* =======================
   Local View Types
======================= */

type Address = {
  street1?: string
  street2?: string
  city?: string
  state?: string
  postalCode?: string
  country?: string
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

type Badge = {
  title?: string
  icon?: PayloadRelation<PayloadUpload>
  earnedDate?: string
}

/**
 * Final shape consumed by ProfileClient
 */
type ProfileViewModel = Profile & {
  address?: Address
  emergencyContacts?: EmergencyContact[]
  badges?: Badge[]

  /** Injected from Users */
  userIdentity: UserIdentity
}

/* =======================
   Page
======================= */

export default async function ProfilePage() {
  // 1️⃣ Resolve authenticated user (Users collection)
  const user = await getUser()
  if (!user) {
    throw new Error('Not authenticated')
  }

  // 2️⃣ Resolve or create Profile (Profiles collection)
  const profile = (await getOrCreateMyProfile()) as Profile

  // 3️⃣ Compose server-side view model
  const viewModel: ProfileViewModel = {
    ...profile,

    userIdentity: {
      firstName: user.firstName,
      lastName: user.lastName,
      dateOfBirth: user.dateOfBirth,
    },
  }

  // 4️⃣ Render
  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <h1>My Profile</h1>
        <p>
          Your personal information, formation journey, and household
          connections.
        </p>
      </header>

      <ProfileClient
        initialProfile={viewModel}
        roles={user.roles}
      />
    </section>
  )
}
