import { useState, useEffect, useRef } from 'react';
import { apiFetch } from '../lib/api';

export function useSearch() {
  const [query, setQuery] = useState('Curren$y');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const controllerRef = useRef(null);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setResults([]);
      setError('');
      return;
    }

    const timer = setTimeout(async () => {
      if (controllerRef.current) controllerRef.current.abort();
      controllerRef.current = new AbortController();
      setLoading(true);
      setError('');
      try {
        const payload = await apiFetch(`/api/search?q=${encodeURIComponent(trimmed)}`);
        setResults(payload.results || []);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setResults([]);
          setError(err.message || 'Search failed');
        }
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => {
      clearTimeout(timer);
      if (controllerRef.current) controllerRef.current.abort();
    };
  }, [query]);

  return { query, setQuery, results, loading, error };
}
