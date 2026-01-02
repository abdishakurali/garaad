/**
 * Push Notification Service
 * 
 * Handles PWA push notification registration and management.
 * Uses the Web Push API to subscribe users to push notifications.
 */

import AuthService from './auth';
import { API_BASE_URL } from '@/lib/constants';

const BASE_URL = `${API_BASE_URL}/api/community`;

// VAPID public key - this should match the backend VAPID key
// In production, this should be loaded from environment variables
const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '';

/**
 * Check if push notifications are supported in the current browser
 */
export const isPushSupported = (): boolean => {
    return (
        'serviceWorker' in navigator &&
        'PushManager' in window &&
        'Notification' in window
    );
};

/**
 * Check current notification permission status
 */
export const getNotificationPermission = (): NotificationPermission => {
    if (!('Notification' in window)) {
        return 'denied';
    }
    return Notification.permission;
};

/**
 * Request notification permission from the user
 */
export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
    if (!('Notification' in window)) {
        console.warn('Notifications not supported');
        return 'denied';
    }

    try {
        const permission = await Notification.requestPermission();
        return permission;
    } catch (error) {
        console.error('Error requesting notification permission:', error);
        return 'denied';
    }
};

/**
 * Convert VAPID key from base64 to Uint8Array
 */
const urlBase64ToUint8Array = (base64String: string): Uint8Array => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
};

/**
 * Subscribe to push notifications
 * Registers a service worker and creates a push subscription
 */
export const subscribeToPushNotifications = async (): Promise<boolean> => {
    if (!isPushSupported()) {
        console.warn('Push notifications not supported');
        return false;
    }

    try {
        // Request permission first
        const permission = await requestNotificationPermission();
        if (permission !== 'granted') {
            console.log('Notification permission not granted');
            return false;
        }

        // Register service worker if not already registered
        let registration = await navigator.serviceWorker.getRegistration();
        if (!registration) {
            registration = await navigator.serviceWorker.register('/sw.js');
            console.log('Service Worker registered');
        }

        // Wait for service worker to be ready
        await navigator.serviceWorker.ready;

        // Check if already subscribed
        let subscription = await registration.pushManager.getSubscription();

        if (!subscription) {
            // Subscribe to push notifications
            if (!VAPID_PUBLIC_KEY) {
                console.error('VAPID public key not configured');
                return false;
            }

            subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY) as any,
            });

            console.log('Push subscription created');
        }

        // Send subscription to backend
        const authService = AuthService.getInstance();
        const token = authService.getToken();

        if (!token) {
            console.error('User not authenticated');
            return false;
        }

        const subscriptionJson = subscription.toJSON();

        const response = await fetch(`${BASE_URL}/push-subscriptions/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                endpoint: subscriptionJson.endpoint,
                p256dh_key: subscriptionJson.keys?.p256dh || '',
                auth_key: subscriptionJson.keys?.auth || '',
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to save push subscription');
        }

        console.log('Push subscription saved to backend');
        return true;
    } catch (error) {
        console.error('Error subscribing to push notifications:', error);
        return false;
    }
};

/**
 * Unsubscribe from push notifications
 */
export const unsubscribeFromPushNotifications = async (): Promise<boolean> => {
    if (!isPushSupported()) {
        return false;
    }

    try {
        const registration = await navigator.serviceWorker.getRegistration();
        if (!registration) {
            return false;
        }

        const subscription = await registration.pushManager.getSubscription();
        if (!subscription) {
            return false;
        }

        // Unsubscribe from push manager
        await subscription.unsubscribe();

        // Remove from backend
        const authService = AuthService.getInstance();
        const token = authService.getToken();

        if (token) {
            const subscriptionJson = subscription.toJSON();
            await fetch(`${BASE_URL}/push-subscriptions/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    endpoint: subscriptionJson.endpoint,
                }),
            });
        }

        console.log('Unsubscribed from push notifications');
        return true;
    } catch (error) {
        console.error('Error unsubscribing from push notifications:', error);
        return false;
    }
};

/**
 * Check if user is currently subscribed to push notifications
 */
export const isSubscribedToPush = async (): Promise<boolean> => {
    if (!isPushSupported()) {
        return false;
    }

    try {
        const registration = await navigator.serviceWorker.getRegistration();
        if (!registration) {
            return false;
        }

        const subscription = await registration.pushManager.getSubscription();
        return subscription !== null;
    } catch (error) {
        console.error('Error checking push subscription:', error);
        return false;
    }
};

const pushNotificationService = {
    isPushSupported,
    getNotificationPermission,
    requestNotificationPermission,
    subscribeToPushNotifications,
    unsubscribeFromPushNotifications,
    isSubscribedToPush,
};

export default pushNotificationService;
