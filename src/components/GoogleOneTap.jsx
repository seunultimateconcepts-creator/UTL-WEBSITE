import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { handleGoogleCredential } from '../utils/handleGoogleCredential'

/**
 * GoogleOneTap
 *
 * Mount ONCE near the root of the app (e.g. in App.jsx, inside the
 * router but outside <Routes>). Shows Google's One Tap popup automatically
 * for visitors who:
 *   - are not currently logged in (no utl_token in localStorage)
 *   - have a Google session active in their browser
 *
 * Uses the shared handleGoogleCredential — see that file for why this
 * matters: GoogleAuthButton.jsx uses the exact same function, so it no
 * longer matters which component's initialize() call Google's SDK
 * treats as "active."
 */

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

function GoogleOneTap() {
  const navigate = useNavigate()
  const initialized = useRef(false)

  useEffect(() => {
    // Skip entirely if already logged in
    if (localStorage.getItem('utl_token')) return

    if (initialized.current) return
    initialized.current = true

    // ✅ Skip entirely on pages that already render their own explicit
    // Google button — GoogleAuthButton.jsx on /login, /signup, and the
    // admin key screens. A Google sign-in prompt is meaningless on
    // /admin regardless of any bug, and running both on the same page
    // means duplicate initialize() calls.
    const skipEntirely = ['/login', '/signup', '/admin']
    if (skipEntirely.some((p) => window.location.pathname.startsWith(p))) return

    const scriptId = 'google-identity-script'
    let script = document.getElementById(scriptId)

    const init = () => {
      if (!window.google) return
      // ✅ Defense in depth — a third-party script failing (FedCM
      // NetworkError, an ad blocker, a future Google API change)
      // should never be able to crash the whole React app.
      try {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: (response) => handleGoogleCredential(response, navigate),
          auto_select: false,        // require a tap — never log in silently
          cancel_on_tap_outside: true,
          use_fedcm_for_prompt: true,
        })
        window.google.accounts.id.prompt() // triggers the One Tap popup
      } catch (err) {
        console.error('Google One Tap failed to initialize (non-fatal):', err)
      }
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