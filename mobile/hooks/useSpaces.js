import { useState, useCallback } from 'react';
import { apiFetch } from '../lib/api';

export function useSpaces() {
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const payload = await apiFetch('/api/spaces?query=music');
      setSpaces(payload.spaces || []);
    } catch (err) {
      setError(err.message || 'Failed to load Spaces');
    } finally {
      setLoading(false);
    }
  }, []);

  return { spaces, loading, error, refresh };
}
