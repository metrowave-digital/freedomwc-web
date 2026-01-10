import { NextResponse } from 'next/server'
import {
  exchangeCodeForToken,
  fetchUserInfo,
} from '../../../lib/auth/auth0'
import { resolvePayloadUser } from '../../../lib/auth/resolveUser'
import { createSession } from '../../../lib/auth/session'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const { searchParams } = url
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.redirect(
      new URL('/login?error=missing_code', url.origin),
    )
  }

  const { idToken, accessToken } =
    await exchangeCodeForToken(code)

  /* ---------------------------------------------
     REQUIRED CLAIM VALIDATION
  --------------------------------------------- */

  const sub = idToken.sub
  if (!sub) {
    return NextResponse.redirect(
      new URL('/login?error=missing_subject', url.origin),
    )
  }

  // Prefer email from ID token
  let email = idToken.email

  // Fallback to /userinfo (Universal Login safe)
  if (!email) {
    const profile = await fetchUserInfo(accessToken)
    email = profile.email
  }

  if (!email) {
    return NextResponse.redirect(
      new URL('/login?error=email_required', url.origin),
    )
  }

  /* ---------------------------------------------
     Resolve canonical user in Payload
  --------------------------------------------- */

  console.log('FINAL AUTH0 IDENTITY', { sub, email })

  const user = await resolvePayloadUser({
    sub,
    email,
  })

  // ✅ Create redirect response FIRST, then attach cookie to it
  const res = NextResponse.redirect(
    new URL('/portal', url.origin),
  )

  createSession(res, user)

  return res
}
