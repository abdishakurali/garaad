"use client";

import { useEffect, useRef } from "react";

const GOOGLE_SRC = "https://accounts.google.com/gsi/client";

let gsiLoading: Promise<void> | null = null;

function loadGsi(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.google?.accounts?.id) return Promise.resolve();
  if (gsiLoading) return gsiLoading;
  gsiLoading = new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = GOOGLE_SRC;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Google script failed"));
    document.head.appendChild(s);
  });
  return gsiLoading;
}

declare global {
  interface Window {
    __garaadGoogleOnCredential?: (credential: string) => void | Promise<void>;
    __garaadGoogleInitializedForClientId?: string;
    google?: {
      accounts: {
        id: {
          initialize: (opts: {
            client_id: string;
            callback: (res: { credential?: string }) => void;
          }) => void;
          renderButton: (
            el: HTMLElement,
            opts: {
              type?: string;
              theme?: string;
              size?: string;
              text?: string;
              width?: number;
              locale?: string;
            }
          ) => void;
        };
      };
    };
  }
}

export function GoogleSignInButton({
  onCredential,
  disabled,
  className,
}: {
  onCredential: (credential: string) => void | Promise<void>;
  disabled?: boolean;
  className?: string;
}) {
  const divRef = useRef<HTMLDivElement>(null);
  const onCredRef = useRef(onCredential);
  onCredRef.current = onCredential;

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.trim();

  useEffect(() => {
    if (!clientId || !divRef.current || disabled) return;
    const el = divRef.current;
    let cancelled = false;
    window.__garaadGoogleOnCredential = (credential: string) => onCredRef.current(credential);

    loadGsi()
      .then(() => {
        if (cancelled || !el || !window.google?.accounts?.id) return;
        el.innerHTML = "";
        if (window.__garaadGoogleInitializedForClientId !== clientId) {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: (res: { credential?: string }) => {
              if (res.credential) {
                void window.__garaadGoogleOnCredential?.(res.credential);
              }
            },
          });
          window.__garaadGoogleInitializedForClientId = clientId;
        }
        window.google.accounts.id.renderButton(el, {
          type: "standard",
          theme: "outline",
          size: "large",
          text: "continue_with",
          width: Math.min(400, Math.max(280, el.offsetWidth || 320)),
          locale: "so",
        });
      })
      .catch(() => {
        /* ignore */
      });

    return () => {
      cancelled = true;
      el.innerHTML = "";
    };
  }, [clientId, disabled]);

  if (!clientId) return null;

  return (
    <div className={`relative w-full ${className ?? ""}`}>
      <div
        ref={divRef}
        className="flex min-h-[44px] w-full justify-center [&>div]:!w-full"
      />
      {disabled ? (
        <div
          className="absolute inset-0 cursor-not-allowed rounded-lg bg-background/40"
          aria-hidden
        />
      ) : null}
    </div>
  );
}
