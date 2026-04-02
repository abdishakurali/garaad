"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function useLocalStorage<T>(key: string, initial: T) {
  const [stored, setStored] = useState<T | null>(null);
  const [ready, setReady] = useState(false);

  /* eslint-disable react-hooks/set-state-in-effect -- read from localStorage on mount */
  useEffect(() => {
    try {
      const item = localStorage.getItem(key);
      setStored(item ? JSON.parse(item) : initial);
    } catch {
      setStored(initial);
    }
    setReady(true);
  }, [key, initial]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        setStored((prev) => {
          const resolved = value instanceof Function ? value(prev ?? initial) : value;
          localStorage.setItem(key, JSON.stringify(resolved));
          return resolved;
        });
      } catch {
        /* ignore */
      }
    },
    [key, initial]
  );

  const remove = useCallback(() => {
    try {
      localStorage.removeItem(key);
      setStored(initial);
    } catch {
      /* ignore */
    }
  }, [key, initial]);

  return { value: stored ?? initial, setValue, remove, ready };
}

export function useSessionStorage<T>(key: string, initial: T) {
  const [stored, setStored] = useState<T | null>(null);
  const [ready, setReady] = useState(false);

  /* eslint-disable react-hooks/set-state-in-effect -- read from sessionStorage on mount */
  useEffect(() => {
    try {
      const item = sessionStorage.getItem(key);
      setStored(item ? JSON.parse(item) : initial);
    } catch {
      setStored(initial);
    }
    setReady(true);
  }, [key, initial]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        setStored((prev) => {
          const resolved = value instanceof Function ? value(prev ?? initial) : value;
          sessionStorage.setItem(key, JSON.stringify(resolved));
          return resolved;
        });
      } catch {
        /* ignore */
      }
    },
    [key, initial]
  );

  const remove = useCallback(() => {
    try {
      sessionStorage.removeItem(key);
      setStored(initial);
    } catch {
      /* ignore */
    }
  }, [key, initial]);

  return { value: stored ?? initial, setValue, remove, ready };
}

export function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

export function useThrottle<T>(value: T, interval: number): T {
  const [throttled, setThrottled] = useState(value);
  const lastUpdated = useRef(Date.now());

  useEffect(() => {
    const now = Date.now();
    if (now >= lastUpdated.current + interval) {
      lastUpdated.current = now;
      setThrottled(value);
    } else {
      const timer = setTimeout(() => {
        lastUpdated.current = Date.now();
        setThrottled(value);
      }, interval - (now - lastUpdated.current));
      return () => clearTimeout(timer);
    }
  }, [value, interval]);

  return throttled;
}