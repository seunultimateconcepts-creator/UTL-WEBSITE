import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * GoogleOneTap
 *
 * Mount ONCE near the root of the app (e.g. in App.jsx, inside the
 * router but outside <Routes>). Shows Google's One Tap popup automatically
 * for visitors who:
 *   - are not currently logged in (no utl_token in localStorage)
 *   - have a Google session active in their browser
 *
 * Uses the SAME endpoint, payload shape, and response contract as
 * GoogleAuthButton.jsx (POST {BASE_URL}/auth/oauth/google, { credential }).
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

function GoogleOneTap() {
  const navigate = useNavigate()
  const initialized = useRef(false)

  const handleCredentialResponse = async (response) => {
    try {
      const res = await fetch(`${BASE_URL}/auth/oauth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: response.credential }),
      })
      const data = await res.json()

      if (!data.success) {
        console.error('Google One Tap sign-in failed:', data.message)
        return
      }

      localStorage.setItem('utl_token', data.token)
      localStorage.setItem('utl_current_user', JSON.stringify(data.user))

      if (!data.user.accountTypeConfirmed) {
        navigate('/complete-profile')
        return
      }

      // Don't yank someone off a page they're actively using —
      // e.g. mid-task on Tech Hub — just let the token silently attach.
      const noRedirectPaths = ['/tech-hub']
      if (noRedirectPaths.some((p) => window.location.pathname.startsWith(p))) {
        return
      }

      const redirect = localStorage.getItem('utl_redirect_after_login')
      localStorage.removeItem('utl_redirect_after_login')
      navigate(redirect || '/dashboard')
    } catch (err) {
      console.error('Google One Tap error:', err)
    }
  }

  useEffect(() => {
    // Skip entirely if already logged in
    if (localStorage.getItem('utl_token')) return

    if (initialized.current) return
    initialized.current = true

    const scriptId = 'google-identity-script'
    let script = document.getElementById(scriptId)

    const init = () => {
      if (!window.google) return
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
        auto_select: false,        // require a tap — never log in silently
        cancel_on_tap_outside: true,
        use_fedcm_for_prompt: true,
      })
      window.google.accounts.id.prompt() // triggers the One Tap popup
    }

    if (!script) {
      script = document.createElement('script')
      script.id = scriptId
      script.src = 'https://accounts.google.com/gsi/client'
      script.async = true
      script.defer = true
      script.onload = init
      document.body.appendChild(script)
    } else {
      init()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null // renders nothing — the popup is injected by Google's script
}

export default GoogleOneTap