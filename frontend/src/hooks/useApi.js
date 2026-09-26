import { useState, useEffect, useCallback } from 'react';

/**
 * Hook genérico para llamadas asíncronas a la API.
 * @param {Function} asyncFn - Función que retorna una Promise
 * @param {boolean} immediate - Si debe ejecutarse al montar el componente
 */
export const useApi = (asyncFn, immediate = true) => {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error,   setError]   = useState(null);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await asyncFn(...args);
      setData(result.data ?? result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [asyncFn]);

  useEffect(() => {
    if (immediate) execute();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { data, loading, error, execute };
};
