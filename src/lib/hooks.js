import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { API_ENDPOINTS, ROUTES, TIMING } from '@/lib/constants';

/**
 * Custom hook for checking authentication and redirecting to login if needed
 * @param {string} redirectPath - Path to redirect to after login
 * @returns {object} { isAuthenticated, isChecking }
 */
export function useAuth(redirectPath = null) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.TOKEN_CHECK, {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          setIsAuthenticated(false);
          if (redirectPath) {
            setTimeout(() => {
              router.push(`${ROUTES.LOGIN}?redirect=${redirectPath}`);
            }, TIMING.redirectDelay);
          }
          return;
        }

        const data = await response.json();
        if (data.isAuthenticated) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          if (redirectPath) {
            setTimeout(() => {
              router.push(`${ROUTES.LOGIN}?redirect=${redirectPath}`);
            }, TIMING.redirectDelay);
          }
        }
      } catch (err) {
        console.error('Auth verification error:', err);
        setIsAuthenticated(false);
        if (redirectPath) {
          setTimeout(() => {
            router.push(`${ROUTES.LOGIN}?redirect=${redirectPath}`);
          }, TIMING.redirectDelay);
        }
      } finally {
        setIsChecking(false);
      }
    };

    verifyAuth();
  }, [router, redirectPath]);

  return { isAuthenticated, isChecking };
}

/**
 * Custom hook for checking user authentication without redirect
 * @returns {object} { isAuthenticated, isChecking }
 */
export function useAuthCheck() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.TOKEN_CHECK, {
          credentials: 'include',
        });
        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, []);

  return { isAuthenticated, isChecking };
}
