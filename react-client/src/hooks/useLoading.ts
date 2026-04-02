import { useState, useEffect } from 'react';

export function useLoading() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      setLoading((e as CustomEvent).detail);
    };
    window.addEventListener('loadingChange', handler);
    return () => window.removeEventListener('loadingChange', handler);
  }, []);

  return loading;
}