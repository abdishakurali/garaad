// Version: 1.0.5 (Internal: garaad-v6) — never intercept Next.js /_next/ assets (stale chunks break webpack after deploy)

const CACHE_VERSION = 'garaad-v6';
const STATIC_CACHE = `garaad-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `garaad-dynamic-${CACHE_VERSION}`;

// Assets to cache on install (minimal set)
// DO NOT cache '/' here as it can lead to stale landing pages
const STATIC_ASSETS = [
    '/manifest.json',
    '/logo.png',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    console.log('[SW] Installing Service Worker...');
    event.waitUntil(
        caches.open(STATIC_CACHE).then((cache) => {
            console.log('[SW] Caching static assets');
            return cache.addAll(STATIC_ASSETS);
        })
    );
    self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating Service Worker...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name.startsWith('garaad-') && name !== STATIC_CACHE && name !== DYNAMIC_CACHE)
                    .map((name) => {
                        console.log('[SW] Deleting old cache:', name);
                        return caches.delete(name);
                    })
            );
        })
    );
    return self.clients.claim();
});

// Fetch event - optimize for updates
self.addEventListener('fetch', (event) => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') return;

    const url = new URL(event.request.url);

    // Cross-origin: do not intercept. Stripe/CDN scripts must load in the page context;
    // SW fetch() here triggers CSP connect-src failures and breaks widgets.
    if (url.origin !== self.location.origin) {
        return;
    }

    // Skip API calls and WebSocket connections
    if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/ws/')) {
        return;
    }

    // Next.js build output (chunks, webpack runtime, RSC, images optimizer, etc.).
    // MUST NOT use cache-first here: after a new deploy, old cached chunks + new HTML
    // cause "Cannot read properties of undefined (reading 'call')" in webpack.
    if (url.pathname.startsWith('/_next/')) {
        return;
    }

    // Navigation requests (HTML) - Network First with no-store bypass
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request, { cache: 'no-store' })
                .then((response) => {
                    // Update dynamic cache with fresh HTML
                    const responseClone = response.clone();
                    caches.open(DYNAMIC_CACHE).then((cache) => {
                        cache.put(event.request, responseClone);
                    });
                    return response;
                })
                .catch(() => {
                    // Fallback to cache if offline
                    return caches.match(event.request);
                })
        );
        return;
    }

    // Static assets (Images, Fonts, Scripts) - Cache First with Network Fallback
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }

            return fetch(event.request).then((response) => {
                // Don't cache if not a valid response or if it's external (except Cloudinary)
                if (!response || response.status !== 200 || response.type === 'error') {
                    return response;
                }

                // Cache static assets dynamically
                const responseToCache = response.clone();
                caches.open(DYNAMIC_CACHE).then((cache) => {
                    cache.put(event.request, responseToCache);
                });

                return response;
            });
        })
    );
});

// Push event - handle incoming push notifications
self.addEventListener('push', (event) => {
    console.log('[SW] Push notification received');

    const fallback = {
        title: 'Garaad',
        body: 'Waxaa soo kordhay warar cusub!',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-192x192.png',
        url: '/community',
        type: 'community_update',
        notification_id: null,
        data: {},
    };

    let payload = { ...fallback };
    if (event.data) {
        try {
            const parsed = event.data.json();
            payload = {
                ...fallback,
                ...parsed,
                data: { ...(parsed?.data || {}) },
            };
        } catch (error) {
            console.error('[SW] Error parsing push data:', error);
        }
    }

    const options = {
        body: payload.body,
        icon: payload.icon,
        badge: payload.badge,
        vibrate: [200, 100, 200],
        tag: payload.type || 'garaad-notification',
        requireInteraction: false,
        data: {
            url: payload.url || '/community',
            notification_id: payload.notification_id || null,
            type: payload.type || 'community_update',
            ...payload.data,
        },
        actions: [
            {
                action: 'open',
                title: 'Fur',
                icon: '/icons/icon-192x192.png',
            },
            {
                action: 'close',
                title: 'Xir',
            },
        ],
    };

    event.waitUntil(
        self.registration.showNotification(payload.title || fallback.title, options)
    );
});

// Notification click event - handle user interaction
self.addEventListener('notificationclick', (event) => {
    console.log('[SW] Notification clicked');
    event.notification.close();

    const urlToOpen = event.notification.data?.url || '/community';
    const notificationId = event.notification.data?.notification_id || null;

    // Handle action buttons
    if (event.action === 'close') {
        return;
    }

    event.waitUntil(
        clients
            .matchAll({
                type: 'window',
                includeUncontrolled: true,
            })
            .then((clientList) => {
                // Check if there's already a window open
                for (let i = 0; i < clientList.length; i++) {
                    const client = clientList[i];
                    if (client.url.includes(urlToOpen) && 'focus' in client) {
                        if (notificationId) {
                            client.postMessage({
                                type: 'NOTIFICATION_CLICKED',
                                notification_id: notificationId,
                            });
                        }
                        return client.focus();
                    }
                }

                // If no window is open, open a new one
                if (clients.openWindow) {
                    return clients.openWindow(urlToOpen);
                }
            })
    );
});

// Background sync event (for future offline support)
self.addEventListener('sync', (event) => {
    console.log('[SW] Background sync:', event.tag);

    if (event.tag === 'sync-messages') {
        event.waitUntil(
            // Implement sync logic here
            Promise.resolve()
        );
    }
});

// Message event - handle messages from clients
self.addEventListener('message', (event) => {
    console.log('[SW] Message received:', event.data);

    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }

    if (event.data && event.data.type === 'CACHE_URLS') {
        event.waitUntil(
            caches.open(DYNAMIC_CACHE).then((cache) => {
                return cache.addAll(event.data.urls);
            })
        );
    }
});

// Push subscription change event (e.g. subscription refreshed)
self.addEventListener('pushsubscriptionchange', (event) => {
    console.log('[SW] Push subscription changed');

    event.waitUntil(
        self.registration.pushManager
            .subscribe(event.oldSubscription.options)
            .then((subscription) => {
                console.log('[SW] Resubscribed to push notifications');
                const keys = subscription.toJSON().keys || {};
                return fetch('/api/community/push-subscriptions/', {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        endpoint: subscription.endpoint,
                        p256dh_key: keys.p256dh || '',
                        auth_key: keys.auth || '',
                    }),
                });
            })
    );
});

console.log('[SW] Service Worker loaded');
