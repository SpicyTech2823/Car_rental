import { useState } from "react";
import { supabase } from "../../utils/supabase";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [lastAttempt, setLastAttempt] = useState(0);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setMessage("");

    // Basic rate limiting (prevent spam)
    const now = Date.now();
    if (now - lastAttempt < 30000) { // 30 seconds cooldown
      setMessage("Please wait 30 seconds before requesting another login link.");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setLastAttempt(now);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim().toLowerCase(), // Normalize email
        options: {
          emailRedirectTo: `${window.location.origin}/admin/dashboard`
        }
      });

      if (error) {
        setMessage("Failed to send login link. Please try again.");
        console.error('OTP send error:', error);
      } else {
        setMessage("Admin login link sent! Check your email.");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
      console.error('OTP send failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray py-12 px-4 sm:px-6 lg:px-8 mt-6">
      <div className="w-full max-w-md space-y-8 p-8 bg-gray-50 rounded-lg shadow-md border border-gray-200">
        <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-red-800">
              Admin Login
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Enter your admin email to receive a secure login link.
            </p>
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form onSubmit={handleSendOtp} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm/6 font-medium text-red-900"
                >
                  Admin Email Address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    type="email"
                    name="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base border-2 border-red-900 outline-1 -outline-offset-1 outline-white/10 placeholder:text-red-500 focus:outline-2 focus:-outline-offset-2 focus:outline-red-900 sm:text-sm/6"
                    placeholder="admin@example.com"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full justify-center rounded-md bg-red-900 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-red-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-900 disabled:opacity-50"
                >
                  {loading ? "Sending..." : "Send Admin Login Link"}
                </button>
              </div>
            </form>

            {message && (
              <div className="mt-4 p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded">
                {message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}