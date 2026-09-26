import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * Hook para manejar el formulario de login/registro
 */
export const useAuthForm = () => {
  const { login }         = useAuth();
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const handleLogin = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      await login(credentials);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { handleLogin, loading, error };
};
