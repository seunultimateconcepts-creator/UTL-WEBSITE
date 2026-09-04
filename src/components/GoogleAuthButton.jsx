import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

function GoogleAuthButton() {
  const buttonRef = useRef(null)
  const navigate = useNavigate()

  const handleCredentialResponse = async (response) => {
    try {
      const res = await fetch(`${BASE_URL}/auth/oauth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: response.credential }),
      })
      const data = await res.json()

      if (!data.success) {
        console.error('Google sign-in failed:', data.message)
        return
      }

      localStorage.setItem('utl_token', data.token)
      localStorage.setItem('utl_current_user', JSON.stringify(data.user))

      // ✅ No more accountTypeConfirmed check / complete-profile
      // redirect — that belonged to the old account-type picker flow,
      // which doesn't exist anymore. Straight to the real destination.
      const redirect = localStorage.getItem('utl_redirect_after_login')
      localStorage.removeItem('utl_redirect_after_login')
      navigate(redirect || '/dashboard')
    } catch (err) {
      console.error('Google sign-in error:', err)
    }
  }

  useEffect(() => {
    const scriptId = 'google-identity-script'
    let script = document.getElementById(scriptId)

    const init = () => {
      if (!window.google || !buttonRef.current) return
      try {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
          use_fedcm_for_prompt: true,
        })
        window.google.accounts.id.renderButton(buttonRef.current, {
          theme: 'outline',
          size: 'large',
          width: '100%',
          text: 'continue_with',
        })
      } catch (err) {
        console.error('Google Sign-In button failed to initialize (non-fatal):', err)
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

  return <div ref={buttonRef} className="w-full flex justify-center" />
}

export default GoogleAuthButton