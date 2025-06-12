# Garaad Frontend

Garaad is an educational platform focused on providing STEM education in Somali language. This is the frontend repository built with Next.js.

## Features

- Modern and responsive UI
- Multi-language support (Somali, English, Arabic)
- Interactive learning paths
- Course management system
- User dashboard
- Progress tracking

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

## WaafiPay Integration

For local payments, the application uses WaafiPay. To configure WaafiPay, add the following environment variables to your `.env` file:

```bash
# WaafiPay Configuration
NEXT_PUBLIC_WAAFIPAY_API_KEY=API-669892958AHX # Your WaafiPay API key
NEXT_PUBLIC_WAAFIPAY_STORE_ID=1000312 # Your WaafiPay Store ID
NEXT_PUBLIC_WAAFIPAY_MERCHANT_UID=M0912255 # Your WaafiPay Merchant UID
NEXT_PUBLIC_WAAFIPAY_ENVIRONMENT=sandbox # or production
```

You can obtain these credentials by:
1. Registering as a merchant on WaafiPay
2. Creating a store in your merchant dashboard
3. Generating API credentials for your store

For testing, you can use the sandbox environment which allows you to simulate payments without actual transactions.
