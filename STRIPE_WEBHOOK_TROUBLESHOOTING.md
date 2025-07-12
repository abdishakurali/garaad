# Stripe Webhook Troubleshooting Guide

## Issue Summary
Stripe is reporting that your webhook endpoint at `https://garaad.org/api/stripe/webhook` is not returning proper HTTP status codes (200-299).

## ✅ Fixed Issues

### 1. Enhanced Webhook Handler
- ✅ Added comprehensive error handling
- ✅ Added detailed logging for debugging
- ✅ Ensured proper HTTP status codes (200, 400, 500)
- ✅ Added GET endpoint for testing accessibility

### 2. Environment Configuration
Make sure these environment variables are set in your production environment:

```env
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

## 🔍 Troubleshooting Steps

### Step 1: Test Webhook Endpoint Accessibility
Visit: `https://garaad.org/api/stripe/webhook`

Expected response:
```json
{
  "status": "Webhook endpoint is accessible",
  "timestamp": "2025-01-XX...",
  "environment": "production"
}
```

### Step 2: Check Environment Variables
Verify these are set in your production environment:
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

### Step 3: Verify Stripe Webhook Configuration
1. Go to Stripe Dashboard → Webhooks
2. Check the endpoint URL: `https://garaad.org/api/stripe/webhook`
3. Verify the webhook secret matches your `STRIPE_WEBHOOK_SECRET`
4. Check which events are being sent

### Step 4: Monitor Logs
Check your application logs for webhook events:
- Look for "🔔 Stripe webhook received" messages
- Check for any error messages with ❌ emoji
- Verify signature verification is working

## 🚨 Common Issues & Solutions

### Issue 1: Webhook Not Accessible
**Symptoms**: 404 or connection timeout
**Solution**: 
- Verify your domain is properly configured
- Check if the API route is deployed correctly
- Test with the GET endpoint first

### Issue 2: Invalid Signature
**Symptoms**: "Invalid signature" errors
**Solution**:
- Verify `STRIPE_WEBHOOK_SECRET` is correct
- Check if the secret matches in Stripe Dashboard
- Ensure no extra spaces or characters

### Issue 3: Environment Variables Missing
**Symptoms**: "Stripe not configured" errors
**Solution**:
- Verify all Stripe environment variables are set
- Check production environment configuration
- Restart the application after setting variables

### Issue 4: Timeout Issues
**Symptoms**: Webhook processing takes too long
**Solution**:
- Optimize webhook processing logic
- Move heavy operations to background jobs
- Ensure webhook returns quickly (under 10 seconds)

## 📋 Checklist

- [ ] Webhook endpoint is accessible (GET request works)
- [ ] All environment variables are set
- [ ] Stripe webhook secret matches dashboard
- [ ] Webhook events are configured in Stripe
- [ ] Application logs show webhook activity
- [ ] No timeout or connection issues

## 🔧 Next Steps

1. **Test the endpoint**: Visit `https://garaad.org/api/stripe/webhook`
2. **Check logs**: Monitor application logs for webhook activity
3. **Verify Stripe config**: Ensure webhook settings match your environment
4. **Test with Stripe CLI**: Use Stripe CLI to test webhooks locally

## 📞 Support

If issues persist:
1. Check application logs for specific error messages
2. Verify all environment variables are correctly set
3. Test webhook with Stripe CLI
4. Contact hosting provider if domain/SSL issues

## 🛠️ Stripe CLI Testing

Install Stripe CLI and test locally:
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

This will help verify webhook processing works correctly. 