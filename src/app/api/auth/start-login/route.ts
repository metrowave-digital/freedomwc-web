// src/app/api/auth/start-login/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.AUTH0_CLIENT_ID!,
    redirect_uri: process.env.AUTH0_REDIRECT_URI!,
    scope: 'openid profile email',
  })

  return NextResponse.redirect(
    `https://${process.env.AUTH0_DOMAIN}/authorize?${params}`,
  )
}
