"use client";

import useSWR, { SWRConfiguration, SWRResponse } from "swr";

export type FetcherFn<T> = (key: string) => Promise<T>;

export interface UseFetchOptions<T> extends Omit<SWRConfiguration<T, Error>, "fetcher"> {
  enabled?: boolean;
  fallbackData?: T;
}

export function useFetch<T>(
  key: string | null,
  fetcher: FetcherFn<T>,
  options: UseFetchOptions<T> = {}
): SWRResponse<T, Error> {
  const { enabled = true, fallbackData, ...swrOptions } = options;

  const shouldFetch = enabled && key != null;

  return useSWR<T, Error>(shouldFetch ? key : null, fetcher, {
    ...swrOptions,
    fallbackData: shouldFetch && fallbackData !== undefined ? fallbackData : undefined,
  });
}

export function useFetchMultiple<T>(
  keys: (string | null)[],
  fetcher: FetcherFn<T>,
  options: UseFetchOptions<T> = {}
): (SWRResponse<T, Error> | null)[] {
  return keys.map((key) => useFetch(key, fetcher, options));
}

export interface FetchState<T> {
  data: T | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

export function useFetchState<T>(
  key: string | null,
  fetcher: FetcherFn<T>,
  options: UseFetchOptions<T> = {}
): FetchState<T> & { mutate: () => void } {
  const { data, error, isLoading, isValidating, mutate } = useFetch(key, fetcher, options);

  return {
    data,
    isLoading: isLoading && !data,
    isError: !!error,
    error: error ?? null,
    mutate,
  };
}