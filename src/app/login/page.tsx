'use client'

import { useEffect } from 'react'

export default function LoginPage() {
  useEffect(() => {
    window.location.href = '/api/auth/start-login'
  }, [])

  return null
}
