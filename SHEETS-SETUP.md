# Kodera – Google Sheets CMS

A reusable Next.js template using Google Sheets as a CMS.

## 1. Install dependencies

npm install

## 2. Create a Google Spreadsheet

Create a spreadsheet with a tab named `Produkter`.

Required columns:

id | name | slug | description | price | image | tilgjengelig

- `id`: Unique positive integer
- `name`: Product name
- `slug`: Unique URL-friendly identifier
- `description`: Product description
- `price`: Price in NOK
- `image`: Path to an image in /public/images
- `tilgjengelig`: TRUE or FALSE

## 3. Google Cloud setup

1. Enable Google Sheets API.
2. Create a service account.
3. Give it read-only access to the spreadsheet.
4. Configure server-side authentication.

Use a separate service account and spreadsheet for each client.

## 4. Environment variables

Copy `.env.example` to `.env.local`.

Fill in the Google Sheets credentials and spreadsheet ID.

Never commit private keys or `.env.local`.

## 5. Start the project

npm run dev

## 6. Test Google Sheets

Open:

http://localhost:3000/api/sheets?type=produkter

Then visit:

http://localhost:3000/products

Update a product in Google Sheets and verify that the
website reflects the change after cache revalidation.

## 7. Stripe (optional)

Stripe is disabled until its credentials are configured.

Configure SITE_URL, STRIPE_SECRET_KEY and
STRIPE_WEBHOOK_SECRET for stores accepting payments.

Test payments and webhooks before production deployment.

## 8. Production checklist

- Configure environment variables in Vercel
- Validate spreadsheet data
- Confirm service account permissions
- Test product and cart functionality
- Verify checkout and webhook if Stripe is enabled
- Run npm audit
- Run npm run build
- Test live site performance
