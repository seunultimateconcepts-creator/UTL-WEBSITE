/**
 * handleGoogleCredential.js
 *
 * ✅ Shared by GoogleOneTap.jsx AND GoogleAuthButton.jsx — both call
 * window.google.accounts.id.initialize() independently, and Google's
 * SDK only keeps ONE active callback at a time. If GoogleOneTap
 * initializes first (e.g. on the homepage) and GoogleAuthButton
 * initializes later (reaching /login via client-side navigation,
 * not a fresh page load), whichever callback is actually active when
 * the credential comes back is unpredictable — this was very likely
 * why "verification completes but doesn't proceed to page" happened.
 *
 * The fix: both components use THIS exact function as their callback.
 * It no longer matters which one's initialize() call is "active" —
 * either way, the same correct thing happens.
 *
 * `onError` (optional) — if the backend rejects the sign-in (e.g. a
 * brand-new Google account isn't on the OAuth consent screen's test-
 * user list while the app is still in "Testing" publishing status),
 * this used to just console.error and silently do nothing — which
 * looks exactly like the page "stalling" to whoever's testing it, with
 * no visible feedback at all. Callers that render visible UI (like
 * GoogleAuthButton) should pass a setter to actually show the message.
 */
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export async function handleGoogleCredential(response, navigate, onError) {
  try {
    const res = await fetch(`${BASE_URL}/auth/oauth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credential: response.credential }),
    })
    const data = await res.json()

    if (!data.success) {
      console.error('Google sign-in failed:', data.message)
      if (onError) onError(data.message || 'Google sign-in failed. Please try again.')
      return
    }

    localStorage.setItem('utl_token', data.token)
    localStorage.setItem('utl_current_user', JSON.stringify(data.user))

    // Don't yank someone off a page they're actively using — e.g.
    // mid-task on Tech Hub — just let the token silently attach.
    const noRedirectPaths = ['/tech-hub']
    if (noRedirectPaths.some((p) => window.location.pathname.startsWith(p))) {
      return
    }

    const redirect = localStorage.getItem('utl_redirect_after_login')
    localStorage.removeItem('utl_redirect_after_login')
    navigate(redirect || '/dashboard')
  } catch (err) {
    console.error('Google sign-in error:', err)
    if (onError) onError('Something went wrong signing in with Google. Please try again.')
  }
}