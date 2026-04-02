"use client";

import { useEffect, useState } from "react";

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);
  const [ready, setReady] = useState(false);

  /* eslint-disable react-hooks/set-state-in-effect -- media query state updates */
  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };
    media.addEventListener("change", listener);
    setReady(true);
    return () => media.removeEventListener("change", listener);
  }, [query, matches]);
  /* eslint-enable react-hooks/set-state-in-effect */

  return { matches, isMobile: ready && matches };
}

export function useIsMobile(breakpoint = 768) {
  return useMediaQuery(`(max-width: ${breakpoint - 1}px)`);
}

export function useIsTablet(breakpoint = 1024) {
  return useMediaQuery(`(max-width: ${breakpoint - 1}px) and (min-width: 768px)`);
}

export function usePrefersDark() {
  return useMediaQuery("(prefers-color-scheme: dark)");
}