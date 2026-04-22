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

  if (!clientId) {
    return (
      <div className={`relative w-full ${className ?? ""}`}>
        <button
          type="button"
          disabled={disabled}
          className="flex h-11 w-full items-center justify-center gap-3 rounded-xl border border-border bg-white px-4 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          onClick={() => {/* no client id configured */}}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
            <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
            <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
            <path fill="#FBBC05" d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"/>
            <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z"/>
          </svg>
          Sii wad Google
        </button>
      </div>
    );
  }

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
