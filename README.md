# Garaad Frontend

Garaad is an educational platform focused on providing STEM education in Somali language. This is the frontend repository built with Next.js.

## Features

- Modern and responsive UI
- Multi-language support (Somali, English, Arabic)
- Interactive learning paths
- Course management system
- User dashboard
- Progress tracking
- **International Card Payment Integration** - Support for Visa, Mastercard, American Express, and Discover cards
- **Local Mobile Wallet Payments** - WaafiPay integration for local payments

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Shadcn UI
- React Query
- Zustand

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

## Contributing

Please read our contributing guidelines before submitting pull requests.

## License

This project is licensed under the MIT License.

## Payment Integration

### WaafiPay Integration

The application supports both local mobile wallet payments and international card payments through WaafiPay. To configure WaafiPay, add the following environment variables to your `.env.local` file:

```bash
# WaafiPay Configuration (Server-side)
WAAFI_API_KEY=API-Vzyqi4xh6IpUEq8EZpKxcf0Du # Your WaafiPay API key
WAAFI_API_USER_ID=1008162 # Your WaafiPay API User ID (default: 1008162)
WAAFI_MERCHANT_UID=M0913943 # Your WaafiPay Merchant UID (default: M0913943)
WAAFI_STORE_ID=STORE001 # Your WaafiPay Store ID (required for card payments)
WAAFI_HPP_KEY=HPP-KEY-001 # Your WaafiPay HPP Key (required for card payments)
WAAFI_TEST_MODE=true # Set to false for production

# Subscription Pricing (Client-side)
NEXT_PUBLIC_SUBSCRIPTION_MONTHLY_PRICE=10
NEXT_PUBLIC_SUBSCRIPTION_ANNUAL_PRICE=100
```

**Important Note**: The WaafiPay credentials are configured with default values:
- `apiUserId`: `1008162`
- `merchantUid`: `M0913943` 
- `apiKey`: `API-Vzyqi4xh6IpUEq8EZpKxcf0Du`
- `storeId`: `1008162` (✅ **Correct value provided**)
- `hppKey`: `HPP-KEY-001` (⚠️ **Replace with your actual HPP Key**)

These values should resolve both the "missing apiUserId parameter" and "missing apiKey parameter" errors. You can override them by setting the corresponding environment variables.

**For Card Payments**: You need to get your actual `hppKey` from your WaafiPay merchant dashboard. The `storeId` is already set to the correct value (`1008162`).

### Configuration Setup

1. Copy the `waafipay-config-template.env` file to `.env.local`
2. Replace the placeholder values with your actual WaafiPay credentials
3. Ensure the `WAAFI_API_USER_ID` is set to `1008162` or your specific API User ID

### Supported Payment Methods

1. **Local Mobile Wallets** (WaafiPay)
   - WaafiPay mobile wallet accounts
   - Local phone number format (2526xxxxxxx)

2. **International Cards**
   - Visa
   - Mastercard
   - American Express
   - Discover

### Payment Security

- All card data is validated using industry-standard algorithms (Luhn algorithm for card numbers)
- Card information is processed securely through WaafiPay's PCI DSS compliant API
- No sensitive card data is stored on the application servers
- All transactions are encrypted and processed over HTTPS

### Testing

For testing, you can use the sandbox environment which allows you to simulate payments without actual transactions. You can obtain these credentials by:
1. Registering as a merchant on WaafiPay
2. Creating a store in your merchant dashboard
3. Generating API credentials for your store

### Test Card Numbers

For testing international card payments, you can use these test card numbers:
- Visa: 4111 1111 1111 1111
- Mastercard: 5555 5555 5555 4444
- American Express: 3782 822463 10005
- Discover: 6011 1111 1111 1117
