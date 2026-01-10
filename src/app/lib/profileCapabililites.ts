// lib/profileCapabilities.ts
export function canEditField(
  field: string,
  roles: string[] = [],
) {
  if (roles.includes('admin') || roles.includes('staff')) return true

  const memberEditable = [
    'bio',
    'testimony',
    'phone',
    'address',
    'preferredContactMethod',
    'doNotContact',
    'volunteerInterests',
    'spiritualGifts',
    'skills',
  ]

  return memberEditable.includes(field)
}
