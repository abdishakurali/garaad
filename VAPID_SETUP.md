# Web Push Notifications - Environment Variables Template
# Copy this to .env.local and fill in your VAPID keys

# ============================================
# VAPID Keys for Web Push Notifications
# ============================================
# Generate these keys using one of the following methods:
#
# Method 1: Using web-push CLI (Recommended)
# npx web-push generate-vapid-keys
#
# Method 2: Using Python (if you have pywebpush installed)
# python -c "from pywebpush import webpush; import ecdsa; from base64 import urlsafe_b64encode; private_key = ecdsa.SigningKey.generate(curve=ecdsa.NIST256p); public_key = private_key.get_verifying_key(); print('Public Key:', urlsafe_b64encode(public_key.to_string()).decode()); print('Private Key:', urlsafe_b64encode(private_key.to_string()).decode())"
#
# IMPORTANT: Keep the private key secure and never commit it to version control!

# Frontend - Public VAPID Key (safe to expose in client-side code)
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your_vapid_public_key_here

# Backend - Add these to your Django settings or .env file
# VAPID_PUBLIC_KEY=your_vapid_public_key_here
# VAPID_PRIVATE_KEY=your_vapid_private_key_here
# VAPID_ADMIN_EMAIL=admin@garaad.org
