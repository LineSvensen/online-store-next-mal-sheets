## Enkel Next.js nettbutikkmal med Stripe Checkout og Zustand handlekurv.

- Produkter administreres direkte i JSON
- Ingen database eller permanent lagring av ordre (men ordre blir lagret i Stripe)
- Ingen kundekontoer eller innlogging
- Stripe Checkout + webhook
- Bruk egne Stripe-nøkler via .env.local

## Analytics & Cookie Consent

This template is prepared for Google Analytics and cookie consent.

Before enabling analytics:

1. Create a Google Analytics property for the store.
2. Add the GA Measurement ID to `.env.local`.
3. Configure a consent management platform such as Silktide.
4. Ensure analytics only runs after the user has given consent.

### Required environment variables:

- STRIPE_SECRET_KEY=
- STRIPE_WEBHOOK_SECRET=
- NEXT_PUBLIC_GA_ID= (for google analytics)

##

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
