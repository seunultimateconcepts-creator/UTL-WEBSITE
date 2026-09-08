import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertCircle } from 'lucide-react'
import { handleGoogleCredential } from '../utils/handleGoogleCredential'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

function GoogleAuthButton() {
  const buttonRef = useRef(null)
  const navigate = useNavigate()
  const [error, setError] = useState('')

  useEffect(() => {
    const scriptId = 'google-identity-script'
    let script = document.getElementById(scriptId)

    const init = () => {
      if (!window.google || !buttonRef.current) return
      try {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: (response) => {
            setError('')
            handleGoogleCredential(response, navigate, setError)
          },
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

  return (
    <div>
      <div ref={buttonRef} className="w-full flex justify-center" />
      {error && (
        <div className="flex items-center gap-1.5 mt-2 text-red-600 text-xs">
          <AlertCircle size={13} className="flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}

export default GoogleAuthButton