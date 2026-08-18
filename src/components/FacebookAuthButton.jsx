import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

/**
 * FacebookAuthButton
 *
 * Loads the Facebook JS SDK, triggers FB.login(), then sends the
 * resulting accessToken to the backend for verification.
 *
 * Usage: <FacebookAuthButton /> — renders full width by default.
 * Drop it inside a flex/grid wrapper (see Login.jsx / SignUp.jsx) to
 * size it alongside GoogleAuthButton. Do NOT wrap it in another
 * <button> — it already renders its own.
 *
 * Requires:
 *  - VITE_FACEBOOK_APP_ID set on the frontend (Vercel)
 *  - Backend route POST /api/auth/oauth/facebook (already written)
 */

const FACEBOOK_APP_ID = import.meta.env.VITE_FACEBOOK_APP_ID;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export default function FacebookAuthButton({ label = "Continue with Facebook", className = "" }) {
  const navigate = useNavigate();
  const sdkLoaded = useRef(false);

  useEffect(() => {
    if (sdkLoaded.current || window.FB) return;

    window.fbAsyncInit = function () {
      window.FB.init({
        appId: FACEBOOK_APP_ID,
        cookie: true,
        xfbml: false,
        version: "v20.0",
      });
      sdkLoaded.current = true;
    };

    if (!document.getElementById("facebook-jssdk")) {
      const script = document.createElement("script");
      script.id = "facebook-jssdk";
      script.src = "https://connect.facebook.net/en_US/sdk.js";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }
  }, []);

  const handleFacebookLogin = () => {
    if (!window.FB) {
      console.error("Facebook SDK not loaded yet — try again in a moment.");
      return;
    }

    window.FB.login(
      (response) => {
        if (response.authResponse && response.authResponse.accessToken) {
          sendTokenToBackend(response.authResponse.accessToken);
        } else {
          console.warn("Facebook login cancelled or not fully authorized.");
        }
      },
      { scope: "public_profile,email" }
    );
  };

  const sendTokenToBackend = async (accessToken) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/oauth/facebook`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Facebook auth failed:", data.message || data.error);
        return;
      }

      localStorage.setItem("utl_token", data.token);
      localStorage.setItem("utl_current_user", JSON.stringify(data.user));

      if (data.isNewUser || !data.user.accountType) {
        navigate("/complete-profile");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Error sending Facebook token to backend:", err);
    }
  };

  return (
    <button
      type="button"
      onClick={handleFacebookLogin}
      className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-white/10 bg-white text-[#0a0f2c] text-sm font-semibold hover:bg-gray-100 transition-colors whitespace-nowrap ${className}`}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2" xmlns="http://www.w3.org/2000/svg">
        <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.23.2 2.23.2v2.45h-1.26c-1.24 0-1.63.77-1.63 1.56v1.89h2.78l-.44 2.91h-2.34V22c4.78-.79 8.44-4.94 8.44-9.94Z" />
      </svg>
      {label}
    </button>
  );
}