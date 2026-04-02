"use client";

import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";

type Listener<T> = (value: T) => void;

export interface AsyncState<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
}

class AsyncStore<T> {
  private subscribers = new Set<Listener<T>>();
  private _current: T;

  constructor(initial: T) {
    this._current = initial;
  }

  get current() {
    return this._current;
  }

  subscribe(listener: Listener<T>) {
    this.subscribers.add(listener);
    return () => this.subscribers.delete(listener);
  }

  set(value: T) {
    this._current = value;
    this.subscribers.forEach((fn) => fn(value));
  }
}

function useStoreSelector<T>(store: AsyncStore<T>) {
  return useSyncExternalStore(store.subscribe.bind(store), () => store.current);
}

export function useAsyncState<T>(initial: AsyncState<T>) {
  const store = useRef(new AsyncStore(initial)).current;
  const state = useStoreSelector(store);

  const setData = useCallback(
    (data: T) => {
      store.set({ data, isLoading: false, error: null });
    },
    [store]
  );

  const setLoading = useCallback(() => {
    store.set({ ...store.current, isLoading: true, error: null });
  }, [store]);

  const setError = useCallback(
    (error: Error) => {
      store.set({ data: null, isLoading: false, error });
    },
    [store]
  );

  return { state, setData, setLoading, setError };
}

export function useAsyncEffect<T>(
  fetcher: () => Promise<T>,
  deps: React.DependencyList = []
): AsyncState<T> {
  const { state, setData, setLoading, setError } = useAsyncState<T>({
    data: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;
    setLoading();
    fetcher()
      .then((data) => {
        if (!cancelled) setData(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err : new Error(String(err)));
      });
    return () => {
      cancelled = true;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}