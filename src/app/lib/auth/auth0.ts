// src/app/lib/auth/auth0.ts

/* ======================================================
   Environment
====================================================== */

const domain = process.env.AUTH0_DOMAIN
const clientId = process.env.AUTH0_CLIENT_ID
const clientSecret = process.env.AUTH0_CLIENT_SECRET
const redirectUri = process.env.AUTH0_REDIRECT_URI

if (!domain || !clientId || !clientSecret || !redirectUri) {
  throw new Error(
    'Missing one or more required Auth0 environment variables',
  )
}

/* ======================================================
   Types
====================================================== */

type TokenResponse = {
  access_token: string
  id_token: string
  token_type: string
  expires_in: number
}

export type Auth0IDToken = {
  sub: string
  email?: string
}

/* ======================================================
   Helpers
====================================================== */

/**
 * Decode JWT payload WITHOUT verification.
 * Safe because Auth0 already verified it.
 */
function decodeJWT(token: string): Auth0IDToken {
  const [, payload] = token.split('.')
  if (!payload) {
    throw new Error('Invalid ID token')
  }

  return JSON.parse(
    Buffer.from(payload, 'base64').toString('utf-8'),
  )
}

/* ======================================================
   Public API
====================================================== */

/**
 * Exchange authorization code for tokens
 */
export async function exchangeCodeForToken(
  code: string,
): Promise<{
  idToken: Auth0IDToken
  accessToken: string
}> {
  const res = await fetch(
    `https://${domain}/oauth/token`,
    {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        code,
      }),
    },
  )

  if (!res.ok) {
    const text = await res.text()
    throw new Error(
      `Auth0 token exchange failed: ${text}`,
    )
  }

  const data = (await res.json()) as TokenResponse

  return {
    idToken: decodeJWT(data.id_token),
    accessToken: data.access_token,
  }
}

/**
 * Fetch full user profile from Auth0 (/userinfo)
 * Used when email is missing from ID token
 */
export async function fetchUserInfo(
  accessToken: string,
): Promise<{ sub: string; email?: string }> {
  const res = await fetch(
    `https://${domain}/userinfo`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  )

  if (!res.ok) {
    const text = await res.text()
    throw new Error(
      `Auth0 userinfo failed: ${text}`,
    )
  }

  return res.json()
}
