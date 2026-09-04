import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { handleGoogleCredential } from '../utils/handleGoogleCredential'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

function GoogleAuthButton() {
  const buttonRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const scriptId = 'google-identity-script'
    let script = document.getElementById(scriptId)

    const init = () => {
      if (!window.google || !buttonRef.current) return
      try {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: (response) => handleGoogleCredential(response, navigate),
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