// Garaad Service Worker for PWA and Push Notifications
// Version: 1.0.0

const CACHE_NAME = 'garaad-v1';
const STATIC_CACHE = 'garaad-static-v1';
const DYNAMIC_CACHE = 'garaad-dynamic-v1';

// Assets to cache on install
const STATIC_ASSETS = [
    '/',
    '/manifest.json',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',
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
                    .filter((name) => name !== STATIC_CACHE && name !== DYNAMIC_CACHE)
                    .map((name) => {
                        console.log('[SW] Deleting old cache:', name);
                        return caches.delete(name);
                    })
            );
        })
    );
    return self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') return;

    // Skip API calls and WebSocket connections
    if (
        event.request.url.includes('/api/') ||
        event.request.url.includes('/ws/')
    ) {
        return;
    }

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }

            return fetch(event.request).then((response) => {
                // Don't cache if not a valid response
                if (!response || response.status !== 200 || response.type === 'error') {
                    return response;
                }

                // Clone the response
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
