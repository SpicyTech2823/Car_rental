import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../utils/supabase';

export default function AdminRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error || !user) {
          // No user, redirect to admin login
          navigate('/admin/login', { replace: true });
          return;
        }

        // User exists, check if they're in admins table
        const { data: adminData, error: adminError } = await supabase
          .from('admins')
          .select('id')
          .single();

        if (adminError || !adminData) {
          // Not an admin, redirect to not authorized
          navigate('/not-authorized', { replace: true });
          return;
        }

        // Is admin, redirect to dashboard
        navigate('/admin/dashboard', { replace: true });
      } catch (error) {
        console.error('Admin redirect check failed:', error);
        navigate('/admin/login', { replace: true });
      }
    };

    checkAdminAccess();
  }, [navigate]);

  // Show loading while checking
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-800 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
}