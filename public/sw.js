// Version: 1.0.2 (Internal: garaad-v3)

const CACHE_VERSION = 'garaad-v3';
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

    // Skip API calls and WebSocket connections
    if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/ws/')) {
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

    let notificationData = {
        title: 'Garaad',
        body: 'Waxaa soo kordhay warar cusub!',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-192x192.png',
        url: '/community',
    };

    // Parse the push data if available
    if (event.data) {
        try {
            const data = event.data.json();
            notificationData = {
                title: data.title || notificationData.title,
                body: data.body || notificationData.body,
                icon: data.icon || notificationData.icon,
                badge: data.badge || notificationData.badge,
                url: data.url || notificationData.url,
                data: data.data || {},
            };
        } catch (error) {
            console.error('[SW] Error parsing push data:', error);
        }
    }

    const options = {
        body: notificationData.body,
        icon: notificationData.icon,
        badge: notificationData.badge,
        vibrate: [200, 100, 200],
        tag: 'garaad-notification',
        requireInteraction: false,
        data: {
            url: notificationData.url,
            ...notificationData.data,
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
        self.registration.showNotification(notificationData.title, options)
    );
});

// Notification click event - handle user interaction
self.addEventListener('notificationclick', (event) => {
    console.log('[SW] Notification clicked');
    event.notification.close();

    const urlToOpen = event.notification.data?.url || '/community';

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

// Push subscription change event
self.addEventListener('pushsubscriptionchange', (event) => {
    console.log('[SW] Push subscription changed');

    event.waitUntil(
        self.registration.pushManager
            .subscribe(event.oldSubscription.options)
            .then((subscription) => {
                console.log('[SW] Resubscribed to push notifications');
                // Send new subscription to backend
                return fetch('/api/community/push-subscriptions/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        endpoint: subscription.endpoint,
                        p256dh_key: subscription.toJSON().keys.p256dh,
                        auth_key: subscription.toJSON().keys.auth,
                    }),
                });
            })
    );
});

console.log('[SW] Service Worker loaded');
