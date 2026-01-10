import { NextResponse } from 'next/server'
import { clearSession } from '../../../lib/auth/session'

export async function POST() {
  // Redirect to home page
  const res = NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'))

  // Clear the session cookie on the SAME response
  clearSession(res)

  return res
}
