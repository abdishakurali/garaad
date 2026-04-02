"use client";

import { useEffect, useRef, useState } from "react";

export interface UseStickyOptions {
  offset?: number;
  threshold?: number;
}

export function useSticky(options: UseStickyOptions = {}) {
  const { offset = 0, threshold = 0 } = options;
  const elementRef = useRef<HTMLDivElement>(null);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const scrolledPast = entry.boundingClientRect.top < offset;
        const crossesThreshold = Math.abs(entry.boundingClientRect.top) > threshold;
        setIsSticky(scrolledPast && crossesThreshold);
      },
      { threshold: [0, 1] }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [offset, threshold]);

  return { elementRef, isSticky };
}

export function useScrollPosition() {
  const [scrollY, setScrollY] = useState(0);
  const [direction, setDirection] = useState<"up" | "down">("up");
  const lastY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setDirection(y > lastY.current ? "down" : "up");
      lastY.current = y;
      setScrollY(y);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return { scrollY, direction };
}

export function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = docHeight > 0 ? window.scrollY / docHeight : 0;
      setProgress(Math.min(1, Math.max(0, scrolled)));
    };

    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);

  return progress;
}