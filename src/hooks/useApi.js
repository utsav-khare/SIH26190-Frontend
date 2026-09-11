import { useState, useCallback } from 'react';

/**
 * Reusable hook for API calls with built-in loading and error states.
 * Use this in any component that fetches data so UI can react to
 * loading / success / error / empty states consistently.
 *
 * @returns {Object} { data, loading, error, execute, reset }
 *
 * @example
 * const { data, loading, error, execute } = useApi();
 * useEffect(() => { execute(() => documentService.getDocuments()); }, []);
 */
export const useApi = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (asyncFn) => {
    setLoading(true);
    setError(null);
    try {
      const result = await asyncFn();
      setData(result);
      return result;
    } catch (err) {
      const message = err.message || 'An unexpected error occurred.';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setLoading(false);
    setError(null);
  }, []);

  return { data, loading, error, execute, reset };
};

/**
 * Hook to track authentication token presence.
 * Reads from localStorage — kept here so components don't touch
 * storage directly.
 */
export const useAuthToken = () => {
  const getToken = useCallback(() => localStorage.getItem('vault_token'), []);
  const hasToken = useCallback(() => !!localStorage.getItem('vault_token'), []);
  return { getToken, hasToken };
};
