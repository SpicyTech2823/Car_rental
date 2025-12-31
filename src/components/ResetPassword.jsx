import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [hasValidSession, setHasValidSession] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    const handlePasswordReset = async () => {
      try {
        // Check for hash parameters (access_token, refresh_token, type)
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const type = hashParams.get('type');

        if (accessToken && refreshToken && type === 'recovery') {
          // Set the session with the tokens from the URL
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });

          if (error) {
            console.error('Error setting session:', error);
            setError('Invalid or expired reset link.');
            setSessionLoading(false);
            return;
          }

          // Clear the hash from URL
          window.history.replaceState(null, null, window.location.pathname);
        }

        // Check current session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mounted) return;

        if (error) {
          console.error('Session error:', error);
          setError('Invalid or expired reset link.');
          setSessionLoading(false);
          return;
        }

        if (session) {
          setHasValidSession(true);
        } else {
          setError('No valid session found. Please use the link from your email.');
        }
      } catch (err) {
        console.error('Error in password reset:', err);
        setError('An error occurred. Please try again.');
      } finally {
        if (mounted) {
          setSessionLoading(false);
        }
      }
    };

    handlePasswordReset();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      if (event === 'PASSWORD_RECOVERY' && session) {
        setHasValidSession(true);
        setError('');
        setSessionLoading(false);
      } else if (event === 'SIGNED_OUT') {
        setHasValidSession(false);
        setError('Session expired. Please request a new password reset.');
        setSessionLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  if (sessionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-800 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!hasValidSession && !success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 p-8 bg-gray-50 rounded-lg shadow-md border border-gray-200">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-800">Invalid Reset Link</h2>
            <p className="mt-4 text-gray-600">{error || 'This password reset link is invalid or has expired.'}</p>
            <button
              onClick={() => navigate('/login')}
              className="mt-6 bg-red-800 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

      setSuccess(true);
      // Sign out after password reset
      await supabase.auth.signOut();
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 p-8 bg-gray-50 rounded-lg shadow-md border border-gray-200">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-green-600">Password Reset Successful!</h2>
            <p className="mt-4 text-gray-600">Your password has been updated. You will be redirected to login shortly.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 p-8 bg-gray-50 rounded-lg shadow-md border border-gray-200">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-red-800">
            Reset Your Password
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm/6 font-medium text-red-900">
                New Password
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base border-2 border-red-900 outline-1 -outline-offset-1 outline-white/10 placeholder:text-red-500 focus:outline-2 focus:-outline-offset-2 focus:outline-red-900 sm:text-sm/6"
                  placeholder="Enter new password"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm/6 font-medium text-red-900">
                Confirm New Password
              </label>
              <div className="mt-2">
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base border-2 border-red-900 outline-1 -outline-offset-1 outline-white/10 placeholder:text-red-500 focus:outline-2 focus:-outline-offset-2 focus:outline-red-900 sm:text-sm/6"
                  placeholder="Confirm new password"
                />
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center rounded-md bg-red-900 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-red-800 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm/6 text-gray-400">
            Remember your password?
            <a
              href="#"
              className="font-semibold text-indigo-400 hover:text-indigo-300 cursor-pointer ml-1"
              onClick={() => navigate('/login')}
            >
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}