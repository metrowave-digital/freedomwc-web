import { cookies } from 'next/headers'
import type { NextResponse } from 'next/server'
import type { WebUser } from '../../../app/access/roles'

const SESSION_COOKIE = 'fwc_session'

/* ======================================================
   Create session (RESPONSE-BOUND)
====================================================== */

export function createSession(
  res: NextResponse,
  user: WebUser,
) {
  res.cookies.set({
    name: SESSION_COOKIE,
    value: JSON.stringify({ id: user.id }),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // 🔑 FIX
    sameSite: 'lax',
    path: '/',
  })
}

/* ======================================================
   Get session
====================================================== */

export async function getSession(): Promise<{ id: string } | null> {
  const cookieStore = await cookies()
  const raw = cookieStore.get(SESSION_COOKIE)?.value
  if (!raw) return null

  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

/* ======================================================
   Clear session
====================================================== */

export function clearSession(res: NextResponse) {
  res.cookies.delete(SESSION_COOKIE)
}
