/* eslint-disable react-hooks/immutability */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

/**
 * GoogleOneTap
 *
 * Mount ONCE near the root of the app (e.g. in App.jsx, outside <Routes>).
 * Shows Google's One Tap popup automatically for visitors who:
 *   - are not currently logged in (no utl_token in localStorage)
 *   - have a Google session active in their browser
 *
 * Uses the SAME backend endpoint as GoogleAuthButton.jsx (POST /api/auth/oauth/google)
 * since One Tap and the standard button both return a Google ID token/credential.
 *
 * Requires:
 *   - VITE_GOOGLE_CLIENT_ID set on the frontend (Vercel)
 */

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export default function GoogleOneTap() {
  const navigate = useNavigate();
  const scriptLoaded = useRef(false);

  useEffect(() => {
    // Skip entirely if already logged in
    const existingToken = localStorage.getItem("utl_token");
    if (existingToken) return;

    // Avoid loading the script twice (e.g. React StrictMode double-invoke)
    if (scriptLoaded.current) return;
    scriptLoaded.current = true;

    const initOneTap = () => {
      if (!window.google?.accounts?.id) return;

      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
        auto_select: false, // don't silently log people in without a click
        cancel_on_tap_outside: true,
      });

      window.google.accounts.id.prompt(); // triggers the One Tap popup
    };

    if (!document.getElementById("google-identity-sdk")) {
      const script = document.createElement("script");
      script.id = "google-identity-sdk";
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = initOneTap;
      document.body.appendChild(script);
    } else {
      initOneTap();
    }
  }, []);

  const handleCredentialResponse = async (response) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/oauth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: response.credential }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Google One Tap auth failed:", data.message || data.error);
        return;
      }

      localStorage.setItem("utl_token", data.token);
      localStorage.setItem("utl_current_user", JSON.stringify(data.user));

      if (data.isNewUser || !data.user.accountType) {
        navigate("/complete-profile");
      } else {
        // Soft redirect — don't yank users off a page they're actively reading
        const noRedirectPaths = ["/tech-hub"];
        if (!noRedirectPaths.some((p) => window.location.pathname.startsWith(p))) {
          navigate("/dashboard");
        }
      }
    } catch (err) {
      console.error("Error sending One Tap credential to backend:", err);
    }
  };

  return null; // renders nothing — the popup is injected by Google's script
}