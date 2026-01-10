import type { WebUser } from '../../access/roles'
import { hasRoleAtLeast } from '../../access/roles'

type ProfileLike = {
  id: string | number
  user?: string | number | null
}

/**
 * Throws if the user cannot edit this profile
 */
export function assertCanEditProfile(
  profile: ProfileLike,
  user: WebUser,
) {
  // Staff & Admin can edit anything
  if (hasRoleAtLeast(user, 'staff')) {
    return
  }

  // Profile must be owned by the user
  if (!profile.user) {
    throw new Error('Profile has no owner')
  }

  if (String(profile.user) !== String(user.id)) {
    throw new Error('Forbidden')
  }
}
